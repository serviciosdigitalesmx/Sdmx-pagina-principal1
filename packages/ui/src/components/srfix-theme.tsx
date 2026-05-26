import type { ReactNode } from "react";

export const srFixTheme = {
  background:
    "radial-gradient(circle_at_top,_rgba(180,83,9,0.14),_transparent_22%),radial-gradient(circle_at_80%_10%,_rgba(251,191,36,0.08),_transparent_24%),linear-gradient(180deg,#050505_0%,#0f0f10_46%,#141210_100%)",
  surface:
    "rounded-[2rem] border border-amber-700/15 bg-[linear-gradient(180deg,rgba(16,14,12,0.96),rgba(22,18,14,0.98))] shadow-[0_30px_120px_rgba(120,53,15,0.16)] backdrop-blur-xl",
  panel:
    "rounded-[1.75rem] border border-stone-700/70 bg-white/4 shadow-[0_16px_60px_rgba(0,0,0,0.24)] backdrop-blur",
};

export function ShellBadge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex rounded-full border border-amber-700/20 bg-amber-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-50">
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
  const primary = "bg-amber-50 text-zinc-950 hover:bg-amber-100";
  const fallback = "border border-stone-700 bg-white/4 text-zinc-100 hover:border-amber-700/30 hover:bg-white/10";
  return (
    <a href={href} className={`${base} ${secondary ? fallback : primary}`}>
      {children}
    </a>
  );
}

export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <article className="rounded-[1.5rem] border border-stone-700/70 bg-white/4 p-5 backdrop-blur">
      <p className="text-3xl font-black tracking-tight text-stone-50">{value}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">{label}</p>
    </article>
  );
}

