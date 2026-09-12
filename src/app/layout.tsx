import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sri Shakthi Institute of Engineering and Technology | Interactive Campus Map',
  description: 'Interactive Google Maps-style wayfinding, directions, and building guide for Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore.',
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
