import type { Metadata, Viewport } from 'next';
import './globals.css';
import Shell from './_c/Shell';

export const metadata: Metadata = {
  title: { default: 'KJO · Original by nature', template: '%s · KJO' },
  description: 'Photography, film, field notes and the Character clothing line. Direction and distinction.',
  icons: { icon: '/mark/cross-fleur-white.png' },
};
export const viewport: Viewport = { themeColor: '#0a0a0b' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{if(sessionStorage.getItem('kjo-seen'))document.documentElement.classList.add('seen')}catch(e){}" }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
