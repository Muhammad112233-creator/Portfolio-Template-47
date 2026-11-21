'use client';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let instance: Lenis | null = null;

export function getLenis() {
  return instance;
}

/**
 * Boot Lenis and drive it from GSAP's ticker so the smooth scroll and
 * ScrollTrigger never drift apart.
 */
export function initLenis() {
  if (typeof window === 'undefined') return null;
  if (instance) return instance;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return null;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1.6,
    wheelMultiplier: 1,
  });

  instance = lenis;

  // Expose the instance so it can be driven from the console or a test
  // harness:  window.lenis.scrollTo(1200, { immediate: true })
  (window as unknown as { lenis?: Lenis }).lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);

  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroyLenis() {
  instance?.destroy();
  instance = null;
}
