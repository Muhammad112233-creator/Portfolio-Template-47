/**
 * -------------------------------------------------------------------
 *  Everything editable lives here.
 *  Swap these values and the whole site follows.
 * -------------------------------------------------------------------
 */

export const site = {
  name: 'Halden',
  legalName: 'Halden Studio',
  tagline: 'Independent creative & digital studio',
  description:
    'Halden is an award-winning creative studio in Lahore building fast, distinctive websites and brand systems for companies that have outgrown their current ones.',
  url: 'https://halden.studio',
  locale: 'en',
  email: 'hello@halden.studio',
  phone: '+92 42 3577 0148',
  phoneHref: '+924235770148',
  address: {
    street: '14-C, Gulberg III',
    city: 'Lahore',
    country: 'Pakistan',
    postalCode: '54660',
  },
  founded: '2012',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/halden.studio', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/halden-studio', icon: 'linkedin' },
    { label: 'Behance', href: 'https://behance.net/haldenstudio', icon: 'behance' },
  ],
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Works', href: '/works' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact us', href: '/contact' },
  { label: 'Blog', href: '/blog' },
] as const;

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
export const hero = {
  headline: [
    'We',
    'design',
    'digital',
    'experiences',
    'that',
    'finally',
    'match',
    'the',
    'ambition',
    'behind',
    'the',
    'brand.',
  ],
  scrollCue: 'Scroll to explore',
  awards: [
    { label: 'Awwwards', short: 'Awwwards', href: 'https://www.awwwards.com/' },
    { label: 'CSS Design Awards', short: 'CSSDA', href: 'https://www.cssdesignawards.com/' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  Manifesto — the statement band below the hero                      */
/* ------------------------------------------------------------------ */
export const manifesto = {
  plate: {
    caption: 'Ayesha Siddiqui',
    role: 'Founder & Strategy',
    since: '2012',
  },
  lead:
    'We believe a website is not a poster you can scroll. It is a room a stranger walks into, and they should understand within thirty seconds what you make, who it is for, and why it is different.',
  body: [
    'Halden was founded on a simple frustration: too much good work was being presented badly. Companies with real substance were shipping templates with their logo dropped in, and paying for it. We started the studio to prove the opposite — that strategy, design and engineering belong to the same conversation, and that the people who understand your business should be the ones building it.',
    'Thirteen years later we are six people in Lahore, shipping about six projects a year. We cap the work deliberately. It means we turn down more briefs than we accept, and it means the person who answers your email is the person who will do the job.',
    'What follows on this page is the process, the work, and the people who made it. Scroll slowly — it was built to be read, not skimmed.',
  ],
  facts: [
    { k: 'Founded', v: '2012' },
    { k: 'Based in', v: 'Lahore, PK' },
    { k: 'Projects / year', v: '6' },
    { k: 'Awards & mentions', v: '40+' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  Why us — the four scrubbed steps                                   */
/* ------------------------------------------------------------------ */
export type WhyStep = {
  number: string;
  caption?: [string, string];
  copy?: string;
  align: 'left' | 'right';
};

export const whyUs: { steps: WhyStep[] } = {
  steps: [
    {
      number: '40+',
      caption: ['International awards & mentions', '(Awwwards, CSSDA, FWA)'],
      align: 'left',
    },
    {
      number: '210+',
      caption: ['Projects shipped', '(across 12 countries)'],
      align: 'right',
    },
    {
      number: '13+',
      caption: ['Years in practice', '(design · code · motion)'],
      align: 'left',
    },
    {
      number: 'WHY US?',
      copy: 'Halden is an independent studio in Lahore. For thirteen years we have worked with founders, in-house teams and family-run companies — pairing strategy and art direction with front-end engineering so the finished site behaves as well as it looks. No hand-offs, no filler, no templates.',
      align: 'right',
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Clients                                                            */
/* ------------------------------------------------------------------ */
export const clients = {
  title: 'Trusted by the bold',
  intro:
    'From neighbourhood roasters to listed manufacturers — we work with teams who care how their product is presented.',
  list: [
    'Northwind Coffee',
    'Otto Motors',
    'Vela Studio',
    'Kaya Wellness',
    'Sable Hotels',
    'Lumen Optics',
    'Field & Form',
    'Tidal Records',
    'Aster Ceramics',
    'Volta Energy',
    'Cedar & Stone',
    'Morrow Publishing',
    'Pallas Architecture',
    'Hearth Bakery',
    'Rune Games',
    'Meridian Bank',
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */
export const services = {
  eyebrow: 'What we do?',
  titles: [
    'Websites',
    'Product Design',
    'E-commerce',
    'UI/UX Design',
    'Brand Identity',
    'Creative Direction',
    'Interior Design',
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  Works                                                              */
/* ------------------------------------------------------------------ */
export type Project = {
  slug: string;
  index: string;
  title: string;
  client: string;
  categories: string[];
  year: string;
  award?: string;
  cover: string;
  excerpt: string;
  body: string[];
  services: string[];
  accent: string;
};

export const projects: Project[] = [
  {
    slug: 'otto-motors',
    index: '01',
    title: 'Otto Motors',
    client: 'Otto Motors',
    categories: ['Product Design', 'Web Development'],
    year: '2025',
    award: 'Awwwards — Site of the Day',
    cover: '/assets/img/works/otto-motors.jpg',
    excerpt:
      'A configurator-led site for a family-owned engine builder — the first time their catalogue could be understood without a phone call.',
    body: [
      'Otto had thirty years of engineering and one page on the internet. The brief was blunt: explain the machines, then sell the parts.',
      'We rebuilt the catalogue around a parts-first search, then wrote a configurator that lets a workshop spec an engine in eleven steps and drop a printable sheet straight into their inbox.',
      'The site ships in under 40kb of JavaScript on the critical path. On a 3G connection in Lahore it is still usable in nine seconds.',
    ],
    services: ['Product Design', 'Web Development', 'Design System'],
    accent: '#f7c02f',
  },
  {
    slug: 'northwind-coffee',
    index: '02',
    title: 'Northwind Coffee',
    client: 'Northwind Coffee',
    categories: ['E-commerce', 'Brand Design'],
    year: '2025',
    award: 'CSS Design Awards — Special Kudos',
    cover: '/assets/img/works/northwind-coffee.jpg',
    excerpt:
      'A roaster with four cafes and one very good product needed a store that felt like the room you drink it in.',
    body: [
      'Northwind sells whole beans, subscriptions and a very small number of ceramicware. We built a storefront where the product photography does the selling and the interface stays out of the way.',
      'Subscriptions are managed from a single page instead of five. Repeat purchase rate moved 31% in the first quarter after launch.',
    ],
    services: ['E-commerce', 'Brand Design', 'Art Direction'],
    accent: '#e2703a',
  },
  {
    slug: 'kaya-wellness',
    index: '03',
    title: 'Kaya Wellness',
    client: 'Kaya Wellness',
    categories: ['Brand Identity', 'Digital Product'],
    year: '2024',
    award: 'Awwwards — Honourable Mention',
    cover: '/assets/img/works/kaya-wellness.jpg',
    excerpt:
      'A clinic app that had to feel calm without being vague — the hardest brief we took last year.',
    body: [
      'Most health products in this category shout. Kaya asked for the opposite, and the entire identity is built on restraint: one typeface, two colours, a lot of white.',
      'We ran weekly clinics with actual patients before drawing a single screen, which is why the booking flow now takes four taps instead of eleven.',
    ],
    services: ['Brand Identity', 'Digital Product', 'UX Research'],
    accent: '#7c9a88',
  },
  {
    slug: 'tidal-records',
    index: '04',
    title: 'Tidal Records',
    client: 'Tidal Records',
    categories: ['Website Design', 'Development'],
    year: '2024',
    award: 'CSS Winner — Star Award',
    cover: '/assets/img/works/tidal-records.jpg',
    excerpt:
      'A label with two decades of catalogue and no way to browse it.',
    body: [
      'We designed an archive that behaves like a record shop — crates you pull, sleeves you flip, a search that understands catalogue numbers as well as titles.',
      'Every release page can be embedded, bought and shared without leaving the archive.',
    ],
    services: ['Website Design', 'Development', 'Motion Design'],
    accent: '#2f6f8f',
  },
  {
    slug: 'sable-hotels',
    index: '05',
    title: 'Sable Hotels',
    client: 'Sable Hotels',
    categories: ['Strategy & Creative', 'Website'],
    year: '2024',
    award: 'Awwwards — W. Honours',
    cover: '/assets/img/works/sable-hotels.jpg',
    excerpt:
      'Three properties, three personalities, one booking flow that had to survive all of them.',
    body: [
      'We gave each house its own palette and typography while keeping a shared spine: the reservation engine, the availability calendar and the concierge desk.',
      'Direct bookings rose 18% over the following season without a change to their advertising budget.',
    ],
    services: ['Strategy', 'Art Direction', 'Website Design'],
    accent: '#8d6b4f',
  },
  {
    slug: 'lumen-optics',
    index: '06',
    title: 'Lumen Optics',
    client: 'Lumen Optics',
    categories: ['UI/UX Design', 'E-commerce'],
    year: '2023',
    award: 'CSSDA — Best of Best',
    cover: '/assets/img/works/lumen-optics.jpg',
    excerpt:
      'Spectacles frames, four hundred of them, each one needing to be understood on its own.',
    body: [
      'We built a frame finder that starts from face shape rather than fashion category, then hands the shopper a short list instead of a grid of four hundred.',
      'The checkout was rebuilt to a single column. Conversion on mobile moved from 1.4% to 4.1%.',
    ],
    services: ['UI/UX Design', 'E-commerce', 'Design System'],
    accent: '#b6a58c',
  },
  {
    slug: 'aster-ceramics',
    index: '07',
    title: 'Aster Ceramics',
    client: 'Aster Ceramics',
    categories: ['Brand Design', 'E-commerce'],
    year: '2023',
    award: 'CSSDA — Special Kudos',
    cover: '/assets/img/works/aster-ceramics.jpg',
    excerpt:
      'Eleven people, one kiln, and a waiting list that had grown to nine months.',
    body: [
      'Aster sells seconds through a newsletter because they had no way to sell them in public. We built the shop, the archive of sold pieces and the story behind the workshop.',
      'The waiting list dropped to four months and the studio now sells more in two weeks than in the previous year.',
    ],
    services: ['Brand Design', 'E-commerce', 'Photography Direction'],
    accent: '#c05a44',
  },
  {
    slug: 'volta-energy',
    index: '08',
    title: 'Volta Energy',
    client: 'Volta Energy',
    categories: ['Brand Identity', 'Website Design'],
    year: '2022',
    award: 'CSSDA — Special Kudos',
    cover: '/assets/img/works/volta-energy.jpg',
    excerpt:
      'Solar installers selling to homeowners who did not know the word photovoltaic.',
    body: [
      'We replaced the jargon with plain language and the brochure with a calculator that works out what a roof would save in a year.',
      'The identity needed to survive on a van, a roof and a phone screen, so it was designed at three sizes before it was designed at one.',
    ],
    services: ['Brand Identity', 'Website Design', 'Motion Design'],
    accent: '#f0a830',
  },
  {
    slug: 'meridian-bank',
    index: '09',
    title: 'Meridian Bank',
    client: 'Meridian Bank',
    categories: ['Website', 'Accessibility'],
    year: '2022',
    award: 'Awwwards — Site of the Day',
    cover: '/assets/img/works/meridian-bank.jpg',
    excerpt:
      'A regional bank with eleven million customers and a website nobody could finish using.',
    body: [
      'We audited every one of the 214 journeys on the old site and threw away 160 of them. The new site has 54 and they are all tested monthly with real customers.',
      'It is fully keyboard navigable and passes WCAG 2.2 AA, which is now printed on the homepage rather than buried in a footer.',
    ],
    services: ['UX Research', 'Design System', 'Frontend Engineering'],
    accent: '#3f5d78',
  },
  {
    slug: 'cedar-and-stone',
    index: '10',
    title: 'Cedar & Stone',
    client: 'Cedar & Stone',
    categories: ['Interior Design', 'Website'],
    year: '2021',
    award: 'CSS Winner — Star Award',
    cover: '/assets/img/works/cedar-and-stone.jpg',
    excerpt:
      'An architecture practice whose portfolio was hiding behind a slideshow that took nine seconds to load.',
    body: [
      'We rebuilt the portfolio around the drawing set: plans, sections and materials, zoomable, with the photographs as a consequence rather than the headline.',
      'The studio now wins two out of three briefs by referral, and both referrers quoted the website.',
    ],
    services: ['Interior Design', 'Website', 'Art Direction'],
    accent: '#7a6a55',
  },
];

/* ------------------------------------------------------------------ */
/*  Awards                                                             */
/* ------------------------------------------------------------------ */
export type Award = {
  date: string;
  label: string;
  title: string;
  href: string;
  thumb: string;
};

export const awards: Award[] = [
  { date: '2025-09-14', label: 'Site of the Day', title: 'Otto Motors', href: '/works/otto-motors', thumb: '/assets/img/works/otto-motors.jpg' },
  { date: '2025-04-02', label: 'Special Kudos', title: 'Northwind Coffee', href: '/works/northwind-coffee', thumb: '/assets/img/works/northwind-coffee.jpg' },
  { date: '2024-11-18', label: 'Star Award', title: 'Tidal Records', href: '/works/tidal-records', thumb: '/assets/img/works/tidal-records.jpg' },
  { date: '2024-06-09', label: 'Honourable Mention', title: 'Kaya Wellness', href: '/works/kaya-wellness', thumb: '/assets/img/works/kaya-wellness.jpg' },
  { date: '2023-10-25', label: 'W. Honours', title: 'Sable Hotels', href: '/works/sable-hotels', thumb: '/assets/img/works/sable-hotels.jpg' },
  { date: '2023-05-12', label: 'Best of Best', title: 'Lumen Optics', href: '/works/lumen-optics', thumb: '/assets/img/works/lumen-optics.jpg' },
  { date: '2022-12-01', label: 'Special Kudos', title: 'Aster Ceramics', href: '/works/aster-ceramics', thumb: '/assets/img/works/aster-ceramics.jpg' },
  { date: '2022-03-21', label: 'Site of the Day', title: 'Meridian Bank', href: '/works/meridian-bank', thumb: '/assets/img/works/meridian-bank.jpg' },
  { date: '2021-08-14', label: 'Star Award', title: 'Volta Energy', href: '/works/volta-energy', thumb: '/assets/img/works/volta-energy.jpg' },
  { date: '2020-11-06', label: 'Honourable Mention', title: 'Cedar & Stone', href: '/works/cedar-and-stone', thumb: '/assets/img/works/cedar-and-stone.jpg' },
];

/* ------------------------------------------------------------------ */
/*  Blog                                                               */
/* ------------------------------------------------------------------ */
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tag: string;
  cover: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: 'the-cost-of-a-template',
    title: 'The hidden cost of starting from a template',
    excerpt:
      'Templates get you to a first draft in an afternoon. They also get you to a website that looks like everyone else. Here is what we think about the trade.',
    date: '2026-10-02',
    readingTime: '6 min',
    tag: 'Opinion',
    cover: '/assets/img/blog/cost-of-a-template.svg',
    body: [
      'There is a version of this conversation where a template is simply efficient. You have a deadline, a budget and a list of features. You pick the closest thing, change the logo and the colours, and you are live by Friday.',
      'That works, until it does not. The tell is not visual — plenty of templates look sharp. The tell is structural. Everything is the same because the template did not know anything about your business, and the only way to find out is to spend the first month undoing decisions someone else made.',
      'We started Halden on the opposite bet. Every project starts with the same three questions: what does this company actually sell, who has to understand it, and what should happen in the next thirty seconds after someone arrives. The answers are usually boring and specific, and they are what makes a website feel like it belongs to you.',
      'Templates are not the enemy. They are a tool. But they are a tool for producing a thing quickly, not for producing the right thing. And the difference between those two is the whole job.',
    ],
  },
  {
    slug: 'motion-that-means-something',
    title: 'Motion that means something',
    excerpt:
      'Most website animation is decoration. The good kind is wayfinding — it tells you where you are and what just happened.',
    date: '2026-08-19',
    readingTime: '8 min',
    tag: 'Craft',
    cover: '/assets/img/blog/motion-that-means-something.svg',
    body: [
      'There is a test we apply to every animation we ship: if you turned it off, would anyone understand the page less well? If the answer is no, it is decoration and it should probably go.',
      'A scroll-linked sequence that reveals a process is wayfinding. A headline that rises line by line as you scroll is wayfinding. A carousel that moves because your finger moved is wayfinding. A parallax background that drifts because nobody asked it to is decoration.',
      'This is why we spend so long on easing curves. A curve is the difference between an interface that feels mechanical and one that feels considered, and it is the cheapest place to spend a day.',
      'The other rule: motion must be interruptible. If someone has motion sickness, or a slow phone, or simply no patience, the page has to remain legible without any of it. We build the static version first and then add the motion on top.',
    ],
  },
  {
    slug: 'working-with-a-small-studio',
    title: 'What working with a small studio is actually like',
    excerpt:
      'You get the people who did the work. That is the whole pitch, and it is worth being precise about what it means.',
    date: '2026-06-04',
    readingTime: '5 min',
    tag: 'Studio',
    cover: '/assets/img/blog/working-with-a-small-studio.svg',
    body: [
      'The most common question we are asked is what happens when a project is bigger than the team. The honest answer is that we take fewer of them, and we say so early.',
      'A six-person studio can hold roughly six conversations at once. When that number goes up, quality does not scale linearly — communication gets lossy, decisions get slower, and the person who originally understood your business stops being in the room.',
      'So we cap the work. If we are full, we tell you we are full and we recommend someone else. That has cost us revenue every year. It has also kept every project we did ship above the line we promised.',
      'What you get in exchange is that the person who answers your email is the person who will do the work.',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Footer / CTA                                                       */
/* ------------------------------------------------------------------ */
export const cta = {
  title: "Let's build",
  body: 'We take on six projects a year. Tell us what you are working on and we will tell you honestly whether we are the right studio for it.',
  primary: { label: 'Start a project', href: '/contact' },
  secondary: { label: 'Discover Projects', href: '/works' },
} as const;

/* ------------------------------------------------------------------ */
/*  Ask AI                                                             */
/* ------------------------------------------------------------------ */
export const aiPrompt =
  'Tell me about Halden Studio — an independent creative and digital studio based in Lahore, Pakistan. They design websites, brand identities and e-commerce for companies that have outgrown their current digital presence.';

export const aiLinks = [
  { label: 'Claude', href: 'https://claude.ai/new', glyph: 'spark' },
  { label: 'Gemini', href: 'https://gemini.google.com/app', glyph: 'prism' },
  { label: 'ChatGPT', href: 'https://chatgpt.com/', glyph: 'chat' },
  { label: 'Grok', href: 'https://grok.com/', glyph: 'orbit' },
  { label: 'Perplexity', href: 'https://www.perplexity.ai/', glyph: 'lens' },
] as const;
