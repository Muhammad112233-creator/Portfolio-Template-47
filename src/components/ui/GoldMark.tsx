/** The brand mark rendered in cast gold — used on flat (non-WebGL) surfaces. */
export default function GoldMark({
  className = '',
  rotate = -16,
  style,
}: {
  className?: string;
  rotate?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      <defs>
        <linearGradient id="halden-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7dfa2" />
          <stop offset="26%" stopColor="#d8ab45" />
          <stop offset="52%" stopColor="#8d6418" />
          <stop offset="74%" stopColor="#e0bb63" />
          <stop offset="100%" stopColor="#6f4d12" />
        </linearGradient>
        <filter id="halden-gold-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="2" dy="7" stdDeviation="6" floodColor="#000" floodOpacity="0.28" />
        </filter>
      </defs>
      <g fill="url(#halden-gold)" filter="url(#halden-gold-shadow)">
        <path d="M8 60 38.5 22.5 60 44 28 60 60 76 38.5 97.5 8 60Z" />
        <path d="M112 60 81.5 22.5 60 44 92 60 60 76 81.5 97.5 112 60Z" />
      </g>
    </svg>
  );
}
