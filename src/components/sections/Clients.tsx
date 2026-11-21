'use client';

import { useEffect, useRef } from 'react';

import ClientMark from '@/components/ui/ClientMark';
import { clients } from '@/data/site';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function Clients() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 70,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 78%' },
      });

      gsap.from(grid.children, {
        y: 44,
        opacity: 0,
        duration: 0.9,
        stagger: { each: 0.055, from: 'start' },
        ease: 'power3.out',
        scrollTrigger: { trigger: grid, start: 'top 88%' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="section-clients"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-paper pt-[clamp(28px,3.4vw,56px)]"
    >
      <h2
        ref={titleRef}
        className="text-center text-ink"
        style={{
          fontSize: 'clamp(32px, 4.4vw, 72px)',
          fontWeight: 700,
          letterSpacing: '-0.045em',
          lineHeight: 1.05,
        }}
      >
        {clients.title}
      </h2>

      <p
        className="mx-auto mt-[clamp(18px,2vw,34px)] max-w-[620px] px-6 text-center text-[15px] leading-[1.65] text-body/80 md:text-[16px]"
        style={{ fontWeight: 400 }}
      >
        {clients.intro}
      </p>

      <div
        ref={gridRef}
        className="mt-[clamp(36px,4.5vw,80px)] grid grid-cols-2 gap-[clamp(10px,1.5vw,24px)] px-[clamp(20px,9.27vw,9.27%)] pb-[clamp(48px,6vw,110px)] md:grid-cols-4"
      >
        {clients.list.map((name, i) => (
          <div
            key={name}
            className="group flex aspect-[4/3] items-center justify-center border border-ink/[0.09] bg-paper px-4 transition-colors duration-500 hover:border-ink/25 hover:bg-mist/60"
          >
            <ClientMark
              name={name}
              index={i}
              className="w-full max-w-[190px] text-ink/80 transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
