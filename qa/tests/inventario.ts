import { join } from "node:path";
import { promises as fs } from "node:fs";
import { createBrowserSession, closeBrowserSession } from "../helpers/browser.js";
import { loadQaConfig } from "../config/audit.config.js";
import type { QaTestResult } from "../types.js";
import { visualArtifactName, compareVisuals } from "../helpers/report.js";

export async function runInventarioAudit(runId: string): Promise<QaTestResult[]> {
  const config = loadQaConfig();
  const session = await createBrowserSession(runId, "inventario");
  try {
    await session.page.goto(`${config.baseUrls.admin}/dashboard/stock`, { waitUntil: "networkidle" });
    let visible = true;
    try {
      await session.page.getByTestId("inventory-table").waitFor({ state: "visible", timeout: 30000 });
    } catch {
      visible = false;
    }
    const screenshot = join(config.screenshotsDir, runId, visualArtifactName("inventario"));
    await session.page.screenshot({ path: screenshot, fullPage: true });
    const baseline = join(config.desktopDir, "fixtures", "baselines", visualArtifactName("inventario"));
    const diffPath = join(config.screenshotsDir, runId, visualArtifactName("inventario-diff"));
    if (!(await fs.stat(baseline).catch(() => null))) {
      await fs.mkdir(join(baseline, ".."), { recursive: true });
      await fs.copyFile(screenshot, baseline);
    }
    const artifact = await compareVisuals(screenshot, baseline, diffPath);
    return [{
      name: "Inventario",
      status: visible && artifact.mismatched <= 50 ? "passed" : "warning",
      durationMs: 0,
      page: session.page.url(),
      steps: [{ name: "Cargar inventario", status: visible ? "passed" : "warning", durationMs: 0 }],
      issues: [],
      screenshots: [screenshot, diffPath],
      videos: [],
      metadata: { diffPixels: artifact.mismatched, changedPixels: artifact.mismatched },
    }];
  } finally {
    await closeBrowserSession(session);
  }
}
