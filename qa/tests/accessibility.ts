import { createBrowserSession, closeBrowserSession } from "../helpers/browser.js";
import { loadQaConfig } from "../config/audit.config.js";
import type { QaTestResult } from "../types.js";
import { readFile } from "node:fs/promises";

export async function runAccessibilityAudit(runId: string): Promise<QaTestResult[]> {
  const config = loadQaConfig();
  const session = await createBrowserSession(runId, "accessibility");
  try {
    await session.page.goto(config.baseUrls.admin, { waitUntil: "networkidle" });
    const axeSource = await readFile(session.axePath, "utf8");
    await session.page.addScriptTag({ content: axeSource });
    const result = await session.page.evaluate(async () => {
      // @ts-expect-error injected dynamically
      return await axe.run(document, { resultTypes: ["violations", "incomplete"] });
    });
    const violations = result.violations.length;
    return [{
      name: "Axe audit",
      status: violations ? "warning" : "passed",
      durationMs: 0,
      page: session.page.url(),
      steps: [{ name: "Run axe", status: violations ? "warning" : "passed", durationMs: 0 }],
      issues: result.violations.map((violation: { id: string; help: string; description: string }) => ({
        severity: "medium",
        title: violation.help,
        details: `${violation.id}: ${violation.description}`,
      })),
      screenshots: [],
      videos: [],
      metadata: { violations, incomplete: result.incomplete.length },
    }];
  } finally {
    await closeBrowserSession(session);
  }
}
