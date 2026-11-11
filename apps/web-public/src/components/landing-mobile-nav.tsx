"use client";

import { useRef } from "react";

export function LandingMobileNav({ children, className }: { children: React.ReactNode; className: string }) {
  const menu = useRef<HTMLDetailsElement>(null);

  return (
    <details ref={menu} className={className}>
      <summary>Menú <span aria-hidden="true">☰</span></summary>
      <nav aria-label="Navegación móvil" onClick={(event) => {
        if (event.target instanceof Element && event.target.closest("a") && menu.current) {
          menu.current.open = false;
        }
      }}>
        {children}
      </nav>
    </details>
  );
}
