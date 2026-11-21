'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { whyUs } from '@/data/site';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const Stage = dynamic(() => import('@/components/three/Stage'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#7b8790]" />,
});

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const steps = stepsRef.current;
    if (!section || !steps) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(steps.querySelectorAll<HTMLElement>('.why-us-step'));

    if (reduce) {
      items.forEach((s) => {
        s.style.visibility = 'visible';
        s.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          onUpdate: (self) => {
            const idx = Math.min(items.length - 1, Math.floor(self.progress * items.length));
            setActive(idx);
          },
        },
      });

      items.forEach((step, i) => {
        if (i === 0) return;
        tl.fromTo(
          step,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          i * 0.85,
        );
        tl.to(step, { opacity: 0, y: -60, duration: 0.5, ease: 'power2.in' }, i * 0.85 + 0.62);
      });

      // the first step drifts away as we leave it
      tl.to(items[0], { opacity: 0, y: -60, duration: 0.5, ease: 'power2.in' }, 0.62);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="section-why-us" ref={sectionRef} className="why-us-section">
      <div className="why-us-viewport">
      <div className="absolute inset-0 z-0">
        <Stage variant="coast" className="h-full w-full" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(10,16,20,0.18) 0%, rgba(10,16,20,0) 40%, rgba(10,16,20,0.26) 100%)',
        }}
      />

      <div ref={stepsRef} className="why-us-steps">
        {whyUs.steps.map((step, i) => (
          <article
            key={step.number}
            className={`why-us-step why-us-step-${i + 1}`}
            aria-hidden={i !== active}
          >
            <h2 className="why-us-number">{step.number}</h2>
            {step.caption ? (
              <p className="why-us-caption">
                {step.caption[0]}
                <br />
                {step.caption[1]}
              </p>
            ) : (
              <div className="why-us-copy">
                <p>{step.copy}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="why-us-dots">
        {whyUs.steps.map((step, i) => (
          <button
            key={step.number}
            type="button"
            data-active={active === i}
            aria-label={`Step ${i + 1}`}
            onClick={() => {
              const el = sectionRef.current;
              if (!el) return;
              const rect = el.getBoundingClientRect();
              const target = rect.top + window.scrollY + (rect.height * (i + 0.15)) / whyUs.steps.length;
              window.scrollTo({ top: target, behavior: 'smooth' });
            }}
          />
        ))}
      </div>
      </div>
    </section>
  );
}
