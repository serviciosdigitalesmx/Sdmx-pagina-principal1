-- =====================================================
-- Tablas faltantes para compatibilidad con el sistema legacy
-- =====================================================

CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    etiqueta VARCHAR(50) DEFAULT 'nuevo',
    notas TEXT,
    riesgo BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES clientes(id),
    folio VARCHAR(20) UNIQUE NOT NULL,
    tipo_dispositivo VARCHAR(50),
    marca_modelo VARCHAR(255) NOT NULL,
    falla_reportada TEXT NOT NULL,
    estado VARCHAR(50) DEFAULT 'Recibido',
    tecnico_asignado VARCHAR(100),
    costo_estimado NUMERIC(10,2),
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    fecha_promesa DATE NOT NULL,
    notas_internas TEXT,
    seguimiento_cliente TEXT,
    resolucion TEXT,
    youtube_id VARCHAR(50),
    foto_recepcion_url TEXT,
    checklist JSONB DEFAULT '{"cargador":false,"pantalla":false,"prende":false,"respaldo":false}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    entregado_en TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS equipo_historial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipo_id UUID NOT NULL REFERENCES equipos(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50),
    comentario TEXT,
    usuario_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipo_fotos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipo_id UUID NOT NULL REFERENCES equipos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    descripcion VARCHAR(255),
    tipo VARCHAR(20) DEFAULT 'seguimiento',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS solicitudes_cotizacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    dispositivo VARCHAR(100),
    modelo VARCHAR(255),
    problemas TEXT[],
    descripcion TEXT,
    urgencia VARCHAR(20) DEFAULT 'media',
    estado VARCHAR(30) DEFAULT 'pendiente',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cotizaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    solicitud_id UUID REFERENCES solicitudes_cotizacion(id),
    folio VARCHAR(20) UNIQUE NOT NULL,
    cliente_nombre VARCHAR(150),
    cliente_telefono VARCHAR(20),
    items JSONB NOT NULL,
    subtotal NUMERIC(10,2),
    iva_porcentaje NUMERIC(5,2) DEFAULT 16,
    iva_monto NUMERIC(10,2),
    total NUMERIC(10,2),
    anticipo NUMERIC(10,2) DEFAULT 0,
    notas TEXT,
    creada_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    enviada_whatsapp BOOLEAN DEFAULT false,
    archivada BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS movimientos_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES productos(id),
    tipo VARCHAR(20) NOT NULL,
    cantidad NUMERIC(12,3) NOT NULL,
    costo_unitario NUMERIC(10,2),
    folio_relacionado VARCHAR(50),
    referencia VARCHAR(255),
    usuario VARCHAR(100),
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transferencias_stock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    origen_sucursal_id UUID REFERENCES sucursales(id),
    destino_sucursal_id UUID REFERENCES sucursales(id),
    producto_id UUID NOT NULL REFERENCES productos(id),
    cantidad NUMERIC(12,3) NOT NULL,
    motivo VARCHAR(255),
    usuario VARCHAR(100),
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ========== RLS POLICIES ==========
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipo_historial ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipo_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_cotizacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE transferencias_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_clientes ON clientes USING (tenant_id = current_setting('app.current_tenant', true)::UUID);
CREATE POLICY tenant_equipos ON equipos USING (tenant_id = current_setting('app.current_tenant', true)::UUID);
CREATE POLICY tenant_equipo_historial ON equipo_historial USING (
    equipo_id IN (SELECT id FROM equipos WHERE tenant_id = current_setting('app.current_tenant', true)::UUID)
);
CREATE POLICY tenant_equipo_fotos ON equipo_fotos USING (
    equipo_id IN (SELECT id FROM equipos WHERE tenant_id = current_setting('app.current_tenant', true)::UUID)
);
CREATE POLICY tenant_solicitudes ON solicitudes_cotizacion USING (tenant_id = current_setting('app.current_tenant', true)::UUID);
CREATE POLICY tenant_cotizaciones ON cotizaciones USING (tenant_id = current_setting('app.current_tenant', true)::UUID);
CREATE POLICY tenant_movimientos ON movimientos_stock USING (tenant_id = current_setting('app.current_tenant', true)::UUID);
CREATE POLICY tenant_transferencias ON transferencias_stock USING (tenant_id = current_setting('app.current_tenant', true)::UUID);

-- Trigger para generar folio único de equipo
CREATE OR REPLACE FUNCTION generar_folio_equipo()
RETURNS TRIGGER AS $$
DECLARE consecutivo INT;
BEGIN
    SELECT COALESCE(MAX(substring(folio FROM '[0-9]+$')::int), 0) + 1 INTO consecutivo
    FROM equipos WHERE tenant_id = NEW.tenant_id AND folio LIKE 'SRF-' || to_char(NEW.fecha_ingreso, 'YYYYMMDD') || '-%';
    NEW.folio := 'SRF-' || to_char(NEW.fecha_ingreso, 'YYYYMMDD') || '-' || LPAD(consecutivo::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generar_folio_equipo ON equipos;
CREATE TRIGGER trg_generar_folio_equipo
BEFORE INSERT ON equipos
FOR EACH ROW WHEN (NEW.folio IS NULL)
EXECUTE FUNCTION generar_folio_equipo();-- (aquí va el SQL que ya tienes, pero lo omito por brevedad. Puedes copiarlo del bloque anterior)
-- Por favor, copia el contenido SQL que ya generé antes. Si quieres, te lo reenvío.
