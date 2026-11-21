'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

import Laurel from '@/components/ui/Laurel';
import { hero } from '@/data/site';
import { gsap, SplitText } from '@/lib/gsap';

const Stage = dynamic(() => import('@/components/three/Stage'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#1b5f82]" />,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const split = new SplitText(el, { type: 'words', wordsClass: 'hero-word' });
    const ctx = gsap.context(() => {
      gsap.set(split.words, { yPercent: 115, opacity: 0 });
      gsap
        .timeline({ delay: 1.35 })
        .to(split.words, {
          yPercent: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.045,
          ease: 'power4.out',
        });
    }, el);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section
      id="section-hero"
      ref={sectionRef}
      className="svh-fill relative w-full overflow-hidden"
      aria-label="Halden — creative and digital studio"
    >
      {/* 3D backdrop */}
      <div className="absolute inset-0 z-0">
        <Stage variant="field" className="h-full w-full" />
      </div>

      {/* readability wash */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,12,18,0.22) 0%, rgba(8,12,18,0.04) 46%, rgba(8,12,18,0.36) 100%)',
        }}
      />

      {/* headline */}
      <div
        className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 'min(613px, 90vw)',
          height:
            'min(740px, 80svh, calc(100svh - 2 * (max(28px, env(safe-area-inset-top)) + 82px)))',
        }}
      >
        <h1
          ref={headlineRef}
          className="absolute bottom-0 right-0 w-full text-center text-white"
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: 'clamp(28px, 4vw, 40px)',
            lineHeight: 1.2,
            letterSpacing: '-0.04em',
          }}
        >
          {hero.headline.join(' ')}
        </h1>
      </div>

      {/* award laurels */}
      <div
        className="absolute z-[2] flex items-end gap-[26px] text-white"
        style={{
          left: 'clamp(24px, 9.3vw, 178px)',
          bottom: 'clamp(32px, 5vw, 72px)',
        }}
      >
        {hero.awards.map((award) => (
          <a
            key={award.label}
            href={award.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={award.label}
            className="group flex flex-col items-center gap-[6px] opacity-95 transition-opacity hover:opacity-100"
          >
            <Laurel className="h-[78px] w-[78px]" label={award.short} sub="Honors" />
          </a>
        ))}
      </div>

      {/* scroll cue */}
      <a
        href="#section-why-us"
        className="absolute z-[2] flex items-center gap-[8px] text-[14px] text-white transition-opacity hover:opacity-70"
        style={{
          right: 'clamp(24px, 9.3vw, 178px)',
          bottom: 'clamp(32px, 5vw, 72px)',
        }}
      >
        {hero.scrollCue}
        <span aria-hidden>↓</span>
      </a>
    </section>
  );
}
