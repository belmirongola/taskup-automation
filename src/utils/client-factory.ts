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
  // Priority 1: TASKUP_API_URL (Worker API)
  const apiUrl = process.env.TASKUP_API_URL;
  if (apiUrl) {
    return new TaskUpAPIClient(apiUrl);
  }

  // Priority 2: Supabase credenciais (directo)
  const supabaseConfig = loadSupabaseConfig();
  if (supabaseConfig && supabaseConfig.url && supabaseConfig.anonKey) {
    return new TaskUpClient();
  }

  // Priority 3: Supabase env vars
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return new TaskUpClient();
  }

  throw new Error(
    "Nenhuma configuração de cliente encontrada. Configure:\n" +
      "1. TASKUP_API_URL (para Worker) ou\n" +
      "2. SUPABASE_URL + SUPABASE_ANON_KEY (para acesso directo) ou\n" +
      "3. taskup config set supabase-url <url> && taskup config set supabase-key <key>"
  );
}

export function getClientType(): "api" | "supabase" {
  if (process.env.TASKUP_API_URL) {
    return "api";
  }
  return "supabase";
}
