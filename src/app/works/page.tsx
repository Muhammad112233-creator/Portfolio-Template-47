import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import CtaFooter from '@/components/sections/CtaFooter';
import PageHeader from '@/components/ui/PageHeader';
import { projects, site } from '@/data/site';
import { withBase } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Works',
  description:
    'Selected work from Halden — websites, brand identities, e-commerce and product design for companies that have outgrown their current presence.',
  alternates: { canonical: '/works' },
};

export default function WorksPage() {
  const categories = Array.from(new Set(projects.flatMap((p) => p.categories)));

  return (
    <>
      <PageHeader
        kicker="Selected work"
        title="Things we made, and why."
        intro="Ten projects from the last four years. Different sizes, different sectors, the same question: what should happen in the thirty seconds after someone lands here?"
      >
        <div className="flex flex-wrap gap-[8px] pt-[10px]">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-ink/12 px-[14px] py-[7px] text-[13px] text-ink/65"
            >
              {c}
            </span>
          ))}
        </div>
      </PageHeader>

      <section className="bg-paper px-[clamp(20px,4vw,72px)] pb-[clamp(60px,9vw,150px)]">
        <ul className="grid grid-cols-1 gap-x-[clamp(16px,2.2vw,34px)] gap-y-[clamp(40px,6vw,110px)] md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link href={`/works/${project.slug}`} className="group block">
                <div
                  className="relative w-full overflow-hidden bg-mist"
                  style={{ aspectRatio: '4 / 3' }}
                >
                  <Image
                    src={withBase(project.cover)}
                    alt={`${project.title} — ${project.categories.join(', ')}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.05]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                  <span className="pointer-events-none absolute left-4 top-4 text-[13px] font-medium text-white/95">
                    Selected {project.index}
                  </span>
                  {project.award && (
                    <span className="pointer-events-none absolute bottom-4 left-4 text-[13px] leading-[1.45] text-white/90">
                      (Award)
                      <br />
                      {project.award}
                    </span>
                  )}
                </div>
                <div className="mt-[clamp(12px,1.2vw,18px)] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="text-ink" style={{ fontSize: 'clamp(17px,1.5vw,24px)', fontWeight: 700 }}>
                    {project.title}
                  </h2>
                  <span className="font-mono text-[12px] tracking-[0.02em] text-ink/55">
                    {project.year} · {project.categories.join(' · ')}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Selected work — Halden Studio',
            itemListElement: projects.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.title,
              url: `${site.url}/works/${p.slug}`,
            })),
          }),
        }}
      />
    </>
  );
}
