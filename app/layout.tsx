import type { Metadata, Viewport } from 'next';
import { Inter, Spectral, Schibsted_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const serif = Spectral({ subsets: ['latin'], weight: ['300', '400'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const grotesk = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-grotesk', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Kene OS',
  description: 'Private life and business operating system.',
  robots: { index: false, follow: false },
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = { themeColor: '#0a0a0b', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${grotesk.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
