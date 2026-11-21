type GlyphProps = { className?: string };

export function SparkGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0.8c.7 5.1 2.2 6.6 7.3 7.3-5.1.7-6.6 2.2-7.3 7.3-.7-5.1-2.2-6.6-7.3-7.3 5.1-.7 6.6-2.2 7.3-7.3Z" />
      <path d="M19.4 15.1c.35 2.55 1.1 3.3 3.65 3.65-2.55.35-3.3 1.1-3.65 3.65-.35-2.55-1.1-3.3-3.65-3.65 2.55-.35 3.3-1.1 3.65-3.65Z" />
    </svg>
  );
}

export function PrismGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M12 2.4 22 20H2L12 2.4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 2.4V20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M2 20 12 11l10 9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function ChatGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M21 12.2c0 4.3-4 7.8-9 7.8-1.1 0-2.2-.2-3.2-.6L3 21l1.7-4.4A7.3 7.3 0 0 1 3 12.2C3 7.9 7 4.4 12 4.4s9 3.5 9 7.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OrbitGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.1" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4.6" stroke="currentColor" strokeWidth="1.6" />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4.6"
        stroke="currentColor"
        strokeWidth="1.6"
        transform="rotate(62 12 12)"
      />
    </svg>
  );
}

export function LensGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="10.6" cy="10.6" r="7.1" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15.9 15.9 5.2 5.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M7.6 10.6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export const aiGlyphs = {
  spark: SparkGlyph,
  prism: PrismGlyph,
  chat: ChatGlyph,
  orbit: OrbitGlyph,
  lens: LensGlyph,
} as const;
