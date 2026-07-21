import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import { join } from "node:path";
import { ensureDir } from "./fs.js";
import { loadQaConfig } from "../config/audit.config.js";

export type BrowserSession = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  artifactsDir: string;
  consoleErrors: string[];
  httpErrors: Array<{ url: string; status: number; method: string }>;
};

function resolveAxePath() {
  return join(process.cwd(), "..", "node_modules", ".pnpm", "axe-core@4.12.1", "node_modules", "axe-core", "axe.min.js");
}

export async function createBrowserSession(runId: string, pageName = "run") {
  const config = loadQaConfig();
  const artifactsDir = join(config.resultsDir, runId, pageName);
  await ensureDir(artifactsDir);
  const browser = await chromium.launch({ headless: config.headless, channel: "chromium" });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1024 },
    recordVideo: config.recordVideoOnFailure ? { dir: config.videosDir } : undefined,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  const httpErrors: Array<{ url: string; status: number; method: string }> = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      httpErrors.push({ url: response.url(), status: response.status(), method: response.request().method() });
    }
  });

  return { browser, context, page, artifactsDir, consoleErrors, httpErrors, axePath: resolveAxePath() } satisfies BrowserSession & { axePath: string };
}

export async function closeBrowserSession(session: BrowserSession) {
  await session.context.close();
  await session.browser.close();
}
