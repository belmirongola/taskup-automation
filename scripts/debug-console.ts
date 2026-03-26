import { chromium } from "playwright";
import * as path from "path";

const URL = "https://taskup-md.vercel.app";
const EMAIL = "belmirongola@gmail.com";
const PASSWORD = "MarcaDigital2026!";
const SCREENSHOTS = path.join(__dirname, "..", "screenshots");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  // Capture console errors
  const logs: string[] = [];
  page.on("console", msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  page.on("pageerror", err => {
    logs.push(`[PAGE_ERROR] ${err.message}`);
  });
  page.on("requestfailed", req => {
    logs.push(`[REQ_FAIL] ${req.url()} → ${req.failure()?.errorText}`);
  });

  try {
    // Login
    console.log("1. Going to auth...");
    await page.goto(`${URL}/auth`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    
    // Check if login form is there
    const emailInput = await page.locator('input[type="email"]').count();
    console.log(`   Email input found: ${emailInput}`);
    
    if (emailInput === 0) {
      // Maybe already logged in or different page
      console.log("   Page URL:", page.url());
      const text = await page.locator("body").innerText();
      console.log("   Body text:", text.substring(0, 500));
      await page.screenshot({ path: path.join(SCREENSHOTS, "debug-console-noform.png") });
      await browser.close();
      return;
    }

    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for navigation - be flexible about destination
    await page.waitForNavigation({ timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    console.log("2. After login URL:", page.url());
    await page.screenshot({ path: path.join(SCREENSHOTS, "debug-console-afterlogin.png") });

    // Check cookies/localStorage
    const cookies = await page.context().cookies();
    console.log(`   Cookies: ${cookies.length}`);
    for (const c of cookies) {
      console.log(`     ${c.name} = ${c.value.substring(0, 30)}...`);
    }
    
    const storage = await page.evaluate(() => {
      const result: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)!;
        result[key] = localStorage.getItem(key)?.substring(0, 50) || "";
      }
      return result;
    });
    console.log("   LocalStorage:", JSON.stringify(storage));

    // Navigate to tarefas
    console.log("3. Going to /tarefas...");
    await page.goto(`${URL}/tarefas`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(5000);
    console.log("   URL:", page.url());
    await page.screenshot({ path: path.join(SCREENSHOTS, "debug-console-tarefas-5s.png") });
    
    // Wait more
    await page.waitForTimeout(5000);
    const bodyText = await page.locator("body").innerText();
    console.log("   Body text (10s):", bodyText.substring(0, 500));
    await page.screenshot({ path: path.join(SCREENSHOTS, "debug-console-tarefas-10s.png") });

    // Check for hydration
    const divCount = await page.locator("div").count();
    console.log(`   Total divs: ${divCount}`);
    
    // Print console logs
    console.log("\n=== BROWSER CONSOLE ===");
    for (const log of logs) {
      console.log(log);
    }

  } catch (err: any) {
    console.error("ERRO:", err.message);
    await page.screenshot({ path: path.join(SCREENSHOTS, "debug-console-error.png") });
    console.log("\n=== BROWSER CONSOLE ===");
    for (const log of logs) {
      console.log(log);
    }
  } finally {
    await browser.close();
  }
}

main();
