import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DataLayer Creator — GA4 & GTM Spec Generator',
  description:
    'Automatically generate dataLayer.push() code, GTM container JSON, and QA checklists for GA4 events.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
