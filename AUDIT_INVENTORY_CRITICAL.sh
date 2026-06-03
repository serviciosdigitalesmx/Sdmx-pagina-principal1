#!/bin/bash

OUT="AUDIT_INVENTORY_CRITICAL.md"
rm -f "$OUT"

echo "# PURCHASE ORDERS" >> "$OUT"
echo "" >> "$OUT"

sed -n '400,560p' apps/api/src/controllers/purchase-orders.ts >> "$OUT"

echo "" >> "$OUT"
echo "==================================================" >> "$OUT"
echo "" >> "$OUT"

echo "# CATALOGS INVENTORY" >> "$OUT"
echo "" >> "$OUT"

sed -n '300,470p' apps/api/src/controllers/catalogs.ts >> "$OUT"

echo "" >> "$OUT"
echo "==================================================" >> "$OUT"
echo "" >> "$OUT"

echo "# PROCUREMENT" >> "$OUT"
echo "" >> "$OUT"

sed -n '1,220p' apps/api/src/controllers/procurement.ts >> "$OUT"

pbcopy < "$OUT"

cat "$OUT"
