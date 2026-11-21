import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import CtaFooter from '@/components/sections/CtaFooter';
import { BackLink } from '@/components/ui/PageHeader';
import { projects, site } from '@/data/site';
import { withBase } from '@/lib/paths';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Project not found' };

  return {
    title: project.title,
    description: project.excerpt,
    alternates: { canonical: `/works/${project.slug}` },
    openGraph: {
      title: `${project.title} — Halden Studio`,
      description: project.excerpt,
      images: [{ url: project.cover }],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.excerpt,
    image: `${site.url}${project.cover}`,
    dateCreated: project.year,
    creator: { '@type': 'Organization', name: site.legalName },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-paper">
        <div className="px-[clamp(20px,9.27vw,9.27%)] pb-[clamp(26px,3vw,50px)] pt-[clamp(110px,14vw,200px)]">
          <BackLink href="/works" label="All work" />
        </div>

        <header className="px-[clamp(20px,9.27vw,9.27%)]">
          <h1
            className="text-ink"
            style={{
              fontSize: 'clamp(38px, 7.4vw, 132px)',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              lineHeight: 0.94,
            }}
          >
            {project.title}
          </h1>
          <p className="mt-[clamp(20px,2.4vw,40px)] max-w-[720px] text-[clamp(16px,1.4vw,22px)] leading-[1.55] text-body/85">
            {project.excerpt}
          </p>

          <dl className="mt-[clamp(34px,4vw,70px)] grid grid-cols-2 gap-x-8 gap-y-[clamp(18px,2vw,32px)] border-t border-ink/10 pt-[clamp(24px,2.4vw,40px)] md:grid-cols-4">
            <div>
              <dt className="mono-label text-ink/40">Client</dt>
              <dd className="mt-2 text-[15px] text-ink">{project.client}</dd>
            </div>
            <div>
              <dt className="mono-label text-ink/40">Year</dt>
              <dd className="mt-2 text-[15px] text-ink">{project.year}</dd>
            </div>
            <div>
              <dt className="mono-label text-ink/40">Services</dt>
              <dd className="mt-2 text-[15px] text-ink">{project.services.join(', ')}</dd>
            </div>
            <div>
              <dt className="mono-label text-ink/40">Recognition</dt>
              <dd className="mt-2 text-[15px] text-ink">{project.award ?? '—'}</dd>
            </div>
          </dl>
        </header>

        <div className="mt-[clamp(30px,4vw,70px)] px-[clamp(20px,4vw,72px)]">
          <div
            className="relative w-full overflow-hidden bg-mist"
            style={{ aspectRatio: '16 / 9' }}
          >
            <Image
              src={withBase(project.cover)}
              alt={project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto max-w-[720px] px-[clamp(20px,4vw,72px)] py-[clamp(50px,7vw,120px)]">
          {project.body.map((paragraph, i) => (
            <p
              key={i}
              className="text-[clamp(16px,1.35vw,20px)] leading-[1.75] text-body/90 first:text-ink"
              style={{ marginTop: i === 0 ? 0 : '1.5em' }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="border-t border-ink/10 px-[clamp(20px,9.27vw,9.27%)] py-[clamp(30px,4vw,60px)]">
          <Link href={`/works/${next.slug}`} className="group block">
            <span className="mono-label text-ink/40">Next project</span>
            <div className="mt-3 flex items-center justify-between gap-6">
              <span
                className="text-ink transition-transform duration-500 group-hover:-translate-x-2"
                style={{ fontSize: 'clamp(24px,3.2vw,56px)', fontWeight: 700, letterSpacing: '-0.04em' }}
              >
                {next.title}
              </span>
              <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-ink" fill="none" aria-hidden>
                <path
                  d="M5 12h14m0 0-6-6m6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>
        </div>
      </article>

      <CtaFooter />
    </>
  );
}
