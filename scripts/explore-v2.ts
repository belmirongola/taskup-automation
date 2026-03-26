// ─── Explorar TaskUp v2 — Dump da UI real ───
import { chromium } from "playwright";

const BASE_URL = "https://taskup-md.vercel.app";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const fs = require("fs");

  try {
    // Login
    console.log("🔐 Login...");
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    if (await emailInput.count() === 0) {
      console.log("No email input on /login, checking current URL...");
      console.log("URL:", page.url());
      await page.screenshot({ path: "screenshots/exp2-login-page.png" });
    }
    await emailInput.fill("belmirongola@gmail.com");
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("MarcaDigital2026!");
    
    const loginBtn = page.locator('button:has-text("Entrar"), button[type="submit"]');
    await loginBtn.click();

    // Wait for navigation
    await page.waitForTimeout(5000);
    console.log("URL após login:", page.url());
    await page.screenshot({ path: "screenshots/exp2-after-login.png" });

    // Navegar para tarefas
    await page.goto(`${BASE_URL}/tarefas`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);
    console.log("URL tarefas:", page.url());

    // Dump completo da página
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    fs.writeFileSync("screenshots/tarefas-full.html", html);
    console.log(`📝 HTML completo: ${html.length} chars`);

    // Listar TODOS os elementos interactivos
    const interactives = await page.evaluate(() => {
      const results: string[] = [];
      const els = document.querySelectorAll("button, a, input, textarea, select, [role='button'], [onclick], [data-action]");
      els.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        const text = (el as HTMLElement).innerText?.trim().substring(0, 80);
        const cls = el.className?.toString().substring(0, 60);
        const href = (el as HTMLAnchorElement).href || "";
        const type = el.getAttribute("type") || "";
        const role = el.getAttribute("role") || "";
        const visible = (el as HTMLElement).offsetParent !== null;
        results.push(`${visible ? "✅" : "❌"} <${tag}> text="${text}" class="${cls}" type="${type}" role="${role}" href="${href}"`);
      });
      return results;
    });

    console.log(`\n🔍 Elementos interactivos (${interactives.length}):`);
    interactives.forEach((el) => console.log(`   ${el}`));

    // Capturar screenshots
    await page.screenshot({ path: "screenshots/exp2-tarefas.png", fullPage: true });

    // Listar links da sidebar
    const sidebarLinks = await page.evaluate(() => {
      const results: string[] = [];
      document.querySelectorAll("nav a, aside a, [class*='sidebar'] a, [class*='nav'] a").forEach((el) => {
        const text = (el as HTMLElement).innerText?.trim();
        const href = (el as HTMLAnchorElement).href;
        if (text) results.push(`"${text}" → ${href}`);
      });
      return results;
    });
    console.log(`\n🔗 Sidebar links (${sidebarLinks.length}):`);
    sidebarLinks.forEach((l) => console.log(`   ${l}`));

  } catch (error: any) {
    console.error("💥", error.message);
    await page.screenshot({ path: "screenshots/exp2-error.png" });
  } finally {
    await browser.close();
    console.log("\n🏁 Fim");
  }
}

main();
