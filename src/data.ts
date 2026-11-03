export const GH = 'https://github.com/Meghamittal0920';
const live = (repo: string) => `https://meghamittal0920.github.io/${repo}/`;

export const profile = {
  name: 'Megha Mittal',
  role: 'Frontend Developer',
  company: 'Wiley',
  location: 'Noida, India',
  email: 'meghamittal563@gmail.com',
  bio: "I build clean, responsive digital experiences with HTML, JavaScript, SQL & SAP — and cinematic anime tribute websites the internet keeps starring.",
  stats: { followers: 437, repos: 32, stars: 544 },
  socials: [
    { label: 'GitHub', href: GH },
    { label: 'Instagram', href: 'https://www.instagram.com/meghamittal92000' },
    { label: 'Threads', href: 'https://www.threads.net/@meghamittal92000' },
    { label: 'Email', href: 'mailto:meghamittal563@gmail.com' }
  ]
};

export type Project = {
  repo: string;
  title: string;
  kanji: string;
  blurb: string;
  stack: string[];
  stars: number;
  accent: string;
  shot: string;
  live?: string;
  // Client work has no public repo; the label replaces the Source link.
  client?: string;
};

export const projects: Project[] = [
  {
    repo: 'madaramusic',
    title: 'MADARA — Official Site',
    kanji: 'うちはマダラ',
    blurb: 'The official release site for “MADARA” — Ez Mil with Eminem feat. Neil Kaplan & Hideyoshi. Hood-off reveal, glitching kanji, blood-red mood.',
    stack: ['Client work', 'Motion', 'Responsive'],
    stars: 0,
    accent: '#ff4655',
    shot: 'shots/madaramusic.webp',
    live: 'https://www.madaramusic.com/',
    client: 'Interscope Records'
  },
  {
    repo: 'itachi',
    title: 'Itachi',
    kanji: 'うちはイタチ',
    blurb: 'Cinematic Uchiha experience — crows, sharingan and a scroll-driven story. My most-starred build.',
    stack: ['JavaScript', 'GSAP', 'CSS'],
    stars: 175,
    accent: '#e2383f',
    shot: 'shots/itachi.webp',
    live: live('itachi')
  },
  {
    repo: 'Naruto-SageMode',
    title: 'Naruto · Sage Mode',
    kanji: '仙人モード',
    blurb: 'Awwwards-style scroll experience with a thunder-crack transformation into Sage Mode.',
    stack: ['HTML', 'GSAP', 'CSS'],
    stars: 72,
    accent: '#ff7a1a',
    shot: 'shots/Naruto-SageMode.webp',
    live: live('Naruto-SageMode')
  },
  {
    repo: 'Zoro-King-of-hell',
    title: 'Zoro · King of Hell',
    kanji: '地獄の王',
    blurb: 'Three swords, one page. A dark, cinematic tribute to the future King of Hell.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    stars: 23,
    accent: '#a78bfa',
    shot: 'shots/Zoro-King-of-hell.webp',
    live: live('Zoro-King-of-hell')
  },
  {
    repo: 'Minato',
    title: 'Minato',
    kanji: '波風ミナト',
    blurb: 'Flying Raijin speed — a motion-heavy tribute with lightning-fast transitions.',
    stack: ['JavaScript', 'GSAP'],
    stars: 22,
    accent: '#facc15',
    shot: 'shots/Minato.webp',
    live: live('Minato')
  },
  {
    repo: 'Gojo',
    title: 'Gojo',
    kanji: '六眼',
    blurb: 'Infinity and the Six Eyes — an interactive, glowing Jujutsu Kaisen landing page.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    stars: 21,
    accent: '#60a5fa',
    shot: 'shots/Gojo.webp',
    live: live('Gojo')
  },
  {
    repo: 'Goku',
    title: 'Goku · Ultra Instinct',
    kanji: '身勝手の極意',
    blurb: 'Ultra Instinct mastered — a fiery hero with a scroll-to-transform reveal.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    stars: 14,
    accent: '#fb923c',
    shot: 'shots/Goku.webp',
    live: live('Goku')
  },
  {
    repo: 'JJK-Sakuna',
    title: 'Sukuna',
    kanji: '両面宿儺',
    blurb: 'Enter the realm — the King of Curses rendered with lightning and dread.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    stars: 13,
    accent: '#c084fc',
    shot: 'shots/JJK-Sakuna.webp',
    live: live('JJK-Sakuna')
  },
  {
    repo: 'Demon-Slayer-Yorichi-Kokoshibo-',
    title: 'Sun & Moon',
    kanji: '継国縁壱',
    blurb: 'Yoriichi vs Kokushibo — twin-brother duality told through a split-screen story.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    stars: 13,
    accent: '#f87171',
    shot: 'shots/Demon-Slayer-Yorichi-Kokoshibo-.webp',
    live: live('Demon-Slayer-Yorichi-Kokoshibo-')
  },
  {
    repo: 'Megha-Deskfolio',
    title: 'Deskfolio',
    kanji: '机',
    blurb: 'A cosy, editable desk-notebook portfolio with stickers, pens and page flips.',
    stack: ['React', 'TypeScript', 'Vite'],
    stars: 11,
    accent: '#34d399',
    shot: 'shots/Megha-Deskfolio.webp',
    live: live('Megha-Deskfolio')
  }
];

export const moreRepos = [
  { repo: 'One-Piece-3D-Website', lang: 'TypeScript · Three.js', stars: 17 },
  { repo: 'solo-leveling-', lang: 'JavaScript', stars: 6 },
  { repo: 'Madara', lang: 'JavaScript', stars: 3 },
  { repo: 'kira', lang: 'HTML', stars: 3 },
  { repo: 'pikachu', lang: 'JavaScript', stars: 8 },
  { repo: 'aot', lang: 'JavaScript', stars: 5 },
  { repo: 'Dragon-ball', lang: 'JavaScript', stars: 5 },
  { repo: 'isagi', lang: 'HTML', stars: 4 },
  { repo: 'luffys_gear_2nd', lang: 'JavaScript', stars: 3 },
  { repo: 'Zenitsu', lang: 'HTML', stars: 3 }
];

export const skills = [
  'React.js', 'JavaScript', 'TypeScript', 'GSAP', 'Framer Motion',
  'Three.js', 'HTML5', 'CSS3', 'SQL', 'SAP'
];

export const experience = [
  {
    when: 'Now',
    title: 'Frontend Developer',
    org: 'Wiley',
    text: 'Building clean, responsive interfaces for a global publishing and education company — HTML, JavaScript, SQL and SAP in production.'
  },
  {
    when: '2026',
    title: 'Official release site — MADARA',
    org: 'madaramusic.com',
    text: 'Front-end for the MADARA single site — Ez Mil with Eminem feat. Neil Kaplan & Hideyoshi, released through Interscope.'
  },
  {
    when: '2022 — now',
    title: 'Open-source anime web builds',
    org: 'GitHub · 32 repos',
    text: 'Cinematic, scroll-driven tribute sites with GSAP, Three.js and canvas — 544 stars and 437 followers along the way.'
  }
];
