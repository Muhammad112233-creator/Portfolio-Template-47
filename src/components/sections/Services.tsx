'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { services } from '@/data/site';
import { gsap } from '@/lib/gsap';

const Stage = dynamic(() => import('@/components/three/Stage'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#02080d]" />,
});

export default function Services() {
  const titlesRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dragHint, setDragHint] = useState<{ x: number; y: number } | null>(null);

  /* --------------------------------------------------- title cycle */
  useEffect(() => {
    const holder = titlesRef.current;
    if (!holder) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(holder.children) as HTMLElement[];
    if (reduce || items.length < 2) return;

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, yPercent: 42, filter: 'blur(6px)' });
      gsap.set(items[0], { opacity: 1, yPercent: 0, filter: 'blur(0px)' });

      const tl = gsap.timeline({ repeat: -1, delay: 1.2 });
      items.forEach((_, i) => {
        const cur = items[i];
        const next = items[(i + 1) % items.length];
        tl.to(cur, { opacity: 0, yPercent: -42, filter: 'blur(6px)', duration: 0.75, ease: 'power2.in' }, i * 2.6 + 2.1);
        tl.to(
          next,
          { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
          i * 2.6 + 2.35,
        );
        tl.call(() => setActive((i + 1) % items.length), undefined, i * 2.6 + 2.4);
      });
    }, holder);

    return () => ctx.revert();
  }, []);

  /* ----------------------------------------------------- drag hint */
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.buttons === 1) setDragHint({ x: e.clientX, y: e.clientY });
    };
    const up = () => setDragHint(null);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  return (
    <section id="section-services" className="services-section">
      <div className="services-viewport">
      <div className="absolute inset-0 z-0">
        <Stage variant="aurora" className="h-full w-full" draggable />
      </div>

      <div className="services-stage">
        <div className="services-copy">
          <p className="services-eyebrow">{services.eyebrow}</p>
          <div ref={titlesRef} className="services-titles" aria-live="off">
            {services.titles.map((title) => (
              <h2 key={title} className="services-title">
                {title}
              </h2>
            ))}
          </div>
        </div>

        <div className="services-indicators">
          {services.titles.map((title, i) => (
            <button
              key={title}
              type="button"
              data-active={active === i}
              aria-label={title}
              onClick={() => setActive(i)}
            >
              <span />
            </button>
          ))}
        </div>
      </div>

      </div>

      {/* "Drag & Drop" affordance that follows the pointer */}
      {dragHint && (
        <div
          className="pointer-events-none fixed z-[5] -translate-x-1/2 -translate-y-[140%] rounded-[6px] bg-accent px-[12px] py-[7px] text-[13px] font-medium text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]"
          style={{ left: dragHint.x, top: dragHint.y }}
        >
          Drag &amp; Drop
        </div>
      )}
    </section>
  );
}
