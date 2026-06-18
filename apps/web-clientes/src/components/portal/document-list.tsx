"use client";

import type { NormalizedDocument } from "@/lib/types";
import { Badge, SurfaceCard } from "@white-label/ui";

type DocumentListProps = {
  documents: NormalizedDocument[];
};

function getDocumentLabel(type: NormalizedDocument["type"]) {
  if (type === "invoice") return "Factura";
  if (type === "warranty") return "Garantía";
  if (type === "diagnostic") return "Diagnóstico";
  return "Documento";
}

export function DocumentList({ documents }: DocumentListProps) {
  if (documents.length === 0) return null;

  return (
    <SurfaceCard elevated className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Documentos</p>
      <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-50">Archivos vinculados</h3>

      <div className="mt-5 space-y-3">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={doc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-4 transition hover:border-sky-400/25"
        >
          <div>
            <div className="text-sm font-semibold text-slate-50">{doc.name}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
              {getDocumentLabel(doc.type)} · {doc.date.toLocaleDateString("es-MX")}
            </div>
          </div>
          <Badge variant="neutral">Ver</Badge>
        </a>
      ))}
      </div>
    </SurfaceCard>
  );
}
