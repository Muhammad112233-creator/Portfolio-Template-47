'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { projects } from '@/data/site';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { withBase } from '@/lib/paths';

export default function Works() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-work-item]').forEach((item) => {
        const media = item.querySelector('[data-work-media]');
        if (!media) return;
        gsap.fromTo(
          media,
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 88%' },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const columns = [
    projects.filter((_, i) => i % 2 === 0),
    projects.filter((_, i) => i % 2 === 1),
  ];

  return (
    <section
      id="section-works"
      ref={sectionRef}
      className="relative w-full bg-paper px-[clamp(20px,4vw,72px)] pb-[clamp(70px,9vw,160px)] pt-[clamp(50px,6vw,110px)]"
    >
      <div className="mb-[clamp(40px,5vw,80px)] flex items-end justify-between gap-6">
        <h2
          className="text-ink"
          style={{
            fontSize: 'clamp(30px, 4.2vw, 68px)',
            fontWeight: 700,
            letterSpacing: '-0.045em',
            lineHeight: 1,
          }}
        >
          Selected works
        </h2>
        <span className="mono-label hidden text-ink/45 sm:block">
          {String(projects.length).padStart(2, '0')} projects
        </span>
      </div>

      <div className="grid grid-cols-1 gap-x-[clamp(16px,2.4vw,40px)] gap-y-[clamp(48px,6.5vw,140px)] md:grid-cols-[46fr_54fr]">
        {columns.map((column, ci) => (
          <div key={ci} className={`flex flex-col gap-[clamp(48px,6.5vw,140px)] ${ci === 1 ? 'md:pt-[clamp(70px,10vw,190px)]' : ''}`}>
            {column.map((project) => (
              <article key={project.slug} data-work-item>
                <Link
                  href={`/works/${project.slug}`}
                  className="group block"
                  aria-label={`${project.title} — ${project.categories.join(', ')}`}
                >
                  <div
                    data-work-media
                    className="relative w-full overflow-hidden bg-mist"
                    style={{ aspectRatio: ci === 0 ? '4 / 3' : '3 / 4' }}
                  >
                    <Image
                      src={withBase(project.cover)}
                      alt={`${project.title} — ${project.categories.join(', ')}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.05]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10" />

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

                    <span
                      className="pointer-events-none absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-accent text-ink opacity-0 transition-all duration-500 group-hover:opacity-100"
                      style={{ transform: 'translateY(10px)' }}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                        <path
                          d="M7 17 17 7M9 7h8v8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>

                  <div className="mt-[clamp(12px,1.2vw,18px)] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h3 className="text-ink" style={{ fontSize: 'clamp(17px,1.5vw,25px)', fontWeight: 700, letterSpacing: '-0.03em' }}>
                      {project.title}
                    </h3>
                    <span className="font-mono text-[12px] tracking-[0.02em] text-ink/55">
                      {project.year} · {project.categories.join(' · ')}
                    </span>
                  </div>
                  <p className="mt-[6px] max-w-[46ch] text-[14px] leading-[1.55] text-body/65">
                    {project.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
