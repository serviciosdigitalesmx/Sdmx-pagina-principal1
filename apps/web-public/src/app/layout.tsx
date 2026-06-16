import type { Metadata } from "next";
import "./globals.css";
import { optionalEnv } from "@white-label/config";

export const metadata: Metadata = {
  title: optionalEnv("NEXT_PUBLIC_SAAS_BRAND_NAME") ?? "FIXI",
  description:
    optionalEnv("NEXT_PUBLIC_SAAS_META_DESCRIPTION") ??
    "FIXI: SaaS multi-tenant para talleres.",
};

export const viewport = {
  themeColor: optionalEnv("NEXT_PUBLIC_SAAS_THEME_COLOR") ?? "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),_transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(34,211,238,0.08),_transparent_24%),linear-gradient(180deg,#050608_0%,#09090b_46%,#0f1117_100%)] text-slate-100">{children}</body>
    </html>
  );
}
