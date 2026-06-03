#!/bin/bash

OUT="AUDIT_CUSTOMER_SOURCE_OF_TRUTH.md"
rm -f "$OUT"

echo "# CUSTOMER SOURCE OF TRUTH" >> "$OUT"
echo "" >> "$OUT"

echo "## customer_id" >> "$OUT"
grep -Rni "customer_id" apps/api/src supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## customer_name" >> "$OUT"
grep -Rni "customer_name" apps/api/src supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## customer_phone" >> "$OUT"
grep -Rni "customer_phone" apps/api/src supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## customer_email" >> "$OUT"
grep -Rni "customer_email" apps/api/src supabase/migrations >> "$OUT" || true

echo "" >> "$OUT"
echo "## from('customers')" >> "$OUT"
grep -Rni "from('customers')" apps/api/src >> "$OUT" || true

pbcopy < "$OUT"

echo "LISTO"
