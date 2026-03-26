# ⚡ Quick Deploy - TaskUp Worker

## 3 passos para deploy

### 1️⃣ Instalar wrangler e configurar

```bash
npm install -g wrangler

# Autenticar com Cloudflare
wrangler auth
```

### 2️⃣ Configurar variáveis

```bash
cd worker

# Copiar e editar
cp .env.example .env.local

# Editar com credenciais reais:
# SUPABASE_URL=...
# SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_KEY=...
```

### 3️⃣ Deploy

```bash
npm install
npm run build
npm run deploy
```

---

## Verificar Deploy

```bash
# Teste rápido
curl https://taskup-api-prod.workers.dev/health

# Deve responder:
# {"success":true,"status":200}
```

---

## Configurar Variáveis no Cloudflare (pós-deploy)

Se o deploy falhou por variáveis não configuradas:

```bash
# Dentro da pasta worker/
wrangler secret put SUPABASE_URL
# (Colar URL)

wrangler secret put SUPABASE_ANON_KEY
# (Colar chave)

wrangler secret put SUPABASE_SERVICE_KEY
# (Colar service key - admin access)
```

Ou via painel: https://dash.cloudflare.com/ → Workers → taskup-api-prod → Settings → Variables

---

## Account ID

✅ Já configurado: `4f46016c757f00fecf0d1ea66bcc101f`

No `wrangler.toml`

---

## Resultado

Worker publicado em:
- **Produção:** `https://taskup-api-prod.workers.dev`
- **Staging:** `https://taskup-api-staging.workers.dev` (se activado)

CLI agora acessa via:
```bash
export TASKUP_API_URL=https://taskup-api-prod.workers.dev
taskup login --email seu@email.com
```

---

**Próximo:** Actualizar CLI para suportar `TASKUP_API_URL`
