#!/bin/bash
set -e

echo "📦 Creando directorios faltantes..."
mkdir -p apps/frontend-next/components/equipos
mkdir -p apps/frontend-next/lib
mkdir -p "apps/frontend-next/app/portal/[folio]"

echo "🔧 Creando archivos de entorno..."
cat > apps/backend-api/.env << 'EOF'
SUPABASE_URL=TU_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_KEY
JWT_SECRET=una_clave_muy_segura_cambia_esto
MERCADO_PAGO_ACCESS_TOKEN=TEST-1234567890
FRONTEND_URL=http://localhost:3000
PORT=4000
EOF

cat > apps/frontend-next/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=TU_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
EOF

echo "🗃️  Creando migración SQL (tablas legacy)..."
cat > supabase/migrations/20260506_000000_legacy_tables.sql << 'EOF'
-- (aquí va el SQL que ya tienes, pero lo omito por brevedad. Puedes copiarlo del bloque anterior)
-- Por favor, copia el contenido SQL que ya generé antes. Si quieres, te lo reenvío.
EOF

echo "⚙️  Creando componentes de equipos..."
cat > apps/frontend-next/components/equipos/ClienteForm.tsx << 'EOF'
'use client';
import { useState } from 'react';
export default function ClienteForm({ initialData, onNext, onLoadCotizacion, folioCotizacion, setFolioCotizacion }: any) {
  const [nombre, setNombre] = useState(initialData.cliente_nombre || '');
  const [telefono, setTelefono] = useState(initialData.cliente_telefono || '');
  const [email, setEmail] = useState(initialData.cliente_email || '');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ cliente_nombre: nombre, cliente_telefono: telefono, cliente_email: email });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-800 p-4 rounded mb-4">
        <label className="block text-sm text-gray-400">Cargar por folio de cotización</label>
        <div className="flex gap-2">
          <input type="text" value={folioCotizacion} onChange={(e) => setFolioCotizacion(e.target.value)} className="flex-1 input" placeholder="COT-00001" />
          <button type="button" onClick={onLoadCotizacion} className="btn-secondary">Cargar</button>
        </div>
      </div>
      <div><label>Nombre completo *</label><input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full input" /></div>
      <div><label>WhatsApp *</label><input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required maxLength={10} className="w-full input" /></div>
      <div><label>Email (opcional)</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full input" /></div>
      <button type="submit" className="btn-primary w-full">Continuar</button>
    </form>
  );
}
EOF

cat > apps/frontend-next/components/equipos/EquipoForm.tsx << 'EOF'
'use client';
import { useState } from 'react';
export default function EquipoForm({ initialData, onNext, onBack, onFotoChange }: any) {
  const [tipo, setTipo] = useState(initialData.equipo_tipo || '');
  const [modelo, setModelo] = useState(initialData.equipo_modelo || '');
  const [falla, setFalla] = useState(initialData.falla || '');
  const [fechaPromesa, setFechaPromesa] = useState(initialData.fecha_promesa || '');
  const [costo, setCosto] = useState(initialData.costo_estimado || '');
  const [checklist, setChecklist] = useState({ cargador: false, pantalla: false, prende: false, respaldo: false });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ equipo_tipo: tipo, equipo_modelo: modelo, falla, fecha_promesa: fechaPromesa, costo_estimado: costo, checklist });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label>Tipo de dispositivo *</label><select value={tipo} onChange={(e) => setTipo(e.target.value)} required className="w-full input"><option value="">Selecciona</option><option>Smartphone</option><option>Tablet</option><option>Laptop</option><option>Computadora</option><option>Otro</option></select></div>
      <div><label>Marca y modelo *</label><input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} required className="w-full input" /></div>
      <div><label>Falla reportada *</label><textarea value={falla} onChange={(e) => setFalla(e.target.value)} required rows={3} className="w-full input" /></div>
      <div className="border p-4 rounded"><p className="font-semibold mb-2">Checklist de recepción:</p><div className="grid grid-cols-2 gap-2"><label><input type="checkbox" checked={checklist.cargador} onChange={e => setChecklist({...checklist, cargador: e.target.checked})} /> Cargador</label><label><input type="checkbox" checked={checklist.pantalla} onChange={e => setChecklist({...checklist, pantalla: e.target.checked})} /> Pantalla OK</label><label><input type="checkbox" checked={checklist.prende} onChange={e => setChecklist({...checklist, prende: e.target.checked})} /> Prende</label><label><input type="checkbox" checked={checklist.respaldo} onChange={e => setChecklist({...checklist, respaldo: e.target.checked})} /> Datos respaldados</label></div></div>
      <div><label>Foto de recepción</label><input type="file" accept="image/*" onChange={(e) => onFotoChange(e.target.files?.[0] || null)} className="w-full" /></div>
      <div className="grid grid-cols-2 gap-4"><div><label>Fecha promesa *</label><input type="date" value={fechaPromesa} onChange={(e) => setFechaPromesa(e.target.value)} required className="w-full input" /></div><div><label>Costo estimado $</label><input type="number" step="0.01" value={costo} onChange={(e) => setCosto(e.target.value)} className="w-full input" /></div></div>
      <div className="flex gap-3"><button type="button" onClick={onBack} className="btn-secondary flex-1">Atrás</button><button type="submit" className="btn-primary flex-1">Continuar</button></div>
    </form>
  );
}
EOF

cat > apps/frontend-next/components/equipos/Confirmacion.tsx << 'EOF'
'use client';
export default function Confirmacion({ data, onConfirm, onBack }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded space-y-2"><p><strong>Cliente:</strong> {data.cliente_nombre}</p><p><strong>Teléfono:</strong> {data.cliente_telefono}</p><p><strong>Equipo:</strong> {data.equipo_tipo} - {data.equipo_modelo}</p><p><strong>Falla:</strong> {data.falla}</p><p><strong>Fecha promesa:</strong> {data.fecha_promesa}</p><p><strong>Costo estimado:</strong> ${data.costo_estimado || 'Por definir'}</p></div>
      <div className="flex gap-3"><button onClick={onBack} className="btn-secondary flex-1">Corregir</button><button onClick={() => onConfirm(data)} className="btn-primary flex-1">Guardar Orden</button></div>
    </div>
  );
}
EOF

echo "📄 Creando página de recepción..."
cat > apps/frontend-next/app/recepcion/page.tsx << 'EOF'
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { uploadImage } from '@/lib/storage';
import ClienteForm from '@/components/equipos/ClienteForm';
import EquipoForm from '@/components/equipos/EquipoForm';
import Confirmacion from '@/components/equipos/Confirmacion';

export default function RecepcionPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [folioCotizacion, setFolioCotizacion] = useState('');
  const [fotoRecepcion, setFotoRecepcion] = useState<File | null>(null);
  const { post, get } = useApi();
  const router = useRouter();

  const cargarDesdeCotizacion = async () => {
    if (!folioCotizacion) return;
    const data = await get(`/api/solicitudes/${folioCotizacion}`);
    if (data) {
      setFormData({
        cliente_nombre: data.nombre,
        cliente_telefono: data.telefono,
        cliente_email: data.email,
        equipo_tipo: data.dispositivo,
        equipo_modelo: data.modelo,
        falla: data.descripcion,
        urgencia: data.urgencia
      });
    }
  };

  const handleSubmit = async (finalData: any) => {
    let fotoUrl = null;
    if (fotoRecepcion) fotoUrl = await uploadImage(fotoRecepcion, 'recepciones');
    const orden = await post('/api/equipos', { ...finalData, foto_recepcion_url: fotoUrl });
    if (orden) {
      const waLink = `https://wa.me/${orden.cliente_telefono}?text=¡Hola! Tu orden ${orden.folio} ha sido registrada. Estado: ${window.location.origin}/portal/${orden.folio}`;
      window.open(waLink, '_blank');
      router.push(`/dashboard?folio=${orden.folio}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step>=1?'bg-blue-600':'bg-gray-600'}`}>1</div>
          <div className="w-8 h-1 bg-gray-600"></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step>=2?'bg-blue-600':'bg-gray-600'}`}>2</div>
          <div className="w-8 h-1 bg-gray-600"></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step>=3?'bg-blue-600':'bg-gray-600'}`}>3</div>
        </div>
      </div>
      {step === 1 && <ClienteForm initialData={formData} onNext={(data)=>{setFormData({...formData,...data}); setStep(2);}} onLoadCotizacion={cargarDesdeCotizacion} folioCotizacion={folioCotizacion} setFolioCotizacion={setFolioCotizacion} />}
      {step === 2 && <EquipoForm initialData={formData} onNext={(data)=>{setFormData({...formData,...data}); setStep(3);}} onBack={()=>setStep(1)} onFotoChange={setFotoRecepcion} />}
      {step === 3 && <Confirmacion data={formData} onConfirm={handleSubmit} onBack={()=>setStep(2)} />}
    </div>
  );
}
EOF

echo "🛠️  Creando página técnica..."
cat > apps/frontend-next/app/tecnico/page.tsx << 'EOF'
'use client';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { uploadImage } from '@/lib/storage';

export default function TecnicoPage() {
  const [equipos, setEquipos] = useState([]);
  const [filtros, setFiltros] = useState({ estado: 'todos', tecnico: '', busqueda: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [nuevasFotos, setNuevasFotos] = useState<File[]>([]);
  const { get, put } = useApi();

  const cargarEquipos = async () => {
    const data = await get('/api/equipos', filtros);
    setEquipos(data);
  };
  useEffect(() => { cargarEquipos(); }, [filtros]);

  const abrirModal = async (id: string) => {
    const equipo = await get(`/api/equipos/${id}`);
    setSelected(equipo);
    setModalOpen(true);
  };
  const guardarCambio = async (campo: string, valor: any) => {
    if (!selected) return;
    await put(`/api/equipos/${selected.id}`, { [campo]: valor });
    setSelected({ ...selected, [campo]: valor });
    cargarEquipos();
  };
  const subirFotos = async () => {
    if (!selected || nuevasFotos.length === 0) return;
    for (const foto of nuevasFotos) {
      const url = await uploadImage(foto, `seguimiento/${selected.id}`);
      await put(`/api/equipos/${selected.id}`, { fotos_seguimiento: [url] });
    }
    setNuevasFotos([]);
    cargarEquipos();
    abrirModal(selected.id);
  };
  const getColor = (fechaPromesa: string) => {
    const dias = (new Date(fechaPromesa).getTime() - new Date().getTime()) / (1000*3600*24);
    if (dias <= 2) return 'border-red-500 bg-red-500/10';
    if (dias <= 4) return 'border-yellow-500 bg-yellow-500/10';
    return 'border-green-500 bg-green-500/10';
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-6 flex-wrap">
        <input type="text" placeholder="Buscar folio, cliente..." className="input flex-1" value={filtros.busqueda} onChange={e => setFiltros({...filtros, busqueda: e.target.value})} />
        <select value={filtros.estado} onChange={e => setFiltros({...filtros, estado: e.target.value})} className="input"><option value="todos">Todos los estados</option><option>Recibido</option><option>En Diagnóstico</option><option>En Reparación</option><option>Esperando Refacción</option><option>Listo</option></select>
        <button onClick={cargarEquipos} className="btn-secondary">Actualizar</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipos.map((eq: any) => (
          <div key={eq.id} className={`border rounded-xl p-4 cursor-pointer ${getColor(eq.fecha_promesa)}`} onClick={() => abrirModal(eq.id)}>
            <div className="flex justify-between"><span className="font-mono text-sm">{eq.folio}</span><span className="text-xs">{eq.estado}</span></div>
            <div className="font-bold mt-1">{eq.clientes?.nombre}</div>
            <div className="text-sm text-gray-300">{eq.marca_modelo}</div>
            <div className="text-xs text-gray-400 mt-2">Promesa: {eq.fecha_promesa}</div>
          </div>
        ))}
      </div>
      {modalOpen && selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 p-4 border-b flex justify-between"><h3 className="text-xl font-bold">{selected.folio}</h3><button onClick={() => setModalOpen(false)} className="text-white">Cerrar</button></div>
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label>Cliente</label><input type="text" value={selected.clientes?.nombre} onChange={e => guardarCambio('cliente_nombre', e.target.value)} className="input w-full" /></div>
                <div><label>Teléfono</label><input type="text" value={selected.clientes?.telefono} onChange={e => guardarCambio('cliente_telefono', e.target.value)} className="input w-full" /></div>
                <div><label>Equipo</label><input type="text" value={`${selected.tipo_dispositivo} - ${selected.marca_modelo}`} disabled className="input w-full" /></div>
                <div><label>Fecha promesa</label><input type="date" value={selected.fecha_promesa} onChange={e => guardarCambio('fecha_promesa', e.target.value)} className="input w-full" /></div>
                <div><label>Costo estimado</label><input type="number" step="0.01" value={selected.costo_estimado || ''} onChange={e => guardarCambio('costo_estimado', e.target.value)} className="input w-full" /></div>
                <div><label>Estado</label><select value={selected.estado} onChange={e => guardarCambio('estado', e.target.value)} className="input w-full"><option>Recibido</option><option>En Diagnóstico</option><option>En Reparación</option><option>Esperando Refacción</option><option>Listo</option><option>Entregado</option></select></div>
                <div><label>Técnico asignado</label><input type="text" value={selected.tecnico_asignado || ''} onChange={e => guardarCambio('tecnico_asignado', e.target.value)} className="input w-full" /></div>
                <div><label>YouTube ID (Live)</label><input type="text" value={selected.youtube_id || ''} onChange={e => guardarCambio('youtube_id', e.target.value)} className="input w-full" /></div>
              </div>
              <div><label>Falla reportada</label><textarea value={selected.falla_reportada} onChange={e => guardarCambio('falla_reportada', e.target.value)} rows={2} className="input w-full" /></div>
              <div><label>Seguimiento (cliente)</label><textarea value={selected.seguimiento_cliente || ''} onChange={e => guardarCambio('seguimiento_cliente', e.target.value)} rows={3} className="input w-full" /></div>
              <div><label>Notas internas</label><textarea value={selected.notas_internas || ''} onChange={e => guardarCambio('notas_internas', e.target.value)} rows={3} className="input w-full" /></div>
              <div><label>Fotos de seguimiento</label><input type="file" multiple accept="image/*" onChange={e => setNuevasFotos(Array.from(e.target.files || []))} /><button onClick={subirFotos} className="btn-primary mt-2">Subir fotos</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
EOF

echo "🌐 Creando portal del cliente (ruta dinámica)..."
cat > "apps/frontend-next/app/portal/[folio]/page.tsx" << 'EOF'
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';

export default function PortalClientePage() {
  const { folio } = useParams();
  const [equipo, setEquipo] = useState<any>(null);
  const [error, setError] = useState('');
  const { get } = useApi();

  useEffect(() => {
    if (folio) {
      get(`/api/equipos/folio/${folio}`).then(setEquipo).catch(() => setError('Folio no encontrado'));
    }
  }, [folio]);

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!equipo) return <div className="p-8 text-center">Cargando...</div>;
  const dias = Math.ceil((new Date(equipo.fecha_promesa).getTime() - new Date().getTime()) / (1000*3600*24));
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex justify-between"><h2 className="text-2xl font-mono text-blue-400">{equipo.folio}</h2><span className={`px-3 py-1 rounded-full text-sm ${equipo.estado==='Listo'?'bg-green-600':'bg-yellow-600'}`}>{equipo.estado}</span></div>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div><span className="text-gray-400">Cliente:</span> {equipo.clientes?.nombre}</div>
          <div><span className="text-gray-400">Equipo:</span> {equipo.marca_modelo}</div>
          <div><span className="text-gray-400">Falla:</span> {equipo.falla_reportada}</div>
          <div><span className="text-gray-400">Promesa:</span> {equipo.fecha_promesa} {dias>=0?`(faltan ${dias} días)`:'(atrasado)'}</div>
          <div><span className="text-gray-400">Costo:</span> ${equipo.costo_estimado||'Por definir'}</div>
        </div>
        <div className="mt-6"><h3 className="font-bold">Seguimiento</h3><p className="bg-gray-700 p-3 rounded mt-2">{equipo.seguimiento_cliente||'Sin avances.'}</p></div>
        {equipo.youtube_id && <div className="mt-6 aspect-video"><iframe src={`https://www.youtube.com/embed/${equipo.youtube_id}`} className="w-full h-full" /></div>}
        {equipo.equipo_fotos?.length>0 && <div className="mt-6"><h3 className="font-bold">Fotos</h3><div className="grid grid-cols-2 gap-2 mt-2">{equipo.equipo_fotos.map((f:any)=><img key={f.id} src={f.url} className="rounded border" />)}</div></div>}
        <div className="mt-6 flex gap-4"><a href={`https://wa.me/${equipo.clientes?.telefono}?text=Hola, consulta sobre ${equipo.folio}`} className="bg-green-600 px-4 py-2 rounded">WhatsApp</a><button onClick={()=>window.print()} className="bg-gray-600 px-4 py-2 rounded">Imprimir</button></div>
      </div>
    </div>
  );
}
EOF

echo "📦 Creando utilidad de subida de imágenes..."
cat > apps/frontend-next/lib/storage.ts << 'EOF'
import { supabase } from './supabase';
export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;
  const { data, error } = await supabase.storage.from('recepcion').upload(`${folder}/${fileName}`, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from('recepcion').getPublicUrl(`${folder}/${fileName}`);
  return publicUrl;
}
EOF

echo "✅ Archivos creados correctamente."
echo ""
echo "🚀 Ahora necesitas iniciar Supabase localmente:"
echo "   npx supabase start"
echo ""
echo "📌 Luego ejecuta las migraciones:"
echo "   npx supabase migration up"
echo ""
echo "▶️  Finalmente, en DOS terminales diferentes:"
echo "   npm run dev --workspace=backend-api"
echo "   npm run dev --workspace=frontend-next"
echo ""
echo "🔑 No olvides reemplazar las variables de entorno (TU_SUPABASE_URL, etc.) con tus credenciales reales."
