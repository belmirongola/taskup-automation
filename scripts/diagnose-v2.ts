// ─── Diagnóstico v2: ir directamente para /tarefas ───

import { chromium } from "playwright";
import { login } from "../src/auth";
import * as fs from "fs";
import * as path from "path";

const CREDS = {
  email: "belmirongola@gmail.com",
  password: "MarcaDigital2026!",
};

const SCREENSHOTS_DIR = path.join(__dirname, "..", "screenshots");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    console.log("1. Login...");
    await login(page, CREDS);
    console.log("   ✓ Logado:", page.url());
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "diag2-01-dashboard.png") });

    console.log("2. Navegar directamente para /tarefas...");
    await page.goto("https://taskup-md.vercel.app/tarefas", { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    console.log("   ✓ URL:", page.url());
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "diag2-02-tarefas.png") });

    // Listar sidebar links
    console.log("3. Links no sidebar:");
    const links = await page.locator("a").all();
    for (const link of links) {
      const href = await link.getAttribute("href").catch(() => "");
      const text = await link.textContent().catch(() => "");
      const visible = await link.isVisible().catch(() => false);
      if (visible && text?.trim()) {
        console.log(`   - "${text.trim()}" → ${href}`);
      }
    }

    // Listar todos os botões
    console.log("4. Botões visíveis:");
    const buttons = await page.locator("button:visible").all();
    for (const btn of buttons) {
      const text = await btn.textContent().catch(() => "");
      if (text?.trim()) {
        console.log(`   - "${text.trim()}"`);
      }
    }

    // Tentar clicar em "Nova Tarefa" ou equivalente
    const novaBtn = page.locator('button:has-text("Nova Tarefa"), button:has-text("Nova tarefa"), button:has-text("Adicionar")').first();
    const novaBtnVisible = await novaBtn.isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`\n5. Botão 'Nova Tarefa' visível: ${novaBtnVisible}`);

    if (novaBtnVisible) {
      const btnText = await novaBtn.textContent();
      console.log(`   Texto: "${btnText}"`);
      await novaBtn.click();
      console.log("   ✓ Clicado!");
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "diag2-03-modal.png") });

      // Capturar HTML completo com modal
      const html = await page.content();
      fs.writeFileSync(path.join(SCREENSHOTS_DIR, "diag2-modal.html"), html);

      // Listar selectores do modal
      const selectors = [
        '[role="dialog"]', 'dialog', '.fixed.inset-0', 'div[class*="fixed"]',
        '[data-state="open"]', 'form', '[class*="modal"]', '[class*="sheet"]',
        '[class*="drawer"]', '[class*="overlay"]'
      ];
      
      console.log("\n6. Selectores do modal:");
      for (const sel of selectors) {
        const count = await page.locator(sel).count();
        if (count > 0) {
          console.log(`   ✓ "${sel}" → ${count} elementos`);
          const firstHtml = await page.locator(sel).first().evaluate(el => {
            return el.outerHTML.substring(0, 300);
          }).catch(() => "ERRO");
          console.log(`     HTML: ${firstHtml}`);
        }
      }

      // Inputs
      console.log("\n7. Inputs visíveis:");
      const inputs = await page.locator("input:visible, textarea:visible, select:visible").all();
      for (const inp of inputs) {
        const tag = await inp.evaluate(el => el.tagName);
        const type = await inp.getAttribute("type").catch(() => "");
        const name = await inp.getAttribute("name").catch(() => "");
        const placeholder = await inp.getAttribute("placeholder").catch(() => "");
        const id = await inp.getAttribute("id").catch(() => "");
        console.log(`   - <${tag}> type="${type}" name="${name}" placeholder="${placeholder}" id="${id}"`);
      }

      // Labels
      console.log("\n8. Labels visíveis:");
      const labels = await page.locator("label:visible").all();
      for (const lbl of labels) {
        const text = await lbl.textContent().catch(() => "");
        if (text?.trim()) console.log(`   - "${text.trim()}"`);
      }
    } else {
      // Capturar página actual para debug
      const html = await page.content();
      fs.writeFileSync(path.join(SCREENSHOTS_DIR, "diag2-page.html"), html);
      
      // Verificar se estamos numa página de loading
      const loading = await page.locator('.animate-pulse, [class*="loading"], [class*="skeleton"]').count();
      console.log(`   Elementos de loading: ${loading}`);
      
      // Esperar mais e tentar de novo
      console.log("   Esperar mais 5s...");
      await page.waitForTimeout(5000);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "diag2-02b-tarefas-wait.png") });
      
      const buttons2 = await page.locator("button:visible").all();
      console.log(`   Botões após espera: ${buttons2.length}`);
      for (const btn of buttons2) {
        const text = await btn.textContent().catch(() => "");
        if (text?.trim()) console.log(`   - "${text.trim()}"`);
      }
    }

  } catch (err) {
    console.error("ERRO:", err);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "diag2-error.png") });
  } finally {
    await browser.close();
  }
}

main();
