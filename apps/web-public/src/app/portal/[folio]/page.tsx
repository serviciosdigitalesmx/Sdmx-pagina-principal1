import { PublicPortalLookup } from "@/components/public-portal-lookup";

export default async function PortalFolioPage({ params, searchParams }: { params: Promise<{ folio: string }>; searchParams: Promise<{ tenant?: string }> }) {
  const [{ folio }, { tenant }] = await Promise.all([params, searchParams]);

  return (
    <PublicPortalLookup
      initialFolio={folio}
      initialTenantSlug={tenant ?? ""}
      title="Seguimiento público"
      subtitle="Consulta por folio los documentos, timeline y estado de tu servicio."
      showTenantInput
    />
  );
}
