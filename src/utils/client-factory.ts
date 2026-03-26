/**
 * Factory para seleccionar cliente TaskUp
 *
 * Prioridade:
 * 1. Se TASKUP_API_URL definida → use API cliente (Worker)
 * 2. Senão → use Worker padrão (taskup-api.marca-digital.workers.dev)
 *
 * Usa getAPIClient() (singleton com auto-login) para garantir autenticação.
 */

import { TaskUpClient } from "../api/client.js";
import { TaskUpAPIClient, getAPIClient } from "../api/client-api.js";
import { loadSupabaseConfig } from "./config.js";

export type TaskUpClientType = TaskUpClient | TaskUpAPIClient;

/**
 * Retorna um cliente autenticado (async).
 * Usa o singleton getAPIClient() que faz auto-login com credenciais guardadas.
 */
export async function createClient(): Promise<TaskUpClientType> {
  const apiUrl = process.env.TASKUP_API_URL || "https://taskup-api.marca-digital.workers.dev";
  return getAPIClient(apiUrl);
}

export function getClientType(): "api" | "supabase" {
  if (process.env.TASKUP_API_URL) {
    return "api";
  }
  return "api";
}
