/**
 * Deep schema discovery — see actual column names for projectos and tarefas
 */
import { getClient } from "../src/api/client";

async function main() {
  const client = await getClient();
  const sb = client.getSupabaseClient();

  const tables = ["tarefas", "projectos", "reunioes", "notificacoes", "users"];

  for (const table of tables) {
    console.log(`\n═══ ${table.toUpperCase()} ═══`);
    const { data, error } = await sb.from(table).select("*").limit(1);
    if (error) {
      console.log(`❌ ${error.message}`);
    } else if (data && data.length > 0) {
      const cols = Object.keys(data[0]);
      console.log(`Columns (${cols.length}): ${cols.join(", ")}`);
      console.log("Sample:", JSON.stringify(data[0], null, 2));
    } else {
      console.log("(empty)");
    }
  }
}

main().catch(console.error);
