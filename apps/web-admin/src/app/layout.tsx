import type { Metadata } from "next";
import "./globals.css";
import { PwaBootstrap } from "@/components/pwa/pwa-bootstrap";
import { ToastProvider } from "@white-label/ui";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_TENANT_META_TITLE ?? "FIXI Admin",
  description: process.env.NEXT_PUBLIC_TENANT_META_DESCRIPTION ?? "Panel operativo de FIXI",
};

export const viewport = {
  themeColor: process.env.NEXT_PUBLIC_THEME_PRIMARY ?? "#334155",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themePrimary = process.env.NEXT_PUBLIC_THEME_PRIMARY ?? "#334155";
  const themeSecondary = process.env.NEXT_PUBLIC_THEME_SECONDARY ?? "#0f172a";
  const themeAccent = process.env.NEXT_PUBLIC_THEME_ACCENT ?? "#38bdf8";

  return (
    <html
      lang="es"
      className="h-full antialiased"
      style={
        {
          '--tenant-primary': themePrimary,
          '--tenant-secondary': themeSecondary,
          '--tenant-accent': themeAccent,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col font-sans">
        <PwaBootstrap />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
