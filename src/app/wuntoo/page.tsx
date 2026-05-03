"use client";

import { useEffect, useRef, useState } from "react";

// ─── LIVE DATA (update daily) ───────────────────────────────────────────────
const STATS = {
  record: "8-6",
  roi: "+5.1%",
  units: "+0.93u",
  clv: "TBD",
  streak: "L1",
  bankroll: "$18.38",
  since: "APR 21 2026",
  lastUpdated: "MAY 03 2026",
};

// ─── TEAM LOGO MAP (ESPN CDN) ───────────────────────────────────────────────
const TEAM_LOGOS: Record<string, string> = {
  BOS: "https://a.espncdn.com/i/teamlogos/mlb/500/bos.png",
  TOR: "https://a.espncdn.com/i/teamlogos/mlb/500/tor.png",
  NYY: "https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png",
  HOU: "https://a.espncdn.com/i/teamlogos/mlb/500/hou.png",
  CHC: "https://a.espncdn.com/i/teamlogos/mlb/500/chc.png",
  LAD: "https://a.espncdn.com/i/teamlogos/mlb/500/lad.png",
  ATL: "https://a.espncdn.com/i/teamlogos/mlb/500/atl.png",
  NYM: "https://a.espncdn.com/i/teamlogos/mlb/500/nym.png",
  PHI: "https://a.espncdn.com/i/teamlogos/mlb/500/phi.png",
  MIL: "https://a.espncdn.com/i/teamlogos/mlb/500/mil.png",
  TB:  "https://a.espncdn.com/i/teamlogos/mlb/500/tb.png",
  CLE: "https://a.espncdn.com/i/teamlogos/mlb/500/cle.png",
  SD:  "https://a.espncdn.com/i/teamlogos/mlb/500/sd.png",
  ARI: "https://a.espncdn.com/i/teamlogos/mlb/500/ari.png",
  COL: "https://a.espncdn.com/i/teamlogos/mlb/500/col.png",
  SF:  "https://a.espncdn.com/i/teamlogos/mlb/500/sf.png",
  MIN: "https://a.espncdn.com/i/teamlogos/mlb/500/min.png",
  DET: "https://a.espncdn.com/i/teamlogos/mlb/500/det.png",
  SEA: "https://a.espncdn.com/i/teamlogos/mlb/500/sea.png",
  TEX: "https://a.espncdn.com/i/teamlogos/mlb/500/tex.png",
  OAK: "https://a.espncdn.com/i/teamlogos/mlb/500/oak.png",
};

// ─── NBA TEAM LOGO MAP (ESPN CDN) ───────────────────────────────────────────
const NBA_TEAM_LOGOS: Record<string, string> = {
  ATL: "https://a.espncdn.com/i/teamlogos/nba/500/atl.png",
  BOS: "https://a.espncdn.com/i/teamlogos/nba/500/bos.png",
  BKN: "https://a.espncdn.com/i/teamlogos/nba/500/bkn.png",
  CHA: "https://a.espncdn.com/i/teamlogos/nba/500/cha.png",
  CHI: "https://a.espncdn.com/i/teamlogos/nba/500/chi.png",
  CLE: "https://a.espncdn.com/i/teamlogos/nba/500/cle.png",
  DAL: "https://a.espncdn.com/i/teamlogos/nba/500/dal.png",
  DEN: "https://a.espncdn.com/i/teamlogos/nba/500/den.png",
  DET: "https://a.espncdn.com/i/teamlogos/nba/500/det.png",
  GSW: "https://a.espncdn.com/i/teamlogos/nba/500/gs.png",
  HOU: "https://a.espncdn.com/i/teamlogos/nba/500/hou.png",
  IND: "https://a.espncdn.com/i/teamlogos/nba/500/ind.png",
  LAC: "https://a.espncdn.com/i/teamlogos/nba/500/lac.png",
  LAL: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png",
  MEM: "https://a.espncdn.com/i/teamlogos/nba/500/mem.png",
  MIA: "https://a.espncdn.com/i/teamlogos/nba/500/mia.png",
  MIL: "https://a.espncdn.com/i/teamlogos/nba/500/mil.png",
  MIN: "https://a.espncdn.com/i/teamlogos/nba/500/min.png",
  NOP: "https://a.espncdn.com/i/teamlogos/nba/500/no.png",
  NYK: "https://a.espncdn.com/i/teamlogos/nba/500/ny.png",
  OKC: "https://a.espncdn.com/i/teamlogos/nba/500/okc.png",
  ORL: "https://a.espncdn.com/i/teamlogos/nba/500/orl.png",
  PHI: "https://a.espncdn.com/i/teamlogos/nba/500/phi.png",
  PHX: "https://a.espncdn.com/i/teamlogos/nba/500/phx.png",
  POR: "https://a.espncdn.com/i/teamlogos/nba/500/por.png",
  SAC: "https://a.espncdn.com/i/teamlogos/nba/500/sac.png",
  SAS: "https://a.espncdn.com/i/teamlogos/nba/500/sa.png",
  TOR: "https://a.espncdn.com/i/teamlogos/nba/500/tor.png",
  UTA: "https://a.espncdn.com/i/teamlogos/nba/500/utah.png",
  WAS: "https://a.espncdn.com/i/teamlogos/nba/500/wsh.png",
};

// ─── LOTTERY PICKS ────────────────────────────────────────────────────────────
// Lottery slot cleared — next parlay pending
const LOTTERY_PICKS: {
  id: number; label: string; subtitle: string;
  legs: { sport: string; game: string; pick: string; odds: string; awayTeam: string; homeTeam: string; betTeam: string; edge: string }[];
  combinedOdds: string; stake: string; payout: string; multiplier: string; betId: string; status: string;
}[] = [];

// ─── NBA ACTIVE PICKS ───────────────────────────────────────────────────────
const NBA_PICKS = [
  {
    id: 1,
    status: "ACTIVE",
    game: "TOR @ CLE",
    awayTeam: "TOR",
    homeTeam: "CLE",
    time: "Today, 7:30pm ET",
    bet: "TOR ML",
    betTeam: "TOR",
    odds: "+250",
    wager: "$15",
    payout: "$52.50",
    edge: "+8¢",
    signal: "Raptors as live underdogs · Ace model edge · Also leg 3 of 3-bet parlay (Phillies · Rays · Raptors +964)",
  },
  {
    id: 2,
    status: "WON",
    game: "PHI @ BOS",
    awayTeam: "PHI",
    homeTeam: "BOS",
    time: "Final: PHI 109 — BOS 100",
    bet: "PHI ML",
    betTeam: "PHI",
    odds: "+250",
    wager: "$14",
    payout: "$40.36",
    edge: "+8¢",
    signal: "Tatum OUT with knee injury · Model called G7 variance + health risk · PHI wins by 9 as +250 road underdog",
  },
];

const MLB_TODAY_STATUS = "ACTIVE"; // "ACTIVE" | "PASS"
const MLB_PASS_REASON = "No qualifying games today.";

const PICKS = [
  {
    id: 1,
    status: "ACTIVE",
    game: "SF @ TB",
    awayTeam: "SF",
    homeTeam: "TB",
    time: "Today, 1:41pm ET",
    bet: "TB ML",
    betTeam: "TB",
    odds: "-124",
    units: "1u",
    confidence: 72,
    macSignal: "ERA EDGE — Rasmussen 2.76 ERA vs Mahle 5.87 ERA — gap 3.11 ✅. TB 20-12, SF 13-20, Giants on 5-game losing streak.",
    aceSignal: "SERIES SWEEP IN PLAY — TB won Game 1 (3-0) and Game 2 (5-1). Mahle 13.00 ERA on the road, 1.63 WHIP. Rays bats shred soft contact starters.",
    combined: "STRONG",
    tag: "✅ BET PLACED",
  },
  {
    id: 2,
    status: "ACTIVE",
    game: "PHI @ MIA",
    awayTeam: "PHI",
    homeTeam: "MIA",
    time: "Today, 1:41pm ET",
    bet: "PHI ML",
    betTeam: "PHI",
    odds: "-144",
    units: "0.5u",
    confidence: 68,
    macSignal: "ERA EDGE — Sánchez 1.59 ERA vs Paddack 6.11 ERA — gap 4.52 ✅. Juice at -144 triggers 0.5u size-down rule.",
    aceSignal: "PITCHER MISMATCH — Sánchez one of the best starters in the NL (39K, 1.59 ERA). Paddack 6.11 ERA through 28 IP. PHI 4-1 under new skipper Don Mattingly.",
    combined: "LEAN",
    tag: "✅ BET PLACED",
  },
];

// ─── NBA STATS ───────────────────────────────────────────────────────────
const NBA_STATS = {
  record: "6-1",
  roi: "+85.7%",
  units: "+112.87",
  since: "APR 30 2026",
  lastUpdated: "MAY 03 2026",
};

const NBA_BET_LOG = [
  { date: "MAY 03", game: "TOR @ CLE", bet: "TOR ML", odds: "+250", result: "PENDING", units: "—" },
  { date: "MAY 02", game: "PHI @ BOS", bet: "PHI ML", odds: "+250", result: "WIN", units: "+$26.36" },
  { date: "MAY 01", game: "3-LEG PARLAY", bet: "DET + TOR + LAL", odds: "+856", result: "WIN", units: "+$43.89" },
  { date: "MAY 01", game: "DET @ ORL", bet: "DET ML", odds: "-160", result: "WIN", units: "+$3.12" },
  { date: "MAY 01", game: "CLE @ TOR", bet: "TOR ML", odds: "+140", result: "WIN", units: "+$7.00" },
  { date: "APR 30", game: "PHI @ BOS", bet: "PHI ML", odds: "+110", result: "WIN", units: "+21.25" },
  { date: "APR 30", game: "DEN @ MIN", bet: "MIN ML", odds: "+210", result: "WIN", units: "+21.25" },
  { date: "APR 30", game: "NYK @ ATL", bet: "ATL ML", odds: "-133", result: "LOSS", units: "-10.00" },
];

const BET_LOG = [
  { date: "MAY 03", game: "SF @ TB", bet: "TB ML", odds: "-124", result: "PENDING", units: "—" },
  { date: "MAY 03", game: "PHI @ MIA", bet: "PHI ML", odds: "-144", result: "PENDING", units: "—" },
  { date: "MAY 02", game: "HOU @ BOS", bet: "HOU ML", odds: "+105", result: "WIN", units: "+$8.25" },
  { date: "MAY 02", game: "NYM @ LAA", bet: "NYM ML", odds: "-125", result: "LOSS", units: "-$10.00" },
  { date: "APR 30", game: "ARI @ MIL", bet: "ARI ML", odds: "+105", result: "LOSS", units: "-2.0u" },
  { date: "APR 29", game: "CHC @ SD", bet: "CHC ML", odds: "-110", result: "WIN", units: "+0.91u" },
  { date: "APR 29", game: "ARI @ MIL", bet: "ARI ML", odds: "+105", result: "WIN", units: "+1.05u" },
  { date: "APR 28", game: "BOS @ TOR", bet: "BOS ML", odds: "+100", result: "LOSS", units: "-1.0u" },
  { date: "APR 27", game: "CHC @ SD", bet: "SD ML", odds: "-120", result: "WIN", units: "+1.25u" },
  { date: "APR 27", game: "TB @ CLE", bet: "CLE ML", odds: "-140", result: "LOSS", units: "-0.8u" },
  { date: "APR 26", game: "NYY @ HOU", bet: "HOU ML", odds: "+115", result: "WIN", units: "+1.8u" },
  { date: "APR 26", game: "CHC @ LAD", bet: "CHC ML", odds: "+110", result: "LOSS", units: "-1.0u" },
  { date: "APR 25", game: "SD @ ARI", bet: "ARI ML", odds: "-120", result: "LOSS", units: "-1.0u" },
  { date: "APR 24", game: "BOS @ BAL", bet: "BAL ML", odds: "-120", result: "WIN", units: "+0.67u" },
  { date: "APR 24", game: "CLE @ TOR", bet: "CLE ML", odds: "-125", result: "WIN", units: "+0.64u" },
];

// ─── PARTICLE CANVAS ────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string }[] = [];
    const colors = ["#D4AF37", "#FFD700", "#C0C0C0", "#FFFFFF", "#B8860B"];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw connection lines
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((q) => {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "#D4AF37";
            ctx.globalAlpha = (1 - dist / 100) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// ─── ANIMATED COUNTER ───────────────────────────────────────────────────────
function Counter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const num = parseFloat(value.replace(/[^0-9.-]/g, ""));
        if (isNaN(num)) { setDisplay(value); return; }
        let start = 0;
        const step = num / 40;
        const timer = setInterval(() => {
          start += step;
          if (start >= num) { setDisplay(value); clearInterval(timer); }
          else setDisplay((Math.round(start * 10) / 10).toString() + suffix);
        }, 30);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, suffix]);

  return <span ref={ref}>{display}</span>;
}

// ─── COUNTDOWN TIMER ────────────────────────────────────────────────────────
function parseGameTime(timeStr: string): Date | null {
  // Parses "Today, 7:00pm EDT" or "Today, 7:30pm EDT"
  const match = timeStr.match(/Today,\s*(\d+):(\d+)(am|pm)\s*(EDT|EST|CDT|CST|PDT|PST)?/i);
  if (!match) return null;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const ampm = match[3].toLowerCase();
  const tz = (match[4] || "EDT").toUpperCase();

  if (ampm === "pm" && hours !== 12) hours += 12;
  if (ampm === "am" && hours === 12) hours = 0;

  // Offset in hours ahead of UTC
  const tzOffsets: Record<string, number> = { EDT: 4, EST: 5, CDT: 5, CST: 6, PDT: 7, PST: 8 };
  const offset = tzOffsets[tz] ?? 4;

  const now = new Date();
  const todayBase = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return new Date(todayBase.getTime() + (hours + offset) * 3600000 + minutes * 60000);
}

function CountdownTimer({ time }: { time: string }) {
  const [label, setLabel] = useState("");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const update = () => {
      const gameDate = parseGameTime(time);
      if (!gameDate) { setLabel(""); return; }

      const now = Date.now();
      const diffMs = gameDate.getTime() - now;
      const diffMins = diffMs / 60000;

      if (diffMins < 0 && diffMins > -180) {
        setIsLive(true);
        setLabel("LIVE");
      } else if (diffMins <= -180) {
        setIsLive(false);
        setLabel("FINAL");
      } else {
        setIsLive(false);
        const totalMins = Math.floor(diffMs / 60000);
        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;
        setLabel(h > 0 ? `${h}h ${m}m` : `${m}m`);
      }
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [time]);

  if (!label) return null;

  if (isLive) {
    return (
      <div className="animate-pulse-gold" style={{
        fontSize: "10px",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        letterSpacing: "0.2em",
        color: "#4ADE80",
        marginTop: "4px",
      }}>● LIVE NOW</div>
    );
  }

  if (label === "FINAL") {
    return (
      <div style={{
        fontSize: "10px",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 600,
        letterSpacing: "0.15em",
        color: "rgba(232,232,232,0.25)",
        marginTop: "4px",
      }}>FINAL</div>
    );
  }

  return (
    <div style={{
      fontSize: "10px",
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 600,
      letterSpacing: "0.12em",
      color: "#D4AF37",
      marginTop: "4px",
    }}>⏱ {label}</div>
  );
}

// ─── CONFIDENCE BAR ─────────────────────────────────────────────────────────
function ConfidenceBar({ pct }: { pct: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setWidth(pct), 200); observer.disconnect(); }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pct]);

  return (
    <div ref={ref} className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, background: "linear-gradient(90deg, #B8860B, #FFD700, #FFFACD)" }}
      />
    </div>
  );
}

// ─── MODEL MODAL ────────────────────────────────────────────────────────────
function ModelModal({ onClose, defaultTab = "mac" }: { onClose: () => void; defaultTab?: "mac" | "ace" }) {
  const [tab, setTab] = useState<"mac" | "ace">(defaultTab);

  // Lock body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const mlbFeatures = [
    { label: "ERA gap filter", detail: "2.0+ threshold between starters" },
    { label: "Juice ceiling", detail: "-130 max — no laying big chalk" },
    { label: "Max 2 picks/day", detail: "Discipline over volume" },
    { label: "Hard Rock line validation", detail: "Cross-check vs FL sportsbook" },
    { label: "FIP & xFIP weighting", detail: "True ERA vs luck-adjusted ERA" },
    { label: "Recent form window", detail: "Last 5 starts weighted 2x" },
  ];

  const aceFeatures = [
    { label: "SIERA / xFIP / FIP weighted", detail: "v2.0 core — weighted blend kills fluky ERA edges" },
    { label: "Bayesian regression", detail: "Shrinks small samples — eliminates fake edges like Corbin's 3.72 ERA" },
    { label: "Pinnacle sharp line anchor", detail: "Cross-references sharpest market before finalizing" },
    { label: "Bullpen fatigue flag", detail: "Back-to-back usage tracked — downgrades ~0.5 runs when tired" },
    { label: "Real park factors", detail: "All 30 parks — Coors 115, Target Field 97, Oracle 95" },
    { label: "Weather adjustments", detail: "Wind direction + temp factored into run environment" },
    { label: "Callup & opener adjustments", detail: "Spots debuted starters before market catches up" },
    { label: "CLV closing line tracking", detail: "Target: 55%+ CLV rate after 50 bets = confirmed edge" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg flex flex-col"
        style={{
          background: "linear-gradient(135deg, rgba(18,12,2,0.99) 0%, rgba(6,4,0,1) 100%)",
          border: "1px solid rgba(212,175,55,0.3)",
          boxShadow: "0 0 80px rgba(212,175,55,0.12)",
          borderRadius: "12px 12px 0 0",
          maxHeight: "92dvh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "rgba(212,175,55,0.25)" }} />
        </div>
        {/* Top bar */}
        <div className="px-6 py-4 flex items-center justify-between sticky top-0" style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", background: "rgba(18,12,2,0.98)", zIndex: 1 }}>
          <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.25em" }}>THE INTELLIGENCE ENGINE</span>
          <button
            onClick={onClose}
            className="flex items-center justify-center"
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(232,232,232,0.7)", fontSize: "16px", cursor: "pointer", flexShrink: 0 }}
          >✕</button>
        </div>

        {/* Model header */}
        <div className="px-6 pt-6 pb-6">
          <div className="font-body text-xs tracking-widest mb-2" style={{ color: tab === "mac" ? "rgba(212,175,55,0.4)" : "rgba(192,192,192,0.4)", letterSpacing: "0.25em" }}>
            {tab === "mac" ? "MODEL ONE" : "MODEL TWO"}
          </div>
          <div className={`font-display text-6xl font-black mb-1 ${tab === "mac" ? "gold-text" : "silver-text"}`}>
            {tab === "mac" ? "MAC" : "ACE"}
          </div>
          <div className="font-body text-xs mb-5" style={{ color: "rgba(232,232,232,0.3)", letterSpacing: "0.15em" }}>
            {tab === "mac" ? "ERA DIFFERENTIAL ENGINE" : "MARKET EDGE FINDER v2.0"}
          </div>
          {/* Model tabs */}
          <div className="flex gap-2">
            {(["mac", "ace"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="font-body text-xs px-4 py-2 rounded-sm transition-all duration-200"
                style={{
                  background: tab === t ? (t === "mac" ? "rgba(212,175,55,0.15)" : "rgba(192,192,192,0.12)") : "rgba(255,255,255,0.03)",
                  border: tab === t ? (t === "mac" ? "1px solid rgba(212,175,55,0.4)" : "1px solid rgba(192,192,192,0.35)") : "1px solid rgba(255,255,255,0.06)",
                  color: tab === t ? (t === "mac" ? "#FFD700" : "#C0C0C0") : "rgba(232,232,232,0.35)",
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                }}
              >
                {t === "mac" ? "⚾ MAC" : "🎯 ACE"}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: tab === "mac" ? "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)" : "linear-gradient(90deg, transparent, rgba(192,192,192,0.2), transparent)", margin: "0 24px" }} />

        {/* Features */}
        <div className="px-6 pt-5 pb-6 space-y-4">
          {(tab === "mac" ? mlbFeatures : aceFeatures).map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <span style={{ color: tab === "mac" ? "#D4AF37" : "#C0C0C0", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>◆</span>
              <div>
                <span className="font-body text-sm font-semibold" style={{ color: "rgba(232,232,232,0.85)" }}>{f.label}</span>
                <span className="font-body text-sm" style={{ color: "rgba(232,232,232,0.35)" }}> — {f.detail}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-5" style={{ borderTop: "1px solid rgba(212,175,55,0.08)", background: "rgba(212,175,55,0.02)" }}>
          <p className="font-body text-xs text-center mb-4" style={{ color: "rgba(232,232,232,0.2)", letterSpacing: "0.05em" }}>
            Models run daily. Picks generated when edge threshold is met.
          </p>
          <button
            onClick={onClose}
            className="w-full font-body text-sm py-4 rounded-sm"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.7)", letterSpacing: "0.15em", cursor: "pointer" }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function WunToo() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [modelOpen, setModelOpen] = useState(false);
  const [modelTab, setModelTab] = useState<"mac" | "ace">("mac");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleShare = (id: number) => {
    navigator.clipboard.writeText("https://tauschus.com/wuntoo");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("formType", "wuntoo-beta");
      formData.append("email", email);
      await fetch("/api/intake", { method: "POST", body: formData });
    } catch (err) {
      console.error("Signup error:", err);
    }
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "#030303", color: "#E8E8E8" }}>
      {modelOpen && <ModelModal onClose={() => setModelOpen(false)} defaultTab={modelTab} />}
      <ParticleField />

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Space Grotesk', sans-serif; }

        .gold-text { background: linear-gradient(135deg, #B8860B 0%, #FFD700 40%, #FFFACD 60%, #D4AF37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .silver-text { background: linear-gradient(135deg, #9E9E9E 0%, #E8E8E8 50%, #BDBDBD 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(212,175,55,0.15); }
        .glass-dark { background: rgba(0,0,0,0.6); backdrop-filter: blur(30px); border: 1px solid rgba(212,175,55,0.1); }

        .glow-gold { box-shadow: 0 0 40px rgba(212,175,55,0.15), 0 0 80px rgba(212,175,55,0.05); }
        .glow-text { text-shadow: 0 0 40px rgba(212,175,55,0.4); }

        .scan-line {
          background: linear-gradient(transparent 50%, rgba(212,175,55,0.02) 50%);
          background-size: 100% 4px;
          pointer-events: none;
        }

        @keyframes pulse-gold {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes border-glow {
          0%, 100% { border-color: rgba(212,175,55,0.2); box-shadow: 0 0 20px rgba(212,175,55,0.05); }
          50% { border-color: rgba(212,175,55,0.6); box-shadow: 0 0 40px rgba(212,175,55,0.2); }
        }

        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-fade { animation: fade-in 1.2s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-gold { animation: pulse-gold 2s ease-in-out infinite; }
        .animate-border-glow { animation: border-glow 3s ease-in-out infinite; }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.6s; }
        .delay-5 { animation-delay: 0.8s; }

        .ticket-card {
          background: linear-gradient(135deg, rgba(20,15,5,0.95) 0%, rgba(10,8,2,0.98) 100%);
          border: 1px solid rgba(212,175,55,0.3);
          position: relative;
          overflow: hidden;
        }
        .ticket-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FFD700, transparent);
          opacity: 0.8;
        }
        .ticket-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(212,175,55,0.03) 0%, transparent 60%);
          pointer-events: none;
        }

        .stat-card {
          background: rgba(10,8,2,0.9);
          border: 1px solid rgba(212,175,55,0.12);
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          border-color: rgba(212,175,55,0.4);
          box-shadow: 0 0 30px rgba(212,175,55,0.1);
          transform: translateY(-2px);
        }

        .model-pill {
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.2);
          font-size: 10px;
          letter-spacing: 0.1em;
        }

        .grid-bg {
          background-image: 
            linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .nav-link {
          color: rgba(232,232,232,0.5);
          transition: color 0.3s;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .nav-link:hover { color: #FFD700; }

        .beta-badge {
          background: linear-gradient(135deg, #B8860B, #FFD700);
          color: #000;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          padding: 2px 8px;
          border-radius: 2px;
        }

        .win-tag { color: #4ADE80; }
        .loss-tag { color: #F87171; }
        .pending-tag { color: #FFD700; animation: pulse-gold 2s infinite; }

        input::placeholder { color: rgba(232,232,232,0.2); }
        input:focus { outline: none; border-color: rgba(212,175,55,0.5) !important; box-shadow: 0 0 20px rgba(212,175,55,0.1); }
      `}</style>

      {/* ── NAV ────────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
        style={{
          background: scrollY > 50 ? "rgba(3,3,3,0.95)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
          borderBottom: scrollY > 50 ? "1px solid rgba(212,175,55,0.08)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="font-display text-xl gold-text font-bold tracking-wide">WunToo</div>
          <span className="beta-badge">BETA</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#picks" className="nav-link font-body">MLB Picks</a>
          <a href="#nba" className="nav-link font-body">NBA Picks</a>
          <a href="#lottery" className="nav-link font-body">Lottery</a>
          <button onClick={() => setModelOpen(true)} className="nav-link font-body" style={{ background: "none", border: "none", cursor: "pointer" }}>The Model</button>
          <a href="#record" className="nav-link font-body">Record</a>
          <a href="#receipts" className="nav-link font-body">Receipts</a>
          <a href="#join" className="nav-link font-body">Join Beta</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="animate-pulse-gold w-2 h-2 rounded-full" style={{ background: "#4ADE80" }} />
          <span className="font-body text-xs" style={{ color: "#4ADE80", letterSpacing: "0.1em" }}>LIVE</span>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 grid-bg">
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Baseball */}
          <div className="opacity-0 animate-fade delay-1 flex justify-center mb-6">
            <div className="animate-float" style={{ fontSize: "clamp(48px, 8vw, 80px)", filter: "drop-shadow(0 0 20px rgba(212,175,55,0.4)) drop-shadow(0 0 40px rgba(212,175,55,0.15))" }}>
              ⚾
            </div>
          </div>

          {/* Eyebrow */}
          <div className="opacity-0 animate-fade delay-1 inline-flex items-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #D4AF37)" }} />
            <span className="font-body text-xs tracking-widest" style={{ color: "#D4AF37", letterSpacing: "0.3em" }}>MLB · NBA DUAL-MODEL INTELLIGENCE</span>
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #D4AF37, transparent)" }} />
          </div>

          {/* Main title */}
          <h1 className="opacity-0 animate-slide-up delay-2 font-display font-black leading-none mb-4" style={{ fontSize: "clamp(72px, 14vw, 160px)" }}>
            <span className="gold-text glow-text">Wun</span>
            <span className="silver-text">Too</span>
          </h1>

          {/* Tagline */}
          <p className="opacity-0 animate-slide-up delay-3 font-body text-xl md:text-2xl mb-10" style={{ color: "rgba(232,232,232,0.6)", letterSpacing: "0.05em", fontWeight: 300 }}>
            Two models. One edge. Zero guesswork.
          </p>

          {/* Live stats strip */}
          <div className="opacity-0 animate-slide-up delay-4 flex flex-wrap items-center justify-center gap-6 mb-12">
            {[
              { label: "RECORD", value: STATS.record },
              { label: "ROI", value: STATS.roi },
              { label: "NET UNITS", value: STATS.units },
              { label: "CLV AVG", value: STATS.clv },
              { label: "STREAK", value: STATS.streak },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="font-body text-xs tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>{s.label}</span>
                <span className="font-display text-2xl font-bold gold-text">{s.value}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="opacity-0 animate-slide-up delay-5 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#join"
              className="font-body font-semibold px-10 py-4 rounded-sm transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #B8860B, #FFD700)",
                color: "#000",
                letterSpacing: "0.15em",
                fontSize: "13px",
                boxShadow: "0 0 40px rgba(212,175,55,0.3)",
              }}
            >
              JOIN THE BETA
            </a>
            <a
              href="#picks"
              className="font-body font-medium px-10 py-4 rounded-sm transition-all duration-300 hover:border-yellow-500"
              style={{
                border: "1px solid rgba(212,175,55,0.3)",
                color: "rgba(232,232,232,0.8)",
                letterSpacing: "0.15em",
                fontSize: "13px",
              }}
            >
              SEE TODAY'S PICKS ↓
            </a>
          </div>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-float pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-float pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(192,192,192,0.03) 0%, transparent 70%)", filter: "blur(40px)", animationDelay: "3s" }} />


      </section>

      {/* ── NBA PICKS ──────────────────────────────────────────────────────── */}
      {/* ── TODAY'S PICKS ──────────────────────────────────────────────────── */}
      <section id="picks" className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "0.3em" }}>— TODAY'S INTELLIGENCE —</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
              <span className="gold-text">Locked</span> <span style={{ color: "rgba(232,232,232,0.9)" }}>Picks</span>
            </h2>
            <p className="font-body text-sm" style={{ color: "rgba(232,232,232,0.35)", letterSpacing: "0.1em" }}>
              Both models must agree. Both signals must align. Only then we move.
            </p>
          </div>

          {/* PASS card — shown when no MLB plays qualify */}
          {MLB_TODAY_STATUS === "PASS" && (
            <div className="rounded-sm mb-8 p-8 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-5xl mb-4">🚫</div>
              <div className="font-body text-xs tracking-widest mb-3" style={{ color: "rgba(232,232,232,0.3)", letterSpacing: "0.25em" }}>MLB — MAY 03, 2026</div>
              <div className="font-display text-3xl font-black mb-3" style={{ color: "rgba(232,232,232,0.5)" }}>NO PLAY TODAY</div>
              <div className="font-body text-sm max-w-md mx-auto" style={{ color: "rgba(232,232,232,0.3)", lineHeight: "1.8" }}>{MLB_PASS_REASON}</div>
              <div className="mt-6 inline-block px-4 py-1.5 rounded-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="font-body text-xs tracking-widest" style={{ color: "rgba(232,232,232,0.25)", letterSpacing: "0.2em" }}>DISCIPLINE PRESERVED — BANKROLL PROTECTED</span>
              </div>
            </div>
          )}

          {/* Pick cards */}
          {MLB_TODAY_STATUS === "ACTIVE" && PICKS.map((pick) => (
            <div key={pick.id} className="ticket-card rounded-sm mb-6 p-8 animate-border-glow glow-gold">
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                {/* Left: badges + matchup with logos */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>PICK #{pick.id}</span>
                    <span className="font-body text-xs px-2 py-0.5 rounded-sm" style={{ background: pick.status === "WON" ? "rgba(74,222,128,0.1)" : pick.status === "LOCKED" ? "rgba(212,175,55,0.08)" : "rgba(212,175,55,0.1)", color: pick.status === "WON" ? "#4ADE80" : "#FFD700", border: `1px solid ${pick.status === "WON" ? "rgba(74,222,128,0.3)" : "rgba(212,175,55,0.3)"}`, letterSpacing: "0.15em" }}>{pick.status}</span>
                    <span className="font-body text-xs px-2 py-0.5 rounded-sm" style={{ background: "rgba(212,175,55,0.08)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.2)", letterSpacing: "0.1em" }}>{pick.tag}</span>
                  </div>
                  {/* Team logos + matchup */}
                  <div className="flex items-center gap-4 mb-2">
                    {/* Away team */}
                    <div className="flex flex-col items-center gap-2">
                      {TEAM_LOGOS[pick.awayTeam] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={TEAM_LOGOS[pick.awayTeam]}
                          alt={pick.awayTeam}
                          width={56}
                          height={56}
                          className="object-contain drop-shadow-lg"
                          style={{ filter: pick.betTeam === pick.awayTeam ? "drop-shadow(0 0 10px rgba(212,175,55,0.6))" : "grayscale(30%) opacity(0.7)" }}
                        />
                      )}
                      <span className="font-body text-xs font-bold" style={{ color: pick.betTeam === pick.awayTeam ? "#FFD700" : "rgba(232,232,232,0.4)", letterSpacing: "0.1em" }}>{pick.awayTeam}</span>
                    </div>
                    {/* @ divider */}
                    <div className="flex flex-col items-center">
                      <span className="font-display text-2xl" style={{ color: "rgba(232,232,232,0.15)" }}>@</span>
                    </div>
                    {/* Home team */}
                    <div className="flex flex-col items-center gap-2">
                      {TEAM_LOGOS[pick.homeTeam] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={TEAM_LOGOS[pick.homeTeam]}
                          alt={pick.homeTeam}
                          width={56}
                          height={56}
                          className="object-contain drop-shadow-lg"
                          style={{ filter: pick.betTeam === pick.homeTeam ? "drop-shadow(0 0 10px rgba(212,175,55,0.6))" : "grayscale(30%) opacity(0.7)" }}
                        />
                      )}
                      <span className="font-body text-xs font-bold" style={{ color: pick.betTeam === pick.homeTeam ? "#FFD700" : "rgba(232,232,232,0.4)", letterSpacing: "0.1em" }}>{pick.homeTeam}</span>
                    </div>
                  </div>
                  <div className="font-body text-sm" style={{ color: "rgba(232,232,232,0.35)" }}>{pick.time}</div>
                </div>
                {/* Right: bet info */}
                <div className="text-right">
                  <div className="font-body text-xs tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.5)" }}>BET</div>
                  <div className="font-display text-4xl font-black gold-text">{pick.bet}</div>
                  <div className="font-display text-xl font-bold mt-1" style={{ color: "rgba(232,232,232,0.7)" }}>{pick.odds} · {pick.units}</div>
                </div>
              </div>

              {/* Confidence */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.15em" }}>COMBINED CONFIDENCE</span>
                  <span className="font-body text-sm font-semibold" style={{ color: "#FFD700" }}>{pick.confidence}%</span>
                </div>
                <ConfidenceBar pct={pick.confidence} />
              </div>

              {/* Model signals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-sm p-4" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.1)" }}>
                  <div className="font-body text-xs tracking-widest mb-2" style={{ color: "rgba(212,175,55,0.4)", letterSpacing: "0.2em" }}>⚡ MAC — ERA ENGINE</div>
                  <div className="font-body text-sm font-semibold" style={{ color: "#E8E8E8" }}>{pick.macSignal}</div>
                </div>
                <div className="rounded-sm p-4" style={{ background: "rgba(192,192,192,0.03)", border: "1px solid rgba(192,192,192,0.1)" }}>
                  <div className="font-body text-xs tracking-widest mb-2" style={{ color: "rgba(192,192,192,0.4)", letterSpacing: "0.2em" }}>🎯 ACE — MARKET EDGE</div>
                  <div className="font-body text-sm font-semibold" style={{ color: "#E8E8E8" }}>{pick.aceSignal}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NBA PICKS ──────────────────────────────────────────────────────── */}
      <section id="nba" className="relative z-10 py-24 px-6" style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-5">
              <div className="animate-float" style={{ fontSize: "56px", filter: "drop-shadow(0 0 20px rgba(212,175,55,0.4)) drop-shadow(0 0 40px rgba(212,175,55,0.15))" }}>🏀</div>
            </div>
            <p className="font-body text-xs tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "0.3em" }}>— TONIGHT'S INTELLIGENCE —</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
              <span className="gold-text">NBA</span> <span style={{ color: "rgba(232,232,232,0.9)" }}>Picks</span>
            </h2>
            <p className="font-body text-sm" style={{ color: "rgba(232,232,232,0.35)", letterSpacing: "0.1em" }}>
              Kalshi edge model. Injury-adjusted. Live tonight.
            </p>
          </div>

          {NBA_PICKS.map((pick) => (
            <div key={pick.id} className="ticket-card rounded-sm mb-6 p-8 animate-border-glow glow-gold">
              <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>NBA PICK #{pick.id}</span>
                    <span className="font-body text-xs px-2 py-0.5 rounded-sm animate-pulse-gold" style={{ background: "rgba(74,222,128,0.12)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.35)", letterSpacing: "0.15em" }}>● ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex flex-col items-center gap-2">
                      {NBA_TEAM_LOGOS[pick.awayTeam] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={NBA_TEAM_LOGOS[pick.awayTeam]} alt={pick.awayTeam} width={56} height={56} className="object-contain drop-shadow-lg"
                          style={{ filter: pick.betTeam === pick.awayTeam ? "drop-shadow(0 0 12px rgba(212,175,55,0.7))" : "grayscale(40%) opacity(0.6)" }} />
                      )}
                      <span className="font-body text-xs font-bold" style={{ color: pick.betTeam === pick.awayTeam ? "#FFD700" : "rgba(232,232,232,0.4)", letterSpacing: "0.1em" }}>{pick.awayTeam}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-display text-2xl" style={{ color: "rgba(232,232,232,0.15)" }}>@</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      {NBA_TEAM_LOGOS[pick.homeTeam] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={NBA_TEAM_LOGOS[pick.homeTeam]} alt={pick.homeTeam} width={56} height={56} className="object-contain drop-shadow-lg"
                          style={{ filter: pick.betTeam === pick.homeTeam ? "drop-shadow(0 0 12px rgba(212,175,55,0.7))" : "grayscale(40%) opacity(0.6)" }} />
                      )}
                      <span className="font-body text-xs font-bold" style={{ color: pick.betTeam === pick.homeTeam ? "#FFD700" : "rgba(232,232,232,0.4)", letterSpacing: "0.1em" }}>{pick.homeTeam}</span>
                    </div>
                  </div>
                  <div className="font-body text-sm" style={{ color: "rgba(232,232,232,0.35)" }}>{pick.time}</div>
                  <CountdownTimer time={pick.time} />
                </div>
                <div className="text-right">
                  <div className="font-body text-xs tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.5)" }}>BET</div>
                  <div className="font-display text-4xl font-black gold-text">{pick.bet}</div>
                  <div className="font-display text-2xl font-bold mt-1" style={{ color: "rgba(232,232,232,0.7)" }}>{pick.odds}</div>

                </div>
              </div>
              <div className="rounded-sm p-4" style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.1)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>⚡ MODEL EDGE: {pick.edge}</span>
                </div>
                <div className="font-body text-sm font-semibold" style={{ color: "#E8E8E8" }}>{pick.signal}</div>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleShare(pick.id)}
                  className="font-body text-xs px-3 py-1.5 rounded-sm transition-all duration-200"
                  style={{
                    background: copiedId === pick.id ? "rgba(212,175,55,0.12)" : "transparent",
                    border: "1px solid rgba(212,175,55,0.3)",
                    color: copiedId === pick.id ? "#FFD700" : "rgba(212,175,55,0.55)",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                  }}
                >
                  {copiedId === pick.id ? "COPIED ✓" : "SHARE ↗"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOTTERY PICKS ────────────────────────────────────────────────── */}
      <section id="lottery" className="relative z-10 py-24 px-6" style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-5">
              <div className="animate-float" style={{ fontSize: "56px", filter: "drop-shadow(0 0 20px rgba(212,175,55,0.5))" }}>🎫</div>
            </div>
            <p className="font-body text-xs tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "0.3em" }}>— HIGH RISK · HIGH REWARD —</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
              <span className="gold-text">Lottery</span> <span style={{ color: "rgba(232,232,232,0.9)" }}>Picks</span>
            </h2>
            <div className="inline-block px-4 py-1.5 rounded-sm mb-4" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.35)" }}>
              <span className="font-body text-xs tracking-widest" style={{ color: "#4ADE80", letterSpacing: "0.3em" }}>✓ PARLAY HIT — ALL 3 LEGS WON</span>
            </div>
            <p className="font-body text-sm" style={{ color: "rgba(232,232,232,0.35)", letterSpacing: "0.05em" }}>
              Bet small. Win big. 3+ leg parlays built from model edges.
            </p>
          </div>

          <div>
          {LOTTERY_PICKS.map((ticket) => (
            <div key={ticket.id} className="rounded-sm mb-8 overflow-hidden" style={{
              background: "linear-gradient(135deg, rgba(20,14,0,0.98) 0%, rgba(8,6,0,0.99) 100%)",
              border: "1px solid rgba(212,175,55,0.35)",
              boxShadow: "0 0 60px rgba(212,175,55,0.08), 0 0 120px rgba(212,175,55,0.04)",
            }}>
              {/* Ticket header */}
              <div className="px-8 py-5 flex items-center justify-between" style={{
                background: "linear-gradient(90deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)",
                borderBottom: "1px solid rgba(212,175,55,0.15)",
              }}>
                <div>
                  <div className="font-body text-xs tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.25em" }}>LOTTERY TICKET #{ticket.id}</div>
                  <div className="font-display text-lg font-bold" style={{ color: "rgba(232,232,232,0.9)" }}>{ticket.label}</div>
                  <div className="font-body text-xs mt-1" style={{ color: "rgba(232,232,232,0.3)" }}>{ticket.subtitle}</div>
                </div>
                <div className="text-right">
                  <div className="font-body text-xs tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.4)", letterSpacing: "0.2em" }}>COMBINED ODDS</div>
                  <div className="font-display text-3xl font-black" style={{ background: "linear-gradient(135deg, #FFD700, #FFF8DC, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{ticket.combinedOdds}</div>
                </div>
              </div>

              {/* Legs */}
              <div className="divide-y" style={{ borderColor: "rgba(212,175,55,0.07)" }}>
                {ticket.legs.map((leg, i) => (
                  <div key={i} className="flex items-center gap-4 px-8 py-4">
                    <div className="font-body text-xs font-bold px-2 py-1 rounded-sm" style={{ background: "rgba(212,175,55,0.08)", color: "rgba(212,175,55,0.6)", letterSpacing: "0.15em", minWidth: "44px", textAlign: "center" }}>{leg.sport}</div>
                    <div className="flex items-center gap-2 flex-1">
                      {(leg.sport === "NBA" ? NBA_TEAM_LOGOS : TEAM_LOGOS)[leg.betTeam] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={(leg.sport === "NBA" ? NBA_TEAM_LOGOS : TEAM_LOGOS)[leg.betTeam]} alt={leg.betTeam} width={28} height={28} className="object-contain" style={{ filter: "drop-shadow(0 0 6px rgba(212,175,55,0.5))" }} />
                      )}
                      <div>
                        <div className="font-body text-sm font-semibold" style={{ color: "#E8E8E8" }}>{leg.pick}</div>
                        <div className="font-body text-xs" style={{ color: "rgba(232,232,232,0.3)" }}>{leg.game}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-lg font-bold gold-text">{leg.odds}</span>
                      <span className="font-body text-xs" style={{ color: "rgba(212,175,55,0.45)", letterSpacing: "0.1em" }}>EDGE {leg.edge}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Perforated divider */}
              <div className="mx-8" style={{ borderTop: "2px dashed rgba(212,175,55,0.15)" }} />

              {/* Payout section */}
              <div className="px-8 py-6 flex items-center justify-between">
                <div>
                  <div className="font-body text-xs tracking-widest mb-1" style={{ color: "rgba(232,232,232,0.3)", letterSpacing: "0.2em" }}>STAKE</div>
                  <div className="font-display text-2xl font-bold" style={{ color: "rgba(232,232,232,0.6)" }}>{ticket.stake}</div>
                </div>
                <div className="font-display text-4xl font-black" style={{ color: "rgba(212,175,55,0.25)" }}>→</div>
                <div className="text-center">
                  <div className="font-body text-xs tracking-widest mb-1" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>POTENTIAL PAYOUT</div>
                  <div className="font-display text-5xl font-black" style={{ background: "linear-gradient(135deg, #B8860B 0%, #FFD700 45%, #FFFACD 65%, #D4AF37 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 20px rgba(212,175,55,0.4))" }}>{ticket.payout}</div>
                  <div className="font-body text-xs mt-1" style={{ color: "rgba(212,175,55,0.4)", letterSpacing: "0.15em" }}>{ticket.multiplier} MULTIPLIER</div>
                </div>
                <div className="text-right">
                  <div className="font-body text-xs tracking-widest mb-1" style={{ color: "rgba(232,232,232,0.3)", letterSpacing: "0.2em" }}>LEGS</div>
                  <div className="font-display text-2xl font-bold" style={{ color: "rgba(232,232,232,0.6)" }}>{ticket.legs.length}</div>
                </div>
              </div>
            </div>
          ))}
          </div>
          <p className="font-body text-center text-xs mt-4" style={{ color: "rgba(232,232,232,0.15)", letterSpacing: "0.05em" }}>
            Lottery picks are high-risk parlays. All legs carry independent model edge. Never bet more than you can afford to lose.
          </p>
        </div>
      </section>

      {/* ── THE MODEL ──────────────────────────────────────────────────────── */}
      <section id="model" className="relative z-10 py-32 px-6" style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="font-body text-xs tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "0.3em" }}>— THE SYSTEM —</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold">
              <span style={{ color: "rgba(232,232,232,0.9)" }}>Dual</span> <span className="gold-text">Signal</span>
            </h2>
            <p className="font-body mt-4 text-sm max-w-xl mx-auto" style={{ color: "rgba(232,232,232,0.35)", lineHeight: "1.8" }}>
              Most services run one model and call it a system. We run two — independent, quantitative, and only agree to bet when they converge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Mac */}
            <button
              onClick={() => { setModelTab("mac"); setModelOpen(true); }}
              className="stat-card rounded-sm p-8 text-left w-full transition-all duration-300"
              style={{ cursor: "pointer", background: "none", border: "1px solid rgba(212,175,55,0.15)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.45)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)")}
            >
              <div className="font-body text-xs tracking-widest mb-6" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>MODEL ONE</div>
              <div className="font-display text-4xl font-black gold-text mb-2">MAC</div>
              <div className="font-body text-xs mb-8" style={{ color: "rgba(232,232,232,0.4)", letterSpacing: "0.1em" }}>ERA DIFFERENTIAL ENGINE</div>
              <div className="space-y-3">
                {["ERA gap filter (2.0+ threshold)", "Juice ceiling (-130 max)", "Max 2 picks/day discipline", "Hard Rock line validation"].map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <span style={{ color: "#D4AF37", fontSize: "10px", marginTop: "4px" }}>◆</span>
                    <span className="font-body text-sm" style={{ color: "rgba(232,232,232,0.55)", lineHeight: "1.5" }}>{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.35)", letterSpacing: "0.2em" }}>TAP TO EXPLORE ↗</div>
            </button>

            {/* Convergence arrow */}
            <div className="flex flex-col items-center justify-center py-8">
              <div className="font-display text-6xl font-black text-center mb-4" style={{ color: "rgba(232,232,232,0.08)" }}>×</div>
              <div className="w-px h-16" style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.3), rgba(212,175,55,0))" }} />
              <div className="my-4 px-4 py-2 rounded-sm text-center" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <div className="font-body text-xs tracking-widest" style={{ color: "#FFD700", letterSpacing: "0.2em" }}>CONVERGE</div>
              </div>
              <div className="w-px h-16" style={{ background: "linear-gradient(180deg, rgba(212,175,55,0), rgba(212,175,55,0.3))" }} />
              <div className="mt-4 font-body text-xs text-center max-w-28" style={{ color: "rgba(232,232,232,0.25)", lineHeight: "1.6" }}>Both agree → bet. One agrees → pass.</div>
            </div>

            {/* Ace */}
            <button
              onClick={() => { setModelTab("ace"); setModelOpen(true); }}
              className="stat-card rounded-sm p-8 text-left w-full transition-all duration-300"
              style={{ cursor: "pointer", background: "none", border: "1px solid rgba(192,192,192,0.12)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(192,192,192,0.4)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(192,192,192,0.12)")}
            >
              <div className="font-body text-xs tracking-widest mb-6" style={{ color: "rgba(192,192,192,0.5)", letterSpacing: "0.2em" }}>MODEL TWO</div>
              <div className="font-display text-4xl font-black silver-text mb-2">ACE</div>
              <div className="font-body text-xs mb-8" style={{ color: "rgba(232,232,232,0.4)", letterSpacing: "0.1em" }}>MARKET EDGE FINDER v2.0</div>
              <div className="space-y-3">
                {["SIERA/xFIP/FIP weighted core", "Bayesian regression (small samples)", "Bullpen fatigue + weather", "Real park factors (all 30 teams)", "CLV closing line tracking"].map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <span style={{ color: "#C0C0C0", fontSize: "10px", marginTop: "4px" }}>◆</span>
                    <span className="font-body text-sm" style={{ color: "rgba(232,232,232,0.55)", lineHeight: "1.5" }}>{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 font-body text-xs tracking-widest" style={{ color: "rgba(192,192,192,0.3)", letterSpacing: "0.2em" }}>TAP TO EXPLORE ↗</div>
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS / RECORD ─────────────────────────────────────────────────── */}
      <section id="record" className="relative z-10 py-32 px-6" style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="font-body text-xs tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "0.3em" }}>— LIVE PERFORMANCE —</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold">
              <span className="gold-text">The</span> <span style={{ color: "rgba(232,232,232,0.9)" }}>Record</span>
            </h2>
            <p className="font-body mt-4 text-sm" style={{ color: "rgba(232,232,232,0.3)", letterSpacing: "0.05em" }}>
              Tracked live. Every bet logged. No cherry-picking.
            </p>
          </div>

          {/* MLB stats */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-6">
              <span style={{ fontSize: "24px" }}>⚾</span>
              <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.25em" }}>MLB MODEL</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "RECORD", value: STATS.record, sub: "W-L" },
                { label: "ROI", value: STATS.roi, sub: "return on investment" },
                { label: "NET UNITS", value: STATS.units, sub: "units profit" },
                { label: "SINCE", value: STATS.since, sub: "tracking start" },
              ].map((s) => (
                <div key={s.label} className="stat-card rounded-sm p-6 text-center">
                  <div className="font-body text-xs tracking-widest mb-3" style={{ color: "rgba(212,175,55,0.4)", letterSpacing: "0.2em" }}>{s.label}</div>
                  <div className="font-display text-3xl md:text-4xl font-black gold-text mb-1">{s.value}</div>
                  <div className="font-body text-xs" style={{ color: "rgba(232,232,232,0.2)" }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="glass-dark rounded-sm overflow-hidden mb-16">
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>MLB BET LOG</span>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {BET_LOG.map((bet, i) => (
                  <div key={i} className="flex flex-wrap items-center justify-between px-6 py-4 gap-2 transition-all hover:bg-white hover:bg-opacity-[0.02]">
                    <div className="flex items-center gap-4">
                      <span className="font-body text-xs" style={{ color: "rgba(232,232,232,0.25)", minWidth: "60px" }}>{bet.date}</span>
                      <span className="font-body text-sm" style={{ color: "rgba(232,232,232,0.65)" }}>{bet.game}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-body text-sm font-medium" style={{ color: "rgba(232,232,232,0.5)" }}>{bet.bet}</span>
                      <span className="font-body text-sm" style={{ color: "rgba(212,175,55,0.6)" }}>{bet.odds}</span>
                      <span className={`font-body text-xs font-bold tracking-widest ${bet.result === "WIN" ? "win-tag" : bet.result === "LOSS" ? "loss-tag" : "pending-tag"}`} style={{ letterSpacing: "0.15em" }}>
                        {bet.result}
                      </span>
                      <span className={`font-body text-sm font-bold ${bet.units.startsWith("+") ? "win-tag" : bet.units === "—" ? "" : "loss-tag"}`}>{bet.units}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NBA stats */}
          <div style={{ borderTop: "1px solid rgba(212,175,55,0.08)", paddingTop: "48px" }}>
            <div className="flex items-center gap-3 mb-6">
              <span style={{ fontSize: "24px" }}>🏀</span>
              <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.25em" }}>NBA MODEL</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "RECORD", value: NBA_STATS.record, sub: "W-L" },
                { label: "NET P&L", value: "+$86.51", sub: "actual P&L" },
                { label: "WIN RATE", value: NBA_STATS.roi, sub: "win percentage" },
                { label: "SINCE", value: NBA_STATS.since, sub: "tracking start" },
              ].map((s) => (
                <div key={s.label} className="stat-card rounded-sm p-6 text-center">
                  <div className="font-body text-xs tracking-widest mb-3" style={{ color: "rgba(212,175,55,0.4)", letterSpacing: "0.2em" }}>{s.label}</div>
                  <div className="font-display text-3xl md:text-4xl font-black gold-text mb-1">{s.value}</div>
                  <div className="font-body text-xs" style={{ color: "rgba(232,232,232,0.2)" }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="glass-dark rounded-sm overflow-hidden">
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>NBA BET LOG</span>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {NBA_BET_LOG.map((bet, i) => (
                  <div key={i} className="flex flex-wrap items-center justify-between px-6 py-4 gap-2 transition-all hover:bg-white hover:bg-opacity-[0.02]">
                    <div className="flex items-center gap-4">
                      <span className="font-body text-xs" style={{ color: "rgba(232,232,232,0.25)", minWidth: "60px" }}>{bet.date}</span>
                      <span className="font-body text-sm" style={{ color: "rgba(232,232,232,0.65)" }}>{bet.game}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-body text-sm font-medium" style={{ color: "rgba(232,232,232,0.5)" }}>{bet.bet}</span>
                      <span className="font-body text-sm" style={{ color: "rgba(212,175,55,0.6)" }}>{bet.odds}</span>
                      <span className={`font-body text-xs font-bold tracking-widest ${bet.result === "WIN" ? "win-tag" : bet.result === "LOSS" ? "loss-tag" : "pending-tag"}`} style={{ letterSpacing: "0.15em" }}>
                        {bet.result}
                      </span>
                      <span className={`font-body text-sm font-bold ${bet.units.startsWith("+") ? "win-tag" : bet.units === "—" ? "" : "loss-tag"}`}>{bet.units}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="font-body text-center text-xs mt-6" style={{ color: "rgba(232,232,232,0.18)", letterSpacing: "0.05em" }}>
            Beta phase. All bets real. All results real. Model improvement is ongoing — we show you everything.
          </p>
        </div>
      </section>

      {/* ── RECEIPTS ───────────────────────────────────────────────────────── */}
      <section id="receipts" className="relative z-10 py-32 px-6" style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "0.3em" }}>— PROOF OF WORK —</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
              <span style={{ color: "rgba(232,232,232,0.9)" }}>The</span>{" "}
              <span className="gold-text">Receipts</span>
            </h2>
            <p className="font-body text-sm max-w-md mx-auto" style={{ color: "rgba(232,232,232,0.35)", lineHeight: "1.9", letterSpacing: "0.05em" }}>
              Every bet logged before tip-off. Every result verified. We don’t delete losses.
            </p>
          </div>

          {/* Featured receipt — parlay */}
          <div className="glass-dark rounded-sm p-8 md:p-10 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.25em" }}>MAY 01, 2026 · 3-LEG PARLAY</span>
                  <span className="font-body text-xs px-2 py-0.5 rounded-sm" style={{ background: "rgba(74,222,128,0.12)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.3)", letterSpacing: "0.15em" }}>✓ VERIFIED WIN</span>
                </div>
                <div className="font-display text-3xl md:text-4xl font-bold gold-text mb-2">+$43.89</div>
                <div className="font-body text-sm" style={{ color: "rgba(232,232,232,0.4)" }}>DET ML · TOR ML · LAL ML — Combined +856</div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="font-body text-xs" style={{ color: "rgba(232,232,232,0.25)", letterSpacing: "0.15em" }}>STAKE → PAYOUT</div>
                <div className="font-display text-2xl font-bold" style={{ color: "rgba(232,232,232,0.7)" }}>$5.13 <span className="gold-text">→ $49.02</span></div>
                <div className="font-body text-xs" style={{ color: "rgba(212,175,55,0.4)", letterSpacing: "0.1em" }}>9.6× MULTIPLIER</div>
              </div>
            </div>
            <div className="mt-6 pt-6 grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10" style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
              {[
                { team: "DET", opp: "@ ORL", bet: "DET ML", odds: "-160", result: "W 93-79" },
                { team: "TOR", opp: "vs CLE", bet: "TOR ML", odds: "+140", result: "W 112-110" },
                { team: "LAL", opp: "@ HOU", bet: "LAL ML", odds: "+157", result: "W" },
              ].map((leg, i) => (
                <div key={i} className="rounded-sm px-4 py-3 flex items-center justify-between" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)" }}>
                  <div>
                    <div className="font-display text-lg font-bold" style={{ color: "rgba(232,232,232,0.9)" }}>{leg.team}</div>
                    <div className="font-body text-xs" style={{ color: "rgba(232,232,232,0.3)" }}>{leg.opp} · {leg.bet} {leg.odds}</div>
                  </div>
                  <div className="font-body text-xs font-bold" style={{ color: "#4ADE80", letterSpacing: "0.1em" }}>{leg.result}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Individual straight bets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { date: "MAY 01", label: "STRAIGHT BET", team: "DET ML", odds: "-160", stake: "$5.00", payout: "$8.12", profit: "+$3.12", opponent: "DET @ ORL" },
              { date: "MAY 01", label: "STRAIGHT BET", team: "TOR ML", odds: "+140", stake: "$5.00", payout: "$12.00", profit: "+$7.00", opponent: "CLE @ TOR" },
            ].map((r, i) => (
              <div key={i} className="glass-dark rounded-sm p-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at bottom left, rgba(74,222,128,0.04) 0%, transparent 70%)" }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.4)", letterSpacing: "0.2em" }}>{r.date} · {r.label}</span>
                    <span className="font-body text-xs px-2 py-0.5 rounded-sm" style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)", letterSpacing: "0.12em" }}>✓ WIN</span>
                  </div>
                  <div className="font-body text-xs mb-1" style={{ color: "rgba(232,232,232,0.25)" }}>{r.opponent}</div>
                  <div className="font-display text-2xl font-bold gold-text mb-3">{r.profit}</div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-body text-xs" style={{ color: "rgba(232,232,232,0.25)", letterSpacing: "0.1em" }}>BET</div>
                      <div className="font-body text-sm font-semibold" style={{ color: "rgba(232,232,232,0.7)" }}>{r.team} {r.odds}</div>
                    </div>
                    <div style={{ color: "rgba(212,175,55,0.2)" }}>|</div>
                    <div>
                      <div className="font-body text-xs" style={{ color: "rgba(232,232,232,0.25)", letterSpacing: "0.1em" }}>STAKE</div>
                      <div className="font-body text-sm font-semibold" style={{ color: "rgba(232,232,232,0.7)" }}>{r.stake}</div>
                    </div>
                    <div style={{ color: "rgba(212,175,55,0.2)" }}>|</div>
                    <div>
                      <div className="font-body text-xs" style={{ color: "rgba(232,232,232,0.25)", letterSpacing: "0.1em" }}>PAID</div>
                      <div className="font-body text-sm font-semibold" style={{ color: "rgba(232,232,232,0.7)" }}>{r.payout}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="font-body text-center text-xs" style={{ color: "rgba(232,232,232,0.18)", letterSpacing: "0.1em" }}>
            EVERY BET PLACED BEFORE TIP-OFF · NO RETROACTIVE PICKS · BETA PHASE
          </p>
        </div>
      </section>

      {/* ── JOIN BETA ──────────────────────────────────────────────────────── */}
      <section id="join" className="relative z-10 py-32 px-6" style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="font-body text-xs tracking-widest mb-3" style={{ color: "#D4AF37", letterSpacing: "0.3em" }}>— LIMITED ACCESS —</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold mb-4">
            <span style={{ color: "rgba(232,232,232,0.9)" }}>Join the</span>
            <br />
            <span className="gold-text">Beta</span>
          </h2>
          <p className="font-body text-sm mb-10" style={{ color: "rgba(232,232,232,0.35)", lineHeight: "1.8" }}>
            Daily picks in your inbox. Full model reasoning. Live P&L tracking. Free during beta.
          </p>

          {submitted ? (
            <div className="glass rounded-sm p-8">
              <div className="font-display text-3xl gold-text mb-2">You're In</div>
              <p className="font-body text-sm" style={{ color: "rgba(232,232,232,0.5)" }}>First picks drop tomorrow morning. Welcome to WunToo.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 font-body text-sm px-5 py-4 rounded-sm"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(212,175,55,0.2)",
                  color: "#E8E8E8",
                  transition: "all 0.3s",
                }}
              />
              <button
                type="submit"
                className="font-body font-semibold px-8 py-4 rounded-sm transition-all duration-300 hover:scale-105 whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #B8860B, #FFD700)",
                  color: "#000",
                  letterSpacing: "0.15em",
                  fontSize: "13px",
                  boxShadow: "0 0 30px rgba(212,175,55,0.25)",
                }}
              >
                GET PICKS →
              </button>
            </form>
          )}

          <div className="flex items-center justify-center gap-6 mt-8">
            {["FREE BETA ACCESS", "DAILY PICKS", "FULL REASONING"].map((t) => (
              <span key={t} className="font-body text-xs" style={{ color: "rgba(212,175,55,0.3)", letterSpacing: "0.15em" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-12 px-6 text-center" style={{ borderTop: "1px solid rgba(212,175,55,0.06)" }}>
        <div className="font-display text-2xl gold-text font-bold mb-3">WunToo</div>
        <p className="font-body text-xs mb-4" style={{ color: "rgba(232,232,232,0.2)", letterSpacing: "0.1em" }}>
          MLB DUAL-MODEL BETTING INTELLIGENCE · BETA
        </p>
        <p className="font-body text-xs max-w-md mx-auto" style={{ color: "rgba(212,175,55,0.55)", lineHeight: "1.8" }}>
          WunToo is an entertainment and analysis service. Betting involves risk. Never wager more than you can afford to lose. Past performance does not guarantee future results.
        </p>
        <div className="mt-6 font-body text-xs" style={{ color: "rgba(212,175,55,0.35)" }}>
          A <a href="https://tauschus.com" className="hover:text-yellow-400 transition-colors">Tauschus</a> product · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
