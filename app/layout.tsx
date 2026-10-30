import type { Metadata, Viewport } from 'next';
import './globals.css';
import Shell from './_c/Shell';

export const metadata: Metadata = {
  title: { default: 'Kene Okonjo', template: '%s · Kene Okonjo' },
  description: 'Kene Okonjo. Photography, film, field notes and the Character clothing line.',
  applicationName: 'Kene Okonjo',
  openGraph: { title: 'Kene Okonjo', siteName: 'Kene Okonjo', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Kene Okonjo' },
};
export const viewport: Viewport = { themeColor: '#0a0a0b' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{if(sessionStorage.getItem('kjo-seen'))document.documentElement.classList.add('seen','ready')}catch(e){}" }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
