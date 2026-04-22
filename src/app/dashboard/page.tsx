"use client";
// Memory API: CRONS.md added to core file list (2026-03-28)
// Dashboard updated 2026-04-13: 08:00 UTC — 4AM sync: Hungary resolved (Magyar won), ONDO at critical $0.245 support, FCA-001+002 closed, billing restored.
import { useEffect, useState, useCallback } from "react";

const PASS = "Vanta2026";

const CRYPTO_ASSETS = [
  { symbol: "BTC_USDT", label: "Bitcoin", short: "BTC", target: "Hold — base at $70K", color: "#f97316" },
  { symbol: "ETH_USDT", label: "Ethereum", short: "ETH", target: "Accumulate $2,100–2,200", color: "#6366f1" },
  { symbol: "ONDO_USDT", label: "Ondo Finance", short: "ONDO", target: "Hold — target $0.73 EOY", color: "#22d3ee" },
  { symbol: "SOL_USDT", label: "Solana", short: "SOL", target: "Watch $95 breakout", color: "#a78bfa" },
];

const POLY_MARKETS = [
  { label: "Hungary PM — Péter Magyar (RESOLVED ✅)", rec: "RESOLVED YES", risk: "RESTRICTED", riskColor: "text-green-400", note: "99.25% YES — $7.03M vol 24h. Magyar's Tisza party won supermajority Apr 12. Orbán out after 16 years. EU political realignment — pro-EU Hungary.", alloc: "RESOLVED" },
  { label: "Bitcoin Reaches $150,000 in April 2026", rec: "EXTREMELY UNLIKELY", risk: "RESTRICTED", riskColor: "text-red-400", note: "0.25% YES — $1.89M vol 24h. BTC at $70,782 — needs +111% in 18 days. Not happening. No trade value.", alloc: "SKIP" },
  { label: "FIFA World Cup 2026 — France wins", rec: "LEADING CONTENDER", risk: "RESTRICTED", riskColor: "text-red-400", note: "16.05% YES — $1.46M vol 24h. Top contender alongside Spain (17.35%). Resolves Jul 20, 2026. Monitor for post-group stage value.", alloc: "WATCH" },
  { label: "FOMC April 28-29 — Rate Decision", rec: "HOLD — no cut expected", risk: "WATCH", riskColor: "text-yellow-400", note: "Next major macro catalyst. CPI at 3.3% YoY, Fed on hold at 3.50-3.75%. Any cut probability near-zero. Watch for tone shift.", alloc: "WATCH" },
];

const CRON_JOBS = [
  {
    name: "⚡ Morning Ops — Market + Learning + Memory",
    schedule: "Daily 6:00 AM ET · Haiku model",
    status: "ACTIVE",
    last: "New cron live 2026-04-13. Replaces 3 old crons (4AM sync, 6AM scan, 7AM learning).",
    detail: "Crypto prices + Polymarket scan + self-learning + memory update → Telegram report. 3-in-1 at Haiku cost.",
  },
  {
    name: "📘 FCA Daily Facebook Post",
    schedule: "Daily 2:00 PM UTC · Haiku model",
    status: "ACTIVE",
    last: "Updated 2026-04-13 → Haiku (12x cheaper). Runs daily.",
    detail: "Posts to Florida Concrete Alliance page · NE Florida · floridaconcretealliance.com · Token: PERMANENT",
  },
  {
    name: "📊 Market Scan — 6PM ET",
    schedule: "Daily 6:00 PM ET · Haiku model",
    status: "ACTIVE",
    last: "Updated 2026-04-13 → Haiku. Last run ✅ 2026-04-12.",
    detail: "Evening crypto + Polymarket pulse → logs to workspace → Telegram report.",
  },
  {
    name: "🌙 Overnight Product Builder",
    schedule: "Mon / Wed / Fri 11:00 PM ET · Sonnet",
    status: "ACTIVE",
    last: "Reduced 7→3 nights/week. Keeps Sonnet for product quality. Last run ✅ 2026-04-13.",
    detail: "Researches trending construction topics → builds PDF → schedules tweets → Telegram report.",
  },
  {
    name: "📦 Pending Products Scanner",
    schedule: "Daily 11:00 PM ET · Haiku model",
    status: "ACTIVE",
    last: "Updated 2026-04-13 → Haiku. 9 PDFs pending Tash approval.",
    detail: "Scans /products for unlisted PDFs → updates pending-products.md → flags for Tash approval.",
  },
  {
    name: "🚫 Tweet Autopilot",
    schedule: "Paused",
    status: "⚠️ SUSPENDED",
    last: "Twitter/X account SUSPENDED. Appeal at twitter.com/account/suspended.",
    detail: "All tweet automation PAUSED until account reinstated.",
  },
  {
    name: "📊 Dashboard Sync",
    schedule: "Mon / Wed / Fri 4:00 AM ET · Haiku model",
    status: "ACTIVE",
    last: "Re-enabled 2026-04-13 — lean version. Reads 3 files only, Haiku model, 3x/week.",
    detail: "Updates data constants only (tasks, pipeline, alerts) → pushes to GitHub. No full file rewrite.",
  },
];

const CRON_LAST_UPDATED = "2026-04-13 11:36 UTC";

const TASKS = [
  { task: "🔴 CRITICAL: Appeal Twitter/X account suspension — twitter.com/account/suspended. 5 AI Safety Playbook tweet crons fire today 7–9AM ET, ALL WILL FAIL.", priority: "HIGH", pillar: "Online" },
  { task: "🔴 CRITICAL: ONDO at $0.2455 — AT critical $0.245 support floor. If breaks below $0.240, flag immediately.", priority: "HIGH", pillar: "Crypto" },
  { task: "🔴 Approve + list AI Safety Playbook for Concrete Contractors on Gumroad — built overnight Apr 13. File: products/ai-safety-playbook-concrete-2026.pdf. Suggested price $7–$12.", priority: "HIGH", pillar: "Online" },
  { task: "🟡 FCA-001 CLOSED ✅ Net profit $1,888.24. FCA-002 CLOSED ✅ $1,250. Ask Joseph Noble for Google review.", priority: "MED", pillar: "FCA" },
  { task: "🟡 Fund Polymarket — $70 USDC ready. Next non-restricted catalyst: FOMC April 28-29. Watch for new accessible markets.", priority: "MED", pillar: "Crypto" },
  { task: "🟡 9 products pending in queue — review pending-products.md and approve/reject each for Gumroad listing.", priority: "MED", pillar: "Online" },
  { task: "🟡 First AI Chief of Staff client — post pitch in contractor FB groups (tauschus.com/ai-chief-of-staff)", priority: "MED", pillar: "Online" },
  { task: "🟡 Build property manager outreach list (20–30 contacts, NE Florida)", priority: "MED", pillar: "FCA" },
  { task: "Upgrade Twitter to Basic API tier after account reinstated + 50–100 followers", priority: "LOW", pillar: "Online" },
];

const MEMORY_API = "/api/memory";
const MEMORY_API_KEY = "";

const FCA_PIPELINE = [
  { stage: "New Leads", count: 0, color: "#f97316" },
  { stage: "Quoted", count: 0, color: "#6366f1" },
  { stage: "Won", count: 2, color: "#22c55e" },
  { stage: "Lost", count: 0, color: "#ef4444" },
];


const FCA_PHOTOS: Record<string, { id: string; label: string; photos: { url: string; caption: string; date: string }[] }[]> = {
  "FCA-001": [
    {
      id: "fca-001",
      label: "FCA-001 — Joseph Noble | Stamped Concrete | Jacksonville FL",
      photos: [
        { url: "/fca-photos/fca-001/noble-stamped-concrete.jpg", caption: "Stamped concrete — charcoal gray, European fan pattern", date: "2026-04-09" },
      ],
    },
  ],
  "FCA-002": [
    {
      id: "fca-002",
      label: "FCA-002 — Frankie | Driveway Extension | Palm Coast FL",
      photos: [
        { url: "/fca-photos/fca-002/frankie-concrete-pad.jpg", caption: "Concrete pad — freshly poured, Palm Coast FL", date: "2026-04-10" },
      ],
    },
  ],
};

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
  const [activeTab, setActiveTab] = useState<"ops" | "memory" | "fca">("ops");
  const [memFiles, setMemFiles] = useState<{ key: string; label: string; group: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileUpdatedAt, setFileUpdatedAt] = useState<string>("");
  const [memLoading, setMemLoading] = useState(false);
  const [memError, setMemError] = useState<string | null>(null);

  // FCA state
  type LeadStage = "New Lead" | "Contacted" | "Estimate Sent" | "Follow-Up" | "Booked" | "Lost";
  type JobStatus = "Scheduled" | "In Progress" | "Completed";
  interface Lead {
    id: number; name: string; phone: string; area: string; service: string;
    value: string; source: string; notes: string; stage: LeadStage;
  }
  interface Job {
    id: number; client: string; location: string; jobType: string;
    totalPrice: number; depositPaid: number; status: JobStatus; notes: string;
  }
  interface Payment { id: number; client: string; amount: number; date: string; notes: string; }
  interface Expense { id: number; description: string; amount: number; date: string; }
  interface Client { id: number; name: string; phone: string; jobDone: string; notes: string; repeat: boolean; referral: string; }

  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, name: "Joseph Noble", phone: "(904) 563-1660", area: "Jacksonville, FL", service: "Stamped Concrete", value: "$6,475", source: "Facebook Marketplace", notes: "Collecting final $1,590 TODAY Apr 11. Poured Apr 9, sealed Apr 10. $4,885 collected.", stage: "Booked" },
    { id: 2, name: "Frankie (Palm Coast Demo)", phone: "", area: "Palm Coast, FL", service: "Driveway Extension — 12'x12' 4\" depth", value: "$1,250", source: "Facebook Marketplace", notes: "CLOSED ✅ Apr 10. Net profit: $630.", stage: "Booked" },
  ]);
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, client: "Joseph Noble", location: "Jacksonville, FL", jobType: "Stamped Concrete — 730 sq ft", totalPrice: 6475, depositPaid: 6475, status: "Completed", notes: "✅ CLOSED Apr 12. Contract: $6,475 | Collected: $6,475 | Expenses: $4,586.76 | Net Profit: $1,888.24" },
    { id: 2, client: "Frankie (Palm Coast Demo)", location: "Palm Coast, FL", jobType: "Driveway Extension — 12'x12' 4\" depth", totalPrice: 1250, depositPaid: 1250, status: "Completed", notes: "CLOSED ✅ Apr 10. Contract: $1,250 | Concrete: $620 | Net Profit: $630. 15 Royal Leaf Lane, Palm Coast FL 32164." },
  ]);
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, client: "Joseph Noble", amount: 1000, date: "2026-04-04", notes: "Initial deposit" },
    { id: 2, client: "Joseph Noble", amount: 500, date: "2026-04-06", notes: "Remaining deposit — collected on site" },
    { id: 3, client: "Joseph Noble", amount: 3385, date: "2026-04-08", notes: "Morning of pour — collected ✅" },
    { id: 4, client: "Joseph Noble", amount: 1590, date: "2026-04-11", notes: "Final payment upon completion ✅" },
    { id: 5, client: "Frankie (Palm Coast Demo)", amount: 1250, date: "2026-04-10", notes: "Full payment — job complete ✅" },
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([{ id: 1, description: "Truck rental", amount: 520, date: "2026-04-05" }, { id: 2, description: "Home Depot — materials", amount: 145, date: "2026-04-06" }, { id: 3, description: "Gas", amount: 75, date: "2026-04-08" }, { id: 4, description: "Dark grey power release", amount: 171, date: "2026-04-08" }, { id: 5, description: "Concrete (3000 PSI)", amount: 1960, date: "2026-04-09" }, { id: 6, description: "Pumping service", amount: 450, date: "2026-04-09" }, { id: 7, description: "Stamp crew", amount: 1000, date: "2026-04-09" }, { id: 8, description: "Home Depot", amount: 9, date: "2026-04-09" }, { id: 9, description: "Home Depot — sealing supplies (receipt #00002-61941)", amount: 126.68, date: "2026-04-11" }, { id: 10, description: "Home Depot — sealing supplies (receipt #00006-12358)", amount: 30.08, date: "2026-04-11" }, { id: 11, description: "Gas", amount: 100, date: "2026-04-11" }, { id: 12, description: "Concrete — FCA-002 Frankie (Palm Coast)", amount: 620, date: "2026-04-10" }]);
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: "Joseph Noble", phone: "(904) 563-1660", jobDone: "Stamped Concrete — 730 sq ft", notes: "CLOSED ✅ Apr 12. Net profit: $1,888.24. Ask for Google review.", repeat: false, referral: "Facebook Marketplace" },
    { id: 2, name: "Frankie (Palm Coast Demo)", phone: "", jobDone: "Driveway Extension 12'x12'", notes: "CLOSED ✅ Apr 10. Frank@palmcoastdemo.com", repeat: false, referral: "Facebook Marketplace" },
  ]);

  const [fcaModal, setFcaModal] = useState<null | "lead" | "job" | "payment" | "expense">(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [fcaSection, setFcaSection] = useState<"kpi" | "leads" | "jobs" | "money" | "photos">("kpi");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const fcaKpi = {
    leadsWeek: leads.filter(l => l.stage !== "Lost").length,
    leadsMonth: leads.length,
    estimatesSent: leads.filter(l => ["Estimate Sent","Follow-Up","Booked"].includes(l.stage)).length,
    booked: leads.filter(l => l.stage === "Booked").length,
    completed: jobs.filter(j => j.status === "Completed").length,
    revenueWeek: payments.reduce((s, p) => s + p.amount, 0),
    revenueMonth: payments.reduce((s, p) => s + p.amount, 0),
    outstanding: jobs.reduce((s, j) => s + (j.totalPrice - j.depositPaid), 0),
    activeJobs: jobs.filter(j => j.status !== "Completed").length,
    totalExpenses: expenses.reduce((s, e) => s + e.amount, 0),
  };

  const nextLeadId = () => Math.max(0, ...leads.map(l => l.id)) + 1;
  const nextJobId = () => Math.max(0, ...jobs.map(j => j.id)) + 1;
  const nextPayId = () => Math.max(0, ...payments.map(p => p.id)) + 1;
  const nextExpId = () => Math.max(0, ...expenses.map(e => e.id)) + 1;
  const nextClientId = () => Math.max(0, ...clients.map(c => c.id)) + 1;

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
        <div className="flex gap-2 border-b border-slate-800 pb-0 flex-wrap">
          {(["ops", "fca", "memory"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition border-b-2 ${
                activeTab === tab
                  ? "border-orange-400 text-orange-400 bg-slate-900/60"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "ops" ? "⚙️ Operations" : tab === "fca" ? "🏗️ FCA Operations" : "🧠 Mac's Memory"}
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

                {/* Learnings */}
                {memFiles.filter(f => f.group === "learnings").length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 px-1">Learnings</p>
                    {memFiles.filter(f => f.group === "learnings").map(f => (
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

                {/* Dreams */}
                {memFiles.filter(f => f.group === "dreams").length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1 px-1">🌙 Dreams</p>
                    {memFiles.filter(f => f.group === "dreams").map(f => (
                      <button
                        key={f.key}
                        onClick={() => setSelectedFile(f.key)}
                        className={`w-full text-left rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                          selectedFile === f.key
                            ? "bg-purple-400/20 text-purple-300 border border-purple-400/30"
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

        {activeTab === "fca" && (
          <section className="space-y-4">

            {/* FCA Sub-nav */}
            <div className="flex flex-wrap gap-2">
              {(["kpi","leads","jobs","money","photos"] as const).map(s => (
                <button key={s} onClick={() => setFcaSection(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition ${fcaSection === s ? "bg-orange-400 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                  {s === "kpi" ? "📊 KPIs" : s === "leads" ? "🎯 Leads" : s === "jobs" ? "🔨 Jobs" : s === "money" ? "💰 Money" : "📸 Photos"}
                </button>
              ))}
            </div>

            {/* KPI SUMMARY */}
            {fcaSection === "kpi" && (
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">KPI Summary</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { label: "Leads This Week", val: fcaKpi.leadsWeek, color: "text-orange-400" },
                    { label: "Leads This Month", val: fcaKpi.leadsMonth, color: "text-orange-400" },
                    { label: "Estimates Sent", val: fcaKpi.estimatesSent, color: "text-blue-400" },
                    { label: "Jobs Booked", val: fcaKpi.booked, color: "text-green-400" },
                    { label: "Jobs Completed", val: fcaKpi.completed, color: "text-green-400" },
                    { label: "Revenue This Week", val: `$${fcaKpi.revenueWeek.toLocaleString()}`, color: "text-green-400" },
                    { label: "Revenue This Month", val: `$${fcaKpi.revenueMonth.toLocaleString()}`, color: "text-green-400" },
                    { label: "Outstanding", val: `$${fcaKpi.outstanding.toLocaleString()}`, color: "text-yellow-400" },
                    { label: "Active Jobs", val: fcaKpi.activeJobs, color: "text-white" },
                    { label: "Expenses", val: `$${fcaKpi.totalExpenses.toLocaleString()}`, color: "text-red-400" },
                  ].map((k, i) => (
                    <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                      <p className="text-xs text-slate-500">{k.label}</p>
                      <p className={`text-2xl font-black mt-1 ${k.color}`}>{k.val}</p>
                    </div>
                  ))}
                </div>

                {/* PNL BREAKDOWN */}
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-3">💸 P&amp;L — Closed Jobs</p>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left px-4 py-3 text-slate-500 font-semibold">Job</th>
                          <th className="text-right px-4 py-3 text-slate-500 font-semibold">Revenue</th>
                          <th className="text-right px-4 py-3 text-slate-500 font-semibold">Expenses</th>
                          <th className="text-right px-4 py-3 text-slate-500 font-semibold">Net Profit</th>
                          <th className="text-right px-4 py-3 text-slate-500 font-semibold">Margin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { job: "FCA-001 — Joseph Noble (Stamped, Jacksonville)", revenue: 6475, expenses: 4586.76, date: "Apr 12" },
                          { job: "FCA-002 — Frankie (Driveway, Palm Coast)", revenue: 1250, expenses: 620, date: "Apr 10" },
                        ].map((row, i) => {
                          const net = row.revenue - row.expenses;
                          const margin = ((net / row.revenue) * 100).toFixed(1);
                          return (
                            <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition">
                              <td className="px-4 py-3 text-slate-300 font-medium">{row.job} <span className="text-slate-600 ml-1">· {row.date}</span></td>
                              <td className="px-4 py-3 text-right text-white font-bold">${row.revenue.toLocaleString()}</td>
                              <td className="px-4 py-3 text-right text-red-400">${row.expenses.toLocaleString()}</td>
                              <td className="px-4 py-3 text-right text-green-400 font-black">${net.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                              <td className="px-4 py-3 text-right text-cyan-400">{margin}%</td>
                            </tr>
                          );
                        })}
                        <tr className="bg-slate-800/40">
                          <td className="px-4 py-3 text-orange-400 font-black uppercase tracking-wide text-xs">Total (2 Jobs)</td>
                          <td className="px-4 py-3 text-right text-white font-black">$7,725</td>
                          <td className="px-4 py-3 text-right text-red-400 font-black">$5,206.76</td>
                          <td className="px-4 py-3 text-right text-green-400 font-black text-sm">$2,518.24</td>
                          <td className="px-4 py-3 text-right text-cyan-400 font-black">32.6%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inline Insights */}
                <div className="space-y-2 mt-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-400">💡 Mac&apos;s Flags</p>
                  {leads.filter(l => l.stage === "Follow-Up" || l.stage === "Estimate Sent").map(l => (
                    <div key={l.id} className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-xs text-yellow-300">⚠️ Follow up: {l.name} — {l.stage} — {l.value}</div>
                  ))}
                  {jobs.filter(j => j.totalPrice - j.depositPaid > 0).map(j => (
                    <div key={j.id} className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-2 text-xs text-orange-300">💵 Outstanding: {j.client} — ${(j.totalPrice - j.depositPaid).toLocaleString()} remaining</div>
                  ))}
                  {leads.filter(l => { const v = parseFloat(l.value.replace(/[^0-9.]/g,"")); return !isNaN(v) && v >= 3000 && l.stage !== "Booked" && l.stage !== "Lost"; }).map(l => (
                    <div key={l.id} className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2 text-xs text-green-300">💰 High value: {l.name} — {l.value} — {l.stage}</div>
                  ))}
                  {leads.filter(l => l.stage === "Follow-Up" || l.stage === "Estimate Sent").length === 0 && jobs.filter(j => j.totalPrice - j.depositPaid > 0).length === 0 && (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-2 text-xs text-slate-500">✅ All clear — no flags.</div>
                  )}
                </div>
              </div>
            )}

            {/* LEADS */}
            {fcaSection === "leads" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Lead Pipeline</p>
                  <button onClick={() => { setEditingLead(null); setFcaModal("lead"); }}
                    className="rounded-xl bg-orange-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-orange-300 transition">+ Add Lead</button>
                </div>
                {(["New Lead","Contacted","Estimate Sent","Follow-Up","Booked","Lost"] as LeadStage[]).map(stage => {
                  const stageleads = leads.filter(l => l.stage === stage);
                  return (
                    <div key={stage}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${stage === "Booked" ? "bg-green-500/20 text-green-300" : stage === "Lost" ? "bg-red-500/20 text-red-300" : stage === "Estimate Sent" ? "bg-blue-500/20 text-blue-300" : "bg-slate-700 text-slate-300"}`}>{stage}</span>
                        <span className="text-xs text-slate-500">{stageleads.length} leads</span>
                      </div>
                      {stageleads.length === 0 && <p className="text-xs text-slate-600 pl-2 mb-3">None</p>}
                      {stageleads.map(lead => (
                        <div key={lead.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 mb-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-bold text-white">{lead.name}</p>
                              <p className="text-xs text-slate-400">{lead.phone} · {lead.area}</p>
                              <p className="text-xs text-slate-400">{lead.service} · <span className="text-green-400 font-bold">{lead.value}</span> · {lead.source}</p>
                              {lead.notes && <p className="text-xs text-slate-500 mt-1">{lead.notes}</p>}
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => { setEditingLead(lead); setFcaModal("lead"); }}
                                className="text-xs text-orange-400 hover:text-orange-300">Edit</button>
                              <button onClick={() => setLeads(prev => prev.filter(l => l.id !== lead.id))}
                                className="text-xs text-red-400 hover:text-red-300">✕</button>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {(["New Lead","Contacted","Estimate Sent","Follow-Up","Booked","Lost"] as LeadStage[]).filter(s => s !== lead.stage).map(s => (
                              <button key={s} onClick={() => setLeads(prev => prev.map(l => l.id === lead.id ? {...l, stage: s} : l))}
                                className="text-xs rounded-lg bg-slate-800 px-2 py-1 text-slate-400 hover:text-white transition">→ {s}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* JOBS */}
            {fcaSection === "jobs" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Job Tracker</p>
                  <button onClick={() => { setEditingJob(null); setFcaModal("job"); }}
                    className="rounded-xl bg-orange-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-orange-300 transition">+ Add Job</button>
                </div>
                {jobs.map(job => {
                  const remaining = job.totalPrice - job.depositPaid;
                  const pct = job.totalPrice > 0 ? Math.round((job.depositPaid / job.totalPrice) * 100) : 0;
                  return (
                    <div key={job.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-white">{job.client}</p>
                          <p className="text-xs text-slate-400">{job.location} · {job.jobType}</p>
                          {(() => { const c = clients.find(x => x.name === job.client); return c?.phone ? <p className="text-xs text-slate-500">📞 {c.phone}</p> : null; })()}
                          {job.notes && <p className="text-xs text-slate-500 mt-1">{job.notes}</p>}
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${job.status === "Completed" ? "bg-green-500/20 text-green-300" : job.status === "In Progress" ? "bg-blue-500/20 text-blue-300" : "bg-yellow-500/20 text-yellow-300"}`}>{job.status}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-xl bg-slate-800/60 p-3">
                          <p className="text-xs text-slate-500">Total</p>
                          <p className="text-lg font-black text-white">${job.totalPrice.toLocaleString()}</p>
                        </div>
                        <div className="rounded-xl bg-slate-800/60 p-3">
                          <p className="text-xs text-slate-500">Received</p>
                          <p className="text-lg font-black text-green-400">${job.depositPaid.toLocaleString()}</p>
                        </div>
                        <div className="rounded-xl bg-slate-800/60 p-3">
                          <p className="text-xs text-slate-500">Remaining</p>
                          <p className="text-lg font-black text-yellow-400">${remaining.toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Paid</span><span>{pct}%</span></div>
                        <div className="h-2 bg-slate-800 rounded-full"><div className="h-2 bg-green-500 rounded-full transition-all" style={{width: `${pct}%`}} /></div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {(["Scheduled","In Progress","Completed"] as JobStatus[]).filter(s => s !== job.status).map(s => (
                          <button key={s} onClick={() => setJobs(prev => prev.map(j => j.id === job.id ? {...j, status: s} : j))}
                            className="text-xs rounded-xl bg-slate-800 px-3 py-1.5 text-slate-400 hover:text-white transition">→ {s}</button>
                        ))}
                        <button onClick={() => { setEditingJob(job); setFcaModal("job"); }}
                          className="text-xs rounded-xl bg-slate-800 px-3 py-1.5 text-orange-400 hover:text-orange-300 transition">Edit</button>
                        <button onClick={() => { setFcaModal("payment"); }}
                          className="text-xs rounded-xl bg-green-500/20 border border-green-500/30 px-3 py-1.5 text-green-300 hover:text-green-200 transition">+ Payment</button>
                      </div>
                    </div>
                  );
                })}
                {jobs.length === 0 && <p className="text-slate-600 text-sm">No jobs yet.</p>}
              </div>
            )}

            {/* MONEY */}
            {fcaSection === "money" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-500">Total Received</p>
                    <p className="text-2xl font-black text-green-400">${payments.reduce((s,p) => s+p.amount,0).toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-500">Outstanding</p>
                    <p className="text-2xl font-black text-yellow-400">${fcaKpi.outstanding.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-500">Total Expenses</p>
                    <p className="text-2xl font-black text-red-400">${fcaKpi.totalExpenses.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-xs text-slate-500">Net</p>
                    <p className="text-2xl font-black text-white">${(payments.reduce((s,p) => s+p.amount,0) - fcaKpi.totalExpenses).toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-green-400">Payments Received</p>
                      <button onClick={() => setFcaModal("payment")} className="text-xs rounded-xl bg-green-500/20 border border-green-500/30 px-3 py-1.5 text-green-300 hover:text-green-200">+ Add</button>
                    </div>
                    {payments.length === 0 && <p className="text-xs text-slate-600">No payments yet.</p>}
                    {payments.map(p => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl bg-slate-800/60 px-4 py-2.5 mb-2">
                        <div><p className="text-sm font-semibold text-white">{p.client}</p><p className="text-xs text-slate-500">{p.date} · {p.notes}</p></div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-black text-green-400">+${p.amount.toLocaleString()}</p>
                          <button onClick={() => setPayments(prev => prev.filter(x => x.id !== p.id))} className="text-xs text-red-400 hover:text-red-300">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-red-400">Expenses</p>
                      <button onClick={() => setFcaModal("expense")} className="text-xs rounded-xl bg-red-500/20 border border-red-500/30 px-3 py-1.5 text-red-300 hover:text-red-200">+ Add</button>
                    </div>
                    {expenses.length === 0 && <p className="text-xs text-slate-600">No expenses logged.</p>}
                    {expenses.map(e => (
                      <div key={e.id} className="flex items-center justify-between rounded-xl bg-slate-800/60 px-4 py-2.5 mb-2">
                        <div><p className="text-sm font-semibold text-white">{e.description}</p><p className="text-xs text-slate-500">{e.date}</p></div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-black text-red-400">-${e.amount.toLocaleString()}</p>
                          <button onClick={() => setExpenses(prev => prev.filter(x => x.id !== e.id))} className="text-xs text-red-400 hover:text-red-300">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {/* PHOTOS */}
            {fcaSection === "photos" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Job Photo Gallery</p>
                  <p className="text-xs text-slate-500">Add photos to <code className="bg-slate-800 px-1 rounded">/public/fca-photos/fca-00X/</code> in the GitHub repo</p>
                </div>
                {Object.entries(FCA_PHOTOS).map(([jobId, groups]) => (
                  <div key={jobId} className="space-y-3">
                    {groups.map(group => (
                      <div key={group.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-sm font-bold text-white mb-4">{jobId} — {group.label.split("—").slice(1).join("—").trim()}</p>
                        {group.photos.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">
                            <p className="text-slate-500 text-sm">📸 No photos yet</p>
                            <p className="text-slate-600 text-xs mt-1">Upload to /public/fca-photos/{group.id}/</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {group.photos.map((photo, i) => (
                              <div key={i}
                                className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800 cursor-pointer hover:border-orange-400 transition group"
                                onClick={() => setLightbox(photo.url)}
                              >
                                <div className="aspect-square bg-slate-800 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={photo.url}
                                    alt={photo.caption}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    onError={(e) => {
                                      const t = e.target as HTMLImageElement;
                                      t.style.display = "none";
                                      if (t.parentElement) t.parentElement.innerHTML = "<p class=\"text-slate-600 text-xs p-4 text-center\">📷 No image</p>";
                                    }}
                                  />
                                </div>
                                <div className="px-2 py-1.5">
                                  <p className="text-xs text-slate-400 truncate">{photo.caption}</p>
                                  <p className="text-xs text-slate-600">{photo.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* LIGHTBOX */}
            {lightbox && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
                <div className="relative max-w-4xl max-h-full">
                  <img src={lightbox} alt="FCA job photo" className="max-w-full max-h-screen rounded-2xl object-contain" />
                  <button
                    className="absolute top-3 right-3 bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg hover:bg-black/80"
                    onClick={() => setLightbox(null)}
                  >✕</button>
                </div>
              </div>
            )}

            {/* MODALS */}
            {fcaModal === "lead" && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 w-full max-w-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">{editingLead ? "Edit Lead" : "Add Lead"}</p>
                    <button onClick={() => { setFcaModal(null); setEditingLead(null); }} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  <form onSubmit={e => {
                    e.preventDefault();
                    const f = e.currentTarget;
                    const get = (n: string) => (f.elements.namedItem(n) as HTMLInputElement)?.value || "";
                    if (editingLead) {
                      setLeads(prev => prev.map(l => l.id === editingLead.id ? {...l, name:get("name"),phone:get("phone"),area:get("area"),service:get("service"),value:get("value"),source:get("source"),notes:get("notes"),stage:get("stage") as LeadStage} : l));
                    } else {
                      setLeads(prev => [...prev, {id:nextLeadId(),name:get("name"),phone:get("phone"),area:get("area"),service:get("service"),value:get("value"),source:get("source"),notes:get("notes"),stage:get("stage") as LeadStage}]);
                    }
                    setFcaModal(null); setEditingLead(null);
                  }} className="space-y-2">
                    {[["name","Name *","text",editingLead?.name||""],["phone","Phone","tel",editingLead?.phone||""],["area","Area / Address","text",editingLead?.area||""],["service","Service Type","text",editingLead?.service||""],["value","Estimated Value","text",editingLead?.value||""],["source","Source","text",editingLead?.source||""],["notes","Notes","text",editingLead?.notes||""]].map(([n,l,t,v]) => (
                      <div key={n} className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-400">{l}</label>
                        <input name={n as string} type={t as string} defaultValue={v as string} required={n==="name"} className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:border-orange-400 focus:outline-none" />
                      </div>
                    ))}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-400">Stage</label>
                      <select name="stage" defaultValue={editingLead?.stage||"New Lead"} className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:border-orange-400 focus:outline-none">
                        {["New Lead","Contacted","Estimate Sent","Follow-Up","Booked","Lost"].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <button type="submit" className="w-full rounded-xl bg-orange-400 py-2.5 text-sm font-bold text-slate-950 hover:bg-orange-300 transition mt-2">{editingLead ? "Save Changes" : "Add Lead"}</button>
                  </form>
                </div>
              </div>
            )}

            {fcaModal === "job" && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 w-full max-w-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">{editingJob ? "Edit Job" : "Add Job"}</p>
                    <button onClick={() => { setFcaModal(null); setEditingJob(null); }} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  <form onSubmit={e => {
                    e.preventDefault();
                    const f = e.currentTarget;
                    const get = (n: string) => (f.elements.namedItem(n) as HTMLInputElement)?.value || "";
                    if (editingJob) {
                      setJobs(prev => prev.map(j => j.id === editingJob.id ? {...j, client:get("client"),location:get("location"),jobType:get("jobType"),totalPrice:parseFloat(get("totalPrice"))||0,depositPaid:parseFloat(get("depositPaid"))||0,status:get("status") as JobStatus,notes:get("notes")} : j));
                    } else {
                      setJobs(prev => [...prev, {id:nextJobId(),client:get("client"),location:get("location"),jobType:get("jobType"),totalPrice:parseFloat(get("totalPrice"))||0,depositPaid:parseFloat(get("depositPaid"))||0,status:get("status") as JobStatus,notes:get("notes")}]);
                    }
                    setFcaModal(null); setEditingJob(null);
                  }} className="space-y-2">
                    {[["client","Client Name *","text",editingJob?.client||""],["location","Location","text",editingJob?.location||""],["jobType","Job Type","text",editingJob?.jobType||""],["totalPrice","Total Price","number",(editingJob?.totalPrice||"").toString()],["depositPaid","Deposit / Paid","number",(editingJob?.depositPaid||"").toString()],["notes","Notes","text",editingJob?.notes||""]].map(([n,l,t,v]) => (
                      <div key={n} className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-400">{l}</label>
                        <input name={n as string} type={t as string} defaultValue={v as string} required={n==="client"} className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:border-orange-400 focus:outline-none" />
                      </div>
                    ))}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-400">Status</label>
                      <select name="status" defaultValue={editingJob?.status||"Scheduled"} className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:border-orange-400 focus:outline-none">
                        {["Scheduled","In Progress","Completed"].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <button type="submit" className="w-full rounded-xl bg-orange-400 py-2.5 text-sm font-bold text-slate-950 hover:bg-orange-300 transition mt-2">{editingJob ? "Save Changes" : "Add Job"}</button>
                  </form>
                </div>
              </div>
            )}

            {fcaModal === "payment" && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 w-full max-w-md space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">Record Payment</p>
                    <button onClick={() => setFcaModal(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  <form onSubmit={e => {
                    e.preventDefault();
                    const f = e.currentTarget;
                    const get = (n: string) => (f.elements.namedItem(n) as HTMLInputElement)?.value || "";
                    const amt = parseFloat(get("amount")) || 0;
                    const client = get("client");
                    setPayments(prev => [...prev, {id:nextPayId(),client,amount:amt,date:get("date"),notes:get("notes")}]);
                    setJobs(prev => prev.map(j => j.client === client ? {...j, depositPaid: j.depositPaid + amt} : j));
                    setFcaModal(null);
                  }} className="space-y-2">
                    {[["client","Client","text",""],["amount","Amount ($)","number",""],["date","Date","date",new Date().toISOString().slice(0,10)],["notes","Notes","text",""]].map(([n,l,t,v]) => (
                      <div key={n} className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-400">{l}</label>
                        <input name={n as string} type={t as string} defaultValue={v as string} required={n==="client"||n==="amount"} className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:border-orange-400 focus:outline-none" />
                      </div>
                    ))}
                    <button type="submit" className="w-full rounded-xl bg-green-500 py-2.5 text-sm font-bold text-white hover:bg-green-400 transition mt-2">Record Payment</button>
                  </form>
                </div>
              </div>
            )}

            {fcaModal === "expense" && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 w-full max-w-md space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">Add Expense</p>
                    <button onClick={() => setFcaModal(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  <form onSubmit={e => {
                    e.preventDefault();
                    const f = e.currentTarget;
                    const get = (n: string) => (f.elements.namedItem(n) as HTMLInputElement)?.value || "";
                    setExpenses(prev => [...prev, {id:nextExpId(),description:get("description"),amount:parseFloat(get("amount"))||0,date:get("date")}]);
                    setFcaModal(null);
                  }} className="space-y-2">
                    {[["description","Description","text",""],["amount","Amount ($)","number",""],["date","Date","date",new Date().toISOString().slice(0,10)]].map(([n,l,t,v]) => (
                      <div key={n} className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-400">{l}</label>
                        <input name={n as string} type={t as string} defaultValue={v as string} required className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:border-orange-400 focus:outline-none" />
                      </div>
                    ))}
                    <button type="submit" className="w-full rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-400 transition mt-2">Add Expense</button>
                  </form>
                </div>
              </div>
            )}

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

        <div className="border-t border-slate-800 pt-4 text-center">
          <p className="text-xs text-slate-600">Tauschus Mission Control · Powered by Mac AI · Auto-refreshes every 60s</p>
        </div>

        </> }

      </div>
    </main>
  );
}






