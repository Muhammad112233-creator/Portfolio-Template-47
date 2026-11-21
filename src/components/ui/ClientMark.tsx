/**
 * Client wordmarks. Each one is a small SVG so it can pick up its own
 * weight, tracking and glyph — the way a real client wall looks.
 */
const STYLES = [
  { case: 'lower', weight: 500, tracking: '0.01em', size: 19 },
  { case: 'upper', weight: 700, tracking: '0.17em', size: 15 },
  { case: 'title', weight: 700, tracking: '-0.045em', size: 21 },
  { case: 'lower', weight: 400, tracking: '0.08em', size: 17 },
  { case: 'upper', weight: 500, tracking: '0.26em', size: 13 },
] as const;

function shape(index: number) {
  switch (index % 5) {
    case 0:
      return <circle cx="9" cy="30" r="7" fill="currentColor" />;
    case 1:
      return <path d="M9 22 16 38H2L9 22Z" fill="currentColor" />;
    case 2:
      return <rect x="2" y="23" width="14" height="14" fill="currentColor" />;
    case 3:
      return (
        <path
          d="M2 38a7 7 0 0 1 14 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <path
          d="M9 22v16M2 30h14"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      );
  }
}

export default function ClientMark({
  name,
  index,
  className = '',
}: {
  name: string;
  index: number;
  className?: string;
}) {
  const style = STYLES[index % STYLES.length];
  const label =
    style.case === 'upper'
      ? name.toUpperCase()
      : style.case === 'title'
        ? name.replace(/\b\w/g, (c) => c.toUpperCase())
        : name.toLowerCase();

  return (
    <svg
      viewBox="0 0 220 60"
      className={className}
      role="img"
      aria-label={name}
      preserveAspectRatio="xMidYMid meet"
    >
      <g color="currentColor" opacity="0.92">
        {shape(index)}
        <text
          x="26"
          y="36"
          fill="currentColor"
          fontFamily="var(--font-sans)"
          fontSize={style.size}
          fontWeight={style.weight}
          letterSpacing={style.tracking}
        >
          {label}
        </text>
      </g>
    </svg>
  );
}
