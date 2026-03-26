// ─── Explorar dialog Nova Tarefa ───
import { chromium } from "playwright";

const BASE_URL = "https://taskup-md.vercel.app";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  const fs = require("fs");

  try {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);
    await page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').fill("belmirongola@gmail.com");
    await page.locator('input[type="password"]').fill("MarcaDigital2026!");
    await page.locator('button:has-text("Entrar"), button[type="submit"]').click();
    await page.waitForTimeout(5000);
    console.log("✅ Logado | URL:", page.url());

    // Ir para tarefas
    await page.goto(`${BASE_URL}/tarefas`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(3000);

    // Clicar em Nova Tarefa
    console.log("📌 Clicando Nova Tarefa...");
    const novaTarefaBtn = page.locator('button:has-text("Nova Tarefa")');
    await novaTarefaBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/exp3-dialog-open.png", fullPage: true });

    // Dump do dialog
    const dialogHTML = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]') || 
                     document.querySelector('.fixed.inset-0') ||
                     document.querySelector('[data-state="open"]');
      if (dialog) return dialog.outerHTML;
      
      // Fallback: procurar qualquer overlay/modal
      const fixed = document.querySelectorAll('.fixed');
      for (const f of fixed) {
        if ((f as HTMLElement).offsetParent !== null || (f as HTMLElement).style.display !== 'none') {
          return (f as HTMLElement).outerHTML;
        }
      }
      return "NO_DIALOG_FOUND";
    });
    fs.writeFileSync("screenshots/dialog-nova-tarefa.html", dialogHTML);
    console.log(`📝 Dialog HTML: ${dialogHTML.length} chars`);

    // Listar inputs no dialog
    const inputs = await page.evaluate(() => {
      const results: string[] = [];
      // Procurar inputs dentro de qualquer dialog/modal/fixed overlay
      const containers = document.querySelectorAll('[role="dialog"], .fixed, [data-state="open"]');
      containers.forEach((container) => {
        container.querySelectorAll("input, textarea, select, [contenteditable]").forEach((el) => {
          const tag = el.tagName.toLowerCase();
          const type = el.getAttribute("type") || "";
          const name = el.getAttribute("name") || "";
          const placeholder = el.getAttribute("placeholder") || "";
          const id = el.getAttribute("id") || "";
          const cls = el.className?.toString().substring(0, 60) || "";
          const visible = (el as HTMLElement).offsetParent !== null;
          results.push(`${visible ? "✅" : "❌"} <${tag}> type="${type}" name="${name}" id="${id}" placeholder="${placeholder}" class="${cls}"`);
        });
      });
      return results;
    });
    console.log(`\n🔍 Inputs no dialog (${inputs.length}):`);
    inputs.forEach((i) => console.log(`   ${i}`));

    // Listar labels
    const labels = await page.evaluate(() => {
      const results: string[] = [];
      const containers = document.querySelectorAll('[role="dialog"], .fixed, [data-state="open"]');
      containers.forEach((container) => {
        container.querySelectorAll("label").forEach((el) => {
          const text = (el as HTMLElement).innerText?.trim();
          const forAttr = el.getAttribute("for") || "";
          if (text) results.push(`label: "${text}" for="${forAttr}"`);
        });
      });
      return results;
    });
    console.log(`\n🏷️ Labels (${labels.length}):`);
    labels.forEach((l) => console.log(`   ${l}`));

    // Listar botões no dialog
    const dialogBtns = await page.evaluate(() => {
      const results: string[] = [];
      const containers = document.querySelectorAll('[role="dialog"], .fixed, [data-state="open"]');
      containers.forEach((container) => {
        container.querySelectorAll("button").forEach((el) => {
          const text = (el as HTMLElement).innerText?.trim();
          const visible = (el as HTMLElement).offsetParent !== null;
          const cls = el.className?.toString().substring(0, 80) || "";
          if (visible) results.push(`btn: "${text}" class="${cls}"`);
        });
      });
      return results;
    });
    console.log(`\n🔘 Botões no dialog (${dialogBtns.length}):`);
    dialogBtns.forEach((b) => console.log(`   ${b}`));

    // Listar selects / dropdowns
    const selects = await page.evaluate(() => {
      const results: string[] = [];
      const containers = document.querySelectorAll('[role="dialog"], .fixed, [data-state="open"]');
      containers.forEach((container) => {
        container.querySelectorAll('[role="combobox"], [role="listbox"], select, [data-radix-select-trigger], [class*="select"]').forEach((el) => {
          const text = (el as HTMLElement).innerText?.trim().substring(0, 60);
          const tag = el.tagName.toLowerCase();
          const cls = el.className?.toString().substring(0, 60) || "";
          results.push(`<${tag}> text="${text}" class="${cls}"`);
        });
      });
      return results;
    });
    console.log(`\n📋 Selects/Dropdowns (${selects.length}):`);
    selects.forEach((s) => console.log(`   ${s}`));

    // Fechar dialog
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);

  } catch (error: any) {
    console.error("💥", error.message);
    await page.screenshot({ path: "screenshots/exp3-error.png" });
  } finally {
    await browser.close();
    console.log("\n🏁 Fim");
  }
}

main();
