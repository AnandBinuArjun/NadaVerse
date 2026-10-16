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

export const metadata: Metadata = {
  title: 'NadaVerse — Carnatic Music Discovery, Knowledge & Practice Platform',
  description:
    'Discover Carnatic music, understand its language, and practise with purpose. A completely free, peer-reviewed digital sanctuary with Web Audio Tanpura, Tala metronome, verified ragas, and grounded AI tutoring.',
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
        {children}
      </body>
    </html>
  );
}
