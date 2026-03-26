// ─── Explorar UI do TaskUp ───
import { chromium } from "playwright";

const BASE_URL = "https://taskup-md.vercel.app";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  try {
    // Login
    console.log("🔐 Login...");
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState("networkidle");
    
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    await emailInput.fill("belmirongola@gmail.com");
    
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill("MarcaDigital2026!");
    
    const loginBtn = page.locator('button:has-text("Entrar"), button[type="submit"]');
    await loginBtn.click();
    await page.waitForURL("**/dashboard**", { timeout: 15_000 });
    console.log("✅ Logado");

    // Ir para tarefas
    console.log("📋 Indo para tarefas...");
    await page.goto(`${BASE_URL}/tarefas`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/explore-01-tarefas.png", fullPage: true });
    
    // Capturar HTML da página para entender a estrutura
    const pageHTML = await page.content();
    const fs = require("fs");
    fs.writeFileSync("screenshots/tarefas-page.html", pageHTML);
    console.log("📝 HTML da página salvo");

    // Procurar botão de nova tarefa
    console.log("\n🔍 Procurando botão Nova Tarefa...");
    const buttons = await page.locator("button").all();
    for (const btn of buttons) {
      const text = await btn.textContent();
      const visible = await btn.isVisible();
      if (visible && text && text.trim().length > 0) {
        console.log(`   Botão: "${text.trim()}" | visível: ${visible}`);
      }
    }

    // Tentar clicar em "Nova Tarefa" ou similar
    const novaTaskBtn = page.locator('button:has-text("Nova Tarefa"), button:has-text("Adicionar"), button:has-text("Criar"), button:has-text("+ Tarefa")').first();
    if (await novaTaskBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log("\n✅ Botão encontrado! Clicando...");
      await novaTaskBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: "screenshots/explore-02-dialog.png", fullPage: true });
      
      // Capturar HTML do dialog
      const dialogHTML = await page.locator('[role="dialog"], .fixed, [data-state="open"]').first().innerHTML().catch(() => "NOT_FOUND");
      fs.writeFileSync("screenshots/dialog.html", dialogHTML);
      console.log("📝 HTML do dialog salvo");

      // Listar todos os inputs no dialog
      console.log("\n🔍 Inputs no dialog:");
      const inputs = await page.locator('[role="dialog"] input, [role="dialog"] textarea, [role="dialog"] select, .fixed input, .fixed textarea').all();
      for (const input of inputs) {
        const type = await input.getAttribute("type");
        const name = await input.getAttribute("name");
        const placeholder = await input.getAttribute("placeholder");
        const visible = await input.isVisible();
        console.log(`   Input: type=${type} name=${name} placeholder="${placeholder}" visible=${visible}`);
      }

      // Listar botões no dialog
      console.log("\n🔍 Botões no dialog:");
      const dialogBtns = await page.locator('[role="dialog"] button, .fixed button').all();
      for (const btn of dialogBtns) {
        const text = await btn.textContent();
        const visible = await btn.isVisible();
        if (visible) {
          console.log(`   Botão dialog: "${text?.trim()}"`);
        }
      }

      // Fechar dialog
      await page.keyboard.press("Escape");
      await page.waitForTimeout(1000);
      console.log("\n✅ Dialog fechado (Escape)");
      await page.screenshot({ path: "screenshots/explore-03-after-close.png", fullPage: true });
    } else {
      console.log("❌ Botão Nova Tarefa NÃO encontrado");
      
      // Listar TODOS os botões visíveis
      const allBtns = await page.locator("button:visible").all();
      console.log(`\n📋 Todos os botões visíveis (${allBtns.length}):`);
      for (const btn of allBtns) {
        const text = await btn.textContent();
        console.log(`   "${text?.trim()}"`);
      }
    }

  } catch (error: any) {
    console.error("💥", error.message);
    await page.screenshot({ path: "screenshots/explore-error.png", fullPage: true });
  } finally {
    await browser.close();
    console.log("\n🏁 Fim da exploração");
  }
}

main();
