// ─── Tipos para automação TaskUp ───

export interface Credentials {
  email: string;
  password: string;
}

export type Priority = "Baixa" | "Média" | "Alta" | "Crítica";

export type TaskStatus =
  | "Pendente"
  | "Em Progresso"
  | "Em Revisão"
  | "Concluído";

export type ProjectStatus =
  | "Activo"
  | "Em Pausa"
  | "Concluído"
  | "Cancelado";

export type ProjectColor =
  | "Azul"
  | "Verde"
  | "Roxo"
  | "Vermelho"
  | "Laranja"
  | "Rosa";

export interface CreateTaskInput {
  title: string;
  description?: string;
  project?: string;
  priority?: Priority;
  assignee?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status?: TaskStatus;
  tags?: string[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {}

export interface CreateProjectInput {
  name: string;
  description?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  status?: ProjectStatus;
  color?: ProjectColor;
}

export interface TaskInfo {
  title: string;
  project: string;
  priority: Priority;
  status: TaskStatus;
  assignee?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

export interface ProjectInfo {
  name: string;
  description?: string;
  status: ProjectStatus;
  taskCount?: number;
  progress?: number;
}

export interface DashboardStats {
  totalTasks: number;
  completed: number;
  overdue: number;
  projects: number;
}
