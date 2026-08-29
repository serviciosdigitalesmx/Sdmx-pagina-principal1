import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/design.css';
import QueryProvider from '@/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'FIXI - Panel de Administración',
  description: 'Plataforma de gestión para talleres de reparación',
};

export const viewport = {
  themeColor: '#1F7EDC',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const buildId = process.env.VERCEL_GIT_COMMIT_SHA?.trim() || process.env.VERCEL_DEPLOYMENT_ID?.trim() || "dev";

  return (
    <html lang="es">
      <body data-build-id={buildId}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
