import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import CtaFooter from '@/components/sections/CtaFooter';
import PageHeader from '@/components/ui/PageHeader';
import { posts } from '@/data/site';
import { withBase } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes from the studio on design, motion, code and running a small creative practice.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHeader
        kicker="Journal"
        title="Notes from the studio."
        intro="Occasional writing about design, motion and the business of making things. No newsletter, no funnel — just the posts."
      />

      <section className="bg-paper px-[clamp(20px,9.27vw,9.27%)] pb-[clamp(60px,9vw,140px)]">
        {lead && (
          <Link href={`/blog/${lead.slug}`} className="group block">
            <div className="grid gap-[clamp(20px,3vw,50px)] md:grid-cols-[1.25fr_1fr] md:items-center">
              <div
                className="relative w-full overflow-hidden bg-mist"
                style={{ aspectRatio: '16 / 10' }}
              >
                <Image
                  src={withBase(lead.cover)}
                  alt={lead.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
                />
              </div>
              <div>
                <div className="flex items-center gap-[14px]">
                  <span className="mono-label text-ink/45">{lead.tag}</span>
                  <span className="mono-label text-ink/30">{lead.date}</span>
                  <span className="mono-label text-ink/30">{lead.readingTime}</span>
                </div>
                <h2
                  className="mt-4 text-ink transition-transform duration-500 group-hover:-translate-y-1"
                  style={{ fontSize: 'clamp(26px,3.4vw,56px)', fontWeight: 700, letterSpacing: '-0.045em' }}
                >
                  {lead.title}
                </h2>
                <p className="mt-4 max-w-[520px] text-[clamp(15px,1.25vw,18px)] leading-[1.65] text-body/80">
                  {lead.excerpt}
                </p>
                <span className="ghost-cta mt-6 text-ink">
                  Read
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                    <path
                      d="M5 12h14m0 0-6-6m6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        )}

        <ul className="mt-[clamp(50px,7vw,120px)] grid gap-px border-t border-ink/10">
          {rest.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-4 border-b border-ink/10 py-[clamp(22px,2.6vw,38px)] md:grid-cols-[160px_1fr_120px] md:items-baseline md:gap-10"
              >
                <div className="flex gap-[12px] md:flex-col">
                  <span className="mono-label text-ink/40">{post.tag}</span>
                  <span className="mono-label text-ink/30">{post.date}</span>
                </div>
                <div>
                  <h2
                    className="text-ink transition-transform duration-500 group-hover:translate-x-2"
                    style={{ fontSize: 'clamp(19px,2vw,34px)', fontWeight: 700, letterSpacing: '-0.035em' }}
                  >
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-[640px] text-[15px] leading-[1.65] text-body/70">
                    {post.excerpt}
                  </p>
                </div>
                <span className="mono-label text-ink/35 md:text-right">{post.readingTime}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaFooter />
    </>
  );
}
