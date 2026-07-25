import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load environment from .env file
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Starting ETL migration for device catalogs...');

  // 1. Get all orders with their tenant and device_info
  const { data: orders, error: ordersError } = await supabase
    .from('service_orders')
    .select('id, tenant_id, device_info');

  if (ordersError) {
    console.error('Failed to fetch orders:', ordersError);
    return;
  }

  console.log(`Found ${orders?.length || 0} orders to process.`);

  const stats = { families: 0, brands: 0, models: 0, linked: 0 };
  const familyCache = new Map<string, string>(); // key: tenantId:familyName, value: id
  const brandCache = new Map<string, string>(); // key: tenantId:familyId:brandName, value: id
  const modelCache = new Map<string, string>(); // key: tenantId:brandId:modelName, value: id

  for (const order of orders || []) {
    const tenantId = order.tenant_id;
    const deviceInfo = order.device_info as any;
    
    if (!deviceInfo) continue;

    const familyName = deviceInfo.type ? String(deviceInfo.type).trim() : 'Desconocido';
    const brandName = deviceInfo.brand ? String(deviceInfo.brand).trim() : 'Desconocida';
    const modelName = deviceInfo.model ? String(deviceInfo.model).trim() : 'Desconocido';

    // Get or Create Family
    const familyKey = `${tenantId}:${familyName.toLowerCase()}`;
    let familyId = familyCache.get(familyKey);
    
    if (!familyId) {
      const { data: existing } = await supabase
        .from('catalog_families')
        .select('id')
        .eq('tenant_id', tenantId)
        .ilike('name', familyName)
        .maybeSingle();

      if (existing) {
        familyId = existing.id;
      } else {
        const { data: created } = await supabase
          .from('catalog_families')
          .insert({ tenant_id: tenantId, name: familyName })
          .select('id')
          .single();
        if (created) {
          familyId = created.id;
          stats.families++;
        }
      }
      if (familyId) familyCache.set(familyKey, familyId);
    }

    if (!familyId) continue;

    // Get or Create Brand
    const brandKey = `${tenantId}:${familyId}:${brandName.toLowerCase()}`;
    let brandId = brandCache.get(brandKey);
    
    if (!brandId) {
      const { data: existing } = await supabase
        .from('catalog_brands')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('family_id', familyId)
        .ilike('name', brandName)
        .maybeSingle();

      if (existing) {
        brandId = existing.id;
      } else {
        const { data: created } = await supabase
          .from('catalog_brands')
          .insert({ tenant_id: tenantId, family_id: familyId, name: brandName })
          .select('id')
          .single();
        if (created) {
          brandId = created.id;
          stats.brands++;
        }
      }
      if (brandId) brandCache.set(brandKey, brandId);
    }

    if (!brandId) continue;

    // Get or Create Model
    const modelKey = `${tenantId}:${brandId}:${modelName.toLowerCase()}`;
    let modelId = modelCache.get(modelKey);
    
    if (!modelId) {
      const { data: existing } = await supabase
        .from('catalog_models')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('brand_id', brandId)
        .ilike('name', modelName)
        .maybeSingle();

      if (existing) {
        modelId = existing.id;
      } else {
        const { data: created } = await supabase
          .from('catalog_models')
          .insert({ tenant_id: tenantId, brand_id: brandId, name: modelName })
          .select('id')
          .single();
        if (created) {
          modelId = created.id;
          stats.models++;
        }
      }
      if (modelId) modelCache.set(modelKey, modelId);
    }

    if (!modelId) continue;

    // Link Model to Order
    const { error: updateError } = await supabase
      .from('service_orders')
      .update({ catalog_model_id: modelId })
      .eq('id', order.id);

    if (!updateError) {
      stats.linked++;
    }
  }

  console.log('Migration finished!');
  console.log(`Families created: ${stats.families}`);
  console.log(`Brands created: ${stats.brands}`);
  console.log(`Models created: ${stats.models}`);
  console.log(`Orders linked: ${stats.linked}`);
}

run().catch(console.error);
