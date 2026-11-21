'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { gsap } from '@/lib/gsap';

const disciplines = [
  {
    word: 'Websites',
    count: '64',
    note: 'Marketing sites, editorial platforms, product launches',
    href: '/works',
  },
  {
    word: 'Identities',
    count: '38',
    note: 'Marks, type systems, art direction, guidelines',
    href: '/studio',
  },
  {
    word: 'E-commerce',
    count: '21',
    note: 'Storefronts, catalogues, checkout, fulfilment',
    href: '/works',
  },
  {
    word: 'Motion',
    count: '47',
    note: 'Scroll choreography, title sequences, product films',
    href: '/works',
  },
  {
    word: 'Product',
    count: '29',
    note: 'Interface design, design systems, prototyping',
    href: '/studio',
  },
];

export default function Disciplines() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const section = sectionRef.current;
    if (!list || !section) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('[data-discipline-word]'),
        { yPercent: 70, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.06,
          ease: 'power4.out',
          scrollTrigger: { trigger: section, start: 'top 82%' },
        },
      );

      gsap.fromTo(
        section.querySelectorAll('[data-discipline-note]'),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 76%' },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-paper pb-[clamp(50px,7vw,120px)] pt-[clamp(40px,6vw,110px)]"
    >
      <div className="px-[clamp(20px,9.27vw,9.27%)]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-ink/10 pb-[clamp(12px,1.4vw,22px)]">
          <span className="mono-label text-ink/40">What we do, counted</span>
          <span className="mono-label text-ink/30">Projects shipped since 2012</span>
        </div>

        <ul ref={listRef} className="mt-[clamp(18px,2.4vw,40px)]">
          {disciplines.map((d, i) => (
            <li key={d.word}>
              <Link
                href={d.href}
                data-active={active === i}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid items-baseline gap-x-[clamp(12px,2vw,36px)] border-b border-ink/10 py-[clamp(12px,1.6vw,28px)] transition-opacity"
              >
                <span
                  data-discipline-word
                  className="text-ink transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-x-[clamp(6px,1.2vw,22px)]"
                  style={{
                    fontSize: 'clamp(30px, 5.4vw, 92px)',
                    fontWeight: 700,
                    letterSpacing: '-0.05em',
                    lineHeight: 1.05,
                  }}
                >
                  {d.word}
                </span>

                <span
                  data-discipline-note
                  className="hidden max-w-[38ch] text-[clamp(13px,1.1vw,16px)] leading-[1.55] text-body/70 sm:block"
                >
                  {d.note}
                </span>

                <span className="ml-auto font-mono text-[clamp(13px,1.2vw,19px)] tracking-[0.02em] text-ink/45">
                  {d.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
