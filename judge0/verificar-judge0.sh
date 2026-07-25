#!/usr/bin/env bash
# Sobe o Judge0 (se necessário) e roda uma submissão Python real de ponta a
# ponta, validando que o motor de execução está de fato funcionando —
# não só que os containers subiram.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

vermelho() { printf '\033[31m%s\033[0m\n' "$1"; }
verde()    { printf '\033[32m%s\033[0m\n' "$1"; }
amarelo()  { printf '\033[33m%s\033[0m\n' "$1"; }

# --- 1. localizar comando docker compose (v2 plugin ou v1 standalone) ---
if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  amarelo "Usando 'docker-compose' v1 (legado/sem suporte). Recomendado instalar o plugin oficial:"
  amarelo "  sudo apt install docker-compose-plugin"
  COMPOSE=(docker-compose)
else
  vermelho "Nem 'docker compose' (v2) nem 'docker-compose' (v1) foram encontrados no PATH."
  exit 1
fi

# --- 2. checar acesso ao daemon docker ---
if ! docker info >/dev/null 2>&1; then
  vermelho "Não consigo falar com o daemon do Docker."
  echo "Se o erro acima for 'permission denied', seu usuário não está no grupo 'docker':"
  echo "  sudo usermod -aG docker \$USER"
  echo "  (depois faça logout/login — ou rode 'newgrp docker' pra valer na sessão atual)"
  exit 1
fi

# --- 3. garantir judge0.conf (nunca versionado) ---
if [ ! -f judge0.conf ]; then
  amarelo "judge0.conf não existe — gerando com ./gerar-conf.sh"
  ./gerar-conf.sh
fi

# --- 4. subir os containers ---
echo "Subindo Judge0 (${COMPOSE[*]} up -d)..."
"${COMPOSE[@]}" up -d --quiet-pull

# --- 5. esperar o server responder ---
printf "Esperando o server responder em http://localhost:2358 "
ok=""
for _ in $(seq 1 60); do
  if curl -sf -o /dev/null http://localhost:2358/system_info; then
    ok=1
    break
  fi
  printf "."
  sleep 2
done
echo
if [ -z "$ok" ]; then
  vermelho "Server não respondeu em ~2 minutos."
  echo "Investigue com: ${COMPOSE[*]} logs server   e   ${COMPOSE[*]} logs worker"
  exit 1
fi
verde "Server no ar."

# --- 6. achar o language_id do Python 3 dinamicamente ---
# (não fixamos um id porque ele varia entre imagens/versões do Judge0;
#  '[(]' é usado no lugar de '\(' porque jq trata '\(' como interpolação de
#  string, não como escape de regex — isso evita casar errado ou dar erro)
python_id="$(curl -sf http://localhost:2358/languages \
  | jq '[.[] | select(.name | test("Python [(]3"))][0].id')"

if [ -z "$python_id" ] || [ "$python_id" = "null" ]; then
  vermelho "Não encontrei nenhuma linguagem 'Python (3...' em /languages."
  echo "Veja a lista completa com: curl http://localhost:2358/languages | jq"
  exit 1
fi
echo "Usando language_id=$python_id para Python 3."

# --- 7. submissão de teste ---
codigo_b64="$(printf 'print("ola mundo")\n' | base64 -w0)"
esperado_b64="$(printf 'ola mundo\n' | base64 -w0)"

corpo="$(jq -n \
  --arg src "$codigo_b64" \
  --arg exp "$esperado_b64" \
  --argjson lang "$python_id" \
  '{source_code: $src, language_id: $lang, expected_output: $exp}')"

resposta="$(curl -s -X POST \
  "http://localhost:2358/submissions?base64_encoded=true&wait=true" \
  -H "Content-Type: application/json" \
  -d "$corpo")" || { vermelho "Falha de rede ao enviar a submissão de teste."; exit 1; }

if [ -z "$resposta" ] || ! echo "$resposta" | jq -e . >/dev/null 2>&1; then
  vermelho "Resposta do Judge0 não é um JSON válido (ou veio vazia):"
  echo "$resposta"
  exit 1
fi

descricao="$(echo "$resposta" | jq -r '.status.description // "desconhecido"')"

echo
echo "--- resposta do Judge0 ---"
echo "$resposta" | jq '{status: .status.description, stdout, stderr, compile_output, message, time, memory}'
echo "--------------------------"

if [ "$descricao" = "Accepted" ]; then
  verde "Submissão de teste passou (Accepted). O motor de execução está funcionando."
  exit 0
fi

vermelho "Submissão de teste NÃO passou (status: $descricao)."

if echo "$resposta" | grep -qiE "isolate|cgroup|sandbox"; then
  amarelo "Isso tem cara do problema conhecido de incompatibilidade com cgroup v2:"
  echo "  o Judge0 usa o sandbox 'isolate', que ainda depende de cgroup v1/hybrid."
  echo "  Kernels modernos com cgroup v2 puro e unificado (comum em distros"
  echo "  atuais) fazem o worker falhar exatamente desse jeito ao tentar"
  echo "  executar código. Veja judge0/README.md, seção 'cgroup v2'."
fi

exit 1
