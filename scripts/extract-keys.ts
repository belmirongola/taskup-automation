/**
 * Extrai a Supabase anon key do bundle JS do TaskUp.
 */

import "dotenv/config";
import { chromium } from "playwright";

const BASE_URL = "https://taskup-md.vercel.app";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const jsContents: string[] = [];

  // Intercept JS bundles
  page.on("response", async (res) => {
    const url = res.url();
    if (url.endsWith(".js") && url.includes("_next")) {
      try {
        const text = await res.text();
        jsContents.push(text);
      } catch {}
    }
  });

  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3_000);

  // Search for supabase URL and anon key patterns
  const patterns = [
    /NEXT_PUBLIC_SUPABASE_URL['":\s]*['"]([^'"]+)['"]/g,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY['":\s]*['"]([^'"]+)['"]/g,
    /supabaseUrl['":\s]*['"]([^'"]+)['"]/g,
    /supabaseKey['":\s]*['"]([^'"]+)['"]/g,
    /supabaseAnonKey['":\s]*['"]([^'"]+)['"]/g,
    /createClient\(["']([^"']+)["'],\s*["']([^"']+)["']/g,
    /https:\/\/[a-z]+\.supabase\.co/g,
    /eyJ[A-Za-z0-9_-]{50,}/g, // JWT-like anon keys
  ];

  console.log(`📦 ${jsContents.length} JS bundles capturados\n`);

  const findings: string[] = [];

  for (let i = 0; i < jsContents.length; i++) {
    const content = jsContents[i];
    for (const pattern of patterns) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const finding = match[0];
        if (!findings.includes(finding) && finding.length < 500) {
          findings.push(finding);
          console.log(`🔑 Found: ${finding.substring(0, 100)}${finding.length > 100 ? "..." : ""}`);
        }
      }
    }
  }

  // Also check page source
  const pageSource = await page.content();
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(pageSource)) !== null) {
      const finding = match[0];
      if (!findings.includes(finding) && finding.length < 500) {
        findings.push(finding);
        console.log(`🔑 (HTML) Found: ${finding.substring(0, 100)}${finding.length > 100 ? "..." : ""}`);
      }
    }
  }

  // Also try __NEXT_DATA__
  const nextData = await page.evaluate(() => {
    const el = document.getElementById("__NEXT_DATA__");
    return el ? el.textContent : null;
  });
  if (nextData) {
    console.log(`\n📋 __NEXT_DATA__ found: ${nextData.substring(0, 200)}...`);
  }

  // Try env from window
  const envVars = await page.evaluate(() => {
    return {
      // @ts-ignore
      env: (window as any).__ENV || (window as any).__NEXT_DATA__?.runtimeConfig || {},
      processEnv: typeof process !== "undefined" ? (process as any).env : {},
    };
  });
  console.log("\n🌍 Window env vars:", JSON.stringify(envVars, null, 2));

  console.log(`\n📊 Total findings: ${findings.length}`);

  await browser.close();
}

main().catch(console.error);
