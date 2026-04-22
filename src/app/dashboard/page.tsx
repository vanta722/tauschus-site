"use client";
// Memory API: CRONS.md added to core file list (2026-03-28)
// Dashboard updated 2026-04-22: 03:00 UTC — Contract recovery plan locked. LDA staking contract (2,290 TRX/$752) — 5-step plan ready. Cost: ~$51. Net: ~$700. Awaiting mainnet execution.
import { useEffect, useState, useCallback } from "react";
import LionXAdmin from "./lionx-admin";

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

const CRON_LAST_UPDATED = "2026-04-15 08:00 UTC";

const BETTING_STATS = {
  record: "1-0-0",
  unitsWagered: 1,
  unitsNet: 0.645,
  roi: "+64.5%",
  activeSince: "Apr 21, 2026",
  book: "Hard Rock Bet",
  sport: "MLB",
  lastUpdated: "2026-04-22",
};

const TASKS = [
  { task: "🔑 Execute Tron contract recovery — 5 steps in TronLink with TX4KwH1X... wallet. See context/contract-recovery-plan.md. Cost ~$51, return ~$752.", priority: "HIGH", pillar: "Crypto" },
  { task: "🚫 CRITICAL: Appeal Twitter/X account suspension — twitter.com/account/suspended. All tweet automation paused.", priority: "HIGH", pillar: "Online" },
  { task: "📦 Approve + list pending products — 10 in queue (9 PDFs + 1 markdown). Review pending-products.md and price/publish each.", priority: "HIGH", pillar: "Online" },
  { task: "🎯 Fund Polymarket — $70 USDC ready. $40 Clarity Act YES + $30 recession hedge. Next catalyst: FOMC April 28-29.", priority: "HIGH", pillar: "Crypto" },
  { task: "🟡 First AI Chief of Staff client — post pitch in contractor FB groups (tauschus.com/ai-chief-of-staff). Page live.", priority: "MED", pillar: "Online" },
  { task: "🟡 Monitor Gumroad — track downloads + sales weekly. Posted in FB groups Mar 28. Watch for traffic.", priority: "MED", pillar: "Online" },
  { task: "🟡 FCA: Both jobs CLOSED ✅ Noble ,888 net / Frankie 30 net. Ask Joseph Noble for Google review.", priority: "MED", pillar: "FCA" },
  { task: "🟡 Build property manager outreach list (20–30 contacts, NE Florida — Google Maps + FB).", priority: "MED", pillar: "FCA" },
  { task: "⚠️ Verify Resend domain for floridaconcretealliance.com — contractor welcome emails failing silently.", priority: "MED", pillar: "FCA" },
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
  const [activeTab, setActiveTab] = useState<"ops" | "memory" | "fca" | "lionx" | "betting">("ops");

  // Sports Betting state
  interface BetEntry {
    id: number; date: string; game: string; bet: string; odds: string;
    units: number; result: "Pending" | "Won" | "Lost" | "Push"; pnl: number;
    wager?: string; toWin?: string;
  }
  const TODAY_BETS: BetEntry[] = [
    { id: 1, date: "2026-04-21", game: "Astros @ Guardians", bet: "Guardians ML", odds: "-155", units: 1, result: "Pending", pnl: 0, wager: "$10", toWin: "$16.45" },
    { id: 2, date: "2026-04-21", game: "D-backs vs White Sox", bet: "D-backs Team Total Over 4.5", odds: "-125", units: 1, result: "Pending", pnl: 0 },
    { id: 3, date: "2026-04-21", game: "Mets vs Twins", bet: "Mets ML", odds: "-108", units: 1, result: "Pending", pnl: 0 },
  ];
  const LS_KEY = "tauschus_bets_v1";
  const loadBets = (): BetEntry[] => {
    if (typeof window === "undefined") return TODAY_BETS;
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return TODAY_BETS;
      return JSON.parse(raw) as BetEntry[];
    } catch { return TODAY_BETS; }
  };
  const [bets, setBets] = useState<BetEntry[]>(loadBets);
  const [showAddBet, setShowAddBet] = useState(false);
  const [liveOdds, setLiveOdds] = useState<any[]>([]);
  const [oddsLoading, setOddsLoading] = useState(false);
  const [oddsLastFetched, setOddsLastFetched] = useState<Date | null>(null);
  const [newBet, setNewBet] = useState<Omit<BetEntry, "id">>({
    date: new Date().toISOString().slice(0, 10), game: "", bet: "", odds: "", units: 1, result: "Pending", pnl: 0,
  });
  const saveBets = (updated: BetEntry[]) => {
    setBets(updated);
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };
  const addBetEntry = () => {
    const id = Math.max(0, ...bets.map(b => b.id)) + 1;
    const pnl = newBet.result === "Won"
      ? +(newBet.units * (parseFloat(newBet.odds) > 0 ? parseFloat(newBet.odds) / 100 : 100 / Math.abs(parseFloat(newBet.odds)))).toFixed(2)
      : newBet.result === "Lost" ? -newBet.units
      : 0;
    saveBets([...bets, { ...newBet, id, pnl }]);
    setNewBet({ date: new Date().toISOString().slice(0, 10), game: "", bet: "", odds: "", units: 1, result: "Pending", pnl: 0 });
    setShowAddBet(false);
  };
  const updateBetResult = (id: number, result: BetEntry["result"]) => {
    const updated = bets.map(b => {
      if (b.id !== id) return b;
      const pnl = result === "Won"
        ? +(b.units * (parseFloat(b.odds) > 0 ? parseFloat(b.odds) / 100 : 100 / Math.abs(parseFloat(b.odds)))).toFixed(2)
        : result === "Lost" ? -b.units
        : 0;
      return { ...b, result, pnl };
    });
    saveBets(updated);
  };
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

  const fetchOdds = async () => {
    setOddsLoading(true);
    try {
      const r = await fetch("/api/odds");
      const d = await r.json();
      if (Array.isArray(d)) {
        setLiveOdds(d);
        setOddsLastFetched(new Date());
      }
    } catch {}
    setOddsLoading(false);
  };

  useEffect(() => {
    if (authed && activeTab === "memory" && memFiles.length === 0) {
      fetchMemFiles();
    }
  }, [authed, activeTab, memFiles.length, fetchMemFiles]);

  useEffect(() => {
    if (authed && activeTab === "betting" && liveOdds.length === 0) {
      fetchOdds();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, activeTab]);

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
          {(["ops", "fca", "memory", "lionx", "betting"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition border-b-2 ${
                activeTab === tab
                  ? "border-orange-400 text-orange-400 bg-slate-900/60"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "ops" ? "⚙️ Operations" : tab === "fca" ? "🏗️ FCA Operations" : tab === "memory" ? "🧠 Mac's Memory" : tab === "lionx" ? "🦁 Lion X" : "⚾ Sports Betting"}
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
              <div><p className="text-xs text-slate-500">Current Day</p><p className="text-3xl font-black text-orange-400">28 / 28</p></div>
              <div><p className="text-xs text-slate-500">Phase</p><p className="text-sm font-bold text-white">6 — Revenue Sprint</p></div>
              <div><p className="text-xs text-slate-500">Revenue</p><p className="text-3xl font-black text-green-400">$0</p><p className="text-xs text-slate-500">Target: $100</p></div>
              <div><p className="text-xs text-slate-500">Products Live</p><p className="text-3xl font-black text-white">9</p><p className="text-xs text-slate-500">Contractor + OpenClaw</p></div>
              <div><p className="text-xs text-slate-500">Tweets Sent</p><p className="text-3xl font-black text-white">60+</p></div>
              <div><p className="text-xs text-slate-500">PDFs Built</p><p className="text-3xl font-black text-white">7</p><p className="text-xs text-slate-500">Approval queue</p></div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-orange-400 h-2 rounded-full" style={{width: "11%"}} /></div>
            <p className="text-xs text-slate-500">Blockers: Twitter/X account SUSPENDED (account-level ban) + Anthropic billing errors (Dashboard + Market Scan 6AM offline). Next: top up billing → appeal Twitter → approve product queue → list on Gumroad.</p>
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
                { alert: "🔴 CRITICAL: Twitter/X ACCOUNT SUSPENDED — account-level ban. Appeal at twitter.com/account/suspended. All tweet automation offline.", urgency: "HIGH" },
                { alert: "🟢 FCA-001 CLOSED ✅ Apr 12: Joseph Noble stamped concrete — $6,475 collected | $4,586.76 expenses | $1,888.24 net profit. First FCA job done.", urgency: "OK" },
                { alert: "🟢 FCA-002 CLOSED ✅: Frankie (Palm Coast Demo) — $1,250 contract | $620 concrete | $630 net profit. Apr 10.", urgency: "OK" },
                { alert: "🟢 CRONS RECOVERED: 6 of 7 systems ACTIVE. Product Builder FIXED (claude-sonnet-4-6). Market Scan 6PM had 1 billing error — monitoring.", urgency: "OK" },
                { alert: "🟢 CRYPTO: BTC $71,681 (+4.46%) · ETH $2,254.74 (+7.17%) · ONDO $0.2706 (+6.42%) · SOL $84.55 (+5.86%). BTC broke $71K — full recovery.", urgency: "OK" },
                { alert: "🟡 POLYMARKET: Ceasefire markets resolving. Hold $70 USDC for new non-restricted plays.", urgency: "MED" },
                { alert: "🟡 7 PDFs in product queue — holding for Tash release decision.", urgency: "MED" },
                { alert: "🟢 WIN: 9 products total live on Gumroad — 5 contractor + 4 OpenClaw tools.", urgency: "OK" },
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
                { move: "🥇 CRITICAL: Top up Anthropic billing at console.anthropic.com — Dashboard + Market Scan 6AM offline (2 consecutive billing errors)." },
                { move: "🥈 FCA-002 TODAY: Frankie @ 1PM Apr 11 — pour 12\'x12\' driveway. Confirm concrete ($675 3000 PSI+Fiber). Frank@palmcoastdemo.com." },
                { move: "🥉 FCA-001: Collect $1,590 from Joseph Noble TODAY — then ask for a Google review. Net profit: $2,145." },
                { move: "🔲 Twitter suspension appeal — twitter.com/account/suspended. 5 tweet crons firing today — all will fail until reinstated." },
                { move: "🔲 Polymarket — Fed rate cut markets now top volume. Watch for non-restricted plays. $70 USDC ready." },
                { move: "🔲 Product backlog — approve PDF queue so Gumroad listings can go live. Just say the word." },
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

        {activeTab === "betting" && (
          <section className="space-y-6">
            {/* ── SEASON STATS ── */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">📊 Season Stats — {BETTING_STATS.sport}</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Record</p>
                  <p className="text-2xl font-black text-white">{BETTING_STATS.record}</p>
                  <p className="text-xs text-slate-500 mt-0.5">W-L-P</p>
                </div>
                <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Units Net</p>
                  <p className={`text-2xl font-black ${BETTING_STATS.unitsNet > 0 ? "text-green-400" : BETTING_STATS.unitsNet < 0 ? "text-red-400" : "text-white"}`}>
                    {BETTING_STATS.unitsNet > 0 ? `+${BETTING_STATS.unitsNet.toFixed(1)}` : BETTING_STATS.unitsNet.toFixed(1)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{BETTING_STATS.unitsWagered}u wagered</p>
                </div>
                <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">ROI</p>
                  <p className={`text-2xl font-black ${parseFloat(BETTING_STATS.roi) > 0 ? "text-green-400" : parseFloat(BETTING_STATS.roi) < 0 ? "text-red-400" : "text-white"}`}>
                    {BETTING_STATS.roi}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Since {BETTING_STATS.activeSince}</p>
                </div>
                <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Book</p>
                  <p className="text-lg font-black text-white leading-tight">{BETTING_STATS.book}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{BETTING_STATS.sport} season</p>
                </div>
              </div>
              <p className="mt-2 text-right text-xs text-slate-600">Last updated: {BETTING_STATS.lastUpdated}</p>
            </div>

            {/* ── BANKROLL PROGRESS BAR ── */}
            {(() => {
              const BANKROLL_CURRENT = 16.45;
              const BANKROLL_GOAL = 1000;
              const fillPct = (BANKROLL_CURRENT / BANKROLL_GOAL) * 100; // 1.645
              const milestones = [
                { pct: 5,  label: "Stage 2", dollar: "$50"  },
                { pct: 10, label: "Stage 3", dollar: "$100" },
                { pct: 25, label: "Stage 4", dollar: "$250" },
                { pct: 50, label: "Stage 5", dollar: "$500" },
              ];
              const shimmerKeyframes = `
                @keyframes hud-shimmer {
                  0%   { transform: translateX(-100%) skewX(-15deg); }
                  100% { transform: translateX(400%) skewX(-15deg); }
                }
                @keyframes hud-glow-pulse {
                  0%, 100% { box-shadow: 0 0 8px 2px rgba(251,146,60,0.55), 0 0 20px 4px rgba(251,146,60,0.25); }
                  50%       { box-shadow: 0 0 14px 4px rgba(251,146,60,0.85), 0 0 32px 8px rgba(251,146,60,0.40); }
                }
                @keyframes hud-fill-in {
                  from { width: 0%; }
                  to   { width: ${fillPct.toFixed(3)}%; }
                }
              `;
              return (
                <div className="rounded-xl bg-slate-900/70 border border-slate-700/50 p-5">
                  <style>{shimmerKeyframes}</style>

                  {/* Label row */}
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-orange-400" style={{ fontVariant: "small-caps", letterSpacing: "0.12em" }}>
                      Bankroll Progress
                    </span>
                    <span className="text-sm font-semibold text-white tabular-nums">
                      ${BANKROLL_CURRENT.toFixed(2)} / $1,000.00
                    </span>
                  </div>

                  {/* Bar track + fill */}
                  <div
                    className="relative w-full h-7 rounded-md overflow-visible"
                    style={{
                      background: "rgba(15,23,42,0.8)",
                      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.7), inset 0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >
                    {/* Animated fill */}
                    <div
                      className="absolute top-0 left-0 h-full rounded-md"
                      style={{
                        width: `${fillPct.toFixed(3)}%`,
                        background: "linear-gradient(90deg, #ea580c 0%, #f97316 55%, #fbbf24 100%)",
                        animation: "hud-fill-in 1s ease-out forwards, hud-glow-pulse 2s ease-in-out 1s infinite",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {/* Shimmer sweep */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "40%",
                          height: "100%",
                          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.38) 50%, transparent 100%)",
                          animation: "hud-shimmer 3s ease-in-out 1.2s infinite",
                          borderRadius: "inherit",
                        }}
                      />
                    </div>

                    {/* Milestone tick marks */}
                    {milestones.map((m) => {
                      const passed = fillPct >= m.pct;
                      return (
                        <div
                          key={m.pct}
                          style={{
                            position: "absolute",
                            left: `${m.pct}%`,
                            top: 0,
                            bottom: 0,
                            width: "1px",
                            background: passed ? "rgba(251,146,60,0.9)" : "rgba(255,255,255,0.22)",
                            zIndex: 10,
                          }}
                        >
                          {/* Tick label below bar */}
                          <div
                            style={{
                              position: "absolute",
                              top: "calc(100% + 5px)",
                              left: "50%",
                              transform: "translateX(-50%)",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            <span className={`block text-[10px] font-bold uppercase tracking-wide ${passed ? "text-orange-400" : "text-slate-500"}`}>
                              {m.dollar}
                            </span>
                            <span className={`block text-[9px] uppercase tracking-widest ${passed ? "text-orange-500" : "text-slate-600"}`}>
                              {m.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer row — leave room for tick labels */}
                  <div className="flex items-center justify-between mt-8 text-xs">
                    <span className="text-slate-300 font-semibold">🟡 Stage 1 — $5/unit</span>
                    <span className="text-slate-400 text-center">+$6.45 profit · 1-0-0 · Day 1</span>
                    <span className="text-slate-400 font-semibold tabular-nums">$983.55 to goal</span>
                  </div>
                </div>
              );
            })()}

            {/* ── TOMORROW — BET THESE ── */}
            <div className="rounded-xl border-l-4 border-orange-500 bg-slate-900 ring-1 ring-orange-500/40 shadow-[0_0_18px_rgba(249,115,22,0.25)] p-5">
              <div className="mb-3">
                <p className="text-sm font-black uppercase tracking-widest text-orange-400">⚾ TOMORROW — BET THESE (Apr 22)</p>
                <p className="mt-0.5 text-xs text-slate-400">Hard Rock Bet · MLB only · Check lines before placing</p>
              </div>
              <ul className="space-y-2.5">
                <li className="text-sm text-slate-300">🔥 BET: <span className="font-bold text-white">Los Angeles Angels ML (-112)</span> — 1.5 units | Soriano 0.28 ERA vs Lauer 7.13 ERA</li>
                <li className="text-sm text-slate-300">✅ BET: <span className="font-bold text-white">Kansas City Royals ML (-124)</span> — 1 unit | Wacha 1.00 ERA vs Bassitt 6.19 ERA</li>
                <li className="text-sm text-slate-300">⏭️ SKIP: <span className="font-bold text-white">Cleveland Guardians</span> — juice not clean enough today</li>
              </ul>
            </div>

            {/* ── LIVE LINES ── */}
            {(() => {
              const TARGET_GAMES = [
                { home: "Cleveland Guardians", away: "Houston Astros", pickSide: "Cleveland Guardians" },
                { home: "New York Mets",       away: "Minnesota Twins",   pickSide: "New York Mets"      },
                { home: "Arizona Diamondbacks",away: "Chicago White Sox", pickSide: "Arizona Diamondbacks"},
              ];

              const formatOdds = (n: number) => (n > 0 ? `+${n}` : `${n}`);

              const teamIncludes = (teamName: string, target: string) =>
                teamName.toLowerCase().includes(target.toLowerCase()) ||
                target.toLowerCase().includes(teamName.toLowerCase());

              const findGame = (t: typeof TARGET_GAMES[0]) =>
                liveOdds.find(g =>
                  (teamIncludes(g.home_team, t.home) && teamIncludes(g.away_team, t.away)) ||
                  (teamIncludes(g.home_team, t.away) && teamIncludes(g.away_team, t.home))
                );

              const getBookmaker = (game: any) =>
                game?.bookmakers?.find((b: any) => b.key === "fandraft") ||
                game?.bookmakers?.find((b: any) => b.key === "fanduel") ||
                game?.bookmakers?.[0];

              const getH2H = (bm: any) =>
                bm?.markets?.find((m: any) => m.key === "h2h");

              const getTotals = (bm: any) =>
                bm?.markets?.find((m: any) => m.key === "totals");

              const getBestML = (game: any, teamName: string) => {
                if (!game?.bookmakers) return null;
                let best: number | null = null;
                for (const bm of game.bookmakers) {
                  const h2h = bm.markets?.find((m: any) => m.key === "h2h");
                  const outcome = h2h?.outcomes?.find((o: any) =>
                    teamIncludes(o.name, teamName)
                  );
                  if (outcome) {
                    if (best === null || outcome.price > best) best = outcome.price;
                  }
                }
                return best;
              };

              const toET = (utc: string) => {
                try {
                  return new Date(utc).toLocaleTimeString("en-US", {
                    timeZone: "America/New_York",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }) + " ET";
                } catch { return ""; }
              };

              const minsFetched = oddsLastFetched
                ? Math.floor((Date.now() - oddsLastFetched.getTime()) / 60000)
                : null;

              return (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">📡 LIVE LINES</p>
                      {minsFetched !== null && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Last fetched: {minsFetched === 0 ? "just now" : `${minsFetched} min ago`}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={fetchOdds}
                      disabled={oddsLoading}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400 hover:text-cyan-400 transition disabled:opacity-50"
                    >
                      {oddsLoading ? "Loading…" : "🔄 Refresh"}
                    </button>
                  </div>

                  {oddsLoading && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-500 animate-pulse">
                      Fetching live odds…
                    </div>
                  )}

                  {!oddsLoading && liveOdds.length === 0 && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-500">
                      No odds data — click Refresh to load.
                    </div>
                  )}

                  {!oddsLoading && liveOdds.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-3">
                      {TARGET_GAMES.map((tg, i) => {
                        const game = findGame(tg);
                        const bm = game ? getBookmaker(game) : null;
                        const h2h = bm ? getH2H(bm) : null;
                        const totals = bm ? getTotals(bm) : null;
                        const homeOutcome = h2h?.outcomes?.find((o: any) => teamIncludes(o.name, game?.home_team));
                        const awayOutcome = h2h?.outcomes?.find((o: any) => teamIncludes(o.name, game?.away_team));
                        const overOutcome = totals?.outcomes?.find((o: any) => o.name === "Over");
                        const underOutcome = totals?.outcomes?.find((o: any) => o.name === "Under");
                        const bestML = game ? getBestML(game, tg.pickSide) : null;

                        return (
                          <div key={i} className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5 space-y-3">
                            {!game ? (
                              <div className="text-sm text-slate-500 text-center py-4">
                                {tg.away} @ {tg.home}
                                <br /><span className="text-xs">Game not found in feed</span>
                              </div>
                            ) : (
                              <>
                                {/* Matchup + time */}
                                <div>
                                  <p className="text-sm font-black text-white">
                                    {game.away_team} <span className="text-slate-500 font-normal">@</span> {game.home_team}
                                  </p>
                                  {game.commence_time && (
                                    <p className="text-xs text-slate-500 mt-0.5">{toET(game.commence_time)}</p>
                                  )}
                                  {bm && (
                                    <p className="text-xs text-slate-600 mt-0.5">Source: {bm.title}</p>
                                  )}
                                </div>

                                {/* ML odds */}
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Moneyline</p>
                                  {h2h ? (
                                    <div className="flex gap-2">
                                      <div className="flex-1 rounded-lg bg-slate-800/80 px-3 py-2 text-center">
                                        <p className="text-xs text-slate-400 truncate">{game.away_team.split(" ").slice(-1)[0]}</p>
                                        <p className={`text-base font-black mt-0.5 ${awayOutcome?.price > 0 ? "text-green-400" : "text-white"}`}>
                                          {awayOutcome ? formatOdds(awayOutcome.price) : "—"}
                                        </p>
                                      </div>
                                      <div className="flex-1 rounded-lg bg-slate-800/80 px-3 py-2 text-center">
                                        <p className="text-xs text-slate-400 truncate">{game.home_team.split(" ").slice(-1)[0]}</p>
                                        <p className={`text-base font-black mt-0.5 ${homeOutcome?.price > 0 ? "text-green-400" : "text-white"}`}>
                                          {homeOutcome ? formatOdds(homeOutcome.price) : "—"}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-slate-600">ML not available</p>
                                  )}
                                </div>

                                {/* Total */}
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Total</p>
                                  {totals && overOutcome ? (
                                    <div className="flex gap-2">
                                      <div className="flex-1 rounded-lg bg-slate-800/80 px-3 py-2 text-center">
                                        <p className="text-xs text-slate-400">O {overOutcome.point}</p>
                                        <p className={`text-sm font-bold mt-0.5 ${overOutcome.price > 0 ? "text-green-400" : "text-white"}`}>
                                          {formatOdds(overOutcome.price)}
                                        </p>
                                      </div>
                                      <div className="flex-1 rounded-lg bg-slate-800/80 px-3 py-2 text-center">
                                        <p className="text-xs text-slate-400">U {underOutcome?.point ?? overOutcome.point}</p>
                                        <p className={`text-sm font-bold mt-0.5 ${(underOutcome?.price ?? 0) > 0 ? "text-green-400" : "text-white"}`}>
                                          {underOutcome ? formatOdds(underOutcome.price) : "—"}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-slate-600">Total not available</p>
                                  )}
                                </div>

                                {/* Best line highlight */}
                                {bestML !== null && (
                                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 flex items-center justify-between">
                                    <div>
                                      <p className="text-xs font-bold text-cyan-400">⭐ Best Line — Pick Side</p>
                                      <p className="text-xs text-slate-400 mt-0.5 truncate">{tg.pickSide.split(" ").slice(-1)[0]}</p>
                                    </div>
                                    <p className={`text-lg font-black ${bestML > 0 ? "text-green-400" : "text-white"}`}>
                                      {formatOdds(bestML)}
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── DAILY PLAYS ── */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">⚾ Daily Plays — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    matchup: "Guardians vs Astros",
                    time: "6:10 PM ET",
                    bet: "Guardians ML",
                    odds: "-115",
                    reason: "Parker Messick 1.05 ERA vs opener — fade the Astros bullpen game",
                    confidence: "High" as const,
                    status: "Pending" as const,
                  },
                  {
                    matchup: "D-backs vs White Sox",
                    time: "",
                    bet: "D-backs Team Total Over 4.5",
                    odds: "-125",
                    reason: "D-backs averaging 5.6 runs/game; Sean Burke sitting at 4.43 ERA",
                    confidence: "High" as const,
                    status: "Pending" as const,
                  },
                  {
                    matchup: "Mets vs Twins",
                    time: "7:10 PM ET",
                    bet: "Mets ML",
                    odds: "-108",
                    reason: "Noah McLean hot (8 Ks in 3 of 4 starts) vs Woods Richardson (12 runs in last 2 starts)",
                    confidence: "Med" as const,
                    status: "Pending" as const,
                  },
                ].map((pick, i) => {
                  const confColor = pick.confidence === "High" ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : pick.confidence === "Med" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    : "bg-slate-700 text-slate-400";
                  const statusColor = pick.status === "Won" ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : pick.status === "Lost" ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-slate-700/80 text-slate-400 border border-slate-600";
                  return (
                    <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-black text-white">{pick.matchup}</p>
                          {pick.time && <p className="text-xs text-slate-500 mt-0.5">{pick.time}</p>}
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold shrink-0 border ${statusColor}`}>{pick.status}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-orange-400">{pick.bet} <span className="text-slate-500 font-normal">({pick.odds})</span></p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pick.reason}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${confColor}`}>{pick.confidence}</span>
                        <span className="text-xs text-slate-600">confidence</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── BET TRACKER ── */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">📋 Bet Tracker</p>
                <button
                  onClick={() => setShowAddBet(v => !v)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:border-orange-400 hover:text-orange-400 transition"
                >
                  {showAddBet ? "✕ Cancel" : "+ Add Bet"}
                </button>
              </div>

              {/* Inline add-bet form */}
              {showAddBet && (
                <div className="rounded-2xl border border-orange-400/30 bg-slate-900/80 p-5 mb-4 space-y-3">
                  <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">New Bet Entry</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {([
                      ["date", "Date", "date"],
                      ["game", "Game / Matchup", "text"],
                      ["bet", "Bet Type", "text"],
                      ["odds", "Odds (e.g. -115)", "text"],
                    ] as [keyof typeof newBet, string, string][]).map(([field, label, type]) => (
                      <div key={field} className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-400">{label}</label>
                        <input
                          type={type}
                          value={newBet[field] as string}
                          onChange={e => setNewBet(prev => ({ ...prev, [field]: e.target.value }))}
                          className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:border-orange-400 focus:outline-none"
                        />
                      </div>
                    ))}
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-400">Units</label>
                      <input
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={newBet.units}
                        onChange={e => setNewBet(prev => ({ ...prev, units: parseFloat(e.target.value) || 1 }))}
                        className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:border-orange-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-400">Result</label>
                      <select
                        value={newBet.result}
                        onChange={e => setNewBet(prev => ({ ...prev, result: e.target.value as BetEntry["result"] }))}
                        className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:border-orange-400 focus:outline-none"
                      >
                        {["Pending", "Won", "Lost", "Push"].map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={addBetEntry}
                    disabled={!newBet.game || !newBet.bet || !newBet.odds}
                    className="rounded-xl bg-orange-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-orange-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Save Bet
                  </button>
                </div>
              )}

              {/* Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-800">
                        {["Date", "Game", "Bet", "Odds", "Units", "Result", "P&L"].map(h => (
                          <th key={h} className={`px-4 py-3 font-semibold text-slate-500 ${h === "P&L" || h === "Units" || h === "Odds" || h === "Result" ? "text-right" : "text-left"}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bets.map((b) => {
                        const resultColor = b.result === "Won" ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : b.result === "Lost" ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : b.result === "Push" ? "bg-slate-700 text-slate-400"
                          : "bg-slate-800 text-slate-500 border border-slate-600";
                        const pnlColor = b.pnl > 0 ? "text-green-400 font-bold" : b.pnl < 0 ? "text-red-400 font-bold" : "text-slate-500";
                        return (
                          <tr key={b.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition">
                            <td className="px-4 py-3 text-slate-400">{b.date}</td>
                            <td className="px-4 py-3 text-slate-300 font-medium">{b.game}</td>
                            <td className="px-4 py-3 text-white">{b.bet}</td>
                            <td className="px-4 py-3 text-right text-slate-300">{b.odds}</td>
                            <td className="px-4 py-3 text-right text-slate-300">{b.units}u</td>
                            <td className="px-4 py-3 text-right">
                              <select
                                value={b.result}
                                onChange={e => updateBetResult(b.id, e.target.value as BetEntry["result"])}
                                className={`rounded-full px-2 py-0.5 text-xs font-bold border cursor-pointer bg-transparent ${resultColor}`}
                              >
                                {["Pending", "Won", "Lost", "Push"].map(r => <option key={r} value={r} className="bg-slate-900 text-white">{r}</option>)}
                              </select>
                            </td>
                            <td className={`px-4 py-3 text-right ${pnlColor}`}>
                              {b.result === "Pending" ? "—" : b.pnl >= 0 ? `+${b.pnl.toFixed(2)}u` : `${b.pnl.toFixed(2)}u`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-700 bg-slate-800/40">
                        <td colSpan={5} className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Running P&amp;L</td>
                        <td />
                        <td className={`px-4 py-3 text-right text-sm font-black ${bets.reduce((s, b) => s + b.pnl, 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {(() => { const total = bets.reduce((s, b) => s + b.pnl, 0); return total >= 0 ? `+${total.toFixed(2)}u` : `${total.toFixed(2)}u`; })()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* ── STRATEGY REMINDERS ── */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">📌 Strategy Reminders</p>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { icon: "⚾", text: "MLB only (for now)" },
                    { icon: "🎯", text: "1–2 units per game max" },
                    { icon: "📱", text: "Hard Rock Sportsbook only" },
                    { icon: "📉", text: "Fade heavy public chalk" },
                    { icon: "🔍", text: "Focus on starting pitcher matchups — F5 and full game" },
                    { icon: "📊", text: "Track CLV (closing line value) — did you beat the closing number?" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-800/50 px-4 py-3">
                      <span className="text-base leading-none mt-0.5">{r.icon}</span>
                      <span className="text-xs text-slate-300 leading-relaxed">{r.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── BANKROLL GROWTH PLAN ── */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">💰 BANKROLL GROWTH PLAN — Target $1,000</p>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="pb-2 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Stage</th>
                        <th className="pb-2 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Bankroll</th>
                        <th className="pb-2 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Unit Size</th>
                        <th className="pb-2 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {[
                        { stage: "1", bankroll: "$16–$50",     unit: "$5/bet",  status: "🟡 CURRENT", current: true },
                        { stage: "2", bankroll: "$50–$100",    unit: "$8/bet",  status: "⬜ Locked",  current: false },
                        { stage: "3", bankroll: "$100–$250",   unit: "$15/bet", status: "⬜ Locked",  current: false },
                        { stage: "4", bankroll: "$250–$500",   unit: "$25/bet", status: "⬜ Locked",  current: false },
                        { stage: "5", bankroll: "$500–$1,000", unit: "$50/bet", status: "⬜ Locked",  current: false },
                      ].map((row) => (
                        <tr
                          key={row.stage}
                          className={row.current ? "bg-orange-500/10" : ""}
                        >
                          <td className={`py-2.5 pr-4 font-bold ${row.current ? "text-orange-400" : "text-slate-400"}`}>{row.stage}</td>
                          <td className={`py-2.5 pr-4 ${row.current ? "text-orange-300 font-semibold" : "text-slate-300"}`}>{row.bankroll}</td>
                          <td className={`py-2.5 pr-4 ${row.current ? "text-orange-300 font-semibold" : "text-slate-300"}`}>{row.unit}</td>
                          <td className={`py-2.5 text-xs font-bold ${row.current ? "text-orange-400" : "text-slate-500"}`}>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-slate-400 border-t border-slate-800 pt-3">
                  Current balance: <span className="font-bold text-white">$16.45</span> · Est. timeline: <span className="font-bold text-white">10–14 weeks</span>
                </p>
              </div>
            </div>

          </section>
        )}

        {activeTab === "lionx" && <LionXAdmin/>}

      </div>
    </main>
  );
}






