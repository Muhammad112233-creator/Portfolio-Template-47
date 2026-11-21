import type { Metadata } from 'next';

import Awards from '@/components/sections/Awards';
import Clients from '@/components/sections/Clients';
import CtaFooter from '@/components/sections/CtaFooter';
import Disciplines from '@/components/sections/Disciplines';
import Hero from '@/components/sections/Hero';
import Manifesto from '@/components/sections/Manifesto';
import Services from '@/components/sections/Services';
import WhyUs from '@/components/sections/WhyUs';
import Works from '@/components/sections/Works';
import { site } from '@/data/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url }],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Hero />
      <Manifesto />
      <WhyUs />
      <Clients />
      <Works />
      <Disciplines />
      <Awards />
      <Services />
      <CtaFooter />
    </>
  );
}
