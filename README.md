# 🚀 TaskUp CLI & API Client

API client + CLI para [TaskUp MD](https://taskup-md.vercel.app/) — Automação dinâmica via Supabase direto.

## 📦 Instalação

```bash
npm install @belmirongola/taskup-cli
```

## 🎯 Uso: CLI

### 1️⃣ Autenticação

```bash
# Login (interativo ou com credenciais)
taskup login
taskup login --email user@marca.pt --password xxx

# Ver utilizador
taskup whoami

# Logout
taskup logout
```

Credenciais são armazenadas em `~/.taskup-cli/config.json`

### 2️⃣ Tarefas

```bash
# Listar tarefas
taskup tarefas list
taskup tarefas list --estado "Em Progresso" --limit 20
taskup tarefas list --prioridade "Alta" --format json

# Criar tarefa
taskup tarefas create --titulo "Novo bug" --prioridade "Alta" --prazo 2026-04-01

# Ver tarefa
taskup tarefas get <id>

# Actualizar tarefa
taskup tarefas update <id> --estado "Concluído"

# Deletar tarefa
taskup tarefas delete <id>
```

### 3️⃣ Projectos

```bash
# Listar projectos
taskup projectos list
taskup projectos list --estado "Activo"

# Criar projecto
taskup projectos create --nome "Novo Projecto" --estado "Activo"

# Ver projecto
taskup projectos get <id>

# Actualizar projecto
taskup projectos update <id> --estado "Concluído"

# Deletar projecto
taskup projectos delete <id>
```

## 💻 Uso: Como Biblioteca

```typescript
import { TaskUpClient } from "@belmirongola/taskup-cli";

const client = new TaskUpClient();
await client.login("user@marca.pt", "password");

// Listar tarefas
const tarefas = await client.listTarefas({
  estado: "Em Progresso",
  prioridade: "Alta",
  limit: 20,
});

// Criar tarefa
const tarefa = await client.createTarefa({
  titulo: "Minha Tarefa",
  descricao: "Descrição",
  prioridade: "Média",
  prazo: "2026-04-01",
});

// Actualizar
await client.updateTarefa(tarefa.id, { estado: "Concluído" });

// Deletar
await client.deleteTarefa(tarefa.id);

// Projectos
const projectos = await client.listProjectos();
const projecto = await client.createProjecto({
  nome: "Novo Projecto",
  descricao: "Descrição",
});

// Reuniões
const reunioes = await client.listReunioes();

// Users
const users = await client.listUsers();

// Notificações
const notificacoes = await client.listNotificacoes();
```

## ⚙️ Configuração

Criar `.env` na raiz:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Opcional: credenciais padrão
TASKUP_EMAIL=user@marca.pt
TASKUP_PASSWORD=password
```

## 📋 API Métodos

### Tarefas

- `listTarefas(filters?)` — Listar com filtros
- `getTarefa(id)` — Obter uma tarefa
- `createTarefa(data)` — Criar nova
- `updateTarefa(id, updates)` — Actualizar
- `deleteTarefa(id)` — Deletar

### Projectos

- `listProjectos(filters?)` — Listar
- `getProjecto(id)` — Obter um
- `createProjecto(data)` — Criar novo
- `updateProjecto(id, updates)` — Actualizar
- `deleteProjecto(id)` — Deletar

### Reuniões

- `listReunioes(filters?)` — Listar
- `getReuniao(id)` — Obter uma
- `createReuniao(data)` — Criar nova
- `updateReuniao(id, updates)` — Actualizar
- `deleteReuniao(id)` — Deletar

### Users

- `listUsers(filters?)` — Listar utilizadores
- `getUserProfile(userId)` — Obter perfil
- `updateUser(userId, updates)` — Actualizar

### Notificações

- `listNotificacoes(filters?)` — Listar
- `markNotificacaoRead(id)` — Marcar como lida
- `markAllNotificacoesRead()` — Marcar todas

## 🔐 Privacidade (GitHub Packages)

Para publicar privadamente no GitHub:

1. Editar `~/.npmrc`:
   ```
   @belmirongola:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

2. GitHub token com permissão `write:packages` e `read:packages`

3. Publicar:
   ```bash
   npm publish
   ```

## 📝 Desenvolvimento

```bash
# Build
npm run build

# Dev mode
npm run dev

# Compilação TypeScript
npm run build
```

## 📄 Tipos

Tipos completos exportados:

```typescript
import type {
  Credentials,
  Priority,
  TaskStatus,
  ProjectStatus,
  CreateTaskInput,
  TaskInfo,
  ProjectInfo,
  DashboardStats,
} from "@belmirongola/taskup-cli";
```

---

**Developed by @belmirongola** — TaskUp MD Automation CLI
