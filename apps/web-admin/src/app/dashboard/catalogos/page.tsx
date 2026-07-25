import { Metadata } from 'next';
import { CatalogManager } from '@/components/catalogos/catalog-manager';
import { Database } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catálogos | Fixi',
  description: 'Administra las familias, marcas, modelos y fallas',
};

export default function CatalogosPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Database className="h-8 w-8 text-sky-500" />
            Catálogos
          </h2>
          <p className="text-slate-500 mt-1">
            Gestiona la jerarquía de dispositivos, marcas, modelos y fallas de tu taller.
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <CatalogManager />
      </div>
    </div>
  );
}
