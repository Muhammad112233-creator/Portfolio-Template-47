'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { aiGlyphs } from '@/components/ui/AiGlyphs';
import { socialIcons } from '@/components/ui/SocialIcons';
import { Wordmark } from '@/components/ui/Wordmark';
import { aiLinks, aiPrompt, nav, site } from '@/data/site';
import { gsap } from '@/lib/gsap';
import { getLenis } from '@/lib/lenis';

export default function SiteChrome() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const shellRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------- open / close -- */
  const setMenu = useCallback((next: boolean) => {
    setOpen(next);

    const shell = shellRef.current;
    const body = bodyRef.current;
    if (!shell || !body) return;

    const lenis = getLenis();
    if (next) lenis?.stop();
    else lenis?.start();

    const closedWidth = Math.min(window.innerWidth - 32, 326);
    const openWidth = Math.min(window.innerWidth - 32, 448);

    if (next) {
      gsap.to(shell, {
        width: openWidth,
        duration: 0.62,
        ease: 'power3.inOut',
      });
      gsap.to(body, {
        height: 'auto',
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
        delay: 0.06,
      });
      gsap.fromTo(
        navItemsRef.current?.children ?? [],
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.055,
          ease: 'power3.out',
          delay: 0.16,
        },
      );
    } else {
      gsap.to(body, {
        height: 0,
        opacity: 0,
        duration: 0.42,
        ease: 'power3.inOut',
      });
      gsap.to(shell, {
        width: closedWidth,
        duration: 0.5,
        ease: 'power3.inOut',
        delay: 0.06,
      });
    }
  }, []);

  /* --------------------------------------------- close on route change */
  useEffect(() => {
    if (open) setMenu(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* ---------------------------------------------------------- escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setMenu(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setMenu]);

  /* -------------------------------------------------------- body lock */
  useLayoutEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[8000] bg-ink/0 transition-colors duration-500" />

      <div
        ref={shellRef}
        className="fixed left-1/2 top-[22px] z-[9000] w-[326px] -translate-x-1/2 overflow-hidden rounded-[13px] bg-accent shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)]"
      >
        {/* ---- top row ---- */}
        <div
          ref={barRef}
          className="flex w-full items-center justify-between gap-6 px-[10px] py-[10px]"
        >
          <Link href="/" aria-label={`${site.name} — home`} className="shrink-0 text-ink">
            <Wordmark />
          </Link>

          <button
            type="button"
            onClick={() => setMenu(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="group flex items-center gap-[10px] rounded-[6px] bg-ink px-[15px] py-[8px] text-accent transition-colors duration-300 hover:bg-accent hover:text-ink"
          >
            <span className="text-[13px] font-medium tracking-[-0.01em]">
              {open ? 'Close' : 'Menu'}
            </span>
            <MenuGlyph open={open} />
          </button>
        </div>

        {/* ---- expandable body ---- */}
        <div ref={bodyRef} className="h-0 overflow-hidden opacity-0">
          <div className="px-[16px] pb-[16px]">
            <div className="h-px w-full bg-ink/15" />

            <nav ref={navItemsRef} className="flex flex-col items-start pt-[26px]">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative text-[34px] font-bold leading-[1.25] tracking-[-0.045em] text-ink"
                  >
                    <span className="relative inline-block">
                      {item.label}
                      <span
                        className={`absolute -bottom-[2px] left-0 h-[2px] bg-ink transition-all duration-500 ${
                          active ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-[30px] h-px w-full bg-ink/15" />

            <div className="flex items-center justify-between gap-4 pt-[14px]">
              <span className="font-mono text-[13px] tracking-[0.02em] text-ink">Ask AI About Us</span>
              <div className="flex items-center gap-[14px]">
                {aiLinks.map((ai) => {
                  const Glyph = aiGlyphs[ai.glyph];
                  return (
                    <a
                      key={ai.label}
                      href={ai.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={ai.label}
                      aria-label={ai.label}
                      className="text-ink transition-transform duration-300 hover:-translate-y-[3px]"
                    >
                      <Glyph className="h-[19px] w-[19px]" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-[16px] h-px w-full bg-ink/15" />

            <div className="flex items-end justify-between gap-4 pt-[16px]">
              <div className="flex flex-col gap-[6px]">
                <a
                  href={`tel:${site.phoneHref}`}
                  className="font-mono text-[13px] tracking-[0.02em] text-ink transition-opacity hover:opacity-60"
                >
                  {site.phone}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="font-mono text-[13px] tracking-[0.02em] text-ink transition-opacity hover:opacity-60"
                >
                  {site.email}
                </a>
              </div>

              <div className="flex items-center gap-[16px]">
                <button
                  type="button"
                  className="flex items-center gap-[7px] rounded-[6px] border border-ink/35 px-[10px] py-[7px] font-mono text-[12px] text-ink transition-colors hover:bg-ink hover:text-accent"
                  title="Arabic version coming soon"
                >
                  <GlobeIcon className="h-[14px] w-[14px]" />
                  <span dir="rtl">فارسی</span>
                </button>

                <div className="flex items-center gap-[14px]">
                  {site.socials.map((s) => {
                    const Icon = socialIcons[s.icon];
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="text-ink transition-opacity hover:opacity-60"
                      >
                        <Icon className="h-[17px] w-[17px]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* dimmer behind the menu */}
      <div
        onClick={() => setMenu(false)}
        aria-hidden
        className={`fixed inset-0 z-[8500] bg-ink/45 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* prefetch helper data */}
      <span className="hidden" data-ai-prompt={aiPrompt} />
    </>
  );
}

/* ------------------------------------------------------------------ */

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" aria-hidden>
      <g
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        style={{ transition: 'transform 400ms cubic-bezier(.4,0,.2,1)' }}
      >
        <line
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          style={{
            transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
            transformOrigin: '12px 6px',
          }}
        />
        <line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          style={{ opacity: open ? 0 : 1, transition: 'opacity 250ms' }}
        />
        <line
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          style={{
            transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
            transformOrigin: '12px 18px',
          }}
        />
      </g>
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18-2.6-2.6-2.6-15.4 0-18Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
