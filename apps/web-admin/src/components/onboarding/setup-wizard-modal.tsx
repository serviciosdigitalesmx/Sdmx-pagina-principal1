'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smartphone, Laptop, Tv, CheckCircle2, Loader2, UploadCloud, Rocket } from 'lucide-react';
import { apiGateway } from '@/services/apiGateway';
import { toast } from 'sonner';

export function SetupWizardModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estados del Wizard
  const [industry, setIndustry] = useState<string>('electronics_repair');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [registerName, setRegisterName] = useState('Caja Principal');
  const [initialCash, setInitialCash] = useState('500');

  useEffect(() => {
    checkIfOnboardingNeeded();
  }, []);

  const checkIfOnboardingNeeded = async () => {
    try {
      // Verificamos si el taller ya tiene al menos una caja configurada
      const registers = await apiGateway.getCashRegisters();
      if (registers.length === 0) {
        setOpen(true);
      }
    } catch (e) {
      console.error('Error verificando estado del onboarding:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      // 1. Crear Caja Registradora Inicial (Requisito para el POS)
      const sucursales = await apiGateway.getSucursales();
      let sucursalId = sucursales[0]?.id;
      
      // Si no hay sucursal, creamos una por defecto
      if (!sucursalId) {
        const nuevaSucursal = await apiGateway.createSucursal({
          name: 'Matriz',
          isActive: true
        });
        sucursalId = nuevaSucursal.id;
      }

      // Check if register already exists to ensure idempotency
      const existingRegisters = await apiGateway.getCashRegisters();
      if (existingRegisters.length === 0) {
        await apiGateway.createCashRegister({
          name: registerName,
          sucursalId: String(sucursalId)
        });
      }
      // 2. Subir Logo (Branding)
      if (logoFile) {
        await apiGateway.uploadTenantBrandingAsset({
          assetType: 'logo',
          file: logoFile
        });
      }

      // 3. Configurar Industria (Perfil de Catálogos)
      await apiGateway.updateTenantSettings({
        industryProfile: {
          industry_key: industry,
          is_active: true
        }
      });

      toast.success('¡Taller configurado exitosamente!');
      setOpen(false);
      
      // Redirigir al POS o Recepción para que empiece a operar
      window.location.assign('/dashboard/pos');
    } catch (err: any) {
      toast.error('Ocurrió un error al configurar tu taller. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !open) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      {/* Dialog permanece abierto hasta completar el wizard */}
      <DialogContent 
        className="bg-white max-w-2xl p-0 overflow-hidden rounded-[2rem] border-slate-200 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Lado Izquierdo: Progreso */}
          <div className="bg-slate-900 p-8 text-white w-full md:w-1/3 flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 mb-6 shadow-lg shadow-sky-500/30">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-2">Bienvenido a Fixi</h2>
              <p className="text-sm text-slate-400 mb-8">
                Vamos a preparar tu taller para que puedas operar a máxima velocidad.
              </p>
              
              <div className="space-y-6">
                <div className={`flex items-center gap-3 transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step > 1 ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'}`}>
                    {step > 1 ? <CheckCircle2 className="h-4 w-4" /> : '1'}
                  </div>
                  <span className="text-sm font-semibold">Giro del negocio</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step > 2 ? 'bg-emerald-500 text-white' : step === 2 ? 'bg-sky-500 text-white' : 'bg-slate-800'}`}>
                    {step > 2 ? <CheckCircle2 className="h-4 w-4" /> : '2'}
                  </div>
                  <span className="text-sm font-semibold">Personalización</span>
                </div>
                <div className={`flex items-center gap-3 transition-opacity ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-sky-500 text-white' : 'bg-slate-800'}`}>
                    3
                  </div>
                  <span className="text-sm font-semibold">Caja y Punto de Venta</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 text-[10px] text-slate-500">
              Paso {step} de 3
            </div>
          </div>

          {/* Lado Derecho: Contenido */}
          <div className="flex-1 p-8 bg-slate-50">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-900 mb-1">¿Qué reparas principalmente?</h3>
                <p className="text-sm text-slate-500 mb-6">Esto nos ayudará a precargar los catálogos y fallas más comunes para ti.</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setIndustry('electronics_repair')}
                    className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${industry === 'electronics_repair' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <Smartphone className={`h-6 w-6 mr-4 ${industry === 'electronics_repair' ? 'text-sky-600' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Celulares y Tablets</div>
                      <div className="text-xs text-slate-500">Displays, baterías, centros de carga.</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setIndustry('computers')}
                    className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${industry === 'computers' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <Laptop className={`h-6 w-6 mr-4 ${industry === 'computers' ? 'text-sky-600' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Laptops y Cómputo</div>
                      <div className="text-xs text-slate-500">Formateos, discos duros, RAM, placas.</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setIndustry('appliances')}
                    className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${industry === 'appliances' ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <Tv className={`h-6 w-6 mr-4 ${industry === 'appliances' ? 'text-sky-600' : 'text-slate-400'}`} />
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Electrónica General / Consolas</div>
                      <div className="text-xs text-slate-500">Videojuegos, pantallas TV, línea blanca.</div>
                    </div>
                  </button>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button onClick={() => setStep(2)} className="bg-slate-900 hover:bg-slate-800 text-white px-8">Siguiente</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Sube el logo de tu taller</h3>
                <p className="text-sm text-slate-500 mb-6">Tus clientes lo verán en su portal de seguimiento y en sus notas en PDF.</p>
                
                <div className="border-2 border-dashed border-slate-300 bg-white rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                  {logoPreview ? (
                    <div className="relative">
                      <img src={logoPreview} alt="Logo preview" className="h-24 object-contain rounded-lg" />
                      <button onClick={() => { setLogoFile(null); setLogoPreview(null); }} className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-1 text-xs">X</button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />
                      <p className="text-sm font-semibold text-slate-700">Arrastra tu logo o haz clic aquí</p>
                      <p className="text-xs text-slate-500 mt-1">PNG o JPG, máximo 2MB</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleLogoSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-500">Atrás</Button>
                  <Button onClick={() => setStep(3)} className="bg-slate-900 hover:bg-slate-800 text-white px-8">Siguiente</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-900 mb-1">Tu Caja Registradora</h3>
                <p className="text-sm text-slate-500 mb-6">Para vender accesorios o cobrar órdenes, necesitas una caja operativa.</p>
                
                <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nombre de la caja</label>
                    <Input 
                      value={registerName} 
                      onChange={e => setRegisterName(e.target.value)} 
                      placeholder="Ej. Caja Mostrador" 
                      className="bg-slate-50 border-slate-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fondo Inicial Sugerido ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                      <Input 
                        type="number" 
                        value={initialCash} 
                        onChange={e => setInitialCash(e.target.value)} 
                        className="pl-8 bg-slate-50 border-slate-200" 
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Podrás hacer el corte ciego al finalizar tu turno.</p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(2)} disabled={submitting} className="text-slate-500">Atrás</Button>
                  <Button 
                    onClick={handleComplete} 
                    disabled={submitting || !registerName} 
                    className="bg-sky-500 hover:bg-sky-600 text-white px-8 font-bold shadow-lg shadow-sky-500/25"
                  >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Rocket className="h-5 w-5 mr-2" />}
                    {submitting ? 'Preparando taller...' : 'Empezar a usar Fixi'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
