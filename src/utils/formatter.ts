import { table } from "table";
import chalk from "chalk";

export function formatTable(headers: string[], rows: (string | number)[][]): string {
  const data = [headers, ...rows];
  return table(data, { border: { topBody: "─", topJoin: "┬", topLeft: "┌", topRight: "┐" } });
}

export function formatJSON(data: any): string {
  return JSON.stringify(data, null, 2);
}

export function formatSuccess(message: string): string {
  return chalk.green(`✓ ${message}`);
}

export function formatError(message: string): string {
  return chalk.red(`✗ ${message}`);
}

export function formatWarning(message: string): string {
  return chalk.yellow(`⚠ ${message}`);
}

export function formatInfo(message: string): string {
  return chalk.blue(`ℹ ${message}`);
}
