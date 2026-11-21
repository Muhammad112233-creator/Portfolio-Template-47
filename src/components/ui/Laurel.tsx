/**
 * A classic award laurel wreath, drawn as SVG so it stays crisp at any size
 * and inherits `currentColor`.
 *
 * Each branch is a circular arc fitted through three points, and the leaves
 * are teardrops rotated to splay outward from the stem.
 */

type Leaf = { d: string; cx: number; cy: number; rot: number };

const LEAVES = 10;

/** Left branch: an arc through (58,110) → (16,70) → (16,24). */
const ARC = { cx: 77.95, cy: 47, r: 66.08 };
const A0 = 107.6; // degrees, bottom of the branch
const A1 = 200.35; // degrees, top of the branch

function buildBranch(): Leaf[] {
  const leaves: Leaf[] = [];
  const rad = (d: number) => (d * Math.PI) / 180;

  for (let i = 0; i < LEAVES; i++) {
    const t = i / (LEAVES - 1);
    const a = A0 + (A1 - A0) * t;

    const cx = ARC.cx + ARC.r * Math.cos(rad(a));
    const cy = ARC.cy + ARC.r * Math.sin(rad(a));

    // tangent along the branch (direction of increasing angle)
    const tx = -Math.sin(rad(a));
    const ty = Math.cos(rad(a));
    const tangent = (Math.atan2(ty, tx) * 180) / Math.PI;

    // leaves splay outward from the stem, tilted away from the vertical
    const rot = tangent - 46;

    const len = 16.5 - t * 5.2;
    const wid = len * 0.33;
    // teardrop drawn along +x from the origin
    const d =
      `M0 0 C ${len * 0.26} ${-wid}, ${len * 0.72} ${-wid * 0.62}, ${len} 0 ` +
      `C ${len * 0.72} ${wid * 0.62}, ${len * 0.26} ${wid}, 0 0 Z`;

    leaves.push({ d, cx, cy, rot });
  }

  return leaves;
}

const LEFT = buildBranch();

function mirror(l: Leaf): Leaf {
  return { d: l.d, cx: 120 - l.cx, cy: l.cy, rot: 180 - l.rot };
}

export default function Laurel({
  className = '',
  label = 'Awwwards',
  sub = 'Honors',
}: {
  className?: string;
  label?: string;
  sub?: string;
}) {
  const right = LEFT.map(mirror);

  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      {/* stems */}
      <g stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M60 118 C 52 110 44 100 40 90" />
        <path d="M60 118 C 68 110 76 100 80 90" />
      </g>

      {/* leaves */}
      <g fill="currentColor">
        {LEFT.map((l, i) => (
          <path key={`l${i}`} d={l.d} transform={`translate(${l.cx} ${l.cy}) rotate(${l.rot})`} />
        ))}
        {right.map((l, i) => (
          <path key={`r${i}`} d={l.d} transform={`translate(${l.cx} ${l.cy}) rotate(${l.rot})`} />
        ))}
      </g>

      <text
        x="60"
        y="56"
        textAnchor="middle"
        fill="currentColor"
        fontSize="11.5"
        fontWeight="700"
        fontFamily="var(--font-sans)"
        letterSpacing="-0.02em"
      >
        {label}
      </text>
      <text
        x="60"
        y="68"
        textAnchor="middle"
        fill="currentColor"
        fontSize="6.4"
        fontFamily="var(--font-mono)"
        letterSpacing="0.16em"
        opacity="0.85"
      >
        {sub.toUpperCase()}
      </text>
    </svg>
  );
}
