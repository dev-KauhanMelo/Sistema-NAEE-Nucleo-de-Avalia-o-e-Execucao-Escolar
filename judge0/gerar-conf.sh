#!/usr/bin/env bash
# Gera judge0.conf (git-ignorado) a partir do template judge0.conf.example,
# preenchendo os placeholders de senha com valores aleatórios.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

if [ -f judge0.conf ]; then
  echo "judge0.conf já existe — apague manualmente antes de gerar um novo" >&2
  echo "(evita sobrescrever senhas de um banco/redis que já tenham dados)." >&2
  exit 1
fi

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl não encontrado — necessário para gerar senhas aleatórias." >&2
  exit 1
fi

redis_password="$(openssl rand -hex 24)"
postgres_password="$(openssl rand -hex 24)"
secret_key_base="$(openssl rand -hex 64)"

sed \
  -e "s/SUBSTITUA_SENHA_REDIS/${redis_password}/" \
  -e "s/SUBSTITUA_SENHA_POSTGRES/${postgres_password}/" \
  -e "s/SUBSTITUA_SECRET_KEY_BASE/${secret_key_base}/" \
  judge0.conf.example > judge0.conf

echo "judge0.conf gerado com senhas aleatórias (arquivo git-ignorado)."
