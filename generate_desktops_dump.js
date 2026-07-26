const fs = require('fs');
const path = require('path');

const backendFiles = [
  'supabase/migrations/20260724000000_phase1_catalogs.sql',
  'supabase/migrations/20260724000001_phase3_pos_cash.sql',
  'supabase/migrations/20260724000002_phase2_hyperspeed_procurement.sql',
  'supabase/migrations/20260724000003_phase4_automation_customer_portal.sql',
  'supabase/migrations/20260724000004_phase3_atomic_rpc.sql',
  'apps/api/scripts/migrate-catalogs.ts',
  'apps/api/src/controllers/device-catalogs.ts',
  'apps/api/src/controllers/search.ts',
  'apps/api/src/controllers/cash.ts',
  'apps/api/src/controllers/procurement.ts',
  'apps/api/src/controllers/automation.ts',
  'apps/api/src/controllers/public-portal.ts',
  'apps/api/src/controllers/orders.ts',
  'apps/api/src/routes/device-catalogs.ts',
  'apps/api/src/routes/search.ts',
  'apps/api/src/routes/cash.ts',
  'apps/api/src/routes/procurement.ts',
  'apps/api/src/routes/automation.ts',
  'apps/api/src/routes/public-portal.ts',
  'apps/api/src/index.ts'
];

const frontendFiles = [
  'apps/web-admin/src/services/apiGateway.ts',
  'apps/web-admin/src/types.ts',
  'apps/web-admin/src/app/layout.tsx',
  'apps/web-admin/src/providers/QueryProvider.tsx',
  'apps/web-admin/src/hooks/useSupabaseRealtime.ts',
  'apps/web-admin/src/components/dashboard/sidebar.tsx',
  'apps/web-admin/src/components/ordenes/omni-search.tsx',
  'apps/web-admin/src/components/ordenes/quick-receive-modal.tsx',
  'apps/web-admin/src/components/ordenes/signature-pad.tsx',
  'apps/web-admin/src/lib/image-utils.ts',
  'apps/web-admin/src/components/catalogos/catalog-manager.tsx',
  'apps/web-admin/src/components/onboarding/setup-wizard-modal.tsx',
  'apps/web-admin/src/app/dashboard/catalogos/page.tsx',
  'apps/web-admin/src/app/dashboard/operativo/page.tsx',
  'apps/web-admin/src/app/dashboard/pos/page.tsx',
  'apps/web-admin/src/app/dashboard/stock/page.tsx',
  'apps/web-admin/src/app/dashboard/automation/page.tsx',
  'apps/web-admin/src/app/dashboard/ordenes/page.tsx',
  'apps/web-admin/src/app/public/order/[token]/page.tsx'
];

const desktopDir = '/Users/usuario/Desktop';

function buildMarkdown(files, title) {
  let md = `# ${title}\n\n`;
  for (const f of files) {
    if (!fs.existsSync(f)) {
      md += `## File Not Found: ${f}\n\n`;
      continue;
    }
    const ext = path.extname(f).slice(1);
    let lang = 'typescript';
    if (ext === 'sql') lang = 'sql';
    if (ext === 'tsx') lang = 'tsx';
    if (ext === 'css') lang = 'css';

    md += `## ${f}\n\n`;
    const content = fs.readFileSync(f, 'utf8');
    md += '```' + lang + '\n' + content + '\n```\n\n';
  }
  return md;
}

const backendMd = buildMarkdown(backendFiles, 'Código de Backend e Infraestructura (Fases 1-4)');
const frontendMd = buildMarkdown(frontendFiles, 'Código de Frontend y Componentes (Fases 1-4)');

fs.writeFileSync(path.join(desktopDir, 'backend_completo.md'), backendMd);
fs.writeFileSync(path.join(desktopDir, 'frontend_completo.md'), frontendMd);

console.log('Backend and Frontend MD files successfully generated on Desktop.');
