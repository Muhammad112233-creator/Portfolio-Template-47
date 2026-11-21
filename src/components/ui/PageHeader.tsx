'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { gsap, SplitText } from '@/lib/gsap';

/** Shared masthead used by every inner page. */
export default function PageHeader({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const split = new SplitText(el, { type: 'words', wordsClass: 'page-word' });
    const ctx = gsap.context(() => {
      gsap.set(split.words, { yPercent: 110, opacity: 0 });
      gsap.to(split.words, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.05,
        ease: 'power4.out',
        delay: 0.15,
      });
    }, el);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-paper px-[clamp(20px,9.27vw,9.27%)] pb-[clamp(40px,6vw,100px)] pt-[clamp(120px,16vw,230px)]"
    >
      <div className="flex flex-col gap-[clamp(18px,2.4vw,40px)]">
        <span className="mono-label text-ink/45">{kicker}</span>
        <h1
          ref={titleRef}
          className="text-ink"
          style={{
            fontSize: 'clamp(38px, 7.4vw, 132px)',
            fontWeight: 700,
            letterSpacing: '-0.05em',
            lineHeight: 0.96,
            maxWidth: '18ch',
          }}
        >
          {title}
        </h1>
        {intro && (
          <p className="max-w-[620px] text-[clamp(15px,1.25vw,19px)] leading-[1.65] text-body/80">
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mono-label inline-flex items-center gap-[8px] text-ink/55 transition-colors hover:text-ink"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path
          d="M19 12H5m0 0 6-6m-6 6 6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </Link>
  );
}
