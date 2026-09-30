"use client";
import { useEffect, useRef, useState } from "react";
import { Particles, Coder, Builder, City } from "./parts";
import { SITE, DIRECTORS, STORY_TEAMS, ROSTER, FACULTY, initials } from "./data";
import BEATS from "./beats.json";

const CORE = ROSTER.core, GROUPS = ROSTER.groups;
const TOTAL = CORE.length + GROUPS.reduce((a, g) => a + g[1].length, 0);

/* ACT I — story on intro.mp3 */
const STORY = [["l1", 3500], ["l2", 3500], ["offline", 2500], ["night", 8500], ["member", 10500], ["laptop", 4000], ["tour", 10000], ["live", 4500], ["teams", 7500], ["meet", 5500]];

/* ACT II — beat-locked on song.mp3 (auto-pairs reveals if the roster outgrows the song) */
const B = BEATS.filter(b => b >= 3);
const STEPS = (() => { // slower: each Core member holds 4 beats, every Next-Gen face gets 2 beats
  const at = k => B[k] ?? B[B.length - 1] + (k - B.length + 1) * 0.472;
  const s = []; let k = 0;
  CORE.forEach((_, i) => { s.push({ t: at(k), kind: "lead", i }); k += 4; });
  s.push({ t: at(k), kind: "next" }); k += 4;
  GROUPS.forEach((g, gi) => { s.push({ t: at(k), kind: "group", g: gi, n: 0 }); k += 2; for (let j = 1; j <= g[1].length; j++) { s.push({ t: at(k), kind: "group", g: gi, n: j }); k += 2; } k += 1; });
  return { s, end: at(k) + 1 };
})();
const CREDIT_MS = 34000, FINALE_MS = 12500;

function useMixer() {
  const els = useRef({}); const get = n => els.current[n];
  const ramp = (a, to, ms, stop) => { if (!a) return; const v0 = a.volume, st = performance.now();
    const f = () => { const k = Math.min(1, (performance.now() - st) / ms); a.volume = v0 + (to - v0) * k; if (k < 1) requestAnimationFrame(f); else if (stop) a.pause(); }; f(); };
  return { get, bind: n => el => { els.current[n] = el; },
    play: (n, vol = 1, fadeMs = 0) => { const a = get(n); if (!a) return; a.currentTime = 0; a.volume = fadeMs ? 0 : vol; a.play().catch(() => {}); if (fadeMs) ramp(a, vol, fadeMs); },
    out: (n, ms = 1500) => ramp(get(n), 0, ms, true), stopAll: () => Object.values(els.current).forEach(a => a && a.pause()) };
}

function Face({ p, cls }) {
  const [bad, setBad] = useState(false);
  return p.photo && !bad ? <img className={cls} src={p.photo} alt={p.name} onError={() => setBad(true)} /> : <div className={cls + " mono-face"}>{initials(p.name)}</div>;
}
const Gear = () => (<svg viewBox="-60 -60 120 120"><g fill="#0a1f4a">{Array.from({ length: 10 }).map((_, i) => <rect key={i} x="-8" y="-58" width="16" height="20" rx="3" transform={`rotate(${i * 36})`} />)}<circle r="42" /></g><circle r="22" fill="#fff" /></svg>);
const Torch = () => (<svg viewBox="0 0 100 200"><path d="M50 8 C70 40 78 60 62 90 C72 60 55 50 50 30 C45 55 30 60 38 90 C22 60 30 35 50 8Z" fill="#d4962c" /><rect x="26" y="92" width="48" height="12" rx="3" fill="#0a1f4a" /><path d="M32 106 h36 l-10 88 h-16z" fill="#0a1f4a" /></svg>);
const Compass = () => (<svg viewBox="0 0 100 200"><circle cx="50" cy="26" r="14" fill="none" stroke="#0a1f4a" strokeWidth="8" /><path d="M44 36 L14 190 L24 190 L50 50 L76 190 L86 190 L56 36Z" fill="#0a1f4a" /></svg>);

function Reveal() {
  return (<div className="scene revealScene"><div className="build">
    <svg viewBox="0 0 400 400" className="buildSvg">
      <defs><path id="arcT" d="M42 200 A158 158 0 0 1 358 200" /><path id="arcB" d="M28 200 A172 172 0 0 0 372 200" /></defs>
      <circle cx="200" cy="200" r="190" className="b-ring" /><circle cx="200" cy="200" r="142" className="b-white" />
      <circle cx="200" cy="200" r="165" className="b-band" /><circle cx="200" cy="200" r="142" className="b-inner" />
      <g className="b-text"><text><textPath href="#arcT" startOffset="50%" textAnchor="middle">INDIAN SOCIETY FOR TECHNICAL EDUCATION</textPath></text>
        <text><textPath href="#arcB" startOffset="50%" textAnchor="middle" className="bt2">EASWARI STUDENT CHAPTER</textPath></text></g>
      <text x="200" y="262" textAnchor="middle" className="b-iste">ISTE</text>
      <text x="200" y="284" textAnchor="middle" className="b-tag">INNOVATION · TECHNICAL EXCELLENCE · ENDLESS POSSIBILITIES</text>
    </svg>
    <div className="bi b-book"><svg viewBox="0 0 200 60"><path d="M100 18 C75 4 40 4 8 10 L8 52 C40 46 75 46 100 58 C125 46 160 46 192 52 L192 10 C160 4 125 4 100 18Z" fill="#fff" stroke="#0a1f4a" strokeWidth="6"/><path d="M100 18 L100 58" stroke="#0a1f4a" strokeWidth="5"/><path d="M20 18 C45 13 75 14 92 24 M108 24 C125 14 155 13 180 18" stroke="#d4a23c" strokeWidth="4" fill="none"/></svg></div><div className="bi b-gear"><Gear /></div><div className="bi b-torch"><Torch /></div><div className="bi b-comp"><Compass /></div>
    <div className="realLogo"><div className="rays" /><div className="ring" /><div className="ring r2" /><div className="ring r3" /><img src="/logo.png" alt="ISTE Easwari Student Chapter" /></div>
  </div><div className="whiteout drop" /><div className="mono" style={{ marginTop: "4vh", animation: "sceneIn 1s 5.6s both" }}>ISTE · Easwari Student Chapter</div></div>);
}

function Scene({ id }) {
  switch (id) {
    case "l1": return <div className="scene"><div className="line">Every chapter begins in the dark…</div></div>;
    case "l2": return <div className="scene"><div className="line">…with an idea nobody else can see.</div></div>;
    case "offline": return <div className="scene shake"><div className="mono">// campus.network — status</div><div className="glitch" data-t="SIGNAL LOST" style={{ marginTop: 16 }}>SIGNAL LOST</div></div>;
    case "night": return (<><div className="moon" /><div className="lightning" /><City />
      <div className="walker left"><Coder /></div><div className="walker right"><Builder /></div>
      <div className="arm al" /><div className="arm ar" /><div className="handshake" />
      <div className="capTop"><div className="mono">Ramapuram · 02:14 AM</div></div>
      <div className="capSlot"><div className="line c1">Two strangers. One skyline.</div><div className="line c2">One handshake started it all.</div></div></>);
    case "member": return (<div className="scene memberScene">
      <div className="mcard2"><div className="mflip"><img src="/card.jpg" alt="ISTE membership card" /><div className="scan" /><div className="sheen" /></div></div>
      <div className="mText2"><div className="mono">Digital credential · ISTE-EEC-2026</div>
        <div className="mBig">MEMBERSHIP</div><div className="glitch mSoon" data-t="COMING SOON">COMING SOON</div><div className="mReady">Get ready, folks.</div></div></div>);
    case "laptop": return (<div className="scene"><div className="laptop"><div className="screen"><img src="/shots/home.jpg" alt="" /></div><div className="base" /></div></div>);
    case "tour": return <div className="scene"><div className="mono" style={{ position: "absolute", top: "13vh" }}>// Inside the new headquarters</div>
      <div className="tour">{["home", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((n, i) => <img key={n} src={`/shots/${n}.jpg`} alt="" className="shot" style={{ animationDelay: `${i * 1.05}s` }} />)}</div></div>;
    case "live": return <div className="scene"><div className="mono" style={{ color: "#fff" }}><span className="dot" />Broadcast · Now</div><div className="live" style={{ marginTop: 18 }}>OUR WEBSITE IS LIVE</div><div className="url">{SITE}</div></div>;
    case "teams": return <div className="scene"><div className="line" style={{ animation: "sceneIn 1s both" }}>7 TEAMS. ONE MISSION.</div>
      <div className="teams">{STORY_TEAMS.map(([n, d], i) => <div key={n} className="team" style={{ animationDelay: `${0.8 + i * 0.5}s` }}>{n.toUpperCase()}<span>{d}</span></div>)}</div></div>;
    case "meet": return <div className="scene blurIn"><div className="pillarsTitle" style={{ fontSize: "clamp(40px,8vw,160px)" }}>MEET THE PILLARS</div><div className="heroRole" style={{ marginTop: "2vh" }}>of ISTE Easwari · Tenure 2026 – 27</div></div>;
    default: return null;
  }
}

function Pillars({ t }) {
  const cur = [...STEPS.s].reverse().find(s => t >= s.t);
  if (!cur) return <div className="scene"><div className="mono">Act II · The Pillars</div><div className="pillarsTitle" style={{ fontSize: "clamp(40px,8vw,160px)" }}>CORE TEAM</div><div className="heroRole" style={{ marginTop: "2vh" }}>Tenure {ROSTER.tenure}</div></div>;
  if (cur.kind === "lead") { const p = CORE[cur.i];
    return <div className="scene"><div className="beam" /><div className="hero" key={cur.i}><Face p={p} cls="heroFace" />
      <div className="heroText"><div className="mono">Core Team · {ROSTER.tenure} · {String(cur.i + 1).padStart(2, "0")} / {CORE.length}</div><div className="heroName">{p.name}</div><div className="heroRole">{p.role}</div></div></div></div>; }
  if (cur.kind === "next") return <div className="scene"><div className="mono">II Year</div><div className="pillarsTitle" style={{ fontSize: "clamp(34px,6.5vw,130px)" }}>THE NEXT GEN</div><div className="heroRole" style={{ marginTop: "2vh" }}>The legacy is built with…</div></div>;
  const [gname, list] = GROUPS[cur.g];
  return <div className="scene"><div className="gHead" key={"h" + cur.g}><span className="mono">The Next Gen · {cur.g + 1}/{GROUPS.length}</span><div className="gName">{gname}</div></div>
    <div className={"gGrid n" + Math.min(list.length, 8)} key={"g" + cur.g}>{list.slice(0, cur.n).map(p =>
      <div className="gCard" key={p.name}><Face p={p} cls="gFace" /><div className="gN">{p.name}</div><div className="gR">{p.role}</div></div>)}</div></div>;
}

function Finale() {
  return <div className="scene finaleScene"><div className="fcount">{["3", "2", "1"].map((c, i) => <span key={c} style={{ animationDelay: `${[1.53, 2.43, 3.32][i]}s` }}>{c}</span>)}</div>
    <div className="whiteout fin" /><div className="burst" />
    <div className="finale"><div className="logoWrap small"><div className="rays" /><div className="ring" /><div className="ring r2" /><img src="/logo.png" alt="" /></div>
      <div className="prodBig">ISTE EASWARI<br />STUDENT CHAPTER</div></div></div>;
}

function Credits() {
  const next = GROUPS.flatMap(g => g[1]);
  const Row = ({ p }) => <div><span>{p.role}</span><b>{p.name}</b></div>;
  return <div className="crawlWrap"><div className="crawl" style={{ animationDuration: `${CREDIT_MS}ms` }}>
    <div className="cRole">WRITTEN &amp; DIRECTED BY</div>{DIRECTORS.map(d => <div className="cBig" key={d}>{d}</div>)}
    <div className="cRole">PRODUCED BY</div><div className="cBig">ISTE Easwari Student Chapter</div>
    <div className="cRole">CORE TEAM · {ROSTER.tenure}</div><div className="cGrid">{CORE.map(p => <Row p={p} key={p.name} />)}</div>
    <div className="cRole">THE NEXT GEN · II YEAR</div><div className="cGrid">{next.map(p => <Row p={p} key={p.name} />)}</div>
    <div className="cRole">SPECIAL THANKS</div><div className="cBig">Easwari Engineering College, Ramapuram</div>
    {FACULTY.map(([r, n]) => <div key={n}><div className="cRole" style={{ marginTop: "4vh" }}>{r.toUpperCase()}</div><div className="cBig">{n}</div></div>)}
    <div className="cRole" style={{ marginTop: "10vh" }}><span className="dot" />OUR WEBSITE IS LIVE</div>
    <div className="live" style={{ fontSize: "clamp(28px,4vw,80px)" }}>CHECK IT OUT</div><div className="url" style={{ animation: "none" }}>{SITE}</div>
  </div></div>;
}

export default function Trailer() {
  const [phase, setPhase] = useState("idle"); // idle|begin|reveal|story|pillars|finale|credits|end
  const [idx, setIdx] = useState(0); const [t, setT] = useState(0);
  const mix = useMixer();

  useEffect(() => {
    if (phase === "begin") { const x = setTimeout(() => setPhase("reveal"), 4500); return () => clearTimeout(x); }
    if (phase === "reveal") { mix.play("reveal", 1, 1200);
      const d = setTimeout(() => { const a = mix.get("reveal"); if (a) { const st = performance.now(); const f = () => { const k = Math.min(1, (performance.now() - st) / 3500); a.playbackRate = 1 - 0.25 * k; if (k < 1) requestAnimationFrame(f); }; f(); } mix.out("reveal", 3500); }, 8500);
      const x = setTimeout(() => { const a = mix.get("reveal"); if (a) a.playbackRate = 1; setPhase("storyTitle"); }, 12500); return () => { clearTimeout(d); clearTimeout(x); }; }
    if (phase === "storyTitle") { const x = setTimeout(() => { setIdx(0); setPhase("story"); }, 5000); return () => clearTimeout(x); }
    if (phase === "story") mix.play("intro", 0.9, 1500);
    if (phase === "pillars") mix.out("intro", 1200);
    if (phase === "legacy") { mix.out("song", 2500); const x = setTimeout(() => setPhase("finale"), 4000); return () => clearTimeout(x); }
    if (phase === "finale") { mix.play("finale", 1); const x = setTimeout(() => setPhase("credits"), FINALE_MS); return () => clearTimeout(x); }
    if (phase === "credits") { // same title track keeps playing straight through Written & Directed
      const f = setTimeout(() => mix.out("finale", 4000), CREDIT_MS - 4000); const x = setTimeout(() => setPhase("end"), CREDIT_MS); return () => { clearTimeout(f); clearTimeout(x); }; }
  }, [phase]); // eslint-disable-line

  useEffect(() => {
    if (phase !== "story") return;
    const x = setTimeout(() => (idx < STORY.length - 1 ? setIdx(idx + 1) : setPhase("pillars")), STORY[idx][1]);
    return () => clearTimeout(x);
  }, [phase, idx]);

  useEffect(() => {
    if (phase !== "pillars") return;
    mix.play("song", 1); const a = mix.get("song"); const t0 = performance.now(); let raf;
    const tick = () => { const tt = a && !a.paused && a.currentTime > 0 ? a.currentTime : (performance.now() - t0) / 1000; setT(tt);
      if (tt >= STEPS.end) return setPhase("legacy"); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [phase]); // eslint-disable-line

  const begin = () => { setIdx(0); setT(0); setPhase("begin"); };
  const replay = () => { mix.stopAll(); setPhase("idle"); setTimeout(begin, 60); };
  const NEXT = { begin: "reveal", reveal: "storyTitle", storyTitle: "story", story: "pillars", pillars: "legacy", legacy: "finale", finale: "credits", credits: "end" };
  const skip = () => { if (phase !== "finale") mix.stopAll(); NEXT[phase] && setPhase(NEXT[phase]); };
  const sid = STORY[idx][0];
  const warp = (phase === "story" && sid === "laptop") || phase === "finale";
  const showBg = ["story", "pillars", "credits"].includes(phase);

  return (
    <main className="stage bars">
      {["reveal", "intro", "song", "finale"].map(n => <audio key={n} ref={mix.bind(n)} src={`/audio/${n}.mp3`} preload="auto" />)}
      <Particles mode={warp ? "warp" : "embers"} />
      <video className={"bgv" + (showBg ? " on" : "") + (phase === "story" ? "" : " dim")} autoPlay muted loop playsInline><source src="/bg.webm" type="video/webm" /><source src="/bg.mp4" type="video/mp4" /></video>
      {phase === "begin" && <div className="scene"><div className="mono" style={{ animation: "sceneIn 1.5s both" }}>Tenure 2026 – 27</div><div className="line" style={{ animationDuration: "4.5s", marginTop: 16 }}>THE GAME BEGINS</div></div>}
      {phase === "reveal" && <Reveal />}
      {phase === "storyTitle" && <div className="scene"><div className="mono" style={{ animation: "sceneIn 1s 1.4s both" }}>Chapter One</div><div className="goldLine" style={{ animationDelay: "1.6s" }}>THE STORY BEGINS</div></div>}
      {phase === "legacy" && <div className="scene"><div className="goldLine">THE LEGACY CONTINUES…</div><div className="mono" style={{ marginTop: "2vh", animation: "sceneIn 1s 1s both" }}>ISTE Easwari Student Chapter · 2026 – 27</div></div>}
      {phase === "story" && <Scene key={idx} id={sid} />}
      {phase === "pillars" && <Pillars t={t} />}
      {phase === "finale" && <Finale />}
      {phase === "credits" && <Credits />}
      {phase === "end" && <div className="scene"><img src="/logo.png" alt="" style={{ width: "16vh", marginBottom: 24 }} /><div className="mono">ISTE Easwari Student Chapter</div>
        <div style={{ display: "flex", gap: 16, marginTop: 30 }}><button className="btn" onClick={replay}>REPLAY</button>
          <a className="btn" href={`https://${SITE}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>ENTER SITE</a></div></div>}
      {phase === "idle" && <div className="start"><div className="mono">ISTE Easwari · Tenure 2026-27 · Sound on · F11</div><button className="btn" onClick={begin}>▶ BEGIN</button></div>}
      {!["idle", "end"].includes(phase) && <button className="skip" onClick={skip}>SKIP ›</button>}
      <div className="vignette" /><div className="grain" />
    </main>
  );
}
