"use client";
import { useEffect, useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface PriceData { price: string; change: string; raw: number; }
interface PolyData { yes: number; label: string; rec: string; risk: string; }
interface FCALead { name: string; job: string; value: number; stage: string; }

// ─── Config ───────────────────────────────────────────────────────────────────
const ASSETS = [
  { symbol: "BTC_USDT", label: "Bitcoin", short: "BTC", target: 80000, hold: "Accumulate $69-71K" },
  { symbol: "ETH_USDT", label: "Ethereum", short: "ETH", target: 2400, hold: "Stack $2100-2200" },
  { symbol: "ONDO_USDT", label: "Ondo Finance", short: "ONDO", target: 0.73, hold: "Hold — EOY target $0.73" },
  { symbol: "SOL_USDT", label: "Solana", short: "SOL", target: 110, hold: "Watch $95 breakout" },
];

const POLY_TARGETS = [
  { label: "Clarity Act Signed 2026", rec: "BUY YES ~62¢", risk: "MEDIUM", rationale: "Direct ONDO/RWA catalyst. Double dip.", slug: "clarity" },
  { label: "US Recession EOY 2026", rec: "BUY YES ~35¢", risk: "LOW-MED", rationale: "Portfolio hedge. Hawkish Fed + oil $112+.", slug: "recession" },
  { label: "Iran Ceasefire Mar 31", rec: "BUY NO ~84¢", risk: "LOW", rationale: "Ceasefire in 6 days highly unlikely.", slug: "iran" },
];

const CRON_JOBS = [
  { name: "🌙 Overnight Product Builder", schedule: "11:00 PM ET nightly", nextRun: "11:00 PM ET" },
  { name: "📊 Market Scan 6AM ET", schedule: "6:00 AM ET daily", nextRun: "6:00 AM ET" },
  { name: "📊 Market Scan 6PM ET", schedule: "6:00 PM ET daily", nextRun: "6:00 PM ET" },
];

const TASKS = [
  { task: "Update @Vanta69 Twitter bio + Gumroad link", priority: "HIGH" },
  { task: "Fund Polymarket → Clarity Act YES + Recession hedge ($70)", priority: "HIGH" },
  { task: "Post 3 FCA Marketplace listings", priority: "HIGH" },
  { task: "Set up Google Business Profile for FCA", priority: "MED" },
  { task: "Monitor Gumroad — launch paid v2 at 20+ downloads", priority: "MED" },
  { task: "Refresh Facebook Page token (60-day expiry)", priority: "MED" },
  { task: "Drop playbook in 2–3 contractor Facebook groups", priority: "MED" },
  { task: "Twitter Basic API tier at 50-100 followers (~$100/mo)", priority: "LOW" },
];

const PILLARS = [
  { icon: "🪙", label: "Crypto + Prediction Markets", status: "ACTIVE", color: "orange" },
  { icon: "🏗️", label: "Florida Concrete Alliance", status: "ACTIVE", color: "blue" },
  { icon: "💻", label: "Autonomous Online Business", status: "LAUNCHING", color: "green" },
];

// ─── Sparkline SVG (pure, no deps) ───────────────────────────────────────────
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;
  const w = 80, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={pts} fill="none" stroke={positive ? "#4ade80" : "#f87171"} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Badges ──────────────────────────────────────────────────────────────────
function PriorityBadge({ p }: { p: string }) {
  const c: Record<string, string> = { HIGH: "bg-red-500/20 text-red-300 border-red-500/30", MED: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", LOW: "bg-slate-600/40 text-slate-400 border-slate-600/30" };
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${c[p] || c.LOW}`}>{p}</span>;
}
function RiskBadge({ r }: { r: string }) {
  const c: Record<string, string> = { LOW: "text-green-400", "LOW-MED": "text-yellow-400", MEDIUM: "text-orange-400", HIGH: "text-red-400" };
  return <span className={`text-xs font-bold ${c[r] || "text-slate-400"}`}>{r} RISK</span>;
}

// ─── Password Gate ────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const attempt = () => { if (val === "Vanta2026") { onUnlock(); } else { setErr(true); setTimeout(() => setErr(false), 1500); } };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Tauschus · Mission Control</p>
          <h1 className="text-2xl font-black text-white">Operations Dashboard</h1>
          <p className="text-sm text-slate-500">Private access only</p>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Enter password"
            className={`w-full rounded-xl border ${err ? "border-red-500" : "border-slate-700"} bg-slate-950 px-4 py-3 text-white placeholder-slate-600 focus:border-orange-400 focus:outline-none transition`}
            autoFocus
          />
          {err && <p className="text-xs text-red-400 text-center">Incorrect password</p>}
          <button onClick={attempt} className="w-full rounded-xl bg-orange-400 py-3 font-bold text-slate-950 hover:bg-orange-300 transition shadow-lg shadow-orange-500/20">
            Access Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [history, setHistory] = useState<Record<string, number[]>>({});
  const [poly, setPoly] = useState<PolyData[]>([]);
  const [fcaLeads, setFcaLeads] = useState<FCALead[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [polyOdds, setPolyOdds] = useState<Record<string, string>>({});

  const fetchCrypto = useCallback(async () => {
    try {
      const r = await fetch("https://api.crypto.com/exchange/v1/public/get-tickers");
      const d = await r.json();
      const newPrices: Record<string, PriceData> = {};
      const newAlerts: string[] = [];
      for (const t of d?.result?.data || []) {
        const asset = ASSETS.find(a => a.symbol === t.i);
        if (asset) {
          const raw = parseFloat(t.a);
          const change = parseFloat(t.c) * 100;
          newPrices[t.i] = {
            price: raw < 1 ? raw.toFixed(4) : raw.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: change.toFixed(2),
            raw,
          };
          // Update price history
          setHistory(prev => {
            const arr = [...(prev[t.i] || []), raw].slice(-20);
            return { ...prev, [t.i]: arr };
          });
          // Alerts
          if (asset.short === "BTC" && raw < 68000) newAlerts.push("⚠️ BTC dropped below $68K — monitor closely");
          if (asset.short === "BTC" && raw > 75000) newAlerts.push("🚀 BTC above $75K — consider taking partial profit");
          if (asset.short === "ONDO" && raw > 0.35) newAlerts.push("📈 ONDO broke $0.35 — consider adding position");
          if (asset.short === "SOL" && raw > 95) newAlerts.push("🔥 SOL broke $95 — breakout confirmed");
          if (change < -5) newAlerts.push(`⚠️ ${asset.short} down ${Math.abs(change).toFixed(1)}% — significant drop`);
        }
      }
      setPrices(newPrices);
      if (newAlerts.length) setAlerts(prev => [...new Set([...newAlerts, ...prev])].slice(0, 5));
    } catch {}
  }, []);

  const fetchPoly = useCallback(async () => {
    try {
      const res = await fetch("https://gamma-api.polymarket.com/markets?closed=false&limit=50&order=volume24hr&ascending=false");
      const data = await res.json();
      const markets = Array.isArray(data) ? data : data?.markets || [];
      const odds: Record<string, string> = {};
      const keywords: Record<string, string> = {
        "clarity": "Clarity Act Signed 2026",
        "recession": "US Recession EOY 2026",
        "iran ceasefire": "Iran Ceasefire Mar 31",
      };
      for (const m of markets) {
        const q = (m.question || "").toLowerCase();
        for (const [key, label] of Object.entries(keywords)) {
          if (q.includes(key) && m.outcomePrices) {
            try {
              const prices = typeof m.outcomePrices === "string" ? JSON.parse(m.outcomePrices) : m.outcomePrices;
              odds[label] = (parseFloat(prices[0]) * 100).toFixed(1) + "¢";
            } catch {}
          }
        }
      }
      setPolyOdds(odds);
    } catch {}
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchCrypto(), fetchPoly()]);
    setLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    setLoading(false);
  }, [fetchCrypto, fetchPoly]);

  useEffect(() => {
    if (!unlocked) return;
    refresh();
    const iv = setInterval(refresh, 60000);
    return () => clearInterval(iv);
  }, [unlocked, refresh]);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  // AUM calc
  const aumAssets = [
    { sym: "BTC_USDT", qty: 0 }, { sym: "ETH_USDT", qty: 0 },
    { sym: "ONDO_USDT", qty: 0 }, { sym: "SOL_USDT", qty: 0 },
  ];
  const totalAUM = aumAssets.reduce((s, a) => s + (prices[a.sym]?.raw || 0) * a.qty, 0);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Tauschus · Mission Control</p>
            <h1 className="mt-0.5 text-3xl font-black text-white">Operations Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {alerts.length > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs font-bold text-red-300">{alerts.length} Alert{alerts.length > 1 ? "s" : ""}</span>
              </div>
            )}
            <div className="text-right">
              <p className="text-xs text-slate-500">Auto-refreshes every 60s</p>
              <p className="text-xs font-semibold text-slate-400">{lastUpdated || "Loading..."}</p>
              <button onClick={refresh} className="text-xs text-orange-400 hover:text-orange-300 transition">↻ Refresh now</button>
            </div>
          </div>
        </div>

        {/* ── Alerts ── */}
        {alerts.length > 0 && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-red-400">🔔 Active Alerts</p>
            {alerts.map((a, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-slate-900/60 px-3 py-2">
                <p className="text-sm text-red-200">{a}</p>
                <button onClick={() => setAlerts(prev => prev.filter((_, j) => j !== i))} className="text-xs text-slate-600 hover:text-slate-400">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* ── Pillar Status Bar ── */}
        <div className="grid grid-cols-3 gap-3">
          {PILLARS.map(p => (
            <div key={p.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">{p.icon}</span>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{p.label}</p>
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-black ${p.status === "ACTIVE" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Crypto Prices ── */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400">🪙 White Investment Fund — Live Prices</p>
            <p className="text-xs text-slate-500">AUM: <span className="font-bold text-white">${totalAUM.toFixed(2)}</span> <span className="text-slate-600">(update qty to track)</span></p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ASSETS.map(a => {
              const d = prices[a.symbol];
              const change = d ? parseFloat(d.change) : 0;
              const positive = change >= 0;
              const pct = d ? Math.abs((d.raw - a.target) / a.target * 100).toFixed(0) : null;
              return (
                <div key={a.symbol} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400">{a.short}</span>
                    {d && <span className={`text-xs font-bold ${positive ? "text-green-400" : "text-red-400"}`}>{positive ? "+" : ""}{d.change}%</span>}
                  </div>
                  <p className="text-2xl font-black text-white">
                    {loading && !d ? <span className="text-slate-700">—</span> : d ? `$${d.price}` : <span className="text-slate-600">N/A</span>}
                  </p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{a.label}</p>
                      {pct && <p className="text-xs text-slate-600">Target: ${a.target.toLocaleString()} <span className="text-orange-400/70">({pct}% away)</span></p>}
                    </div>
                    <Sparkline data={history[a.symbol] || []} positive={positive} />
                  </div>
                  <div className="rounded-lg bg-slate-800/80 px-2 py-1">
                    <p className="text-xs text-orange-300/80">{a.hold}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Polymarket ── */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">🎯 Polymarket — Active Opportunities</p>
          <div className="grid gap-3 lg:grid-cols-3">
            {POLY_TARGETS.map(m => (
              <div key={m.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-white leading-tight">{m.label}</p>
                  <RiskBadge r={m.risk} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Live YES price</p>
                  <p className="text-3xl font-black text-orange-400">{polyOdds[m.label] || (loading ? "—" : "~?")}</p>
                </div>
                <div className="rounded-xl bg-orange-400/10 border border-orange-400/20 px-3 py-2">
                  <p className="text-xs font-black text-orange-300">{m.rec}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{m.rationale}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3">
            <p className="text-xs text-slate-500">💡 <strong className="text-slate-300">Recommended allocation:</strong> Fund Polymarket with $70 USDC → Clarity Act YES (~$40) + Recession hedge (~$30). Analysis only — confirm before executing.</p>
          </div>
        </section>

        {/* ── FCA Pipeline + Online ── */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* FCA */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-400">🏗️ FCA Lead Pipeline</p>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-400">{fcaLeads.length} Active Leads</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["Leads", fcaLeads.length], ["Quoted", 0], ["Won", 0]].map(([label, val]) => (
                <div key={label as string} className="rounded-xl bg-slate-800/60 py-3">
                  <p className="text-2xl font-black text-white">{val}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            {fcaLeads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 py-6 text-center">
                <p className="text-sm text-slate-600">No active leads yet</p>
                <p className="mt-1 text-xs text-slate-700">Post Marketplace listings to start the pipeline</p>
              </div>
            ) : (
              <div className="space-y-2">
                {fcaLeads.map((l, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-2">
                    <div><p className="text-sm font-semibold text-white">{l.name}</p><p className="text-xs text-slate-500">{l.job}</p></div>
                    <div className="text-right"><p className="text-sm font-bold text-orange-400">${l.value.toLocaleString()}</p><p className="text-xs text-slate-500">{l.stage}</p></div>
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-xl bg-orange-400/10 border border-orange-400/20 px-3 py-2">
              <p className="text-xs font-black text-orange-300">NEXT MOVE</p>
              <p className="mt-0.5 text-xs text-slate-300">Post 3 Marketplace listings — Jacksonville demand is live</p>
            </div>
          </section>

          {/* Online Business */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400">💻 Online Business — Status</p>
            <div className="grid grid-cols-2 gap-2">
              {[["Gumroad Product", "LIVE ✅"], ["Twitter", "@Vanta69"], ["tauschus.com", "Updated ✅"], ["Facebook FCA", "Posted ✅"]].map(([label, val]) => (
                <div key={label} className="rounded-xl bg-slate-800/60 px-3 py-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-bold text-white">{val}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/40 px-4 py-3 space-y-1.5">
              <p className="text-xs font-bold text-slate-400">GUMROAD PLAYBOOK</p>
              <a href="https://vantaai3.gumroad.com/l/AIplaybook1" target="_blank" rel="noreferrer" className="block text-xs text-orange-400 hover:text-orange-300 truncate">vantaai3.gumroad.com/l/AIplaybook1</a>
              <p className="text-xs text-slate-500">Free → Paid v2 at 20+ downloads · Target $19–29</p>
            </div>
            <div className="rounded-xl bg-orange-400/10 border border-orange-400/20 px-3 py-2">
              <p className="text-xs font-black text-orange-300">NEXT MOVE</p>
              <p className="mt-0.5 text-xs text-slate-300">Update Twitter bio + Gumroad link → 10 manual replies/day</p>
            </div>
          </section>
        </div>

        {/* ── Cron Jobs + Tasks ── */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* Cron */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-orange-400">⏰ Automated Systems</p>
            <div className="space-y-2">
              {CRON_JOBS.map((j, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-slate-800/60 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{j.name}</p>
                    <p className="text-xs text-slate-500">{j.schedule}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-400">ACTIVE</span>
                    <p className="mt-0.5 text-xs text-slate-600">Next: {j.nextRun}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tasks */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-orange-400">✅ Active Tasks</p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {TASKS.map((t, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-3 py-2.5">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${t.priority === "HIGH" ? "bg-red-400" : t.priority === "MED" ? "bg-yellow-400" : "bg-slate-600"}`} />
                  <p className="flex-1 text-xs text-slate-300 leading-tight">{t.task}</p>
                  <PriorityBadge p={t.priority} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <p className="text-xs text-slate-700">Tauschus Mission Control · Powered by Mac AI · Auto-refreshes every 60s</p>
          <p className="text-xs text-slate-700">© 2026 Tauschus</p>
        </div>

      </div>
    </main>
  );
}
