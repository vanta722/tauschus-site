"use client";
// Memory API: CRONS.md added to core file list (2026-03-28)
// Dashboard updated 2026-04-03: 4AM sync — tasks, crons, alerts, crypto prices, Polymarket refreshed
import { useEffect, useState, useCallback } from "react";

const PASS = "Vanta2026";

const CRYPTO_ASSETS = [
  { symbol: "BTC_USDT", label: "Bitcoin", short: "BTC", target: "Hold — base at $70K", color: "#f97316" },
  { symbol: "ETH_USDT", label: "Ethereum", short: "ETH", target: "Accumulate $2,100–2,200", color: "#6366f1" },
  { symbol: "ONDO_USDT", label: "Ondo Finance", short: "ONDO", target: "Hold — target $0.73 EOY", color: "#22d3ee" },
  { symbol: "SOL_USDT", label: "Solana", short: "SOL", target: "Watch $95 breakout", color: "#a78bfa" },
];

const POLY_MARKETS = [
  { label: "US forces enter Iran by April 30", rec: "CAUTION @ ~66.5¢", risk: "HIGH", riskColor: "text-red-400", note: "Smart money inflow — US strikes + 50K troops deployed. Ceasefire collapsed.", alloc: "WATCH" },
  { label: "Clarity Act Signed 2026", rec: "YES @ ~62¢", risk: "MEDIUM", riskColor: "text-orange-400", note: "ONDO double dip — direct RWA catalyst. Needs Tash approval.", alloc: "$40" },
  { label: "US Recession by EOY 2026", rec: "YES @ ~35¢", risk: "LOW-MED", riskColor: "text-yellow-400", note: "Portfolio hedge — hawkish macro + Iran risk premium. Needs Tash approval.", alloc: "$30" },
];

const CRON_JOBS = [
  {
    name: "🌙 Overnight Product Builder",
    schedule: "Daily 11:00 PM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-03 OK · AI Job Costing Playbook built",
    detail: "Researches trending construction topics → builds PDF product → posts 5 tweets → reports to Telegram",
  },
  {
    name: "📊 Dashboard + Memory Sync",
    schedule: "Daily 4:00 AM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-03 08:00 UTC — RUNNING",
    detail: "Reads all memory files → pulls live crypto + Polymarket data → updates MEMORY.md → pushes dashboard to GitHub",
  },
  {
    name: "📊 Market Scan — 6AM ET",
    schedule: "Daily 6:00 AM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-03 OK",
    detail: "Live crypto prices (BTC/ETH/ONDO/SOL/LYX) + Polymarket scan → logs to workspace → Telegram report",
  },
  {
    name: "🧠 Self-Learning Loop",
    schedule: "Daily 7:00 AM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-03 scheduled",
    detail: "Reviews today's daily log → evaluates performance → extracts learnings → appends to Learnings.md → checks for new skill candidates",
  },
  {
    name: "📘 FCA Daily Facebook Post",
    schedule: "Daily 10:00 AM ET (14:00 UTC)",
    status: "ACTIVE",
    last: "Last run: 2026-04-02 OK",
    detail: "Posts to Florida Concrete Alliance page · NE Florida · floridaconcretealliance.com · Token: PERMANENT (never expires)",
  },
  {
    name: "🐦 Daily Tweet Autopilot",
    schedule: "Daily 10:00 AM UTC",
    status: "ACTIVE",
    last: "Last run: 2026-04-02 OK · 45+ tweets total",
    detail: "Rotates tweet library (contractor + OpenClaw products). Override mode for new products. API-based (no browser, no ban risk). Zero failures.",
  },
  {
    name: "📊 Market Scan — 6PM ET",
    schedule: "Daily 6:00 PM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-02 OK",
    detail: "Same as 6AM scan — second daily pulse. Delivered to Telegram.",
  },
];

const CRON_LAST_UPDATED = "2026-04-03 08:00 UTC";

const TASKS = [
  { task: "🔴 Investigate anomalous tweet (ID: 2039850138131206563) — off-brand 'Hermes' post not from Mac. Another session has Twitter access.", priority: "HIGH", pillar: "Online" },
  { task: "🔴 Review + approve product approval backlog (4 PDFs built overnight) — AI Job Costing, Labor Shortage v2, Cash Flow Fix, Cost Squeeze Guide", priority: "HIGH", pillar: "Online" },
  { task: "🔴 Fund Polymarket — $70 USDC ($40 Clarity Act YES + $30 Recession hedge)", priority: "HIGH", pillar: "Crypto" },
  { task: "🟡 First AI Chief of Staff client — post in contractor FB groups (tauschus.com/ai-chief-of-staff)", priority: "MED", pillar: "Online" },
  { task: "🟡 List Workspace Audit service on Gumroad ($25) — email in inbox, no file needed", priority: "MED", pillar: "Online" },
  { task: "🟡 Set up Kit (kit.com, free) for email nurture automation — 4 emails written, needs platform", priority: "MED", pillar: "Online" },
  { task: "🟡 Build property manager outreach list (20–30 contacts, NE Florida)", priority: "MED", pillar: "FCA" },
  { task: "🟡 Ask past FCA customers for Google reviews — boosts local ranking", priority: "MED", pillar: "FCA" },
  { task: "Upgrade Twitter to Basic API tier at 50–100 followers", priority: "LOW", pillar: "Online" },
];

const MEMORY_API = "/api/memory";
const MEMORY_API_KEY = "";

const FCA_PIPELINE = [
  { stage: "New Leads", count: 0, color: "#f97316" },
  { stage: "Quoted", count: 0, color: "#6366f1" },
  { stage: "Won", count: 0, color: "#22c55e" },
  { stage: "Lost", count: 0, color: "#ef4444" },
];

function PriorityBadge({ p }: { p: string }) {
  const c: Record<string, string> = {
    HIGH: "bg-red-500/20 text-red-300 border border-red-500/30",
    MED: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    LOW: "bg-slate-700 text-slate-400",
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${c[p]}`}>{p}</span>;
}

function PillarTag({ p }: { p: string }) {
  const c: Record<string, string> = {
    Crypto: "text-orange-400",
    FCA: "text-blue-400",
    Online: "text-green-400",
  };
  return <span className={`text-xs font-semibold ${c[p] || "text-slate-400"}`}>{p}</span>;
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max === 0 ? 0 : Math.max(4, (value / max) * 100);
  return (
    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export default function Dashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [prices, setPrices] = useState<Record<string, { price: string; change: string; raw: number }>>({});
  const [polyPrices, setPolyPrices] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<{ time: string; btc: number; eth: number }[]>([]);

  // Memory viewer state
  const [activeTab, setActiveTab] = useState<"ops" | "memory">("ops");
  const [memFiles, setMemFiles] = useState<{ key: string; label: string; group: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileUpdatedAt, setFileUpdatedAt] = useState<string>("");
  const [memLoading, setMemLoading] = useState(false);
  const [memError, setMemError] = useState<string | null>(null);

  const tryAuth = () => {
    if (pw === PASS) { setAuthed(true); setPwErr(false); }
    else { setPwErr(true); }
  };

  const fetchData = async () => {
    try {
      const r = await fetch("https://api.crypto.com/exchange/v1/public/get-tickers");
      const d = await r.json();
      const tickers: Record<string, { price: string; change: string; raw: number }> = {};
      for (const t of d?.result?.data || []) {
        if (CRYPTO_ASSETS.find((a) => a.symbol === t.i)) {
          const raw = parseFloat(t.a);
          tickers[t.i] = {
            price: raw.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
            change: (parseFloat(t.c) * 100).toFixed(2),
            raw,
          };
        }
      }
      setPrices(tickers);
      setHistory(prev => {
        const entry = { time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), btc: tickers["BTC_USDT"]?.raw || 0, eth: tickers["ETH_USDT"]?.raw || 0 };
        return [...prev.slice(-11), entry];
      });
    } catch {}

    try {
      const res = await fetch("https://gamma-api.polymarket.com/markets?closed=false&limit=100&order=volume24hr&ascending=false");
      const data = await res.json();
      const markets = Array.isArray(data) ? data : data?.markets || [];
      const map: Record<string, string> = {
        "Clarity Act Signed 2026": "clarity act signed",
        "US Recession by EOY 2026": "us recession by end of 2026",
        "US x Iran Ceasefire Mar 31": "ceasefire",
      };
      const pr: Record<string, string> = {};
      for (const [label, kw] of Object.entries(map)) {
        const m = markets.find((x: { question?: string }) => x.question?.toLowerCase().includes(kw));
        if (m?.outcomePrices) {
          try {
            const arr = typeof m.outcomePrices === "string" ? JSON.parse(m.outcomePrices) : m.outcomePrices;
            pr[label] = (parseFloat(arr[0]) * 100).toFixed(1) + "¢";
          } catch {}
        }
      }
      setPolyPrices(pr);
    } catch {}

    setLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    setLoading(false);
  };

  const fetchMemFiles = useCallback(async () => {
    setMemError(null);
    try {
      const r = await fetch(`${MEMORY_API}`);
      const d = await r.json();
      if (d.error) { setMemError(d.error); return; }
      setMemFiles(d.files || []);
    } catch {
      setMemError("Could not reach Memory API.");
    }
  }, []);

  const fetchFileContent = useCallback(async (key: string) => {
    setMemLoading(true);
    setMemError(null);
    setFileContent("");
    setFileUpdatedAt("");
    try {
      const r = await fetch(`${MEMORY_API}?file=${encodeURIComponent(key)}`);
      const d = await r.json();
      if (d.error) { setMemError(d.error); }
      else {
        setFileContent(d.content || "");
        setFileUpdatedAt(d.updatedAt ? new Date(d.updatedAt).toLocaleString() : "");
      }
    } catch {
      setMemError("Failed to load file.");
    }
    setMemLoading(false);
  }, []);

  useEffect(() => {
    if (authed && activeTab === "memory" && memFiles.length === 0) {
      fetchMemFiles();
    }
  }, [authed, activeTab, memFiles.length, fetchMemFiles]);

  useEffect(() => {
    if (selectedFile) fetchFileContent(selectedFile);
  }, [selectedFile, fetchFileContent]);

  useEffect(() => { if (authed) { fetchData(); const iv = setInterval(fetchData, 60000); return () => clearInterval(iv); } }, [authed]);

  // Sparkline SVG from history
  function Sparkline({ key_, color }: { key_: "btc" | "eth"; color: string }) {
    if (history.length < 2) return <div className="h-10 flex items-center text-xs text-slate-600">Collecting data...</div>;
    const vals = history.map(h => h[key_]);
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    const w = 120, h = 36;
    const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  // LOGIN SCREEN
  if (!authed) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Tauschus · Mission Control</p>
            <h1 className="mt-2 text-2xl font-black text-white">Dashboard Login</h1>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && tryAuth()}
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none"
            />
            {pwErr && <p className="text-xs text-red-400">Incorrect password.</p>}
            <button onClick={tryAuth} className="w-full rounded-xl bg-orange-400 py-3 font-bold text-slate-950 hover:bg-orange-300 transition">
              Enter
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Tauschus · Mission Control</p>
            <h1 className="mt-1 text-3xl font-black text-white">Operations Dashboard</h1>
            <p className="text-xs text-slate-500 mt-1">Auto-refreshes every 60s · Last updated: {lastUpdated || "—"}</p>
          </div>
          <button onClick={fetchData} className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-orange-400 hover:text-orange-400 transition">
            ↻ Refresh
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 border-b border-slate-800 pb-0">
          {(["ops", "memory"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition border-b-2 ${
                activeTab === tab
                  ? "border-orange-400 text-orange-400 bg-slate-900/60"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "ops" ? "⚙️ Operations" : "🧠 Mac's Memory"}
            </button>
          ))}
        </div>

        {activeTab === "memory" && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Mac&apos;s Memory Files</p>
              <button
                onClick={() => { setMemFiles([]); fetchMemFiles(); }}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-orange-400 hover:text-orange-400 transition"
              >
                ↻ Reload Files
              </button>
            </div>

            {memError && !memLoading && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">{memError}</div>
            )}

            <div className="grid gap-4 lg:grid-cols-4">
              {/* File list sidebar */}
              <div className="lg:col-span-1 space-y-2">
                {memFiles.length === 0 && !memError && (
                  <div className="text-xs text-slate-600 py-4 text-center">Loading files…</div>
                )}

                {/* Core files */}
                {memFiles.filter(f => f.group === "core").length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Core</p>
                    {memFiles.filter(f => f.group === "core").map(f => (
                      <button
                        key={f.key}
                        onClick={() => setSelectedFile(f.key)}
                        className={`w-full text-left rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                          selectedFile === f.key
                            ? "bg-orange-400/20 text-orange-300 border border-orange-400/30"
                            : "bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Daily logs */}
                {memFiles.filter(f => f.group === "daily").length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Daily Logs</p>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {memFiles.filter(f => f.group === "daily").map(f => (
                        <button
                          key={f.key}
                          onClick={() => setSelectedFile(f.key)}
                          className={`w-full text-left rounded-xl px-3 py-2 text-xs font-semibold transition ${
                            selectedFile === f.key
                              ? "bg-orange-400/20 text-orange-300 border border-orange-400/30"
                              : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* File content viewer */}
              <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 min-h-[400px]">
                {!selectedFile && (
                  <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                    ← Select a file to view
                  </div>
                )}
                {selectedFile && memLoading && (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm animate-pulse">
                    Loading {selectedFile}…
                  </div>
                )}
                {selectedFile && !memLoading && fileContent && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-bold text-white">{selectedFile}</p>
                      {fileUpdatedAt && <p className="text-xs text-slate-500">Updated: {fileUpdatedAt}</p>}
                    </div>
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed overflow-auto max-h-[600px]">
                      {fileContent}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "ops" && <>

        {/* Crypto Prices + Sparklines */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">White Investment Fund — Live Prices</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CRYPTO_ASSETS.map((a) => {
              const d = prices[a.symbol];
              const change = d ? parseFloat(d.change) : 0;
              const isUp = change >= 0;
              return (
                <div key={a.symbol} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{a.short}</span>
                    {d && <span className={`text-xs font-bold ${isUp ? "text-green-400" : "text-red-400"}`}>{isUp ? "▲" : "▼"} {Math.abs(change)}%</span>}
                  </div>
                  <p className="text-2xl font-black text-white">{loading ? <span className="text-slate-600">—</span> : d ? `$${d.price}` : <span className="text-slate-500">N/A</span>}</p>
                  <p className="text-xs text-slate-500">{a.label}</p>
                  {(a.short === "BTC" || a.short === "ETH") && <Sparkline key_={a.short.toLowerCase() as "btc" | "eth"} color={a.color} />}
                  <MiniBar value={change} max={5} color={isUp ? "#22c55e" : "#ef4444"} />
                  <p className="text-xs text-orange-300">{a.target}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Polymarket */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">Polymarket — Active Opportunities</p>
          <div className="grid gap-3 lg:grid-cols-3">
            {POLY_MARKETS.map((m) => (
              <div key={m.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-white leading-tight">{m.label}</p>
                  <span className={`text-xs font-black shrink-0 ${m.riskColor}`}>{m.risk}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Current YES price</p>
                    <p className="text-3xl font-black text-orange-400">{polyPrices[m.label] || (loading ? "—" : "~")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Allocation</p>
                    <p className="text-lg font-black text-white">{m.alloc}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-orange-400/10 border border-orange-400/20 px-3 py-2">
                  <p className="text-xs font-bold text-orange-300">📌 {m.rec}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{m.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FCA Pipeline */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">FCA Lead Pipeline</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FCA_PIPELINE.map((s) => (
              <div key={s.stage} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-xs text-slate-400">{s.stage}</p>
                <p className="mt-1 text-4xl font-black text-white">{s.count}</p>
                <MiniBar value={s.count} max={10} color={s.color} />
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/40 px-5 py-4 flex flex-wrap gap-6">
            <div><p className="text-xs text-slate-500">Lead Source</p><p className="text-sm font-semibold text-white">Facebook Marketplace</p></div>
            <div><p className="text-xs text-slate-500">Target</p><p className="text-sm font-semibold text-white">3–4 jobs/week</p></div>
            <div><p className="text-xs text-slate-500">Avg Job Value</p><p className="text-sm font-semibold text-white">$800–$2,500</p></div>
            <div><p className="text-xs text-slate-500">Market</p><p className="text-sm font-semibold text-white">Jacksonville, FL</p></div>
          </div>
        </section>

        {/* Cron Jobs + Tasks */}
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Automated Systems</p>
              <p className="text-xs text-slate-600">Last updated: {CRON_LAST_UPDATED}</p>
            </div>
            <div className="space-y-3">
              {CRON_JOBS.map((j, i) => (
                <div key={i} className="rounded-xl bg-slate-800/60 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{j.name}</p>
                      <p className="text-xs text-slate-500">{j.schedule}</p>
                      <p className="text-xs text-slate-600">{j.last}</p>
                    </div>
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400 shrink-0 ml-3">{j.status}</span>
                  </div>
                  {j.detail && <p className="text-xs text-slate-500 mt-1.5 border-t border-slate-700/50 pt-1.5">{j.detail}</p>}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-orange-400">Active Tasks</p>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {TASKS.map((t, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                  <p className="flex-1 text-xs text-slate-300">{t.task}</p>
                  <PillarTag p={t.pillar} />
                  <PriorityBadge p={t.priority} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Side Hustle School Tracker */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">🎓 Agent Side Hustle School — 28-Day Sprint</p>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex flex-wrap gap-6">
              <div><p className="text-xs text-slate-500">Current Day</p><p className="text-3xl font-black text-orange-400">3 / 28</p></div>
              <div><p className="text-xs text-slate-500">Phase</p><p className="text-sm font-bold text-white">1 — Foundation (complete)</p></div>
              <div><p className="text-xs text-slate-500">Revenue</p><p className="text-3xl font-black text-green-400">$0</p><p className="text-xs text-slate-500">Target: $100</p></div>
              <div><p className="text-xs text-slate-500">Products Live</p><p className="text-3xl font-black text-white">9</p><p className="text-xs text-slate-500">Contractor + OpenClaw</p></div>
              <div><p className="text-xs text-slate-500">Tweets Sent</p><p className="text-3xl font-black text-white">45+</p></div>
              <div><p className="text-xs text-slate-500">PDFs Built</p><p className="text-3xl font-black text-white">4</p><p className="text-xs text-slate-500">Approval queue</p></div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-orange-400 h-2 rounded-full" style={{width: "11%"}} /></div>
            <p className="text-xs text-slate-500">Blockers: Claw Mart seller account + product approval backlog (4 PDFs). Next: approve products → list → distribute.</p>
          </div>
        </section>

        {/* Online Business */}
        <section>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">Online Business — Gumroad Products</p>
          <div className="grid gap-3 lg:grid-cols-3">
            {/* Contractor Products */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">🏗️ Contractor Products</p>
                <span className="text-xs font-bold text-slate-400">5 products</span>
              </div>
              {[
                { emoji: "📘", title: "AI Estimating Playbook 2026", price: "FREE", badge: "Most Downloaded", badgeColor: "green", url: "https://tauschus.gumroad.com/l/AIplaybook1" },
                { emoji: "📊", title: "Job Costing Fix for Concrete Contractors", price: "FREE", badge: "Popular", badgeColor: "green", url: "https://tauschus.gumroad.com/l/jobcostingfix26" },
                { emoji: "💰", title: "Margin Protection Playbook", price: "$1.99", badge: "Best Value", badgeColor: "yellow", url: "https://tauschus.gumroad.com/l/marginplaybook26" },
                { emoji: "🦺", title: "Labor Shortage Survival Guide", price: "$9", badge: "", badgeColor: "", url: "https://tauschus.gumroad.com/l/pdcsgr" },
                { emoji: "🏗️", title: "Data Center Concrete Playbook", price: "$9", badge: "Hot Market", badgeColor: "orange", url: "https://tauschus.gumroad.com/l/datacenter26" },
              ].map((p, i) => (
                <div key={i} className="rounded-xl bg-slate-800/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white">{p.emoji} {p.title}</p>
                    <span className={`text-xs font-bold shrink-0 ${p.price === "FREE" ? "text-green-400" : "text-orange-400"}`}>{p.price}</span>
                  </div>
                  {p.badge && <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold mt-1 bg-${p.badgeColor}-500/20 text-${p.badgeColor}-300 border border-${p.badgeColor}-500/30`}>{p.badge}</span>}
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 mt-1 block hover:underline truncate">{p.url.replace("https://", "")}</a>
                </div>
              ))}
            </div>

            {/* OpenClaw Products */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">🤖 OpenClaw Tools</p>
                <span className="text-xs font-bold text-slate-400">4 products · launched Mar 31</span>
              </div>
              {[
                { emoji: "📋", title: "Quick-Start Checklist", price: "FREE", badge: "Email Capture", badgeColor: "green", url: "https://tauschus.gumroad.com/l/dwbmym", note: "Top-of-funnel — every download = email contact" },
                { emoji: "🐦", title: "Twitter Autopilot for OpenClaw", price: "$9", badge: "No Ban Risk", badgeColor: "blue", url: "https://tauschus.gumroad.com/l/Twitterautopilot", note: "API-based, 30+ days live, zero failures" },
                { emoji: "⏰", title: "Cron Starter Kit", price: "$9", badge: "Background Tasks", badgeColor: "purple", url: "https://tauschus.gumroad.com/l/yqvhl", note: "4-file pattern + 3 real production examples" },
                { emoji: "⚙️", title: "Small Business Ops Bundle", price: "$19", badge: "7 Files", badgeColor: "orange", url: "https://tauschus.gumroad.com/l/gikcus", note: "Production workspace in 5 min — battle-tested" },
              ].map((p, i) => (
                <div key={i} className="rounded-xl bg-slate-800/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white">{p.emoji} {p.title}</p>
                    <span className={`text-xs font-bold shrink-0 ${p.price === "FREE" ? "text-green-400" : "text-orange-400"}`}>{p.price}</span>
                  </div>
                  {p.badge && <span className="inline-block rounded-full px-2 py-0.5 text-xs font-bold mt-1 bg-blue-500/20 text-blue-300 border border-blue-500/30">{p.badge}</span>}
                  <p className="text-xs text-slate-500 mt-1">{p.note}</p>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 mt-1 block hover:underline truncate">{p.url.replace("https://", "")}</a>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-xs text-slate-400">Twitter @Vanta69</p>
              <p className="mt-1 text-sm font-bold text-white">Content Machine</p>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs"><span className="text-slate-500">Tweets since Mar 27</span><span className="text-white font-semibold">40+ override + rotation</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Threads posted</span><span className="text-white font-semibold">5 (autopilot, cron, ops, launch, bip)</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Products live</span><span className="text-white font-semibold">8 (contractor + OpenClaw)</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Automation</span><span className="text-green-400 font-semibold">API-based (Tweepy) — no ban risk</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Distribution</span><span className="text-white font-semibold">Twitter + Reddit (3 live + 6 ready)</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">AI Chief of Staff</span><span className="text-green-400 font-semibold">Live — $97/mo · $297/mo Pro</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Email capture</span><span className="text-yellow-400 font-semibold">Resend live — needs Kit for sequences</span></div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-xs text-slate-400">Twitter Automation Roadmap</p>
              <div className="mt-3 space-y-2">
                {[
                  { phase: "Phase 1", desc: "Mac posts + likes, Tash replies manually", status: "NOW", color: "text-green-400" },
                  { phase: "Phase 2", desc: "Basic API tier → Mac replies autonomously", status: "~30 days", color: "text-yellow-400" },
                  { phase: "Phase 3", desc: "Full auto: post, reply, follow, DM funnel 24/7", status: "Goal", color: "text-orange-400" },
                ].map((p, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className={`shrink-0 font-bold ${p.color}`}>{p.phase}</span>
                    <span className="text-slate-400 flex-1">{p.desc}</span>
                    <span className={`shrink-0 font-semibold ${p.color}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section className="rounded-2xl border border-orange-400/30 bg-orange-400/5 p-5 space-y-5">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">⚡ Alerts</p>
            <div className="space-y-2">
              {[
                { alert: "🚨 HIGH: Anomalous tweet detected (ID: 2039850138131206563) — 'How good is Hermes? 🧐 #Hermes #Openclaw' posted at 23:39 UTC Apr 2. NOT from Mac. Another session/agent has Twitter access. Investigate immediately.", urgency: "HIGH" },
                { alert: "🔴 HIGH: 4 products in approval backlog — AI Job Costing Playbook, Labor Shortage Guide v2, Cash Flow Fix Playbook, Cost Squeeze Guide. Built but not listed. Tash approval required.", urgency: "HIGH" },
                { alert: "🔴 HIGH: Polymarket still unfunded — $70 USDC needed ($40 Clarity Act YES + $30 Recession hedge). Iran market at 66.5% YES and rising.", urgency: "HIGH" },
                { alert: "🟡 MED: Crypto portfolio under pressure — BTC $67K, ETH $2,066, ONDO $0.262, SOL $79.96. No floor confirmed after Apr 1 dead-cat bounce. Hold all, no adds.", urgency: "MED" },
                { alert: "🟡 MED: Iran April 30 YES @ 66.5¢ — consistent smart money inflow. Speculative only. Tash approval required.", urgency: "MED" },
                { alert: "🟡 MED: First AI Chief of Staff client still outstanding — post in contractor FB groups (tauschus.com/ai-chief-of-staff)", urgency: "MED" },
                { alert: "🟢 WIN: Overnight cron running clean — AI Job Costing Playbook + case study tweet built on Apr 3", urgency: "OK" },
                { alert: "🟢 WIN: 4 OpenClaw products launched Mar 31 — Twitter Autopilot ($9) + Cron Kit ($9) + Ops Bundle ($19) + Free Checklist", urgency: "OK" },
                { alert: "🟢 WIN: All 7 automated crons running — market scans, product builder, tweet autopilot, FCA posts, self-learning loop", urgency: "OK" },
              ].map((a, i) => (
                <div key={i} className={`flex gap-3 rounded-xl px-4 py-3 text-xs ${a.urgency === "HIGH" ? "bg-red-500/10 border border-red-500/20" : a.urgency === "OK" ? "bg-green-500/10 border border-green-500/20" : "bg-yellow-500/10 border border-yellow-500/20"}`}>
                  <span className={a.urgency === "HIGH" ? "text-red-200" : a.urgency === "OK" ? "text-green-200" : "text-yellow-200"}>{a.alert}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">🎯 Next Moves</p>
            <div className="space-y-2">
              {[
                { move: "🥇 Investigate anomalous Twitter access — check which session/agent posted the Hermes tweet. Review credentials, revoke access if needed." },
                { move: "🥈 Approve product backlog (4 PDFs) — review and list on Gumroad. AI Job Costing = highest value, suggested $9–$14." },
                { move: "🥉 Fund Polymarket ($70 USDC) — $40 Clarity Act YES + $30 Recession hedge. Iran at 66.5% is the hot market." },
                { move: "🔲 Post AI Chief of Staff in contractor FB groups — first $97/mo recurring client (tauschus.com/ai-chief-of-staff)" },
                { move: "🔲 List Workspace Audit ($25) on Gumroad — no file needed, fastest-converting service offer for cold audience" },
                { move: "🔲 Set up Kit.com (free) — 4-email nurture sequence is written, just needs platform to activate" },
              ].map((m, i) => (
                <div key={i} className="flex gap-3 rounded-xl bg-slate-800/60 px-4 py-3 text-xs">
                  <span className="text-slate-200">{m.move}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="border-t border-slate-800 pt-4 text-center">
          <p className="text-xs text-slate-600">Tauschus Mission Control · Powered by Mac AI · Auto-refreshes every 60s</p>
        </div>

        </> }

      </div>
    </main>
  );
}
