import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { POINTS, PINNED, Point, Card } from './data';
import { SEGS, STARTS, TOTAL as T, VO_LEAD } from './timing';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

const { fontFamily } = loadFont('normal', { weights: ['600', '700', '800', '900'], subsets: ['latin', 'latin-ext'] });
const FONT = `${fontFamily}, Inter, sans-serif`;

export const HOOK = SEGS[0];
export const CTA = SEGS[SEGS.length - 1];
export const TOTAL = T;

const RED = '#e01b24';
const GREEN = '#21c55d';
const GOLD = '#ffc531';
const BLUE = '#3b82f6';
const TONE: Record<string, string> = { red: RED, green: GREEN, gold: GOLD, blue: BLUE };

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ---------- shared pieces ----------

const Photo: React.FC<{ src: string; dur: number; from?: number; to?: number; origin?: string; style?: React.CSSProperties }> = ({
  src, dur, from = 1.06, to = 1.16, origin = '50% 35%', style,
}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [from, to], clamp);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', ...style }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`, transformOrigin: origin }} />
    </AbsoluteFill>
  );
};

const Hl: React.FC<{ text: string; color?: string }> = ({ text, color = GOLD }) => (
  <>
    {text.split(/(\*[^*]+\*)/).map((p, i) =>
      p.startsWith('*') ? <span key={i} style={{ color }}>{p.slice(1, -1)}</span> : <span key={i}>{p}</span>,
    )}
  </>
);

// Caption bar + pinned title, like the reference reels.
const Captions: React.FC<{ lines: string[]; dur: number; light?: boolean }> = ({ lines, dur, light }) => {
  const f = useCurrentFrame();
  const per = dur / lines.length;
  const i = Math.min(lines.length - 1, Math.floor(f / per));
  const local = f - i * per;
  const pop = spring({ frame: local, fps: 30, config: { damping: 14, stiffness: 220 } });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1450, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{
        fontFamily: FONT, fontWeight: 900, fontSize: 50, lineHeight: 1.15, color: light ? '#111' : '#fff', textAlign: 'center',
        maxWidth: 940, textTransform: 'uppercase', transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop,
        textShadow: light ? 'none' : '0 4px 18px rgba(0,0,0,.85), 0 0 2px #000',
      }}>
        <Hl text={lines[i]} color={light ? RED : GOLD} />
      </div>
      <div style={{ background: '#fff', color: '#000', fontFamily: FONT, fontWeight: 900, fontSize: 30, padding: '8px 22px', borderRadius: 6, boxShadow: '0 4px 14px rgba(0,0,0,.35)' }}>
        {PINNED}
      </div>
    </div>
  );
};

const Badge: React.FC<{ n: number; label: string }> = ({ n, label }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 10], [-420, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: 'absolute', top: 70, left: 50, display: 'flex', alignItems: 'stretch', transform: `translateX(${x}px)`, zIndex: 20 }}>
      <div style={{ background: RED, color: '#fff', fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: '6px 20px', borderRadius: '10px 0 0 10px' }}>
        {String(n).padStart(2, '0')}<span style={{ fontSize: 28, opacity: 0.8 }}>/10</span>
      </div>
      <div style={{ background: '#000', color: '#fff', fontFamily: FONT, fontWeight: 800, fontSize: 34, padding: '0 22px', display: 'flex', alignItems: 'center', borderRadius: '0 10px 10px 0', letterSpacing: 1 }}>
        {label}
      </div>
    </div>
  );
};

const Progress: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ position: 'absolute', top: 30, left: 50, right: 50, display: 'flex', gap: 8, zIndex: 20 }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < n ? RED : 'rgba(255,255,255,.35)' }} />
    ))}
  </div>
);

const Bubble: React.FC<{ size: number; top: number; delay?: number }> = ({ size, top, delay = 0 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - delay, fps: 30, config: { damping: 12 } });
  return (
    <div style={{
      position: 'absolute', top, left: '50%', width: size, height: size, marginLeft: -size / 2, borderRadius: '50%', overflow: 'hidden',
      border: '7px solid #fff', boxShadow: '0 12px 40px rgba(0,0,0,.5)', transform: `scale(${s})`, zIndex: 10,
    }}>
      <Img src={staticFile('img/portrait.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 30%', transform: 'scale(1.35)', transformOrigin: '50% 30%' }} />
    </div>
  );
};

// Deterministic candlestick chart that draws itself left→right.
const Chart: React.FC<{ trend: 'up' | 'down'; w: number; h: number }> = ({ trend, w, h }) => {
  const f = useCurrentFrame();
  const N = 34;
  let v = 50;
  const candles = Array.from({ length: N }).map((_, i) => {
    const r = Math.sin(i * 12.9898 + (trend === 'up' ? 1 : 7)) * 43758.5453;
    const noise = (r - Math.floor(r) - 0.5) * 9;
    const o = v;
    v = v + noise + (trend === 'up' ? 1.2 : -1.2);
    return { o, c: v, hi: Math.max(o, v) + 2.5, lo: Math.min(o, v) - 2.5 };
  });
  const all = candles.flatMap((c) => [c.hi, c.lo]);
  const mn = Math.min(...all), mx = Math.max(...all);
  const y = (val: number) => h - ((val - mn) / (mx - mn)) * h;
  const shown = interpolate(f, [4, 60], [0, N], clamp);
  const cw = w / N;
  return (
    <svg width={w} height={h} style={{ position: 'absolute', left: 0, bottom: 40, opacity: 0.28 }}>
      {candles.map((c, i) => i < shown && (
        <g key={i}>
          <line x1={i * cw + cw / 2} x2={i * cw + cw / 2} y1={y(c.hi)} y2={y(c.lo)} stroke={c.c >= c.o ? GREEN : RED} strokeWidth={3} />
          <rect x={i * cw + 4} width={cw - 8} y={y(Math.max(c.o, c.c))} height={Math.max(4, Math.abs(y(c.o) - y(c.c)))} fill={c.c >= c.o ? GREEN : RED} />
        </g>
      ))}
    </svg>
  );
};

const Counter: React.FC<{ to: number; prefix: string; suffix: string; color: string }> = ({ to, prefix, suffix, color }) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [8, 50], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return <span style={{ color }}>{prefix}{v.toLocaleString('en-IN')}{suffix}</span>;
};

// ---------- scene styles ----------

// A: split screen — infographic panel on top, presenter photo below.
const SceneA: React.FC<{ p: Extract<Point, { style: 'A' }>; dur: number }> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const bigS = spring({ frame: f - 6, fps: 30, config: { damping: 11, stiffness: 160 } });
  const color = TONE[p.bigTone];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <div style={{ position: 'absolute', top: 860, left: 0, right: 0, bottom: 0 }}>
        <Photo src={p.photo === 'desk' ? 'img/desk.jpg' : 'img/portrait.jpg'} dur={dur} origin={p.photo === 'desk' ? '35% 55%' : '50% 30%'} from={p.photo === 'desk' ? 1.5 : 1.05} to={p.photo === 'desk' ? 1.62 : 1.15} />
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.85) 100%)' }} />
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 860, overflow: 'hidden', background: 'radial-gradient(120% 90% at 50% 0%, #16233b 0%, #070b14 70%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <Chart trend={p.trend} w={1080} h={420} />
        <div style={{ position: 'absolute', top: 200, left: 60, right: 60, fontFamily: FONT }}>
          <div style={{ color: '#9fb3d1', fontWeight: 800, fontSize: 32, letterSpacing: 2, opacity: interpolate(f, [2, 10], [0, 1], clamp) }}>{p.kicker}</div>
          <div style={{ fontWeight: 900, fontSize: p.counter ? 128 : (p.big.length > 7 ? 124 : 150), lineHeight: 1.05, whiteSpace: 'nowrap', marginTop: 10, transform: `scale(${bigS})`, transformOrigin: 'left center', color, textShadow: `0 0 40px ${color}55` }}>
            {p.counter ? <Counter {...p.counter} color={color} /> : p.big}
            <span style={{ fontSize: 80, marginLeft: 16 }}>{p.trend === 'up' ? '▲' : '▼'}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 30 }}>
            {p.chips.map((c, i) => {
              const s = spring({ frame: f - 18 - i * 7, fps: 30, config: { damping: 13 } });
              return (
                <div key={c} style={{ background: 'rgba(255,255,255,.1)', border: '2px solid rgba(255,255,255,.25)', color: '#fff', fontWeight: 700, fontSize: 34, padding: '12px 22px', borderRadius: 14, transform: `translateY(${(1 - s) * 40}px)`, opacity: s }}>
                  {c}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 856, left: 0, right: 0, height: 8, background: RED }} />
      <Captions lines={p.captions} dur={dur} />
    </AbsoluteFill>
  );
};

// B: off-white text card with red underlined keywords (reference "ground realities" style).
const SceneB: React.FC<{ p: Extract<Point, { style: 'B' }>; dur: number }> = ({ p, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(90% 70% at 50% 40%, #f6f3ee 0%, #e2ddd5 100%)' }}>
      <Bubble size={230} top={190} />
      <div style={{ position: 'absolute', top: 470, left: '50%', width: 70, height: 6, marginLeft: -35, background: RED }} />
      <div style={{ position: 'absolute', top: 520, left: 50, right: 50, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 104, lineHeight: 1.08 }}>
        {p.lines.map((l, i) => {
          const s = spring({ frame: f - 4 - i * 6, fps: 30, config: { damping: 14 } });
          const ul = interpolate(f, [14 + i * 6, 26 + i * 6], [0, 100], clamp);
          return (
            <div key={i} style={{ color: l.red ? RED : '#111', transform: `translateY(${(1 - s) * 50}px)`, opacity: s }}>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                {l.t}
                {l.red && <span style={{ position: 'absolute', left: 0, bottom: 4, height: 8, width: `${ul}%`, background: RED }} />}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: 1090, left: 90, right: 90, display: 'flex', flexDirection: 'column', gap: 18, fontFamily: FONT }}>
        {p.bullets.map((b, i) => {
          const s = spring({ frame: f - 30 - i * 8, fps: 30, config: { damping: 14 } });
          return (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 38, fontWeight: 700, color: '#222', opacity: s, transform: `translateX(${(1 - s) * -60}px)` }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: RED, flexShrink: 0 }} />{b}
            </div>
          );
        })}
      </div>
      <Captions lines={p.captions} dur={dur} light />
    </AbsoluteFill>
  );
};

// C: dark maroon stage, face bubble on top, cards popping in (reference "bank cards" style).
const CardView: React.FC<{ c: Card; i: number; wide: boolean }> = ({ c, i, wide }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - 10 - i * 9, fps: 30, config: { damping: 11, stiffness: 170 } });
  const col = TONE[c.tone ?? 'gold'];
  return (
    <div style={{
      width: wide ? 900 : 440, minHeight: wide ? 0 : 230, background: 'linear-gradient(145deg, rgba(255,255,255,.14), rgba(255,255,255,.04))',
      border: `3px solid ${col}`, borderRadius: 26, padding: '22px 26px', fontFamily: FONT, color: '#fff', boxSizing: 'border-box',
      transform: `scale(${s}) translateY(${(1 - s) * 60}px)`, opacity: Math.min(1, s * 1.4), boxShadow: `0 10px 40px ${col}33`,
    }}>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 1.5, color: col }}>{c.top}</div>
      <div style={{ fontSize: wide ? 72 : 60, fontWeight: 900, lineHeight: 1.1, marginTop: 6 }}>{c.main}</div>
      {c.sub && <div style={{ fontSize: 28, fontWeight: 600, opacity: 0.85, marginTop: 6 }}>{c.sub}</div>}
    </div>
  );
};

const SceneC: React.FC<{ p: Extract<Point, { style: 'C' }>; dur: number }> = ({ p, dur }) => {
  const f = useCurrentFrame();
  const wide = p.cards.length === 3;
  const hs = spring({ frame: f - 4, fps: 30, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(100% 70% at 50% 30%, #5a0d12 0%, #22050a 60%, #0d0204 100%)' }}>
      <Bubble size={210} top={170} />
      <div style={{ position: 'absolute', top: 410, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 70, color: '#fff', transform: `scale(${hs})` }}>
        {p.heading}
      </div>
      <div style={{ position: 'absolute', top: 530, left: 0, right: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: wide ? 24 : 20 }}>
        {p.cards.map((c, i) => <CardView key={i} c={c} i={i} wide={wide} />)}
      </div>
      <Captions lines={p.captions} dur={dur} />
    </AbsoluteFill>
  );
};

// ---------- hook & CTA ----------

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = spring({ frame: f - 4, fps: 30, config: { damping: 10, stiffness: 180 } });
  const t2 = spring({ frame: f - 14, fps: 30, config: { damping: 9, stiffness: 200 } });
  const ul = interpolate(f, [24, 36], [0, 100], clamp);
  const flash = interpolate(f, [12, 14, 20], [0, 0.55, 0], clamp);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Photo src="img/desk.jpg" dur={HOOK} from={1.0} to={1.12} origin="40% 50%" />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,.2) 40%, rgba(0,0,0,.2) 60%, rgba(0,0,0,.9) 100%)' }} />
      <div style={{ position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', fontFamily: FONT }}>
        <div style={{ display: 'inline-block', background: RED, color: '#fff', fontWeight: 900, fontSize: 36, padding: '8px 24px', borderRadius: 8, letterSpacing: 2, opacity: t1 }}>
          16 – 20 NOV • MARKET ALERT
        </div>
        <div style={{ fontWeight: 900, fontSize: 92, color: '#fff', marginTop: 34, lineHeight: 1.05, transform: `scale(${t1})`, textShadow: '0 6px 30px #000' }}>
          IS HAFTE MARKET
        </div>
        <div style={{ fontWeight: 900, fontSize: 92, color: '#fff', lineHeight: 1.05, transform: `scale(${t1})`, textShadow: '0 6px 30px #000' }}>
          KO HILA DENGE
        </div>
        <div style={{ fontWeight: 900, fontSize: 136, whiteSpace: 'nowrap', color: GOLD, lineHeight: 1.05, marginTop: 10, transform: `scale(${t2})`, textShadow: '0 6px 30px #000' }}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            10 TRIGGERS
            <span style={{ position: 'absolute', left: 0, bottom: 6, height: 12, width: `${ul}%`, background: RED }} />
          </span>
        </div>
      </div>
      <AbsoluteFill style={{ background: '#fff', opacity: flash }} />
      <Captions lines={['*Ruko!* Scroll mat karna...', 'Ye *10 triggers* market ko hila sakte hain!']} dur={HOOK} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const a = spring({ frame: f - 4, fps: 30, config: { damping: 11 } });
  const b = spring({ frame: f - 22, fps: 30, config: { damping: 9, stiffness: 200 } });
  const pulse = 1 + 0.05 * Math.sin(f / 4);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Photo src="img/portrait.jpg" dur={CTA} from={1.05} to={1.14} origin="50% 30%" />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,.1) 45%, rgba(0,0,0,.92) 75%)' }} />
      <div style={{ position: 'absolute', top: 1080, left: 50, right: 50, textAlign: 'center', fontFamily: FONT }}>
        <div style={{ fontWeight: 900, fontSize: 64, color: '#fff', lineHeight: 1.1, transform: `scale(${a})` }}>
          AAPKE HISAAB SE <span style={{ color: GOLD }}>SABSE BADA</span> TRIGGER KAUNSA?
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, marginTop: 40, background: 'linear-gradient(90deg,#7c3aed,#db2777)', color: '#fff', fontWeight: 900, fontSize: 54, padding: '18px 40px', borderRadius: 60, transform: `scale(${b * pulse})` }}>
          COMMENT KARO
        </div>
        <div style={{ marginTop: 34, fontWeight: 900, fontSize: 46, color: GREEN, opacity: b }}>FOLLOW for daily market updates</div>
        <div style={{ marginTop: 40, fontWeight: 600, fontSize: 24, color: 'rgba(255,255,255,.7)' }}>
          Sirf educational purpose ke liye. Investment advice nahi hai — invest karne se pehle apne financial advisor se baat karein.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Voice-reactive equalizer pill: shows the presenter is speaking.
const VoiceBars: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const src = staticFile(`audio/vo/l${i}.wav`);
  const data = useAudioData(src);
  const vals = data && f >= VO_LEAD
    ? visualizeAudio({ fps, frame: f - VO_LEAD, audioData: data, numberOfSamples: 16 }).slice(1, 10)
    : new Array(9).fill(0);
  return (
    <div style={{ position: 'absolute', top: 72, right: 50, height: 62, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,.75)', padding: '0 18px', borderRadius: 31, zIndex: 25 }}>
      <div style={{ width: 14, height: 14, borderRadius: 7, background: RED, marginRight: 6 }} />
      {vals.map((v: number, k: number) => (
        <div key={k} style={{ width: 7, borderRadius: 4, background: '#fff', height: 6 + Math.min(38, Math.sqrt(v) * 110) }} />
      ))}
    </div>
  );
};

// ---------- timeline ----------

const Enter: React.FC<{ children: React.ReactNode; dir: number }> = ({ children, dir }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 8], [dir * 140, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sc = interpolate(f, [0, 8], [1.08, 1], clamp);
  const o = interpolate(f, [0, 5], [0, 1], clamp);
  return <AbsoluteFill style={{ transform: `translateX(${x}px) scale(${sc})`, opacity: o }}>{children}</AbsoluteFill>;
};

export const Reel: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence durationInFrames={HOOK}><Hook /><VoiceBars i={0} /></Sequence>
      {POINTS.map((p, i) => (
        <Sequence key={p.n} from={STARTS[i + 1]} durationInFrames={SEGS[i + 1]}>
          <Enter dir={i % 2 ? -1 : 1}>
            {p.style === 'A' ? <SceneA p={p} dur={SEGS[i + 1]} /> : p.style === 'B' ? <SceneB p={p} dur={SEGS[i + 1]} /> : <SceneC p={p} dur={SEGS[i + 1]} />}
            <VoiceBars i={i + 1} />
            <Progress n={p.n} />
            <Badge n={p.n} label={p.label} />
          </Enter>
        </Sequence>
      ))}
      <Sequence from={STARTS[SEGS.length - 1]} durationInFrames={CTA}><Enter dir={1}><Outro /><VoiceBars i={SEGS.length - 1} /></Enter></Sequence>

      {bgm && (
        <Audio src={staticFile('audio/bgm.mp3')}
          volume={(f) => interpolate(f, [0, 15, durationInFrames - 45, durationInFrames], [0, 0.16, 0.16, 0], clamp)} />
      )}
      <Sequence from={10}><Audio src={staticFile('audio/impact-cine.mp3')} volume={0.3} /></Sequence>
      {POINTS.map((p, i) => (
        <Sequence key={p.n} from={STARTS[i + 1] - 3} durationInFrames={30}>
          <Audio src={staticFile(i % 2 ? 'audio/swoosh-quick.mp3' : 'audio/whoosh-fast.mp3')} volume={0.4} />
        </Sequence>
      ))}
      <Sequence from={STARTS[SEGS.length - 1] - 3} durationInFrames={30}><Audio src={staticFile('audio/transition-snap.mp3')} volume={0.45} /></Sequence>
      {SEGS.map((_, i) => (
        <Sequence key={'vo' + i} from={STARTS[i] + VO_LEAD}><Audio src={staticFile(`audio/vo/l${i}.wav`)} volume={1} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
