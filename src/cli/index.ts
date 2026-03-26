#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import {
  handleLogin,
  handleLogout,
  handleWhoami,
} from "./handlers/auth.js";
import {
  handleListTarefas,
  handleCreateTarefa,
  handleUpdateTarefa,
  handleDeleteTarefa,
  handleGetTarefa,
} from "./handlers/tarefas.js";
import {
  handleListProjectos,
  handleCreateProjecto,
  handleUpdateProjecto,
  handleDeleteProjecto,
  handleGetProjecto,
} from "./handlers/projectos.js";
import { handleConfigSet, handleConfigGet } from "./handlers/config.js";

const pkg = {
  name: "taskup-cli",
  version: "1.0.0",
};

console.log(chalk.bold.cyan(`\n🚀 TaskUp CLI v${pkg.version}\n`));

const commandHandler = yargs(hideBin(process.argv))
  // ═══════════════════════════════════════
  //  AUTH Commands
  // ═══════════════════════════════════════
  .command(
    "login",
    "Autenticar na plataforma",
    (y) =>
      y
        .option("email", { type: "string", alias: "e", describe: "Email do utilizador" })
        .option("password", { type: "string", alias: "p", describe: "Password (prompt se não fornecido)" }),
    (argv) => handleLogin(argv.email as string, argv.password as string)
  )
  .command("logout", "Desautenticar", {}, () => handleLogout())
  .command("whoami", "Ver utilizador autenticado", {}, () => handleWhoami())

  // ═══════════════════════════════════════
  //  TAREFAS Commands
  // ═══════════════════════════════════════
  .command(
    "tasks-list",
    "Listar tarefas",
    (y) =>
      y
        .option("estado", { type: "string", describe: 'Estado (ex: "Pendente", "Em Progresso")' })
        .option("prioridade", { type: "string", describe: 'Prioridade (ex: "Alta", "Média")' })
        .option("responsavel", { type: "string", describe: "ID do responsável" })
        .option("limit", { type: "number", default: 20, describe: "Limite de resultados" })
        .option("format", { type: "string", default: "table", describe: "Formato (table|json)" }),
    (argv) =>
      handleListTarefas({
        estado: argv.estado as string,
        prioridade: argv.prioridade as string,
        responsavel: argv.responsavel as string,
        limit: argv.limit as number,
        format: argv.format as "table" | "json",
      })
  )
  .command(
    "tasks-create",
    "Criar tarefa",
    (y) =>
      y
        .option("titulo", { type: "string", alias: "t", describe: "Título (obrigatório)" })
        .option("descricao", { type: "string", alias: "d", describe: "Descrição" })
        .option("prioridade", { type: "string", describe: "Prioridade (Baixa|Média|Alta|Crítica)" })
        .option("estado", { type: "string", describe: "Estado inicial" })
        .option("prazo", { type: "string", describe: "Data prazo (YYYY-MM-DD)" })
        .demandOption("titulo"),
    (argv) =>
      handleCreateTarefa({
        titulo: argv.titulo as string,
        descricao: argv.descricao as string,
        prioridade: argv.prioridade as string,
        estado: argv.estado as string,
        prazo: argv.prazo as string,
      })
  )
  .command(
    "tasks-update <id>",
    "Actualizar tarefa",
    (y) => y.positional("id", { describe: "ID da tarefa" }),
    (argv) => {
      const updates: Record<string, any> = {};
      if (argv.titulo) updates.titulo = argv.titulo;
      if (argv.descricao) updates.descricao = argv.descricao;
      if (argv.estado) updates.estado = argv.estado;
      if (argv.prioridade) updates.prioridade = argv.prioridade;
      if (argv.prazo) updates.prazo = argv.prazo;
      handleUpdateTarefa(argv.id as string, updates);
    }
  )
  .command(
    "tasks-delete <id>",
    "Deletar tarefa",
    (y) => y.positional("id", { describe: "ID da tarefa" }),
    (argv) => handleDeleteTarefa(argv.id as string)
  )
  .command(
    "tasks-get <id>",
    "Ver tarefa",
    (y) => y.positional("id", { describe: "ID da tarefa" }),
    (argv) => handleGetTarefa(argv.id as string)
  )

  // ═══════════════════════════════════════
  //  PROJECTOS Commands
  // ═══════════════════════════════════════
  .command(
    "projects-list",
    "Listar projectos",
    (y) =>
      y
        .option("estado", { type: "string", describe: 'Estado (ex: "Activo", "Concluído")' })
        .option("limit", { type: "number", default: 20, describe: "Limite de resultados" })
        .option("format", { type: "string", default: "table", describe: "Formato (table|json)" }),
    (argv) =>
      handleListProjectos({
        estado: argv.estado as string,
        limit: argv.limit as number,
        format: argv.format as "table" | "json",
      })
  )
  .command(
    "projects-create",
    "Criar projecto",
    (y) =>
      y
        .option("nome", { type: "string", alias: "n", describe: "Nome (obrigatório)" })
        .option("descricao", { type: "string", alias: "d", describe: "Descrição" })
        .option("estado", { type: "string", describe: "Estado inicial (Activo|Em Pausa|Concluído|Cancelado)" })
        .option("prazo", { type: "string", describe: "Data prazo (YYYY-MM-DD)" })
        .demandOption("nome"),
    (argv) =>
      handleCreateProjecto({
        nome: argv.nome as string,
        descricao: argv.descricao as string,
        estado: argv.estado as string,
        prazo: argv.prazo as string,
      })
  )
  .command(
    "projects-update <id>",
    "Actualizar projecto",
    (y) => y.positional("id", { describe: "ID do projecto" }),
    (argv) => {
      const updates: Record<string, any> = {};
      if (argv.nome) updates.nome = argv.nome;
      if (argv.descricao) updates.descricao = argv.descricao;
      if (argv.estado) updates.estado = argv.estado;
      if (argv.prazo) updates.prazo = argv.prazo;
      handleUpdateProjecto(argv.id as string, updates);
    }
  )
  .command(
    "projects-delete <id>",
    "Deletar projecto",
    (y) => y.positional("id", { describe: "ID do projecto" }),
    (argv) => handleDeleteProjecto(argv.id as string)
  )
  .command(
    "projects-get <id>",
    "Ver projecto",
    (y) => y.positional("id", { describe: "ID do projecto" }),
    (argv) => handleGetProjecto(argv.id as string)
  )

  // ═══════════════════════════════════════
  //  CONFIG Commands
  // ═══════════════════════════════════════
  .command(
    "config",
    "Gerenciar configuração",
    (y) =>
      y
        .command(
          "set <key> <value>",
          "Configurar variáveis",
          (y) =>
            y
              .positional("key", {
                describe: "Chave (supabase-url|supabase-key)",
              })
              .positional("value", { describe: "Valor" }),
          (argv) => handleConfigSet(argv.key as string, argv.value as string)
        )
        .command(
          "get [key]",
          "Ver configuração",
          (y) => y.positional("key", { describe: "Chave (opcional)" }),
          (argv) => handleConfigGet(argv.key as string)
        ),
    () => {} // config is a group, not a command
  )

  // ═══════════════════════════════════════
  //  Global Options
  // ═══════════════════════════════════════
  .option("help", { alias: "h", describe: "Mostrar ajuda" })
  .strict()
  .demandCommand(1, "Escolha um comando");

commandHandler.parse();
