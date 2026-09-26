import { useEffect, useRef, useState, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════════
   CONFIG — edit these to personalise
══════════════════════════════════════════════════════════════════════ */
const HIM = "Anjan Bava";
const HIM2 = "Anjan";
const HER = "Mani";
const BDAY = new Date("2026-10-10T00:00:00"); // midnight Oct 10

/* ══════════════════════════════════════════════════════════════════════
   STYLES injected once
══════════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Great+Vibes&family=Inter:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy:   #05080f;
  --deep:   #080c18;
  --plum:   #110919;
  --wine:   #1c0c14;
  --rose:   #c8859a;
  --blush:  #e8bfc9;
  --gold:   #c9a84c;
  --silver: #b8c8d8;
  --ivory:  #f5f0e8;
  --dim:    rgba(245,240,232,0.65);
}

html, body { height: 100%; overflow: hidden; background: var(--navy); }

/* ── page system ── */
.bv-app { width: 100vw; height: 100svh; overflow: hidden; position: relative; background: var(--navy); font-family: 'Inter', sans-serif; color: var(--ivory); }
.bv-page { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1.5rem; overflow-y: auto; overflow-x: hidden; transition: opacity .8s ease, transform .8s cubic-bezier(.16,1,.3,1); }
.bv-page--hidden   { opacity: 0; pointer-events: none; transform: translateY(30px); }
.bv-page--visible  { opacity: 1; pointer-events: all; transform: translateY(0); }
.bv-page--leaving  { opacity: 0; pointer-events: none; transform: translateY(-30px); }

/* ── stars ── */
.bv-stars { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.bv-star  { position: absolute; border-radius: 50%; background: var(--ivory); }
@keyframes bvTwinkle { 0%,100%{opacity:.12;transform:scale(.6)} 50%{opacity:.9;transform:scale(1.3)} }

/* ── floating symbols ── */
.bv-floaters { position: fixed; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
.bv-floater  { position: absolute; bottom: -10%; opacity: 0; }
@keyframes bvFloat { 0%{opacity:0;transform:translateY(0) rotate(0)} 10%{opacity:.7} 90%{opacity:.3} 100%{opacity:0;transform:translateY(-110vh) rotate(70deg)} }

/* ── canvas fireworks ── */
.bv-fw { position: fixed; inset: 0; z-index: 2; pointer-events: none; }

/* ── nav arrow ── */
.bv-nav { position: fixed; bottom: 1.8rem; left: 50%; transform: translateX(-50%); z-index: 50; display: flex; flex-direction: column; align-items: center; gap: .5rem; }
.bv-nav-btn { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(201,168,76,.5); background: rgba(201,168,76,.08); color: var(--gold); font-size: 1.2rem; cursor: pointer; backdrop-filter: blur(10px); transition: all .3s ease; display: grid; place-items: center; }
.bv-nav-btn:hover { background: rgba(201,168,76,.2); transform: scale(1.1); }
.bv-nav-dots { display: flex; gap: .4rem; }
.bv-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(201,168,76,.3); transition: all .3s ease; }
.bv-dot--active { background: var(--gold); transform: scale(1.4); }

/* ── typography ── */
.f-display  { font-family: 'Playfair Display', Georgia, serif; }
.f-serif    { font-family: 'Cormorant Garamond', Georgia, serif; }
.f-script   { font-family: 'Great Vibes', cursive; }

/* ── countdown ── */
.bv-countdown { display: grid; grid-template-columns: repeat(4,1fr); gap: .8rem; margin: 2rem auto; max-width: 360px; }
.bv-cd-unit { padding: 1rem .5rem; border: 1px solid rgba(201,168,76,.25); border-radius: 14px; background: rgba(255,255,255,.05); backdrop-filter: blur(10px); text-align: center; }
.bv-cd-num  { display: block; font-family: 'Playfair Display',serif; font-size: clamp(2rem,7vw,3.5rem); color: var(--ivory); font-variant-numeric: tabular-nums; }
.bv-cd-lbl  { display: block; font: 700 .62rem/1 'Inter',sans-serif; color: var(--blush); letter-spacing: .12em; text-transform: uppercase; margin-top: .3rem; }

/* ── photo frame ── */
.bv-photo { border: 1px solid rgba(201,168,76,.35); border-radius: 12px; overflow: hidden; position: relative; }
.bv-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bv-photo-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: .6rem .8rem; background: linear-gradient(transparent, rgba(5,8,15,.85)); color: var(--dim); font: italic 400 .82rem/1.4 'Cormorant Garamond',serif; }
.bv-photo-placeholder { width: 100%; height: 100%; display: grid; place-items: center; background: rgba(255,255,255,.04); color: rgba(245,240,232,.25); font: 400 .75rem/1.5 'Inter',sans-serif; text-align: center; min-height: 200px; }

/* ── gallery ── */
.bv-gallery { display: grid; grid-template-columns: repeat(3,1fr); gap: .8rem; max-width: 760px; width: 100%; }
.bv-gallery .bv-photo { aspect-ratio: 3/4; }
@media(max-width:520px){ .bv-gallery { grid-template-columns: repeat(2,1fr); } }

/* ── buttons ── */
.bv-btn { padding: .8rem 2rem; border: 1px solid rgba(201,168,76,.6); border-radius: 999px; background: linear-gradient(120deg,rgba(201,168,76,.15),rgba(184,200,216,.12)); color: var(--ivory); font: 600 .82rem/1 'Inter',sans-serif; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; backdrop-filter: blur(10px); transition: all .3s ease; box-shadow: 0 0 20px rgba(201,168,76,.15); }
.bv-btn:hover { transform: translateY(-3px); box-shadow: 0 0 36px rgba(201,168,76,.35); }
.bv-btn--ghost { background: transparent; border-color: rgba(245,240,232,.2); color: var(--dim); font-size: .7rem; }
.bv-btn--ghost:hover { border-color: rgba(245,240,232,.5); color: var(--ivory); box-shadow: none; }

/* ── section containers ── */
.bv-inner { position: relative; z-index: 5; text-align: center; max-width: 680px; width: 100%; }
.bv-inner--left { text-align: left; }
.bv-eyebrow { display: inline-block; margin-bottom: 1.2rem; color: var(--gold); font: 700 .68rem/1 'Inter',sans-serif; letter-spacing: .22em; text-transform: uppercase; }
.bv-big { font-family:'Playfair Display',serif; font-size:clamp(3rem,11vw,7.5rem); font-weight:700; line-height:.88; color:var(--ivory); padding-bottom:0.15em; padding-right:0.1em; }
.bv-big em { color:var(--blush); font-style:italic; }
.bv-h2  { font-family:'Playfair Display',serif; font-size:clamp(2rem,6vw,4.5rem); font-weight:600; line-height:1; color:var(--ivory); margin-bottom:.8rem; }
.bv-h2 em { color:var(--rose); font-style:italic; }
.bv-lead { font-family:'Cormorant Garamond',serif; font-size:clamp(1.1rem,2.8vw,1.45rem); line-height:1.75; color:var(--dim); margin:1.2rem 0; }
.bv-lead em { color:var(--blush); font-style:italic; }
.bv-lead strong { color:var(--ivory); font-weight:600; }
.bv-mono-line { display:block; font:700 .75rem/1 'Inter',sans-serif; letter-spacing:.28em; color:rgba(201,168,76,.7); margin-bottom:1.5rem; }

/* ── kneeling scene ── */
.bv-scene-wrap { position:relative; z-index:3; width:min(100%,480px); margin:0 auto; }
.bv-scene-text { position:relative; z-index:5; text-align:center; max-width:520px; margin:0 auto; }
.bv-scene-line { opacity:0; transform:translateY(20px); transition:opacity .9s ease, transform .9s ease; font-family:'Cormorant Garamond',serif; font-style:italic; color:var(--ivory); margin:.8rem 0; }
.bv-scene-line--active { opacity:1; transform:translateY(0); }
.bv-scene-line--big { font-family:'Playfair Display',serif; font-size:clamp(2.5rem,8vw,5rem); color:var(--blush); }
.bv-scene-line--sm  { font-size:clamp(1.1rem,2.5vw,1.4rem); color:var(--dim); }

/* ── dark transition ── */
.bv-dark-reveal p { opacity:0; transition:opacity 1.4s ease; font-family:'Playfair Display',serif; font-style:italic; color:var(--ivory); font-size:clamp(1.4rem,4vw,2.6rem); line-height:1.3; margin:1.2rem 0; }
.bv-dark-reveal p.show { opacity:1; }

/* ── wish list ── */
.bv-wish-grid { display:flex; flex-direction:column; gap:.7rem; max-width:560px; margin:1.5rem auto; }
.bv-wish-item { padding:.85rem 1.3rem; border-left:2px solid var(--rose); background:rgba(255,255,255,.04); color:rgba(245,240,232,.88); font:400 clamp(1rem,2.2vw,1.2rem)/1.55 'Cormorant Garamond',serif; text-align:left; }

/* ── final secret ── */
.bv-secret { position:fixed; inset:0; z-index:200; background:#000; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem; }
.bv-secret p { font-family:'Playfair Display',serif; font-style:italic; color:var(--ivory); font-size:clamp(1.3rem,4vw,2.5rem); text-align:center; line-height:1.5; opacity:0; transition:opacity 1.8s ease; }
.bv-secret p.show { opacity:1; }

/* ── bg gradients per section ── */
.bg-wait   { background:radial-gradient(ellipse at 50% 20%, rgba(18,30,60,.6), transparent 40%), linear-gradient(160deg,#04060f,#070a16); }
.bg-reveal { background:radial-gradient(ellipse at 50% 30%, rgba(100,70,130,.22), transparent 38%), radial-gradient(ellipse at 80% 80%, rgba(201,168,76,.1), transparent 40%), linear-gradient(160deg,#060815,#0e1025); }
.bg-story  { background:radial-gradient(ellipse at 25% 60%, rgba(28,12,20,.7), transparent 40%), linear-gradient(145deg,#08050e,#150b18); }
.bg-feel   { background:radial-gradient(ellipse at 50% 40%, rgba(18,6,22,.8), transparent 35%), linear-gradient(160deg,#060410,#0f0a18); }
.bg-trans  { background:#030208; }
.bg-scene  { background:radial-gradient(ellipse at 50% 60%, rgba(90,60,110,.25), transparent 45%), radial-gradient(ellipse at 20% 20%, rgba(201,168,76,.08), transparent 35%), linear-gradient(160deg,#050310,#0d0716,#1a0d1e); }
.bg-wish   { background:radial-gradient(ellipse at 50% 30%, rgba(70,50,100,.2), transparent 40%), linear-gradient(155deg,#060a15,#0c0e1e,#160a18); }
.bg-final  { background:radial-gradient(ellipse at 50% 40%, rgba(200,133,154,.12), transparent 38%), linear-gradient(160deg,#040408,#09060e); }

/* ── shimmer title ── */
@keyframes bvShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
.bv-shimmer { background:linear-gradient(135deg,#f5f0e8 0%,#c9a84c 40%,#b8c8d8 65%,#f5f0e8 100%); background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:bvShimmer 7s linear infinite; }

@keyframes bvFadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes bvHeartbeat{ 0%,100%{transform:scale(1)} 25%{transform:scale(1.18)} 60%{transform:scale(1.07)} }
@keyframes bvPulse    { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.025) translateY(-5px)} }
@keyframes bvGlowPulse{ 0%,100%{filter:drop-shadow(0 0 12px rgba(200,133,154,.5))} 50%{filter:drop-shadow(0 0 28px rgba(200,133,154,.9))} }
@keyframes bvFlame    { 0%,100%{transform:scaleY(1) scaleX(1);opacity:1} 50%{transform:scaleY(.75) scaleX(.85);opacity:.65} }
@keyframes bvWalk     { 0%{transform:translateX(0)} 100%{transform:translateX(-48px)} }
@keyframes bvKneel    { 0%{transform:translateY(0)} 100%{transform:translateY(18px)} }
@keyframes bvParticle { 0%{opacity:0;transform:translate(0,0) scale(.5)} 50%{opacity:.8} 100%{opacity:0;transform:translate(var(--px),var(--py)) scale(1.2)} }
@keyframes bvBob      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
`;

/* ══════════════════════════════════════════════════════════════════════
   STAR FIELD
══════════════════════════════════════════════════════════════════════ */
const STAR_DATA = Array.from({ length: 70 }, (_, i) => ({
  l: `${(i * 47.3) % 100}%`,
  t: `${(i * 71.9) % 100}%`,
  s: i % 7 === 0 ? 3.5 : i % 3 === 0 ? 2.5 : 1.5,
  d: `${(i % 11) * 0.42}s`,
  dur: `${3 + (i % 6) * 0.7}s`,
}));

function StarField() {
  return (
    <div className="bv-stars" aria-hidden="true">
      {STAR_DATA.map((s, i) => (
        <div key={i} className="bv-star" style={{ left: s.l, top: s.t, width: s.s, height: s.s, boxShadow: `0 0 ${s.s * 3}px #f5f0e8`, animation: `bvTwinkle ${s.dur} ${s.d} ease-in-out infinite` }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   FLOATERS
══════════════════════════════════════════════════════════════════════ */
const FLOAT_SYMS = ["🌙", "✨", "💫", "🌸", "💙", "⭐", "🌟", "🥀", "💎", "🤍"];
function Floaters({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="bv-floaters" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => {
        const sym = FLOAT_SYMS[i % FLOAT_SYMS.length];
        return (
          <span key={i} className="bv-floater" style={{ left: `${(i * 5.7 + 2) % 100}%`, fontSize: `${1 + (i % 4) * 0.3}rem`, animation: `bvFloat ${10 + (i % 5) * 2}s ${(i * 0.6) % 8}s linear infinite` }}>
            {sym}
          </span>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CANVAS FIREWORKS
══════════════════════════════════════════════════════════════════════ */
function Fireworks({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    type P = { x: number; y: number; vx: number; vy: number; alpha: number; color: string; r: number; };
    const particles: P[] = [];
    const COLORS = ["#e8d5a3", "#c9a84c", "#f5f0e8", "#b8c8d8", "#c8859a", "#ffe9a0", "#e8bfc9", "#ffffff"];
    const launch = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.55;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < 70; i++) {
        const angle = (Math.PI * 2 * i) / 70;
        const speed = 1.8 + Math.random() * 3.5;
        particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, alpha: 1, color, r: 1.5 + Math.random() * 2 });
      }
    };
    const iv = setInterval(launch, 800); launch();
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.alpha -= 0.013;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); clearInterval(iv); window.removeEventListener("resize", resize); };
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} className="bv-fw" />;
}

/* ══════════════════════════════════════════════════════════════════════
   COUPLE KNEELING SVG SCENE
══════════════════════════════════════════════════════════════════════ */
function CoupleScene({ phase }: { phase: number }) {
  // phase 0=standing, 1=walking, 2=kneeling
  const kneelOffset = phase >= 2 ? 18 : 0;
  const walkOffset = phase >= 1 ? -44 : 0;

  return (
    <svg viewBox="0 0 460 330" width="100%" style={{ maxWidth: 460, filter: "drop-shadow(0 0 30px rgba(200,133,154,0.3))", animation: "bvPulse 4s ease-in-out infinite" }} aria-label="Couple in moonlight scene" role="img">
      {/* moon glow */}
      <defs>
        <radialGradient id="moonGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8f0" stopOpacity="1" />
          <stop offset="55%" stopColor="#f1d6c2" stopOpacity=".9" />
          <stop offset="100%" stopColor="#dba5a4" stopOpacity=".6" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,231,202,.22)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="groundGrad" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="rgba(201,168,76,.12)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="460" height="330" fill="url(#glowGrad)" opacity=".4" />

      {/* moon */}
      <circle cx="390" cy="55" r="38" fill="url(#moonGrad)" opacity=".85" />
      <circle cx="390" cy="55" r="52" fill="rgba(255,231,202,.1)" />
      <circle cx="390" cy="55" r="68" fill="rgba(255,220,190,.06)" />

      {/* scattered stars */}
      {[
        [30, 25], [80, 15], [140, 30], [200, 12], [260, 28], [320, 8], [50, 55], [110, 48], [170, 65], [340, 45], [420, 18], [15, 80],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.2} fill="#f5f0e8" opacity={.5 + Math.sin(i) * 0.4}
          style={{ animation: `bvTwinkle ${2 + i * 0.4}s ${i * 0.3}s ease-in-out infinite` }} />
      ))}

      {/* ground */}
      <ellipse cx="230" cy="305" rx="210" ry="22" fill="url(#groundGrad)" opacity=".6" />
      <line x1="0" y1="300" x2="460" y2="300" stroke="rgba(201,168,76,.15)" strokeWidth="1" />

      {/* soft petals scattered */}
      {["🌸", "🌸", "🌹", "🌸", "🌸"].map((p, i) => (
        <text key={i} x={80 + i * 70} y={295} fontSize="14" opacity=".45" style={{ animation: `bvBob ${3 + i * 0.5}s ${i * 0.4}s ease-in-out infinite` }}>{p}</text>
      ))}

      {/* ── HIM (Anjan) — standing still, right side ── */}
      {/* body */}
      <rect x="285" y="155" width="48" height="80" rx="14" fill="#1e3a5c" stroke="rgba(184,200,216,.4)" strokeWidth="1" />
      {/* head */}
      <circle cx="309" cy="135" r="24" fill="#e8c9a0" stroke="rgba(184,200,216,.3)" strokeWidth="1" />
      {/* hair */}
      <path d="M287 126 Q293 103 309 102 Q325 103 331 126 Q323 112 309 111 Q295 112 287 126Z" fill="#2c1a08" />
      {/* eyes */}
      <ellipse cx="302" cy="133" rx="3" ry="3.5" fill="#1a1208" />
      <circle cx="303" cy="132" r="1.1" fill="white" opacity=".8" />
      <ellipse cx="316" cy="133" rx="3" ry="3.5" fill="#1a1208" />
      <circle cx="317" cy="132" r="1.1" fill="white" opacity=".8" />
      {/* gentle smile */}
      <path d="M303 141 Q309 146 315 141" stroke="#c97070" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* arms resting */}
      <line x1="285" y1="170" x2="268" y2="200" stroke="#e8c9a0" strokeWidth="9" strokeLinecap="round" />
      <line x1="333" y1="170" x2="350" y2="200" stroke="#e8c9a0" strokeWidth="9" strokeLinecap="round" />
      {/* legs */}
      <rect x="287" y="228" width="20" height="52" rx="9" fill="#1a2e4a" />
      <rect x="312" y="228" width="20" height="52" rx="9" fill="#1a2e4a" />
      <ellipse cx="297" cy="282" rx="13" ry="6" fill="#0f1d2e" />
      <ellipse cx="322" cy="282" rx="13" ry="6" fill="#0f1d2e" />
      {/* subtle glow around him */}
      <ellipse cx="309" cy="210" rx="38" ry="70" fill="rgba(184,200,216,.04)" style={{ animation: "bvGlowPulse 3s ease-in-out infinite" }} />

      {/* ── HER (Mani) — kneeling, left side, with flower/letter ── */}
      {/* walking offset applied via transform */}
      <g transform={`translate(${walkOffset}, 0)`} style={{ transition: "transform 1.8s cubic-bezier(.16,1,.3,1)" }}>
        {/* kneeling offset on body */}
        <g transform={`translate(0, ${kneelOffset})`} style={{ transition: "transform 1.5s cubic-bezier(.16,1,.3,1)" }}>
          {/* body */}
          <rect x="122" y="155" width="46" height="68" rx="14" fill="#5c2d4a" stroke="rgba(200,133,154,.4)" strokeWidth="1" />
          {/* dress skirt flare */}
          <path d="M120 205 Q145 235 170 205 Q165 250 145 255 Q125 250 120 205Z" fill="#4a2038" stroke="rgba(200,133,154,.3)" strokeWidth="1" />
        </g>
        {/* head stays higher — only body kneels */}
        <g transform={`translate(0, ${kneelOffset * 0.3})`} style={{ transition: "transform 1.5s cubic-bezier(.16,1,.3,1)" }}>
          <circle cx="145" cy="132" r="23" fill="#f5c8a0" stroke="rgba(200,133,154,.3)" strokeWidth="1" />
          {/* long hair */}
          <path d="M124 128 Q125 100 145 98 Q165 100 166 128 Q158 108 145 107 Q132 108 124 128Z" fill="#1a0c04" />
          <path d="M122 130 Q116 160 120 195" stroke="#1a0c04" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M168 130 Q174 155 171 190" stroke="#1a0c04" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".7" />
          {/* eyes looking up at him */}
          <ellipse cx="138" cy="130" rx="2.8" ry="3.2" fill="#1a0c04" />
          <circle cx="139" cy="129" r="1" fill="white" opacity=".8" />
          <ellipse cx="152" cy="130" rx="2.8" ry="3.2" fill="#1a0c04" />
          <circle cx="153" cy="129" r="1" fill="white" opacity=".8" />
          {/* soft blush */}
          <ellipse cx="131" cy="136" rx="5" ry="3" fill="rgba(210,110,120,.22)" />
          <ellipse cx="159" cy="136" rx="5" ry="3" fill="rgba(210,110,120,.22)" />
          {/* gentle smile */}
          <path d="M136 140 Q145 146 154 140" stroke="#c97070" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
        {/* kneeling leg */}
        <g transform={`translate(0, ${kneelOffset})`} style={{ transition: "transform 1.5s cubic-bezier(.16,1,.3,1)" }}>
          <rect x="124" y="220" width="20" height="30" rx="9" fill="#4a2038" />
          <rect x="148" y="220" width="20" height="30" rx="9" fill="#4a2038" />
          {phase >= 2 && <>
            <ellipse cx="134" cy="255" rx="15" ry="8" fill="#3a1828" />
            <ellipse cx="158" cy="255" rx="15" ry="8" fill="#3a1828" />
          </>}
          {phase < 2 && <>
            <ellipse cx="134" cy="253" rx="13" ry="5.5" fill="#3a1828" />
            <ellipse cx="158" cy="253" rx="13" ry="5.5" fill="#3a1828" />
          </>}
        </g>
        {/* extended arm holding glowing flower/letter */}
        <g transform={`translate(0, ${kneelOffset * 0.5})`} style={{ transition: "transform 1.5s cubic-bezier(.16,1,.3,1)" }}>
          <line x1="165" y1="175" x2="200" y2="155" stroke="#f5c8a0" strokeWidth="9" strokeLinecap="round" />
          {/* glowing flower/letter */}
          <circle cx="204" cy="150" r="13" fill="rgba(201,168,76,.15)" style={{ animation: "bvGlowPulse 2s ease-in-out infinite" }} />
          <circle cx="204" cy="150" r="9" fill="rgba(201,168,76,.25)" style={{ animation: "bvGlowPulse 2s .5s ease-in-out infinite" }} />
          <text x="198" y="155" fontSize="12">🌸</text>
          {/* sparkle particles around flower */}
          {["✨", "💫", "⭐"].map((s, i) => (
            <text key={i} x={195 + i * 9} y={138} fontSize="8" opacity=".7"
              style={{ animation: `bvBob ${2 + i * 0.4}s ${i * 0.3}s ease-in-out infinite` }}>{s}</text>
          ))}
        </g>
      </g>

      {/* connecting light beam between them when kneeling */}
      {phase >= 2 && (
        <line x1="210" y1="200" x2="285" y2="200" stroke="rgba(201,168,76,.2)" strokeWidth="1.5"
          strokeDasharray="4 6" style={{ animation: "bvShimmer 3s linear infinite" }} />
      )}

      {/* ground glow under them */}
      <ellipse cx="220" cy="300" rx="120" ry="16" fill="rgba(200,133,154,.08)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PHOTO SLOT
══════════════════════════════════════════════════════════════════════ */
function PhotoSlot({ src, caption, style }: { src?: string; caption: string; style?: React.CSSProperties }) {
  return (
    <div className="bv-photo" style={{ ...style }}>
      {src ? (
        <>
          <img src={src} alt={caption} />
          <div className="bv-photo-caption">{caption}</div>
        </>
      ) : (
        <div className="bv-photo-placeholder">
          <div>
            <div style={{ fontSize: "2rem", marginBottom: ".4rem" }}>📷</div>
            <div style={{ fontSize: ".7rem", padding: "0 .5rem" }}>{caption}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COUNTDOWN hook
══════════════════════════════════════════════════════════════════════ */
function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now());
  useEffect(() => {
    const iv = setInterval(() => setDiff(target.getTime() - Date.now()), 1000);
    return () => clearInterval(iv);
  }, [target]);
  const total = Math.max(0, diff);
  const d = Math.floor(total / 86400000);
  const h = Math.floor((total % 86400000) / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  return { d, h, m, s, past: diff <= 0 };
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE DEFINITIONS
══════════════════════════════════════════════════════════════════════ */
const PAGES = [
  "wait", "reveal", "story1", "story2", "story3",
  "feelings", "transition", "scene", "wish", "final",
] as const;
type Page = typeof PAGES[number];

/* ══════════════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════════════ */
export default function BirthdayBava() {
  const [page, setPage] = useState<Page>("wait");
  const [leaving, setLeaving] = useState(false);
  const [scenePhase, setScenePhase] = useState(0);   // 0=standing, 1=walking, 2=kneeling
  const [darkLines, setDarkLines] = useState(0);   // revealed lines on transition page
  const [sceneLine, setSceneLine] = useState(0);   // scene text lines
  const [showSecret, setShowSecret] = useState(false);
  const [secretStep, setSecretStep] = useState(0);
  const { d, h, m, s, past } = useCountdown(BDAY);

  const goTo = useCallback((next: Page) => {
    setLeaving(true);
    setTimeout(() => { setPage(next); setLeaving(false); }, 700);
  }, []);

  const nextPage = useCallback(() => {
    const idx = PAGES.indexOf(page);
    if (idx < PAGES.length - 1) goTo(PAGES[idx + 1]);
  }, [page, goTo]);

  /* auto-advance dark transition lines */
  useEffect(() => {
    if (page !== "transition") return;
    setDarkLines(0);
    const timers = [1200, 3200, 5200, 7200].map((ms, i) =>
      setTimeout(() => setDarkLines(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [page]);

  /* auto-advance scene phases */
  useEffect(() => {
    if (page !== "scene") return;
    setScenePhase(0); setSceneLine(0);
    const t1 = setTimeout(() => setScenePhase(1), 1200);
    const t2 = setTimeout(() => setScenePhase(2), 3000);
    const lineTimers = [4200, 5600, 7000, 8400, 10000, 11800, 13400].map((ms, i) =>
      setTimeout(() => setSceneLine(i + 1), ms)
    );
    return () => [t1, t2, ...lineTimers].forEach(clearTimeout);
  }, [page]);

  /* secret ending steps */
  useEffect(() => {
    if (!showSecret) return;
    setSecretStep(0);
    const t1 = setTimeout(() => setSecretStep(1), 2200);
    const t2 = setTimeout(() => setSecretStep(2), 5000);
    const t3 = setTimeout(() => setSecretStep(3), 7800);
    const t4 = setTimeout(() => setSecretStep(4), 10400);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [showSecret]);

  const idx = PAGES.indexOf(page);
  const progress = ((idx) / (PAGES.length - 1)) * 100;

  const pageClass = (p: Page) =>
    `bv-page ${page === p ? (leaving ? "bv-page--leaving" : "bv-page--visible") : "bv-page--hidden"}`;

  return (
    <>
      <style>{CSS}</style>

      <div className="bv-app" id="bava-birthday-app">
        <StarField />
        <Floaters show={["reveal", "wish", "final"].includes(page)} />
        <Fireworks active={page === "reveal" || page === "wish"} />

        {/* ── PAGE 1: WAITING ────────────────────────────────────── */}
        <div id="page-wait" className={`${pageClass("wait")} bg-wait`}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <span className="bv-mono-line">October 10 · 2026</span>
            <p className="f-display" style={{ fontSize: "clamp(1rem,2.5vw,1.3rem)", color: "rgba(245,240,232,.55)", marginBottom: "2.5rem", fontStyle: "italic" }}>
              Some moments are worth waiting for…
            </p>
            {past ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--gold)", fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,5vw,3rem)", marginBottom: "1.5rem", animation: "bvHeartbeat 1.8s ease-in-out infinite" }}>
                  It's time 🤍
                </p>
                <button id="btn-to-reveal" className="bv-btn" onClick={() => goTo("reveal")}>Begin →</button>
              </div>
            ) : (
              <>
                <div className="bv-countdown">
                  {[{ n: d, l: "Days" }, { n: h, l: "Hours" }, { n: m, l: "Min" }, { n: s, l: "Sec" }].map(({ n, l }) => (
                    <div key={l} className="bv-cd-unit">
                      <span className="bv-cd-num f-display">{String(n).padStart(2, "0")}</span>
                      <span className="bv-cd-lbl">{l}</span>
                    </div>
                  ))}
                </div>
                <p style={{ color: "var(--dim)", font: "400 .9rem/1.6 'Inter',sans-serif" }}>
                  until a special someone's birthday 🌙
                </p>
                <div style={{ marginTop: "2rem" }}>
                  <button id="btn-skip-wait" className="bv-btn bv-btn--ghost" onClick={() => goTo("reveal")}>
                    Can't wait — take me in
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── PAGE 2: BIRTHDAY REVEAL ────────────────────────────── */}
        <div id="page-reveal" className={`${pageClass("reveal")} bg-reveal`} style={{ gap: "1.5rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.4s ease both" }}>
            {/* hero photo slot */}
            <div style={{ width: "min(100%,220px)", margin: "0 auto 2rem", borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(201,168,76,.5)", boxShadow: "0 0 0 10px rgba(201,168,76,.06), 0 0 50px rgba(201,168,76,.25)", animation: "bvGlowPulse 3s ease-in-out infinite" }}>
              <PhotoSlot src="/assets/5.jpeg" caption="Bava" style={{ borderRadius: "50%", aspectRatio: "1" }} />
            </div>

            <h1 className="bv-big bv-shimmer" style={{ marginBottom: ".5rem" }}>
              Happy<br />Birthday
            </h1>
            <p className="f-script" style={{ fontSize: "clamp(2.5rem,8vw,4.5rem)", color: "var(--blush)", lineHeight: 1, marginBottom: ".5rem" }}>
              {HIM} 🤍
            </p>
            <span className="bv-mono-line" style={{ fontSize: ".85rem", marginBottom: "1.5rem" }}>
              10 · 10 · 2026
            </span>
            <p className="bv-lead">
              Today is yours. And I made this, just for you.
            </p>
            <div style={{ marginTop: "1.5rem" }}>
              <button id="btn-reveal-to-story" className="bv-btn" onClick={() => goTo("story1")}>
                There's something I made for you… →
              </button>
            </div>
          </div>
        </div>

        {/* ── PAGE 3: STORY — THE BEGINNING ──────────────────────── */}
        <div id="page-story1" className={`${pageClass("story1")} bg-story`} style={{ gap: "2rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <span className="bv-eyebrow">Chapter I</span>
            <h2 className="bv-h2">The <em>Beginning</em></h2>
            <p className="bv-lead">
              Before today became your birthday,<br />
              there was a beginning. A moment when ordinary<br />
              conversations started to feel <em>extraordinary.</em>
            </p>
            {/* photo row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem", margin: "1.5rem 0", maxWidth: "460px" }}>
              <PhotoSlot src="/assets/1.jpeg" caption="The beginning." style={{ aspectRatio: "4/5" }} />
              <PhotoSlot src="/assets/2.jpeg" caption="Where it started." style={{ aspectRatio: "4/5", marginTop: "1.5rem" }} />
            </div>
            <p className="bv-lead" style={{ fontSize: "clamp(1rem,2vw,1.2rem)" }}>
              I didn't plan to remember so much.<br />
              But some people have a way of making<br />
              ordinary moments <strong>impossible to forget.</strong>
            </p>
            <button id="btn-story1-next" className="bv-btn" style={{ marginTop: "1.5rem" }} onClick={() => goTo("story2")}>Continue →</button>
          </div>
        </div>

        {/* ── PAGE 4: STORY — THE LITTLE THINGS ─────────────────── */}
        <div id="page-story2" className={`${pageClass("story2")} bg-story`} style={{ gap: "2rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both", maxWidth: 780 }}>
            <span className="bv-eyebrow">Chapter II</span>
            <h2 className="bv-h2">The Little <em>Things</em></h2>
            <p className="bv-lead" style={{ marginBottom: "1.5rem" }}>
              It was never one big moment.<br />
              It was a hundred little things that added up to everything.
            </p>
            <div className="bv-gallery">
              {[
                { src: "/assets/3.jpeg", caption: "A memory I kept close." },
                { src: "/assets/4.jpeg", caption: "One of those little moments." },
                { src: "/assets/5.jpeg", caption: "Something I'll always remember." },
                { src: "/assets/6.jpeg", caption: "Small things, big feelings." },
                { src: undefined, caption: "Add your favourite photo here." },
                { src: undefined, caption: "One more memory for us." },
              ].map((p, i) => (
                <PhotoSlot key={i} src={p.src} caption={p.caption} />
              ))}
            </div>
            <button id="btn-story2-next" className="bv-btn" style={{ marginTop: "1.5rem" }} onClick={() => goTo("story3")}>Continue →</button>
          </div>
        </div>

        {/* ── PAGE 5: STORY — WHAT I SEE ─────────────────────────── */}
        <div id="page-story3" className={`${pageClass("story3")} bg-story`} style={{ gap: "2rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <span className="bv-eyebrow">Chapter III</span>
            <h2 className="bv-h2">What I <em>see</em> in you</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: ".65rem", margin: "1.5rem 0", textAlign: "left" }}>
              {[
                { emoji: "💙", line: "The way you carry yourself, quietly confident." },
                { emoji: "🌟", line: "The warmth behind everything you say." },
                { emoji: "🌙", line: "The depth in you that most people never see." },
                { emoji: "🤍", line: "The person who made my ordinary days feel different." },
              ].map(({ emoji, line }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".8rem", padding: ".9rem 1.2rem", borderLeft: "2px solid rgba(200,133,154,.5)", background: "rgba(255,255,255,.04)", animation: `bvFadeUp .8s ${i * 0.2}s ease both` }}>
                  <span style={{ fontSize: "1.4rem" }}>{emoji}</span>
                  <span style={{ font: "400 clamp(1rem,2.2vw,1.2rem)/1.5 'Cormorant Garamond',serif", color: "var(--dim)" }}>{line}</span>
                </div>
              ))}
            </div>
            <button id="btn-story3-next" className="bv-btn" onClick={() => goTo("feelings")}>Continue →</button>
          </div>
        </div>

        {/* ── PAGE 6: FEELINGS ───────────────────────────────────── */}
        <div id="page-feelings" className={`${pageClass("feelings")} bg-feel`} style={{ gap: "1.5rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <span className="bv-eyebrow">Everything I never said</span>
            <h2 className="bv-h2" style={{ marginBottom: "1.5rem" }}>I don't know <em>exactly</em><br />when it happened…</h2>
            <p className="bv-lead">
              But somewhere between our conversations<br />
              and ordinary days,<br />
              <strong>you became someone my heart started looking for.</strong>
            </p>
            <div style={{ width: "60px", height: "1px", background: "rgba(200,133,154,.4)", margin: "1.5rem auto" }} />
            <p className="bv-lead">
              I never wanted to force my feelings<br />
              into your life.
            </p>
            <p className="bv-lead" style={{ color: "var(--blush)" }}>
              <em>I only wanted you to know<br />that they were real.</em>
            </p>
            <button id="btn-feelings-next" className="bv-btn" style={{ marginTop: "1.5rem" }} onClick={() => goTo("transition")}>
              There's something else… →
            </button>
          </div>
        </div>

        {/* ── PAGE 7: DARK TRANSITION ────────────────────────────── */}
        <div id="page-transition" className={`${pageClass("transition")} bg-trans`}>
          <div className="bv-dark-reveal bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <p className={darkLines >= 1 ? "show f-display" : "f-display"} style={{ fontSize: "clamp(1.4rem,4vw,2.6rem)" }}>
              And after everything I felt…
            </p>
            <p className={darkLines >= 2 ? "show f-display" : "f-display"} style={{ fontSize: "clamp(1.4rem,4vw,2.6rem)" }}>
              there was still one thing I wanted to do.
            </p>
            <p className={darkLines >= 3 ? "show f-display" : "f-display"} style={{ fontSize: "clamp(1.1rem,3vw,1.8rem)", color: "var(--dim)" }}>
              Not to ask you for anything.
            </p>
            <p className={darkLines >= 4 ? "show f-display" : "f-display"} style={{ fontSize: "clamp(1.1rem,3vw,1.8rem)", color: "var(--blush)" }}>
              Just to tell you what you mean to me.
            </p>
            {darkLines >= 4 && (
              <button id="btn-trans-next" className="bv-btn" style={{ marginTop: "2.5rem", animation: "bvFadeUp .8s ease both" }} onClick={() => goTo("scene")}>
                I'm ready →
              </button>
            )}
          </div>
        </div>

        {/* ── PAGE 8: KNEELING COUPLE SCENE ──────────────────────── */}
        <div id="page-scene" className={`${pageClass("scene")} bg-scene`} style={{ gap: "1.5rem", paddingBottom: "5rem" }}>
          <div style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: 680, textAlign: "center" }}>
            {/* SVG couple */}
            <div className="bv-scene-wrap">
              <CoupleScene phase={scenePhase} />
            </div>
            {/* progressive text */}
            <div className="bv-scene-text" style={{ marginTop: "1rem" }}>
              <p className={`bv-scene-line bv-scene-line--big ${sceneLine >= 1 ? "bv-scene-line--active" : ""}`}>
                {HIM}…
              </p>
              <p className={`bv-scene-line bv-scene-line--sm ${sceneLine >= 2 ? "bv-scene-line--active" : ""}`}>
                I don't have a perfect speech.
              </p>
              <p className={`bv-scene-line bv-scene-line--sm ${sceneLine >= 3 ? "bv-scene-line--active" : ""}`}>
                I don't know what the future holds.
              </p>
              <p className={`bv-scene-line bv-scene-line--sm ${sceneLine >= 4 ? "bv-scene-line--active" : ""}`}>
                I don't want to change your heart.
              </p>
              <p className={`bv-scene-line ${sceneLine >= 5 ? "bv-scene-line--active" : ""}`} style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.15rem,3vw,1.6rem)", color: "var(--ivory)" }}>
                I just wanted, for one moment,<br />
                to kneel before the person<br />
                who became so important to me…
              </p>
              <p className={`bv-scene-line ${sceneLine >= 6 ? "bv-scene-line--active" : ""}`} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.1rem,2.5vw,1.4rem)", fontStyle: "italic", color: "var(--blush)" }}>
                Not asking you to choose me.
              </p>
              <p className={`bv-scene-line ${sceneLine >= 7 ? "bv-scene-line--active" : ""}`} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1.1rem,2.5vw,1.4rem)", fontStyle: "italic", color: "var(--blush)" }}>
                Just wishing that life always chooses <em>happiness</em> for you. 🤍
              </p>
              {sceneLine >= 7 && (
                <button id="btn-scene-next" className="bv-btn" style={{ marginTop: "2rem", animation: "bvFadeUp .8s ease both" }} onClick={() => goTo("wish")}>
                  Continue →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── PAGE 9: BIRTHDAY WISH ──────────────────────────────── */}
        <div id="page-wish" className={`${pageClass("wish")} bg-wish`} style={{ gap: "1.5rem", paddingBottom: "5rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <div style={{ fontSize: "4.5rem", marginBottom: "1rem", animation: "bvHeartbeat 2s ease-in-out infinite" }}>🎂</div>
            <h2 className="bv-big bv-shimmer" style={{ marginBottom: ".5rem" }}>
              HAPPY<br />BIRTHDAY
            </h2>
            <p className="f-script" style={{ fontSize: "clamp(3rem,10vw,5.5rem)", color: "var(--blush)", marginBottom: "1.5rem", lineHeight: 1 }}>
              {HIM} 🤍
            </p>
            <div className="bv-wish-grid">
              {[
                { e: "🌟", w: "May this year bring you everything you've been working for." },
                { e: "🌙", w: "May you find peace in the places you need it most." },
                { e: "💫", w: "May your dreams become real, one by one." },
                { e: "😊", w: "May you always have a reason to smile." },
                { e: "🤍", w: "May you always remain the person who made ordinary moments feel special." },
              ].map(({ e, w }, i) => (
                <div key={i} className="bv-wish-item" style={{ animationDelay: `${i * 0.15}s` }}>
                  <span style={{ marginRight: ".6rem" }}>{e}</span>{w}
                </div>
              ))}
            </div>
            <button id="btn-wish-next" className="bv-btn" style={{ marginTop: "1.5rem" }} onClick={() => goTo("final")}>
              One last thing… →
            </button>
          </div>
        </div>

        {/* ── PAGE 10: FINAL ─────────────────────────────────────── */}
        <div id="page-final" className={`${pageClass("final")} bg-final`} style={{ gap: "1.5rem", paddingBottom: "5rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            {/* final photo */}
            <div style={{ width: "min(100%,180px)", margin: "0 auto 1.5rem", borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(200,133,154,.4)", boxShadow: "0 0 0 8px rgba(200,133,154,.06), 0 0 40px rgba(200,133,154,.2)" }}>
              <PhotoSlot src="/assets/logo.jpeg" caption="Anjan" style={{ borderRadius: "50%", aspectRatio: "1" }} />
            </div>

            <p className="bv-lead" style={{ marginBottom: "1.5rem" }}>
              Whatever life writes next,<br />
              <strong>I'm grateful that our paths crossed.</strong>
            </p>
            <div style={{ width: "50px", height: "1px", background: "rgba(200,133,154,.4)", margin: "1rem auto" }} />
            <p className="bv-lead">
              Today isn't about my wishes.
            </p>
            <p className="bv-lead" style={{ color: "var(--blush)" }}>
              <em>Today is about yours.</em>
            </p>
            <div style={{ margin: "2rem 0" }}>
              <p style={{ font: "600 clamp(2rem,6vw,3.5rem)/1 'Playfair Display',serif", color: "var(--ivory)", marginBottom: ".5rem" }}>
                Happy Birthday,
              </p>
              <p className="f-script" style={{ fontSize: "clamp(3rem,10vw,5rem)", color: "var(--blush)", lineHeight: 1 }}>
                {HIM2}. 🤍
              </p>
            </div>
            <p className="f-script" style={{ fontSize: "clamp(1.5rem,4vw,2.2rem)", color: "var(--dim)", marginBottom: "2rem" }}>
              — {HER}
            </p>
            <span className="bv-mono-line">10 · 10 · 2026</span>

            {/* secret button */}
            <div style={{ marginTop: "2.5rem" }}>
              <button id="btn-one-last-thing" className="bv-btn bv-btn--ghost" onClick={() => setShowSecret(true)}>
                One last thing…
              </button>
            </div>
          </div>
        </div>

        {/* ── NAV: dots + arrow ─────────────────────────────────── */}
        {!showSecret && (
          <nav className="bv-nav" aria-label="Page navigation">
            <div className="bv-nav-dots">
              {PAGES.map((p, i) => (
                <button key={p} className={`bv-dot ${page === p ? "bv-dot--active" : ""}`} aria-label={`Go to page ${i + 1}`} onClick={() => goTo(p)} title={p} />
              ))}
            </div>
            {page !== "final" && page !== "scene" && page !== "transition" && (
              <button id="btn-nav-next" className="bv-nav-btn" onClick={nextPage} aria-label="Next page">↓</button>
            )}
          </nav>
        )}

        {/* ── SECRET ENDING ─────────────────────────────────────── */}
        {showSecret && (
          <div className="bv-secret" id="secret-ending" role="dialog" aria-label="Secret message">
            <p className={secretStep >= 1 ? "show f-display" : "f-display"} style={{ fontSize: "clamp(1.2rem,3.5vw,2rem)", marginBottom: "1.5rem" }}>
              If you ever wondered whether you mattered to me…
            </p>
            <p className={secretStep >= 2 ? "show f-display" : "f-display"} style={{ fontSize: "clamp(1.5rem,5vw,3rem)", color: "var(--blush)" }}>
              You did.
            </p>
            <p className={secretStep >= 3 ? "show f-display" : "f-display"} style={{ fontSize: "clamp(1rem,2.5vw,1.5rem)", color: "var(--dim)", maxWidth: "400px" }}>
              More than I ever knew how to explain. 🥀
            </p>
            <div style={{ marginTop: "3rem" }}>
              <p className={secretStep >= 4 ? "show bv-mono-line" : "bv-mono-line"} style={{ fontSize: ".9rem", marginBottom: ".5rem" }}>
                10 · 10 · 2026
              </p>
              <p className={`f-script ${secretStep >= 4 ? "show" : ""}`} style={{ fontSize: "clamp(2.5rem,7vw,4rem)", color: "var(--blush)", lineHeight: 1, opacity: secretStep >= 4 ? 1 : 0, transition: "opacity 1.8s ease" }}>
                Happy Birthday, {HIM}. 🤍
              </p>
            </div>
            {secretStep >= 4 && (
              <button id="btn-close-secret" className="bv-btn bv-btn--ghost" style={{ marginTop: "3rem", animation: "bvFadeUp .8s ease both" }} onClick={() => setShowSecret(false)}>
                ← Back
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
