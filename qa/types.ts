export type QaStepStatus = "passed" | "failed" | "warning" | "skipped";

export type QaIssue = {
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  details: string;
  screenshot?: string;
  video?: string;
  page?: string;
};

export type QaPerfMetrics = {
  ttfb: number;
  fcp: number;
  lcp: number;
  cls: number;
  inp: number;
  load: number;
  render: number;
  memoryMb: number;
};

export type QaStepResult = {
  name: string;
  status: QaStepStatus;
  durationMs: number;
  page?: string;
  details?: string;
  screenshot?: string;
  video?: string;
};

export type QaTestResult = {
  name: string;
  status: QaStepStatus;
  durationMs: number;
  page?: string;
  steps: QaStepResult[];
  issues: QaIssue[];
  metrics?: QaPerfMetrics;
  screenshots: string[];
  videos: string[];
  metadata: Record<string, unknown>;
};

export type QaRunSummary = {
  runId: string;
  mode: string;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  results: QaTestResult[];
  issues: QaIssue[];
  consoleErrors: string[];
  httpErrors: Array<{ url: string; status: number; method: string }>;
  performance: Record<string, QaPerfMetrics>;
  accessibility: Record<string, { violations: number; impacts: Record<string, number> }>;
  seo: Record<string, unknown>;
  benchmarks?: Array<{ version: string; score: number }>;
  files: {
    html: string;
    pdf: string;
    json: string;
  };
};
