import "dotenv/config";
import { chromium } from "playwright";

const BASE_URL = "https://taskup-md.vercel.app";
const EMAIL = process.env.TASKUP_EMAIL || "";
const PASSWORD = process.env.TASKUP_PASSWORD || "";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Capture ALL headers on supabase requests
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("supabase.co")) {
      const headers = req.headers();
      if (headers["apikey"]) {
        console.log(`\nSUPABASE_ANON_KEY=${headers["apikey"]}`);
      }
      if (headers["authorization"]) {
        console.log(`\nAUTH=${headers["authorization"].substring(0, 50)}...`);
      }
    }
  });

  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState("networkidle");
  
  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
  await emailInput.waitFor({ state: "visible", timeout: 10_000 });
  await emailInput.fill(EMAIL);

  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.fill(PASSWORD);

  const loginBtn = page.locator('button:has-text("Entrar"), button[type="submit"]');
  await loginBtn.click();

  await page.waitForTimeout(5_000);
  
  // Navigate to trigger more API calls
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3_000);

  await browser.close();
}

main().catch(console.error);
