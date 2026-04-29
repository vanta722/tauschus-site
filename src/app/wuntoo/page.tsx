"use client";

import { useEffect, useRef, useState } from "react";

// ─── LIVE DATA (update daily) ───────────────────────────────────────────────
const STATS = {
  record: "5-3",
  roi: "+27.1%",
  units: "+2.47u",
  clv: "+3.2%",
  streak: "W2",
  bankroll: "$37.54",
  since: "APR 21 2026",
};

const PICKS = [
  {
    id: 1,
    status: "LOCKED",
    game: "BOS @ TOR",
    time: "7:07 PM ET",
    bet: "BOS ML",
    odds: "+100",
    units: "1.0u",
    confidence: 78,
    macSignal: "ERA GAP +1.4",
    aceSignal: "MKT EDGE +6.2pp",
    combined: "HIGH",
    tag: "DUAL CONFIRMED",
  },
];

const BET_LOG = [
  { date: "APR 27", game: "Cubs @ Padres", bet: "SD ML", odds: "-120", result: "WIN", units: "+1.25u" },
  { date: "APR 27", game: "Rays @ Guardians", bet: "CLE ML", odds: "-140", result: "LOSS", units: "-0.8u" },
  { date: "APR 26", game: "NYY @ HOU", bet: "HOU ML", odds: "+115", result: "WIN", units: "+1.8u" },
  { date: "APR 26", game: "CHC @ LAD", bet: "CHC ML", odds: "+110", result: "LOSS", units: "-1.0u" },
  { date: "APR 25", game: "ATL @ NYM", bet: "NYM ML", odds: "+105", result: "WIN", units: "+1.05u" },
  { date: "APR 24", game: "PHI @ MIL", bet: "PHI ML", odds: "-115", result: "WIN", units: "+0.87u" },
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

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function WunToo() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "#030303", color: "#E8E8E8" }}>
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
          <a href="#picks" className="nav-link font-body">Picks</a>
          <a href="#model" className="nav-link font-body">The Model</a>
          <a href="#record" className="nav-link font-body">Record</a>
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
          {/* Eyebrow */}
          <div className="opacity-0 animate-fade delay-1 inline-flex items-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #D4AF37)" }} />
            <span className="font-body text-xs tracking-widest" style={{ color: "#D4AF37", letterSpacing: "0.3em" }}>DUAL-MODEL MLB INTELLIGENCE</span>
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

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-gold">
          <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.4)" }}>SCROLL</span>
          <div className="w-px h-12" style={{ background: "linear-gradient(180deg, rgba(212,175,55,0.4), transparent)" }} />
        </div>
      </section>

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

          {/* Pick cards */}
          {PICKS.map((pick) => (
            <div key={pick.id} className="ticket-card rounded-sm mb-6 p-8 animate-border-glow glow-gold">
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>PICK #{pick.id}</span>
                    <span className="font-body text-xs px-2 py-0.5 rounded-sm" style={{ background: pick.status === "LOCKED" ? "rgba(74,222,128,0.1)" : "rgba(212,175,55,0.1)", color: pick.status === "LOCKED" ? "#4ADE80" : "#FFD700", border: `1px solid ${pick.status === "LOCKED" ? "rgba(74,222,128,0.3)" : "rgba(212,175,55,0.3)"}`, letterSpacing: "0.15em" }}>{pick.status}</span>
                    <span className="font-body text-xs px-2 py-0.5 rounded-sm" style={{ background: "rgba(212,175,55,0.08)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.2)", letterSpacing: "0.1em" }}>{pick.tag}</span>
                  </div>
                  <div className="font-display text-3xl font-bold" style={{ color: "#E8E8E8" }}>{pick.game}</div>
                  <div className="font-body text-sm mt-1" style={{ color: "rgba(232,232,232,0.35)" }}>{pick.time}</div>
                </div>
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
              <div className="grid grid-cols-2 gap-4">
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
            <div className="stat-card rounded-sm p-8">
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
            </div>

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
            <div className="stat-card rounded-sm p-8">
              <div className="font-body text-xs tracking-widest mb-6" style={{ color: "rgba(192,192,192,0.5)", letterSpacing: "0.2em" }}>MODEL TWO</div>
              <div className="font-display text-4xl font-black silver-text mb-2">ACE</div>
              <div className="font-body text-xs mb-8" style={{ color: "rgba(232,232,232,0.4)", letterSpacing: "0.1em" }}>MARKET EDGE FINDER v2</div>
              <div className="space-y-3">
                {["Pinnacle sharp line anchor", "ERA/FIP regression detection", "Callup & opener adjustments", "Bullpen fatigue + weather", "CLV closing line tracking"].map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <span style={{ color: "#C0C0C0", fontSize: "10px", marginTop: "4px" }}>◆</span>
                    <span className="font-body text-sm" style={{ color: "rgba(232,232,232,0.55)", lineHeight: "1.5" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
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

          {/* Big stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
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

          {/* Bet log */}
          <div className="glass-dark rounded-sm overflow-hidden">
            <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
              <span className="font-body text-xs tracking-widest" style={{ color: "rgba(212,175,55,0.5)", letterSpacing: "0.2em" }}>RECENT BET LOG</span>
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
                    <span className={`font-body text-xs font-bold tracking-widest ${bet.result === "WIN" ? "win-tag" : bet.result === "LOSS" ? "loss-tag" : "pending-tag"}`}>
                      {bet.result}
                    </span>
                    <span className={`font-body text-sm font-bold ${bet.units.startsWith("+") ? "win-tag" : "loss-tag"}`}>{bet.units}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="font-body text-center text-xs mt-6" style={{ color: "rgba(232,232,232,0.18)", letterSpacing: "0.05em" }}>
            Beta phase. All bets real. All results real. Model improvement is ongoing — we show you everything.
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
        <p className="font-body text-xs max-w-md mx-auto" style={{ color: "rgba(232,232,232,0.12)", lineHeight: "1.8" }}>
          WunToo is an entertainment and analysis service. Betting involves risk. Never wager more than you can afford to lose. Past performance does not guarantee future results.
        </p>
        <div className="mt-6 font-body text-xs" style={{ color: "rgba(232,232,232,0.1)" }}>
          A <a href="https://tauschus.com" className="hover:text-yellow-600 transition-colors">Tauschus</a> product · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
