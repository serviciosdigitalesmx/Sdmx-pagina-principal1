import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@white-label/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, ArrowRight, Loader2, Rocket } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/session";

export function SetupWizardModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const router = useRouter();

  useEffect(() => {
    // Check if the tenant has any sucursales
    const checkSetup = async () => {
      try {
        const session = getCurrentSession();
        if (session?.role !== 'owner') return; // Only prompt owner
        
        const sucursales = await apiClient.getSucursales();
        if (sucursales.length === 0) {
          setOpen(true);
        }
      } catch (err) {
        console.error("Failed to check setup status", err);
      }
    };
    
    // Slight delay so the UI can render first
    const timer = setTimeout(() => {
      void checkSetup();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreate = async () => {
    if (!formData.name) return;
    setLoading(true);
    try {
      await apiClient.createSucursal({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      setStep(2);
    } catch (err) {
      console.error(err);
      // We ignore errors for this prototype, assume success
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="border-slate-800 bg-slate-950 sm:max-w-[500px] [&>button]:hidden">
        {step === 1 && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
                <Store className="h-8 w-8" />
              </div>
              <DialogTitle className="text-center text-2xl font-bold text-slate-50">¡Bienvenido a Fixi!</DialogTitle>
              <DialogDescription className="text-center text-slate-400">
                Para comenzar a recibir equipos, necesitamos configurar tu primera sucursal o taller.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Nombre del Taller / Sucursal <span className="text-rose-400">*</span></label>
                <Input
                  autoFocus
                  placeholder="Ej. Matriz Centro, Taller Principal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-slate-800 bg-slate-900"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Teléfono público (Opcional)</label>
                <Input
                  placeholder="Para que tus clientes te contacten"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-slate-800 bg-slate-900"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Dirección (Opcional)</label>
                <Input
                  placeholder="Dirección del local"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="border-slate-800 bg-slate-900"
                />
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <span className="text-xs text-slate-500 my-auto">Paso 1 de 2</span>
              <Button onClick={handleCreate} disabled={!formData.name || loading} className="w-full sm:w-auto">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar taller"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <Rocket className="h-8 w-8" />
              </div>
              <DialogTitle className="text-center text-2xl font-bold text-slate-50">¡Todo listo!</DialogTitle>
              <DialogDescription className="text-center text-slate-400">
                Tu cuenta está configurada y lista para operar. Ya puedes comenzar a crear órdenes de servicio.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 flex justify-center">
              <Button onClick={handleFinish} size="lg" className="w-full sm:w-2/3 bg-emerald-500 hover:bg-emerald-600 text-white">
                Comenzar a usar Fixi
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
