// Pulls the CURRENT office bearers (names, roles, photos) from the live ISTE website database.
// Usage: put SUPABASE_ANON_KEY=... in .env.local (same value as VITE_SUPABASE_ANON_KEY on Vercel), then `npm run sync`.
import fs from "fs"; import path from "path";
const env = Object.fromEntries((fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "").split("\n").filter(l => l.includes("=")).map(l => [l.split("=")[0].trim(), l.slice(l.indexOf("=") + 1).trim()]));
const URL = env.SUPABASE_URL || "https://zlojmbjkebndetthzknv.supabase.co", KEY = env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const EXCLUDE = ["shreevathson"];
if (!KEY) { console.log("[sync] no SUPABASE_ANON_KEY in .env.local — using built-in roster."); process.exit(0); }
const h = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const get = async q => { const r = await fetch(`${URL}/rest/v1/${q}`, { headers: h }); if (!r.ok) throw new Error(r.status + " " + (await r.text())); return r.json(); };
try {
  const [ten] = await get("tenures?select=id,label&is_current=eq.true&limit=1");
  const rows = (await get(`team_members?select=name,role,is_head,year,photo_url,sort_order,domains(name,sort_order)&tenure_id=eq.${ten.id}&order=is_head.desc,sort_order.asc,name.asc`))
    .filter(r => !EXCLUDE.some(x => r.name.toLowerCase().includes(x)));
  fs.mkdirSync("public/faces/live", { recursive: true });
  const local = async (r, i) => { if (!r.photo_url) return null; try { const res = await fetch(r.photo_url); if (!res.ok) return null;
    const f = `live/${i}-${r.name.replace(/[^a-z0-9]/gi, "").toLowerCase()}.jpg`; fs.writeFileSync(path.join("public/faces", f), Buffer.from(await res.arrayBuffer())); return `/faces/${f}`; } catch { return null; } };
  const people = await Promise.all(rows.map(async (r, i) => ({ name: r.name.trim(), role: r.role || r.domains?.name || "Member", year: r.year || "", photo: await local(r, i), domain: r.domains?.name || null, dOrder: r.domains?.sort_order ?? 99 })));
  const isThird = p => /\bIII\b|3rd|third|^3/i.test(p.year);
  const core = people.filter(isThird);
  const map = new Map();
  people.filter(p => !isThird(p)).forEach(p => { const k = p.domain ? p.domain.replace(/\bhead\b/i, "").trim() + " Team" : "Leadership Council"; if (!map.has(k)) map.set(k, { o: p.domain ? p.dOrder : -1, m: [] }); map.get(k).m.push(p); });
  const groups = [...map.entries()].sort((a, b) => a[1].o - b[1].o).map(([k, v]) => [k, v.m]);
  fs.writeFileSync("app/live.json", JSON.stringify({ tenure: ten.label, core, groups }, null, 1));
  console.log(`[sync] ${ten.label}: ${core.length} core + ${people.length - core.length} next-gen, ${people.filter(p => p.photo).length} photos saved.`);
} catch (e) { console.log("[sync] could not reach the website database (" + e.message + ") — using built-in roster."); }
