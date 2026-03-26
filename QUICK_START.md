# 🚀 Quick Start — TaskUp CLI

## 1. Setup

```bash
npm install
npm run build
```

## 2. Login

```bash
# Interactivo (pede email/password)
node dist/src/cli/index.js login

# Ou com credenciais
node dist/src/cli/index.js login --email user@marca.pt --password xxx

# Ver quem está logado
node dist/src/cli/index.js whoami
```

## 3. Usar a CLI

### Listar Tarefas
```bash
node dist/src/cli/index.js tarefas list
node dist/src/cli/index.js tarefas list --estado "Em Progresso"
node dist/src/cli/index.js tarefas list --format json
```

### Criar Tarefa
```bash
node dist/src/cli/index.js tarefas create --titulo "Novo bug" --prioridade "Alta"
```

### Listar Projectos
```bash
node dist/src/cli/index.js projectos list
```

### Criar Projecto
```bash
node dist/src/cli/index.js projectos create --nome "Novo Projecto"
```

## 4. Usar como Biblioteca

```typescript
import { TaskUpClient } from "./dist/src/index.js";

const client = new TaskUpClient();
await client.login("user@marca.pt", "password");

// Listar tarefas
const tarefas = await client.listTarefas({ estado: "Em Progresso" });
console.log(tarefas);

// Criar tarefa
const tarefa = await client.createTarefa({ titulo: "Nova Task" });
console.log(tarefa);
```

## 5. Publicar no GitHub Packages

Vai acontecer automaticamente quando criar uma **Release** no GitHub:

1. Vai a **Releases** → **Create a new release**
2. Tag: `v1.0.0`
3. Descrição: "Initial release"
4. **Publish release**

→ GitHub Actions publica automaticamente! 🎉

## 📂 Estrutura Final

```
src/
├── api/client.ts          # ✅ Core API client (Supabase)
├── types.ts               # ✅ Tipos compartilhados
├── index.ts               # ✅ Exporta client para biblioteca
├── cli/
│   ├── index.ts          # ✅ Entrada principal CLI (yargs)
│   └── handlers/
│       ├── auth.ts       # ✅ Login/logout
│       ├── tarefas.ts    # ✅ CRUD tarefas
│       └── projectos.ts  # ✅ CRUD projectos
└── utils/
    ├── config.ts         # ✅ Gestão de credenciais
    └── formatter.ts      # ✅ Output (table, json, colors)
```

## 🗑️ O que foi deletado

- ❌ `auth.ts` (Playwright UI login)
- ❌ `tasks.ts` (Playwright UI CRUD)
- ❌ `projects.ts` (Playwright UI CRUD)
- ❌ `kanban.ts` (Playwright UI drag & drop)
- ❌ `calendar.ts` (Playwright UI calendar)
- ❌ `navigation.ts` (Playwright UI clicks)
- ❌ `search.ts` (Playwright UI search)
- ❌ `team.ts` (Playwright UI team)
- ❌ `tests/` (Playwright tests)
- ❌ `examples/` (Playwright examples)

## ✅ O que foi adicionado

- ✅ CLI com **yargs** — argumentos dinâmicos
- ✅ **Ora** — loading spinners
- ✅ **Chalk** — cores no terminal
- ✅ **Table** — output formatado
- ✅ **Inquirer** — prompts interactivos
- ✅ **GitHub Actions** — publish automático
- ✅ Suporte para **biblioteca + CLI** em simultâneo

## 🎯 Resultado

**Antes:** Suite Playwright (~150MB, frágil, lento)
**Depois:** CLI + Biblioteca (~1MB, robusto, rápido via API direta)

---

Pronto para usar! 🎉
