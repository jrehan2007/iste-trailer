"use client";
import { useEffect, useRef, useCallback } from "react";
/* ---------------- Web Audio score (no files needed) ---------------- */
function useScore() {
  const ctx = useRef(null);
  const init = () => { if (!ctx.current) { const C = window.AudioContext || window.webkitAudioContext; if (C) ctx.current = new C(); } return ctx.current; };
  const noise = (c, dur) => { const b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = c.createBufferSource(); s.buffer = b; return s; };
  const env = (c, g, peak, a, r) => { const t = c.currentTime; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + r); };
  const play = useCallback(function play(kind) {
    const c = ctx.current; if (!c || !kind) return;
    try {
      const out = c.destination, t = c.currentTime;
      if (kind === "drone") {
        [41, 61.7].forEach(f => { const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.value = f; o.connect(g).connect(out); env(c, g, 0.18, 2, 60); o.start(); o.stop(t + 63); });
      }
      if (kind === "tick") { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = 1800; o.connect(g).connect(out); env(c, g, 0.08, 0.005, 0.12); o.start(); o.stop(t + .2); }
      if (kind === "braam" || kind === "impact") {
        const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(120, t + 3);
        const g = c.createGain(); f.connect(g).connect(out); env(c, g, kind === "impact" ? 0.5 : 0.35, 0.05, 3.2);
        [55, 55.6, 82.4, 110].forEach(fr => { const o = c.createOscillator(); o.type = "sawtooth"; o.frequency.value = fr; o.connect(f); o.start(); o.stop(t + 3.5); });
        const n = noise(c, 0.6), ng = c.createGain(); n.connect(ng).connect(out); env(c, ng, kind === "impact" ? 0.6 : 0.25, 0.01, 0.5); n.start();
        if (kind === "impact") { const o = c.createOscillator(), g2 = c.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(30, t + 1.5); o.connect(g2).connect(out); env(c, g2, 0.9, 0.01, 1.6); o.start(); o.stop(t + 1.8); }
      }
      if (kind === "riser") {
        const n = noise(c, 4), f = c.createBiquadFilter(), g = c.createGain(); f.type = "bandpass"; f.Q.value = 6;
        f.frequency.setValueAtTime(200, t); f.frequency.exponentialRampToValueAtTime(6000, t + 3.8);
        n.connect(f).connect(g).connect(out); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 3.7); g.gain.exponentialRampToValueAtTime(0.0001, t + 4); n.start();
      }
      if (kind === "beat") { const o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(40, t + .4); o.connect(g).connect(out); env(c, g, 0.9, 0.005, 0.5); o.start(); o.stop(t + .6); }
      if (kind === "assemble") { play("riser"); setTimeout(() => play("impact"), 3000); }
      if (kind === "explode") { play("impact"); setTimeout(() => play("braam"), 150); setTimeout(() => play("chime"), 900); }
      if (kind === "chime") { [523.25, 659.25, 783.99, 1046.5].forEach((fr, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = "triangle"; o.frequency.value = fr; o.connect(g).connect(out); const s = t + i * .18; g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.12, s + .02); g.gain.exponentialRampToValueAtTime(0.0001, s + 3); o.start(s); o.stop(s + 3.2); }); }
    } catch (e) { /* audio is optional */ }
  }, []);
  const stop = () => { try { ctx.current && ctx.current.close(); } catch (e) {} ctx.current = null; };
  return { init, play, stop };
}

/* ---------------- Particle canvas ---------------- */
function Particles({ mode }) {
  const ref = useRef(null), modeRef = useRef(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext("2d"); let raf, w, h;
    const resize = () => { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const P = Array.from({ length: 180 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random(), s: Math.random() * 2 + .5, gold: Math.random() > .35 }));
    const loop = () => {
      const m = modeRef.current;
      ctx.fillStyle = m === "warp" ? "rgba(2,5,10,.25)" : "rgba(2,5,10,.35)"; ctx.fillRect(0, 0, w, h);
      P.forEach(p => {
        if (m === "warp") {
          p.z -= 0.02; if (p.z <= 0.02) { p.z = 1; p.x = Math.random(); p.y = Math.random(); }
          const x = (p.x - .5) * w / p.z + w / 2, y = (p.y - .5) * h / p.z + h / 2, px = (p.x - .5) * w / (p.z + .03) + w / 2, py = (p.y - .5) * h / (p.z + .03) + h / 2;
          ctx.strokeStyle = p.gold ? "rgba(245,210,122,.9)" : "rgba(79,195,224,.9)"; ctx.lineWidth = p.s * (1 - p.z) * 2;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
        } else {
          p.y -= (0.0006 + p.s * 0.0004); p.x += Math.sin(p.y * 20 + p.s) * 0.0004;
          if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
          const a = .35 + .5 * Math.sin(Date.now() / 500 + p.s * 9) ** 2;
          ctx.fillStyle = p.gold ? `rgba(245,190,90,${a})` : `rgba(79,195,224,${a * .7})`;
          ctx.shadowBlur = 12; ctx.shadowColor = p.gold ? "#d4a23c" : "#4fc3e0";
          ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.s, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
        }
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fx" />;
}

/* ---------------- Original hero silhouettes ---------------- */
const Coder = () => (
  <svg viewBox="0 0 200 420">
    <defs><linearGradient id="bodyA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2d48" /><stop offset="1" stopColor="#05090f" /></linearGradient></defs>
    <path className="cape" d="M60 120 L20 400 L180 400 L140 120 Z" fill="#0c1a2d" opacity=".9" />
    <path d="M100 30 c-26 0-40 20-40 44 c0 18 8 30 18 36 l-4 14 h52 l-4-14 c10-6 18-18 18-36 c0-24-14-44-40-44z" fill="url(#bodyA)" />
    <path d="M136 50 c30 10 34 60 18 110 c-4-30-10-60-24-80z" fill="#0f1f35" />
    <path d="M58 124 h84 l16 150 h-30 l-6 126 h-20 l-2-100 h-4 l-2 100 h-20 l-6-126 h-30 z" fill="url(#bodyA)" />
    <path d="M58 130 l-26 110 l16 4 l24-86z M142 130 l20 70 l-30 30 l-8-12 l20-22 l-12-50z" fill="#12233b" />
    <rect x="112" y="215" width="44" height="30" rx="3" fill="#4fc3e0" opacity=".85" transform="rotate(-18 134 230)" />
    <rect className="visor" x="74" y="66" width="52" height="8" rx="4" fill="#4fc3e0" />
  </svg>
);
const Builder = () => (
  <svg viewBox="0 0 200 420">
    <defs><linearGradient id="bodyB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2412" /><stop offset="1" stopColor="#05090f" /></linearGradient></defs>
    <path className="cape" d="M55 118 L10 400 L190 400 L145 118 Z" fill="#1a150a" opacity=".85" />
    <path d="M100 28 c-24 0-38 18-38 42 c0 20 10 34 20 40 l-3 12 h42 l-3-12 c10-6 20-20 20-40 c0-24-14-42-38-42z" fill="url(#bodyB)" />
    <path d="M62 60 q38-40 76 0 q-38-18-76 0z" fill="#0b0a06" />
    <path d="M54 122 h92 l12 150 h-32 l-4 128 h-22 l-2-100 h-4 l-2 100 h-22 l-4-128 h-32 z" fill="url(#bodyB)" />
    <path d="M54 128 l-30 60 l10 60 l14-4 l-6-50 l22-40z M146 128 l26 60 l-8 60 l-14-4 l4-50 l-20-40z" fill="#231d0e" />
    <g transform="translate(40 250)"><circle r="18" fill="none" stroke="#d4a23c" strokeWidth="6" strokeDasharray="7 5" /><circle r="6" fill="#d4a23c" /></g>
    <rect className="visor" x="76" y="64" width="48" height="9" rx="4" fill="#f5d27a" />
  </svg>
);
const City = () => {
  const b = []; let x = 0, i = 0;
  while (x < 1600) { const w = 40 + ((i * 37) % 70), h = 90 + ((i * 53) % 230); b.push({ x, w, h }); x += w + 4; i++; }
  return (
    <svg className="city" viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice">
      {b.map((r, k) => (<g key={k}><rect x={r.x} y={400 - r.h} width={r.w} height={r.h} fill="#060d18" />
        {Array.from({ length: Math.floor(r.h / 22) }).map((_, j) => ((k + j) % 3 === 0 ? <rect key={j} x={r.x + 8} y={400 - r.h + 10 + j * 22} width={r.w - 16} height="3" fill={(k + j) % 2 ? "#d4a23c" : "#4fc3e0"} opacity=".35" /> : null))}</g>))}
    </svg>
  );
};

export { useScore, Particles, Coder, Builder, City };
