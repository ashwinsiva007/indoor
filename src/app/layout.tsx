import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Indoor Navigation Platform | Next-Gen Spatial Wayfinding MVP',
  description: 'Web-based Indoor Navigation Platform featuring interactive 2D blueprint mapping, turn-by-turn route calculations, and floor plan editor.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
