"use client";

import { AnimateIn } from "@/hooks/useInView";

const trustItems = [
  {
    icon: "🛡️",
    title: "Garantía 30 días",
    description: "En todas las reparaciones",
  },
  {
    icon: "🔍",
    title: "Diagnóstico gratis",
    description: "Sin compromiso de reparación",
  },
  {
    icon: "⚡",
    title: "Reparación express",
    description: "El mismo día en la mayoría",
  },
  {
    icon: "💬",
    title: "WhatsApp directo",
    description: "Atención personalizada",
  },
];

export function TrustBar() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      style={{
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
        {trustItems.map((item, index) => (
          <AnimateIn key={item.title} delay={index * 0.1}>
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                style={{ background: "var(--tenant-primary-dim)" }}
              >
                {item.icon}
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">{item.title}</h5>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {item.description}
                </p>
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
