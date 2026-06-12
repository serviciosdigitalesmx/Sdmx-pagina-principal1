import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { supabaseAdmin } from '@white-label/database';
import { getRequestIp } from '../lib/request-ip';
import { buildOtpAuthUri, generateTotpSecret, verifyTotp, writeAuditLog } from '../services/security-backoffice';

const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['owner', 'manager', 'technician']).default('technician'),
  sucursalId: z.string().uuid().nullable().optional(),
});

const auditQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(100),
  action: z.string().trim().optional(),
  userId: z.string().trim().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

const rotateKeysSchema = z.object({
  confirm: z.literal(true),
});

const mfaVerifySchema = z.object({
  code: z.string().trim().min(6).max(6),
});

const mfaRequirementSchema = z.object({
  enabled: z.boolean(),
});

const securityConfigSchema = z.object({
  adminPasswordConfigured: z.boolean().optional(),
  requireAdminMfa: z.boolean().optional(),
  require_admin_mfa: z.boolean().optional(),
  mensajeAutorizacion: z.string().trim().max(500).optional(),
  bitacoraActiva: z.boolean().optional(),
});

async function countTenantUsers(tenantId: string) {
  const { count, error } = await supabaseAdmin
    .from('users')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function assertSucursalOwnership(tenantId: string, sucursalId: string) {
  const { data, error } = await supabaseAdmin
    .from('sucursales')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('id', sucursalId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

function buildSecurityConfigPayload(row: { require_admin_mfa?: boolean | null } | null) {
  const adminPasswordConfigured = Boolean(row?.require_admin_mfa);
  return {
    adminPasswordConfigured,
    mensajeAutorizacion: adminPasswordConfigured ? 'Autorización administrativa requerida' : 'Autorización administrativa disponible',
    bitacoraActiva: true,
    acciones: [
      {
        clave: 'mfa',
        titulo: 'MFA',
        descripcion: 'Autenticación multifactor para administradores',
        accion: 'security.mfa.requirement.updated',
        requiereAdmin: true,
      },
      {
        clave: 'audit',
        titulo: 'Bitácora',
        descripcion: 'Registro de eventos de seguridad',
        accion: 'security.audit.view',
        requiereAdmin: true,
      },
      {
        clave: 'sessions',
        titulo: 'Sesiones',
        descripcion: 'Control de sesiones activas',
        accion: 'security.session.revoked',
        requiereAdmin: true,
      },
    ],
  };
}

export const getSecuritySummary = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const [usersResult, sucursalesResult] = await Promise.all([
      supabaseAdmin.from('users').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
      supabaseAdmin.from('sucursales').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId),
    ]);

    if (usersResult.error) {
      return res.status(502).json({ error: 'Failed to fetch users summary', details: usersResult.error.message });
    }

    if (sucursalesResult.error) {
      return res.status(502).json({ error: 'Failed to fetch sucursales summary', details: sucursalesResult.error.message });
    }

    return res.json({
      success: true,
      data: {
        users: usersResult.count ?? 0,
        sucursales: sucursalesResult.count ?? 0,
      },
    });
  } catch (error) {
    console.error('Error getting security summary:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getSecurityConfig = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const { data: tenantRow, error } = await supabaseAdmin
      .from('tenants')
      .select('id, require_admin_mfa')
      .eq('id', tenantId)
      .maybeSingle();

    if (error) {
      return res.status(502).json({ error: 'Failed to load security config', details: error.message });
    }

    return res.json({
      success: true,
      data: buildSecurityConfigPayload(tenantRow),
    });
  } catch (error) {
    console.error('Error getting security config:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateSecurityConfig = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (req.user?.role !== 'owner') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const parsed = securityConfigSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const { data: beforeRow, error: fetchError } = await supabaseAdmin
      .from('tenants')
      .select('id, require_admin_mfa')
      .eq('id', tenantId)
      .maybeSingle();

    if (fetchError) {
      return res.status(502).json({ error: 'Failed to load security config', details: fetchError.message });
    }

    const nextRequireAdminMfa = parsed.data.requireAdminMfa ?? parsed.data.require_admin_mfa ?? parsed.data.adminPasswordConfigured;

    if (typeof nextRequireAdminMfa === 'boolean') {
      const { error: updateError } = await supabaseAdmin
        .from('tenants')
        .update({ require_admin_mfa: nextRequireAdminMfa })
        .eq('id', tenantId);

      if (updateError) {
        return res.status(502).json({ error: 'Failed to update security config', details: updateError.message });
      }
    }

    await writeAuditLog({
      tenantId,
      userId: req.user?.userId ?? null,
      action: 'security.config.updated',
      ipAddress: getRequestIp(req.headers, req.ip),
      userAgent: req.headers['user-agent'] ?? null,
      dataBefore: beforeRow ?? null,
      dataAfter: { ...parsed.data, require_admin_mfa: nextRequireAdminMfa ?? beforeRow?.require_admin_mfa ?? false },
    });

    return res.json({
      success: true,
      data: buildSecurityConfigPayload({
        require_admin_mfa: typeof nextRequireAdminMfa === 'boolean' ? nextRequireAdminMfa : beforeRow?.require_admin_mfa ?? null,
      }),
    });
  } catch (error) {
    console.error('Error updating security config:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const tenantCapabilities = req.tenantCapabilities;
    const maxUsers = tenantCapabilities?.limits.users ?? null;
    if (typeof maxUsers === 'number') {
      const currentUsers = await countTenantUsers(tenantId);
      if (currentUsers >= maxUsers) {
        return res.status(403).json({
          error: 'User limit reached for this plan',
          details: {
            currentUsers,
            maxUsers,
            planKey: tenantCapabilities?.plan_key ?? null,
          },
        });
      }
    }

    const body = inviteUserSchema.parse(req.body);

    if (body.sucursalId) {
      const ownsSucursal = await assertSucursalOwnership(tenantId, body.sucursalId);
      if (!ownsSucursal) {
        return res.status(404).json({ error: 'Sucursal not found' });
      }
    }

    const { data: tenantRow, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .select('id, slug')
      .eq('id', tenantId)
      .maybeSingle();

    if (tenantError) {
      return res.status(502).json({ error: 'Failed to resolve tenant', details: tenantError.message });
    }

    if (!tenantRow) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const { data: inviteResult, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(body.email, {
      data: {
        tenant_id: tenantId,
        tenant_slug: tenantRow.slug,
        role: body.role,
        sucursal_id: body.sucursalId ?? undefined,
      },
    });

    if (inviteError || !inviteResult.user) {
      return res.status(502).json({ error: 'Failed to invite user', details: inviteError?.message ?? 'Unknown error' });
    }

    const { data: createdUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert([{
        tenant_id: tenantId,
        auth_user_id: inviteResult.user.id,
        full_name: inviteResult.user.user_metadata?.full_name ?? null,
        email: body.email,
        role: body.role,
        is_active: true,
        sucursal_id: body.sucursalId ?? null,
      }])
      .select('id, tenant_id, auth_user_id, full_name, email, role, is_active, sucursal_id, created_at')
      .single();

    if (createError || !createdUser) {
      await supabaseAdmin.auth.admin.deleteUser(inviteResult.user.id).catch((rollbackError) => {
        console.error('Failed to rollback invited auth user:', rollbackError);
      });

      return res.status(502).json({ error: 'Failed to persist invited user', details: createError?.message ?? 'Unknown error' });
    }

    return res.status(201).json({
      success: true,
      data: {
        user: createdUser,
        invite: {
          id: inviteResult.user.id,
          email: body.email,
          role: body.role,
          sucursalId: body.sucursalId ?? null,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid payload', details: error.errors });
    }
    console.error('Error inviting user:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const listAuditLogs = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (req.user?.role !== 'owner') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const parsed = auditQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid query params', details: parsed.error.flatten() });
    }

    const { page, pageSize, action, userId, from, to } = parsed.data;
    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;

    let query = supabaseAdmin
      .from('audit_logs')
      .select('id, tenant_id, user_id, action, ip_address, user_agent, data_before, data_after, created_at', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .range(fromIndex, toIndex);

    if (action) {
      query = query.ilike('action', `%${action}%`);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (from) {
      query = query.gte('created_at', from);
    }

    if (to) {
      query = query.lte('created_at', to);
    }

    const { data, error, count } = await query;
    if (error) {
      return res.status(502).json({ error: 'Failed to fetch audit logs', details: error.message });
    }

    return res.json({
      success: true,
      data: {
        items: data ?? [],
        page,
        pageSize,
        total: count ?? 0,
        hasMore: page * pageSize < (count ?? 0),
      },
    });
  } catch (error) {
    console.error('Error listing audit logs:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const listActiveSessions = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (req.user?.role !== 'owner') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { data, error } = await supabaseAdmin
      .from('security_sessions')
      .select('id, tenant_id, user_id, session_key, ip_address, user_agent, last_activity_at, revoked_at, created_at, updated_at, users(id, name, full_name, email, role)')
      .eq('tenant_id', tenantId)
      .is('revoked_at', null)
      .order('last_activity_at', { ascending: false })
      .limit(100);

    if (error) {
      return res.status(502).json({ error: 'Failed to fetch sessions', details: error.message });
    }

    return res.json({
      success: true,
      data: (data ?? []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        sessionKey: row.session_key,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        lastActivityAt: row.last_activity_at,
        createdAt: row.created_at,
        user: Array.isArray(row.users) ? row.users[0] ?? null : row.users ?? null,
      })),
    });
  } catch (error) {
    console.error('Error listing active sessions:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const revokeSession = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (req.user?.role !== 'owner') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const sessionId = req.params.id;
    const { data, error } = await supabaseAdmin
      .from('security_sessions')
      .update({ revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('tenant_id', tenantId)
      .eq('id', sessionId)
      .select('id, tenant_id, user_id, revoked_at')
      .maybeSingle();

    if (error) {
      return res.status(502).json({ error: 'Failed to revoke session', details: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await writeAuditLog({
      tenantId,
      userId: req.user?.userId ?? null,
      action: 'security.session.revoked',
      ipAddress: getRequestIp(req.headers, req.ip),
      userAgent: req.headers['user-agent'] ?? null,
      dataAfter: { sessionId: data.id, revokedAt: data.revoked_at },
    });

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error revoking session:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const rotateKeys = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (req.user?.role !== 'owner') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const parsed = rotateKeysSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const { data: beforeRow, error: fetchError } = await supabaseAdmin
      .from('tenants')
      .select('security_jwt_secret')
      .eq('id', tenantId)
      .maybeSingle();

    if (fetchError) {
      return res.status(502).json({ error: 'Failed to load tenant security state', details: fetchError.message });
    }

    const nextSecret = randomBytes(32).toString('hex');
    const { error: updateError } = await supabaseAdmin
      .from('tenants')
      .update({ security_jwt_secret: nextSecret })
      .eq('id', tenantId);

    if (updateError) {
      return res.status(502).json({ error: 'Failed to rotate keys', details: updateError.message });
    }

    await supabaseAdmin
      .from('security_sessions')
      .update({ revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('tenant_id', tenantId)
      .is('revoked_at', null);

    await writeAuditLog({
      tenantId,
      userId: req.user?.userId ?? null,
      action: 'security.keys.rotated',
      ipAddress: getRequestIp(req.headers, req.ip),
      userAgent: req.headers['user-agent'] ?? null,
      dataBefore: beforeRow ?? null,
      dataAfter: { security_jwt_secret: '[redacted]' },
    });

    return res.json({ success: true, data: { rotated: true } });
  } catch (error) {
    console.error('Error rotating keys:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const setupAdminMfa = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId || !req.user?.userId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const { data: userRow, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role, mfa_secret, mfa_enabled')
      .eq('id', req.user.userId)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error) {
      return res.status(502).json({ error: error.message });
    }

    if (!userRow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const secret = userRow.mfa_secret?.trim() || generateTotpSecret();
    const uri = buildOtpAuthUri(userRow.email ?? req.user.email ?? 'user', secret);

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ mfa_secret: secret })
      .eq('id', userRow.id)
      .eq('tenant_id', tenantId);

    if (updateError) {
      return res.status(502).json({ error: updateError.message });
    }

    return res.json({
      success: true,
      data: {
        secret,
        uri,
        mfaEnabled: Boolean(userRow.mfa_enabled),
      },
    });
  } catch (error) {
    console.error('Error setting up MFA:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const verifyAdminMfa = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId || !req.user?.userId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    const parsed = mfaVerifySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const { data: userRow, error } = await supabaseAdmin
      .from('users')
      .select('id, email, mfa_secret')
      .eq('id', req.user.userId)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error) {
      return res.status(502).json({ error: error.message });
    }

    if (!userRow?.mfa_secret) {
      return res.status(400).json({ error: 'MFA secret not initialized' });
    }

    const isValid = verifyTotp(userRow.mfa_secret, parsed.data.code);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        mfa_enabled: true,
        mfa_verified_at: new Date().toISOString(),
      })
      .eq('id', userRow.id)
      .eq('tenant_id', tenantId);

    if (updateError) {
      return res.status(502).json({ error: updateError.message });
    }

    await writeAuditLog({
      tenantId,
      userId: req.user.userId,
      action: 'security.mfa.enabled',
      ipAddress: getRequestIp(req.headers, req.ip),
      userAgent: req.headers['user-agent'] ?? null,
      dataAfter: { userId: userRow.id },
    });

    return res.json({ success: true, data: { mfaEnabled: true } });
  } catch (error) {
    console.error('Error verifying MFA:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateAdminMfaRequirement = async (req: Request, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      return res.status(401).json({ error: 'Tenant context is required' });
    }

    if (req.user?.role !== 'owner') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const parsed = mfaRequirementSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const { data: beforeRow, error: fetchError } = await supabaseAdmin
      .from('tenants')
      .select('id, require_admin_mfa')
      .eq('id', tenantId)
      .maybeSingle();

    if (fetchError) {
      return res.status(502).json({ error: fetchError.message });
    }

    const { data, error } = await supabaseAdmin
      .from('tenants')
      .update({ require_admin_mfa: parsed.data.enabled })
      .eq('id', tenantId)
      .select('id, require_admin_mfa')
      .maybeSingle();

    if (error) {
      return res.status(502).json({ error: error.message });
    }

    await writeAuditLog({
      tenantId,
      userId: req.user?.userId ?? null,
      action: 'security.mfa.requirement.updated',
      ipAddress: getRequestIp(req.headers, req.ip),
      userAgent: req.headers['user-agent'] ?? null,
      dataBefore: beforeRow ?? null,
      dataAfter: data ?? null,
    });

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error updating MFA requirement:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
