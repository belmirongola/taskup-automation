# 🚀 Publicar no GitHub Packages

## 1️⃣ Criar Repositório no GitHub

Se ainda não criou, vá a: https://github.com/new

- **Repository name:** `taskup-automation`
- **Description:** `TaskUp CLI - Direct API client`
- **Private:** ✅ (recomendado para Marca Digital)
- **Initialize with README:** ❌ (já temos)

## 2️⃣ Fazer Push

```bash
cd "/Users/belmirongola/Documents/Projects/Active/Marca Digital/taskup-automation"

# Adicionar remote (substitua SEU_USERNAME)
git remote add origin https://github.com/SEU_USERNAME/taskup-automation.git

# Fazer push
git branch -M main
git push -u origin main
```

## 3️⃣ Criar Release (dispara publicação automática)

### Opção A: Via GitHub Web
1. Vá a: https://github.com/SEU_USERNAME/taskup-automation
2. **Releases** → **Create a new release**
3. **Tag version:** `v1.0.0`
4. **Release title:** `TaskUp CLI v1.0.0 - Initial Release`
5. **Description:**
```
## 🚀 Features
- Direct API client (Supabase)
- CLI with yargs for task/project management
- Persistent authentication with auto-login
- Secure credential storage (~/.taskup-cli/)
- GitHub Actions auto-publish

## 📦 Install
```bash
npm install @SEU_USERNAME/taskup-automation
```

## 🔐 Setup
```bash
# Configure npm
echo '@SEU_USERNAME:registry=https://npm.pkg.github.com' >> ~/.npmrc
echo '//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN' >> ~/.npmrc

# Login
taskup login --email your@email.com
```

## 📖 Usage
```bash
taskup tasks-list
taskup projects-list
taskup whoami
```
```

6. **Publish release**

### Opção B: Via CLI
```bash
gh release create v1.0.0 \
  --title "TaskUp CLI v1.0.0 - Initial Release" \
  --notes "Initial release with direct API client and persistent auth"
```

## 4️⃣ Verificar Publicação

Vai a: https://github.com/SEU_USERNAME/settings/packages

Deve ver `taskup-automation` listado!

## 5️⃣ Compartilhar com Credodivaldo

Envie isto para o credodivaldo@gmail.com:

---

### 🎯 Como Usar TaskUp CLI

**Pré-requisitos:**
- GitHub account: credodivaldo (ou o seu username)
- GitHub token com permissão `read:packages`

**1. Configurar npm**
```bash
# Crie/edite ~/.npmrc
@belmirongola:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=GITHUB_TOKEN_AQUI
```

**2. Instalar**
```bash
npm install -g @belmirongola/taskup-automation
```

**3. Login**
```bash
taskup login --email sua@email.com
```

**4. Usar**
```bash
# Listar tarefas
taskup tasks-list

# Listar projectos
taskup projects-list

# Ver status
taskup whoami

# Listar com filtros
taskup tasks-list --estado "a_fazer"
taskup tasks-list --prioridade "alto" --format json
```

---

## ⚠️ Notas

- Credenciais guardadas em `~/.taskup-cli/auth.json` (permissões 0o600)
- Logout: `taskup logout`
- Repositório: https://github.com/SEU_USERNAME/taskup-automation
- GitHub Packages: https://github.com/SEU_USERNAME/settings/packages
