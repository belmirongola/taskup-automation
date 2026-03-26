# 🚀 Publicar Agora (4 Passos)

## 1️⃣ Criar Repositório
Vá a: https://github.com/new
- Name: `taskup-automation`
- Private: ✅
- Não initialize com README

## 2️⃣ Fazer Push (copie e execute)

```bash
cd "/Users/belmirongola/Documents/Projects/Active/Marca Digital/taskup-automation"

# Substitua SEU_USERNAME
git remote add origin https://github.com/SEU_USERNAME/taskup-automation.git
git branch -M main
git push -u origin main
```

## 3️⃣ Criar Release

**Via GitHub:**
1. Vá a https://github.com/SEU_USERNAME/taskup-automation/releases
2. **Create a new release**
3. **Tag:** v1.0.0
4. **Title:** TaskUp CLI v1.0.0
5. **Publish**

**Ou via CLI:**
```bash
gh release create v1.0.0 --title "TaskUp CLI v1.0.0"
```

## 4️⃣ GitHub Actions Publica Automaticamente

- Actions roda `npm run build`
- Publica no GitHub Packages
- Credodivaldo pode instalar!

---

## ✅ Depois (Instruções para Credodivaldo)

```bash
# 1. Configurar npm (~/.npmrc)
@belmirongola:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=GITHUB_TOKEN

# 2. Instalar
npm install -g @belmirongola/taskup-automation

# 3. Usar
taskup login --email credodivaldo@gmail.com
taskup tasks-list
taskup whoami
```

---

**Estado Atual:**
- ✅ Código compilado
- ✅ Git commit feito
- ⏳ Aguarda: Push para GitHub
- ⏳ Aguarda: Criar Release

Done! 🎉
