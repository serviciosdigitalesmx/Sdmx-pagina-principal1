'use client';

import { useState, useEffect } from 'react';
import { Plus, ChevronRight, Edit2, Trash2, Smartphone, Cpu, Wrench } from 'lucide-react';
import { apiGateway } from '@/services/apiGateway';
import { toast } from 'sonner';
import { CatalogFamily, CatalogBrand, CatalogModel, CatalogFault, CatalogPart } from '@/types';

export function CatalogManager() {
  const [families, setFamilies] = useState<CatalogFamily[]>([]);
  const [brands, setBrands] = useState<CatalogBrand[]>([]);
  const [models, setModels] = useState<CatalogModel[]>([]);
  const [faults, setFaults] = useState<CatalogFault[]>([]);

  const [selectedFamily, setSelectedFamily] = useState<CatalogFamily | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<CatalogBrand | null>(null);
  const [selectedModel, setSelectedModel] = useState<CatalogModel | null>(null);

  useEffect(() => {
    loadFamilies();
  }, []);

  useEffect(() => {
    if (selectedFamily) {
      loadBrands(selectedFamily.id);
      setSelectedBrand(null);
      setSelectedModel(null);
      setModels([]);
      setFaults([]);
    } else {
      setBrands([]);
    }
  }, [selectedFamily]);

  useEffect(() => {
    if (selectedBrand) {
      loadModels(selectedBrand.id);
      setSelectedModel(null);
      setFaults([]);
    } else {
      setModels([]);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedModel) {
      loadFaults(selectedModel.id);
    } else {
      setFaults([]);
    }
  }, [selectedModel]);

  const loadFamilies = async () => {
    try {
      const data = await apiGateway.getCatalogFamilies();
      setFamilies(data as unknown as CatalogFamily[]);
    } catch (e: any) {
      toast.error(e.message || 'Error al cargar familias');
    }
  };

  const loadBrands = async (familyId: string) => {
    try {
      const data = await apiGateway.getCatalogBrands(familyId);
      setBrands(data as unknown as CatalogBrand[]);
    } catch (e: any) {
      toast.error(e.message || 'Error al cargar marcas');
    }
  };

  const loadModels = async (brandId: string) => {
    try {
      const data = await apiGateway.getCatalogModels(brandId);
      setModels(data as unknown as CatalogModel[]);
    } catch (e: any) {
      toast.error(e.message || 'Error al cargar modelos');
    }
  };

  const loadFaults = async (modelId: string) => {
    try {
      const data = await apiGateway.getCatalogFaults(modelId);
      setFaults(data as unknown as CatalogFault[]);
    } catch (e: any) {
      toast.error(e.message || 'Error al cargar fallas');
    }
  };

  const handleAddFamily = async () => {
    const name = window.prompt('Nombre de la Familia (ej. Celulares):');
    if (!name) return;
    try {
      await apiGateway.createCatalogFamily({ name });
      toast.success('Familia creada');
      loadFamilies();
    } catch (e: any) {
      toast.error('Error al crear');
    }
  };

  const handleAddBrand = async () => {
    if (!selectedFamily) return;
    const name = window.prompt('Nombre de la Marca (ej. Apple):');
    if (!name) return;
    try {
      await apiGateway.createCatalogBrand({ family_id: selectedFamily.id, name });
      toast.success('Marca creada');
      loadBrands(selectedFamily.id);
    } catch (e: any) {
      toast.error('Error al crear');
    }
  };

  const handleAddModel = async () => {
    if (!selectedBrand) return;
    const name = window.prompt('Nombre del Modelo (ej. iPhone 13):');
    if (!name) return;
    try {
      await apiGateway.createCatalogModel({ brand_id: selectedBrand.id, name });
      toast.success('Modelo creado');
      loadModels(selectedBrand.id);
    } catch (e: any) {
      toast.error('Error al crear');
    }
  };

  const handleAddFault = async () => {
    if (!selectedModel) return;
    const name = window.prompt('Nombre de la Falla (ej. Pantalla Rota):');
    if (!name) return;
    const cost = window.prompt('Costo sugerido (opcional):');
    try {
      await apiGateway.createCatalogFault({ 
        model_id: selectedModel.id, 
        name, 
        default_cost: cost ? Number(cost) : undefined 
      });
      toast.success('Falla creada');
      loadFaults(selectedModel.id);
    } catch (e: any) {
      toast.error('Error al crear');
    }
  };

  const handleDelete = async (type: 'family'|'brand'|'model'|'fault', id: string) => {
    if (!window.confirm('¿Eliminar este elemento?')) return;
    try {
      if (type === 'family') { await apiGateway.deleteCatalogFamily(id); loadFamilies(); if (selectedFamily?.id === id) setSelectedFamily(null); }
      if (type === 'brand') { await apiGateway.deleteCatalogBrand(id); loadBrands(selectedFamily!.id); if (selectedBrand?.id === id) setSelectedBrand(null); }
      if (type === 'model') { await apiGateway.deleteCatalogModel(id); loadModels(selectedBrand!.id); if (selectedModel?.id === id) setSelectedModel(null); }
      if (type === 'fault') { await apiGateway.deleteCatalogFault(id); loadFaults(selectedModel!.id); }
      toast.success('Elemento eliminado');
    } catch (e: any) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Familias */}
      <div className="flex w-1/4 flex-col border-r border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-900">Familias</h3>
          <button onClick={handleAddFamily} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {families.map(f => (
            <div 
              key={f.id} 
              onClick={() => setSelectedFamily(f)}
              className={`group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${selectedFamily?.id === f.id ? 'bg-sky-50 text-sky-700' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 opacity-70" />
                <span className="font-medium">{f.name}</span>
              </div>
              <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={(e) => { e.stopPropagation(); handleDelete('family', f.id); }} className="p-1 text-slate-400 hover:text-rose-500"><Trash2 className="h-3 w-3" /></button>
                <ChevronRight className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marcas */}
      <div className="flex w-1/4 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900">Marcas</h3>
          <button onClick={handleAddBrand} disabled={!selectedFamily} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 bg-slate-50/30">
          {!selectedFamily && <div className="p-4 text-center text-sm text-slate-400">Selecciona una familia</div>}
          {brands.map(b => (
            <div 
              key={b.id} 
              onClick={() => setSelectedBrand(b)}
              className={`group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${selectedBrand?.id === b.id ? 'bg-sky-50 text-sky-700' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <span className="font-medium">{b.name}</span>
              <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={(e) => { e.stopPropagation(); handleDelete('brand', b.id); }} className="p-1 text-slate-400 hover:text-rose-500"><Trash2 className="h-3 w-3" /></button>
                <ChevronRight className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modelos */}
      <div className="flex w-1/4 flex-col border-r border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-900">Modelos</h3>
          <button onClick={handleAddModel} disabled={!selectedBrand} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {!selectedBrand && <div className="p-4 text-center text-sm text-slate-400">Selecciona una marca</div>}
          {models.map(m => (
            <div 
              key={m.id} 
              onClick={() => setSelectedModel(m)}
              className={`group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${selectedModel?.id === m.id ? 'bg-sky-50 text-sky-700' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 opacity-70" />
                <span className="font-medium">{m.name}</span>
              </div>
              <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={(e) => { e.stopPropagation(); handleDelete('model', m.id); }} className="p-1 text-slate-400 hover:text-rose-500"><Trash2 className="h-3 w-3" /></button>
                <ChevronRight className="ml-1 h-4 w-4 opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fallas */}
      <div className="flex w-1/4 flex-col bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900">Fallas Frecuentes</h3>
          <button onClick={handleAddFault} disabled={!selectedModel} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 bg-slate-50/30">
          {!selectedModel && <div className="p-4 text-center text-sm text-slate-400">Selecciona un modelo</div>}
          {faults.map(f => (
            <div 
              key={f.id} 
              className="group mb-2 flex flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-900">{f.name}</span>
                </div>
                <button onClick={() => handleDelete('fault', f.id)} className="p-1 text-slate-400 opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100"><Trash2 className="h-3 w-3" /></button>
              </div>
              {f.default_cost !== null && (
                <div className="mt-2 text-xs font-medium text-emerald-600">
                  Costo: ${f.default_cost}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
