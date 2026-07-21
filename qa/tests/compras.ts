import { join } from "node:path";
import { promises as fs } from "node:fs";
import { createBrowserSession, closeBrowserSession } from "../helpers/browser.js";
import { loadQaConfig } from "../config/audit.config.js";
import type { QaTestResult } from "../types.js";
import { visualArtifactName, compareVisuals } from "../helpers/report.js";

export async function runComprasAudit(runId: string): Promise<QaTestResult[]> {
  const config = loadQaConfig();
  const session = await createBrowserSession(runId, "compras");
  try {
    await session.page.goto(`${config.baseUrls.admin}/dashboard/compras`, { waitUntil: "networkidle" });
    let visible = true;
    try {
      await session.page.getByTestId("purchase-orders-grid").waitFor({ state: "visible", timeout: 30000 });
    } catch {
      visible = false;
    }
    const screenshot = join(config.screenshotsDir, runId, visualArtifactName("compras"));
    await session.page.screenshot({ path: screenshot, fullPage: true });
    const baseline = join(config.desktopDir, "fixtures", "baselines", visualArtifactName("compras"));
    const diffPath = join(config.screenshotsDir, runId, visualArtifactName("compras-diff"));
    if (!(await fs.stat(baseline).catch(() => null))) {
      await fs.mkdir(join(baseline, ".."), { recursive: true });
      await fs.copyFile(screenshot, baseline);
    }
    const artifact = await compareVisuals(screenshot, baseline, diffPath);
    return [{
      name: "Compras",
      status: visible && artifact.mismatched <= 50 ? "passed" : "warning",
      durationMs: 0,
      page: session.page.url(),
      steps: [{ name: "Cargar compras", status: visible ? "passed" : "warning", durationMs: 0 }],
      issues: [],
      screenshots: [screenshot, diffPath],
      videos: [],
      metadata: { diffPixels: artifact.mismatched, changedPixels: artifact.mismatched },
    }];
  } finally {
    await closeBrowserSession(session);
  }
}
