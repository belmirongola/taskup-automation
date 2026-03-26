/**
 * Script: Login + Criar task fictícia no TaskUp MD
 * Selectores baseados no mapeamento real do formulário
 * 
 * Campos mapeados no dialog "Nova Tarefa":
 *   Label "Titulo *"       → input[type="text"] (index 7)
 *   Label "Descricao"      → textarea (index 8)
 *   Label "Responsavel *"  → select (index 9)
 *   Label "Projecto"       → select (index 10)
 *   Label "Prazo"          → input[type="datetime-local"] (index 11)
 *   Label "Prioridade"     → select (index 12)
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
    console.log(`✅ Login OK → ${page.url()}`);
    await page.screenshot({ path: "screenshots/01-dashboard.png" });

    // ── NAVEGAR PARA LISTA ──
    console.log("📋 Navegando para Lista...");
    await page.locator('a[href="/tarefas"]').click();
    await page.waitForURL("**/tarefas**", { timeout: 10000 });
    await sleep(2000);
    console.log(`📋 Lista → ${page.url()}`);

    // Capturar tarefas existentes para comparação
    const beforeContent = await page.textContent("body");
    console.log(`📊 Tarefas antes: ${beforeContent?.includes("Teste Automação") ? "já existe uma de teste" : "nenhuma de teste"}`);
    await page.screenshot({ path: "screenshots/02-lista-antes.png" });

    // ── ABRIR DIALOG NOVA TAREFA ──
    console.log("➕ Abrindo dialog 'Nova Tarefa'...");
    await page.getByRole("button", { name: "Nova Tarefa" }).click();
    await sleep(2000);
    console.log("✅ Dialog aberto!");
    await page.screenshot({ path: "screenshots/03-dialog-aberto.png" });

    // ── PREENCHER FORMULÁRIO ──
    console.log("📝 Preenchendo campos...");

    // Titulo — input[type="text"] (o único text input no dialog)
    const titleInput = page.locator('input[type="text"]:visible').first();
    await titleInput.fill("Teste Automação Dillan — Task Fictícia 🤖");
    console.log("  ✅ Título preenchido");

    // Descrição — textarea
    const descTextarea = page.locator("textarea:visible").first();
    await descTextarea.fill("Tarefa criada automaticamente pelo Dillan via Playwright. Se estás a ver isto, a automação funcionou! ⚡");
    console.log("  ✅ Descrição preenchida");

    // Responsavel — select que segue o label "Responsavel"
    const responsavelSelect = page.locator('label:has-text("Responsavel") + select, label:has-text("Responsavel") ~ select').first();
    let responsavelVisible = await responsavelSelect.isVisible().catch(() => false);
    if (!responsavelVisible) {
      // Fallback: use nth select in the dialog
      // From mapping: selects are indices 0-3 (sidebar), 9=Responsavel, 10=Projecto, 12=Prioridade
      // The visible selects in dialog should be the ones after the checkboxes/text
    }
    
    // Usar getByLabel que é mais fiável
    const allVisibleSelects = page.locator("select:visible");
    const selectCount = await allVisibleSelects.count();
    console.log(`  Selects visíveis: ${selectCount}`);
    
    // Listar opções de cada select para identificar qual é qual
    for (let i = 0; i < selectCount; i++) {
      const options = await allVisibleSelects.nth(i).locator("option").allTextContents();
      const optionsStr = options.slice(0, 5).join(" | ");
      console.log(`  Select[${i}]: ${optionsStr}`);
    }

    // Agora preencher com base nas opções
    for (let i = 0; i < selectCount; i++) {
      const sel = allVisibleSelects.nth(i);
      const options = await sel.locator("option").allTextContents();
      const optionsLower = options.map(o => o.toLowerCase().trim());

      // Identificar por conteúdo das opções
      if (optionsLower.some(o => o.includes("belmiro") || o.includes("ngola"))) {
        // Responsável
        console.log("  👤 Seleccionando Responsável: Belmiro Ngola");
        const belmiroOpt = options.find(o => o.toLowerCase().includes("belmiro"));
        if (belmiroOpt) await sel.selectOption({ label: belmiroOpt });
      } else if (optionsLower.some(o => o.includes("sic") || o.includes("task") || o.includes("projecto") || o.includes("express") || o.includes("elsa") || o.includes("implementa"))) {
        // Projecto
        console.log("  📂 Seleccionando Projecto...");
        // Escolher primeiro projecto real (não placeholder)
        if (options.length > 1) {
          await sel.selectOption({ index: 1 });
          console.log(`     → ${options[1]}`);
        }
      } else if (optionsLower.some(o => o.includes("alta") || o.includes("media") || o.includes("baixa") || o.includes("medio") || o.includes("high") || o.includes("low") || o.includes("crítica") || o.includes("urgente"))) {
        // Prioridade
        console.log("  ⚡ Seleccionando Prioridade...");
        const altaOpt = options.find(o => o.toLowerCase().includes("alta") || o.toLowerCase().includes("high"));
        if (altaOpt) {
          await sel.selectOption({ label: altaOpt });
          console.log(`     → ${altaOpt}`);
        } else if (options.length > 1) {
          await sel.selectOption({ index: 1 });
          console.log(`     → ${options[1]}`);
        }
      }
    }

    // Prazo — datetime-local
    const prazoInput = page.locator('input[type="datetime-local"]:visible').first();
    const prazoVisible = await prazoInput.isVisible().catch(() => false);
    if (prazoVisible) {
      console.log("  📅 Preenchendo prazo...");
      await prazoInput.fill("2026-04-30T18:00");
      console.log("     → 2026-04-30 18:00");
    }

    await sleep(500);
    await page.screenshot({ path: "screenshots/04-form-preenchido.png" });

    // ── SUBMETER ──
    console.log("💾 Submetendo...");
    
    // Procurar botão Criar / submit (pode não estar no role=dialog)
    const criarBtn = page.getByRole("button", { name: /criar|salvar|guardar|create|save|submit|adicionar/i }).first();
    let criarVisible = await criarBtn.isVisible().catch(() => false);
    
    if (!criarVisible) {
      // Procurar qualquer botão com texto "Criar" na página
      const btns = page.locator('button:visible');
      const btnCount = await btns.count();
      console.log(`  Botões visíveis: ${btnCount}`);
      for (let i = 0; i < btnCount; i++) {
        const text = (await btns.nth(i).textContent())?.trim();
        console.log(`  Btn[${i}]: "${text}"`);
        if (text && /criar|salvar|guardar|create|save|submit/i.test(text)) {
          console.log(`  → Encontrado! Clicando "${text}"...`);
          await btns.nth(i).click();
          criarVisible = true; // mark as handled
          break;
        }
      }
      if (!criarVisible) {
        console.log("⚠️ Nenhum botão de submit encontrado!");
      }
    } else {
      const btnText = await criarBtn.textContent();
      console.log(`  Clicando "${btnText?.trim()}"...`);
      await criarBtn.click();
    }

    await sleep(3000);
    await page.screenshot({ path: "screenshots/05-apos-submit.png" });

    // ── VERIFICAÇÃO ──
    console.log("🔍 Verificando criação...");
    
    // Recarregar lista
    await page.locator('a[href="/tarefas"]').click();
    await sleep(3000);
    
    const afterContent = await page.textContent("body");
    const taskCreated = afterContent?.includes("Teste Automação Dillan");

    if (taskCreated) {
      console.log("\n🎉🎉🎉 SUCESSO! Tarefa 'Teste Automação Dillan — Task Fictícia 🤖' CRIADA com sucesso!");
    } else {
      console.log("\n⚠️ Tarefa não encontrada na lista. Verificando Kanban...");
      await page.locator('a[href="/kanban"]').click();
      await sleep(3000);
      const kanbanContent = await page.textContent("body");
      if (kanbanContent?.includes("Teste Automação Dillan")) {
        console.log("🎉 Tarefa encontrada no Kanban!");
      } else {
        console.log("❌ Tarefa NÃO encontrada. A submissão pode ter falhado.");
        console.log("   Verifica os screenshots para diagnosticar.");
      }
    }

    await page.screenshot({ path: "screenshots/06-verificacao-final.png" });

    // ── KANBAN VIEW ──
    console.log("📋 Verificando no Kanban...");
    await page.locator('a[href="/kanban"]').click();
    await sleep(3000);
    await page.screenshot({ path: "screenshots/07-kanban-final.png" });

    console.log("\n📸 Todos os screenshots guardados em ./screenshots/");

  } catch (err) {
    console.error("❌ Erro:", err);
    await page.screenshot({ path: "screenshots/error.png" }).catch(() => {});
  } finally {
    await browser.close();
    console.log("🏁 Done.");
  }
}

run();
