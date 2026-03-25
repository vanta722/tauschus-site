"use client";
import { useEffect, useState } from "react";

const CRYPTO_ASSETS = [
  { symbol: "BTC_USDT", label: "Bitcoin", short: "BTC" },
  { symbol: "ETH_USDT", label: "Ethereum", short: "ETH" },
  { symbol: "ONDO_USDT", label: "Ondo Finance", short: "ONDO" },
  { symbol: "SOL_USDT", label: "Solana", short: "SOL" },
];

const POLY_MARKETS = [
  { label: "Clarity Act Signed 2026", slug: "clarity-act-signed-into-law-in-2026", target: "YES", rec: "BUY YES @ ~62¢", risk: "MEDIUM" },
  { label: "US Recession by EOY 2026", slug: "us-recession-by-end-of-2026", target: "YES", rec: "BUY YES @ ~35¢", risk: "LOW-MED" },
  { label: "US x Iran Ceasefire Mar 31", slug: "us-x-iran-ceasefire-by-march-31", target: "NO", rec: "BUY NO @ ~84¢", risk: "LOW" },
];

const PILLARS = [
  {
    id: "crypto",
    label: "Crypto + Prediction Markets",
    icon: "🪙",
    color: "orange",
    status: "ACTIVE",
    items: [
      "Weekly $75–100 ETH accumulation",
      "Hold ONDO — target $0.73 EOY (160% upside)",
      "Clarity Act YES + Recession hedge on Polymarket",
      "Monitor SOL breakout above $95",
    ],
    next: "Fund Polymarket with $70 USDC → place Clarity Act YES + Recession hedge",
  },
  {
    id: "fca",
    label: "Florida Concrete Alliance",
    icon: "🏗️",
    color: "blue",
    status: "ACTIVE",
    items: [
      "Lead source: Facebook Marketplace (organic)",
      "Target: 3–4 jobs/week",
      "Website: floridaconcretealliance.com (lead form live)",
      "Next: Google Business Profile + FB Groups outreach",
    ],
    next: "Post 3 Marketplace listings today — demand is live in Jacksonville",
  },
  {
    id: "online",
    label: "Autonomous Online Business",
    icon: "💻",
    color: "green",
    status: "LAUNCHING",
    items: [
      "AI Estimating Playbook live on Gumroad (free)",
      "Twitter @Vanta69 — content machine running",
      "tauschus.com updated with playbook banner",
      "Overnight builder posting 5 tweets nightly at 11PM ET",
    ],
    next: "Monitor Gumroad downloads — hit 20+ → launch paid v2 at $19–29",
  },
];

const CRON_JOBS = [
  { name: "🌙 Overnight Product Builder", schedule: "11:00 PM ET nightly", status: "ACTIVE" },
  { name: "📊 Market Scan 6AM ET", schedule: "6:00 AM ET daily", status: "ACTIVE" },
  { name: "📊 Market Scan 6PM ET", schedule: "6:00 PM ET daily", status: "ACTIVE" },
];

const TASKS = [
  { task: "Update @Vanta69 Twitter bio + website link", priority: "HIGH", done: false },
  { task: "Fund Polymarket → Clarity Act YES + Recession hedge", priority: "HIGH", done: false },
  { task: "Post 3 FCA Marketplace listings", priority: "HIGH", done: false },
  { task: "Set up Google Business Profile for FCA", priority: "MED", done: false },
  { task: "Monitor Gumroad downloads — launch paid v2 at 20+", priority: "MED", done: false },
  { task: "Refresh Facebook Page token (60-day expiry)", priority: "MED", done: false },
  { task: "Drop playbook in 2–3 contractor Facebook groups", priority: "MED", done: false },
];

function PriorityBadge({ p }: { p: string }) {
  const colors: Record<string, string> = {
    HIGH: "bg-red-500/20 text-red-300 border-red-500/30",
    MED: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    LOW: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${colors[p] || colors.LOW}`}>
      {p}
    </span>
  );
}

function RiskBadge({ r }: { r: string }) {
  const colors: Record<string, string> = {
    LOW: "text-green-400",
    "LOW-MED": "text-yellow-400",
    MEDIUM: "text-orange-400",
    HIGH: "text-red-400",
  };
  return <span className={`text-xs font-bold ${colors[r] || "text-slate-400"}`}>{r}</span>;
}

export default function Dashboard() {
  const [prices, setPrices] = useState<Record<string, { price: string; change: string }>>({});
  const [polyPrices, setPolyPrices] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Crypto prices
      const r = await fetch("https://api.crypto.com/exchange/v1/public/get-tickers");
      const d = await r.json();
      const tickers: Record<string, { price: string; change: string }> = {};
      for (const t of d?.result?.data || []) {
        if (CRYPTO_ASSETS.find((a) => a.symbol === t.i)) {
          tickers[t.i] = {
            price: parseFloat(t.a).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
            change: (parseFloat(t.c) * 100).toFixed(2),
          };
        }
      }
      setPrices(tickers);
    } catch {}

    try {
      // Polymarket prices
      const slugMap: Record<string, string> = {
        "clarity-act-signed-into-law-in-2026": "Clarity Act Signed 2026",
        "us-recession-by-end-of-2026": "US Recession by EOY 2026",
        "us-x-iran-ceasefire-by-march-31": "US x Iran Ceasefire Mar 31",
      };
      const pr: Record<string, string> = {};
      for (const slug of Object.keys(slugMap)) {
        try {
          const res = await fetch(`https://gamma-api.polymarket.com/markets?slug=${slug}`);
          const data = await res.json();
          const m = Array.isArray(data) ? data[0] : data?.markets?.[0];
          if (m?.outcomePrices) {
            const yes = parseFloat(JSON.parse(m.outcomePrices)[0]);
            pr[slugMap[slug]] = (yes * 100).toFixed(1) + "¢";
          }
        } catch {}
      }
      setPolyPrices(pr);
    } catch {}

    setLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Tauschus · Mission Control</p>
            <h1 className="mt-1 text-3xl font-black text-white">Operations Dashboard</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Last updated</p>
            <p className="text-sm font-semibold text-slate-300">{lastUpdated || "Loading..."}</p>
            <button onClick={fetchData} className="mt-1 text-xs text-orange-400 hover:text-orange-300">↻ Refresh</button>
          </div>
        </div>

        {/* Crypto Prices */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">🪙 White Investment Fund — Live Prices</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CRYPTO_ASSETS.map((a) => {
              const d = prices[a.symbol];
              const change = d ? parseFloat(d.change) : 0;
              return (
                <div key={a.symbol} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{a.short}</span>
                    {d && (
                      <span className={`text-xs font-bold ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {change >= 0 ? "+" : ""}{d.change}%
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xl font-black text-white">
                    {loading ? <span className="text-slate-600">—</span> : d ? `$${d.price}` : <span className="text-slate-600">N/A</span>}
                  </p>
                  <p className="text-xs text-slate-500">{a.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Polymarket */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">🎯 Polymarket — Active Opportunities</p>
          <div className="grid gap-3 lg:grid-cols-3">
            {POLY_MARKETS.map((m) => (
              <div key={m.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white leading-tight">{m.label}</p>
                  <RiskBadge r={m.risk} />
                </div>
                <p className="mt-3 text-xs text-slate-400">Current YES price</p>
                <p className="text-2xl font-black text-orange-400">
                  {polyPrices[m.label] || (loading ? "—" : "~")}
                </p>
                <p className="mt-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-orange-300">{m.rec}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3 Pillars */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">⚙️ Three Pillars — Status</p>
          <div className="grid gap-4 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">{p.icon} {p.label}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black ${p.status === "ACTIVE" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>
                    {p.status}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {p.items.map((item, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-400">
                      <span className="text-orange-400 shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl bg-orange-400/10 border border-orange-400/20 px-3 py-2">
                  <p className="text-xs font-bold text-orange-300">NEXT MOVE</p>
                  <p className="mt-0.5 text-xs text-slate-300">{p.next}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cron Jobs + Tasks */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* Cron Jobs */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-orange-400">⏰ Automated Systems</p>
            <div className="space-y-3">
              {CRON_JOBS.map((j, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-slate-800/60 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{j.name}</p>
                    <p className="text-xs text-slate-500">{j.schedule}</p>
                  </div>
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400">
                    {j.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Task List */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-orange-400">✅ Active Tasks</p>
            <div className="space-y-2">
              {TASKS.map((t, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-2.5">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${t.done ? "bg-green-400" : "bg-orange-400"}`} />
                  <p className="flex-1 text-xs text-slate-300">{t.task}</p>
                  <PriorityBadge p={t.priority} />
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 text-center">
          <p className="text-xs text-slate-600">Tauschus Mission Control · Powered by Mac AI · Auto-refreshes every 60s</p>
        </div>

      </div>
    </main>
  );
}
