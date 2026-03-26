# TaskUp API — Documentação Completa

> Extraído via Playwright + validado via Supabase SDK — 2026-03-26

## Arquitectura

| Componente | Tecnologia |
|---|---|
| Frontend | Next.js (Vercel) |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Auth | Supabase Auth (email/password → JWT) |
| Project ref | `lgvgrtqcienrqubnxaqs` |
| App URL | `https://taskup-md.vercel.app` |
| API Base | `https://lgvgrtqcienrqubnxaqs.supabase.co` |

---

## Database Schema

### `users`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | = auth.users.id |
| `nome` | text | Nome completo |
| `email` | text | |
| `papel` | text | "admin", "gestor", "membro" |
| `whatsapp_numero` | text | Formato: 244XXXXXXXXX |
| `avatar_url` | text | URL do avatar no Storage |
| `activo` | boolean | |
| `onboarding_concluido` | boolean | |
| `onboarding_concluido_em` | timestamptz | |
| `criado_em` | timestamptz | |
| `actualizado_em` | timestamptz | |

### `tarefas`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `titulo` | text | |
| `descricao` | text | nullable |
| `estado` | text | "pendente", "em_progresso", "concluida", "cancelada" |
| `prioridade` | text | "baixa", "media", "alta", "urgente" |
| `prazo` | date | nullable |
| `projecto_id` | uuid (FK) | → projectos.id |
| `responsavel_id` | uuid (FK) | → users.id |
| `criado_por` | uuid (FK) | → users.id |
| `motivo_cancelamento` | text | nullable |
| `posicao` | int | Ordem no kanban |
| `search_vector` | tsvector | Full-text search |
| `criado_em` | timestamptz | |
| `actualizado_em` | timestamptz | |

### `projectos`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `nome` | text | |
| `descricao` | text | nullable |
| `estado` | text | "activo", "concluido", "arquivado" |
| `prazo` | date | nullable |
| `criado_por` | uuid (FK) | → users.id |
| `search_vector` | tsvector | Full-text search |
| `criado_em` | timestamptz | |
| `actualizado_em` | timestamptz | |

### `reunioes`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `titulo` | text | |
| `data_reuniao` | timestamptz | Data/hora da reunião |
| `duracao_minutos` | int | |
| `presentes` | uuid[] | Array de user IDs |
| `transcricao` | text | Transcrição da reunião |
| `acta` | text | Acta gerada |
| `notas` | text | |
| `estado` | text | |
| `aprovada_por` | uuid | |
| `aprovada_em` | timestamptz | |
| `fibery_synced` | boolean | Sync com Fibery |
| `fibery_doc_id` | text | |
| `criado_por` | uuid (FK) | |
| `criado_em` | timestamptz | |
| `actualizado_em` | timestamptz | |

### `notificacoes`
| Coluna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `user_id` | uuid (FK) | → users.id |
| `tipo` | text | "tarefa_criada", "tarefa_atribuida", etc |
| `titulo` | text | |
| `mensagem` | text | |
| `tarefa_id` | uuid (FK) | → tarefas.id (nullable) |
| `lida` | boolean | |
| `canal` | text | Canal de entrega |
| `criado_em` | timestamptz | |

---

## Auth

### Login
```http
POST /auth/v1/token?grant_type=password
Host: lgvgrtqcienrqubnxaqs.supabase.co
apikey: <SUPABASE_ANON_KEY>
Content-Type: application/json

{ "email": "...", "password": "..." }
```
Returns: `{ access_token, refresh_token, user, ... }`

### Refresh Token
```http
POST /auth/v1/token?grant_type=refresh_token
Body: { "refresh_token": "..." }
```

### Get Authenticated User
```http
GET /auth/v1/user
Authorization: Bearer <access_token>
```

---

## REST API (PostgREST)

Base: `https://lgvgrtqcienrqubnxaqs.supabase.co/rest/v1`

**Headers obrigatórios:**
```
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <access_token>
```

### Operações CRUD
```
GET    /rest/v1/{table}?select=*
GET    /rest/v1/{table}?id=eq.{uuid}
POST   /rest/v1/{table}                (body JSON, Prefer: return=representation)
PATCH  /rest/v1/{table}?id=eq.{uuid}   (body updates)
DELETE /rest/v1/{table}?id=eq.{uuid}
```

### Filtros PostgREST
`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `in`, `is`, `not`, `or`, `and`, `order`, `limit`, `offset`

---

## Storage

Avatars: `GET /storage/v1/object/public/avatars/{path}`

---

## SDK Client

Ficheiro: `src/api/client.ts`

```typescript
import { getClient } from "./src/api/client";

const client = await getClient(); // auto-login via .env

// Tarefas
const tarefas = await client.listTarefas({ estado: "pendente", limit: 10 });
const nova = await client.createTarefa({ titulo: "Nova tarefa", prioridade: "alta" });
await client.updateTarefa(id, { estado: "concluida" });

// Projectos
const projectos = await client.listProjectos();
await client.createProjecto({ nome: "Novo Projecto" });

// Reuniões
const reunioes = await client.listReunioes({ upcoming: true });

// Users
const users = await client.listUsers({ papel: "admin", activo: true });

// Notificações
const unread = await client.listNotificacoes({ lida: false });
await client.markAllNotificacoesRead();

// Raw Supabase access
const sb = client.getSupabaseClient();
```

---

## Dados (snapshot 2026-03-26)

- **6 users** — 2 admin, 1 gestor, 3 membros
- **10+ tarefas** — estados: pendente, em_progresso, concluida
- **10 projectos** — maioria POPs Marca Digital
- **3 notificações**
- **1 reunião** — com integração Fibery
