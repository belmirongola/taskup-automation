// ─── Diagnóstico: capturar HTML do modal de Nova Tarefa ───

import { chromium } from "playwright";
import { login } from "../src/auth";
import { navigateTo } from "../src/navigation";
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

    console.log("2. Navegar para Tarefas...");
    await navigateTo(page, "lista");
    await page.waitForTimeout(2000);
    console.log("   ✓ URL:", page.url());
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "diag-01-tarefas.png"), fullPage: true });

    // Capturar HTML da página inteira antes de clicar
    const pageHtml = await page.content();
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, "diag-tarefas-full.html"), pageHtml);
    console.log("   ✓ HTML da página guardado");

    // Procurar o botão "Nova Tarefa"
    console.log("3. Procurar botão 'Nova Tarefa'...");
    
    // Listar todos os botões visíveis
    const buttons = await page.locator("button").all();
    console.log(`   Encontrados ${buttons.length} botões:`);
    for (const btn of buttons) {
      const text = await btn.textContent().catch(() => "");
      const visible = await btn.isVisible().catch(() => false);
      if (visible && text?.trim()) {
        console.log(`   - "${text.trim()}"`);
      }
    }

    // Tentar clicar em "Nova Tarefa"
    const novaBtn = page.locator('button:has-text("Nova Tarefa")').first();
    const novaBtnVisible = await novaBtn.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`   Botão 'Nova Tarefa' visível: ${novaBtnVisible}`);

    if (!novaBtnVisible) {
      // Tentar alternativas
      const altBtn = page.locator('button:has-text("Nova"), button:has-text("Adicionar"), a:has-text("Nova Tarefa")').first();
      const altVisible = await altBtn.isVisible({ timeout: 3000 }).catch(() => false);
      console.log(`   Botão alternativo visível: ${altVisible}`);
      if (altVisible) {
        const altText = await altBtn.textContent();
        console.log(`   Botão alternativo: "${altText}"`);
        await altBtn.click();
      } else {
        console.log("   ✗ Nenhum botão encontrado!");
        await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "diag-02-no-button.png"), fullPage: true });
        await browser.close();
        return;
      }
    } else {
      await novaBtn.click();
    }

    console.log("4. Botão clicado, esperar modal...");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "diag-03-modal.png"), fullPage: true });

    // Capturar HTML com modal aberto
    const modalHtml = await page.content();
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, "diag-modal-full.html"), modalHtml);
    console.log("   ✓ HTML do modal guardado");

    // Tentar encontrar o diálogo
    const possibleDialogs = [
      '[role="dialog"]',
      '[role="alertdialog"]',
      '.fixed.inset-0',
      'div[class*="modal"]',
      'div[class*="dialog"]',
      'div[class*="overlay"]',
      'form',
      'div.fixed',
    ];

    for (const sel of possibleDialogs) {
      const count = await page.locator(sel).count();
      if (count > 0) {
        console.log(`   ✓ Selector "${sel}" → ${count} elementos`);
        // Capturar o HTML do primeiro elemento
        const html = await page.locator(sel).first().innerHTML().catch(() => "ERRO");
        if (html !== "ERRO" && html.length > 20) {
          fs.writeFileSync(
            path.join(SCREENSHOTS_DIR, `diag-selector-${sel.replace(/[^a-z0-9]/gi, "_")}.html`),
            html
          );
        }
      }
    }

    // Listar inputs visíveis dentro do modal
    console.log("5. Inputs visíveis:");
    const inputs = await page.locator("input:visible, textarea:visible, select:visible").all();
    for (const inp of inputs) {
      const tag = await inp.evaluate((el) => el.tagName);
      const type = await inp.getAttribute("type").catch(() => "");
      const name = await inp.getAttribute("name").catch(() => "");
      const placeholder = await inp.getAttribute("placeholder").catch(() => "");
      const id = await inp.getAttribute("id").catch(() => "");
      console.log(`   - <${tag}> type="${type}" name="${name}" placeholder="${placeholder}" id="${id}"`);
    }

    // Listar todos os labels visíveis
    console.log("6. Labels visíveis:");
    const labels = await page.locator("label:visible").all();
    for (const lbl of labels) {
      const text = await lbl.textContent().catch(() => "");
      const htmlFor = await lbl.getAttribute("for").catch(() => "");
      if (text?.trim()) {
        console.log(`   - "${text.trim()}" for="${htmlFor}"`);
      }
    }

    // Listar selects/dropdowns (podem ser custom)
    console.log("7. Botões dentro do modal (possíveis dropdowns):");
    const modalButtons = await page.locator('.fixed button:visible, [role="dialog"] button:visible, form button:visible').all();
    for (const btn of modalButtons) {
      const text = await btn.textContent().catch(() => "");
      const role = await btn.getAttribute("role").catch(() => "");
      if (text?.trim()) {
        console.log(`   - "${text.trim()}" role="${role}"`);
      }
    }

  } catch (err) {
    console.error("ERRO:", err);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "diag-error.png"), fullPage: true });
  } finally {
    await browser.close();
  }
}

main();
