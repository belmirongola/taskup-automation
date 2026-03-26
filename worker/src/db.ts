import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Env } from "./types";

/**
 * Create a Supabase client authenticated with the user's access token.
 * This replaces the old service_role approach — no more hardcoded admin keys.
 * RLS policies apply normally, scoped to the authenticated user.
 */
export function getSupabaseClient(env: Env, userToken?: string): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: userToken
        ? { Authorization: `Bearer ${userToken}` }
        : {},
    },
  });
}

export async function authenticateUser(
  env: Env,
  email: string,
  password: string
): Promise<{ token: string; user: any } | null> {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return null;
  }

  return {
    token: data.session?.access_token || "",
    user: data.user,
  };
}

// ─── TAREFAS ────────────────────────────────────────────────

export async function getTarefas(
  env: Env,
  userToken: string,
  filters?: {
    estado?: string;
    prioridade?: string;
    limit?: number;
  }
) {
  const supabase = getSupabaseClient(env, userToken);
  let query = supabase.from("tarefas").select("*");

  if (filters?.estado) {
    query = query.eq("estado", filters.estado);
  }
  if (filters?.prioridade) {
    query = query.eq("prioridade", filters.prioridade);
  }

  query = query.order("criado_em", { ascending: false });

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getTarefa(env: Env, userToken: string, id: string) {
  const supabase = getSupabaseClient(env, userToken);
  const { data, error } = await supabase
    .from("tarefas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTarefa(
  env: Env,
  userToken: string,
  tarefa: {
    titulo: string;
    descricao?: string;
    estado?: string;
    prioridade?: string;
    prazo?: string;
    projecto_id?: string;
    responsavel_id?: string;
    [key: string]: any;
  }
) {
  const supabase = getSupabaseClient(env, userToken);
  const { data, error } = await supabase
    .from("tarefas")
    .insert(tarefa)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTarefa(
  env: Env,
  userToken: string,
  id: string,
  updates: Record<string, any>
) {
  const supabase = getSupabaseClient(env, userToken);
  const { data, error } = await supabase
    .from("tarefas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTarefa(env: Env, userToken: string, id: string) {
  const supabase = getSupabaseClient(env, userToken);
  const { error } = await supabase.from("tarefas").delete().eq("id", id);

  if (error) throw error;
}

// ─── PROJECTOS ──────────────────────────────────────────────

export async function getProjectos(
  env: Env,
  userToken: string,
  filters?: {
    estado?: string;
    limit?: number;
  }
) {
  const supabase = getSupabaseClient(env, userToken);
  let query = supabase.from("projectos").select("*");

  if (filters?.estado) {
    query = query.eq("estado", filters.estado);
  }

  query = query.order("criado_em", { ascending: false });

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProjecto(env: Env, userToken: string, id: string) {
  const supabase = getSupabaseClient(env, userToken);
  const { data, error } = await supabase
    .from("projectos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProjecto(
  env: Env,
  userToken: string,
  projecto: {
    nome: string;
    descricao?: string;
    estado?: string;
    prazo?: string;
    [key: string]: any;
  }
) {
  const supabase = getSupabaseClient(env, userToken);
  const { data, error } = await supabase
    .from("projectos")
    .insert(projecto)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProjecto(
  env: Env,
  userToken: string,
  id: string,
  updates: Record<string, any>
) {
  const supabase = getSupabaseClient(env, userToken);
  const { data, error } = await supabase
    .from("projectos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProjecto(env: Env, userToken: string, id: string) {
  const supabase = getSupabaseClient(env, userToken);
  const { error } = await supabase.from("projectos").delete().eq("id", id);

  if (error) throw error;
}
