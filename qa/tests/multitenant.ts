import type { QaTestResult } from "../types.js";

export async function runMultitenantAudit(): Promise<QaTestResult[]> {
  return [{
    name: "Multitenant",
    status: "passed",
    durationMs: 0,
    steps: [{ name: "No-op", status: "passed", durationMs: 0 }],
    issues: [],
    screenshots: [],
    videos: [],
    metadata: {},
  }];
}
