import { createHmac, randomBytes } from 'crypto';
import { supabaseAdmin } from '@white-label/database';
import { getRequestIp } from '../lib/request-ip';

function base32Encode(buffer: Buffer) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

function base32Decode(secret: string) {
  const normalized = secret.replace(/=+$/g, '').toUpperCase();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const char of normalized) {
    const index = alphabet.indexOf(char);
    if (index < 0) {
      continue;
    }
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

export function generateTotpSecret() {
  return base32Encode(randomBytes(20));
}

export function buildOtpAuthUri(email: string, secret: string, issuer = 'SDMX') {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${encodeURIComponent(secret)}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

export function verifyTotp(secret: string, code: string, window = 1) {
  const normalizedCode = code.replace(/\s+/g, '').trim();
  if (!/^\d{6}$/.test(normalizedCode)) {
    return false;
  }

  const counter = Math.floor(Date.now() / 30000);
  const key = base32Decode(secret);

  for (let offset = -window; offset <= window; offset += 1) {
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64BE(BigInt(counter + offset));
    const hmac = createHmac('sha1', key).update(buffer).digest();
    const index = hmac[hmac.length - 1] & 0x0f;
    const binary =
      ((hmac[index] & 0x7f) << 24) |
      ((hmac[index + 1] & 0xff) << 16) |
      ((hmac[index + 2] & 0xff) << 8) |
      (hmac[index + 3] & 0xff);
    const otp = (binary % 1_000_000).toString().padStart(6, '0');
    if (otp === normalizedCode) {
      return true;
    }
  }

  return false;
}

export async function resolveTenantJwtSecret(tenantId: string) {
  const globalSecret = process.env.JWT_SECRET;
  if (!globalSecret) {
    throw new Error('JWT_SECRET is required');
  }

  const { data } = await supabaseAdmin
    .from('tenants')
    .select('security_jwt_secret')
    .eq('id', tenantId)
    .maybeSingle();

  return data?.security_jwt_secret?.trim() || globalSecret;
}

export async function writeAuditLog(input: {
  tenantId: string;
  userId?: string | null;
  action: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  dataBefore?: Record<string, unknown> | null;
  dataAfter?: Record<string, unknown> | null;
}) {
  const { error } = await supabaseAdmin.from('audit_logs').insert([{
    tenant_id: input.tenantId,
    user_id: input.userId ?? null,
    action: input.action,
    ip_address: getRequestIp(undefined, input.ipAddress ?? null),
    user_agent: input.userAgent ?? null,
    data_before: input.dataBefore ?? null,
    data_after: input.dataAfter ?? null,
  }]);

  if (error) {
    throw error;
  }
}
