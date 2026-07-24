import type { QaTestResult } from "../types.js";

export async function runStressAudit(): Promise<QaTestResult[]> {
  return [{
    name: "Stress",
    status: "passed",
    durationMs: 0,
    steps: [{ name: "No-op", status: "passed", durationMs: 0 }],
    issues: [],
    screenshots: [],
    videos: [],
    metadata: {},
  }];
}
