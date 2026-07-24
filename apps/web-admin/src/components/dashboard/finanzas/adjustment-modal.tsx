import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@white-label/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiGateway } from "@/services/apiGateway";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sucursalId: string;
  onSuccess: () => void;
};

export function AdjustmentModal({ open, onOpenChange, sucursalId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState({
    amount: "",
    description: "",
    type: "income",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.amount || !draft.description) return;

    setLoading(true);
    try {
      const amountNum = Number(draft.amount);
      const finalAmount = draft.type === "income" ? amountNum : -amountNum;

      await apiGateway.createAdjustment({
        sucursalId,
        amount: finalAmount,
        description: draft.description,
        category: "ajuste",
      });

      onSuccess();
      onOpenChange(false);
      setDraft({ amount: "", description: "", type: "income" });
    } catch (err) {
      console.error(err);
      alert("Error al guardar el ajuste.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-950 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Ajuste de Caja</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Tipo de Movimiento</label>
            <select
              className="input"
              value={draft.type}
              onChange={(e) => setDraft((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="income">Ingreso (+)</option>
              <option value="expense">Egreso (-)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Monto</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              className="input"
              placeholder="Ej. 100.00"
              value={draft.amount}
              onChange={(e) => setDraft((prev) => ({ ...prev, amount: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Descripción</label>
            <input
              type="text"
              required
              className="input"
              placeholder="Ej. Depósito inicial de caja"
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || !draft.amount || !draft.description}>
              {loading ? "Guardando..." : "Guardar Ajuste"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
