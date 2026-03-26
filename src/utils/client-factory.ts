/**
 * Factory para seleccionar cliente TaskUp
 *
 * Prioridade:
 * 1. Se TASKUP_API_URL definida → use API cliente (Worker)
 * 2. Se credenciais Supabase configuradas → use cliente Supabase directo
 * 3. Se Supabase Service Key em env → use cliente Supabase directo
 * 4. Erro: nenhuma configuração disponível
 */

import { TaskUpClient } from "../api/client.js";
import { TaskUpAPIClient } from "../api/client-api.js";
import { loadSupabaseConfig } from "./config.js";

export type TaskUpClientType = TaskUpClient | TaskUpAPIClient;

export function createClient(): TaskUpClientType {
  // Priority 1: TASKUP_API_URL (Worker API - custom)
  const apiUrl = process.env.TASKUP_API_URL;
  if (apiUrl) {
    return new TaskUpAPIClient(apiUrl);
  }

  // Priority 2: Default Worker API (https://taskup-api.marca-digital.workers.dev)
  // Se a variável não foi definida, usa o padrão
  return new TaskUpAPIClient("https://taskup-api.marca-digital.workers.dev");

  // Priority 3: Supabase credenciais (directo) - FALLBACK se worker não estiver disponível
  // Isto seria usado apenas se o worker estivesse offline
  // const supabaseConfig = loadSupabaseConfig();
  // if (supabaseConfig && supabaseConfig.url && supabaseConfig.anonKey) {
  //   return new TaskUpClient();
  // }

  // throw new Error("Worker não está disponível e nenhuma configuração Supabase encontrada");
}

export function getClientType(): "api" | "supabase" {
  if (process.env.TASKUP_API_URL) {
    return "api";
  }
  return "supabase";
}
