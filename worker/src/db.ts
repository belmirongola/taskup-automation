import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Env } from "./types";

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(env: Env): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  }
  return supabaseClient;
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

export async function getTarefas(
  env: Env,
  filters?: {
    estado?: string;
    prioridade?: string;
    limit?: number;
  }
) {
  const supabase = getSupabaseClient(env);
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

export async function getTarefa(env: Env, id: string) {
  const supabase = getSupabaseClient(env);
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
  const supabase = getSupabaseClient(env);
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
  id: string,
  updates: Record<string, any>
) {
  const supabase = getSupabaseClient(env);
  const { data, error } = await supabase
    .from("tarefas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTarefa(env: Env, id: string) {
  const supabase = getSupabaseClient(env);
  const { error } = await supabase.from("tarefas").delete().eq("id", id);

  if (error) throw error;
}

export async function getProjectos(
  env: Env,
  filters?: {
    estado?: string;
    limit?: number;
  }
) {
  const supabase = getSupabaseClient(env);
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

export async function getProjecto(env: Env, id: string) {
  const supabase = getSupabaseClient(env);
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
  projecto: {
    nome: string;
    descricao?: string;
    estado?: string;
    prazo?: string;
    [key: string]: any;
  }
) {
  const supabase = getSupabaseClient(env);
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
  id: string,
  updates: Record<string, any>
) {
  const supabase = getSupabaseClient(env);
  const { data, error } = await supabase
    .from("projectos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProjecto(env: Env, id: string) {
  const supabase = getSupabaseClient(env);
  const { error } = await supabase.from("projectos").delete().eq("id", id);

  if (error) throw error;
}
