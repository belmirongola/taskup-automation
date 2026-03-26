/**
 * TaskUp API Client — Supabase direct.
 *
 * Tables (PT, grafia pré-acordo):
 *   tarefas:      id, titulo, descricao, estado, prioridade, prazo, responsavel_id, projecto_id, criado_por, motivo_cancelamento, posicao, criado_em, actualizado_em, search_vector
 *   projectos:    id, nome, descricao, estado, criado_por, prazo, criado_em, actualizado_em, search_vector
 *   reunioes:     id, titulo, data_reuniao, duracao_minutos, presentes, transcricao, acta, estado, aprovada_por, aprovada_em, fibery_synced, fibery_doc_id, notas, criado_por, criado_em, actualizado_em
 *   notificacoes: id, user_id, tipo, titulo, mensagem, tarefa_id, lida, canal, criado_em
 *   users:        id, nome, email, papel, whatsapp_numero, avatar_url, activo, onboarding_concluido, onboarding_concluido_em, criado_em, actualizado_em
 */

import "dotenv/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export class TaskUpClient {
  private supabase: SupabaseClient;
  private userId: string | null = null;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  // ═══════════════════════════════════════
  //  Auth
  // ═════════════════════════════��═════════

  async login(email?: string, password?: string): Promise<void> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email || process.env.TASKUP_EMAIL!,
      password: password || process.env.TASKUP_PASSWORD!,
    });
    if (error) throw new Error(`Login failed: ${error.message}`);
    this.userId = data.user.id;
  }

  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  // ═══════════════════════════════════════
  //  Tarefas
  // ═══════════════════════════════════════

  async listTarefas(filters?: {
    estado?: string;
    projecto_id?: string;
    responsavel_id?: string;
    prioridade?: string;
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDir?: "asc" | "desc";
  }) {
    let query = this.supabase.from("tarefas").select("*");
    if (filters?.estado) query = query.eq("estado", filters.estado);
    if (filters?.projecto_id) query = query.eq("projecto_id", filters.projecto_id);
    if (filters?.responsavel_id) query = query.eq("responsavel_id", filters.responsavel_id);
    if (filters?.prioridade) query = query.eq("prioridade", filters.prioridade);
    query = query.order(filters?.orderBy || "criado_em", {
      ascending: (filters?.orderDir || "desc") === "asc",
    });
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    const { data, error } = await query;
    if (error) throw error;
    return data!;
  }

  async getTarefa(id: string) {
    const { data, error } = await this.supabase.from("tarefas").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async createTarefa(tarefa: {
    titulo: string;
    descricao?: string;
    estado?: string;
    prioridade?: string;
    prazo?: string;
    projecto_id?: string;
    responsavel_id?: string;
    posicao?: number;
    [key: string]: any;
  }) {
    const { data, error } = await this.supabase.from("tarefas").insert(tarefa).select().single();
    if (error) throw error;
    return data;
  }

  async updateTarefa(id: string, updates: Record<string, any>) {
    const { data, error } = await this.supabase.from("tarefas").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteTarefa(id: string) {
    const { error } = await this.supabase.from("tarefas").delete().eq("id", id);
    if (error) throw error;
  }

  // ═══════════════════════════════════════
  //  Projectos
  // ═══════════════════════════════════════

  async listProjectos(filters?: { estado?: string; limit?: number }) {
    let query = this.supabase.from("projectos").select("*").order("criado_em", { ascending: false });
    if (filters?.estado) query = query.eq("estado", filters.estado);
    if (filters?.limit) query = query.limit(filters.limit);
    const { data, error } = await query;
    if (error) throw error;
    return data!;
  }

  async getProjecto(id: string) {
    const { data, error } = await this.supabase.from("projectos").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async createProjecto(projecto: {
    nome: string;
    descricao?: string;
    estado?: string;
    prazo?: string;
    [key: string]: any;
  }) {
    const { data, error } = await this.supabase.from("projectos").insert(projecto).select().single();
    if (error) throw error;
    return data;
  }

  async updateProjecto(id: string, updates: Record<string, any>) {
    const { data, error } = await this.supabase.from("projectos").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteProjecto(id: string) {
    const { error } = await this.supabase.from("projectos").delete().eq("id", id);
    if (error) throw error;
  }

  // ═══════════════════════════════════════
  //  Reuniões
  // ═══════════════════════════════════════

  async listReunioes(filters?: { estado?: string; limit?: number; upcoming?: boolean }) {
    let query = this.supabase.from("reunioes").select("*").order("data_reuniao", { ascending: false });
    if (filters?.estado) query = query.eq("estado", filters.estado);
    if (filters?.upcoming) query = query.gte("data_reuniao", new Date().toISOString());
    if (filters?.limit) query = query.limit(filters.limit);
    const { data, error } = await query;
    if (error) throw error;
    return data!;
  }

  async getReuniao(id: string) {
    const { data, error } = await this.supabase.from("reunioes").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async createReuniao(reuniao: {
    titulo: string;
    data_reuniao?: string;
    duracao_minutos?: number;
    presentes?: string[];
    notas?: string;
    estado?: string;
    [key: string]: any;
  }) {
    const { data, error } = await this.supabase.from("reunioes").insert(reuniao).select().single();
    if (error) throw error;
    return data;
  }

  async updateReuniao(id: string, updates: Record<string, any>) {
    const { data, error } = await this.supabase.from("reunioes").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteReuniao(id: string) {
    const { error } = await this.supabase.from("reunioes").delete().eq("id", id);
    if (error) throw error;
  }

  // ═══════════════════════════════════════
  //  Users
  // ═══════════════════════════════════════

  async listUsers(filters?: { papel?: string; activo?: boolean }) {
    let query = this.supabase.from("users").select("*");
    if (filters?.papel) query = query.eq("papel", filters.papel);
    if (filters?.activo !== undefined) query = query.eq("activo", filters.activo);
    const { data, error } = await query;
    if (error) throw error;
    return data!;
  }

  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase.from("users").select("*").eq("id", userId).single();
    if (error) throw error;
    return data;
  }

  async updateUser(userId: string, updates: Record<string, any>) {
    const { data, error } = await this.supabase.from("users").update(updates).eq("id", userId).select().single();
    if (error) throw error;
    return data;
  }

  // ═══════════════════════════════════════
  //  Notificações
  // ═══════════════════════════════════════

  async listNotificacoes(filters?: { lida?: boolean; tipo?: string; limit?: number }) {
    let query = this.supabase.from("notificacoes").select("*").order("criado_em", { ascending: false });
    if (filters?.lida !== undefined) query = query.eq("lida", filters.lida);
    if (filters?.tipo) query = query.eq("tipo", filters.tipo);
    if (filters?.limit) query = query.limit(filters.limit);
    const { data, error } = await query;
    if (error) throw error;
    return data!;
  }

  async markNotificacaoRead(id: string) {
    const { data, error } = await this.supabase.from("notificacoes").update({ lida: true }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async markAllNotificacoesRead() {
    const { data, error } = await this.supabase
      .from("notificacoes")
      .update({ lida: true })
      .eq("user_id", this.userId!)
      .eq("lida", false)
      .select();
    if (error) throw error;
    return data;
  }

  // ═══════════════════════════════════════
  //  Raw access
  // ═══════════════════════════════════════

  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }

  getUserId(): string | null {
    return this.userId;
  }
}

// ─── Singleton ───

let _client: TaskUpClient | null = null;

export async function getClient(): Promise<TaskUpClient> {
  if (!_client) {
    _client = new TaskUpClient();
    await _client.login();
  }
  return _client;
}
