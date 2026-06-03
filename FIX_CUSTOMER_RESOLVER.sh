#!/bin/bash
set -e

FILE="apps/api/src/controllers/requests.ts"
BACKUP="${FILE}.bak.$(date +%Y%m%d_%H%M%S)"

cp "$FILE" "$BACKUP"

python3 <<'PY'
from pathlib import Path

p = Path("apps/api/src/controllers/requests.ts")
text = p.read_text()

old = """
    let customerId: string | null = null;
    if (body.createCustomer) {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert([
          {
            tenant_id: tenantId,
            name: requestRow.customer_name,
            phone: requestRow.customer_phone,
            email: requestRow.customer_email || null,
          },
        ])
        .select('id')
        .single();

      if (customerError || !customerData) {
        return res.status(502).json({ error: 'Failed to create customer from request', details: customerError?.message ?? 'Unknown error' });
      }

      customerId = customerData.id;
    }
"""

new = """
    let customerId: string | null = null;

    if (body.createCustomer) {
      const phone = String(requestRow.customer_phone ?? '').trim();
      const email = String(requestRow.customer_email ?? '').trim();

      let existingCustomer = null;

      if (phone) {
        const { data } = await supabase
          .from('customers')
          .select('id')
          .eq('tenant_id', tenantId)
          .eq('phone', phone)
          .maybeSingle();

        existingCustomer = data;
      }

      if (!existingCustomer && email) {
        const { data } = await supabase
          .from('customers')
          .select('id')
          .eq('tenant_id', tenantId)
          .eq('email', email)
          .maybeSingle();

        existingCustomer = data;
      }

      if (existingCustomer?.id) {
        customerId = existingCustomer.id;
      } else {
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .insert([
            {
              tenant_id: tenantId,
              name: requestRow.customer_name,
              phone: phone || null,
              email: email || null,
            },
          ])
          .select('id')
          .single();

        if (customerError || !customerData) {
          return res.status(502).json({
            error: 'Failed to create customer from request',
            details: customerError?.message ?? 'Unknown error',
          });
        }

        customerId = customerData.id;
      }
    }
"""

if old not in text:
    raise Exception("Bloque esperado no encontrado")

text = text.replace(old, new)
p.write_text(text)

print("OK")
PY

echo ""
echo "Validando..."
pnpm --filter @white-label/api typecheck

echo ""
echo "Build..."
pnpm --filter @white-label/api build

echo ""
echo "OK - Customer Resolver instalado"
