import { chromium } from "playwright";
import * as path from "path";

const URL = "https://taskup-md.vercel.app";
const EMAIL = "belmirongola@gmail.com";
const PASSWORD = "MarcaDigital2026!";
const SCREENSHOTS = path.join(__dirname, "..", "screenshots");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    // Login
    await page.goto(`${URL}/auth`, { waitUntil: "networkidle" });
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    console.log("Logado!");

    // Go to /tarefas
    await page.goto(`${URL}/tarefas`, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    console.log("URL:", page.url());
    
    // Full page HTML snapshot  
    const html = await page.content();
    require("fs").writeFileSync(path.join(SCREENSHOTS, "debug-tarefas-page.html"), html);

    // Screenshot
    await page.screenshot({ path: path.join(SCREENSHOTS, "debug-tarefas-page.png"), fullPage: true });

    // All visible text
    const bodyText = await page.locator("body").innerText();
    console.log("\n=== BODY TEXT ===");
    console.log(bodyText.substring(0, 3000));

    // All buttons
    console.log("\n=== ALL BUTTONS ===");
    const buttons = await page.locator("button").all();
    for (const btn of buttons) {
      const vis = await btn.isVisible().catch(() => false);
      const text = await btn.textContent().catch(() => "");
      const disabled = await btn.isDisabled().catch(() => false);
      const box = await btn.boundingBox().catch(() => null);
      console.log(`  ${vis ? "✓" : "✗"} "${text?.trim()}" disabled=${disabled} box=${JSON.stringify(box)}`);
    }

    // All links
    console.log("\n=== VISIBLE LINKS ===");
    const links = await page.locator("a:visible").all();
    for (const link of links) {
      const text = await link.textContent().catch(() => "");
      const href = await link.getAttribute("href").catch(() => "");
      console.log(`  "${text?.trim()}" → ${href}`);
    }

    // Check for any "Nova" text
    console.log("\n=== ELEMENTS WITH 'Nova' ===");
    const novaEls = await page.locator("*:has-text('Nova')").all();
    for (const el of novaEls) {
      const tag = await el.evaluate(e => e.tagName).catch(() => "?");
      const vis = await el.isVisible().catch(() => false);
      const text = await el.textContent().catch(() => "");
      if (vis && text && text.trim().length < 50) {
        console.log(`  <${tag}> "${text.trim()}"`);
      }
    }

    // Check for Plus icons or add buttons
    console.log("\n=== SVG / ICON BUTTONS ===");
    const iconBtns = await page.locator("button:has(svg)").all();
    for (const btn of iconBtns) {
      const vis = await btn.isVisible().catch(() => false);
      const text = await btn.textContent().catch(() => "");
      const ariaLabel = await btn.getAttribute("aria-label").catch(() => "");
      const box = await btn.boundingBox().catch(() => null);
      if (vis) {
        console.log(`  ✓ "${text?.trim()}" aria="${ariaLabel}" box=${JSON.stringify(box)}`);
      }
    }

  } catch (err: any) {
    console.error("ERRO:", err.message);
    await page.screenshot({ path: path.join(SCREENSHOTS, "debug-error.png") });
  } finally {
    await browser.close();
  }
}

main();
