// Everything you are likely to edit lives here: page names, wording, images, and placeholders.
// Images are files in /public/img. Swap a file, or change the name below.
// Entries marked placeholder are structure only. Replace them with real work.

export const brand = {
  name: 'KJO',
  mark: 'DesignedByKJO',
  tagline: 'Original by nature',
  // Add a real address to show a contact link. Left empty on purpose.
  email: '',
  instagram: '',
};

export type PageEntry = {
  n: string;
  slug: string;
  title: string;
  sub: string;
  img: string;
  pos?: string; // object-position for the cropped strip
};

export const pages: PageEntry[] = [
  { n: '01', slug: 'visuals', title: 'Visuals', sub: 'Photography and film', img: 'cup', pos: '50% 60%' },
  { n: '02', slug: 'field-notes', title: 'Field Notes', sub: 'The journal', img: 'wall', pos: '50% 40%' },
  { n: '03', slug: 'work', title: 'Work', sub: 'Professional', img: 'doors', pos: '50% 35%' },
  { n: '04', slug: 'projects', title: 'Projects', sub: 'Personal', img: 'stencil', pos: '50% 50%' },
  { n: '05', slug: 'designedbykjo', title: 'DesignedByKJO', sub: 'The clothing line', img: 'shutters', pos: '50% 30%' },
];

export const heroImages = ['cup', 'shutters', 'tag', 'wall', 'doors', 'stencil'];

export const principles = [
  'Original', 'Personal', 'Archive', 'Signature', 'Character', 'Distinction',
  'Discipline', 'Work', 'Specimen', 'Index', 'Direction', 'Principles',
];

export const phrases = [
  'Original by nature',
  'Direction and distinction',
  'On my own terms',
  'A personal collection',
  'My personal standard',
];

// ---------- Visuals ----------
export const plates = [
  { n: '001', img: 'cup', title: 'Untitled', span: 'a' },
  { n: '002', img: 'shutters', title: 'Untitled', span: 'b' },
  { n: '003', img: 'tag', title: 'Untitled', span: 'c' },
  { n: '004', img: 'doors', title: 'Untitled', span: 'd' },
  { n: '005', img: 'wall', title: 'Untitled', span: 'e' },
  { n: '006', img: 'stencil', title: 'Untitled', span: 'f' },
];

export const film = {
  title: 'Short film',
  status: 'In production',
  note: 'Title, synopsis and the film itself go here. Paste a YouTube or Vimeo link into content/site.ts to embed it.',
  embed: '', // e.g. https://www.youtube.com/embed/XXXX
};

export const favourites = {
  films: ['Title to be added', 'Title to be added', 'Title to be added', 'Title to be added'],
  shows: ['Title to be added', 'Title to be added', 'Title to be added', 'Title to be added'],
  watched: ['Documentary to be added', 'Documentary to be added', 'Video to be added'],
};

// ---------- Field Notes ----------
// Template entries. Replace the text. One string per paragraph in `body`.
export const notes = [
  {
    slug: 'note-001', n: '001', topic: 'Field Notes / Topic', title: 'Title of the first note',
    sub: 'A one or two line description of what this note is about, written in your own voice.',
    date: '30 October 2026', read: '2 minute read',
    disclaimer: 'Written by Kene. Template text: replace this with your own disclaimer.',
    body: [
      'This is template text for the body of the note. It runs as a straight set of paragraphs with no subheadings, in your own words, about whatever the topic is.',
      'A second paragraph goes here. Keep the lines short, keep the thought honest, and let it run as long as it needs to.',
      'A third paragraph closes the note.',
    ],
  },
  {
    slug: 'note-002', n: '002', topic: 'Field Notes / Topic', title: 'Title of the second note',
    sub: 'A one or two line description goes here.',
    date: '30 October 2026', read: '2 minute read',
    disclaimer: 'Written by Kene. Template text: replace this with your own disclaimer.',
    body: ['Template text for the body of the note.', 'A second paragraph goes here.'],
  },
  {
    slug: 'note-003', n: '003', topic: 'Field Notes / Topic', title: 'Title of the third note',
    sub: 'A one or two line description goes here.',
    date: '30 October 2026', read: '1 minute read',
    disclaimer: 'Written by Kene. Template text: replace this with your own disclaimer.',
    body: ['Template text for the body of the note.'],
  },
];

// ---------- Home hero ----------
// Photos that move through the hero. Add file names from /public/img (without .jpg).
export const heroPhotos = ['p-0680', 'p-0685', 'p-0697', 'p-0699', 'p-0700'];

// ---------- Visuals: trips ----------
// Each trip links to its own gallery page at /visuals/<slug>. Add file names to `images` when you have them.
export const trips = [
  { slug: 'egypt', title: 'EGYPT', cover: 'v-camel', text: 'Description to be added.', images: [] as string[] },
  { slug: 'vietnam', title: 'VIETNAM', cover: 'v-sail', text: 'Description to be added.', images: [] as string[] },
  { slug: 'nigeria', title: 'NIGERIA', cover: 'p-0681', text: 'Description to be added.', images: [] as string[] },
  { slug: 'uae', title: 'UNITED ARAB EMIRATES', cover: 'p-0683', text: 'Description to be added.', images: [] as string[] },
];

// General text blocks that sit in the Visuals grid. Write your own.
export const blocks = [
  { n: '1.1–1.4', title: 'TITLE TO BE ADDED', kind: 'Photography, Motion', text: 'Description to be added. A short paragraph about the work in this part of the grid, in your own words.' },
  { n: '2.1–2.4', title: 'TITLE TO BE ADDED', kind: 'Photography, Motion', text: 'Description to be added. A short paragraph about the work in this part of the grid, in your own words.' },
  { n: '3.1–3.3', title: 'TITLE TO BE ADDED', kind: 'Photography', text: 'Description to be added. A short paragraph about the work in this part of the grid, in your own words.' },
  { n: '4.1–4.4', title: 'TITLE TO BE ADDED', kind: 'Photography', text: 'Description to be added. A short paragraph about the work in this part of the grid, in your own words.' },
];

// ---------- Work index ----------
// K-001 is the parent group and shows in red. Edit names, links and text here.
export type Company = {
  code: string; slug: string; name: string; red?: boolean;
  url?: string; host?: string; preview?: string; internal?: string;
  meta: string[]; text: string[];
};
export const companies: Company[] = [
  { code: 'K-001', slug: 'waykon-group', name: 'WayKON Group', red: true, url: 'https://waykongroup.com', host: 'waykongroup.com', preview: 'site-waykon',
    meta: ['Index: K-001', 'Type: Parent group', 'Site: waykongroup.com'],
    text: ['Description to be added. A short paragraph about the group, in your own words.', 'A second short paragraph goes here.'] },
  { code: 'K-002', slug: 'fieldwork', name: 'Fieldwork', url: 'https://fieldwork.estate', host: 'fieldwork.estate', preview: 'site-fieldwork',
    meta: ['Index: K-002', 'Type: Company', 'Site: fieldwork.estate'],
    text: ['Practical technology for estate agencies, brokerages and property developers.', 'Description to be added. A second short paragraph goes here.'] },
  { code: 'K-003', slug: '42-events', name: '42 Events', url: 'https://fortytwo-alpha-eta.vercel.app', host: 'fortytwo-alpha-eta.vercel.app', preview: '',
    meta: ['Index: K-003', 'Type: Company', 'Site: fortytwo-alpha-eta.vercel.app'],
    text: ['Description to be added. A short paragraph about 42 Events, in your own words.', 'A second short paragraph goes here.'] },
  { code: 'K-004', slug: 'designedbykjo', name: 'DesignedByKJO', internal: '/designedbykjo', meta: [], text: [] },
];

// ---------- Parked copy (not shown right now) ----------
// Hero paragraph, kept for later:
export const parked = {
  heroParagraph: 'A personal collection, on my own terms. Photography and film, field notes, a wardrobe and a clothing line named Character. Original by nature.',
};
