export function Wordmark({
  className = '',
  markClassName = 'h-[19px] w-[19px]',
  textClassName = 'text-[17px] leading-none',
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-[7px] ${className}`}>
      <svg
        viewBox="0 0 48 48"
        className={markClassName}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M3 24 17.5 7.5 24 14 14 24 24 34 17.5 40.5 3 24Z" />
        <path d="M45 24 30.5 7.5 24 14 34 24 24 34 30.5 40.5 45 24Z" />
      </svg>
      <span className={`font-bold tracking-[-0.045em] ${textClassName}`}>Halden</span>
    </span>
  );
}

export default Wordmark;
