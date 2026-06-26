"use client";

import { AnimateIn } from "@/hooks/useInView";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  delay?: number;
}

export function ServiceCard({ icon, title, description, tags, delay = 0 }: ServiceCardProps) {
  return (
    <AnimateIn delay={delay}>
      <div
        className="group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 rounded-t-2xl transition-transform duration-300 group-hover:scale-x-100"
          style={{ background: "var(--tenant-gradient)" }}
        />
        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-2xl transition-all duration-300 group-hover:scale-110"
          style={{
            background: "var(--tenant-primary-dim)",
            border: "1px solid var(--tenant-primary-glow)",
          }}
        >
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
        <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-secondary)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </AnimateIn>
  );
}
