import "dotenv/config";
import { chromium } from "playwright";

const BASE_URL = "https://taskup-md.vercel.app";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const jsContents: string[] = [];

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

  // Find the full anon key (JWT starting with eyJ)
  for (const content of jsContents) {
    const matches = content.matchAll(/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g);
    for (const m of matches) {
      const key = m[0];
      // Supabase anon keys contain "anon" when decoded
      if (key.length > 100 && key.length < 500) {
        console.log(`ANON_KEY=${key}`);
        // Decode to verify
        try {
          const payload = JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString());
          console.log(`DECODED=${JSON.stringify(payload)}`);
        } catch {}
      }
    }

    // Also try createClient pattern
    const clientMatch = content.match(/createClient\(["']([^"']+)["'],\s*["']([^"']+)["']/);
    if (clientMatch) {
      console.log(`URL=${clientMatch[1]}`);
      console.log(`KEY=${clientMatch[2]}`);
    }
    
    // Env-style
    const envMatch = content.match(/"NEXT_PUBLIC_SUPABASE_ANON_KEY":"([^"]+)"/);
    if (envMatch) {
      console.log(`ENV_KEY=${envMatch[1]}`);
    }
  }

  await browser.close();
}

main().catch(console.error);
