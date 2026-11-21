'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import GoldMark from '@/components/ui/GoldMark';
import { awards, projects } from '@/data/site';
import { gsap } from '@/lib/gsap';
import { withBase } from '@/lib/paths';

export default function Awards() {
  const [index, setIndex] = useState(0);
  const figureRef = useRef<HTMLDivElement>(null);

  const active = awards[index];
  const activeProject = projects.find((p) => p.slug === active.href.split('/').pop());

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + awards.length) % awards.length);
  }, []);

  useEffect(() => {
    const el = figureRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' });
    }, el);
    return () => ctx.revert();
  }, [index]);

  const controls = (
    <div className="flex items-center gap-[clamp(12px,1.4vw,22px)]">
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous award"
        className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/70 transition-colors hover:border-ink/60 hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="font-mono text-[13px] tracking-[0.06em] text-ink/70">
        {String(index + 1).padStart(2, '0')} / {String(awards.length).padStart(2, '0')}
      </span>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next award"
        className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/70 transition-colors hover:border-ink/60 hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );

  return (
    <section className="awards-section">
      <h2 className="awards-title">Awards</h2>

      <GoldMark
        className="absolute z-[1] h-[clamp(70px,9vw,132px)] w-[clamp(70px,9vw,132px)]"
        rotate={-18}
        style={{
          left: 'clamp(20px, 9.27vw, 9.27%)',
          top: 'clamp(140px, 13.5vw, 235px)',
        }}
      />

      {/* decorative floating frames */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-90">
        {awards.slice(1, 6).map((a, i) => {
          const spots = [
            { left: '3%', top: '14%', w: '16%' },
            { left: '84%', top: '4%', w: '14%' },
            { left: '71%', top: '26%', w: '19%' },
            { left: '0%', top: '58%', w: '13%' },
            { left: '88%', top: '48%', w: '11%' },
          ][i];
          return (
            <div
              key={a.title}
              className="absolute overflow-hidden shadow-[0_18px_44px_-28px_rgba(0,0,0,0.6)]"
              style={{ ...spots, aspectRatio: '4 / 3' }}
            >
              <Image src={withBase(activeProject?.cover ?? a.thumb)} alt="" fill sizes="20vw" className="object-cover" />
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------ main stage */}
      <div className="relative z-[2] mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-[clamp(30px,4vw,70px)] px-[clamp(20px,4vw,72px)] pt-[clamp(120px,16vw,260px)] lg:grid-cols-[1.12fr_0.88fr]">
        {/* figure column */}
        <div className="lg:sticky lg:top-[clamp(88px,13vh,150px)]">
          <div className="hidden lg:block">{controls}</div>

          <div
            ref={figureRef}
            className="relative mx-auto mt-[clamp(20px,2.4vw,34px)] w-full max-w-[760px] overflow-hidden bg-mist lg:mt-[clamp(18px,2.2vw,32px)]"
            style={{ aspectRatio: '16 / 10' }}
          >
            <Image
              key={active.title}
              src={withBase(activeProject?.cover ?? active.thumb)}
              alt={`${active.title} — ${active.label}`}
              fill
              sizes="(max-width: 1024px) 90vw, 55vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>

          <div className="mx-auto mt-[clamp(14px,1.4vw,24px)] flex max-w-[760px] flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h3
              className="text-ink"
              style={{ fontSize: 'clamp(21px,2.4vw,40px)', fontWeight: 700, letterSpacing: '-0.035em' }}
            >
              {active.title}
            </h3>
            <span className="font-mono text-[12px] tracking-[0.06em] text-ink/50">{active.label}</span>
          </div>

          <div className="mx-auto mt-[clamp(18px,2vw,28px)] flex max-w-[760px] justify-center lg:hidden">{controls}</div>
        </div>

        {/* award list */}
        <div className="relative z-[2]">
          <p className="mono-label mb-[clamp(12px,1.4vw,20px)] text-ink/40">Recognition</p>
          <ul className="w-full">
            {awards.map((a, i) => (
              <li key={`${a.title}-${a.date}`}>
                <Link
                  href={a.href}
                  onMouseEnter={() => setIndex(i)}
                  onFocus={() => setIndex(i)}
                  className={`group flex items-start justify-between gap-6 border-b border-ink/10 py-[clamp(12px,1.2vw,20px)] transition-opacity ${
                    i === index ? 'opacity-100' : 'opacity-55 hover:opacity-100'
                  }`}
                >
                  <span className="flex flex-col gap-[4px]">
                    <span className="font-mono text-[12px] tracking-[0.04em] text-ink/55">{a.date}</span>
                    <span className="text-ink" style={{ fontSize: 'clamp(14px,1.15vw,18px)', fontWeight: 500 }}>
                      {a.label} — {a.title}
                    </span>
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-[3px] h-[18px] w-[18px] shrink-0 text-ink transition-transform duration-300 group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
                    fill="none"
                    aria-hidden
                  >
                    <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-[clamp(20px,2.4vw,34px)] max-w-[42ch] text-[14px] leading-[1.7] text-body/70">
            Twelve juries, one shortlist. We do not enter awards for the badge — but we
            keep them honest, because a deadline is a useful kind of pressure.
          </p>
        </div>
      </div>
    </section>
  );
}
