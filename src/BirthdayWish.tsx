import { useEffect, useRef, useState, useCallback } from "react";
import photo1 from "./assets/1.jpeg";
import photo2 from "./assets/2.jpeg";
import photo3 from "./assets/3.jpeg";
import photo4 from "./assets/4.jpeg";
import photo5 from "./assets/5.jpeg";
import photo6 from "./assets/6.jpeg";

/* ══════════════════════════════════════════════════════════════════════
   CONFIG — edit these to personalise
══════════════════════════════════════════════════════════════════════ */
const HIM = "Anjan Bava";
const HIM2 = "Anjan";
const HER = "Mani";
const BDAY = new Date("2026-10-10T00:00:00"); // midnight Oct 10
const photos = [photo1, photo2, photo3, photo4, photo5, photo6];

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
.bv-page { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 1.5rem 8rem 1.5rem; overflow-y: auto; overflow-x: hidden; transition: opacity .8s ease, transform .8s cubic-bezier(.16,1,.3,1); }
#page-reveal { justify-content: flex-start; }
#page-final { justify-content: flex-start; }
#page-story1 { justify-content: flex-start; padding: 0; }
#page-story2 { justify-content: flex-start; padding: 0; }
#page-story3 { justify-content: flex-start; padding: 0; }
#page-feelings { justify-content: flex-start; padding-top: clamp(1.5rem, 5svh, 3rem); }
#page-memories { justify-content: flex-start; padding-top: clamp(4rem, 10svh, 6rem); }
.bv-eye-scene { position: absolute; inset: 0; overflow: hidden; background: #090807; }
.bv-eye-scene::after { position: absolute; inset: 35% 0 0; z-index: 1; background: linear-gradient(180deg, transparent 0%, rgba(5,8,15,.42) 25%, rgba(5,8,15,.88) 100%); content: ""; pointer-events: none; }
.bv-eye-fullscreen { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; object-position: center 25%; }
.bv-eye-copy { position: absolute; right: 0; bottom: clamp(3.25rem, 5.5svh, 4.25rem); left: 0; z-index: 2; width: min(100% - 2.5rem, 800px); max-height: calc(100% - 6rem); margin: 0 auto; overflow-y: auto; padding: .8rem .25rem; text-align: center; animation: bvFadeUp 1.2s ease both; }
.bv-eye-scene--story2, .bv-eye-scene--story3 { position: relative; flex: 0 0 auto; width: 100%; height: clamp(250px, 46svh, 480px); }
.bv-eye-fullscreen--story2, .bv-eye-fullscreen--story3 { position: relative; inset: auto; object-position: center center; transform: scale(1.09); transform-origin: center center; }
.bv-eye-scene--story3 { position: absolute; inset: 0; width: auto; height: auto; }
.bv-eye-fullscreen--story3 { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; transform: translateY(10px) scale(1.03); transform-origin: center 30%; }
.bv-eye-copy--story3 { bottom: clamp(4.5rem, 9svh, 6rem); }
.bv-eye-copy--below { position: relative; inset: auto; z-index: 2; width: 100%; max-height: none; margin: 0 auto; overflow: visible; padding: clamp(1.6rem, 3.8svh, 2.2rem) 1.25rem 7rem; border-top: 1px solid rgba(232,191,201,.16); background: #110d15; }
.bv-eye-copy--below .bv-eye-title, .bv-eye-copy--below .bv-eye-message { text-shadow: none; }
.bv-eye-copy--below .bv-eye-title { margin-bottom: .9rem; }
.bv-eye-copy--below .bv-eye-divider { margin: 0 auto 1rem; }
.bv-eye-eyebrow { display: block; margin-bottom: .65rem; color: var(--gold); font: 600 .62rem/1.2 'Inter', sans-serif; letter-spacing: .24em; text-transform: uppercase; }
.bv-eye-title { margin: 0 0 .8rem; color: var(--ivory); font: italic 600 clamp(1.5rem, 4vw, 2.6rem)/1.1 'Playfair Display', Georgia, serif; text-shadow: 0 2px 18px rgba(0,0,0,.65); }
.bv-eye-title em { color: var(--blush); font-style: italic; }
.bv-eye-message { max-width: 720px; margin: 0 auto; color: rgba(255,248,242,.95); font: 400 clamp(.95rem, 1.9vw, 1.12rem)/1.42 'Cormorant Garamond', Georgia, serif; text-shadow: 0 2px 12px rgba(0,0,0,.8); }
.bv-eye-message p { margin: 0 0 .55rem; }
.bv-eye-message strong { color: var(--blush); font-weight: 600; }
.bv-eye-message--story2 { font-size: clamp(1.02rem, 2vw, 1.2rem); line-height: 1.42; }
.bv-eye-message--story2 p { margin-bottom: .65rem; }
.bv-eye-message--story2 p:last-child { margin-bottom: 0; }
.bv-eye-message--story2 strong { display: block; margin: .25rem 0; font: italic 600 clamp(1.22rem, 2.5vw, 1.6rem)/1.28 'Playfair Display', Georgia, serif; }
.bv-eye-divider { width: 42px; height: 1px; margin: .75rem auto; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
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
.bv-nav { position: fixed; bottom: 1.25rem; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 0 1rem; background: transparent; }
.bv-nav-btn { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(201,168,76,.5); background: rgba(201,168,76,.08); color: var(--gold); font-size: 1.2rem; cursor: pointer; backdrop-filter: blur(10px); transition: all .3s ease; display: grid; place-items: center; }
.bv-nav-btn:hover { background: rgba(201,168,76,.2); transform: scale(1.1); }
.bv-nav-dots { display: flex; gap: .4rem; }
.bv-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(201,168,76,.3); transition: all .3s ease; cursor: pointer; }
.bv-dot:hover { background: rgba(201,168,76,.5); transform: scale(1.2); }
.bv-dot--active { background: var(--gold); transform: scale(1.4); }

/* ── enhanced navigation ── */
.bv-nav-container { display: flex; align-items: center; justify-content: center; gap: 1.5rem; width: 100%; max-width: 500px; }
.bv-nav-back, .bv-nav-next { padding: .8rem 1.8rem; border: 1px solid rgba(201,168,76,.6); border-radius: 999px; background: linear-gradient(120deg,rgba(201,168,76,.15),rgba(184,200,216,.12)); color: var(--ivory); font: 600 .82rem/1 'Inter',sans-serif; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; backdrop-filter: blur(10px); transition: all .3s ease; box-shadow: 0 0 20px rgba(201,168,76,.15); white-space: nowrap; }
.bv-nav-back:hover, .bv-nav-next:hover { transform: translateY(-3px); box-shadow: 0 0 36px rgba(201,168,76,.35); }
.bv-nav-back:disabled, .bv-nav-next:disabled { opacity: .3; cursor: not-allowed; transform: none; box-shadow: none; }
.bv-page-counter { display: flex; align-items: center; gap: .3rem; font-family: 'Inter', sans-serif; font-size: .75rem; color: var(--dim); }
.bv-current-page { color: var(--gold); font-weight: 600; font-size: .85rem; }
.bv-divider { color: rgba(201,168,76,.4); }
.bv-total-pages { color: var(--dim); }

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
.bv-silence-inner { max-width:720px; text-align:left; }
.bv-silence-kicker { display:flex; align-items:center; gap:.7rem; margin-bottom:1.4rem; color:var(--gold); font:600 .62rem/1 'Inter',sans-serif; letter-spacing:.24em; text-transform:uppercase; }
.bv-silence-kicker::before { width:28px; height:1px; background:var(--gold); content:""; }
.bv-silence-title { max-width:600px; margin:0 0 2.2rem; color:var(--ivory); font:600 clamp(2.4rem,7vw,5rem)/.98 'Playfair Display',Georgia,serif; letter-spacing:-.03em; }
.bv-silence-title em { color:var(--blush); font-style:italic; }
.bv-silence-message { max-width:560px; margin:0 0 1.5rem !important; padding-left:1.25rem; border-left:1px solid rgba(232,191,201,.35); color:rgba(245,240,232,.78) !important; font:400 clamp(1.2rem,2.8vw,1.55rem)/1.5 'Cormorant Garamond',Georgia,serif !important; font-style:normal !important; letter-spacing:.01em; }
.bv-silence-message.show { color:rgba(245,240,232,.9) !important; }
.bv-silence-message--last { padding-top:1rem; border-left-color:var(--rose); color:var(--blush) !important; font-style:italic !important; }
.bv-silence-loves { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.bv-silence-love { position:absolute; bottom:-2rem; color:var(--rose); opacity:0; font-size:clamp(1rem,2vw,1.5rem); filter:drop-shadow(0 0 12px rgba(200,133,154,.65)); animation:bvLoveFloat 12s ease-in-out infinite; }
.bv-silence-love:nth-child(1) { left:8%; animation-delay:-2s; }
.bv-silence-love:nth-child(2) { left:19%; color:var(--blush); animation-delay:-8s; animation-duration:15s; }
.bv-silence-love:nth-child(3) { left:33%; animation-delay:-5s; animation-duration:13s; }
.bv-silence-love:nth-child(4) { left:51%; color:var(--gold); animation-delay:-10s; animation-duration:16s; }
.bv-silence-love:nth-child(5) { left:68%; animation-delay:-4s; }
.bv-silence-love:nth-child(6) { left:79%; color:var(--blush); animation-delay:-12s; animation-duration:14s; }
.bv-silence-love:nth-child(7) { left:91%; animation-delay:-7s; animation-duration:17s; }
@keyframes bvLoveFloat { 0% { opacity:0; transform:translate3d(0,2rem,0) scale(.7) rotate(-12deg); } 18% { opacity:.38; } 70% { opacity:.12; } 100% { opacity:0; transform:translate3d(1.5rem,-30rem,0) scale(1.15) rotate(18deg); } }
.bv-silence-moon { position:absolute; top:clamp(1rem,6vh,4rem); right:clamp(-1.5rem,3vw,2.5rem); z-index:0; width:clamp(5rem,14vw,9rem); height:clamp(5rem,14vw,9rem); border-radius:50%; background:radial-gradient(circle at 34% 30%,#fff8dc 0%,#ffe8b8 48%,#c9a84c 100%); box-shadow:0 0 25px rgba(201,168,76,.35), 0 0 60px rgba(200,133,154,.14); opacity:.8; }
.bv-silence-moon::after { position:absolute; top:14%; left:11%; width:5px; height:5px; border-radius:50%; background:rgba(255,248,220,.55); content:""; box-shadow:32px 40px 0 -1px rgba(255,248,220,.3), 63px 18px 0 -2px rgba(255,248,220,.4); }
@media(max-width:520px){ .bv-silence-inner { text-align:left; } .bv-silence-title { margin-bottom:1.7rem; } .bv-silence-message { padding-left:1rem; } }

/* ── wish list ── */
.bv-wish-grid { display:flex; flex-direction:column; gap:.7rem; max-width:560px; margin:1.5rem auto; }
.bv-wish-item { padding:.85rem 1.3rem; border-left:2px solid var(--rose); background:rgba(255,255,255,.04); color:rgba(245,240,232,.88); font:400 clamp(1rem,2.2vw,1.2rem)/1.55 'Cormorant Garamond',serif; text-align:left; }

/* ── quiet feelings letter ── */
.bv-feelings-letter { position:relative; z-index:1; flex:0 0 auto; width:min(100%,660px); padding:clamp(2.2rem,7vw,4.5rem) clamp(1.4rem,6vw,4.8rem); text-align:left; }
.bv-feelings-letter::before { position:absolute; top:0; left:clamp(1.4rem,6vw,4.8rem); width:58px; height:2px; background:var(--rose); content:""; box-shadow:0 0 18px rgba(200,133,154,.65); }
.bv-feelings-sky { position:absolute; top:clamp(1.7rem,5vw,3rem); right:clamp(1.4rem,6vw,4.8rem); width:38px; height:38px; border-radius:50%; background:var(--gold); box-shadow:0 0 24px rgba(201,168,76,.28); opacity:.9; }
.bv-feelings-sky::before { position:absolute; top:-7px; left:10px; width:38px; height:38px; border-radius:50%; background:#100b16; content:""; }
.bv-feelings-sky::after { position:absolute; top:-13px; left:-28px; width:3px; height:3px; border-radius:50%; background:var(--ivory); content:""; box-shadow:14px 20px 0 -1px var(--blush), 29px 3px 0 -1px var(--ivory), 45px 17px 0 -1px var(--gold); opacity:.8; }
.bv-feelings-lights { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.bv-feelings-light { position:absolute; bottom:-2rem; color:var(--blush); opacity:0; filter:drop-shadow(0 0 10px rgba(232,191,201,.8)); animation:bvFeelingsLight 8s ease-in-out infinite; }
.bv-feelings-light:nth-child(1) { left:9%; animation-delay:-1s; }
.bv-feelings-light:nth-child(2) { left:27%; color:var(--gold); animation-delay:-5s; animation-duration:10s; }
.bv-feelings-light:nth-child(3) { left:58%; animation-delay:-3s; animation-duration:9s; }
.bv-feelings-light:nth-child(4) { left:82%; color:var(--gold); animation-delay:-7s; animation-duration:11s; }
.bv-feelings-light:nth-child(5) { left:43%; color:var(--ivory); animation-delay:-8s; animation-duration:12s; }
.bv-feelings-light:nth-child(6) { left:73%; color:var(--blush); animation-delay:-2s; animation-duration:9.5s; }
.bv-feelings-light:nth-child(7) { left:16%; color:var(--gold); animation-delay:-10s; animation-duration:13s; }
.bv-feelings-light:nth-child(8) { left:92%; color:var(--ivory); animation-delay:-6s; animation-duration:10.5s; }
.bv-feelings-light:nth-child(n+9) { font-size:1rem; }
.bv-feelings-light:nth-child(9) { left:5%; animation-delay:-4s; }
.bv-feelings-light:nth-child(10) { left:35%; color:var(--gold); animation-delay:-9s; animation-duration:11s; }
.bv-feelings-light:nth-child(11) { left:52%; animation-delay:-1s; animation-duration:12s; }
.bv-feelings-light:nth-child(12) { left:66%; animation-delay:-11s; }
.bv-feelings-light:nth-child(13) { left:87%; color:var(--gold); animation-delay:-5s; animation-duration:13s; }
.bv-feelings-light:nth-child(14) { left:22%; animation-delay:-7s; animation-duration:10s; }
.bv-feelings-light:nth-child(15) { left:47%; color:var(--blush); animation-delay:-3s; animation-duration:11.5s; }
.bv-feelings-light:nth-child(16) { left:78%; animation-delay:-12s; animation-duration:12.5s; }
@keyframes bvFeelingsLight { 0% { opacity:0; transform:translate3d(0,2rem,0) scale(.7) rotate(-10deg); } 18% { opacity:.65; } 70% { opacity:.24; } 100% { opacity:0; transform:translate3d(1.8rem,-28rem,0) scale(1.15) rotate(20deg); } }
.bv-feelings-kicker { display:flex; align-items:center; gap:.7rem; margin-bottom:1.2rem; color:var(--gold); font:600 .62rem/1 'Inter',sans-serif; letter-spacing:.22em; text-transform:uppercase; }
.bv-feelings-kicker::before { width:24px; height:1px; background:var(--gold); content:""; }
.bv-feelings-title { max-width:510px; margin:0 0 2.2rem; color:var(--ivory); font:600 clamp(2.15rem,7vw,4.4rem)/.98 'Playfair Display',Georgia,serif; letter-spacing:-.03em; }
.bv-feelings-title em { color:var(--blush); font-style:italic; }
.bv-feelings-block { position:relative; max-width:480px; padding-left:1.15rem; border-left:1px solid rgba(232,191,201,.3); color:rgba(245,240,232,.78); font:400 clamp(1.1rem,2.8vw,1.42rem)/1.48 'Cormorant Garamond',Georgia,serif; }
.bv-feelings-block p { margin:0 0 1.15rem; }
.bv-feelings-block p:last-child { margin-bottom:0; }
.bv-feelings-block strong { color:var(--ivory); font-weight:600; }
.bv-feelings-signoff { max-width:470px; margin:2.1rem 0 0 auto; padding-top:1.35rem; border-top:1px solid rgba(201,168,76,.25); color:var(--blush); font:italic 400 clamp(1.45rem,4vw,2.15rem)/1.12 'Playfair Display',Georgia,serif; text-align:right; }
.bv-feelings-signoff::after { display:block; margin-top:.7rem; color:rgba(201,168,76,.75); content:"— Mani"; font:400 1.25rem/1 'Great Vibes',cursive; }
@media(max-width:520px){ .bv-feelings-letter { padding:2rem 1.3rem 2.5rem; } .bv-feelings-title { margin-bottom:1.8rem; } .bv-feelings-signoff { margin-top:1.7rem; } }

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
.bg-memories { background:radial-gradient(ellipse at 50% 30%, rgba(180,150,200,.15), transparent 40%), linear-gradient(155deg,#0a0815,#12081e,#1a0a25); }
.bg-thankyou { background:radial-gradient(ellipse at 50% 50%, rgba(201,168,76,.18), transparent 35%), linear-gradient(160deg,#050a10,#0a1018,#0f0815); }

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
  "memories", "thankyou",
] as const;
type Page = typeof PAGES[number];

/* ══════════════════════════════════════════════════════════════════════
   NAVIGATION BUTTON LABELS
══════════════════════════════════════════════════════════════════════ */
const BUTTON_LABELS: Record<Page, string> = {
  wait: "Begin →",
  reveal: "Continue →",
  story1: "Next Memory →",
  story2: "Keep Going →",
  story3: "More of You →",
  feelings: "Something I Never Said →",
  transition: "From My Heart →",
  scene: "One Little Wish →",
  wish: "For You →",
  final: "Almost There →",
  memories: "One Last Thing →",
  thankyou: "The Final Wish →",
};

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

  useEffect(() => {
    if (page !== "reveal" && page !== "story1" && page !== "story2" && page !== "story3") return;
    const activePage = document.getElementById(`page-${page}`);
    if (activePage) activePage.scrollTop = 0;
  }, [page]);

  const goTo = useCallback((next: Page) => {
    setLeaving(true);
    setTimeout(() => { setPage(next); setLeaving(false); }, 700);
  }, []);

  const nextPage = useCallback(() => {
    const idx = PAGES.indexOf(page);
    if (idx < PAGES.length - 1) goTo(PAGES[idx + 1]);
  }, [page, goTo]);

  const prevPage = useCallback(() => {
    const idx = PAGES.indexOf(page);
    if (idx > 0) goTo(PAGES[idx - 1]);
  }, [page, goTo]);

  /* auto-advance dark transition lines */
  useEffect(() => {
    if (page !== "transition") return;
    setDarkLines(0);
    const timers = [1200, 3200].map((ms, i) =>
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
    const lineTimers = [4200, 5600].map((ms, i) =>
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
        <Floaters show={["reveal", "wish", "final", "memories", "thankyou"].includes(page)} />
        <Fireworks active={page === "reveal" || page === "wish" || page === "final" || page === "memories"} />

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
                  <button className="bv-btn" onClick={() => goTo("reveal")}>
                    {past ? "Begin →" : "Can't wait — take me in"}
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
              <PhotoSlot src={photo5} caption="Bava" style={{ borderRadius: "50%", aspectRatio: "1" }} />
            </div>

            <span className="bv-mono-line">October 10 · 2026</span>
            <h1 className="bv-big bv-shimmer" style={{ marginBottom: ".5rem" }}>
              Happy<br />Birthday
            </h1>
            <p className="f-script" style={{ fontSize: "clamp(2.5rem,8vw,4.5rem)", color: "var(--blush)", lineHeight: 1, marginBottom: ".5rem" }}>
              {HIM} 🤍
            </p>
            <p className="bv-lead">
              Today is your day…<br />
              and somehow, I wanted to make a little piece of my heart<br />
              just for you.
            </p>
            <div style={{ marginTop: "1.5rem" }}>
              <button className="bv-btn" onClick={() => goTo("story1")}>
                How it started →
              </button>
            </div>
          </div>
        </div>

        {/* ── PAGE 3: STORY — HOW IT STARTED ──────────────────────── */}
        <div id="page-story1" className={`${pageClass("story1")} bg-story`}>
          <div className="bv-eye-scene">
            <img className="bv-eye-fullscreen" src={photo5} alt="A sketch of Bava's eyes in a sunlit notebook" />
            <div className="bv-eye-copy">
              <span className="bv-eye-eyebrow">A little truth from my heart</span>
              <h2 className="bv-eye-title">I never planned to <em>feel this much.</em></h2>
              <div className="bv-eye-message">
                <p>Your eyes hold a softness I find myself remembering. Looking at this sketch brings back all those butterflies, the warmth, and the tenderness I feel whenever I think of you.</p>
                <p><strong>I care for you as you are</strong>, with no expectations or pressure. I only wanted you to know that my feelings are real, gentle, and held with my whole heart.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── PAGE 4: STORY — SOMEHOW YOU BECAME SPECIAL ─────────────────── */}
        <div id="page-story2" className={`${pageClass("story2")} bg-story`}>
          <div className="bv-eye-scene bv-eye-scene--story2">
            <img className="bv-eye-fullscreen bv-eye-fullscreen--story2" src={photo1} alt="Bava smiling in profile" />
          </div>
          <div className="bv-eye-copy bv-eye-copy--below">
            <h2 className="bv-eye-title">Somehow, You Became <em>Special</em></h2>
            <div className="bv-eye-divider" aria-hidden="true" />
            <div className="bv-eye-message bv-eye-message--story2">
              <p>Somewhere between our conversations,<br />and waiting for your messages,<br />you became part of my everyday life.<br />I never planned it; I never knew when.</p>
              <p><strong>But somewhere along the way,<br />my heart simply got used to you. 🤍</strong></p>
              <p>My days quietly look forward to you.</p>
            </div>
          </div>
        </div>

        {/* ── PAGE 5: STORY — THE LITTLE THINGS ─────────────────────────── */}
        <div id="page-story3" className={`${pageClass("story3")} bg-story`}>
          <div className="bv-eye-scene bv-eye-scene--story3">
            <img className="bv-eye-fullscreen bv-eye-fullscreen--story3" src={photo5} alt="Bava smiling in the sunlight" />
            <div className="bv-eye-copy bv-eye-copy--story3">
              <h2 className="bv-eye-title">The Little <em>Things</em></h2>
              <div className="bv-eye-divider" aria-hidden="true" />
              <div className="bv-eye-message bv-eye-message--story2">
                <p>Maybe you never noticed… but your smallest words stayed with me.</p>
                <p>A simple message from you could change my entire day. And sometimes, even seeing your picture was enough to make me smile.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── PAGE 6: FEELINGS ───────────────────────────────────── */}
        <div id="page-feelings" className={`${pageClass("feelings")} bg-feel`} style={{ gap: "1.5rem" }}>
          <div className="bv-feelings-lights" aria-hidden="true">
            <span className="bv-feelings-light">✦</span>
            <span className="bv-feelings-light">✧</span>
            <span className="bv-feelings-light">✦</span>
            <span className="bv-feelings-light">✧</span>
            <span className="bv-feelings-light">·</span>
            <span className="bv-feelings-light">✦</span>
            <span className="bv-feelings-light">✧</span>
            <span className="bv-feelings-light">·</span>
            <span className="bv-feelings-light">🌙</span>
            <span className="bv-feelings-light">✨</span>
            <span className="bv-feelings-light">🤍</span>
            <span className="bv-feelings-light">🌸</span>
            <span className="bv-feelings-light">⭐</span>
            <span className="bv-feelings-light">💫</span>
            <span className="bv-feelings-light">💛</span>
            <span className="bv-feelings-light">🌙</span>
          </div>
          <div className="bv-feelings-letter" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <span className="bv-feelings-sky" aria-hidden="true" />
            <span className="bv-feelings-kicker">A clear note · 05</span>
            <h2 className="bv-feelings-title">About My <em>Feelings</em></h2>
            <div className="bv-feelings-block">
              <p>I never wanted to pressure you or make you uncomfortable.</p>
              <p>I understand what you've told me, Bava, and I respect your feelings.</p>
              <p>You don't owe me an answer. I only wanted to be honest that my feelings were real.</p>
            </div>
            <p className="bv-feelings-signoff">I will always respect your space.</p>
          </div>
        </div>

        {/* ── PAGE 7: DARK TRANSITION ────────────────────────────── */}
        <div id="page-transition" className={`${pageClass("transition")} bg-trans`}>
          <span className="bv-silence-moon" aria-hidden="true" />
          <div className="bv-silence-loves" aria-hidden="true">
            <span className="bv-silence-love">🤍</span>
            <span className="bv-silence-love">💗</span>
            <span className="bv-silence-love">💋</span>
            <span className="bv-silence-love">♡</span>
            <span className="bv-silence-love">💛</span>
            <span className="bv-silence-love">💖</span>
            <span className="bv-silence-love">💋</span>
            <span className="bv-silence-love">🤍</span>
            <span className="bv-silence-love">💕</span>
            <span className="bv-silence-love" style={{ left: "13%", animationDelay: "-9s" }}>🌹</span>
            <span className="bv-silence-love" style={{ left: "29%", animationDelay: "-1s", animationDuration: "15s" }}>🌹</span>
            <span className="bv-silence-love" style={{ left: "44%", animationDelay: "-6s" }}>🌹</span>
            <span className="bv-silence-love" style={{ left: "62%", animationDelay: "-11s", animationDuration: "14s" }}>🌹</span>
            <span className="bv-silence-love" style={{ left: "76%", animationDelay: "-3s" }}>🌹</span>
            <span className="bv-silence-love" style={{ left: "95%", animationDelay: "-13s", animationDuration: "16s" }}>🌹</span>
          </div>
          <div className="bv-dark-reveal bv-inner bv-silence-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <span className="bv-silence-kicker">A thought I kept · 06</span>
            <h2 className="bv-silence-title">Even In The <em>Silence</em></h2>
            <p className={darkLines >= 1 ? "show bv-silence-message" : "bv-silence-message"}>
              There were days I waited for your message,<br />
              checking my phone again and again,<br />
              wondering if you were busy,<br />
              wondering if I had done something wrong.
            </p>
            <p className={darkLines >= 2 ? "show bv-silence-message bv-silence-message--last" : "bv-silence-message bv-silence-message--last"}>
              But even in the silence…<br />
              I still cared.
            </p>

          </div>
        </div>

        {/* ── PAGE 8: KNEELING COUPLE SCENE ──────────────────────── */}
        <div id="page-scene" className={`${pageClass("scene")} bg-scene`} style={{ gap: "1.5rem", paddingBottom: "5rem" }}>
          <div style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: 680, textAlign: "center" }}>
            <span className="bv-eyebrow">Screen 7</span>
            <h2 className="bv-h2" style={{ marginBottom: "1.5rem" }}>If I Ever <em>Hurt You</em></h2>
            
            {/* SVG couple */}
            <div className="bv-scene-wrap">
              <CoupleScene phase={scenePhase} />
            </div>
            
            {/* progressive text */}
            <div className="bv-scene-text" style={{ marginTop: "1rem" }}>
              <p className={`bv-scene-line bv-scene-line--sm ${sceneLine >= 1 ? "bv-scene-line--active" : ""}`}>
                If my words, my feelings,<br />
                or anything I did ever made you uncomfortable,<br />
                I'm truly sorry, Bava. 🥺
              </p>
              <p className={`bv-scene-line bv-scene-line--sm ${sceneLine >= 2 ? "bv-scene-line--active" : ""}`}>
                I never wanted to become a reason<br />
                for your heart to feel heavy.
              </p>

            </div>
          </div>
        </div>

        {/* ── PAGE 9: BIRTHDAY WISH ──────────────────────────────── */}
        <div id="page-wish" className={`${pageClass("wish")} bg-wish`} style={{ gap: "1.5rem", paddingBottom: "5rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <span className="bv-eyebrow">Screen 8</span>
            <h2 className="bv-h2" style={{ marginBottom: "1.5rem" }}>What You Mean <em>To Me</em></h2>
            <p className="bv-lead" style={{ marginBottom: "1.5rem" }}>
              I don't know what place I'll have in your life.<br />
              I don't know what tomorrow will look like.
            </p>
            <p className="bv-lead" style={{ color: "var(--blush)", marginBottom: "1.5rem" }}>
              But I'll always be grateful<br />
              that somewhere in this huge world,<br />
              I got to know you. 🤍
            </p>
          </div>
        </div>

        {/* ── PAGE 10: FINAL ─────────────────────────────────────── */}
        <div id="page-final" className={`${pageClass("final")} bg-final`} style={{ gap: "1.5rem", paddingBottom: "5rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            {/* Final hero photo */}
            <div style={{ width: "min(100%,280px)", margin: "0 auto 2rem", borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(201,168,76,.5)", boxShadow: "0 0 0 12px rgba(201,168,76,.08), 0 0 60px rgba(201,168,76,.3)", animation: "bvGlowPulse 4s ease-in-out infinite" }}>
              <PhotoSlot src={photo5} caption="Bava" style={{ borderRadius: "50%", aspectRatio: "1" }} />
            </div>

            <span className="bv-eyebrow">Screen 9</span>
            <h2 className="bv-h2" style={{ marginBottom: "1.5rem" }}>My Birthday Wish <em>For You</em></h2>
            
            <p className="bv-lead" style={{ marginBottom: "1.5rem" }}>
              Today, I don't want anything from you.
            </p>
            
            <div className="bv-wish-grid">
              {[
                { e: "🌟", w: "I only wish that you stay happy," },
                { e: "🌙", w: "achieve everything you're dreaming about," },
                { e: "💫", w: "find peace wherever you go," },
                { e: "🤍", w: "and never lose the beautiful person you are." },
              ].map(({ e, w }, i) => (
                <div key={i} className="bv-wish-item" style={{ animationDelay: `${i * 0.15}s` }}>
                  <span style={{ marginRight: ".6rem" }}>{e}</span>{w}
                </div>
              ))}
            </div>
            
            <p className="bv-lead" style={{ color: "var(--blush)", marginTop: "1.5rem" }}>
              May life be gentle with you, Bava. 🌙
            </p>
          </div>
        </div>

        {/* ── PAGE 11: MEMORIES ─────────────────────────────────────── */}
        <div id="page-memories" className={`${pageClass("memories")} bg-story`} style={{ gap: "1.5rem", paddingBottom: "5rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <span className="bv-eyebrow">Screen 10</span>
            <h2 className="bv-h2" style={{ marginBottom: "1.5rem" }}>Precious <em>Memories</em></h2>
            
            <p className="bv-lead" style={{ marginBottom: "1.5rem" }}>
              Every moment with you became a memory I treasure.
            </p>
            
            <div className="bv-gallery">
              {[
                { src: photo5, caption: "Where it all began." },
                { src: photo2, caption: "A moment I'll never forget." },
                { src: photo1, caption: "Simple times, deep feelings." },
                { src: photo4, caption: "Your smile says everything." },
                { src: photo3, caption: "The person who matters." },
                { src: photo6, caption: "A memory I keep close." },
              ].map((p, i) => (
                <PhotoSlot key={i} src={p.src} caption={p.caption} />
              ))}
            </div>
          </div>
        </div>

        {/* ── PAGE 12: THANK YOU ─────────────────────────────────────── */}
        <div id="page-thankyou" className={`${pageClass("thankyou")} bg-final`} style={{ gap: "1.5rem", paddingBottom: "5rem" }}>
          <div className="bv-inner" style={{ animation: "bvFadeUp 1.2s ease both" }}>
            <span className="bv-eyebrow">A little world made for you</span>
            <h2 className="bv-h2" style={{ marginBottom: "1.5rem" }}>Made With <em>Care</em></h2>
            
            <p className="bv-lead" style={{ marginBottom: "1.5rem" }}>
              I made this little world with all my effort,
              <br />just for you, Bava.
            </p>
            
            <p className="bv-lead" style={{ color: "var(--blush)", marginBottom: "1.5rem" }}>
              Every word, every memory, and every light<br />
              was chosen with a heart full of care.
            </p>
            
            <div style={{ width: "min(100%,220px)", margin: "2rem auto", borderRadius: "50%", overflow: "hidden", border: "3px solid rgba(201,168,76,.5)", boxShadow: "0 0 0 10px rgba(201,168,76,.06), 0 0 50px rgba(201,168,76,.25)", animation: "bvGlowPulse 3s ease-in-out infinite" }}>
              <PhotoSlot src={photo5} caption="Bava" style={{ borderRadius: "50%", aspectRatio: "1" }} />
            </div>
          </div>
        </div>

        {/* ── NAV: enhanced with back/next buttons ─────────────────────────────────── */}
        {idx >= 2 && (
          <nav className="bv-nav" aria-label="Page navigation">
            <div className="bv-nav-container">
              <button 
                className="bv-nav-back" 
                onClick={prevPage} 
                disabled={idx === 0}
                aria-label="Go to previous page"
              >
                ← Back
              </button>
              <button 
                className="bv-nav-next" 
                onClick={nextPage}
                aria-label="Go to next page"
              >
                {BUTTON_LABELS[page]}
              </button>
            </div>
          </nav>
        )}

        {/* ── SECRET ENDING ─────────────────────────────────────── */}
        {showSecret && (
          <div className="bv-secret" id="secret-ending" role="dialog" aria-label="Secret message">
            <div style={{ maxWidth: "600px", textAlign: "center" }}>
              <h1 className="bv-big bv-shimmer" style={{ marginBottom: "1rem" }}>
                Happy<br />Birthday
              </h1>
              <p className="f-script" style={{ fontSize: "clamp(2.5rem,7vw,4rem)", color: "var(--blush)", marginBottom: "1.5rem", lineHeight: 1 }}>
                {HIM} 🤍
              </p>
              
              <span className="bv-eyebrow">Screen 12 — The Final Wish</span>
              
              <p className={secretStep >= 1 ? "show bv-lead" : "bv-lead"} style={{ fontSize: "clamp(1.1rem,2.5vw,1.4rem)", marginTop: "2rem" }}>
                If one day you remember me,<br />
                I hope you remember the girl<br />
                who cared for you with her whole heart,<br />
                without wanting to change you.
              </p>
              
              <p className={secretStep >= 2 ? "show bv-lead" : "bv-lead"} style={{ fontSize: "clamp(1.1rem,2.5vw,1.4rem)", color: "var(--blush)", marginTop: "1.5rem" }}>
                Thank you for being a part of my story.
              </p>
              
              <p className={secretStep >= 3 ? "show bv-lead" : "bv-lead"} style={{ fontSize: "clamp(1.1rem,2.5vw,1.4rem)", marginTop: "1.5rem" }}>
                Whatever comes next,<br />
                I'm just grateful that you were here. 🥀
              </p>
              
              <div style={{ marginTop: "2rem" }}>
                <p className={`f-script ${secretStep >= 4 ? "show" : ""}`} style={{ fontSize: "clamp(2rem,6vw,3rem)", color: "var(--blush)", lineHeight: 1, opacity: secretStep >= 4 ? 1 : 0, transition: "opacity 1.8s ease" }}>
                  — {HER} 🤍
                </p>
              </div>
              
              {secretStep >= 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", marginTop: "3rem", animation: "bvFadeUp .8s ease both" }}>
                  <button id="btn-restart-from-secret" className="bv-btn" onClick={() => { setShowSecret(false); goTo("wait"); }}>
                    Experience Again ↺
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
