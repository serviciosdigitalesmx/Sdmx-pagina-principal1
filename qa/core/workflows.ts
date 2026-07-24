import type { QaTestResult } from "../types.js";

export type QaWorkflowContext = {
  runId: string;
  mode: string;
  config: {
    target: string;
    baseUrls: {
      admin: string;
      public: string;
      clientes: string;
      api: string;
    };
    credentials: Array<{ label: string; email: string; password: string }>;
  };
};

export type QaWorkflow = {
  key: string;
  title: string;
  execute: (context: QaWorkflowContext) => Promise<QaTestResult[]>;
};

const registry = new Map<string, QaWorkflow>();

export function registerWorkflow(key: string, workflow: Omit<QaWorkflow, "key">) {
  registry.set(key, { key, ...workflow });
  return workflow;
}

export function listWorkflows() {
  return [...registry.values()];
}

export async function runWorkflows(keys: string[], context: QaWorkflowContext) {
  const results: QaTestResult[] = [];
  for (const key of keys) {
    const workflow = registry.get(key);
    if (!workflow) continue;
    results.push(...await workflow.execute(context));
  }
  return results;
}
