/**
 * TaskUp API Client — via Cloudflare Worker
 *
 * Comunica com o Worker TaskUp em vez de Supabase directamente.
 * Credenciais Supabase são guardadas apenas no servidor.
 */

import { loadAuth } from "../utils/config.js";

export class TaskUpAPIClient {
  private apiUrl: string;
  private token: string | null = null;

  constructor(apiUrl = "http://localhost:8787") {
    this.apiUrl = apiUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  async login(email: string, password: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json()) as any;

    if (!data.success) {
      throw new Error(data.error || "Login failed");
    }

    this.token = data.data?.token || null;
  }

  async listTarefas(filters?: {
    estado?: string;
    prioridade?: string;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.prioridade) params.append("prioridade", filters.prioridade);
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await fetch(
      `${this.apiUrl}/tarefas?${params.toString()}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    const data = (await response.json()) as any;
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async getTarefa(id: string) {
    const response = await fetch(`${this.apiUrl}/tarefas/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data = (await response.json()) as any;
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async createTarefa(tarefa: {
    titulo: string;
    descricao?: string;
    estado?: string;
    prioridade?: string;
    prazo?: string;
    projecto_id?: string;
    responsavel_id?: string;
    [key: string]: any;
  }) {
    const response = await fetch(`${this.apiUrl}/tarefas`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(tarefa),
    });

    const data = (await response.json()) as any;
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async updateTarefa(id: string, updates: Record<string, any>) {
    const response = await fetch(`${this.apiUrl}/tarefas/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    const data = (await response.json()) as any;
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async deleteTarefa(id: string) {
    const response = await fetch(`${this.apiUrl}/tarefas/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    const data = (await response.json()) as any;
    if (!data.success) throw new Error(data.error);
  }

  async listProjectos(filters?: { estado?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await fetch(
      `${this.apiUrl}/projectos?${params.toString()}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    const data = (await response.json()) as any;
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async getProjecto(id: string) {
    const response = await fetch(`${this.apiUrl}/projectos/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const data = (await response.json()) as any;
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async createProjecto(projecto: {
    nome: string;
    descricao?: string;
    estado?: string;
    prazo?: string;
    [key: string]: any;
  }) {
    const response = await fetch(`${this.apiUrl}/projectos`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(projecto),
    });

    const data = (await response.json()) as any;
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async updateProjecto(id: string, updates: Record<string, any>) {
    const response = await fetch(`${this.apiUrl}/projectos/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    const data = (await response.json()) as any;
    if (!data.success) throw new Error(data.error);
    return data.data;
  }

  async deleteProjecto(id: string) {
    const response = await fetch(`${this.apiUrl}/projectos/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    const data = (await response.json()) as any;
    if (!data.success) throw new Error(data.error);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  setApiUrl(url: string): void {
    this.apiUrl = url.replace(/\/$/, "");
  }

  setToken(token: string): void {
    this.token = token;
  }
}

// ─── Singleton ───

let _client: TaskUpAPIClient | null = null;

export async function getAPIClient(apiUrl?: string): Promise<TaskUpAPIClient> {
  if (!_client) {
    _client = new TaskUpAPIClient(apiUrl);
  }

  const auth = loadAuth();
  if (auth) {
    // Para login via Worker, precisaríamos de recuperar o token
    // Por enquanto, mantemos compatibilidade com auth guardada
  }

  return _client;
}
