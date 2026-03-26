# 🚀 TaskUp Worker Deployment Guide

## Arquitetura

```
TaskUp CLI (sem credenciais Supabase)
    ↓
Cloudflare Worker (credenciais Supabase privadas)
    ↓
Supabase (dados e auth)
```

### Benefícios

✅ **Sem exposição de credenciais** - Supabase keys guardadas apenas no worker
✅ **CLI simplificado** - Sem configuração de Supabase
✅ **Segurança melhorada** - Validação centralizada no servidor
✅ **Escalabilidade** - Worker pode cachear, validar, throttle

---

## Setup do Worker

### 1. Instalar dependências

```bash
cd worker
npm install
```

### 2. Configurar variáveis

```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
SUPABASE_URL=https://seu-project.supabase.co
SUPABASE_ANON_KEY=seu-anon-key
SUPABASE_SERVICE_KEY=seu-service-role-key
```

**⚠️ IMPORTANTE:** Use `SUPABASE_SERVICE_KEY` (com acesso admin) no worker, não a chave anon.

### 3. Deploy local para testes

```bash
npm run dev
```

Acessa: `http://localhost:8787`

Testar:
```bash
curl http://localhost:8787/health
```

### 4. Deploy para Cloudflare

```bash
npm run deploy
```

O worker será publicado como `taskup-api-{enviroment}.workers.dev`

---

## Configuração do CLI

Após o worker estar publicado, actualizar o CLI para usar a API remota.

### Opção A: Variável de ambiente

```bash
export TASKUP_API_URL=https://taskup-api-prod.workers.dev
taskup login --email seu@email.com
```

### Opção B: Armazenar no config

```bash
# (Implementação futura: taskup config set api-url <url>)
```

---

## Rotas do Worker

### Autenticação

`POST /auth/login`
```bash
curl -X POST http://localhost:8787/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@email.com",
    "password": "password"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "email": "user@email.com"
    }
  },
  "status": 200
}
```

### Tarefas

#### Listar
```bash
curl http://localhost:8787/tarefas?estado=a_fazer&limit=10
```

#### Criar
```bash
curl -X POST http://localhost:8787/tarefas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Nova tarefa",
    "descricao": "Descrição",
    "prioridade": "alta"
  }'
```

#### Atualizar
```bash
curl -X PUT http://localhost:8787/tarefas/id-da-tarefa \
  -H "Content-Type: application/json" \
  -d '{ "estado": "em_progresso" }'
```

#### Deletar
```bash
curl -X DELETE http://localhost:8787/tarefas/id-da-tarefa
```

### Projectos

Mesmas rotas, substituir `/tarefas` por `/projectos`

### Health

```bash
curl http://localhost:8787/health
```

---

## Variáveis de Ambiente (Cloudflare)

Após deploy, configurar no painel Cloudflare:

1. Ir a: `https://dash.cloudflare.com/`
2. Seleccionar Workers
3. Seleccionar `taskup-api-prod`
4. Settings → Variables
5. Adicionar:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://seu-project.supabase.co` |
| `SUPABASE_ANON_KEY` | `seu-anon-key` |
| `SUPABASE_SERVICE_KEY` | `seu-service-role-key` |

**Ou via wrangler:**

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_KEY
```

---

## Próximos passos

1. ✅ Criar Worker
2. ✅ Deploy local
3. ⏳ Deploy para Cloudflare
4. ⏳ Actualizar CLI para usar Worker
5. ⏳ Documentar endpoints na CLI

---

**Desenvolvido por:** @belmirongola
**Versão:** 1.0.0
**Tecnologia:** Cloudflare Workers + TypeScript + Supabase
