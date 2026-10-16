import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { PWARegistration } from '../components/PWARegistration';

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
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
    type: 'website',
    locale: 'en_US',
    title: 'NadaVerse — Carnatic Music For Everyone',
    description:
      'The Sovereign Digital Sanctuary of Carnatic Music. Completely free reference library, 72 Melakarta scale explorer, and Web Audio practice studio.',
    url: siteUrl,
    siteName: 'NadaVerse',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'NadaVerse Carnatic Music — 72 Melakarta & Pure Just Intonation Practice Suite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NadaVerse — Sovereign Digital Sanctuary of Carnatic Music',
    description:
      'Hands-free Tala metronome, Web Audio Tanpura, 72 Melakarta raga reference, and grounded musicology AI tutor.',
    images: ['/api/og'],
  },
  keywords: [
    'Carnatic music',
    'Ragas',
    '72 Melakarta',
    'Mayamalavagowla arohanam avarohanam',
    'Adi tala kriyas',
    'Tala metronome',
    'Shruti box',
    'Tanpura drone',
    'Saraswati Veena',
    'Mridangam',
    'Carnatic learning',
    'Subbarama Dikshitar',
    'Chaturdandi Prakasika',
  ],
  authors: [{ name: 'NadaVerse Musicology Board' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data
  const jsonLdWebapp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NadaVerse Practice Studio',
    applicationCategory: 'MusicApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires Web Audio API support',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Web Audio synthesis suite for Carnatic musicians featuring Jivari overtone Tanpura, drift-free Tala metronome with haptic pulse, and real-time acoustic pitch tuner.',
    featureList: [
      'Acoustic modeled 4-string Tambura drone',
      'Carnatic Tala metronome with Anga & Kriya visualizer',
      'Microphone autocorrelation pitch tuner',
      'Offline PWA support',
    ],
  };

  const jsonLdMayamalavagowla = {
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: 'Mayamalavagowla Raga',
    composer: {
      '@type': 'Person',
      name: 'Purandara Dasa',
    },
    description:
      '15th Melakarta parent scale in Carnatic music. Foundational scale for beginner exercises due to symmetrical Purvanga and Uttaranga intervals. Arohanam: S R1 G3 M1 P D1 N3 S. Avarohanam: S N3 D1 P M1 G3 R1 S.',
    musicalKey: 'C (1 Kattai)',
    genre: 'Carnatic Classical Music',
  };

  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NadaVerse Classical Foundation',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: ['https://github.com/AnandBinuArjun/NadaVerse'],
  };

  return (
    <html lang="en" className="dark h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebapp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMayamalavagowla) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#11110F] text-[#F4EBDD] min-h-full flex flex-col antialiased`}
      >
        <LanguageProvider>
          {children}
          <PWARegistration />
        </LanguageProvider>
      </body>
    </html>
  );
}
