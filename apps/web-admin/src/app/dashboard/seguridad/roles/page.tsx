'use client';

import { useEffect, useState } from 'react';
import { Shield, Save, Loader2, Info } from 'lucide-react';
import { SurfaceCard } from '@white-label/ui';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiGateway } from '@/services/apiGateway';

const MODULES = [
  { id: 'finances', name: 'Finanzas y Costos', desc: 'Ver costos de refacciones y ganancias netas' },
  { id: 'inventory', name: 'Inventario Completo', desc: 'Editar cantidades y eliminar productos' },
  { id: 'orders_delete', name: 'Eliminar Órdenes', desc: 'Permitir borrar o cancelar órdenes de servicio' },
  { id: 'reports', name: 'Reportes y Exportaciones', desc: 'Descargar Excel de clientes e ingresos' },
];

const ROLES = [
  { id: 'manager', name: 'Manager' },
  { id: 'technician', name: 'Técnico' },
];

export default function RolesPage() {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({
    manager: {},
    technician: {},
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      apiGateway.getTenantRolePermissions('manager'),
      apiGateway.getTenantRolePermissions('technician'),
    ])
      .then(([manager, technician]) => {
        if (!active) return;
        setPermissions((current) => ({
          manager: { ...current.manager, ...manager },
          technician: { ...current.technician, ...technician },
        }));
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : 'No se pudieron cargar los permisos'))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const togglePermission = (role: string, modId: string) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [modId]: !prev[role][modId]
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await Promise.all([
        apiGateway.updateTenantRolePermissions('manager', permissions.manager),
        apiGateway.updateTenantRolePermissions('technician', permissions.technician),
      ]);
      toast.success('Permisos personalizados guardados para este taller.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudieron guardar los permisos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 flex items-center gap-2">
            <Shield className="h-8 w-8 text-sky-400" />
            Roles y Permisos (Overrides)
          </h1>
          <p className="mt-2 text-slate-400">
            Personaliza lo que tus empleados pueden ver y hacer en tu taller.
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-sky-500 hover:bg-sky-600">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Guardar matriz
        </Button>
      </div>

      <SurfaceCard elevated className="p-0 overflow-hidden border-slate-800 bg-slate-900/50">
        <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 text-amber-200/90 text-sm flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 mt-0.5 text-amber-400" />
          <p>
            <strong>Nota de seguridad:</strong> El rol <code>Owner</code> tiene acceso irrestricto y no puede ser modificado. 
            Las reglas que configures aquí sobrescribirán los permisos globales por defecto de Fixi solo para tu Taller.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold w-1/2">Permiso Especial</th>
                {ROLES.map(r => (
                  <th key={r.id} className="px-6 py-4 font-semibold text-center">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MODULES.map((mod) => (
                <tr key={mod.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-100">{mod.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{mod.desc}</p>
                  </td>
                  {ROLES.map(role => (
                    <td key={role.id} className="px-6 py-4 text-center">
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={permissions[role.id]?.[mod.id] || false}
                          onChange={() => togglePermission(role.id, mod.id)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/30"></div>
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SurfaceCard>
    </div>
  );
}
