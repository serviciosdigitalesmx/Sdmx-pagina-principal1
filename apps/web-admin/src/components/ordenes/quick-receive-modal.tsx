import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Smartphone, DollarSign, Loader2, Save } from "lucide-react";
import { apiGateway } from "@/services/apiGateway";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCurrentSession } from "@/lib/session";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QuickReceiveModal({ open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Cliente
    clientName: "",
    clientPhone: "",
    // Equipo
    deviceType: "Celular",
    deviceModel: "",
    serialNumber: "",
    issue: "",
    // Cotización
    estimatedCost: "",
    deposit: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.clientName || !formData.clientPhone || !formData.deviceModel || !formData.issue) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const session = getCurrentSession();
      const payload = {
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        deviceType: formData.deviceType,
        deviceModel: formData.deviceModel,
        serialNumber: formData.serialNumber,
        issue: formData.issue,
        estimatedCost: Number(formData.estimatedCost) || 0,
        sucursalId: session?.branchId || undefined,
        checklist: {
          notes: formData.notes
        }
      };

      const result = (await apiGateway.createOrder(payload)) as any;
      
      // If there's a deposit, create a payment
      if (formData.deposit && Number(formData.deposit) > 0 && result.id) {
        await apiGateway.createOrderPayment(result.id, {
          amount: Number(formData.deposit),
          paymentMethod: "cash",
          notes: "Abono inicial en recepción rápida"
        });
      }

      toast.success("¡Orden creada exitosamente!");
      onOpenChange(false);
      router.refresh();
      
      // Reset form
      setFormData({
        clientName: "", clientPhone: "", deviceType: "Celular", deviceModel: "", 
        serialNumber: "", issue: "", estimatedCost: "", deposit: "", notes: ""
      });
    } catch (err: any) {
      toast.error(err?.message || "Error al crear la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[1000px] p-0 overflow-hidden [&>button]:right-6 [&>button]:top-6 shadow-xl border-slate-200">
        <div className="bg-slate-50 border-b border-slate-200 p-6">
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-sky-500" />
            Recepción Rápida
          </DialogTitle>
          <DialogDescription className="text-slate-500 mt-1">
            Ingresa al cliente y su equipo en un solo paso.
          </DialogDescription>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna 1: Cliente */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-600 font-semibold mb-2">
              <User className="h-4 w-4" /> 1. Cliente
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Teléfono (10 dígitos) <span className="text-rose-500">*</span></label>
              <Input
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="Ej. 5512345678"
                className="border-slate-200 bg-white h-9 text-sm text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Nombre completo <span className="text-rose-500">*</span></label>
              <Input
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                className="border-slate-200 bg-white h-9 text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Columna 2: Dispositivo */}
          <div className="space-y-4 md:border-l md:border-slate-200 md:pl-6">
            <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
              <Smartphone className="h-4 w-4" /> 2. Dispositivo
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Tipo <span className="text-rose-500">*</span></label>
                <select
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500"
                >
                  <option value="Celular">Celular</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Computadora">Computadora</option>
                  <option value="Consola">Consola</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">IMEI/Serie</label>
                <Input
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Opcional"
                  className="border-slate-200 bg-white h-9 text-sm text-slate-900"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Marca y Modelo <span className="text-rose-500">*</span></label>
              <Input
                name="deviceModel"
                value={formData.deviceModel}
                onChange={handleChange}
                placeholder="Ej. iPhone 13 Pro"
                className="border-slate-200 bg-white h-9 text-sm text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">Problema reportado <span className="text-rose-500">*</span></label>
              <Textarea
                name="issue"
                value={formData.issue}
                onChange={handleChange}
                placeholder="Ej. No enciende, pantalla rota..."
                className="border-slate-200 bg-white min-h-[80px] text-sm resize-none text-slate-900"
              />
            </div>
          </div>

          {/* Columna 3: Costos */}
          <div className="space-y-4 md:border-l md:border-slate-200 md:pl-6">
            <div className="flex items-center gap-2 text-violet-600 font-semibold mb-2">
              <DollarSign className="h-4 w-4" /> 3. Presupuesto
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Costo total ($)</label>
                <Input
                  type="number"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="border-slate-200 bg-white h-9 text-sm text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Abono inicial ($)</label>
                <Input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="border-slate-200 bg-white h-9 text-sm text-emerald-600 font-medium"
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <label className="text-xs font-medium text-slate-700">Notas internas</label>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Falta tapa trasera, ralladuras..."
                className="border-slate-200 bg-white min-h-[60px] text-sm resize-none text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading} className="text-slate-500 hover:text-slate-900">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-sky-500 hover:bg-sky-600 text-white min-w-[160px]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {loading ? "Guardando..." : "Ingresar Equipo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
