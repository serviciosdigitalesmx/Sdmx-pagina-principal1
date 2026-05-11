import TenantLandingClient from "./tenant-landing-client";

interface PageProps {
  params: { slug: string };
}

export default function Page({ params }: PageProps) {
  const { slug } = params;

  return <TenantLandingClient slug={slug} />;
}
