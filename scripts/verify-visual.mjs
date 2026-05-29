import { chromium } from "@playwright/test";

const baseUrl = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3001";
const routes = [
  "/",
  "/lab/pendulum",
  "/lab/kinematics",
  "/lab/ac-generator",
  "/lab/faraday-induction",
  "/lab/transformer",
  "/lab/circuit-ohm",
  "/lab/electric-field",
  "/lab/optics-ray",
  "/lab/wave-particle",
  "/lab/chemical-bonding",
  "/lab/reaction-sandbox",
  "/lab/molecule-viewer",
  "/lab/atom-model",
  "/history",
  "/history/galileo-motion"
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
page.on("pageerror", (error) => console.error(`Page error: ${error.message}`));
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) console.error(`Console ${message.type()}: ${message.text()}`);
});

for (const route of routes) {
  console.log(`Checking ${route}`);
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(1000);
  const bodyText = await page.locator("body").innerText();
  if (/Application error|NaN|N\/A/.test(bodyText)) {
    throw new Error(`Invalid render text on ${route}: found Application error, NaN or N/A`);
  }
  await page.screenshot({ path: `test-${route.replaceAll("/", "-") || "home"}.png`, fullPage: true });
}

for (const route of ["/lab/molecule-viewer", "/lab/atom-model", "/lab/ac-generator", "/lab/faraday-induction", "/lab/transformer"]) {
  console.log(`Checking canvas ${route}`);
  await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForSelector("canvas", { timeout: 15000 });
  await page.waitForTimeout(1500);
  const nonBlank = await page.locator("canvas").first().evaluate((canvas) => {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return true;
    const { width, height } = canvas;
    const data = context.getImageData(0, 0, Math.min(width, 64), Math.min(height, 64)).data;
    return data.some((value) => value !== 0);
  });
  if (!nonBlank) throw new Error(`Canvas appears blank on ${route}`);
}

await browser.close();
console.log("Visual smoke check passed");
