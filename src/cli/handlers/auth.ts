import inquirer from "inquirer";
import ora from "ora";
import { TaskUpClient } from "../../api/client.js";
import { loadConfig, saveConfig, loadAuth, saveAuth, clearAuth, isAuthenticated } from "../../utils/config.js";
import { formatSuccess, formatError, formatInfo, formatWarning } from "../../utils/formatter.js";

export async function handleLogin(email?: string, password?: string): Promise<void> {
  const spinner = ora();

  try {
    let credentials = { email: email || "", password: password || "" };

    // Tentar reusar credenciais guardadas se não foram fornecidas
    if (!credentials.email || !credentials.password) {
      const saved = loadAuth();
      if (saved) {
        credentials = { email: saved.email, password: saved.password };
        spinner.start("Reutilizando autenticação guardada...");
      } else {
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "email",
            message: "Email:",
            default: credentials.email,
            validate: (val) => val.includes("@") ? true : "Email inválido",
          },
          {
            type: "password",
            name: "password",
            message: "Password:",
            mask: "*",
          },
          {
            type: "confirm",
            name: "remember",
            message: "Guardar credenciais para futuro?",
            default: true,
          },
        ]);
        credentials = answers;
        if (!spinner.isSpinning) {
          spinner.start("Autenticando...");
        }
      }
    } else {
      spinner.start("Autenticando...");
    }

    const client = new TaskUpClient();
    await client.login(credentials.email, credentials.password);
    const user = await client.getUser();

    // Guardar credenciais se "remember" foi marcado ou reusadas
    const remember = (credentials as any).remember !== false;
    if (remember) {
      saveAuth(credentials.email, credentials.password);
    }

    saveConfig({
      email: credentials.email,
      lastLogin: new Date().toISOString(),
    });

    spinner.succeed();
    console.log(formatSuccess(`Autenticado como ${user.email}`));
  } catch (error) {
    spinner.fail();
    console.error(formatError((error as Error).message));
    process.exit(1);
  }
}

export async function handleLogout(): Promise<void> {
  clearAuth();
  console.log(formatSuccess("Logout realizado e credenciais apagadas"));
}

export function handleWhoami(): void {
  const config = loadConfig();
  if (config.email) {
    const auth = loadAuth();
    const saved = auth ? " (credenciais guardadas)" : " (credenciais não guardadas)";
    console.log(formatInfo(`Autenticado como: ${config.email}${saved}`));
  } else {
    console.log(formatWarning("Não autenticado. Execute: taskup login"));
  }
}

export async function ensureAuthenticatedWithAutoLogin(): Promise<void> {
  const config = loadConfig();
  const auth = loadAuth();

  // Se já está autenticado e tem credenciais guardadas, tudo bem
  if (config.email && auth) {
    return;
  }

  // Se não tem credenciais guardadas, pedir login
  if (!auth) {
    console.log(formatWarning("Credenciais não encontradas. Fazendo login..."));
    await handleLogin();
    return;
  }

  // Se tem credenciais mas não está autenticado, tentar login automático
  await handleLogin(auth.email, auth.password);
}

export async function ensureAuthenticated(): Promise<void> {
  const auth = loadAuth();
  const config = loadConfig();

  if (!auth || !config.email) {
    console.error(formatError("Não autenticado. Execute: taskup login"));
    process.exit(1);
  }
}
