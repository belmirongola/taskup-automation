# 🚀 TaskUp API Worker

Cloudflare Worker que encapsula a API do Supabase, permitindo que o CLI TaskUp comunique sem expor credenciais.

## Arquitetura

```
CLI TaskUp
    ↓
    ↓ (HTTP API calls)
    ↓
Cloudflare Worker (taskup-api)
    ↓
    ↓ (Supabase calls com credenciais admin)
    ↓
Supabase
```

## Rotas

### Autenticação
- `POST /auth/login` - Login com email/password
  ```json
  {
    "email": "user@email.com",
    "password": "password"
  }
  ```

### Tarefas
- `GET /tarefas` - Listar tarefas (filters: `estado`, `prioridade`, `limit`)
- `GET /tarefas/:id` - Obter tarefa específica
- `POST /tarefas` - Criar tarefa
- `PUT /tarefas/:id` - Atualizar tarefa
- `DELETE /tarefas/:id` - Deletar tarefa

### Projectos
- `GET /projectos` - Listar projectos (filters: `estado`, `limit`)
- `GET /projectos/:id` - Obter projecto específico
- `POST /projectos` - Criar projecto
- `PUT /projectos/:id` - Atualizar projecto
- `DELETE /projectos/:id` - Deletar projecto

### Health
- `GET /health` - Health check

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
# Editar .env.local com credenciais Supabase
```

### 3. Deploy local

```bash
npm run dev
```

Acessa: `http://localhost:8787`

### 4. Deploy para Cloudflare

```bash
npm run deploy
```

## Segurança

- ✅ Credenciais Supabase guardadas **apenas no servidor**
- ✅ CLI não acessa Supabase directamente
- ✅ CORS habilitado (pode ser restringido)
- ✅ Supabase Service Key (admin) protegida no worker

## Atualizar CLI

Após deploy do worker, actualizar o CLI para usar:

```bash
taskup login --api https://api.taskup.marcadigital.ao
```

---

**Versão:** 1.0.0
**Framework:** Cloudflare Workers + TypeScript
