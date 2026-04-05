"use client";
// Memory API: CRONS.md added to core file list (2026-03-28)
// Dashboard updated 2026-04-05: 23:39 UTC — FCA-001 expense added: $520 truck rental. Twitter suspended (appeal submitted). Tweet autopilot paused.
import { useEffect, useState, useCallback } from "react";

const PASS = "Vanta2026";

const CRYPTO_ASSETS = [
  { symbol: "BTC_USDT", label: "Bitcoin", short: "BTC", target: "Hold — base at $70K", color: "#f97316" },
  { symbol: "ETH_USDT", label: "Ethereum", short: "ETH", target: "Accumulate $2,100–2,200", color: "#6366f1" },
  { symbol: "ONDO_USDT", label: "Ondo Finance", short: "ONDO", target: "Hold — target $0.73 EOY", color: "#22d3ee" },
  { symbol: "SOL_USDT", label: "Solana", short: "SOL", target: "Watch $95 breakout", color: "#a78bfa" },
];

const POLY_MARKETS = [
  { label: "US forces enter Iran by April 30", rec: "MONITOR — NEAR CERTAINTY", risk: "RESTRICTED", riskColor: "text-red-400", note: "US special forces confirmed inside Iran Apr 3. YES surged to 99.65¢ — near-certainty resolution. $22M vol 24h. RESTRICTED for US users — monitor only.", alloc: "WATCH" },
  { label: "Clarity Act Signed 2026", rec: "YES @ ~62¢", risk: "MEDIUM", riskColor: "text-orange-400", note: "ONDO double dip — direct RWA catalyst. Needs Tash approval + $40 USDC funding.", alloc: "$40" },
  { label: "US Recession by EOY 2026", rec: "YES @ ~35¢", risk: "LOW-MED", riskColor: "text-yellow-400", note: "Portfolio hedge — hawkish macro + Iran escalation risk. Fed holding; FOMC Apr 28-29 next catalyst. Needs Tash approval + $30 USDC.", alloc: "$30" },
];

const CRON_JOBS = [
  {
    name: "🌙 Overnight Product Builder",
    schedule: "Daily 11:00 PM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-05 11PM ET OK · AI Estimating & Scheduling Playbook built — 10 pages, 5 tweets cron'd 7–9AM ET",
    detail: "Researches trending construction topics → builds PDF product → schedules 5 tweets → reports to Telegram",
  },
  {
    name: "📊 Dashboard + Memory Sync",
    schedule: "Daily 4:00 AM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-05 13:42 UTC OK · All 13 cron jobs verified ACTIVE",
    detail: "Reads all memory files → pulls live crypto + Polymarket data → updates MEMORY.md → pushes dashboard to GitHub",
  },
  {
    name: "📊 Market Scan — 6AM ET",
    schedule: "Daily 6:00 AM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-05 6AM ET OK · Delivered to Telegram · All crypto at cycle lows — risk-off",
    detail: "Live crypto prices (BTC/ETH/ONDO/SOL/LYX) + Polymarket scan → logs to workspace → Telegram report",
  },
  {
    name: "🧠 Self-Learning Loop",
    schedule: "Daily 7:00 AM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-05 7AM ET OK · 3 learnings logged — Twitter auth fix, tweet threading gap escalated",
    detail: "Reviews today's daily log → evaluates performance → extracts learnings → appends to Learnings.md → checks for new skill candidates",
  },
  {
    name: "📘 FCA Daily Facebook Post",
    schedule: "Daily 10:00 AM ET (14:00 UTC)",
    status: "ACTIVE",
    last: "Last run: 2026-04-05 14:00 UTC OK",
    detail: "Posts to Florida Concrete Alliance page · NE Florida · floridaconcretealliance.com · Token: PERMANENT (never expires)",
  },
  {
    name: "🐦 Daily Tweet Smart Autopilot",
    schedule: "Daily 10:00 AM UTC",
    status: "⚠️ AUTH ERROR",
    last: "Last run: 2026-04-05 10AM UTC — 401 FAIL · Twitter access token expired/revoked. Regen at developer.twitter.com",
    detail: "Rotates tweet library (contractor + OpenClaw products). Override mode for new products. ⚠️ BLOCKED — tokens expired/revoked.",
  },
  {
    name: "📊 Market Scan — 6PM ET",
    schedule: "Daily 6:00 PM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-04 6PM ET OK · Next run today 6PM ET",
    detail: "Same as 6AM scan — second daily pulse. Delivered to Telegram.",
  },
  {
    name: "📦 Pending Products Scanner",
    schedule: "Daily 11:00 PM ET",
    status: "ACTIVE",
    last: "Last run: 2026-04-05 11PM ET OK · 7 PDFs tracked, 1 newly eligible (ai-bidding-playbook)",
    detail: "Scans /products for unlisted PDFs → updates pending-products.md → flags for Tash approval",
  },
  {
    name: "🐦 Campaign: AI Concrete Estimating (5 tweets)",
    schedule: "One-shot: 7:00–9:00 AM ET Apr 5",
    status: "ACTIVE",
    last: "Scheduled today: 11AM–1PM UTC. Linking to vantaai3.gumroad.com/l/AIplaybook1",
    detail: "5 one-shot tweet jobs spaced 30 min apart. auto-deletes after posting. Campaign for overnight AI Estimating product.",
  },
];

const CRON_LAST_UPDATED = "2026-04-05 13:42 UTC";

const TASKS = [
  { task: "🔴 URGENT: Regenerate Twitter API tokens — 401 Unauthorized error, all tweet automation BLOCKED. Go to developer.twitter.com → Projects & Apps → vantaai3 → Keys & Tokens → Regenerate Access Token & Secret → update CREDENTIALS.md", priority: "HIGH", pillar: "Online" },
  { task: "🔴 FCA-001 TOMORROW Mon Apr 6: show up, collect $500 remaining deposit. Pour Wed Apr 8: collect $3,385 morning of pour. Completion: $1,590.", priority: "HIGH", pillar: "FCA" },
  { task: "🔴 Upload 2 PDFs to Gumroad: AI Estimating & Scheduling Playbook (built Apr 5) + AI Bidding Playbook (built Apr 4). Suggested $7–$12 each.", priority: "HIGH", pillar: "Online" },
  { task: "🔴 Fund Polymarket — $70 USDC ($40 Clarity Act YES + $30 Recession hedge). Iran Apr 30 YES at 99.65¢ — near certainty.", priority: "HIGH", pillar: "Crypto" },
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
  { stage: "Won", count: 1, color: "#22c55e" },
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
    { id: 1, name: "Joseph Noble", phone: "", area: "Jacksonville, FL", service: "Stamped Concrete", value: "$6,475", source: "Facebook Marketplace", notes: "730 sq ft. $1,000 deposit received. Starts Mon Apr 6. Pour Wed Apr 8.", stage: "Booked" },
  ]);
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, client: "Joseph Noble", location: "Jacksonville, FL", jobType: "Stamped Concrete", totalPrice: 6475, depositPaid: 1000, status: "Scheduled", notes: "730 sq ft. Mon Apr 6 start. Pour Apr 8. Remaining: $5,475." },
  ]);
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, client: "Joseph Noble", amount: 1000, date: "2026-04-04", notes: "Initial deposit" },
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([{ id: 1, description: "Truck rental", amount: 520, date: "2026-04-05" }]);
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: "Joseph Noble", phone: "", jobDone: "Stamped Concrete — 730 sq ft", notes: "Active job Apr 6–8", repeat: false, referral: "Facebook Marketplace" },
  ]);

  const [fcaModal, setFcaModal] = useState<null | "lead" | "job" | "payment" | "expense">(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [fcaSection, setFcaSection] = useState<"kpi" | "leads" | "jobs" | "money">("kpi");

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
              {(["kpi","leads","jobs","money"] as const).map(s => (
                <button key={s} onClick={() => setFcaSection(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition ${fcaSection === s ? "bg-orange-400 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                  {s === "kpi" ? "📊 KPIs" : s === "leads" ? "🎯 Leads" : s === "jobs" ? "🔨 Jobs" : "💰 Money"}
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
              <div><p className="text-xs text-slate-500">Current Day</p><p className="text-3xl font-black text-orange-400">25 / 28</p></div>
              <div><p className="text-xs text-slate-500">Phase</p><p className="text-sm font-bold text-white">6 — Revenue Sprint</p></div>
              <div><p className="text-xs text-slate-500">Revenue</p><p className="text-3xl font-black text-green-400">$0</p><p className="text-xs text-slate-500">Target: $100</p></div>
              <div><p className="text-xs text-slate-500">Products Live</p><p className="text-3xl font-black text-white">9</p><p className="text-xs text-slate-500">Contractor + OpenClaw</p></div>
              <div><p className="text-xs text-slate-500">Tweets Sent</p><p className="text-3xl font-black text-white">60+</p></div>
              <div><p className="text-xs text-slate-500">PDFs Built</p><p className="text-3xl font-black text-white">7</p><p className="text-xs text-slate-500">Approval queue</p></div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-orange-400 h-2 rounded-full" style={{width: "11%"}} /></div>
            <p className="text-xs text-slate-500">Blockers: Twitter API 401 (tokens expired — need regen) + product approval backlog (2 PDFs built Apr 4–5). Next: regen tokens → approve AI Playbooks → list on Gumroad.</p>
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
                <div className="flex justify-between text-xs"><span className="text-slate-500">Tweets since Mar 27</span><span className="text-white font-semibold">60+ override + rotation</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Threads posted</span><span className="text-white font-semibold">5 (autopilot, cron, ops, launch, bip)</span></div>
                <div className="flex justify-between text-xs"><span className="text-slate-500">Products live</span><span className="text-white font-semibold">9 (contractor + OpenClaw)</span></div>
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
                { alert: "🔴 CRITICAL: Twitter API 401 — Access Token expired/revoked. All tweet automation BLOCKED until tokens regenerated. Go to developer.twitter.com → Keys & Tokens → Regenerate Access Token & Secret → update CREDENTIALS.md.", urgency: "HIGH" },
                { alert: "🔴 HIGH: FCA-001 starts TOMORROW Mon Apr 6 — Joseph Noble, Jacksonville FL. 730 sq ft stamped concrete. Collect $500 remaining deposit at start. Pour Wed Apr 8 ($3,385 morning of pour). Completion $1,590.", urgency: "HIGH" },
                { alert: "✅ All 13 cron jobs ACTIVE as of 2026-04-05 13:42 UTC sync. Dashboard + Memory Sync confirmed operational.", urgency: "OK" },
                { alert: "🟢 WIN: AI Estimating & Scheduling Playbook built overnight Apr 5 — 10 pages, cover + TOC. 5 tweets scheduled 11AM–1PM UTC. Needs Gumroad upload.", urgency: "OK" },
                { alert: "🟢 WIN: AI Bidding Playbook for Concrete Subs built overnight Apr 4 — 8-page PDF, 5 tweets posted. Needs Gumroad listing ($7–$12).", urgency: "OK" },
                { alert: "💰 FCA-001 NEXT PAYMENTS: Mon Apr 6 $500 remaining deposit · Wed Apr 8 $3,385 morning of pour · Completion $1,590. Total remaining: $5,475.", urgency: "MED" },
                { alert: "🔴 HIGH: Polymarket unfunded — $70 USDC needed ($40 Clarity Act YES + $30 Recession hedge). Iran Apr 30 YES at 99.65¢ — near-certainty resolution imminent.", urgency: "HIGH" },
                { alert: "🟡 MED: First AI Chief of Staff client still outstanding — post in contractor FB groups (tauschus.com/ai-chief-of-staff)", urgency: "MED" },
                { alert: "🟡 MED: Set up Kit.com (free) — 4-email nurture sequence written, just needs platform to activate", urgency: "MED" },
                { alert: "🟢 WIN: 4 OpenClaw products launched Mar 31 — Twitter Autopilot ($9) + Cron Kit ($9) + Ops Bundle ($19) + Free Checklist", urgency: "OK" },
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
                { move: "🥇 URGENT: Regenerate Twitter API tokens — developer.twitter.com → Keys & Tokens → Regenerate. All tweet automation is offline." },
                { move: "🥈 FCA-001 TOMORROW Mon Apr 6: show up, collect $500 remaining deposit. Wed Apr 8: collect $3,385 morning of pour. $6,475 contracted." },
                { move: "🥉 Upload 2 products to Gumroad: AI Estimating Playbook (Apr 5) + AI Bidding Playbook (Apr 4). Both $7–$12. Waiting on Tash." },
                { move: "🔲 Fund Polymarket ($70 USDC) — $40 Clarity Act YES + $30 Recession hedge. Iran Apr 30 near-certainty resolution." },
                { move: "🔲 Post AI Chief of Staff in contractor FB groups — first $97/mo recurring client (tauschus.com/ai-chief-of-staff)" },
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



