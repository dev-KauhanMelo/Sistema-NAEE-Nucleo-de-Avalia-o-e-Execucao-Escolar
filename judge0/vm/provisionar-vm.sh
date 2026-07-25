#!/usr/bin/env bash
# Cria e configura a VM Ubuntu dedicada ao Judge0 via Multipass, isolando a
# mudança de cgroup v1 (necessária pro `isolate` funcionar) dentro da VM —
# o host (seu notebook) fica intocado.
#
# Pré-requisito manual (uma vez só, exige senha de sudo interativa que este
# script não tem como fornecer):
#   sudo snap install multipass
set -euo pipefail

NOME_VM="judge0-vm"
# "release:24.04" (com o prefixo do remote) em vez de só "24.04" — em alguns
# ambientes o alias sem remote explícito falha com "Remote "" is unknown"
# por causa de um problema de resolução do remote padrão no multipassd.
IMAGEM="release:24.04"
CPUS=2
MEMORIA=2G
DISCO=16G
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # .../judge0

vermelho() { printf '\033[31m%s\033[0m\n' "$1"; }
verde()    { printf '\033[32m%s\033[0m\n' "$1"; }
amarelo()  { printf '\033[33m%s\033[0m\n' "$1"; }

if ! command -v multipass >/dev/null 2>&1; then
  vermelho "multipass não encontrado."
  echo "Rode primeiro, no seu terminal (pede senha de sudo): sudo snap install multipass"
  exit 1
fi

if multipass info "$NOME_VM" >/dev/null 2>&1; then
  amarelo "VM '$NOME_VM' já existe — pulando criação."
else
  echo "Criando VM '$NOME_VM' (${CPUS} vCPU, ${MEMORIA} RAM, ${DISCO} disco)..."
  multipass launch "$IMAGEM" --name "$NOME_VM" --cpus "$CPUS" --memory "$MEMORIA" --disk "$DISCO"
fi

echo "Instalando docker + jq dentro da VM (se ainda não tiver)..."
multipass exec "$NOME_VM" -- bash -c '
  set -e
  if ! command -v docker >/dev/null 2>&1; then
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker ubuntu
  fi
  if ! command -v jq >/dev/null 2>&1; then
    sudo apt-get update -qq
    sudo apt-get install -y -qq jq
  fi
'

echo "Aplicando cgroup v1 (hybrid) dentro da VM..."
# As imagens cloud da Ubuntu têm um drop-in (/etc/default/grub.d/50-cloudimg-settings.cfg)
# que é lido DEPOIS de /etc/default/grub e sobrescreve GRUB_CMDLINE_LINUX_DEFAULT por
# inteiro — por isso a flag precisa entrar nos dois arquivos, não só no principal.
precisou_reboot="$(multipass exec "$NOME_VM" -- bash -c '
  set -e
  flag="systemd.unified_cgroup_hierarchy=0"
  mudou=0
  for arquivo in /etc/default/grub /etc/default/grub.d/50-cloudimg-settings.cfg; do
    if [ -f "$arquivo" ] && ! grep -q "GRUB_CMDLINE_LINUX_DEFAULT=.*$flag" "$arquivo"; then
      sudo sed -E -i "s/^(GRUB_CMDLINE_LINUX_DEFAULT=\")([^\"]*)\"/\1\2 ${flag}\"/" "$arquivo"
      mudou=1
    fi
  done
  if [ "$mudou" = "1" ]; then
    sudo update-grub >/dev/null
  fi
  echo "$mudou"
')"

if [ "$precisou_reboot" = "1" ]; then
  echo "Reiniciando a VM pra aplicar a mudança de cgroup..."
  multipass restart "$NOME_VM"
  sleep 5
else
  amarelo "Flag de cgroup já estava aplicada em todos os arquivos relevantes."
fi

echo "Conferindo cgroup ativo na VM (com algumas tentativas, a VM pode levar um instante pra aceitar conexões após reiniciar)..."
cgroup_ok=""
for _ in $(seq 1 10); do
  if multipass exec "$NOME_VM" -- mount 2>/dev/null | grep -q "cgroup on /sys/fs/cgroup/memory"; then
    cgroup_ok=1
    break
  fi
  sleep 3
done
if [ -z "$cgroup_ok" ]; then
  vermelho "Não detectei cgroup v1/hybrid ativo (controllers legados não montados). Veja judge0/README.md."
  exit 1
fi
verde "cgroup hybrid/v1 ativo na VM (controllers legados montados)."

echo "Montando $DIR dentro da VM em ~/judge0..."
if ! multipass info "$NOME_VM" | grep -q "/home/ubuntu/judge0"; then
  multipass mount "$DIR" "$NOME_VM":/home/ubuntu/judge0
fi

ip="$(multipass info "$NOME_VM" --format json | jq -r ".info[\"$NOME_VM\"].ipv4[0]")"
echo
verde "VM pronta. IP: $ip"
echo "Judge0 vai responder em http://$ip:2358 depois de subir os containers."
echo
echo "Próximo passo:"
echo "  multipass exec $NOME_VM -- bash -c 'cd judge0 && ./gerar-conf.sh && ./verificar-judge0.sh'"
