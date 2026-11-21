'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { manifesto } from '@/data/site';
import { gsap } from '@/lib/gsap';
import { withBase } from '@/lib/paths';

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-manifesto-plate]',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 78%' },
        },
      );

      gsap.utils.toArray<HTMLElement>('[data-manifesto-reveal]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out',
            delay: i * 0.07,
            scrollTrigger: { trigger: el, start: 'top 90%' },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="section-manifesto"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-paper px-[clamp(20px,9.27vw,9.27%)] pb-[clamp(70px,9vw,150px)] pt-[clamp(60px,8vw,140px)]"
    >
      <div className="grid items-start gap-[clamp(32px,5vw,90px)] lg:grid-cols-[0.82fr_1.18fr]">
        {/* ---------------------------------------------- the plate */}
        <figure data-manifesto-plate className="relative mx-auto w-full max-w-[420px] lg:sticky lg:top-[clamp(90px,12vh,140px)]">
          <div className="relative w-full overflow-hidden bg-mist" style={{ aspectRatio: '900 / 1180' }}>
            <Image
              src={withBase('/assets/img/portrait-plate.svg')}
              alt="Halftone portrait plate of the studio founder"
              fill
              sizes="(max-width: 1024px) 90vw, 420px"
              className="object-cover"
            />
          </div>

          <figcaption className="mt-[clamp(12px,1.2vw,18px)] flex items-start justify-between gap-4 border-t border-ink/12 pt-[clamp(10px,1vw,16px)]">
            <span className="text-ink" style={{ fontSize: 'clamp(14px,1.2vw,18px)', fontWeight: 700 }}>
              {manifesto.plate.caption}
            </span>
            <span className="mono-label text-right text-ink/45">
              {manifesto.plate.role}
              <br />
              since {manifesto.plate.since}
            </span>
          </figcaption>
        </figure>

        {/* ---------------------------------------------- the statement */}
        <div>
          <span data-manifesto-reveal className="mono-label block text-ink/40">
            What we believe
          </span>

          <p
            data-manifesto-reveal
            className="mt-[clamp(16px,2vw,30px)] max-w-[22ch] text-ink"
            style={{
              fontSize: 'clamp(24px,3.2vw,52px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.14,
            }}
          >
            {manifesto.lead}
          </p>

          <div className="mt-[clamp(28px,3.4vw,56px)] max-w-[620px] space-y-[1.45em]">
            {manifesto.body.map((paragraph, i) => (
              <p
                key={i}
                data-manifesto-reveal
                className="text-[clamp(15px,1.25vw,18px)] leading-[1.75] text-body/85"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <dl
            data-manifesto-reveal
            className="mt-[clamp(36px,4.6vw,80px)] grid grid-cols-2 gap-x-6 gap-y-[clamp(20px,2.6vw,40px)] border-t border-ink/12 pt-[clamp(24px,3vw,44px)] sm:grid-cols-4"
          >
            {manifesto.facts.map((f) => (
              <div key={f.k}>
                <dt className="mono-label text-ink/40">{f.k}</dt>
                <dd
                  className="mt-[10px] text-ink"
                  style={{ fontSize: 'clamp(19px,1.9vw,30px)', fontWeight: 700, letterSpacing: '-0.035em' }}
                >
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
