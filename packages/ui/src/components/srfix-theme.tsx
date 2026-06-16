import type { ReactNode } from "react";

export const srFixTheme = {
  background:
    "radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_22%),radial-gradient(circle_at_80%_10%,_rgba(34,211,238,0.08),_transparent_24%),linear-gradient(180deg,#050608_0%,#09090b_46%,#0f1117_100%)",
  surface:
    "rounded-[2rem] border border-slate-800/80 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))] shadow-[0_30px_120px_rgba(2,6,23,0.25)] backdrop-blur-xl",
  panel:
    "rounded-[1.75rem] border border-slate-800/70 bg-white/4 shadow-[0_16px_60px_rgba(2,6,23,0.24)] backdrop-blur",
};

export function ShellBadge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-100">
      {children}
    </div>
  );
}

export function HeroButton({
  href,
  secondary,
  children,
}: {
  href: string;
  secondary?: boolean;
  children: ReactNode;
}) {
  const base = "rounded-full px-6 py-3 text-sm font-semibold transition";
  const primary = "bg-sky-500 text-white hover:bg-sky-600";
  const fallback = "border border-slate-700 bg-white/4 text-slate-100 hover:border-sky-500/30 hover:bg-white/10";
  return (
    <a href={href} className={`${base} ${secondary ? fallback : primary}`}>
      {children}
    </a>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-800/70 bg-white/4 p-5 backdrop-blur">
      <p className="text-3xl font-black tracking-tight text-slate-50">{value}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
    </article>
  );
}
