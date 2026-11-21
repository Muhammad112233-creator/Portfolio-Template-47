import type { Metadata } from 'next';

import CtaFooter from '@/components/sections/CtaFooter';
import PageHeader from '@/components/ui/PageHeader';
import { socialIcons } from '@/components/ui/SocialIcons';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start a project with Halden. We take on six projects a year and reply to everything within one working day.',
  alternates: { canonical: '/contact' },
};

const budget = ['Under $10k', '$10k – $25k', '$25k – $60k', '$60k +', 'Not sure yet'];
const timing = ['As soon as possible', 'Next 1–2 months', 'Next quarter', 'Just exploring'];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="Contact"
        title="Tell us what you are working on."
        intro="We take on six projects a year, so there is room. The more specific you are about the problem, the more useful our first reply will be."
      />

      <section className="bg-paper px-[clamp(20px,9.27vw,9.27%)] pb-[clamp(60px,9vw,140px)]">
        <div className="grid gap-[clamp(36px,5vw,90px)] lg:grid-cols-[1.35fr_1fr]">
          {/* ---------------------------------------------- form */}
          <form
            action="https://formspree.io/f/your-form-id"
            method="POST"
            className="grid gap-[clamp(20px,2.4vw,32px)]"
          >
            <div className="grid gap-[clamp(20px,2.4vw,32px)] sm:grid-cols-2">
              <Field label="Your name" name="name" placeholder="Ayesha Siddiqui" required />
              <Field label="Email" name="email" type="email" placeholder="you@company.com" required />
              <Field label="Company" name="company" placeholder="Company name" />
              <Field label="Phone" name="phone" placeholder="+92 300 0000000" />
            </div>

            <Field label="What are you building?" name="message" placeholder="A few sentences about the project, the audience and what is not working today." required multiline />

            <fieldset>
              <legend className="mono-label text-ink/45">Budget</legend>
              <div className="mt-3 flex flex-wrap gap-[8px]">
                {budget.map((b) => (
                  <label key={b} className="cursor-pointer">
                    <input type="radio" name="budget" value={b} className="peer sr-only" />
                    <span className="inline-block rounded-full border border-ink/15 px-[15px] py-[8px] text-[14px] text-ink/70 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-accent peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mono-label text-ink/45">Timing</legend>
              <div className="mt-3 flex flex-wrap gap-[8px]">
                {timing.map((t) => (
                  <label key={t} className="cursor-pointer">
                    <input type="radio" name="timing" value={t} className="peer sr-only" />
                    <span className="inline-block rounded-full border border-ink/15 px-[15px] py-[8px] text-[14px] text-ink/70 transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-accent peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="pt-2">
              <button type="submit" className="primary-cta">
                Send it
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <path
                    d="M5 12h14m0 0-6-6m6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <p className="mt-3 text-[13px] text-ink/50">
                We reply within one working day — even if the answer is “not us”.
              </p>
            </div>
          </form>

          {/* ---------------------------------------------- details */}
          <aside className="lg:pl-[clamp(10px,2vw,40px)]">
            <div className="border-t border-ink/10 pt-[clamp(20px,2.4vw,32px)]">
              <h2 className="mono-label text-ink/45">Direct</h2>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 block text-[clamp(20px,2.2vw,32px)] font-bold tracking-[-0.03em] text-ink transition-opacity hover:opacity-60"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phoneHref}`}
                className="mt-1 block font-mono text-[14px] text-body/70 transition-opacity hover:opacity-60"
              >
                {site.phone}
              </a>
            </div>

            <div className="mt-[clamp(26px,3vw,44px)] border-t border-ink/10 pt-[clamp(20px,2.4vw,32px)]">
              <h2 className="mono-label text-ink/45">Studio</h2>
              <address className="mt-3 text-[16px] not-italic leading-[1.7] text-body/80">
                {site.address.street}
                <br />
                {site.address.city} {site.address.postalCode}
                <br />
                {site.address.country}
              </address>
              <p className="mt-3 text-[14px] leading-[1.6] text-ink/50">
                Visits by appointment. The good chai is on us.
              </p>
            </div>

            <div className="mt-[clamp(26px,3vw,44px)] border-t border-ink/10 pt-[clamp(20px,2.4vw,32px)]">
              <h2 className="mono-label text-ink/45">Elsewhere</h2>
              <div className="mt-3 flex flex-wrap gap-[18px]">
                {site.socials.map((s) => {
                  const Icon = socialIcons[s.icon];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-[8px] text-[15px] text-ink/70 transition-colors hover:text-ink"
                    >
                      <Icon className="h-[17px] w-[17px]" />
                      {s.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-[clamp(26px,3vw,44px)] border-t border-ink/10 pt-[clamp(20px,2.4vw,32px)]">
              <h2 className="mono-label text-ink/45">Not a project?</h2>
              <p className="mt-3 text-[15px] leading-[1.65] text-body/75">
                We take on the occasional workshop, and we are happy to talk to students
                and junior designers most weeks. Say hello.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <CtaFooter />
    </>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  multiline,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const shared =
    'mt-2 w-full border border-ink/12 bg-paper px-[14px] py-[12px] text-[15px] text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none transition-colors';

  return (
    <label className="block">
      <span className="mono-label text-ink/45">{label}</span>
      {multiline ? (
        <textarea name={name} rows={5} placeholder={placeholder} required={required} className={`${shared} resize-y`} />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className={shared}
        />
      )}
    </label>
  );
}
