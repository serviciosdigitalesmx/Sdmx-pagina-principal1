import './globals.css';
import { Providers } from '@/app/providers';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '700']
});

export const metadata: Metadata = {
  title: 'Don Cepillo | Catálogo y pedidos',
  description: 'Catálogo web de productos de limpieza con pedido por WhatsApp'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-background text-textMain font-sans selection:bg-primary/30">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
