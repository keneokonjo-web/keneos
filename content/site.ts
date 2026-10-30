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
  { n: '03', slug: 'wardrobe', title: 'Wardrobe', sub: 'Personal style, indexed', img: 'tag', pos: '50% 40%' },
  { n: '04', slug: 'character', title: 'Character', sub: 'The clothing line', img: 'shutters', pos: '50% 30%' },
  { n: '05', slug: 'work', title: 'Work', sub: 'Professional', img: 'doors', pos: '50% 35%' },
  { n: '06', slug: 'projects', title: 'Projects', sub: 'Personal', img: 'stencil', pos: '50% 50%' },
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
export const notes = [
  { slug: 'note-001', n: '001', date: '2026', title: 'Field note one', excerpt: 'First entry. Replace with your own writing.', body: ['Write the entry here. One paragraph per line in content/site.ts.'] },
  { slug: 'note-002', n: '002', date: '2026', title: 'Field note two', excerpt: 'Second entry. Short, personal, unpolished.', body: ['Write the entry here.'] },
  { slug: 'note-003', n: '003', date: '2026', title: 'Field note three', excerpt: 'Third entry.', body: ['Write the entry here.'] },
];

// ---------- Wardrobe ----------
export const looks = [
  { n: '01', name: 'Look 01', note: 'Pinstripe, oversized, headwear low.' },
  { n: '02', name: 'Look 02', note: 'Description to be added.' },
  { n: '03', name: 'Look 03', note: 'Description to be added.' },
  { n: '04', name: 'Look 04', note: 'Description to be added.' },
  { n: '05', name: 'Look 05', note: 'Description to be added.' },
  { n: '06', name: 'Look 06', note: 'Description to be added.' },
];

// ---------- Character (clothing line) ----------
export const specimens = [
  { n: '001', name: 'Jacket 001', fit: 'Oversized', fabric: 'To be added', colour: 'Black, pinstripe', sizes: 'To be added', status: 'Not yet released' },
  { n: '002', name: 'Trouser 001', fit: 'Wide', fabric: 'To be added', colour: 'Black, pinstripe', sizes: 'To be added', status: 'Not yet released' },
  { n: '003', name: 'Headwear 001', fit: 'Low', fabric: 'To be added', colour: 'Silver', sizes: 'One size', status: 'Not yet released' },
];

// ---------- Work and Projects ----------
export const work = [
  { n: '01', title: 'Project title', role: 'Role', year: '2026' },
  { n: '02', title: 'Project title', role: 'Role', year: '2026' },
  { n: '03', title: 'Project title', role: 'Role', year: '2026' },
  { n: '04', title: 'Project title', role: 'Role', year: '2026' },
];

export const projects = [
  { n: '001', title: 'Personal project', note: 'One line on what it is.', year: '2026' },
  { n: '002', title: 'Personal project', note: 'One line on what it is.', year: '2026' },
  { n: '003', title: 'Personal project', note: 'One line on what it is.', year: '2026' },
];

// ---------- Parked copy (not shown right now) ----------
// Hero paragraph, kept for later:
export const parked = {
  heroParagraph: 'A personal collection, on my own terms. Photography and film, field notes, a wardrobe and a clothing line named Character. Original by nature.',
};
