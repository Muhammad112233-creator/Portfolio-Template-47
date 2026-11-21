import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import CtaFooter from '@/components/sections/CtaFooter';
import { BackLink } from '@/components/ui/PageHeader';
import { posts, site } from '@/data/site';
import { withBase } from '@/lib/paths';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post not found' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: `${post.title} — Halden Studio`,
      description: post.excerpt,
      publishedTime: post.date,
      images: [{ url: post.cover }],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const post = posts[index];
  const next = posts[(index + 1) % posts.length];

  return (
    <>
      <article className="bg-paper">
        <div className="px-[clamp(20px,9.27vw,9.27%)] pb-[clamp(24px,3vw,48px)] pt-[clamp(110px,14vw,200px)]">
          <BackLink href="/blog" label="Journal" />
        </div>

        <header className="px-[clamp(20px,9.27vw,9.27%)]">
          <div className="flex flex-wrap items-center gap-[16px]">
            <span className="mono-label text-ink/45">{post.tag}</span>
            <span className="mono-label text-ink/30">{post.date}</span>
            <span className="mono-label text-ink/30">{post.readingTime} read</span>
          </div>
          <h1
            className="mt-5 max-w-[18ch] text-ink"
            style={{
              fontSize: 'clamp(34px,5.6vw,96px)',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              lineHeight: 1,
            }}
          >
            {post.title}
          </h1>
          <p className="mt-[clamp(18px,2.4vw,34px)] max-w-[680px] text-[clamp(16px,1.4vw,22px)] leading-[1.55] text-body/80">
            {post.excerpt}
          </p>
        </header>

        <div className="mt-[clamp(30px,4vw,70px)] px-[clamp(20px,4vw,72px)]">
          <div
            className="relative w-full overflow-hidden bg-mist"
            style={{ aspectRatio: '16 / 9' }}
          >
            <Image src={withBase(post.cover)} alt={post.title} fill priority sizes="100vw" className="object-cover" />
          </div>
        </div>

        <div className="mx-auto max-w-[680px] px-[clamp(20px,4vw,72px)] py-[clamp(50px,7vw,120px)]">
          {post.body.map((paragraph, i) => (
            <p
              key={i}
              className="text-[clamp(16px,1.35vw,20px)] leading-[1.78] text-body/90 first:text-ink"
              style={{ marginTop: i === 0 ? 0 : '1.5em' }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="border-t border-ink/10 px-[clamp(20px,9.27vw,9.27%)] py-[clamp(30px,4vw,60px)]">
          <Link href={`/blog/${next.slug}`} className="group block">
            <span className="mono-label text-ink/40">Next post</span>
            <div className="mt-3 flex items-center justify-between gap-6">
              <span
                className="text-ink transition-transform duration-500 group-hover:-translate-x-2"
                style={{ fontSize: 'clamp(22px,2.8vw,48px)', fontWeight: 700, letterSpacing: '-0.04em' }}
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            image: `${site.url}${post.cover}`,
            author: { '@type': 'Organization', name: site.legalName },
          }),
        }}
      />
    </>
  );
}
