import { redirect } from "next/navigation";
import { optionalEnv, resolveApiBaseUrl } from "@white-label/config";

export default function AuthGooglePage() {
  const apiUrl = resolveApiBaseUrl();
  const publicUrl = optionalEnv("NEXT_PUBLIC_WEB_PUBLIC_URL") ?? "https://serviciosdigitalesmx.online";

  if (!apiUrl) {
    redirect("/onboarding");
  }

  const url = new URL(`${apiUrl}/api/auth/google`);
  url.searchParams.set("origin", publicUrl);

  redirect(url.toString());
}
