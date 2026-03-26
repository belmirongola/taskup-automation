// ─── Plano Semanal 24-27 Março 2026 ─── 
// Implementa todas as tarefas do plano semanal no TaskUp

import { chromium } from "playwright";
import { login } from "../src/auth";
import { createTask } from "../src/tasks";
import { createProject, listProjects } from "../src/projects";
import { navigateTo } from "../src/navigation";
import type { CreateTaskInput } from "../src/types";

const CREDENTIALS = {
  email: "belmirongola@gmail.com",
  password: "MarcaDigital2026!",
};

const PROJECT_NAME = "Plano Semanal — Marca Digital";

// ─── Tarefas do Plano Semanal (corrigido) ───

const TASKS: CreateTaskInput[] = [
  // ══════════ TERÇA-FEIRA 24/03 (já realizado) ══════════
  {
    title: "Rascunho do Stack Tecnológico",
    description:
      "Criar rascunho inicial do stack tecnológico da Marca Digital. Listar todas as ferramentas actuais e candidatas. Identificar lacunas técnicas e dependências.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Concluído",
    startDate: "2026-03-24",
    endDate: "2026-03-24",
    tags: ["stack", "infraestrutura"],
  },
  {
    title: "Listar ferramentas e identificar lacunas",
    description:
      "Inventário completo das ferramentas em uso (frontend, backend, automação, dados, integrações). Mapear lacunas e ferramentas em falta para cobrir o stack completo.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Concluído",
    startDate: "2026-03-24",
    endDate: "2026-03-24",
    tags: ["stack", "auditoria"],
  },

  // ══════════ QUARTA-FEIRA 25/03 (hoje) ══════════
  {
    title: "Reunião POP-03 — Debriefing",
    description:
      "Reunião POP-03 (fluxo de produção, metodologia, base do PRD) já realizada dia 24. Consolidar notas, decisões e action items da reunião. Documentar outputs.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Concluído",
    startDate: "2026-03-24",
    endDate: "2026-03-25",
    tags: ["POP-03", "reunião", "produção"],
  },
  {
    title: "Finalizar documento do Stack Tecnológico",
    description:
      "Documento final do stack: automação, backend, frontend, dados, integrações. Incluir justificação de cada escolha, alternativas consideradas e roadmap de adopção. Ajustar com base nos outputs da reunião POP-03.",
    project: PROJECT_NAME,
    priority: "Crítica",
    status: "Pendente",
    startDate: "2026-03-25",
    endDate: "2026-03-25",
    tags: ["stack", "documentação", "entregável"],
  },
  {
    title: "Ajustar stack com outputs POP-03",
    description:
      "Rever o rascunho do stack à luz das decisões tomadas na reunião POP-03. Alinhar ferramentas com o fluxo de produção definido. Identificar ferramentas adicionais necessárias.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-25",
    endDate: "2026-03-25",
    tags: ["stack", "POP-03", "alinhamento"],
  },

  // ════════��═ QUINTA-FEIRA 26/03 ══════════
  {
    title: "Analisar POPs — Identificar processos automatizáveis",
    description:
      "Revisão detalhada de todos os POPs existentes. Identificar processos manuais repetitivos com potencial de automação. Categorizar por área (produção, vendas, gestão, comunicação).",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-26",
    endDate: "2026-03-26",
    tags: ["POPs", "automação", "análise"],
  },
  {
    title: "Definir Top 3-5 automações prioritárias",
    description:
      "Seleccionar as 3 a 5 automações com maior impacto. Criar matriz impacto vs esforço para cada uma. Incluir estimativa de tempo de implementação e dependências.",
    project: PROJECT_NAME,
    priority: "Crítica",
    status: "Pendente",
    startDate: "2026-03-26",
    endDate: "2026-03-26",
    tags: ["automação", "priorização", "entregável"],
  },
  {
    title: "Matriz Impacto vs Esforço — Automações",
    description:
      "Criar matriz visual de impacto vs esforço para todas as automações identificadas. Quick wins (alto impacto, baixo esforço) primeiro. Documentar critérios de avaliação.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-26",
    endDate: "2026-03-26",
    tags: ["automação", "análise", "framework"],
  },

  // ══════════ SEXTA-FEIRA 27/03 (tudo junto) ══════════
  {
    title: "Documentar automações prioritárias",
    description:
      "Documentação detalhada de cada automação prioritária: objectivo, ferramentas, fluxo, inputs/outputs, KPIs de sucesso. Formato pronto para implementação.",
    project: PROJECT_NAME,
    priority: "Crítica",
    status: "Pendente",
    startDate: "2026-03-27",
    endDate: "2026-03-27",
    tags: ["automação", "documentação", "entregável"],
  },
  {
    title: "Plano de implementação das automações",
    description:
      "Roadmap de implementação: fases, timelines, responsáveis, dependências. Alinhar com capacidade da equipa e prioridades do negócio.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-27",
    endDate: "2026-03-27",
    tags: ["automação", "planeamento", "roadmap"],
  },
  {
    title: "Alinhar automações com Micro-SaaS",
    description:
      "Mapear sinergias entre automações internas e oportunidades de Micro-SaaS. Identificar automações que podem ser produtizadas. Definir fronteira entre ferramenta interna e produto.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-27",
    endDate: "2026-03-27",
    tags: ["Micro-SaaS", "automação", "estratégia"],
  },
  {
    title: "Desenvolvimento técnico — TASCAP/CRM",
    description:
      "Sprint de desenvolvimento no TASCAP/CRM. Melhorias rápidas identificadas. Foco em funcionalidades que desbloqueiam automações prioritárias.",
    project: PROJECT_NAME,
    priority: "Alta",
    status: "Pendente",
    startDate: "2026-03-27",
    endDate: "2026-03-27",
    tags: ["TASCAP", "CRM", "desenvolvimento"],
  },
  {
    title: "Revisão semanal e planeamento",
    description:
      "Revisão completa da semana: o que foi feito, o que ficou por fazer, bloqueios encontrados. Ajustes estratégicos. Planear semana seguinte (30 Mar - 3 Abr). Actualizar prioridades.",
    project: PROJECT_NAME,
    priority: "Média",
    status: "Pendente",
    startDate: "2026-03-27",
    endDate: "2026-03-27",
    tags: ["revisão", "planeamento", "weekly"],
  },
];

async function main() {
  console.log("⚡ Plano Semanal → TaskUp");
  console.log(`📋 ${TASKS.length} tarefas a criar\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  try {
    // ─── Login ───
    console.log("🔐 Login...");
    await login(page, CREDENTIALS);
    console.log("✅ Autenticado\n");

    // ─── Verificar/Criar Projecto ───
    console.log(`📁 Verificando projecto "${PROJECT_NAME}"...`);
    const existingProjects = await listProjects(page);
    const projectExists = existingProjects.some(
      (p) => p.name.toLowerCase() === PROJECT_NAME.toLowerCase()
    );

    if (!projectExists) {
      console.log("   Projecto não existe. Criando...");
      await createProject(page, {
        name: PROJECT_NAME,
        description:
          "Plano semanal 24-27 Março 2026. Objectivo: Estruturar base tecnológica, eliminar bloqueios, definir direcção para automação e desenvolvimento.",
        startDate: "2026-03-24",
        endDate: "2026-03-27",
        status: "Activo",
        color: "Azul",
      });
      console.log("   ✅ Projecto criado!\n");
    } else {
      console.log("   ✅ Projecto já existe\n");
    }

    // ─── Criar Tarefas ───
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
        // Screenshot para debug
        await page.screenshot({
          path: `error-task-${i + 1}.png`,
          fullPage: true,
        });
      }

      // Pausa entre criações para não sobrecarregar
      await page.waitForTimeout(1_000);
    }

    // ─── Resumo ───
    console.log("\n" + "━".repeat(50));
    console.log("📊 RESUMO");
    console.log(`   ✅ Criadas: ${created}`);
    if (failed > 0) console.log(`   ❌ Falharam: ${failed}`);
    console.log(`   📁 Projecto: ${PROJECT_NAME}`);
    console.log("\n📅 Distribuição:");
    console.log("   Ter 24 → 2 tarefas (já concluídas)");
    console.log("   Qua 25 → 3 tarefas (hoje)");
    console.log("   Qui 26 → 3 tarefas");
    console.log("   Sex 27 → 5 tarefas");
    console.log("\n🎉 Plano semanal implementado!");
  } catch (error: any) {
    console.error("\n💥 Erro fatal:", error.message);
    await page.screenshot({ path: "fatal-error.png", fullPage: true });
  } finally {
    await browser.close();
  }
}

main();
