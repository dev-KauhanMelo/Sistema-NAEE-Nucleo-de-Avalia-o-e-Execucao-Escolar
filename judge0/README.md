# Judge0 (self-hosted)

Motor de execução isolado, conforme definido em `ARQUITETURA.md` — subido via
`docker-compose` oficial do projeto Judge0, sem orquestrador próprio.

## Pré-requisitos no host

1. **Docker com acesso sem sudo.** Seu usuário precisa estar no grupo `docker`:
   ```bash
   sudo usermod -aG docker $USER
   # depois faça logout/login (ou rode `newgrp docker` pra valer na sessão atual)
   ```
2. **Docker Compose v2** (comando `docker compose`, com espaço). Se você só tem
   o `docker-compose` v1 (legado, hífen), os scripts aqui funcionam com ele
   também, mas é recomendado migrar:
   ```bash
   sudo apt install docker-compose-plugin
   ```
3. **cgroup compatível com o `isolate`** — ver seção abaixo. Este é o único
   pré-requisito que não é uma questão de instalar um pacote.

## O problema de cgroup v2

O Judge0 usa o [`isolate`](https://github.com/ioi/isolate) como sandbox de
execução, e a versão empacotada na imagem `judge0/judge0:1.13.1` ainda espera
**cgroup v1 (ou hybrid)**. Distros modernas (Ubuntu 21.10+, e portanto Zorin OS
18 e a maioria dos kernels 6.x atuais) usam **cgroup v2 puro e unificado** por
padrão — é o que este notebook tem. Nessas condições, o `server`/`worker` sobe
normalmente, mas toda submissão falha na hora de executar o código, com um
erro relacionado a `isolate`/`cgroup`/`sandbox`. O `verificar-judge0.sh`
detecta esse padrão de erro e aponta de volta pra este documento.

Isso é rastreado publicamente e ainda sem solução oficial lançada (issues
[#543](https://github.com/judge0/judge0/issues/543),
[#599](https://github.com/judge0/judge0/issues/599) no repositório do Judge0).

**Caminho escolhido: VM Linux dedicada** (Multipass), configurada com
`systemd.unified_cgroup_hierarchy=0` **dentro da VM**, sem tocar no host. O
notebook (Zorin) fica intocado, e como a futura VPS de produção também vai
ser uma VM Linux, isso já serve de ensaio pra esse ambiente. Trade-off: mais
um componente rodando durante o desenvolvimento — a VM precisa estar de pé
quando você for testar submissão de código, e pode ser parada
(`multipass stop judge0-vm`) quando não estiver testando, pra liberar RAM.

Alternativa descartada por ora, documentada aqui só como referência: editar
o GRUB do próprio host com a mesma flag. É mais direto (Judge0 roda nativo,
sem VM no meio), mas muda o boot da máquina principal, vale pra todo o
sistema (não só pro Judge0), e fica assim até reverter manualmente
(mesmo processo + reboot).

## Rodando (VM)

Pré-requisito manual, uma vez só (pede senha de sudo interativa):
```bash
sudo snap install multipass
```

Depois disso, tudo é automatizado:
```bash
cd judge0/vm
./provisionar-vm.sh    # cria a VM, instala docker, aplica cgroup v1, monta judge0/
```

O script mostra o IP da VM ao final. Com a VM pronta, gere a config e rode o
smoke test **dentro dela** (o `judge0/` do host está montado em `~/judge0`):
```bash
multipass exec judge0-vm -- bash -c 'cd judge0 && ./gerar-conf.sh && ./verificar-judge0.sh'
```

Se a saída final for "Submissão de teste passou (Accepted)", o motor de
execução está funcionando de ponta a ponta. O Judge0 fica acessível em
`http://<ip-da-vm>:2358` — é esse endereço que o backend (Fase 2) vai usar
como `JUDGE0_API_URL`, não `localhost`.

## Comandos úteis

```bash
multipass exec judge0-vm -- docker compose -f judge0/docker-compose.yml logs -f server
multipass exec judge0-vm -- docker compose -f judge0/docker-compose.yml logs -f worker
multipass stop judge0-vm     # libera RAM/CPU do host quando não estiver testando
multipass start judge0-vm    # volta a subir a VM (docker reinicia sozinho)
multipass delete judge0-vm && multipass purge   # apaga tudo, recomeça do zero
```

## Arquivos

| Arquivo | O que é |
|---|---|
| `docker-compose.yml` | Compose oficial do Judge0, imagem fixada em `1.13.1` |
| `judge0.conf.example` | Template versionado, sem segredos reais |
| `judge0.conf` | Gerado por `gerar-conf.sh`, **git-ignorado** — nunca commitar |
| `gerar-conf.sh` | Gera `judge0.conf` com senhas aleatórias |
| `verificar-judge0.sh` | Sobe tudo e testa uma submissão Python real |
| `vm/provisionar-vm.sh` | Cria e configura a VM Multipass dedicada |
