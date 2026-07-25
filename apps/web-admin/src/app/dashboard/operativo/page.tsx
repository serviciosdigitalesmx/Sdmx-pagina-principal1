'use client';

import { useState } from 'react';
import { ClipboardList, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuickReceiveModal } from '@/components/ordenes/quick-receive-modal';
import { getNewEntityLabel } from '@/lib/labels';

export default function OperativoPage() {
  const [modalOpen, setModalOpen] = useState(true); // Arrancamos con el modal abierto por velocidad
  const newOrderLabel = getNewEntityLabel();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center border-8 border-white shadow-sm">
          <ClipboardList className="h-8 w-8 text-sky-500" />
        </div>
        
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Módulo de Recepción</h1>
          <p className="mt-3 text-slate-500 leading-relaxed">
            Hemos actualizado el sistema a la nueva versión <strong>Single-Pane Reception</strong>. 
            Ahora puedes capturar equipos, firmar y subir fotografías 10 veces más rápido en una sola pantalla, sin riesgo de perder datos.
          </p>
        </div>

        <Button 
          onClick={() => setModalOpen(true)}
          className="h-14 w-full bg-sky-500 hover:bg-sky-600 text-lg font-bold shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Abrir {newOrderLabel}
        </Button>
      </div>

      <QuickReceiveModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
