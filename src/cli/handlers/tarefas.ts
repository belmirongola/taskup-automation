import ora from "ora";
import { createClient } from "../../utils/client-factory.js";
import { formatTable, formatJSON, formatSuccess, formatError, formatWarning } from "../../utils/formatter.js";
import { ensureAuthenticatedWithAutoLogin } from "./auth.js";

export async function handleListTarefas(options: {
  estado?: string;
  prioridade?: string;
  responsavel?: string;
  limit?: number;
  format?: "table" | "json";
}): Promise<void> {
  await ensureAuthenticatedWithAutoLogin();
  const spinner = ora("Carregando tarefas...").start();

  try {
    const client = await createClient();
    const tarefas = await client.listTarefas({
      estado: options.estado,
      prioridade: options.prioridade,
      responsavel_id: options.responsavel,
      limit: options.limit || 20,
    });

    spinner.succeed();

    if (tarefas.length === 0) {
      console.log(formatWarning("Nenhuma tarefa encontrada"));
      return;
    }

    if (options.format === "json") {
      console.log(formatJSON(tarefas));
    } else {
      const rows = tarefas.map((t: any) => [
        t.id.slice(0, 8),
        t.titulo,
        t.estado || "-",
        t.prioridade || "-",
        t.prazo ? new Date(t.prazo).toLocaleDateString("pt-PT") : "-",
      ]);
      console.log(formatTable(["ID", "Título", "Estado", "Prioridade", "Prazo"], rows));
    }
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}

export async function handleCreateTarefa(options: {
  titulo: string;
  descricao?: string;
  prioridade?: string;
  estado?: string;
  prazo?: string;
}): Promise<void> {
  await ensureAuthenticatedWithAutoLogin();

  if (!options.titulo) {
    console.error(formatError("Título é obrigatório"));
    process.exit(1);
  }

  const spinner = ora("Criando tarefa...").start();

  try {
    const client = await createClient();
    const tarefa = await client.createTarefa({
      titulo: options.titulo,
      descricao: options.descricao,
      prioridade: options.prioridade || "Média",
      estado: options.estado || "Pendente",
      prazo: options.prazo,
    });

    spinner.succeed();
    console.log(formatSuccess(`Tarefa criada: ${tarefa.id}`));
    console.log(formatJSON(tarefa));
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}

export async function handleUpdateTarefa(
  id: string,
  updates: Record<string, any>
): Promise<void> {
  await ensureAuthenticatedWithAutoLogin();

  if (!id) {
    console.error(formatError("ID da tarefa é obrigatório"));
    process.exit(1);
  }

  const spinner = ora("Actualizando tarefa...").start();

  try {
    const client = await createClient();
    const tarefa = await client.updateTarefa(id, updates);
    spinner.succeed();
    console.log(formatSuccess(`Tarefa actualizada`));
    console.log(formatJSON(tarefa));
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}

export async function handleDeleteTarefa(id: string): Promise<void> {
  await ensureAuthenticatedWithAutoLogin();

  if (!id) {
    console.error(formatError("ID da tarefa é obrigatório"));
    process.exit(1);
  }

  const spinner = ora("Deletando tarefa...").start();

  try {
    const client = await createClient();
    await client.deleteTarefa(id);
    spinner.succeed();
    console.log(formatSuccess("Tarefa deletada"));
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}

export async function handleGetTarefa(id: string, format?: "json"): Promise<void> {
  await ensureAuthenticatedWithAutoLogin();

  if (!id) {
    console.error(formatError("ID da tarefa é obrigatório"));
    process.exit(1);
  }

  const spinner = ora("Carregando tarefa...").start();

  try {
    const client = await createClient();
    const tarefa = await client.getTarefa(id);
    spinner.succeed();

    if (format === "json") {
      console.log(formatJSON(tarefa));
    } else {
      console.log(formatJSON(tarefa));
    }
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}
