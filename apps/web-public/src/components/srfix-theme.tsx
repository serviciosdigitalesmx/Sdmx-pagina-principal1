import type { ReactNode } from "react";

export const srFixTheme = {
  background:
    "radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_22%),radial-gradient(circle_at_80%_10%,_rgba(14,165,233,0.08),_transparent_24%),linear-gradient(180deg,#020617_0%,#050b16_46%,#0b1220_100%)",
  surface:
    "rounded-[2rem] border border-slate-800 bg-[linear-gradient(180deg,rgba(9,14,26,0.96),rgba(11,18,32,0.98))] shadow-[0_30px_120px_rgba(2,6,23,0.36)] backdrop-blur-xl",
};

export function ShellBadge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-50">
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
  const primary = "bg-sky-50 text-slate-950 hover:bg-sky-100";
  const fallback = "border border-slate-800 bg-slate-950/70 text-slate-100 hover:border-sky-400/20 hover:bg-white/10";
  return (
    <a href={href} className={`${base} ${secondary ? fallback : primary}`}>
      {children}
    </a>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-800/70 bg-slate-950/70 p-5 backdrop-blur">
      <p className="text-3xl font-black tracking-tight text-slate-50">{value}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
    </article>
  );
}
