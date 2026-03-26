/**
 * Extrai todos os endpoints da API do TaskUp interceptando network requests.
 * Navega por todas as secções e executa operações para capturar a API completa.
 */

import "dotenv/config";
import { chromium, Page, BrowserContext } from "playwright";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://taskup-md.vercel.app";
const EMAIL = process.env.TASKUP_EMAIL || "";
const PASSWORD = process.env.TASKUP_PASSWORD || "";

interface ApiCall {
  method: string;
  url: string;
  path: string;
  requestHeaders: Record<string, string>;
  requestBody: any;
  responseStatus: number;
  responseBody: any;
  timestamp: string;
  section: string;
}

const apiCalls: ApiCall[] = [];
let currentSection = "login";

function saveResults() {
  const outputDir = path.join(__dirname, "..", "api-extraction");
  fs.mkdirSync(outputDir, { recursive: true });

  // Raw API calls
  fs.writeFileSync(
    path.join(outputDir, "api-calls.json"),
    JSON.stringify(apiCalls, null, 2)
  );

  // Unique routes summary
  const uniqueRoutes = new Map<string, { methods: Set<string>; statuses: Set<number>; section: string }>();
  for (const call of apiCalls) {
    const parsedUrl = new URL(call.url);
    const routeKey = parsedUrl.pathname;
    if (!uniqueRoutes.has(routeKey)) {
      uniqueRoutes.set(routeKey, { methods: new Set(), statuses: new Set(), section: call.section });
    }
    const route = uniqueRoutes.get(routeKey)!;
    route.methods.add(call.method);
    route.statuses.add(call.responseStatus);
  }

  const routeSummary = Array.from(uniqueRoutes.entries()).map(([p, info]) => ({
    path: p,
    methods: Array.from(info.methods),
    statuses: Array.from(info.statuses),
    section: info.section,
  }));

  fs.writeFileSync(
    path.join(outputDir, "routes-summary.json"),
    JSON.stringify(routeSummary, null, 2)
  );

  // Readable report
  let report = `# TaskUp API Extraction Report\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `## Endpoints Encontrados: ${routeSummary.length}\n\n`;

  for (const route of routeSummary) {
    report += `### ${route.methods.join(", ")} ${route.path}\n`;
    report += `- Statuses: ${route.statuses.join(", ")}\n`;
    report += `- Secção: ${route.section}\n\n`;
  }

  report += `\n## Detalhe Completo\n\n`;
  for (const call of apiCalls) {
    report += `---\n`;
    report += `### ${call.method} ${call.path}\n`;
    report += `- Section: ${call.section}\n`;
    report += `- Status: ${call.responseStatus}\n`;
    if (call.requestBody) {
      report += `- Request Body:\n\`\`\`json\n${JSON.stringify(call.requestBody, null, 2)}\n\`\`\`\n`;
    }
    if (call.responseBody && typeof call.responseBody === "object") {
      const bodyStr = JSON.stringify(call.responseBody, null, 2);
      report += `- Response:\n\`\`\`json\n${bodyStr.length > 3000 ? bodyStr.substring(0, 3000) + "\n... [truncated]" : bodyStr}\n\`\`\`\n`;
    }
    report += `\n`;
  }

  fs.writeFileSync(path.join(outputDir, "api-report.md"), report);

  console.log(`\n✅ Resultados salvos!`);
  console.log(`   📊 ${apiCalls.length} API calls capturadas`);
  console.log(`   🛤️  ${routeSummary.length} rotas únicas`);
  console.log(`   📁 Resultados em: ${outputDir}/`);
}

async function setupInterception(page: Page) {
  page.on("response", async (res) => {
    const url = res.url();
    const req = res.request();

    const isApi =
      url.includes("/api/") ||
      url.includes("/trpc/") ||
      url.includes("supabase") ||
      url.includes("neon") ||
      url.includes("graphql") ||
      (req.resourceType() === "fetch" && !url.match(/\.(js|css|png|jpg|svg|woff|ico)/));

    const isNextData = url.includes("/_next/data/") || url.includes("__nextauth");

    if (!isApi && !isNextData) return;

    try {
      const requestHeaders = req.headers();
      let requestBody: any = null;
      try { requestBody = req.postDataJSON(); } catch { requestBody = req.postData(); }

      let responseBody: any = null;
      try {
        const contentType = res.headers()["content-type"] || "";
        if (contentType.includes("json")) {
          responseBody = await res.json();
        } else {
          const text = await res.text();
          responseBody = text.length < 5000 ? text : `[${text.length} chars - truncated]`;
        }
      } catch { responseBody = "[unable to parse]"; }

      const parsedUrl = new URL(url);

      apiCalls.push({
        method: req.method(),
        url,
        path: parsedUrl.pathname + parsedUrl.search,
        requestHeaders: {
          authorization: requestHeaders["authorization"] || "",
          "content-type": requestHeaders["content-type"] || "",
          cookie: requestHeaders["cookie"] ? "[present]" : "",
        },
        requestBody,
        responseStatus: res.status(),
        responseBody,
        timestamp: new Date().toISOString(),
        section: currentSection,
      });

      console.log(`  📡 ${req.method()} ${parsedUrl.pathname} → ${res.status()}`);
    } catch {}
  });
}

async function navigateSafe(page: Page, url: string, timeout = 15_000) {
  try {
    await page.goto(url, { timeout });
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(2_000);
  } catch (e) {
    console.log(`  ⚠️ Timeout em ${url}, continuando...`);
  }
}

async function main() {
  console.log("🚀 Iniciando extracção da API do TaskUp...\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  setupInterception(page);

  try {
    // ─── Login ───
    console.log("🔐 Login...");
    currentSection = "login";
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState("networkidle");

    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    await emailInput.waitFor({ state: "visible", timeout: 10_000 });
    await emailInput.fill(EMAIL);

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(PASSWORD);

    const loginBtn = page.locator('button:has-text("Entrar"), button[type="submit"]:has-text("Entrar"), button:has-text("Login"), button[type="submit"]');
    await loginBtn.click();
    await page.waitForURL("**/dashboard**", { timeout: 15_000 }).catch(() => {});
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2_000);
    console.log(`  ✅ Logged in → ${page.url()}\n`);

    // ─── Navegar por todas as secções ───
    const sections = [
      { name: "dashboard", path: "/dashboard" },
      { name: "kanban", path: "/kanban" },
      { name: "lista", path: "/tarefas" },
      { name: "calendario", path: "/calendario" },
      { name: "projectos", path: "/projectos" },
      { name: "equipa", path: "/colaboradores" },
      { name: "configuracoes", path: "/configuracoes" },
    ];

    for (const section of sections) {
      console.log(`📂 Navegando para ${section.name}...`);
      currentSection = section.name;
      await navigateSafe(page, `${BASE_URL}${section.path}`);
    }

    // ─── Interacções para disparar mais API calls ───

    // Nova tarefa
    console.log("\n📝 Tentando abrir formulário de nova tarefa...");
    currentSection = "create-task";
    await navigateSafe(page, `${BASE_URL}/tarefas`);
    const newTaskBtn = page.locator('button:has-text("Nova Tarefa"), button:has-text("Adicionar Tarefa"), button:has-text("Criar")');
    if (await newTaskBtn.first().isVisible({ timeout: 3_000 }).catch(() => false)) {
      await newTaskBtn.first().click();
      await page.waitForTimeout(2_000);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(1_000);
    }

    // Novo projecto
    console.log("📁 Tentando abrir formulário de novo projecto...");
    currentSection = "create-project";
    await navigateSafe(page, `${BASE_URL}/projectos`);
    const newProjectBtn = page.locator('button:has-text("Novo Projecto"), button:has-text("Criar Projecto"), button:has-text("Adicionar")');
    if (await newProjectBtn.first().isVisible({ timeout: 3_000 }).catch(() => false)) {
      await newProjectBtn.first().click();
      await page.waitForTimeout(2_000);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(1_000);
    }

    // Detalhe de tarefa via kanban
    console.log("👁️ Tentando abrir detalhes de uma tarefa...");
    currentSection = "task-detail";
    await navigateSafe(page, `${BASE_URL}/kanban`);
    const anyCard = page.locator('[draggable="true"], [class*="card"], [class*="task"]').first();
    if (await anyCard.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await anyCard.click();
      await page.waitForTimeout(2_000);
      await page.keyboard.press("Escape");
    }

    // ─── Capturar auth info ───
    console.log("\n🔑 Capturando auth info...");
    try {
      const cookies = await context.cookies();
      const storageKeys = await page.evaluate(() => {
        const ls: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key) ls.push(key);
        }
        return ls;
      });

      const authInfo = {
        cookies: cookies.map((c) => ({
          name: c.name,
          domain: c.domain,
          path: c.path,
          httpOnly: c.httpOnly,
          secure: c.secure,
          sameSite: c.sameSite,
          value: c.value.length > 20 ? `${c.value.substring(0, 10)}...[${c.value.length} chars]` : c.value,
        })),
        localStorageKeys: storageKeys,
      };

      const outputDir = path.join(__dirname, "..", "api-extraction");
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(path.join(outputDir, "auth-info.json"), JSON.stringify(authInfo, null, 2));
    } catch (e) {
      console.log("  ⚠️ Não conseguiu capturar auth info");
    }

  } catch (err) {
    console.log(`\n⚠️ Erro durante navegação: ${err}`);
  } finally {
    // Sempre salvar resultados, mesmo com erros
    saveResults();
    await browser.close();
    console.log("\n🏁 Browser fechado.");
  }
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err);
  // Tentar salvar o que temos
  if (apiCalls.length > 0) saveResults();
  process.exit(1);
});
