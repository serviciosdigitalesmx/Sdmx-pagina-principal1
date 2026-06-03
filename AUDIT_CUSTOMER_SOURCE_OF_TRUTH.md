# CUSTOMER SOURCE OF TRUTH

## customer_id
apps/api/src/controllers/requests.ts:183:          customer_id: customerId,
apps/api/src/controllers/requests.ts:228:        customer_id: customerId,
apps/api/src/controllers/requests.ts.bak.20260603_101809:148:          customer_id: customerId,
apps/api/src/controllers/requests.ts.bak.20260603_101809:193:        customer_id: customerId,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:34:  customer_id uuid references public.customers(id) on delete set null,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:161:          customer_id,
supabase/migrations/20260530193000_audit_hardening_multitenant.sql:176:          new.customer_id,
supabase/migrations/20260514133525_remote_schema.sql:426:alter table "public"."customer_payments" drop constraint "customer_payments_customer_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:488:alter table "public"."service_orders" drop constraint "service_orders_customer_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:655:alter table "public"."service_orders" add constraint "service_orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customers(id) not valid;
supabase/migrations/20260514133525_remote_schema.sql:656:alter table "public"."service_orders" validate constraint "service_orders_customer_id_fkey";
supabase/migrations/20260514133525_remote_schema.sql:669:     LEFT JOIN public.customers c ON ((so.customer_id = c.id)));
supabase/migrations/20260424_baseline_schema.sql:99:  customer_id uuid references public.customers(id) on delete set null,
supabase/migrations/20260424_baseline_schema.sql:329:  customer_id uuid references public.customers(id) on delete set null,

## customer_name
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:407:  doc.text(`Cliente: ${String((options.order.device_info as { customer_name?: string } | undefined)?.customer_name ?? '')}`);
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:524:            customer_name: validatedData.clientName,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1340:      customer_name: body.clientName ?? String(currentDeviceInfo.customer_name ?? ''),
apps/api/src/controllers/requests.ts:154:              name: requestRow.customer_name,
apps/api/src/controllers/requests.ts:187:            customer_name: requestRow.customer_name,
apps/api/src/controllers/orders.ts:407:  doc.text(`Cliente: ${String((options.order.device_info as { customer_name?: string } | undefined)?.customer_name ?? '')}`);
apps/api/src/controllers/orders.ts:524:            customer_name: validatedData.clientName,
apps/api/src/controllers/orders.ts:1340:      customer_name: body.clientName ?? String(currentDeviceInfo.customer_name ?? ''),
apps/api/src/controllers/requests.ts.bak.20260603_101809:123:            name: requestRow.customer_name,
apps/api/src/controllers/requests.ts.bak.20260603_101809:152:            customer_name: requestRow.customer_name,
apps/api/src/controllers/orders.ts.bak.20260603_102231:407:  doc.text(`Cliente: ${String((options.order.device_info as { customer_name?: string } | undefined)?.customer_name ?? '')}`);
apps/api/src/controllers/orders.ts.bak.20260603_102231:524:            customer_name: validatedData.clientName,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1340:      customer_name: body.clientName ?? String(currentDeviceInfo.customer_name ?? ''),
apps/api/src/controllers/public.ts:248:          customer_name: fullName,
apps/api/src/services/operational-risk.ts:210:    customer_name: String((order.metadata?.customer_name ?? order.metadata?.customerName) ?? ''),
apps/api/src/services/operational-risk.ts:218:    customer_name: String((order.metadata?.customer_name ?? order.metadata?.customerName) ?? ''),
apps/api/src/services/tenant-config.ts:189:        template: 'Hola {{customer_name}}, recibimos tu solicitud {{order_folio}} en {{business_name}}. Puedes consultar el estado en {{portal_url}}.',
apps/api/src/services/tenant-config.ts:191:        variables: ['customer_name', 'business_name', 'order_folio', 'order_status', 'portal_url'],
apps/api/src/services/tenant-config.ts:192:        fallback_template: 'Hola {{customer_name}}, recibimos tu solicitud {{order_folio}}. Puedes consultar el estado en {{portal_url}}.',
apps/api/src/services/tenant-config.ts:322:        template: 'Hola {{customer_name}}, recibimos tu solicitud {{order_folio}} para {{business_name}}. Puedes ver el avance en {{portal_url}}.',
apps/api/src/services/tenant-config.ts:324:        variables: ['customer_name', 'business_name', 'order_folio', 'order_status', 'portal_url'],
apps/api/src/services/tenant-config.ts:325:        fallback_template: 'Hola {{customer_name}}, recibimos tu solicitud {{order_folio}}. Consulta el avance en {{portal_url}}.',
apps/api/src/services/tenant-config.ts:330:        template: 'Hola {{customer_name}}, tu visita fue programada para {{estimated_date}}. Folio {{order_folio}}. Detalles en {{portal_url}}.',
apps/api/src/services/tenant-config.ts:332:        variables: ['customer_name', 'order_folio', 'order_status', 'estimated_date', 'portal_url'],
apps/api/src/services/tenant-config.ts:333:        fallback_template: 'Hola {{customer_name}}, tu visita fue programada. Consulta tu folio {{order_folio}} en {{portal_url}}.',
apps/api/src/services/tenant-config.ts:338:        template: 'Hola {{customer_name}}, tu cotización de {{business_name}} ya está lista para el folio {{order_folio}}. Revisa {{portal_url}}.',
apps/api/src/services/tenant-config.ts:340:        variables: ['customer_name', 'business_name', 'order_folio', 'amount_due', 'portal_url'],
apps/api/src/services/tenant-config.ts:341:        fallback_template: 'Hola {{customer_name}}, tu cotización está lista. Consulta {{portal_url}}.',
apps/api/src/services/tenant-config.ts:346:        template: 'Hola {{customer_name}}, el servicio {{order_folio}} fue realizado. Consulta el detalle y garantía en {{portal_url}}.',
apps/api/src/services/tenant-config.ts:348:        variables: ['customer_name', 'order_folio', 'portal_url', 'order_status'],
apps/api/src/services/tenant-config.ts:349:        fallback_template: 'Hola {{customer_name}}, el servicio {{order_folio}} fue realizado. Consulta {{portal_url}}.',
apps/api/src/services/tenant-config.ts:354:        template: 'Hola {{customer_name}}, tu servicio {{order_folio}} ahora cuenta con garantía activa. Consulta detalles en {{portal_url}}.',
apps/api/src/services/tenant-config.ts:356:        variables: ['customer_name', 'order_folio', 'portal_url', 'order_status'],
apps/api/src/services/tenant-config.ts:357:        fallback_template: 'Hola {{customer_name}}, tu servicio {{order_folio}} cuenta con garantía activa.',
supabase/migrations/20260514133525_remote_schema.sql:665:    c.name AS customer_name,
supabase/migrations/20260424_baseline_schema.sql:78:  customer_name text not null,

## customer_phone
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:408:  doc.text(`Teléfono: ${String((options.order.device_info as { customer_phone?: string } | undefined)?.customer_phone ?? '')}`);
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:525:            customer_phone: validatedData.clientPhone,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1341:      customer_phone: body.clientPhone ?? String(currentDeviceInfo.customer_phone ?? ''),
apps/api/src/controllers/requests.ts:119:      const phone = String(requestRow.customer_phone ?? '').trim();
apps/api/src/controllers/requests.ts:188:            customer_phone: requestRow.customer_phone,
apps/api/src/controllers/orders.ts:408:  doc.text(`Teléfono: ${String((options.order.device_info as { customer_phone?: string } | undefined)?.customer_phone ?? '')}`);
apps/api/src/controllers/orders.ts:525:            customer_phone: validatedData.clientPhone,
apps/api/src/controllers/orders.ts:1341:      customer_phone: body.clientPhone ?? String(currentDeviceInfo.customer_phone ?? ''),
apps/api/src/controllers/requests.ts.bak.20260603_101809:124:            phone: requestRow.customer_phone,
apps/api/src/controllers/requests.ts.bak.20260603_101809:153:            customer_phone: requestRow.customer_phone,
apps/api/src/controllers/orders.ts.bak.20260603_102231:408:  doc.text(`Teléfono: ${String((options.order.device_info as { customer_phone?: string } | undefined)?.customer_phone ?? '')}`);
apps/api/src/controllers/orders.ts.bak.20260603_102231:525:            customer_phone: validatedData.clientPhone,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1341:      customer_phone: body.clientPhone ?? String(currentDeviceInfo.customer_phone ?? ''),
apps/api/src/controllers/public.ts:249:          customer_phone: phone,
supabase/migrations/20260514133525_remote_schema.sql:666:    c.phone AS customer_phone,
supabase/migrations/20260424_baseline_schema.sql:79:  customer_phone text,

## customer_email
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:409:  doc.text(`Correo: ${String((options.order.device_info as { customer_email?: string } | undefined)?.customer_email ?? '')}`);
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:526:            customer_email: validatedData.clientEmail || null,
apps/api/src/controllers/orders.ts.pre_evidence_cleanup:1342:      customer_email: body.clientEmail === undefined ? currentDeviceInfo.customer_email ?? null : body.clientEmail || null,
apps/api/src/controllers/requests.ts:120:      const email = String(requestRow.customer_email ?? '').trim();
apps/api/src/controllers/requests.ts:189:            customer_email: requestRow.customer_email,
apps/api/src/controllers/orders.ts:409:  doc.text(`Correo: ${String((options.order.device_info as { customer_email?: string } | undefined)?.customer_email ?? '')}`);
apps/api/src/controllers/orders.ts:526:            customer_email: validatedData.clientEmail || null,
apps/api/src/controllers/orders.ts:1342:      customer_email: body.clientEmail === undefined ? currentDeviceInfo.customer_email ?? null : body.clientEmail || null,
apps/api/src/controllers/requests.ts.bak.20260603_101809:125:            email: requestRow.customer_email || null,
apps/api/src/controllers/requests.ts.bak.20260603_101809:154:            customer_email: requestRow.customer_email,
apps/api/src/controllers/orders.ts.bak.20260603_102231:409:  doc.text(`Correo: ${String((options.order.device_info as { customer_email?: string } | undefined)?.customer_email ?? '')}`);
apps/api/src/controllers/orders.ts.bak.20260603_102231:526:            customer_email: validatedData.clientEmail || null,
apps/api/src/controllers/orders.ts.bak.20260603_102231:1342:      customer_email: body.clientEmail === undefined ? currentDeviceInfo.customer_email ?? null : body.clientEmail || null,
apps/api/src/controllers/public.ts:250:          customer_email: email || null,
apps/api/src/controllers/public.ts:310:    if (email && data.device_info?.customer_email && data.device_info.customer_email !== email) {
supabase/migrations/20260424_baseline_schema.sql:80:  customer_email text,

## from('customers')
apps/api/src/controllers/requests.ts:126:          .from('customers')
apps/api/src/controllers/requests.ts:137:          .from('customers')
apps/api/src/controllers/requests.ts:150:          .from('customers')
apps/api/src/controllers/reports.ts:18:    let customersQuery = supabase.from('customers').select('id').eq('tenant_id', tenantId).limit(500);
apps/api/src/controllers/requests.ts.bak.20260603_101809:119:        .from('customers')
apps/api/src/controllers/catalogs.ts:163:      .from('customers')
apps/api/src/controllers/catalogs.ts:190:    const { data, error } = await supabase.from('customers').insert([{
