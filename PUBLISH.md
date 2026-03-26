# 📦 Como Publicar no GitHub Packages

## ✅ Pré-requisitos

- [ ] Repositório no GitHub (privado ou público)
- [ ] GitHub Actions ativado
- [ ] Git configurado

## 📋 Passos

### 1. Fazer Push para GitHub

```bash
cd taskup-automation

# Inicializar git (se ainda não feito)
git init
git add .
git commit -m "feat: TaskUp CLI & API client"
git branch -M main
git remote add origin https://github.com/seu-username/taskup-automation.git
git push -u origin main
```

### 2. Criar Release no GitHub

Opção A: Via Browser
1. Vai a **https://github.com/seu-username/taskup-automation**
2. **Releases** → **Create a new release**
3. Tag: `v1.0.0`
4. Title: `TaskUp CLI v1.0.0 - Initial Release`
5. Description:
   ```
   ## 🚀 Features
   - Direct API client (Supabase)
   - CLI with yargs
   - Support for tasks, projects, meetings, users, notifications
   - Private GitHub Packages distribution

   ## 📦 Install
   npm install @seu-username/taskup-cli

   ## 📖 Usage
   taskup login
   taskup tarefas list
   ```
6. **Publish release**

Opção B: Via CLI
```bash
gh release create v1.0.0 --title "TaskUp CLI v1.0.0" --notes "Initial release"
```

### 3. Verificar Publish (GitHub Actions)

1. Vai a **Actions** no repositório
2. Vê o workflow "Publish to GitHub Packages" em execução
3. Espera até estar verde ✅

### 4. Verificar Publicação

```bash
# Listar pacotes publicados
npm view @seu-username/taskup-cli versions

# Ou verificar no GitHub
https://github.com/seu-username/settings/packages
```

## 🔐 Configuração de Acesso (Privado)

Quem quer usar o pacote precisa de:

### 1. Criar GitHub Token

1. **GitHub Settings** → **Developer settings** → **Personal access tokens**
2. **Generate new token (classic)**
3. Selecionar scopes:
   - ✅ `read:packages`
   - ✅ `write:packages`
4. Copiar token

### 2. Configurar `~/.npmrc`

```bash
@seu-username:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Ou via CLI:
```bash
npm login --registry=https://npm.pkg.github.com --scope=@seu-username
```

### 3. Instalar o Pacote

```bash
npm install @seu-username/taskup-cli
```

## 🔄 Atualizar Versão

### Quando fazer update:

```bash
# 1. Actualizar versão em package.json
# Opção A: Manual
nano package.json  # version: "1.0.1"

# Opção B: npm
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# 2. Push
git push origin main
git push origin v1.0.1  # Tags

# 3. Criar Release
gh release create v1.0.1 --title "TaskUp CLI v1.0.1" --notes "Bug fixes"
```

## ⚠️ Troubleshooting

### Package não aparece em `npm view`

```bash
# Verificar no GitHub
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://npm.pkg.github.com/@seu-username/taskup-cli
```

### "403 Forbidden" ao instalar

- Verificar se token tem permissão `read:packages`
- Verificar se `~/.npmrc` está correto
- Logout e login novamente:
  ```bash
  npm logout --registry=https://npm.pkg.github.com
  npm login --registry=https://npm.pkg.github.com
  ```

### Actions falhando

- Verificar que `npm ci` e `npm run build` funcionam localmente
- Verificar que `package.json` tem `"private": true` (opcional, mas recomendado)
- Verificar permissões do token em **Settings → Developer settings → Personal access tokens**

## 📚 Documentação

- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [Publishing to GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)

---

**Feito!** Pacote pronto para distribução privada. 🎉
