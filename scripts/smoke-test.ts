/**
 * Final smoke test — correct schema
 */
import { getClient } from "../src/api/client";

async function main() {
  const client = await getClient();

  const user = await client.getUser();
  console.log(`\n👤 Auth: ${user.email}`);

  const users = await client.listUsers();
  console.log(`\n👥 Users (${users.length}):`);
  for (const u of users) console.log(`   ${u.nome} — ${u.papel} — activo: ${u.activo}`);

  const tarefas = await client.listTarefas({ limit: 5 });
  console.log(`\n📋 Tarefas (${tarefas.length}):`);
  for (const t of tarefas) console.log(`   [${t.estado}] ${t.titulo} — ${t.prioridade}`);

  const projectos = await client.listProjectos({ limit: 5 });
  console.log(`\n📁 Projectos (${projectos.length}):`);
  for (const p of projectos) console.log(`   [${p.estado}] ${p.nome}`);

  const notifs = await client.listNotificacoes({ limit: 3 });
  console.log(`\n🔔 Notificações (${notifs.length}):`);
  for (const n of notifs) console.log(`   [${n.lida ? "✓" : "●"}] ${n.titulo}`);

  const reunioes = await client.listReunioes({ limit: 3 });
  console.log(`\n📅 Reuniões (${reunioes.length}):`);
  for (const r of reunioes) console.log(`   ${r.titulo} — ${r.data_reuniao} — ${r.estado}`);

  console.log("\n✅ Tudo funcional!");
}

main().catch(console.error);
