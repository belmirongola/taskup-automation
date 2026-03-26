import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_DIR = path.join(os.homedir(), ".taskup-cli");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
const AUTH_FILE = path.join(CONFIG_DIR, "auth.json");

export interface Config {
  email?: string;
  lastLogin?: string;
}

export interface AuthSession {
  email: string;
  password: string;
  savedAt: string;
}

export function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function loadConfig(): Config {
  ensureConfigDir();
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  }
  return {};
}

export function saveConfig(config: Config): void {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function clearConfig(): void {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
  }
}

export function loadAuth(): AuthSession | null {
  ensureConfigDir();
  if (fs.existsSync(AUTH_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
    } catch {
      return null;
    }
  }
  return null;
}

export function saveAuth(email: string, password: string): void {
  ensureConfigDir();
  const auth: AuthSession = {
    email,
    password,
    savedAt: new Date().toISOString(),
  };
  // Permissions: 0o600 = rw------- (only owner can read/write)
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2), { mode: 0o600 });
}

export function clearAuth(): void {
  if (fs.existsSync(AUTH_FILE)) {
    fs.unlinkSync(AUTH_FILE);
  }
  clearConfig();
}

export function isAuthenticated(): boolean {
  return loadAuth() !== null && loadConfig().email !== undefined;
}
