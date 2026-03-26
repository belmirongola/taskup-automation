export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;
  CACHE: KVNamespace;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    nome?: string;
  };
  error?: string;
}

export interface Task {
  id: string;
  titulo: string;
  descricao?: string;
  estado: string;
  prioridade?: string;
  prazo?: string;
  responsavel_id?: string;
  projecto_id?: string;
  criado_em: string;
  actualizado_em: string;
}

export interface Project {
  id: string;
  nome: string;
  descricao?: string;
  estado: string;
  prazo?: string;
  criado_em: string;
  actualizado_em: string;
}

export interface User {
  id: string;
  email: string;
  nome: string;
  papel: string;
  activo: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}
