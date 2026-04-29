"use client";

import { useEffect, useRef, useState } from "react";

// ─── PROJECTS ────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "lionx",
    name: "LionX AI",
    tag: "WEB3 · AI TOOLS",
    desc: "Token-gated AI platform. Pay crypto, access premium intelligence. Built on Tron.",
    href: "https://lionxai.com",
    color: "#7C3AED",
    glow: "rgba(124,58,237,0.3)",
    border: "rgba(124,58,237,0.3)",
    status: "LIVE",
    icon: "🦁",
  },
  {
    id: "wuntoo",
    name: "WunToo",
    tag: "MLB · BETTING INTEL",
    desc: "Dual-model MLB picks engine. ERA differential meets market edge. Zero guesswork.",
    href: "/wuntoo",
    color: "#D4AF37",
    glow: "rgba(212,175,55,0.3)",
    border: "rgba(212,175,55,0.3)",
    status: "BETA",
    icon: "⚾",
  },
  {
    id: "fca",
    name: "Florida Concrete Alliance",
    tag: "CONSTRUCTION · FLORIDA",
    desc: "Concrete services for residential, commercial, and property management across Florida.",
    href: "https://floridaconcretealliance.com",
    color: "#F97316",
    glow: "rgba(249,115,22,0.3)",
    border: "rgba(249,115,22,0.3)",
    status: "LIVE",
    icon: "🏗️",
  },
  {
    id: "next",
    name: "??? INCOMING",
    tag: "CLASSIFIED · SOON",
    desc: "Something new is being built. Keep watching.",
    href: "#",
    color: "#64748B",
    glow: "rgba(100,116,139,0.15)",
    border: "rgba(100,116,139,0.15)",
    status: "SOON",
    icon: "🛰️",
  },
];

// ─── STAR FIELD ──────────────────────────────────────────────────────────────
function StarField() {
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

    // Stars
    const stars: { x: number; y: number; r: number; op: number; speed: number; twinkle: number }[] = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.2,
        op: Math.random() * 0.8 + 0.1,
        speed: Math.random() * 0.015 + 0.003,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    // Shooting stars
    const shoots: { x: number; y: number; len: number; speed: number; op: number; active: boolean; angle: number }[] = [];
    for (let i = 0; i < 3; i++) {
      shoots.push({ x: 0, y: 0, len: 0, speed: 0, op: 0, active: false, angle: 0 });
    }

    let t = 0;
    let frame: number;

    const spawnShoot = (s: typeof shoots[0]) => {
      s.x = Math.random() * window.innerWidth * 0.6;
      s.y = Math.random() * window.innerHeight * 0.4;
      s.len = Math.random() * 120 + 60;
      s.speed = Math.random() * 8 + 6;
      s.op = 1;
      s.active = true;
      s.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;

      // Draw stars
      stars.forEach((s) => {
        s.twinkle += s.speed;
        const opacity = s.op * (0.6 + 0.4 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
      });

      // Nebula wisps
      const grad1 = ctx.createRadialGradient(
        window.innerWidth * 0.15, window.innerHeight * 0.25, 0,
        window.innerWidth * 0.15, window.innerHeight * 0.25, 300
      );
      grad1.addColorStop(0, "rgba(99,102,241,0.04)");
      grad1.addColorStop(1, "transparent");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad2 = ctx.createRadialGradient(
        window.innerWidth * 0.8, window.innerHeight * 0.1, 0,
        window.innerWidth * 0.8, window.innerHeight * 0.1, 250
      );
      grad2.addColorStop(0, "rgba(14,165,233,0.03)");
      grad2.addColorStop(1, "transparent");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Shooting stars
      shoots.forEach((s, i) => {
        if (!s.active) {
          if (Math.random() < 0.002) spawnShoot(s);
          return;
        }
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.op -= 0.02;
        if (s.op <= 0) { s.active = false; return; }

        const tailX = s.x - Math.cos(s.angle) * s.len;
        const tailY = s.y - Math.sin(s.angle) * s.len;
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, `rgba(255,255,255,${s.op * 0.8})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        void i;
      });

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

// ─── EARTH ────────────────────────────────────────────────────────────────────
function Earth() {
  return (
    <div className="earth-wrap pointer-events-none" aria-hidden>
      <div className="earth-sphere">
        <div className="earth-surface" />
        <div className="earth-clouds" />
        <div className="earth-atmosphere" />
        <div className="earth-shine" />
      </div>
    </div>
  );
}

// ─── BUBBLE CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ p, i }: { p: typeof PROJECTS[0]; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={p.href}
      target={p.href.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="bubble-card flex flex-col items-center justify-center text-center transition-all duration-500"
      style={{
        animationDelay: `${i * 0.15}s`,
        cursor: p.href === "#" ? "default" : "pointer",
        transform: hovered ? "translateY(-8px) scale(1.04)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? `0 0 60px ${p.glow}, 0 0 120px ${p.glow.replace("0.3","0.1")}, inset 0 1px 1px rgba(255,255,255,0.15)`
          : `0 0 20px ${p.glow.replace("0.3","0.06")}, inset 0 1px 1px rgba(255,255,255,0.06)`,
        background: hovered
          ? `radial-gradient(circle at 35% 30%, ${p.glow.replace("0.3","0.18")} 0%, rgba(5,5,20,0.85) 70%)`
          : `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.05) 0%, rgba(5,5,20,0.7) 70%)`,
        borderColor: hovered ? p.color : "rgba(255,255,255,0.08)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div className="mb-3 transition-all duration-300" style={{ fontSize: "36px", transform: hovered ? "scale(1.15)" : "scale(1)" }}>
        {p.icon}
      </div>

      {/* Status dot */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-1.5 h-1.5 rounded-full" style={{
          background: p.status === "LIVE" ? "#4ADE80" : p.status === "BETA" ? "#D4AF37" : "#64748B",
          boxShadow: p.status === "LIVE" ? "0 0 6px #4ADE80" : p.status === "BETA" ? "0 0 6px #D4AF37" : "none",
        }} />
        <span className="font-body text-xs tracking-widest" style={{ color: p.status === "LIVE" ? "#4ADE80" : p.status === "BETA" ? "#D4AF37" : "#64748B", letterSpacing: "0.2em", fontSize: "10px" }}>{p.status}</span>
      </div>

      {/* Name */}
      <h3 className="font-display font-bold mb-2 transition-all duration-300 px-4" style={{ fontSize: "clamp(16px, 2vw, 20px)", color: hovered ? p.color : "#BAE6FD", lineHeight: 1.2, textShadow: hovered ? `0 0 16px ${p.color}` : "0 0 10px rgba(186,230,253,0.25)" }}>
        {p.name}
      </h3>

      {/* Tag */}
      <div className="font-body text-xs mb-3" style={{ color: "#67E8F9", letterSpacing: "0.15em", fontSize: "9px", opacity: 0.6 }}>{p.tag}</div>

      {/* Desc — only visible on hover */}
      <p className="font-body px-6 transition-all duration-300" style={{
        fontSize: "12px",
        color: "#BAE6FD",
        lineHeight: 1.6,
        maxHeight: hovered ? "80px" : "0px",
        overflow: "hidden",
        opacity: hovered ? 1 : 0,
      }}>
        {p.desc}
      </p>

      {/* Arrow */}
      {p.href !== "#" && (
        <div className="mt-3 transition-all duration-300" style={{ color: hovered ? p.color : "transparent", fontSize: "16px" }}>
          ↗
        </div>
      )}
    </a>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden font-body" style={{ background: "#020209", color: "#E8E8E8" }}>
      <StarField />
      <Earth />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        .font-display { font-family: 'Playfair Display', serif; }
        .font-body    { font-family: 'Space Grotesk', sans-serif; }

        /* ── Earth ── */
        .earth-wrap {
          position: fixed;
          bottom: -280px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          width: 700px;
          height: 700px;
        }
        @media (max-width: 768px) {
          .earth-wrap { width: 420px; height: 420px; bottom: -180px; }
        }
        .earth-sphere {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          animation: earth-spin 80s linear infinite;
        }
        .earth-surface {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(ellipse at 35% 30%, #1B6CA8 0%, transparent 50%),
            radial-gradient(ellipse at 65% 55%, #2E7D32 0%, transparent 40%),
            radial-gradient(ellipse at 20% 70%, #1565C0 0%, transparent 45%),
            radial-gradient(ellipse at 75% 20%, #1976D2 0%, transparent 35%),
            radial-gradient(ellipse at 50% 80%, #2E7D32 0%, transparent 30%),
            radial-gradient(circle, #0D47A1 0%, #1A237E 40%, #0A0A2E 75%, #020209 100%);
        }
        .earth-clouds {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(ellipse at 40% 25%, rgba(255,255,255,0.12) 0%, transparent 30%),
            radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.08) 0%, transparent 25%),
            radial-gradient(ellipse at 20% 55%, rgba(255,255,255,0.07) 0%, transparent 20%);
          animation: cloud-drift 120s linear infinite;
        }
        .earth-atmosphere {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: transparent;
          box-shadow:
            inset 0 0 60px rgba(79,195,247,0.15),
            0 0 60px rgba(79,195,247,0.12),
            0 0 120px rgba(21,101,192,0.08),
            0 0 200px rgba(13,71,161,0.05);
          pointer-events: none;
        }
        .earth-shine {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 25%, rgba(255,255,255,0.08) 0%, transparent 50%);
          pointer-events: none;
        }
        @keyframes earth-spin {
          from { filter: hue-rotate(0deg); }
          to   { filter: hue-rotate(5deg); }
        }
        @keyframes cloud-drift {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Text ── */
        .cosmic-title {
          background: linear-gradient(135deg, #38BDF8 0%, #A78BFA 35%, #2DD4BF 65%, #38BDF8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: aurora-shift 6s linear infinite;
        }
        @keyframes aurora-shift {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .cosmic-sub {
          background: linear-gradient(135deg, #67E8F9 0%, #A5F3FC 50%, #67E8F9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .neon-label { color: #67E8F9; letter-spacing: 0.3em; text-shadow: 0 0 12px rgba(103,232,249,0.5); }

        /* ── Animations ── */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fade-up { opacity: 0; animation: fade-up 0.9s ease-out forwards; }
        .fade-in { opacity: 0; animation: fade-in 1.2s ease-out forwards; }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.25s; }
        .d3 { animation-delay: 0.45s; }
        .d4 { animation-delay: 0.65s; }
        .d5 { animation-delay: 0.85s; }

        /* ── Bubbles ── */
        .bubble-card {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          position: relative;
          overflow: hidden;
        }
        .bubble-card::before {
          content: '';
          position: absolute;
          top: 8%;
          left: 18%;
          width: 35%;
          height: 18%;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          filter: blur(4px);
          pointer-events: none;
        }
        @media (max-width: 640px) {
          .bubble-card { width: 155px; height: 155px; }
        }
        .cards-enter > * {
          opacity: 0;
          animation: fade-up 0.7s ease-out forwards;
        }
        .cards-enter > *:nth-child(1) { animation-delay: 0.7s; }
        .cards-enter > *:nth-child(2) { animation-delay: 0.85s; }
        .cards-enter > *:nth-child(3) { animation-delay: 1.0s; }
        .cards-enter > *:nth-child(4) { animation-delay: 1.15s; }

        /* ── Nav ── */
        .nav-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #4ADE80;
          animation: pulse-dot 2.5s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50% { opacity:0.7; box-shadow: 0 0 0 6px rgba(74,222,128,0); }
        }

        /* ── Divider ── */
        .cosmic-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(34,211,238,0.25), transparent);
        }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
        style={{
          background: scrollY > 60 ? "rgba(2,2,9,0.9)" : "transparent",
          backdropFilter: scrollY > 60 ? "blur(20px)" : "none",
          borderBottom: scrollY > 60 ? "1px solid rgba(255,255,255,0.04)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div className="font-display text-lg font-bold cosmic-title tracking-wide">Tauschus</div>
        <div className="flex items-center gap-2">
          <div className="nav-dot" />
          <span className="font-body text-xs tracking-widest" style={{ color: "#4ADE80", letterSpacing: "0.15em" }}>SYSTEMS ONLINE</span>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pb-40">
        <div className="max-w-3xl mx-auto">

          {/* Eyebrow */}
          <div className="fade-in d1 inline-flex items-center gap-3 mb-8">
            <div className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, rgba(148,163,184,0.4))" }} />
            <span className="font-body text-xs neon-label">TAUSCHUS VENTURES</span>
            <div className="h-px w-10" style={{ background: "linear-gradient(90deg, rgba(148,163,184,0.4), transparent)" }} />
          </div>

          {/* Title */}
          <h1 className="fade-up d2 font-display font-black leading-none mb-5" style={{ fontSize: "clamp(64px, 12vw, 140px)" }}>
            <span className="cosmic-title">Tauschus</span>
          </h1>

          {/* Tagline */}
          <p className="fade-up d3 font-body font-light mb-4" style={{ fontSize: "clamp(16px, 2.5vw, 22px)", color: "#7DD3FC", letterSpacing: "0.04em", lineHeight: 1.6, textShadow: "0 0 30px rgba(125,211,252,0.35)" }}>
            Building from orbit.
          </p>
          <p className="fade-up d4 font-body font-light max-w-lg mx-auto" style={{ fontSize: "14px", color: "#7DD3FC", lineHeight: 1.8, letterSpacing: "0.03em", opacity: 0.75 }}>
            A collection of ventures built at the intersection of AI, finance, and the trades.
            Each project a satellite. Each orbit intentional.
          </p>

          {/* Scroll cue */}
          <div className="fade-in d5 mt-14 flex flex-col items-center gap-1">
            <span className="font-body text-xs neon-label" style={{ opacity: 0.5 }}>VENTURES BELOW</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ opacity: 0.3, marginTop: "6px" }}>
              <path d="M8 0v20M2 14l6 6 6-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 px-6 pb-40">
        <div className="max-w-5xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-10">
            <div className="cosmic-line flex-1" />
            <span className="font-body text-xs neon-label">ACTIVE VENTURES</span>
            <div className="cosmic-line flex-1" />
          </div>

          {/* Bubble Grid */}
          <div className="cards-enter grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.id} p={p} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-12 px-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="font-display text-xl cosmic-title font-bold mb-2">Tauschus</div>
        <p className="font-body text-xs" style={{ color: "#67E8F9", letterSpacing: "0.1em", opacity: 0.35 }}>
          Building in orbit · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
