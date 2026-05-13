import { db } from '../db';

/**
 * Repositorio de Grado Producción con Aislamiento RLS
 */

async function executeWithTenant<T>(tenantId: string, fn: (client: any) => Promise<T>): Promise<T> {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    // Inyectar el ID del tenant de forma segura usando set_config
    await client.query('SELECT set_config(\'app.current_tenant_id\', $1, true)', [tenantId]);
    const result = await fn(client);

    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// --- SOLICITUDES / EQUIPOS ---

export async function listarSolicitudes(tenantId: string, params: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM solicitudes ORDER BY created_at DESC LIMIT 50');
    return { rows: res.rows };
  });
}

export async function getSolicitudByFolio(tenantId: string, folio: string) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM solicitudes WHERE folio_cotizacion = $1', [folio]);
    return { solicitud: res.rows[0] || null };
  });
}

export async function crearSolicitud(tenantId: string, payload: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query(
      'INSERT INTO solicitudes (tenant_id, nombre, telefono, email, dispositivo, modelo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tenantId, payload.nombre, payload.telefono, payload.email, payload.dispositivo, payload.modelo]
    );
    return { ok: true, data: res.rows[0] };
  });
}

export async function getSemaforoData(tenantId: string, params: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM equipos ORDER BY fecha_ingreso DESC');
    return { rows: res.rows };
  });
}

export async function getEquipoByFolio(tenantId: string, folio: string) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM equipos WHERE folio = $1', [folio]);
    return { equipo: res.rows[0] || null };
  });
}

export async function actualizarEquipo(tenantId: string, folio: string, payload: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query(
      'UPDATE equipos SET dispositivo=$1, modelo=$2, estado=$3 WHERE folio=$4 RETURNING *',
      [payload.dispositivo, payload.modelo, payload.estado, folio]
    );
    return { ok: true, success: true, folio };
  });
}

export async function crearEquipo(tenantId: string, payload: any) {
  return executeWithTenant(tenantId, async (client) => {
    const folio = `EQ-${Date.now()}`;
    const res = await client.query(
      'INSERT INTO equipos (tenant_id, folio, dispositivo, modelo, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tenantId, folio, payload.dispositivo, payload.modelo, 'Ingresado']
    );
    return { ok: true, success: true, folio };
  });
}

export async function listarArchivo(tenantId: string, params: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM equipos WHERE estado = $1', ['Entregado']);
    return { rows: res.rows };
  });
}

// --- CLIENTES ---

export async function listarClientes(tenantId: string, params: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM clientes ORDER BY nombre ASC');
    return { rows: res.rows };
  });
}

export async function guardarCliente(tenantId: string, payload: any) {
  return executeWithTenant(tenantId, async (client) => {
    if (payload.id) {
      const res = await client.query(
        'UPDATE clientes SET nombre=$1, telefono=$2 WHERE id=$3 RETURNING *',
        [payload.nombre, payload.telefono, payload.id]
      );
      return { ok: true, data: res.rows[0] };
    } else {
      const res = await client.query(
        'INSERT INTO clientes (tenant_id, nombre, telefono) VALUES ($1, $2, $3) RETURNING *',
        [tenantId, payload.nombre, payload.telefono]
      );
      return { ok: true, data: res.rows[0] };
    }
  });
}

// --- GASTOS / STOCK / TAREAS ---

export async function listarGastos(tenantId: string, params: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM gastos ORDER BY created_at DESC');
    return { items: res.rows };
  });
}

export async function guardarGasto(tenantId: string, payload: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query(
      'INSERT INTO gastos (tenant_id, nombre, total) VALUES ($1, $2, $3) RETURNING *',
      [tenantId, payload.nombre, payload.total]
    );
    return { ok: true, data: res.rows[0] };
  });
}

export async function listarStock(tenantId: string, params: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM stock ORDER BY nombre ASC');
    return { items: res.rows };
  });
}

export async function guardarProductoStock(tenantId: string, payload: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query(
      'INSERT INTO stock (tenant_id, nombre, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [tenantId, payload.nombre, payload.cantidad]
    );
    return { ok: true, data: res.rows[0] };
  });
}

export async function listarTareas(tenantId: string, params: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM tareas ORDER BY created_at DESC');
    return { rows: res.rows };
  });
}

export async function listarProveedores(tenantId: string, params: any) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM proveedores ORDER BY nombre ASC');
    return { rows: res.rows };
  });
}

export async function listarSucursales(tenantId: string) {
  return executeWithTenant(tenantId, async (client) => {
    const res = await client.query('SELECT * FROM sucursales WHERE activa = true');
    return { rows: res.rows };
  });
}

// --- REPORTES / FINANZAS ---

export async function getResumenFinanzas(tenantId: string, params: any) {
  return executeWithTenant(tenantId, async (client) => {
    const ingresos = await client.query('SELECT COALESCE(SUM(total), 0) as total FROM gastos'); // Simulación
    const gastosCount = await client.query('SELECT COUNT(*) as count FROM gastos');
    const ordenes = await client.query('SELECT COUNT(*) as count FROM equipos');
    
    const totalVentas = Number(ingresos.rows[0]?.total || 0);
    const totalOrdenes = Number(ordenes.rows[0]?.count || 0);

    return {
      kpis: {
        ingresos: totalVentas,
        egresos: 0, // Placeholder hasta tener tabla de egresos separada
        utilidadBruta: totalVentas,
        ticketPromedio: totalOrdenes > 0 ? totalVentas / totalOrdenes : 0,
        ordenesEntregadas: Number((await client.query("SELECT COUNT(*) FROM equipos WHERE estado='Entregado'")).rows[0].count)
      },
      resumenCategorias: (await client.query('SELECT categoria, SUM(total) as total FROM gastos GROUP BY categoria')).rows
    };
  });
}

export async function generarReporteOperativo(tenantId: string, params: any) {
  return executeWithTenant(tenantId, async (client) => {
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE estado = 'Ingresado') as ingresados,
        COUNT(*) FILTER (WHERE estado = 'Listo para Entrega') as listos,
        COUNT(*) FILTER (WHERE estado = 'Entregado') as entregados
      FROM equipos
    `);
    
    return {
      resumen: stats.rows[0],
      detalle: (await client.query('SELECT dispositivo, modelo, estado FROM equipos LIMIT 10')).rows
    };
  });
}

