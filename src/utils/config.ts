import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_DIR = path.join(os.homedir(), ".taskup-cli");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
const AUTH_FILE = path.join(CONFIG_DIR, "auth.json");
const SUPABASE_CONFIG_FILE = path.join(CONFIG_DIR, "supabase.json");

export interface Config {
  email?: string;
  lastLogin?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
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

export function loadSupabaseConfig(): SupabaseConfig | null {
  if (fs.existsSync(SUPABASE_CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SUPABASE_CONFIG_FILE, "utf-8"));
    } catch {
      return null;
    }
  }
  return null;
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  ensureConfigDir();
  const config: SupabaseConfig = { url, anonKey };
  fs.writeFileSync(SUPABASE_CONFIG_FILE, JSON.stringify(config, null, 2), { mode: 0o600 });
}

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  // Try environment variables first
  const envUrl = process.env.SUPABASE_URL;
  const envKey = process.env.SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  // Then try config file
  const config = loadSupabaseConfig();
  if (config) {
    return config;
  }

  throw new Error(
    "Supabase credentials not found. Please configure them using: taskup config supabase-url <url> && taskup config supabase-key <key>"
  );
}
