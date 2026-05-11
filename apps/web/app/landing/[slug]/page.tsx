import TenantLandingClient from "./tenant-landing-client";

interface PageProps {
  params: Promise<{ slug?: string; folio?: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug, folio } = await params;
  return <TenantLandingClient slug={slug} />;
}

