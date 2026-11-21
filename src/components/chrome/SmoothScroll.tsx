'use client';

import { useEffect } from 'react';

import { destroyLenis, initLenis } from '@/lib/lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = initLenis();
    return () => destroyLenis();
  }, []);

  return <>{children}</>;
}
