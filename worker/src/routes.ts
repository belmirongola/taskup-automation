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

export async function handleRequest(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  try {
    // AUTH routes
    if (pathname === "/auth/login" && method === "POST") {
      const body = (await request.json()) as { email: string; password: string };
      const result = await authenticateUser(env, body.email, body.password);

      if (!result) {
        return json(
          {
            success: false,
            error: "Invalid credentials",
            status: 401,
          },
          401
        );
      }

      return json(
        {
          success: true,
          data: {
            token: result.token,
            user: {
              id: result.user.id,
              email: result.user.email,
            },
          },
          status: 200,
        },
        200
      );
    }

    // TAREFAS routes
    if (pathname === "/tarefas" && method === "GET") {
      const estado = url.searchParams.get("estado");
      const prioridade = url.searchParams.get("prioridade");
      const limit = url.searchParams.get("limit");

      const tarefas = await getTarefas(env, {
        estado: estado || undefined,
        prioridade: prioridade || undefined,
        limit: limit ? parseInt(limit) : 20,
      });

      return json({ success: true, data: tarefas, status: 200 }, 200);
    }

    if (pathname.match(/^\/tarefas\/[a-f0-9]+$/) && method === "GET") {
      const id = pathname.split("/")[2];
      const tarefa = await getTarefa(env, id);
      return json({ success: true, data: tarefa, status: 200 }, 200);
    }

    if (pathname === "/tarefas" && method === "POST") {
      const body = (await request.json()) as any;
      const tarefa = await createTarefa(env, body);
      return json({ success: true, data: tarefa, status: 201 }, 201);
    }

    if (pathname.match(/^\/tarefas\/[a-f0-9]+$/) && method === "PUT") {
      const id = pathname.split("/")[2];
      const body = (await request.json()) as Record<string, any>;
      const tarefa = await updateTarefa(env, id, body);
      return json({ success: true, data: tarefa, status: 200 }, 200);
    }

    if (pathname.match(/^\/tarefas\/[a-f0-9]+$/) && method === "DELETE") {
      const id = pathname.split("/")[2];
      await deleteTarefa(env, id);
      return json({ success: true, status: 204 }, 204);
    }

    // PROJECTOS routes
    if (pathname === "/projectos" && method === "GET") {
      const estado = url.searchParams.get("estado");
      const limit = url.searchParams.get("limit");

      const projectos = await getProjectos(env, {
        estado: estado || undefined,
        limit: limit ? parseInt(limit) : 20,
      });

      return json({ success: true, data: projectos, status: 200 }, 200);
    }

    if (pathname.match(/^\/projectos\/[a-f0-9]+$/) && method === "GET") {
      const id = pathname.split("/")[2];
      const projecto = await getProjecto(env, id);
      return json({ success: true, data: projecto, status: 200 }, 200);
    }

    if (pathname === "/projectos" && method === "POST") {
      const body = (await request.json()) as any;
      const projecto = await createProjecto(env, body);
      return json({ success: true, data: projecto, status: 201 }, 201);
    }

    if (pathname.match(/^\/projectos\/[a-f0-9]+$/) && method === "PUT") {
      const id = pathname.split("/")[2];
      const body = (await request.json()) as Record<string, any>;
      const projecto = await updateProjecto(env, id, body);
      return json({ success: true, data: projecto, status: 200 }, 200);
    }

    if (pathname.match(/^\/projectos\/[a-f0-9]+$/) && method === "DELETE") {
      const id = pathname.split("/")[2];
      await deleteProjecto(env, id);
      return json({ success: true, status: 204 }, 204);
    }

    // Health check
    if (pathname === "/health" && method === "GET") {
      return json({ success: true, status: 200 }, 200);
    }

    // 404
    return json(
      { success: false, error: "Not found", status: 404 },
      404
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json(
      { success: false, error: message, status: 500 },
      500
    );
  }
}

function json(data: any, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
