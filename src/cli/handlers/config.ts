import { saveSupabaseConfig, loadSupabaseConfig } from "../../utils/config.js";
import { formatSuccess, formatError, formatInfo } from "../../utils/formatter.js";

export async function handleConfigSet(key: string, value: string): Promise<void> {
  if (key === "supabase-url") {
    const config = loadSupabaseConfig();
    const anonKey = config?.anonKey || "";
    saveSupabaseConfig(value, anonKey);
    console.log(formatSuccess(`Supabase URL configured: ${value}`));
  } else if (key === "supabase-key") {
    const config = loadSupabaseConfig();
    const url = config?.url || "";
    if (!url) {
      console.error(formatError("Supabase URL not set yet. Use: taskup config supabase-url <url>"));
      process.exit(1);
    }
    saveSupabaseConfig(url, value);
    console.log(formatSuccess("Supabase key configured"));
  } else {
    console.error(formatError(`Unknown config key: ${key}`));
    process.exit(1);
  }
}

export async function handleConfigGet(key?: string): Promise<void> {
  const config = loadSupabaseConfig();

  if (!config) {
    console.log(formatInfo("No Supabase configuration found"));
    return;
  }

  if (key === "supabase-url") {
    console.log(config.url);
  } else if (key === "supabase-key") {
    console.log("****" + config.anonKey.slice(-10));
  } else if (key) {
    console.error(formatError(`Unknown config key: ${key}`));
    process.exit(1);
  } else {
    console.log(formatInfo("Supabase Configuration:"));
    console.log(`  URL: ${config.url}`);
    console.log(`  Key: ****${config.anonKey.slice(-10)}`);
  }
}
