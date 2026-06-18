"use client";

import type { NormalizedTimelineEvent } from "@/lib/types";
import { Badge, SurfaceCard } from "@white-label/ui";

type OrderTimelineProps = {
  timeline: NormalizedTimelineEvent[];
};

function statusTone(status: NormalizedTimelineEvent["status"]) {
  if (status === "completed") return { border: "border-emerald-400/30", badge: "bg-emerald-500/10 text-emerald-200", dot: "bg-emerald-400" };
  if (status === "in_progress") return { border: "border-sky-400/30", badge: "bg-sky-500/10 text-sky-200", dot: "bg-sky-400" };
  return { border: "border-slate-700", badge: "bg-white/5 text-slate-300", dot: "bg-slate-500" };
}

export function OrderTimeline({ timeline }: OrderTimelineProps) {
  if (timeline.length === 0) return null;

  return (
    <SurfaceCard elevated className="p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Seguimiento detallado</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-50">Avances técnicos</h3>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {timeline.map((step) => {
          const tone = statusTone(step.status);
          return (
            <article key={step.id} className={`rounded-[1.35rem] border bg-white/5 p-4 ${tone.border}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${tone.dot}`} />
                  <h4 className="text-base font-semibold text-slate-50">{step.label}</h4>
                </div>
                <Badge variant={step.status === "completed" ? "success" : step.status === "in_progress" ? "primary" : "neutral"}>{step.status}</Badge>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{step.note}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">{step.date.toLocaleString("es-MX")}</p>
            </article>
          );
        })}
      </div>
    </SurfaceCard>
  );
}
