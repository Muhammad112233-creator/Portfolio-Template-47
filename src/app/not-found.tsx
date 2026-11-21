import Link from 'next/link';

import { Wordmark } from '@/components/ui/Wordmark';

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-paper">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(90% 60% at 50% 12%, rgba(247,192,47,0.18) 0%, rgba(0,0,0,0) 62%), radial-gradient(80% 60% at 20% 100%, rgba(47,107,216,0.22) 0%, rgba(0,0,0,0) 60%)',
        }}
      />

      <div className="relative z-[1]">
        <Wordmark className="justify-center" textClassName="text-[22px] leading-none" />
        <h1
          className="mt-[clamp(22px,3vw,44px)] text-paper"
          style={{
            fontSize: 'clamp(64px, 15vw, 220px)',
            fontWeight: 700,
            letterSpacing: '-0.055em',
            lineHeight: 0.86,
          }}
        >
          404
        </h1>
        <p className="mx-auto mt-[clamp(16px,2vw,28px)] max-w-[460px] text-[clamp(15px,1.25vw,19px)] leading-[1.65] text-paper/70">
          This page has wandered off. Nothing here was published, or it moved house.
        </p>
        <div className="mt-[clamp(26px,3vw,44px)] flex flex-wrap items-center justify-center gap-[14px]">
          <Link href="/" className="primary-cta primary-cta--accent">
            Back home
          </Link>
          <Link href="/works" className="ghost-cta text-paper">
            See the work
          </Link>
        </div>
      </div>
    </main>
  );
}
