// All on-screen copy lives here. Source: news brief supplied by the creator (week of 16–20 Nov 2026).
// Captions use *word* to mark the highlighted keyword.

export type Card = { top: string; main: string; sub?: string; tone?: 'red' | 'green' | 'gold' | 'blue' };
export type Line = { t: string; red?: boolean };

export type Point =
  | {
      n: number; label: string; style: 'A'; photo: 'desk' | 'portrait';
      kicker: string; big: string; bigTone: 'red' | 'green' | 'gold';
      counter?: { to: number; prefix: string; suffix: string };
      trend: 'up' | 'down'; chips: string[]; captions: string[];
    }
  | { n: number; label: string; style: 'B'; lines: Line[]; bullets: string[]; captions: string[] }
  | { n: number; label: string; style: 'C'; heading: string; cards: Card[]; captions: string[] };

export const PINNED = 'IS HAFTE KE 10 MARKET TRIGGERS';

export const POINTS: Point[] = [
  {
    n: 1, label: 'FOMC MINUTES', style: 'A', photo: 'desk',
    kicker: 'US FED • 18 NOV (BUDHVAAR)', big: 'RATE HIKE?', bigTone: 'red', trend: 'up',
    chips: ['Waller: Dec mein hike', '0.50% hike bhi possible', 'Next FOMC: 8–9 Dec'],
    captions: ['Number 1 — *Fed minutes!*', '18 Nov ko aayenge...', 'December mein *rate hike* ka ishaara!'],
  },
  {
    n: 2, label: 'CRUDE OIL', style: 'C', heading: 'CRUDE PE NAZAR',
    cards: [
      { top: 'BRENT CRUDE', main: '~$97', sub: 'per barrel', tone: 'gold' },
      { top: 'NOV KA 1st WEEK', main: '−13%', sub: 'tez girawat', tone: 'green' },
      { top: 'FRIDAY', main: 'PHIR UPAR', sub: 'West Asia attacks', tone: 'red' },
      { top: 'IRAN', main: '7 SHARTEIN', sub: 'deal ke liye', tone: 'blue' },
    ],
    captions: ['Number 2 — *crude*', 'Brent *$97* ke paas...', 'US–Iran tension se *phir tezi!*'],
  },
  {
    n: 3, label: 'FII ACTIVITY', style: 'A', photo: 'portrait',
    kicker: 'FII NET BUYING • 2–13 NOV', big: '', bigTone: 'green', trend: 'up',
    counter: { to: 84290, prefix: '₹', suffix: ' CR' },
    chips: ['Sirf 9 sessions mein', '2 mahine selling ke baad', '2026 outflow: ₹3L cr → ₹2.1L cr'],
    captions: ['Number 3 — *achhi khabar!*', '*FII wapas* aa gaye...', '9 sessions mein *₹84,000 crore!*'],
  },
  {
    n: 4, label: 'IPO WEEK', style: 'C', heading: '3 IPOs • ₹10,000 CR+',
    cards: [
      { top: 'CRYSTAL CROP • 18 NOV', main: '₹259–272', sub: 'price band • mainboard', tone: 'green' },
      { top: 'MAHANADI COALFIELDS', main: '~₹9,500 CR', sub: '19–23 Nov • Coal India subsidiary', tone: 'gold' },
      { top: 'WATRANA RENTALS • SME', main: '₹232–245', sub: 'price band • 19 Nov', tone: 'blue' },
    ],
    captions: ['Number 4 — *IPO ki baarish!*', '*₹10,000 crore* se zyada...', '*Mahanadi Coalfields* sabse bada!'],
  },
  {
    n: 5, label: 'RUPEE', style: 'A', photo: 'desk',
    kicker: 'USD / INR • FRIDAY CLOSE', big: '₹94.19', bigTone: 'red', trend: 'down',
    chips: ['7 paise kamzor', 'Dollar mazboot', 'Equities mein weakness'],
    captions: ['Number 5 — *rupya...*', '*94.19* pe', 'Dollar *mazboot!*'],
  },
  {
    n: 6, label: 'US–IRAN', style: 'B',
    lines: [{ t: 'STRAIT OF' }, { t: 'HORMUZ' }, { t: 'MEIN TANKERS', red: true }, { t: 'PE BLAST', red: true }],
    bullets: ['IRGC claim: 2 tankers mines se takraye', 'Bahrain ne Iranian attacks roke', 'Trump: naval blockade jaari rahega'],
    captions: ['Number 6 — Hormuz ke paas', 'Tankers mein *dhamaake!*', 'Ye tension *halke mein mat lena*'],
  },
  {
    n: 7, label: 'INDIA DATA', style: 'C', heading: 'DATA CALENDAR',
    cards: [
      { top: '16 NOV • MON', main: 'WPI', sub: 'October inflation', tone: 'red' },
      { top: '16 NOV • MON', main: 'TRADE DATA', sub: 'merchandise • Oct', tone: 'blue' },
      { top: '16 NOV • MON', main: 'AUTO SALES', sub: 'passenger vehicles', tone: 'green' },
      { top: '20 NOV • THU', main: 'FOREX + INFRA', sub: 'reserves • core output', tone: 'gold' },
    ],
    captions: ['Number 7 — *Monday* ko', '*Wholesale mehngai*, trade data', 'aur *auto sales*'],
  },
  {
    n: 8, label: 'GLOBAL CUES', style: 'A', photo: 'portrait',
    kicker: 'GLOBAL DATA THIS WEEK', big: 'GLOBAL', bigTone: 'gold', trend: 'up',
    chips: ['JAPAN • GDP', 'US • Retail Sales', 'UK & EU • Inflation', 'US • Jobs Data'],
    captions: ['Number 8 — *Japan GDP*', '*US retail sales*', 'aur Europe ki *mehngai*'],
  },
  {
    n: 9, label: 'NVIDIA', style: 'B',
    lines: [{ t: 'NVIDIA RESULTS' }, { t: '= AI TRADE KA', red: true }, { t: 'ASLI TEST', red: true }],
    bullets: ['AI stocks ki valuation pe sawal', 'Correction aaya to Indian IT pe asar', 'Copper prices pe bhi nazar'],
    captions: ['Number 9 — *Nvidia* ke nateeje!', 'AI mein *correction* aaya...', 'to *IT shares* bhi hilenge!'],
  },
  {
    n: 10, label: 'CORPORATE ACTION', style: 'C', heading: 'STOCK-SPECIFIC ACTION',
    cards: [
      { top: 'DIVIDEND', main: 'Record dates', tone: 'green' },
      { top: 'BONUS', main: 'Free shares', tone: 'gold' },
      { top: 'SPLIT', main: 'Face value', tone: 'blue' },
      { top: 'BUYBACK', main: 'Ex-dates', tone: 'red' },
    ],
    captions: ['Aur number 10 — apne shares ki', '*dividend* aur *bonus*', 'record dates *zaroor check karo*'],
  },
];
