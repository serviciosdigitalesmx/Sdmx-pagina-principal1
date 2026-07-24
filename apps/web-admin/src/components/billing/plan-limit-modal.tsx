import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertTriangle, Lock } from "lucide-react";

export function PlanLimitModal() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const handleLimitExceeded = (e: Event) => {
      const event = e as CustomEvent;
      setDetails(event.detail);
      setOpen(true);
    };

    window.addEventListener("plan_limit_exceeded", handleLimitExceeded);
    return () => window.removeEventListener("plan_limit_exceeded", handleLimitExceeded);
  }, []);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-slate-800 bg-slate-950 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-400">
            <Lock className="h-5 w-5" />
            Límite de Plan Excedido
          </DialogTitle>
          <DialogDescription>
            Has alcanzado el límite de {details?.resource === 'orders' ? 'órdenes' : details?.resource === 'sucursales' ? 'sucursales' : 'usuarios'} permitido en tu plan actual ({details?.planKey}).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <div className="text-sm text-rose-200">
                Límite: <strong className="text-rose-100">{details?.limit}</strong>
                <br />
                Actual: <strong className="text-rose-100">{details?.current}</strong>
              </div>
            </div>
            <p className="mt-3 text-sm text-rose-200/80">
              Necesitas mejorar tu plan para poder continuar creando este recurso.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              router.push("/dashboard/billing");
            }}
          >
            Mejorar Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
