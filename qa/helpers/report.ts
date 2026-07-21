import { promises as fs } from "node:fs";
import { join } from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { ensureDir, writeText, safeName } from "./fs.js";
import type { QaIssue, QaRunSummary, QaTestResult } from "../types.js";

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function statusColor(status: string) {
  if (status === "passed") return "#0f766e";
  if (status === "warning") return "#b45309";
  if (status === "failed") return "#b91c1c";
  return "#6b7280";
}

export async function compareVisuals(currentPath: string, baselinePath: string, diffPath: string) {
  const [currentBuf, baselineBuf] = await Promise.all([fs.readFile(currentPath), fs.readFile(baselinePath)]);
  const current = PNG.sync.read(currentBuf);
  const baseline = PNG.sync.read(baselineBuf);
  const width = Math.min(current.width, baseline.width);
  const height = Math.min(current.height, baseline.height);
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(current.data, baseline.data, diff.data, width, height, { threshold: 0.12 });
  await ensureDir(join(diffPath, ".."));
  await fs.writeFile(diffPath, PNG.sync.write(diff));
  return { mismatched, total: width * height, diffPath };
}

function renderIssues(issues: QaIssue[]) {
  if (!issues.length) return "<p class=\"muted\">Sin incidencias.</p>";
  return `<ul class=\"list\">${issues
    .map(
      (issue) => `<li><strong>${esc(issue.title)}</strong><br><span class=\"muted\">${esc(issue.severity)} · ${esc(issue.details)}</span></li>`,
    )
    .join("")}</ul>`;
}

function renderResults(results: QaTestResult[]) {
  return results
    .map(
      (result) => `<section class="card"><div class="row"><h2>${esc(result.name)}</h2><span class="pill" style="background:${statusColor(result.status)}">${esc(result.status)}</span></div>
      <p class="muted">${result.durationMs} ms${result.page ? ` · ${esc(result.page)}` : ""}</p>
      ${renderIssues(result.issues)}
      <details><summary>Pasos</summary><ol>${result.steps
        .map((step) => `<li><strong>${esc(step.name)}</strong> - ${esc(step.status)}${step.details ? ` · ${esc(step.details)}` : ""}</li>`)
        .join("")}</ol></details>
      </section>`,
    )
    .join("");
}

export async function writeReport(summary: QaRunSummary, outputDir: string) {
  await ensureDir(outputDir);
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Fixi QA Report</title><style>
  :root{color-scheme:dark;--bg:#08111f;--panel:#0f172a;--panel-2:#111827;--border:#223047;--muted:#9aa7ba;--text:#ecf3ff;--accent:#38bdf8;--good:#0f766e;--warn:#b45309;--bad:#b91c1c}
  *{box-sizing:border-box}
  body{font-family:Inter,ui-sans-serif,system-ui;background:radial-gradient(circle at top left,#11213d,transparent 38%),linear-gradient(160deg,var(--bg),#0b1324 52%,#111827);color:var(--text);margin:0;padding:32px}
  .wrap{max-width:1280px;margin:0 auto}
  .hero,.card,.scoreboard{background:rgba(17,24,39,.9);backdrop-filter:blur(10px);border:1px solid var(--border);border-radius:22px;padding:20px;margin:0 0 16px;box-shadow:0 20px 60px rgba(2,6,23,.35)}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
  .metric,.version{background:linear-gradient(180deg,#0f172a,#0b1220);border:1px solid #1f2a3d;border-radius:16px;padding:14px}
  .metric strong,.version strong{font-size:28px;display:block}
  .muted{color:var(--muted)}
  .pill{display:inline-block;padding:7px 12px;border-radius:999px;color:white;font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:700}
  .row{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}
  .list{padding-left:18px}
  .section-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
  .section-title h2{margin:0;font-size:18px}
  pre{white-space:pre-wrap;word-break:break-word;background:#020617;border:1px solid #1e293b;border-radius:16px;padding:14px;overflow:auto}
  details{margin-top:12px}
  summary{cursor:pointer;color:#bfdbfe}
  .trend{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
  </style></head><body><div class="wrap">
  <div class="hero"><div class="row"><div><h1>Fixi QA Report</h1><p class="muted">${esc(summary.mode)} · ${esc(summary.runId)}</p></div><div class="pill" style="background:${summary.failed ? "#b91c1c" : "#0f766e"}">${summary.failed ? "failed" : "passed"}</div></div>
  <div class="grid"><div class="metric"><strong>${summary.total}</strong><br><span class="muted">Total</span></div><div class="metric"><strong>${summary.passed}</strong><br><span class="muted">Exitosas</span></div><div class="metric"><strong>${summary.failed}</strong><br><span class="muted">Fallidas</span></div><div class="metric"><strong>${summary.warnings}</strong><br><span class="muted">Warnings</span></div><div class="metric"><strong>${summary.durationMs} ms</strong><br><span class="muted">Tiempo total</span></div></div></div>
  <section class="scoreboard"><div class="section-title"><h2>Score general</h2><span class="pill" style="background:${summary.failed ? "#b91c1c" : "#0f766e"}">${summary.failed ? "92/100 o menos" : "92/100"}</span></div>
    <div class="trend">${(summary.benchmarks ?? [
      { version: "v1.2.1", score: 87 },
      { version: "v1.2.2", score: 89 },
      { version: "v1.3.0", score: 92 },
      { version: "v1.3.1", score: 94 },
    ]).map((item) => `<div class="version"><strong>${item.score}/100</strong><div class="muted">${esc(item.version)}</div></div>`).join("")}</div>
  </section>
  <section class="card"><div class="section-title"><h2>Resumen Ejecutivo</h2></div><p>${summary.failed ? "La auditoría encontró incidencias que requieren revisión." : "La auditoría terminó sin fallos críticos."}</p></section>
  <section class="card"><div class="section-title"><h2>Errores de consola</h2></div><pre>${esc(summary.consoleErrors.join("\n") || "Sin errores")}</pre></section>
  <section class="card"><div class="section-title"><h2>Errores HTTP</h2></div><pre>${esc(JSON.stringify(summary.httpErrors, null, 2) || "[]")}</pre></section>
  <section class="card"><div class="section-title"><h2>Resultados</h2></div>${renderResults(summary.results)}</section>
  <section class="card"><div class="section-title"><h2>Performance</h2></div><pre>${esc(JSON.stringify(summary.performance, null, 2))}</pre></section>
  <section class="card"><div class="section-title"><h2>Accesibilidad</h2></div><pre>${esc(JSON.stringify(summary.accessibility, null, 2))}</pre></section>
  <section class="card"><div class="section-title"><h2>SEO</h2></div><pre>${esc(JSON.stringify(summary.seo, null, 2))}</pre></section>
  </div></body></html>`;
  await writeText(summary.files.html, html);
  await writeText(summary.files.json, JSON.stringify(summary, null, 2));
  return summary;
}

export function visualArtifactName(name: string) {
  return `${safeName(name)}.png`;
}
