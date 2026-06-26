"use client";

interface PhoneMockupProps {
  tenantName: string;
  initials: string;
  gradient: string;
}

export function PhoneMockup({ tenantName, initials, gradient }: PhoneMockupProps) {
  return (
    <div className="relative mx-auto max-w-[320px] animate-float sm:max-w-[360px]">
      <div
        className="rounded-[2.5rem] border p-3 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
        style={{
          borderColor: "var(--border-glow)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
        }}
      >
        <div
          className="flex min-h-[420px] flex-col gap-4 rounded-[2rem] p-5"
          style={{
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: gradient }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="truncate text-sm font-semibold text-white">{tenantName}</h4>
              <p className="text-xs text-[color:var(--text-secondary)]">Seguimiento y cotizador</p>
            </div>
            <div
              className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                borderColor: "rgba(34, 197, 94, 0.2)",
                color: "#22c55e",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulseGlow" />
              En vivo
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <h5
              className="mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Estado actual
            </h5>
            <p className="text-sm font-semibold text-white">Diagnóstico completado</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div
                className="h-full w-[75%] rounded-full animate-slideIn"
                style={{
                  background: gradient,
                }}
              />
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <h5
              className="mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Próximo paso
            </h5>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Aprobación de cotización por el cliente
            </p>
          </div>

          <div className="flex-1" />

          <div className="flex gap-2">
            <button
              className="flex-1 rounded-xl border py-2.5 text-xs font-medium text-white transition-all hover:bg-white/5"
              style={{ borderColor: "var(--border-subtle)" }}
              type="button"
            >
              Ver detalles
            </button>
            <button
              className="flex-1 rounded-xl py-2.5 text-xs font-medium text-white transition-all hover:opacity-90"
              style={{ background: gradient }}
              type="button"
            >
              Aprobar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
