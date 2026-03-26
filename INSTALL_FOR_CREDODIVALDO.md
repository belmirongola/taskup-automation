# 📦 Instalação TaskUp CLI para Credodivaldo

## 1️⃣ Instalar o CLI

```bash
npm install -g github:belmirongola/taskup-automation
```

## 2️⃣ Configurar Credenciais Supabase

Peça ao @belmirongola as credenciais Supabase (URL e anon key) e execute:

```bash
# Substituir pelos valores reais
taskup config set supabase-url https://seu-url.supabase.co
taskup config set supabase-key sua-chave-anonima
```

Para verificar:
```bash
taskup config get
```

## 3️⃣ Autenticar

```bash
taskup login --email seu@email.com
# Digite a password quando solicitado
```

## 4️⃣ Usar

```bash
# Listar tarefas
taskup tasks-list

# Listar projectos
taskup projects-list

# Ver status
taskup whoami

# Filtros
taskup tasks-list --estado "a_fazer" --prioridade "alto"
taskup tasks-list --format json

# Criar tarefa
taskup tasks-create --titulo "Nova tarefa" --prioridade "alta"

# Actualizar tarefa
taskup tasks-update <id> --estado "em_progresso"

# Deletar tarefa
taskup tasks-delete <id>
```

## 🔐 Segurança

- Credenciais guardadas em: `~/.taskup-cli/` (privadas, 0o600)
- Logout: `taskup logout` (limpa todas as credenciais)

## ❓ Ajuda

```bash
taskup --help
taskup tasks-list --help
taskup login --help
```

---

**Desenvolvido por:** @belmirongola
**Versão:** 1.0.0
**Repositório:** https://github.com/belmirongola/taskup-automation
