// Per-venture workspace themes. WAYKON and Fieldwork values were read from the live sites
// (waykongroup.com, fieldwork.estate). Plot42 and WAYKON Media are provisional until real
// references are supplied (the Plot42 URL given did not resolve; WAYKON Media has no site yet).
export type Venture = {
  slug: 'waykon' | 'plot42' | 'fieldwork' | 'media';
  name: string;
  tag: string;
  status: string;
  url?: string;
  urlLabel?: string;
  theme: Record<string, string>;
  fontHead: string;
  headWeight: number;
  headTracking: string;
  provisional?: boolean;
  blurb: string;
};

export const VENTURES: Venture[] = [
  {
    slug: 'waykon',
    name: 'WAYKON Holdings',
    tag: 'Group',
    status: 'Brand and intent. Not registered.',
    url: 'https://waykongroup.com',
    urlLabel: 'waykongroup.com',
    blurb: 'The intended parent of the group: identity, structure, and what has to happen to make it real.',
    theme: { '--v-bg': '#f9f9f8', '--v-surface': '#ffffff', '--v-ink': '#111111', '--v-muted': '#6b6b68', '--v-line': 'rgba(17,17,17,.12)', '--v-accent': '#550000', '--v-on-accent': '#ffffff' },
    fontHead: 'var(--font-serif)',
    headWeight: 300,
    headTracking: '-0.01em',
  },
  {
    slug: 'plot42',
    name: 'Plot42',
    tag: '42 · Events and clothing',
    status: 'Live. Next event: summer.',
    url: 'https://fourtwo-alpha.vercel.app',
    urlLabel: 'fourtwo-alpha.vercel.app',
    provisional: true,
    blurb: 'Lagos youth lifestyle events, with limited clothing releases.',
    theme: { '--v-bg': '#0c0c0c', '--v-surface': '#161616', '--v-ink': '#f1eee6', '--v-muted': '#8c8a84', '--v-line': 'rgba(241,238,230,.12)', '--v-accent': '#d65a43', '--v-on-accent': '#0c0c0c' },
    fontHead: 'var(--font-grotesk)',
    headWeight: 700,
    headTracking: '-0.04em',
  },
  {
    slug: 'fieldwork',
    name: 'Fieldwork',
    tag: 'Websites and listing systems',
    status: 'Just started. No paying clients yet.',
    url: 'https://fieldwork.estate',
    urlLabel: 'fieldwork.estate',
    blurb: 'Websites and enquiry systems for property businesses.',
    theme: { '--v-bg': '#f3f2ed', '--v-surface': '#fbfaf6', '--v-ink': '#121212', '--v-muted': '#6e6d68', '--v-line': 'rgba(18,18,18,.14)', '--v-accent': '#2339c9', '--v-on-accent': '#ffffff' },
    fontHead: 'var(--font-grotesk)',
    headWeight: 700,
    headTracking: '-0.06em',
  },
  {
    slug: 'media',
    name: 'WAYKON Media',
    tag: 'Nigeria · Instagram and YouTube',
    status: 'Not operating yet. Planning.',
    provisional: true,
    blurb: 'Grounded content on Nigerian political, economic and social issues. Edited in CapCut.',
    theme: { '--v-bg': '#121212', '--v-surface': '#1b1b1b', '--v-ink': '#ece9e2', '--v-muted': '#8f8d88', '--v-line': 'rgba(236,233,226,.13)', '--v-accent': '#c8c2b4', '--v-on-accent': '#121212' },
    fontHead: 'var(--font-serif)',
    headWeight: 300,
    headTracking: '-0.01em',
  },
];

export const ventureBySlug = (s: string) => VENTURES.find((v) => v.slug === s);

export const AREAS = [
  { id: 'personal', label: 'Personal' },
  { id: 'school', label: 'School' },
  { id: 'health', label: 'Health' },
  { id: 'finance', label: 'Money' },
  ...VENTURES.map((v) => ({ id: `business:${v.slug}`, label: v.name })),
];
export const areaLabel = (id?: string) => AREAS.find((a) => a.id === id)?.label ?? (id || 'Personal');
