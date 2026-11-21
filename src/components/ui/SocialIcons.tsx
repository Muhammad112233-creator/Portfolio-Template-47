type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4v11H3v-11Zm6.5 0h3.8v1.5h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76v5.69h-4v-5.04c0-1.2-.02-2.75-1.75-2.75-1.76 0-2.03 1.3-2.03 2.66v5.13h-3.99v-11Z" />
    </svg>
  );
}

export function BehanceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8.4 5.3c1.94 0 3.4.6 3.4 2.6 0 1.1-.58 1.8-1.4 2.2 1.1.36 1.82 1.2 1.82 2.5 0 2.1-1.72 2.9-3.8 2.9H2.6V5.3h5.8Zm-.5 4.2c.86 0 1.32-.3 1.32-1.02 0-.78-.58-1-1.36-1H5.2v2.02h2.7Zm.2 4.2c.96 0 1.5-.34 1.5-1.1 0-.78-.6-1.1-1.5-1.1H5.2v2.2h2.9ZM17.6 10.2c2.2 0 3.8 1.6 3.8 4v.6h-5.5c.1 1 .8 1.6 1.8 1.6.8 0 1.3-.36 1.5-.9h2.1c-.36 1.8-1.7 2.8-3.7 2.8-2.3 0-3.9-1.6-3.9-4.1 0-2.4 1.6-4 3.9-4Zm1.3 3.2c-.1-.9-.6-1.5-1.4-1.5-.8 0-1.4.6-1.5 1.5h2.9Z" />
      <path d="M15.6 6.7h5.1v1.3h-5.1V6.7Z" />
    </svg>
  );
}

export const socialIcons = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  behance: BehanceIcon,
} as const;
