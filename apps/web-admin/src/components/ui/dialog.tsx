"use client";

import React, { useEffect, createContext, useContext } from "react";
import { X } from "lucide-react";

type DialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

const DialogContext = createContext<{ onOpenChange?: (open: boolean) => void }>({});

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (!open || !onOpenChange) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { onOpenChange } = useContext(DialogContext);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && onOpenChange) {
          onOpenChange(false);
        }
      }}
    >
      <div
        className={`relative shell-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.5rem] border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl ${className}`}
        {...props}
      >
        {onOpenChange && (
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Cerrar ventana"
            title="Cerrar (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className = "", children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-4 pr-6 ${className}`}>{children}</div>;
}

export function DialogTitle({ className = "", children }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={`text-xl font-bold tracking-tight text-slate-900 ${className}`}>{children}</h2>;
}

export function DialogDescription({ className = "", children }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-slate-600 mt-1 leading-relaxed ${className}`}>{children}</p>;
}

export function DialogFooter({ className = "", children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${className}`}>{children}</div>;
}

