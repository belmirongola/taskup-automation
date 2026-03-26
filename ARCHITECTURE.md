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

## Stack Completa

```
┌──────────────────────────────────┐
│   CLI User / Programmatic Use    │
├──────────────────────────────────┤
│                                  │
│  ┌──────────────┐    ┌────────┐ │
│  │ CLI Commands │    │Library │ │
│  │  (yargs)     │    │(Import)│ │
│  └──────────────┘    └────────┘ │
│                                  │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐ │
│  │      TaskUpClient          │ │
│  │  (Supabase Direct Access)  │ │
│  └────────────────────────────┘ │
│                                  │
├──────────────────────────────────┤
│                                  │
│  ┌────────────────────────────┐ │
│  │       Supabase             │ │
│  │  (PostgreSQL + Realtime)   │ │
│  └────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
```

## Ficheiros Estrutura

```
src/
├── api/
│   └── client.ts               # [CORE] TaskUpClient — Supabase
├── types.ts                    # [CORE] Interfaces TypeScript
├── index.ts                    # [CORE] Library export
├── cli/
│   ├── index.ts               # [CLI] Entrada — yargs setup
│   └── handlers/
│       ├── auth.ts            # Auth commands (login, logout, whoami)
│       ├── tarefas.ts         # Tarefas commands (list, create, update, delete)
│       └── projectos.ts       # Projectos commands (list, create, update, delete)
└── utils/
    ├── config.ts              # Config file management (~/.taskup-cli/config.json)
    └── formatter.ts           # Output formatting (table, JSON, colors)
```

## Camadas de Dados

### Layer 1: TaskUpClient
- **Responsabilidade:** Interface direta com Supabase
- **Métodos:** `login`, `listTarefas`, `createTarefa`, `updateTarefa`, `deleteTarefa`, etc.
- **Uso:** Tanto CLI quanto programático

### Layer 2: CLI Handlers
- **Responsabilidade:** Processar argumentos, validar input, chamar client
- **Dependências:** TaskUpClient, formatter, config
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
