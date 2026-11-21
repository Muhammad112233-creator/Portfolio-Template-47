'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import GoldMark from '@/components/ui/GoldMark';
import { socialIcons } from '@/components/ui/SocialIcons';
import { Wordmark } from '@/components/ui/Wordmark';
import { cta, site } from '@/data/site';
import { gsap } from '@/lib/gsap';

export default function CtaFooter() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-cta-title]', {
        y: 80,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 78%' },
      });
      gsap.from('[data-cta-reveal]', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 72%' },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const year = new Date().getFullYear();

  return (
    <section
      id="section-footer"
      ref={ref}
      className="relative w-full overflow-hidden bg-ink text-paper"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            'radial-gradient(120% 70% at 78% 8%, rgba(247,192,47,0.16) 0%, rgba(0,0,0,0) 58%), radial-gradient(90% 60% at 10% 100%, rgba(47,107,216,0.18) 0%, rgba(0,0,0,0) 60%)',
        }}
      />

      <div className="relative z-[1] px-[clamp(20px,9.27vw,9.27%)] pt-[clamp(70px,9vw,160px)]">
        <div className="flex flex-col gap-[clamp(28px,4vw,70px)] lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              data-cta-title
              className="text-paper"
              style={{
                fontSize: 'clamp(52px, 9.4vw, 152px)',
                fontWeight: 700,
                letterSpacing: '-0.05em',
                lineHeight: 0.92,
              }}
            >
              {cta.title}
            </h2>
            <GoldMark className="mt-[clamp(18px,2.4vw,38px)] h-[clamp(52px,6vw,96px)] w-[clamp(52px,6vw,96px)] text-accent" rotate={-18} />
          </div>

          <div data-cta-reveal className="max-w-[430px] lg:pb-[10px]">
            <p className="text-[clamp(15px,1.25vw,19px)] leading-[1.65] text-paper/72">
              {cta.body}
            </p>
            <div className="mt-[clamp(22px,2.4vw,36px)] flex flex-wrap items-center gap-[clamp(16px,2vw,28px)]">
              <Link href={cta.primary.href} className="primary-cta primary-cta--accent">
                {cta.primary.label}
              </Link>
              <Link href={cta.secondary.href} className="ghost-cta text-paper">
                {cta.secondary.label}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="relative z-[1] mt-[clamp(60px,8vw,140px)] border-t border-paper/12 px-[clamp(20px,9.27vw,9.27%)] py-[clamp(26px,3vw,44px)]">
        <div className="flex flex-col gap-[clamp(20px,2.4vw,34px)] lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" aria-label={`${site.name} — home`} className="text-paper">
            <Wordmark />
          </Link>

          <div className="flex flex-col gap-[10px] font-mono text-[12.5px] tracking-[0.02em] text-paper/60 sm:flex-row sm:gap-[28px]">
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-accent">
              {site.email}
            </a>
            <a href={`tel:${site.phoneHref}`} className="transition-colors hover:text-accent">
              {site.phone}
            </a>
            <span>
              {site.address.city}, {site.address.country}
            </span>
          </div>

          <div className="flex items-center gap-[16px]">
            {site.socials.map((s) => {
              const Icon = socialIcons[s.icon];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-paper/70 transition-colors hover:text-accent"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-[clamp(20px,2.4vw,32px)] flex flex-wrap items-center justify-between gap-3 font-mono text-[11.5px] tracking-[0.06em] text-paper/35">
          <span>
            © {year} {site.legalName}
          </span>
          <span>Made slowly, in Lahore.</span>
        </div>
      </div>
    </section>
  );
}
