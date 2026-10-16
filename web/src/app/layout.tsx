import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#11110F',
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nadaverse.abarjun.online';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'NadaVerse — Carnatic Music Discovery, Knowledge & Practice Platform',
  description:
    'Discover Carnatic music, understand its language, and practise with purpose. A completely free, peer-reviewed digital sanctuary with Web Audio Tanpura, Tala metronome, verified ragas, and grounded AI tutoring.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'NadaVerse — Carnatic Music For Everyone',
    description:
      'The Sovereign Digital Sanctuary of Carnatic Music. Completely free reference library and Web Audio practice studio.',
    url: siteUrl,
    siteName: 'NadaVerse',
    images: [{ url: '/logo.png', width: 1200, height: 800, alt: 'NadaVerse Logo Emblem' }],
  },
  keywords: [
    'Carnatic music',
    'Ragas',
    'Mayamalavagowla',
    'Tala metronome',
    'Adi tala',
    'Shruti box',
    'Tanpura drone',
    'Saraswati Veena',
    'Mridangam',
    'Carnatic learning',
  ],
  authors: [{ name: 'NadaVerse Musicology Board' }],
};

import { LanguageProvider } from '../context/LanguageContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#11110F] text-[#F4EBDD] min-h-full flex flex-col antialiased`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
