import { PublicPortalLookup } from "@/components/public-portal-lookup";

export default function PortalEntryPage() {
  return (
    <PublicPortalLookup
      title="Portal del cliente"
      subtitle="Escribe el tenant del taller y el folio para ver la reparación, los documentos y el timeline."
      showTenantInput
    />
  );
}
