import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

function toQueryString(searchParams: SearchParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string" && value.trim().length > 0) {
      query.set(key, value);
    }
  }
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export default async function AuthCallbackPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  redirect(`/onboarding/google/callback${toQueryString(resolvedSearchParams)}`);
}
