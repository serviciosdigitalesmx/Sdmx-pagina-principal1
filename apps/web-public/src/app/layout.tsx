import type { Metadata } from "next";
import "./globals.css";
import { optionalEnv } from "@white-label/config";

export const metadata: Metadata = {
  title: optionalEnv("NEXT_PUBLIC_SAAS_BRAND_NAME") ?? "FIXI",
  description: optionalEnv("NEXT_PUBLIC_SAAS_META_DESCRIPTION") ?? "FIXI: SaaS multi-tenant para talleres.",
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
      <body className="min-h-full flex flex-col bg-[radial-gradient(circle_at_top,_rgba(180,83,9,0.14),_transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(251,191,36,0.08),_transparent_24%),linear-gradient(180deg,#050505_0%,#0f0f10_46%,#141210_100%)] text-zinc-100">{children}</body>
    </html>
  );
}
