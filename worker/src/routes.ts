import { Env, ApiResponse } from "./types";
import {
  authenticateUser,
  getTarefas,
  getTarefa,
  createTarefa,
  updateTarefa,
  deleteTarefa,
  getProjectos,
  getProjecto,
  createProjecto,
  updateProjecto,
  deleteProjecto,
} from "./db";

/**
 * Extract the Bearer token from the Authorization header.
 */
function extractToken(request: Request): string | null {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

/**
 * Require a valid user token. Returns the token or a 401 Response.
 */
function requireAuth(request: Request): string | Response {
  const token = extractToken(request);
  if (!token) {
    return json(
      { success: false, error: "Missing or invalid Authorization header", status: 401 },
      401
    );
  }
  return token;
}

export async function handleRequest(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }

  try {
    // ─── Health check (public) ──────────────────────────────
    if (pathname === "/health" && method === "GET") {
      return json(
        { success: true, status: 200, timestamp: new Date().toISOString() },
        200
      );
    }

    // ─── AUTH routes (public) ───────────────────────────────
    if (pathname === "/auth/login" && method === "POST") {
      const body = (await request.json()) as { email: string; password: string };
      const result = await authenticateUser(env, body.email, body.password);

      if (!result) {
        return json(
          { success: false, error: "Invalid credentials", status: 401 },
          401
        );
      }

      return json(
        {
          success: true,
          data: {
            token: result.token,
            user: { id: result.user.id, email: result.user.email },
          },
          status: 200,
        },
        200
      );
    }

    // ─── Protected routes: require auth ─────────────��───────
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const userToken = authResult;

    // ─── TAREFAS ────────────────────────────────────────────
    if (pathname === "/tarefas" && method === "GET") {
      const estado = url.searchParams.get("estado");
      const prioridade = url.searchParams.get("prioridade");
      const limit = url.searchParams.get("limit");

      const tarefas = await getTarefas(env, userToken, {
        estado: estado || undefined,
        prioridade: prioridade || undefined,
        limit: limit ? parseInt(limit) : 20,
      });

      return json({ success: true, data: tarefas, status: 200 }, 200);
    }

    if (pathname.match(/^\/tarefas\/[\w-]+$/) && method === "GET") {
      const id = pathname.split("/")[2];
      const tarefa = await getTarefa(env, userToken, id);
      return json({ success: true, data: tarefa, status: 200 }, 200);
    }

    if (pathname === "/tarefas" && method === "POST") {
      const body = (await request.json()) as any;
      const tarefa = await createTarefa(env, userToken, body);
      return json({ success: true, data: tarefa, status: 201 }, 201);
    }

    if (pathname.match(/^\/tarefas\/[\w-]+$/) && method === "PUT") {
      const id = pathname.split("/")[2];
      const body = (await request.json()) as Record<string, any>;
      const tarefa = await updateTarefa(env, userToken, id, body);
      return json({ success: true, data: tarefa, status: 200 }, 200);
    }

    if (pathname.match(/^\/tarefas\/[\w-]+$/) && method === "DELETE") {
      const id = pathname.split("/")[2];
      await deleteTarefa(env, userToken, id);
      return json({ success: true, status: 204 }, 204);
    }

    // ─── PROJECTOS ──────────────────────────────────────────
    if (pathname === "/projectos" && method === "GET") {
      const estado = url.searchParams.get("estado");
      const limit = url.searchParams.get("limit");

      const projectos = await getProjectos(env, userToken, {
        estado: estado || undefined,
        limit: limit ? parseInt(limit) : 20,
      });

      return json({ success: true, data: projectos, status: 200 }, 200);
    }

    if (pathname.match(/^\/projectos\/[\w-]+$/) && method === "GET") {
      const id = pathname.split("/")[2];
      const projecto = await getProjecto(env, userToken, id);
      return json({ success: true, data: projecto, status: 200 }, 200);
    }

    if (pathname === "/projectos" && method === "POST") {
      const body = (await request.json()) as any;
      const projecto = await createProjecto(env, userToken, body);
      return json({ success: true, data: projecto, status: 201 }, 201);
    }

    if (pathname.match(/^\/projectos\/[\w-]+$/) && method === "PUT") {
      const id = pathname.split("/")[2];
      const body = (await request.json()) as Record<string, any>;
      const projecto = await updateProjecto(env, userToken, id, body);
      return json({ success: true, data: projecto, status: 200 }, 200);
    }

    if (pathname.match(/^\/projectos\/[\w-]+$/) && method === "DELETE") {
      const id = pathname.split("/")[2];
      await deleteProjecto(env, userToken, id);
      return json({ success: true, status: 204 }, 204);
    }

    // ─── 404 ──────────────────────────────────���─────────────
    return json(
      { success: false, error: "Not found", status: 404 },
      404
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Worker error:", error);
    return json(
      { success: false, error: message, status: 500 },
      500
    );
  }
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(data: any, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}
