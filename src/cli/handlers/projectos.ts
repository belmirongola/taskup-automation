import ora from "ora";
import { createClient } from "../../utils/client-factory.js";
import { formatTable, formatJSON, formatSuccess, formatError, formatWarning } from "../../utils/formatter.js";
import { ensureAuthenticatedWithAutoLogin } from "./auth.js";

export async function handleListProjectos(options: {
  estado?: string;
  limit?: number;
  format?: "table" | "json";
}): Promise<void> {
  await ensureAuthenticatedWithAutoLogin();
  const spinner = ora("Carregando projectos...").start();

  try {
    const client = await createClient();
    const projectos = await client.listProjectos({
      estado: options.estado,
      limit: options.limit || 20,
    });

    spinner.succeed();

    if (projectos.length === 0) {
      console.log(formatWarning("Nenhum projecto encontrado"));
      return;
    }

    if (options.format === "json") {
      console.log(formatJSON(projectos));
    } else {
      const rows = projectos.map((p: any) => [
        p.id.slice(0, 8),
        p.nome,
        p.estado || "-",
        p.prazo ? new Date(p.prazo).toLocaleDateString("pt-PT") : "-",
      ]);
      console.log(formatTable(["ID", "Nome", "Estado", "Prazo"], rows));
    }
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}

export async function handleCreateProjecto(options: {
  nome: string;
  descricao?: string;
  estado?: string;
  prazo?: string;
}): Promise<void> {
  await ensureAuthenticatedWithAutoLogin();

  if (!options.nome) {
    console.error(formatError("Nome é obrigatório"));
    process.exit(1);
  }

  const spinner = ora("Criando projecto...").start();

  try {
    const client = await createClient();
    const projecto = await client.createProjecto({
      nome: options.nome,
      descricao: options.descricao,
      estado: options.estado || "Activo",
      prazo: options.prazo,
    });

    spinner.succeed();
    console.log(formatSuccess(`Projecto criado: ${projecto.id}`));
    console.log(formatJSON(projecto));
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}

export async function handleUpdateProjecto(
  id: string,
  updates: Record<string, any>
): Promise<void> {
  await ensureAuthenticatedWithAutoLogin();

  if (!id) {
    console.error(formatError("ID do projecto é obrigatório"));
    process.exit(1);
  }

  const spinner = ora("Actualizando projecto...").start();

  try {
    const client = await createClient();
    const projecto = await client.updateProjecto(id, updates);
    spinner.succeed();
    console.log(formatSuccess(`Projecto actualizado`));
    console.log(formatJSON(projecto));
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}

export async function handleDeleteProjecto(id: string): Promise<void> {
  await ensureAuthenticatedWithAutoLogin();

  if (!id) {
    console.error(formatError("ID do projecto é obrigatório"));
    process.exit(1);
  }

  const spinner = ora("Deletando projecto...").start();

  try {
    const client = await createClient();
    await client.deleteProjecto(id);
    spinner.succeed();
    console.log(formatSuccess("Projecto deletado"));
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}

export async function handleGetProjecto(id: string): Promise<void> {
  await ensureAuthenticatedWithAutoLogin();

  if (!id) {
    console.error(formatError("ID do projecto é obrigatório"));
    process.exit(1);
  }

  const spinner = ora("Carregando projecto...").start();

  try {
    const client = await createClient();
    const projecto = await client.getProjecto(id);
    spinner.succeed();
    console.log(formatJSON(projecto));
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}
