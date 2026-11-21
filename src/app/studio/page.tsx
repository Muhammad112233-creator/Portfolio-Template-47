import type { Metadata } from 'next';

import CtaFooter from '@/components/sections/CtaFooter';
import PageHeader from '@/components/ui/PageHeader';
import { clients, services, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Studio',
  description:
    'Halden is an independent creative and digital studio in Lahore working with founders, in-house teams and family-run companies.',
  alternates: { canonical: '/studio' },
};

const team = [
  {
    name: 'Ayesha Siddiqui',
    role: 'Founder · Strategy',
    note: 'Started Halden in 2012 after eight years in publishing. Runs the first conversation and the last one.',
  },
  {
    name: 'Bilal Anwar',
    role: 'Founder · Design',
    note: 'Art direction and identity. Believes a logo should survive on a van, a roof and a phone screen.',
  },
  {
    name: 'Hafsa Riaz',
    role: 'Design Director',
    note: 'Owns the design system, the grid, and the argument about the grid.',
  },
  {
    name: 'Usman Tariq',
    role: 'Technical Director',
    note: 'Front-end architecture, performance budgets, and a low tolerance for 400kb hero images.',
  },
  {
    name: 'Mariam Yousaf',
    role: 'Motion',
    note: 'Easing curves, scroll choreography, and making sure the static version still works.',
  },
  {
    name: 'Zainab Iqbal',
    role: 'Production',
    note: 'Keeps six projects from colliding with each other. Answers the email in an hour.',
  },
];

const timeline = [
  { year: '2012', text: 'Two people, one room in Gulberg, and a single client that believed us.' },
  { year: '2015', text: 'First international award. Started writing our own front-end instead of using themes.' },
  { year: '2018', text: 'Moved to design systems. Discovered we could build for four clients at once.' },
  { year: '2021', text: 'Capped the studio at six projects a year. Revenue dipped; quality did not.' },
  { year: '2024', text: 'Introduced the in-house 3D pipeline. No more stock footage.' },
  { year: '2026', text: 'Still six projects a year. Still answering the email ourselves.' },
];

const capabilities = [
  'Brand strategy',
  'Naming',
  'Visual identity',
  'Art direction',
  'Design systems',
  'Web design',
  'Front-end engineering',
  'Motion design',
  'E-commerce',
  'Product design',
  'UX research',
  'Accessibility audits',
];

export default function StudioPage() {
  return (
    <>
      <PageHeader
        kicker="The studio"
        title="Six people, six projects a year."
        intro="Halden is an independent studio in Lahore. We work with founders, in-house teams and family-run companies who have outgrown their current website but do not want to become a software company to fix it."
      />

      {/* story */}
      <section className="bg-paper px-[clamp(20px,9.27vw,9.27%)] pb-[clamp(50px,7vw,120px)]">
        <div className="grid gap-[clamp(30px,5vw,90px)] md:grid-cols-[1fr_1.4fr]">
          <h2
            className="text-ink"
            style={{ fontSize: 'clamp(24px,3vw,48px)', fontWeight: 700, letterSpacing: '-0.04em' }}
          >
            Why we stay small
          </h2>
          <div className="space-y-[1.4em] text-[clamp(16px,1.3vw,19px)] leading-[1.75] text-body/85">
            <p>
              A studio of six can hold roughly six conversations at once. When that
              number goes up, communication gets lossy and the person who understood
              your business stops being in the room. So we cap the work, we say so early,
              and we turn down more projects than we take.
            </p>
            <p>
              The trade is simple: the person who answers your email is the person who
              will do the work. No account managers, no relay race between a design
              studio and an agency and a development shop.
            </p>
            <p>
              We are not trying to be the biggest studio in the region. We are trying to
              be the one you would send to a customer.
            </p>
          </div>
        </div>
      </section>

      {/* numbers */}
      <section className="bg-ink px-[clamp(20px,9.27vw,9.27%)] py-[clamp(50px,7vw,110px)]">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-[clamp(28px,4vw,60px)] md:grid-cols-4">
          {[
            { k: 'Founded', v: site.founded },
            { k: 'Awards', v: '40+' },
            { k: 'Projects', v: '210+' },
            { k: 'Countries', v: '12' },
          ].map((s) => (
            <div key={s.k}>
              <dt className="mono-label text-paper/40">{s.k}</dt>
              <dd
                className="mt-3 text-paper"
                style={{ fontSize: 'clamp(32px,4.6vw,78px)', fontWeight: 700, letterSpacing: '-0.045em' }}
              >
                {s.v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* team */}
      <section className="bg-paper px-[clamp(20px,9.27vw,9.27%)] py-[clamp(50px,7vw,120px)]">
        <h2
          className="text-ink"
          style={{ fontSize: 'clamp(26px,3.4vw,56px)', fontWeight: 700, letterSpacing: '-0.045em' }}
        >
          Who you will actually work with
        </h2>
        <ul className="mt-[clamp(28px,4vw,64px)] grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <li key={member.name} className="bg-paper p-[clamp(20px,2.4vw,36px)]">
              <div className="flex items-center gap-[12px]">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-[13px] font-bold text-ink">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
                <div>
                  <p className="text-[16px] font-bold text-ink">{member.name}</p>
                  <p className="mono-label text-ink/45">{member.role}</p>
                </div>
              </div>
              <p className="mt-4 text-[14.5px] leading-[1.65] text-body/75">{member.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* capabilities */}
      <section className="bg-mist px-[clamp(20px,9.27vw,9.27%)] py-[clamp(50px,7vw,110px)]">
        <div className="grid gap-[clamp(24px,4vw,70px)] md:grid-cols-[1fr_1.4fr]">
          <h2
            className="text-ink"
            style={{ fontSize: 'clamp(24px,3vw,48px)', fontWeight: 700, letterSpacing: '-0.04em' }}
          >
            What we do
          </h2>
          <ul className="flex flex-wrap gap-[10px]">
            {services.titles.map((c) => (
              <li
                key={c}
                className="rounded-full border border-ink/15 bg-paper px-[16px] py-[9px] text-[14px] font-medium text-ink/85"
              >
                {c}
              </li>
            ))}
            {capabilities
              .filter((c) => !services.titles.includes(c as never))
              .map((c) => (
                <li
                  key={`c-${c}`}
                  className="rounded-full border border-ink/12 px-[16px] py-[9px] text-[14px] text-ink/60"
                >
                  {c}
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* timeline */}
      <section className="bg-paper px-[clamp(20px,9.27vw,9.27%)] py-[clamp(50px,7vw,120px)]">
        <h2
          className="text-ink"
          style={{ fontSize: 'clamp(26px,3.4vw,56px)', fontWeight: 700, letterSpacing: '-0.045em' }}
        >
          A short history
        </h2>
        <ol className="mt-[clamp(28px,4vw,60px)] border-t border-ink/10">
          {timeline.map((t) => (
            <li
              key={t.year}
              className="grid gap-2 border-b border-ink/10 py-[clamp(16px,2vw,26px)] md:grid-cols-[140px_1fr] md:gap-10"
            >
              <span className="font-mono text-[13px] tracking-[0.06em] text-ink/45">{t.year}</span>
              <span className="text-[clamp(15px,1.25vw,19px)] leading-[1.6] text-body/85">{t.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* clients recap */}
      <section className="bg-paper px-[clamp(20px,9.27vw,9.27%)] pb-[clamp(50px,7vw,120px)]">
        <h2
          className="text-ink"
          style={{ fontSize: 'clamp(24px,3vw,48px)', fontWeight: 700, letterSpacing: '-0.04em' }}
        >
          {clients.title}
        </h2>
        <p className="mt-[clamp(18px,2vw,30px)] flex flex-wrap gap-x-[18px] gap-y-[10px] text-[clamp(15px,1.3vw,20px)] text-body/70">
          {clients.list.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </p>
      </section>

      <CtaFooter />
    </>
  );
}
