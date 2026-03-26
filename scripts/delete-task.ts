/**
 * Script: Eliminar a task fictícia "Teste Automação Dillan" do TaskUp MD
 */
import { chromium } from "playwright";

const BASE_URL = "https://taskup-md.vercel.app";
const EMAIL = "belmirongola@gmail.com";
const PASSWORD = "MarcaDigital2026!";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log("🚀 Iniciando browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  try {
    // ── LOGIN ──
    console.log("🔐 Login...");
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    await sleep(2000);
    await page.locator('input[type="email"]').first().fill(EMAIL);
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForURL("**/dashboard**", { timeout: 15000 });
    await sleep(2000);
    console.log(`✅ Login OK`);

    // ── NAVEGAR PARA LISTA ──
    console.log("📋 Navegando para Lista...");
    await page.locator('a[href="/tarefas"]').click();
    await page.waitForURL("**/tarefas**", { timeout: 10000 });
    await sleep(2000);

    // ── ENCONTRAR A TASK ──
    console.log("🔍 Procurando task 'Teste Automação Dillan'...");
    
    const taskCell = page.locator('td, cell').filter({ hasText: "Teste Automação Dillan" }).first();
    const taskVisible = await taskCell.isVisible().catch(() => false);
    
    if (!taskVisible) {
      console.log("⚠️ Task não encontrada na lista. Pode já ter sido eliminada.");
      await page.screenshot({ path: "screenshots/delete-not-found.png" });
      await browser.close();
      return;
    }

    console.log("✅ Task encontrada! Clicando para abrir...");
    await taskCell.click();
    await sleep(2000);
    await page.screenshot({ path: "screenshots/delete-01-task-aberta.png" });

    // ── PROCURAR BOTÃO ELIMINAR ──
    console.log("���� Procurando opção de eliminar...");

    // Mapear todos os botões visíveis
    const btns = page.locator('button:visible');
    const btnCount = await btns.count();
    console.log(`  Botões visíveis: ${btnCount}`);
    for (let i = 0; i < btnCount; i++) {
      const text = (await btns.nth(i).textContent())?.trim();
      if (text) console.log(`  Btn[${i}]: "${text}"`);
    }

    // Procurar botão eliminar/apagar/delete/remover
    let deleteBtn = page.getByRole("button", { name: /eliminar|apagar|delete|remover|excluir/i }).first();
    let deleteVisible = await deleteBtn.isVisible().catch(() => false);

    if (!deleteVisible) {
      // Procurar menu de opções (três pontos, "...", ícone kebab)
      console.log("  Procurando menu de opções...");
      const menuBtn = page.locator('button:has(svg), [aria-label*="opç"], [aria-label*="menu"], [aria-label*="more"]').filter({ hasText: /^$/ });
      const menuCount = await menuBtn.count();
      console.log(`  Botões de menu/ícone: ${menuCount}`);
      
      // Tentar clicar nos botões de ícone (sem texto) no contexto da task
      for (let i = 0; i < menuCount; i++) {
        const ariaLabel = await menuBtn.nth(i).getAttribute("aria-label") || "";
        console.log(`  Menu[${i}] aria-label="${ariaLabel}"`);
      }

      // Procurar botão com ícone de lixo/trash
      const trashBtn = page.locator('button:has(svg[class*="trash"]), button:has(svg[class*="delete"]), button[title*="liminar"], button[title*="pagar"]').first();
      const trashVisible = await trashBtn.isVisible().catch(() => false);
      
      if (trashVisible) {
        console.log("  🗑️ Botão trash encontrado!");
        await trashBtn.click();
        await sleep(1000);
      } else {
        // Último recurso: ver se há dropdown/context menu
        console.log("  Tentando right-click na task...");
        await taskCell.click({ button: "right" });
        await sleep(1000);
        await page.screenshot({ path: "screenshots/delete-02-context-menu.png" });

        // Ver o que apareceu
        const contextItems = page.locator('[role="menuitem"], [role="option"]');
        const contextCount = await contextItems.count();
        console.log(`  Context menu items: ${contextCount}`);
        for (let i = 0; i < contextCount; i++) {
          const text = (await contextItems.nth(i).textContent())?.trim();
          console.log(`  MenuItem[${i}]: "${text}"`);
        }

        // Procurar "Eliminar" no context menu
        const eliminarItem = page.locator('[role="menuitem"]').filter({ hasText: /eliminar|apagar|delete|remover/i }).first();
        const eliminarVisible = await eliminarItem.isVisible().catch(() => false);
        if (eliminarVisible) {
          console.log("  🗑️ Opção eliminar encontrada no menu!");
          await eliminarItem.click();
          await sleep(1000);
        }
      }
    } else {
      console.log("  🗑️ Botão eliminar encontrado directamente!");
      await deleteBtn.click();
      await sleep(1000);
    }

    await page.screenshot({ path: "screenshots/delete-03-confirmar.png" });

    // ── CONFIRMAR ELIMINAÇÃO ──
    console.log("🔍 Procurando confirmação...");
    const confirmBtn = page.getByRole("button", { name: /confirmar|sim|yes|eliminar|apagar|delete|ok/i }).first();
    const confirmVisible = await confirmBtn.isVisible().catch(() => false);
    
    if (confirmVisible) {
      const confirmText = await confirmBtn.textContent();
      console.log(`  Clicando "${confirmText?.trim()}" para confirmar...`);
      await confirmBtn.click();
      await sleep(3000);
    } else {
      // Pode não pedir confirmação
      console.log("  Sem dialog de confirmação.");
    }

    await page.screenshot({ path: "screenshots/delete-04-apos-eliminar.png" });

    // ── VERIFICAÇÃO ──
    console.log("🔍 Verificando eliminação...");
    await page.locator('a[href="/tarefas"]').click();
    await sleep(3000);

    const afterContent = await page.textContent("body");
    const stillExists = afterContent?.includes("Teste Automação Dillan");

    if (!stillExists) {
      console.log("\n🎉 Task eliminada com sucesso! Já não aparece na lista.");
    } else {
      console.log("\n⚠️ Task ainda aparece na lista. Pode precisar de outra abordagem.");
    }

    await page.screenshot({ path: "screenshots/delete-05-final.png" });

  } catch (err) {
    console.error("❌ Erro:", err);
    await page.screenshot({ path: "screenshots/delete-error.png" }).catch(() => {});
  } finally {
    await browser.close();
    console.log("🏁 Done.");
  }
}

run();
