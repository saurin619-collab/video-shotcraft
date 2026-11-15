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
    captions: ['US Fed ke *minutes* 18 Nov ko aayenge', 'Waller bole: December mein *rate hike*', 'Hawkish signal = yields *5% ke upar*'],
  },
  {
    n: 2, label: 'CRUDE OIL', style: 'C', heading: 'CRUDE PE NAZAR',
    cards: [
      { top: 'BRENT CRUDE', main: '~$97', sub: 'per barrel', tone: 'gold' },
      { top: 'NOV KA 1st WEEK', main: '−13%', sub: 'tez girawat', tone: 'green' },
      { top: 'FRIDAY', main: 'PHIR UPAR', sub: 'West Asia attacks', tone: 'red' },
      { top: 'IRAN', main: '7 SHARTEIN', sub: 'deal ke liye', tone: 'blue' },
    ],
    captions: ['Brent crude *$97* ke aas-paas', 'US–Iran *tension* se phir tezi', 'Crude upar = India ke liye *pressure*'],
  },
  {
    n: 3, label: 'FII ACTIVITY', style: 'A', photo: 'portrait',
    kicker: 'FII NET BUYING • 2–13 NOV', big: '', bigTone: 'green', trend: 'up',
    counter: { to: 84290, prefix: '₹', suffix: ' CR' },
    chips: ['Sirf 9 sessions mein', '2 mahine selling ke baad', '2026 outflow: ₹3L cr → ₹2.1L cr'],
    captions: ['FIIs ki *zabardast wapsi*', '9 sessions mein *₹84,290 crore*', 'Expert: abhi *tactical* turn hai, structural nahi'],
  },
  {
    n: 4, label: 'IPO WEEK', style: 'C', heading: '3 IPOs • ₹10,000 CR+',
    cards: [
      { top: 'CRYSTAL CROP • 18 NOV', main: '₹259–272', sub: 'price band • mainboard', tone: 'green' },
      { top: 'MAHANADI COALFIELDS', main: '~₹9,500 CR', sub: '19–23 Nov • Coal India subsidiary', tone: 'gold' },
      { top: 'WATRANA RENTALS • SME', main: '₹232–245', sub: 'price band • 19 Nov', tone: 'blue' },
    ],
    captions: ['Primary market *full busy*', '*Mahanadi Coalfields*: ~₹9,500 crore ka issue', 'Kaunsa IPO apply karoge? *Comment karo*'],
  },
  {
    n: 5, label: 'RUPEE', style: 'A', photo: 'desk',
    kicker: 'USD / INR • FRIDAY CLOSE', big: '₹94.19', bigTone: 'red', trend: 'down',
    chips: ['7 paise kamzor', 'Dollar mazboot', 'Equities mein weakness'],
    captions: ['Rupee *94.19* pe band hua', 'Dollar *mazboot*, rupee kamzor', 'Rupee girega to *FII flows* pe asar'],
  },
  {
    n: 6, label: 'US–IRAN', style: 'B',
    lines: [{ t: 'STRAIT OF' }, { t: 'HORMUZ' }, { t: 'MEIN TANKERS', red: true }, { t: 'PE BLAST', red: true }],
    bullets: ['IRGC claim: 2 tankers mines se takraye', 'Bahrain ne Iranian attacks roke', 'Trump: naval blockade jaari rahega'],
    captions: ['West Asia mein *tension* barkarar', 'Hormuz ke paas *2 tankers* mein aag', 'Trump: provocation nahi to *attacks ruk sakte*'],
  },
  {
    n: 7, label: 'INDIA DATA', style: 'C', heading: 'DATA CALENDAR',
    cards: [
      { top: '16 NOV • MON', main: 'WPI', sub: 'October inflation', tone: 'red' },
      { top: '16 NOV • MON', main: 'TRADE DATA', sub: 'merchandise • Oct', tone: 'blue' },
      { top: '16 NOV • MON', main: 'AUTO SALES', sub: 'passenger vehicles', tone: 'green' },
      { top: '20 NOV • THU', main: 'FOREX + INFRA', sub: 'reserves • core output', tone: 'gold' },
    ],
    captions: ['Monday ko *WPI inflation* aur trade data', 'Saath mein *PV sales* bhi', '20 Nov: *forex reserves* aur infra output'],
  },
  {
    n: 8, label: 'GLOBAL CUES', style: 'A', photo: 'portrait',
    kicker: 'GLOBAL DATA THIS WEEK', big: 'GLOBAL', bigTone: 'gold', trend: 'up',
    chips: ['JAPAN • GDP', 'US • Retail Sales', 'UK & EU • Inflation', 'US • Jobs Data'],
    captions: ['Duniya bhar se *bada data*', 'Japan GDP, *US retail sales*', 'UK–EU *inflation* aur US jobs'],
  },
  {
    n: 9, label: 'NVIDIA', style: 'B',
    lines: [{ t: 'NVIDIA RESULTS' }, { t: '= AI TRADE KA', red: true }, { t: 'ASLI TEST', red: true }],
    bullets: ['AI stocks ki valuation pe sawal', 'Correction aaya to Indian IT pe asar', 'Copper prices pe bhi nazar'],
    captions: ['*Nvidia earnings* pe poori duniya ki nazar', 'AI mein correction = *risk-off* mood', 'Indian *IT stocks* pe direct asar'],
  },
  {
    n: 10, label: 'CORPORATE ACTION', style: 'C', heading: 'STOCK-SPECIFIC ACTION',
    cards: [
      { top: 'DIVIDEND', main: 'Record dates', tone: 'green' },
      { top: 'BONUS', main: 'Free shares', tone: 'gold' },
      { top: 'SPLIT', main: 'Face value', tone: 'blue' },
      { top: 'BUYBACK', main: 'Ex-dates', tone: 'red' },
    ],
    captions: ['Apne stocks ke *corporate actions* check karo', 'Dividend, bonus, split ki *record date*', 'Inse *stock-specific* moves aate hain'],
  },
];
