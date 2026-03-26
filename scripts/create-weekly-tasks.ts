// ─── Weekly Plan: Create 13 Tasks (Mar 24-27, 2026) ───
// Direct DOM interaction — no library wrappers

import { chromium, Page } from "playwright";
import * as path from "path";

const URL = "https://taskup-md.vercel.app";
const EMAIL = "belmirongola@gmail.com";
const PASSWORD = "MarcaDigital2026!";
const SCREENSHOTS = path.join(__dirname, "..", "screenshots");

// ── Project IDs (from DOM) ──
const PROJECTS: Record<string, string> = {
  "POP-01": "867746b1-9255-484a-a9ec-6c0f0d2e3adc",
  "POP-02": "6f372067-a3b6-412a-ad31-be336c88a713",
  "POP-03": "19d69ffb-4a07-42e1-95b1-d5ec842c49ef",
  "POP-04": "7d5908a2-e9cd-4457-9dcb-287be710831e",
  "POP-05": "e5c46dd7-6c34-4ccf-8994-70d23dd5bcf2",
  "POP-06": "f5cbaa0d-1a94-4691-91f2-bf2306a768da",
  "POP-07": "748359fb-c07d-48c1-8484-5d7a4b520e2e",
  "POP-08": "e5050044-886d-4fb3-83f7-b0b7687cd1df",
  "Implementação Task Up": "9b64b30b-eed6-446e-8462-93f73699ca91",
};

// ── Collaborator IDs ──
const PEOPLE: Record<string, string> = {
  "Belmiro": "49b8561d-31c7-4f9f-a234-af16b504e5eb",
  "Anacleto": "f3db6f9a-f667-467d-91e6-a214d2d54640",
  "Raimundo": "6f6ce3fc-0ab0-4654-9aa2-4d2a1cc6a2ed",
  "Credo": "4b52adf4-3094-448a-bde3-344325cb5b97",
  "Nelson": "2f20bcfc-c2b0-4ab6-8bd8-7290f92c14ff",
  "Ines": "fd03dfa6-d556-4ec2-9887-ea8ead7dd5d0",
};

// ── Task Definitions ──
interface TaskDef {
  titulo: string;
  descricao: string;
  responsavel: string;
  projecto: string;
  prazo: string; // YYYY-MM-DDTHH:MM
  prioridade: "baixo" | "medio" | "alto" | "critico";
}

const TASKS: TaskDef[] = [
  // ── Terça 24/03 (2 tarefas — POP-03 meeting day) ──
  {
    titulo: "Reuniao POP-03 — Revisao de Onboarding SIC",
    descricao: "Reuniao semanal POP-03: rever estado dos onboardings SIC activos, identificar blockers e definir proximos passos.",
    responsavel: "Belmiro",
    projecto: "POP-03",
    prazo: "2026-03-24T10:00",
    prioridade: "alto",
  },
  {
    titulo: "Actualizar pipeline comercial SIC no CRM",
    descricao: "Rever e actualizar status de todos os leads e oportunidades SIC no pipeline. Mover deals conforme progresso real.",
    responsavel: "Belmiro",
    projecto: "POP-02",
    prazo: "2026-03-24T17:00",
    prioridade: "medio",
  },

  // ── Quarta 25/03 (3 tarefas) ──
  {
    titulo: "Preparar conteudo semanal para redes sociais",
    descricao: "Criar calendario de conteudo da semana: 3 posts Instagram, 2 stories, 1 post LinkedIn. Alinhar com campanhas activas.",
    responsavel: "Ines",
    projecto: "POP-04",
    prazo: "2026-03-25T12:00",
    prioridade: "medio",
  },
  {
    titulo: "Revisao financeira semanal — facturacao pendente",
    descricao: "Verificar facturas pendentes, cobranças atrasadas e reconciliar pagamentos recebidos na semana anterior.",
    responsavel: "Belmiro",
    projecto: "POP-05",
    prazo: "2026-03-25T15:00",
    prioridade: "alto",
  },
  {
    titulo: "Deploy actualizacao TaskUp — correcoes de bugs",
    descricao: "Deploy da versao corrigida do TaskUp com fixes identificados na semana anterior. Testar em staging antes de producao.",
    responsavel: "Belmiro",
    projecto: "Implementação Task Up",
    prazo: "2026-03-25T18:00",
    prioridade: "alto",
  },

  // ── Quinta 26/03 (3 tarefas) ──
  {
    titulo: "Onboarding SIC Express — sessao de configuracao",
    descricao: "Sessao de configuracao inicial com cliente SIC Express: setup do ambiente, integracao de dados e formacao basica.",
    responsavel: "Raimundo",
    projecto: "POP-03",
    prazo: "2026-03-26T10:00",
    prioridade: "alto",
  },
  {
    titulo: "Revisao de processos operacionais e logistica",
    descricao: "Auditar processos operacionais actuais, identificar gargalos logisticos e propor melhorias para o proximo trimestre.",
    responsavel: "Anacleto",
    projecto: "POP-08",
    prazo: "2026-03-26T14:00",
    prioridade: "medio",
  },
  {
    titulo: "Actualizar documentacao tecnica dos agentes IA",
    descricao: "Rever e actualizar documentacao dos agentes IA em producao: arquitectura, endpoints, configuracoes e runbooks.",
    responsavel: "Belmiro",
    projecto: "POP-07",
    prazo: "2026-03-26T17:00",
    prioridade: "medio",
  },

  // ── Sexta 27/03 (5 tarefas — absorve weekend) ──
  {
    titulo: "Reuniao semanal POP-01 — Gestao de tarefas e relatorios",
    descricao: "Reuniao semanal de revisao: estado das tarefas, KPIs da semana, relatorio de progresso e planeamento da proxima semana.",
    responsavel: "Belmiro",
    projecto: "POP-01",
    prazo: "2026-03-27T09:00",
    prioridade: "alto",
  },
  {
    titulo: "Feedback e avaliacao semanal da equipa",
    descricao: "Sessao de feedback com membros da equipa: revisao de performance, alinhamento de expectativas e planos de desenvolvimento.",
    responsavel: "Belmiro",
    projecto: "POP-06",
    prazo: "2026-03-27T11:00",
    prioridade: "medio",
  },
  {
    titulo: "Planear campanha de marketing Q2",
    descricao: "Definir estrategia de marketing para Q2: canais, budget, metas e calendario de accoes. Alinhar com objectivos comerciais.",
    responsavel: "Ines",
    projecto: "POP-04",
    prazo: "2026-03-27T14:00",
    prioridade: "medio",
  },
  {
    titulo: "Backup semanal de sistemas e dados criticos",
    descricao: "Executar backup completo de todos os sistemas em producao, bases de dados e configuracoes. Verificar integridade dos backups.",
    responsavel: "Nelson",
    projecto: "POP-07",
    prazo: "2026-03-27T16:00",
    prioridade: "alto",
  },
  {
    titulo: "Relatorio semanal consolidado — enviar a gestao",
    descricao: "Compilar relatorio semanal com metricas chave, progresso dos projectos, riscos identificados e plano da proxima semana.",
    responsavel: "Belmiro",
    projecto: "POP-01",
    prazo: "2026-03-27T18:00",
    prioridade: "critico",
  },
];

// ── Helper: Create one task via the modal ──
async function createOneTask(page: Page, task: TaskDef, index: number): Promise<boolean> {
  try {
    console.log(`\n── Tarefa ${index + 1}/${TASKS.length}: ${task.titulo}`);

    // Click "Nova Tarefa"
    const novaBtn = page.locator('button:has-text("Nova Tarefa")').first();
    await novaBtn.waitFor({ state: "visible", timeout: 10000 });
    await novaBtn.click();
    await page.waitForTimeout(1000);

    // Wait for form to appear
    const form = page.locator("form").first();
    await form.waitFor({ state: "visible", timeout: 5000 });

    // Fill Titulo
    const tituloInput = form.locator('input[type="text"]').first();
    await tituloInput.fill(task.titulo);

    // Fill Descricao
    const descricaoTextarea = form.locator("textarea").first();
    await descricaoTextarea.fill(task.descricao);

    // Select Responsavel (first select in form)
    const selects = form.locator("select");
    const responsavelSelect = selects.nth(0);
    await responsavelSelect.selectOption(PEOPLE[task.responsavel]);

    // Select Projecto (second select)
    const projectoSelect = selects.nth(1);
    await projectoSelect.selectOption(PROJECTS[task.projecto]);

    // Fill Prazo (datetime-local input)
    const prazoInput = form.locator('input[type="datetime-local"]');
    await prazoInput.fill(task.prazo);

    // Select Prioridade (third select)
    const prioridadeSelect = selects.nth(2);
    await prioridadeSelect.selectOption(task.prioridade);

    // Screenshot before submit
    await page.screenshot({ path: path.join(SCREENSHOTS, `task-${index + 1}-filled.png`) });

    // Click "Criar" (submit button)
    const criarBtn = form.locator('button[type="submit"]');
    await criarBtn.click();

    // Wait for modal to close (overlay disappears)
    await page.waitForSelector(".fixed.inset-0.z-50", { state: "hidden", timeout: 10000 }).catch(async () => {
      // If overlay persists, try clicking outside or pressing Escape
      console.log("   ⚠ Overlay ainda visivel, tentando fechar...");
      await page.keyboard.press("Escape");
      await page.waitForTimeout(1000);
    });

    await page.waitForTimeout(500);
    console.log(`   ✓ Tarefa ${index + 1} criada!`);
    return true;
  } catch (err: any) {
    console.error(`   ✗ Erro na tarefa ${index + 1}: ${err.message}`);
    await page.screenshot({ path: path.join(SCREENSHOTS, `task-${index + 1}-error.png`) });

    // Try to close any open modal
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);

    // Check if overlay is still there
    const overlay = await page.locator(".fixed.inset-0.z-50").count();
    if (overlay > 0) {
      // Click Cancelar if visible
      const cancelBtn = page.locator('button:has-text("Cancelar")');
      if (await cancelBtn.isVisible().catch(() => false)) {
        await cancelBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    return false;
  }
}

// ── Main ──
async function main() {
  console.log("=== Weekly Plan: 13 Tarefas (24-27 Mar 2026) ===\n");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    // 1. Login
    console.log("1. Login...");
    await page.goto(`${URL}/auth`, { waitUntil: "networkidle" });
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ timeout: 15000 });
    console.log("   ✓ Logado!");

    // 2. Navigate to /tarefas
    console.log("2. Navegar para /tarefas...");
    await page.goto(`${URL}/tarefas`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    console.log("   ✓ Pagina de tarefas carregada");
    await page.screenshot({ path: path.join(SCREENSHOTS, "weekly-00-tarefas.png") });

    // 3. Create each task
    let success = 0;
    let failed = 0;

    for (let i = 0; i < TASKS.length; i++) {
      const ok = await createOneTask(page, TASKS[i], i);
      if (ok) success++;
      else failed++;
    }

    // 4. Final screenshot
    await page.screenshot({ path: path.join(SCREENSHOTS, "weekly-final.png"), fullPage: true });

    console.log(`\n=== RESULTADO ===`);
    console.log(`✓ Criadas: ${success}/${TASKS.length}`);
    if (failed > 0) console.log(`✗ Falharam: ${failed}`);
    console.log(`=================`);

  } catch (err: any) {
    console.error("ERRO FATAL:", err.message);
    await page.screenshot({ path: path.join(SCREENSHOTS, "weekly-fatal-error.png") });
  } finally {
    await browser.close();
  }
}

main();
ENDOFSCRIPT"));

exec