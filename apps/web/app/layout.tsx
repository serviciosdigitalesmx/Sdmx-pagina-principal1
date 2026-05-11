import './globals.css';
import { Providers } from '@/app/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sr. Fix | Gestión de Talleres",
  description: 'Plataforma profesional para la gestión de talleres y servicios técnicos'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-background text-textMain font-sans selection:bg-primary/30">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
