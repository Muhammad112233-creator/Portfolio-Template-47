import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import SiteChrome from '@/components/chrome/SiteChrome';
import SmoothScroll from '@/components/chrome/SmoothScroll';
import PageTransition from '@/components/chrome/PageTransition';
import { site } from '@/data/site';
import { basePath, withBase } from '@/lib/paths';

import './globals.css';

const satoshi = localFont({
  src: [
    { path: '../../public/fonts/Satoshi-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Satoshi-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Satoshi-700.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/Satoshi-900.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
});

const dmMono = localFont({
  src: [
    { path: '../../public/fonts/DMMono-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/DMMono-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-dm-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'Menlo', 'monospace'],
});

export const metadata: Metadata = {
  metadataBase: new URL(withBase(site.url)),
  title: {
    default: 'Halden — Independent Creative & Digital Studio, Lahore',
    template: '%s — Halden Studio',
  },
  description: site.description,
  keywords: [
    'creative studio Lahore',
    'web design agency Pakistan',
    'brand identity',
    'e-commerce design',
    'Next.js development agency',
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  openGraph: {
    type: 'website',
    locale: 'en',
    url: site.url,
    siteName: site.legalName,
    title: 'Halden — Independent Creative & Digital Studio, Lahore',
    description: site.description,
    images: [{ url: withBase('/assets/img/og-image.jpg'), width: 1200, height: 630, alt: 'Halden Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Halden — Independent Creative & Digital Studio, Lahore',
    description: site.description,
    images: [withBase('/assets/img/og-image.jpg')],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: withBase('/favicon.svg'), type: 'image/svg+xml' }],
    apple: [{ url: withBase('/apple-touch-icon.png') }],
  },
  manifest: withBase('/site.webmanifest'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f7c02f',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.legalName,
      url: site.url,
      logo: { '@type': 'ImageObject', url: `${site.url}/assets/img/logo-mark.svg` },
      email: site.email,
      telephone: site.phone,
      foundingDate: site.founded,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressCountry: site.address.country,
        postalCode: site.address.postalCode,
      },
      sameAs: site.socials.map((s) => s.href),
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.legalName,
      description: site.description,
      publisher: { '@id': `${site.url}/#organization` },
      inLanguage: 'en',
    },
    {
      '@type': 'Service',
      name: 'Brand Identity, Web Design and Digital Experiences',
      serviceType: ['Brand Identity', 'Web Design', 'Digital Experiences'],
      provider: { '@id': `${site.url}/#organization` },
      areaServed: 'Worldwide',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${satoshi.variable} ${dmMono.variable}`}>
      {/* NOTE: no `overflow-x-hidden` here — it makes <body> a scroll
          container, which silently breaks every `position: sticky` section.
          Horizontal overflow is clipped on <html> in globals.css instead. */}
      <body className="min-h-full bg-paper text-body antialiased">
        {/* The custom cursor lives in a CSS custom property so it can carry
            the deployment base path — CSS url() cannot read an env var. */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--cursor-yellow:url('${withBase('/assets/img/cursor-yellow.svg')}')}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <PageTransition />
          <SiteChrome />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
