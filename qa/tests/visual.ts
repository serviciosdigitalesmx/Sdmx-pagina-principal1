import { join } from "node:path";
import { createBrowserSession, closeBrowserSession } from "../helpers/browser.js";
import { loadQaConfig } from "../config/audit.config.js";
import type { QaTestResult } from "../types.js";
import { visualArtifactName, compareVisuals } from "../helpers/report.js";

export async function runVisualAudit(runId: string): Promise<QaTestResult[]> {
  const config = loadQaConfig();
  const session = await createBrowserSession(runId, "visual");
  try {
    await session.page.goto(config.baseUrls.admin, { waitUntil: "networkidle" });
    const screenshot = join(config.screenshotsDir, runId, visualArtifactName("admin-home"));
    await session.page.screenshot({ path: screenshot, fullPage: true });
    return [{
      name: "Visual baseline admin",
      status: "passed",
      durationMs: 0,
      page: session.page.url(),
      steps: [{ name: "Screenshot", status: "passed", durationMs: 0 }],
      issues: [],
      screenshots: [screenshot],
      videos: [],
      metadata: {},
    }];
  } finally {
    await closeBrowserSession(session);
  }
}
