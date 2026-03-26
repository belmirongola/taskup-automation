# 🏗️ Arquitetura: TaskUp CLI + API Client

## Paradigma Mudança

```
❌ ANTES (Playwright UI Automation)
┌─────────────────────┐
│  Playwright Tests   │
│  + UI Selectors     │
│  (Frágil, Lento)    │
├─────────────────────┤
│  Browser Automation │
│  (Clicks, Waits)    │
└─────────────────────┘

✅ DEPOIS (Direct API)
┌─────────────────────┐
│  CLI (yargs)        │
│  + Biblioteca       │
│  (Simples, Rápido)  │
├─────────────────────┤
│  TaskUpClient       │
│  (Supabase Direct)  │
└─────────────────────┘
```

## Stack Completa (Versão 1.1.0+)

### Arquitetura com Cloudflare Worker

```
┌───────────────────────────────────────────────────────────┐
│         TaskUp CLI (@belmirongola/taskup-cli)             │
├───────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐       │
│  │ CLI Commands     │         │ Library Import   │       │
│  │ (yargs)          │         │ (TaskUpClient)   │       │
│  └────────┬─────────┘         └────────┬─────────┘       │
│           │                            │                  │
│           └──────────────┬─────────────┘                  │
│                          │                                │
│              ┌───────────v───────────┐                   │
│              │ Client Factory        │                   │
│              │ (selecciona cliente)  │                   │
│              └───────────┬───────────┘                   │
│                          │                                │
│       ┌──────────────────┴──────────────────┐            │
│       │                                     │            │
│       v (if TASKUP_API_URL)    v (if SUPABASE_URL)      │
│                                                          │
│  ┌────────────────────┐         ┌──────────────────┐   │
│  │ TaskUpAPIClient    │         │ TaskUpClient     │   │
│  │ (Worker API)       │         │ (Supabase Direct)│   │
│  └─────────┬──────────┘         └────────┬─────────┘   │
│            │                            │                │
└────────────┼────────────────────────────┼────────────────┘
             │                            │
    ┌────────v────────┐        ┌─────────v────────┐
    │ Cloudflare      │        │ Supabase API     │
    │ Worker          │        │ (Direct)         │
    │ API Gateway     │        └──────────────────┘
    └────────┬────────┘
             │
    ┌────────v──────────────────┐
    │  Supabase Backend          │
    │  (PostgreSQL + Auth)       │
    └───────────────────────────┘
```

**Dual-mode support:**
- ✅ **Mode 1 (Recomendado):** Via Cloudflare Worker (credenciais protegidas)
- ✅ **Mode 2 (Dev local):** Directo a Supabase

## Ficheiros Estrutura

### CLI Package (raiz do repositório)

```
src/
├── api/
│   ├── client.ts               # [CORE] TaskUpClient — Supabase directo
│   └── client-api.ts           # [NEW] TaskUpAPIClient — Worker API
├── types.ts                    # [CORE] Interfaces TypeScript
├── index.ts                    # [CORE] Library export
├── cli/
│   ├── index.ts               # [CLI] Entrada — yargs setup
│   └── handlers/
│       ├── auth.ts            # Auth commands (login, logout, whoami)
│       ├── tarefas.ts         # Tarefas commands (list, create, update, delete)
│       ├── projectos.ts       # Projectos commands (list, create, update, delete)
│       └── config.ts          # Config command (supabase-url, supabase-key)
└── utils/
    ├── config.ts              # Config file management (~/.taskup-cli/)
    ├── client-factory.ts      # [NEW] Selecciona TaskUpClient vs TaskUpAPIClient
    └── formatter.ts           # Output formatting (table, JSON, colors)
```

### Worker Package (./worker)

```
worker/
├── src/
│   ├── index.ts               # [CORE] Cloudflare Worker entry point
│   ├── types.ts               # [CORE] Environment + interfaces
│   ├── db.ts                  # [CORE] Supabase SDK calls + queries
│   └── routes.ts              # [CORE] API endpoint handlers
├── dist/                       # Compiled JavaScript (dist/index.js)
├── wrangler.toml              # Cloudflare Workers config
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies: @supabase/supabase-js, etc.
└── .env.example               # Environment template
```

## Modos de Operação

### Mode 1: Via Cloudflare Worker (Recomendado para Produção)

```bash
export TASKUP_API_URL=https://taskup-api-prod.workers.dev
taskup login --email user@email.com
# Password: ****
# ✓ Autenticado

taskup tasks-list
# GET https://taskup-api-prod.workers.dev/tarefas
# ├─ Worker valida request
# ├─ Worker acede Supabase com credenciais admin
# └─ CLI exibe resultados
```

**Vantagens:**
- ✅ Credenciais Supabase protegidas (servidor)
- ✅ Sem necessidade de env vars no cliente
- ✅ Caching/throttling possível
- ✅ Escalável

---

### Mode 2: Directo a Supabase (Desenvolvimento Local)

```bash
export SUPABASE_URL=https://seu-project.supabase.co
export SUPABASE_ANON_KEY=eyJ...
taskup login --email user@email.com

# Ou configurar:
# taskup config set supabase-url https://...
# taskup config set supabase-key eyJ...

taskup tasks-list
# Ligação directa ao Supabase
```

**Vantagens:**
- ✅ Sem servidor externo
- ✅ Rápido para dev local
- ✅ Simples para debugging

---

## Camadas de Dados

### Layer 1: Clientes de API
- **TaskUpClient** - Supabase directo (antigo)
- **TaskUpAPIClient** - Worker API (novo)
- **ClientFactory** - Selecciona qual usar

### Layer 2: CLI Handlers
- **Responsabilidade:** Processar argumentos, validar input, chamar client
- **Dependências:** TaskUpClient ou TaskUpAPIClient, formatter, config
- **Padrão:** Cada handler = um domínio (auth, tarefas, projectos)

### Layer 3: CLI Framework (yargs)
- **Responsabilidade:** Parse de argumentos, routing, help/version
- **Bindings:** Cada comando → handler específico

## Exemplos: Fluxo de Dados

### CLI: `taskup tarefas list --estado "Em Progresso"`

```
CLI Input
    ↓
yargs parse
    ↓
handleListTarefas(options)
    ↓
TaskUpClient.listTarefas(filters)
    ↓
Supabase query
    ↓
formatTable(data)
    ↓
Console output (table)
```

### Biblioteca: `await client.listTarefas({...})`

```
import { TaskUpClient }
    ↓
new TaskUpClient()
    ↓
client.login()
    ↓
client.listTarefas(filters)
    ↓
Supabase query
    ↓
return data
```

## Exportos Públicos

### Como Biblioteca

```typescript
import { TaskUpClient, getClient } from "@belmirongola/taskup-cli";
import type { CreateTaskInput, TaskInfo } from "@belmirongola/taskup-cli";
```

### Como CLI

```bash
npm install -g @belmirongola/taskup-cli
taskup login
taskup tarefas list
```

## Decisões Arquiteturais

### ✅ Remover Playwright

**Razão:** UI automation é frágil, lento, overcomplicated para API disponível

**Benefícios:**
- 50x mais rápido (sem browser)
- Queries diretas à BD
- Simples para manutenção
- Zero dependência em UI

### ✅ Manter Supabase Client

**Razão:** É a fonte da verdade, funciona com ou sem UI

**Benefícios:**
- Reutilizável em CLI + programmatic
- Queries customizadas possíveis
- Auth nativo Supabase
- Tipo-safe

### ✅ Separar CLI em handlers

**Razão:** Escalabilidade, cada domínio isolado

**Benefícios:**
- Fácil adicionar novos comandos
- Testes isolados
- Clareza de responsabilidade

### ✅ GitHub Packages private

**Razão:** Acesso controlado, integrado com GitHub

**Benefícios:**
- Publish automático via Actions
- Acesso controlado a nível de organização
- Sem conta npm Pro necessária
- Simples CI/CD

## Fluxo de Desenvolvimento

```
1. Código TS → src/
2. Build → tsc → dist/
3. Teste → CLI ou library
4. Git push
5. GitHub Release → Actions → Publish
```

## Performance

| Métrica | Antes | Depois |
|---------|-------|--------|
| Download | 150MB+ | <1MB |
| Setup | ~2 min | ~30s |
| Listar tarefas | 5-10s | <500ms |
| Criar tarefa | 3-5s | <300ms |
| Resiliência | Frágil (UI) | Robusta (API) |

---

**Conclusão:** Transformação de UI automation → Direct API. Melhor performance, simplicidade, manutenibilidade.
