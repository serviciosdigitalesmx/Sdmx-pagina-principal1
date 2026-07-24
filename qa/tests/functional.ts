import { join } from "node:path";
import { createBrowserSession, closeBrowserSession } from "../helpers/browser.js";
import { loadQaConfig } from "../config/audit.config.js";
import type { QaTestResult } from "../types.js";
import { LoginPage } from "../pages/login-page.js";
import { DashboardPage } from "../pages/dashboard-page.js";
import { CustomersPage } from "../pages/customers-page.js";

async function runCommonChecks(page: Awaited<ReturnType<typeof createBrowserSession>>["page"]) {
  const body = await page.locator("body").innerText().catch(() => "");
  return body.trim().length > 0;
}

export async function runFunctionalAudit(runId: string): Promise<QaTestResult[]> {
  const config = loadQaConfig();
  const session = await createBrowserSession(runId, "functional");
  const results: QaTestResult[] = [];
  try {
    const login = new LoginPage(session.page);
    await login.open(config.baseUrls.admin);
    const started = Date.now();
    let loginStatus: "passed" | "warning" = "passed";
    try {
      await login.login(config.credentials[0].email, config.credentials[0].password);
    } catch (error) {
      loginStatus = "warning";
    }
    const dashboard = new DashboardPage(session.page);
    try {
      await dashboard.ensureLoaded();
    } catch {
      loginStatus = "warning";
    }
    const screenshot = join(config.screenshotsDir, runId, "functional-home.png");
    await dashboard.screenshot(screenshot);
    results.push({
      name: "Login y Dashboard",
      status: (await runCommonChecks(session.page)) && loginStatus === "passed" ? "passed" : "warning",
      durationMs: Date.now() - started,
      page: session.page.url(),
      steps: [{ name: "Acceso", status: loginStatus, durationMs: 1 }],
      issues: [],
      screenshots: [screenshot],
      videos: [],
      metadata: { title: await dashboard.title() },
    });
  } finally {
    await closeBrowserSession(session);
  }
  return results;
}
