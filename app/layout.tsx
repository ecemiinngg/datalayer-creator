import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'sGTM Setup Checklist — Server-Side Tracking Kurulum Rehberi',
  description: 'GA4, Meta CAPI ve TikTok Events API entegrasyonlarını içeren adım adım sGTM kurulum rehberi.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
