import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool
};

/**
 * Esquema SaaS Endurecido (Cero Nuance)
 * Implementa Aislamiento RLS, Constraints de Integridad y Tipado UUID.
 */
export async function initDb() {
  // 1. Extensiones necesarias
  await db.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

  // 2. Tabla de Tenants (Configuración de Marca Blanca)
  await db.query(`
    CREATE TABLE IF NOT EXISTS tenants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL CHECK (slug ~* '^[a-z0-9-]+$'),
      name TEXT NOT NULL,
      logo_url TEXT,
      landing_url TEXT,
      primary_color TEXT DEFAULT '#1F7EDC',
      secondary_color TEXT DEFAULT '#2c3e50',
      tienda_whatsapp TEXT,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Tabla de Usuarios (Seguridad Bcrypt)
  await db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      usuario TEXT NOT NULL,
      password TEXT NOT NULL,
      nombre TEXT NOT NULL,
      rol TEXT NOT NULL CHECK (rol IN ('ADMIN', 'TECNICO', 'AGENTE')),
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(tenant_id, usuario) -- El usuario es único POR TALLER
    );
  `);

  // 4. Tablas Operativas con Aislamiento Forzado (RLS)
  
  // Solicitudes
  await db.query(`
    CREATE TABLE IF NOT EXISTS solicitudes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      folio_cotizacion TEXT UNIQUE NOT NULL,
      nombre TEXT NOT NULL,
      telefono TEXT,
      email TEXT,
      dispositivo TEXT NOT NULL,
      modelo TEXT,
      problemas TEXT,
      estado TEXT DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Cotizado', 'Rechazado', 'Aceptado')),
      sucursal_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Equipos (Semaforo / Taller)
  await db.query(`
    CREATE TABLE IF NOT EXISTS equipos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      folio TEXT UNIQUE NOT NULL,
      dispositivo TEXT NOT NULL,
      modelo TEXT,
      serie TEXT,
      problema_reportado TEXT,
      diagnostico_tecnico TEXT,
      estado TEXT DEFAULT 'Ingresado' CHECK (estado IN ('Ingresado', 'En Diagnóstico', 'Esperando Refacción', 'En Reparación', 'Listo para Entrega', 'Entregado')),
      sucursal_id TEXT,
      fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Clientes
  await db.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      nombre TEXT NOT NULL,
      telefono TEXT,
      email TEXT,
      etiqueta TEXT,
      moroso BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Gastos
  await db.query(`
    CREATE TABLE IF NOT EXISTS gastos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      fecha DATE NOT NULL DEFAULT CURRENT_DATE,
      categoria TEXT NOT NULL,
      total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
      descripcion TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Habilitar RLS e Índices en todas las tablas
  const saasTables = ['solicitudes', 'equipos', 'clientes', 'gastos', 'usuarios'];
  
  for (const table of saasTables) {
    await db.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
    await db.query(`DROP POLICY IF EXISTS ${table}_isolation ON ${table};`);
    await db.query(`
      CREATE POLICY ${table}_isolation ON ${table}
      USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
    `);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_${table}_tenant ON ${table}(tenant_id);`);
  }

  console.log('✅ Base de Datos Blindada: RLS Parameterizado y Constraints de Integridad activados.');
}
