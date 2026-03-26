// ─── Plano Semanal v2 — Directo para tarefas ───

import { chromium } from "playwright";
import { login } from "../src/auth";
import { createTask } from "../src/tasks";
import { navigateTo } from "../src/navigation";
import type { CreateTaskInput } from "../src/types";

const CREDENTIALS = {
  email: "belmirongola@gmail.com",
  password: "MarcaDigital2026!",
};

const PROJECT_NAME = "Plano Semanal — Marca Digital";

const TASKS: CreateTaskInput[] = [
  // TERÇA 24 (concluídas)
  {
    title: "Rascunho do Stack Tecnológico",
    description: "Criar rascunho inicial do stack tecnológico da Marca Digital. Listar todas as ferramentas actuais e candidatas. Identificar lacunas técnicas e dependências.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Concluído",
    startDate: "2026-03-24",
    endDate: "2026-03-24",
    tags: ["stack", "infraestrutura"],
  },
  {
    title: "Listar ferramentas e identificar lacunas",
    description: "Inventário completo das ferramentas em uso (frontend, backend, automação, dados, integrações). Mapear lacunas e ferramentas em falta.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Concluído",
    startDate: "2026-03-24",
    endDate: "2026-03-24",
    tags: ["stack", "auditoria"],
  },
  // QUARTA 25 (hoje)
  {
    title: "Reunião POP-03 — Debriefing",
    description: "Consolidar notas, decisões e action items da reunião POP-03 (realizada dia 24). Documentar outputs do fluxo de produção, metodologia e base do PRD.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Concluído",
    startDate: "2026-03-24",
    endDate: "2026-03-25",
    tags: ["POP-03", "reunião"],
  },
  {
    title: "Finalizar documento do Stack Tecnológico",
    description: "Documento final do stack: automação, backend, frontend, dados, integrações. Justificação de cada escolha, alternativas e roadmap de adopção. Ajustar com outputs POP-03.",
    project: PROJECT_NAME,
    priority: "Crítica",
    status: "Pendente",
    startDate: "2026-03-25",
    endDate: "2026-03-25",
    tags: ["stack", "documentação", "entregável"],
  },
  {
    title: "Ajustar stack com outputs POP-03",
    description: "Rever stack à luz das decisões do POP-03. Alinhar ferramentas com fluxo de produção definido. Identificar ferramentas adicionais necessárias.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-25",
    endDate: "2026-03-25",
    tags: ["stack", "POP-03"],
  },
  // QUINTA 26
  {
    title: "Analisar POPs — Processos automatizáveis",
    description: "Revisão detalhada de todos os POPs. Identificar processos manuais repetitivos com potencial de automação. Categorizar por área.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-26",
    endDate: "2026-03-26",
    tags: ["POPs", "automação", "análise"],
  },
  {
    title: "Definir Top 3-5 automações prioritárias",
    description: "Seleccionar as 3-5 automações com maior impacto. Criar matriz impacto vs esforço. Estimativa de tempo e dependências.",
    project: PROJECT_NAME,
    priority: "Crítica",
    status: "Pendente",
    startDate: "2026-03-26",
    endDate: "2026-03-26",
    tags: ["automação", "priorização", "entregável"],
  },
  {
    title: "Matriz Impacto vs Esforço",
    description: "Matriz visual de impacto vs esforço para todas as automações. Quick wins primeiro. Documentar critérios.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-26",
    endDate: "2026-03-26",
    tags: ["automação", "framework"],
  },
  // SEXTA 27 (tudo concentrado)
  {
    title: "Documentar automações prioritárias",
    description: "Documentação detalhada: objectivo, ferramentas, fluxo, inputs/outputs, KPIs. Formato pronto para implementação.",
    project: PROJECT_NAME,
    priority: "Crítica",
    status: "Pendente",
    startDate: "2026-03-27",
    endDate: "2026-03-27",
    tags: ["automação", "documentação", "entregável"],
  },
  {
    title: "Plano de implementação das automações",
    description: "Roadmap: fases, timelines, responsáveis, dependências. Alinhar com capacidade da equipa.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-27",
    endDate: "2026-03-27",
    tags: ["automação", "roadmap"],
  },
  {
    title: "Alinhar automações com Micro-SaaS",
    description: "Mapear sinergias entre automações internas e oportunidades Micro-SaaS. Identificar automações produtizáveis. Definir fronteira interno vs produto.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-27",
    endDate: "2026-03-27",
    tags: ["Micro-SaaS", "estratégia"],
  },
  {
    title: "Desenvolvimento técnico — TASCAP/CRM",
    description: "Sprint de desenvolvimento no TASCAP/CRM. Melhorias rápidas. Foco em funcionalidades que desbloqueiam automações prioritárias.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-27",
    endDate: "2026-03-27",
    tags: ["TASCAP", "CRM", "desenvolvimento"],
  },
  {
    title: "Revisão semanal e planeamento",
    description: "Revisão da semana: feito vs por fazer, bloqueios. Ajustes estratégicos. Planear semana 30 Mar - 3 Abr. Actualizar prioridades.",
    project: PROJECT_NAME,
    priority: "Média",
    status: "Pendente",
    startDate: "2026-03-27",
    endDate: "2026-03-27",
    tags: ["revisão", "weekly"],
  },
];

async function main() {
  console.log("⚡ Plano Semanal → TaskUp (v2)");
  console.log(`📋 ${TASKS.length} tarefas a criar\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  try {
    // Login
    console.log("🔐 Login...");
    await login(page, CREDENTIALS);
    console.log("✅ Autenticado\n");

    // Screenshot após login para debug
    await page.screenshot({ path: "screenshots/after-login.png", fullPage: true });

    // Navegar para lista de tarefas
    console.log("📋 Navegando para tarefas...");
    await navigateTo(page, "lista");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/tasks-page.png", fullPage: true });
    console.log("✅ Na página de tarefas\n");

    console.log("━".repeat(50));
    console.log("📌 Criando tarefas...\n");

    let created = 0;
    let failed = 0;

    for (let i = 0; i < TASKS.length; i++) {
      const task = TASKS[i];
      const dayLabel = task.startDate === "2026-03-24" ? "Ter 24"
        : task.startDate === "2026-03-25" ? "Qua 25"
        : task.startDate === "2026-03-26" ? "Qui 26"
        : "Sex 27";

      console.log(`[${i + 1}/${TASKS.length}] ${dayLabel} | ${task.title}`);

      try {
        await createTask(page, task);
        created++;
        console.log(`   ✅ Criada (${task.priority} | ${task.status})`);
      } catch (err: any) {
        failed++;
        console.error(`   ❌ Falhou: ${err.message}`);
        await page.screenshot({
          path: `screenshots/error-task-${i + 1}.png`,
          fullPage: true,
        });
      }

      // Pausa entre criações
      await page.waitForTimeout(1_500);
    }

    // Resumo
    console.log("\n" + "━".repeat(50));
    console.log("📊 RESUMO");
    console.log(`   ✅ Criadas: ${created}`);
    if (failed > 0) console.log(`   ❌ Falharam: ${failed}`);
    console.log(`   📁 Projecto: ${PROJECT_NAME}`);
    console.log("\n📅 Distribuição:");
    console.log("   Ter 24 → 2 tarefas (concluídas)");
    console.log("   Qua 25 → 3 tarefas (hoje)");
    console.log("   Qui 26 → 3 tarefas");
    console.log("   Sex 27 → 5 tarefas");
    console.log("\n🎉 Done!");
  } catch (error: any) {
    console.error("\n💥 Erro fatal:", error.message);
    await page.screenshot({ path: "screenshots/fatal-error.png", fullPage: true });
    throw error;
  } finally {
    await browser.close();
  }
}

main();
