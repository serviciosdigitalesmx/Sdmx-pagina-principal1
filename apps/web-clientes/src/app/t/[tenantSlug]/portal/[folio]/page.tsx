import { PortalView } from "@/lib/portal/portal-view";

type PageProps = {
  params: Promise<{ tenantSlug: string; folio: string }>;
};

export default async function PortalFolioPage({ params }: PageProps) {
  const { tenantSlug, folio: initialPublicToken } = await params;
  return <PortalView tenantSlug={tenantSlug} initialFolio={initialPublicToken} initialLookupMode="auto" />;
}
