"use client";

interface ContactCardProps {
  icon: string;
  label: string;
  value: string;
  hasData: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export function ContactCard({ icon, label, value, hasData, ctaText, ctaHref }: ContactCardProps) {
  return (
    <div
      className="flex items-start gap-4 rounded-xl p-5 transition-all duration-300 hover:bg-white/5"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderLeft: `3px solid ${hasData ? "var(--tenant-primary)" : "var(--text-muted)"}`,
        opacity: hasData ? 1 : 0.85,
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg"
        style={{
          background: hasData ? "var(--tenant-primary-dim)" : "rgba(255,255,255,0.05)",
        }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="mb-0.5 text-sm font-semibold text-white">{label}</h4>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {value}
        </p>
        {!hasData && ctaText && ctaHref ? (
          <a
            href={ctaHref}
            className="mt-2 inline-block text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--tenant-primary)" }}
          >
            {ctaText} →
          </a>
        ) : null}
      </div>
    </div>
  );
}
