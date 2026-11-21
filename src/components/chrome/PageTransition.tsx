'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { gsap } from '@/lib/gsap';

/**
 * A canvas "shutter" that plays once on first paint and again on every
 * route change. It sits above everything (z-index 10000) exactly like the
 * reference site's transition layer, but paints a grid of tiles that
 * scatter away to reveal the page underneath.
 */
export default function PageTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const played = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    const tiles: { x: number; y: number; s: number; delay: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = 74;
      cols = Math.max(8, Math.min(target, Math.round(w / 22)));
      rows = Math.max(6, Math.min(target, Math.round(h / 22)));
      tiles.length = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          tiles.push({
            x: (x + 0.5) * (w / cols),
            y: (y + 0.5) * (h / rows),
            s: (w / cols) * 0.92,
            delay: Math.random() * 0.35,
          });
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const paint = (progress: number) => {
      ctx.clearRect(0, 0, w, h);
      const p = Math.min(1, Math.max(0, progress));

      tiles.forEach((t) => {
        const local = Math.min(1, Math.max(0, (p - t.delay) / (1 - t.delay)));
        const eased = 1 - Math.pow(1 - local, 3);
        if (eased <= 0) return;

        const size = t.s * (1 - eased);
        const alpha = 1 - eased;

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(eased * 0.6);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#202020';
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.restore();
      });

      // brand mark rides out of the centre
      const markAlpha = Math.max(0, 1 - p * 2.1);
      if (markAlpha > 0.01) {
        const scale = 1 + p * 0.55;
        ctx.save();
        ctx.globalAlpha = markAlpha;
        ctx.translate(w / 2, h / 2);
        ctx.scale(scale, scale);
        ctx.fillStyle = '#f7c02f';
        const k = Math.min(w, h) * 0.055;
        const chevron = (dir: number) => {
          ctx.beginPath();
          ctx.moveTo(dir * 3 * k, 0);
          ctx.lineTo(dir * 1.05 * k, -1.6 * k);
          ctx.lineTo(dir * 0.2 * k, -0.9 * k);
          ctx.lineTo(dir * 1.1 * k, 0);
          ctx.lineTo(dir * 0.2 * k, 0.9 * k);
          ctx.lineTo(dir * 1.05 * k, 1.6 * k);
          ctx.closePath();
          ctx.fill();
        };
        chevron(-1);
        chevron(1);
        ctx.restore();
      }
    };

    let raf = 0;
    let tween: gsap.core.Tween | null = null;

    const play = () => {
      if (reduce) {
        paint(1);
        canvas.style.opacity = '0';
        return;
      }
      paint(0);
      canvas.style.opacity = '1';
      const state = { p: 0 };
      tween = gsap.to(state, {
        p: 1,
        duration: 1.15,
        ease: 'power2.inOut',
        onUpdate: () => paint(state.p),
        onComplete: () => {
          canvas.style.opacity = '0';
        },
      });
    };

    const rafLoop = () => {
      raf = requestAnimationFrame(rafLoop);
    };
    rafLoop();

    // first paint
    if (!played.current) {
      played.current = true;
      const id = window.setTimeout(play, 120);
      return () => {
        window.clearTimeout(id);
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        tween?.kill();
      };
    }

    // route change
    const id = window.setTimeout(play, 60);
    return () => {
      window.clearTimeout(id);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      tween?.kill();
    };
  }, [pathname]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[10000] opacity-0"
    />
  );
}
