"use client";

import { useState } from "react";

const PRODUCTS = [
  {
    badge: "FREE",
    badgeGreen: true,
    icon: "📘",
    title: "The Concrete Contractor's AI Estimating Playbook 2026",
    description: "Stop losing bids to bad numbers. The exact AI tools, prompts, and workflow used to estimate faster, win more jobs, and protect your margins.",
    bullets: ["5 AI tools reviewed", "6-step estimating workflow", "7+ ready-to-use ChatGPT prompts"],
    cta: "Download Free →",
    url: "https://vantaai3.gumroad.com/l/AIplaybook1",
    tag: "Most Downloaded",
  },
  {
    badge: "FREE",
    badgeGreen: true,
    icon: "📊",
    title: "The Job Costing Fix for Concrete Contractors",
    description: "A contractor can show $200K in annual profit while losing money on 40% of jobs. This guide gives you 5 AI-powered fixes to find exactly where your margins are bleeding — and stop it.",
    bullets: ["5 most common job costing mistakes", "AI prompts to track labor by job", "Free tool stack to fix it today"],
    cta: "Download Free →",
    url: "https://vantaai3.gumroad.com/l/jobcostingfix26",
    tag: "New Release",
  },
  {
    badge: "$1.99",
    badgeGreen: false,
    icon: "💰",
    title: "The Concrete Contractor's Margin Protection Playbook",
    description: "Material costs are up 7.1% annualized in 2026. Steel, rebar, diesel, cement — all moving against you. This playbook gives you 5 systems to protect your profits when costs spike.",
    bullets: ["Price escalation clauses for every bid", "Material pre-purchasing strategy", "AI cost tracking tools (free)"],
    cta: "Get It for $1.99 →",
    url: "https://vantaai3.gumroad.com/l/marginplaybook26",
    tag: "Best Value",
  },
  {
    badge: "$9",
    badgeGreen: false,
    icon: "🦺",
    title: "The Labor Shortage Survival Guide for Concrete Contractors",
    description: "The industry is short 349,000 workers in 2026. You can't hire your way out — but you can systematize your way through it with AI.",
    bullets: ["7 AI systems to run lean", "Lead auto-response & estimating automation", "Crew scheduling, invoicing & review systems"],
    cta: "Get It for $9 →",
    url: "https://vantaai3.gumroad.com/l/pdcsgr",
    tag: "New Release",
  },
  {
    badge: "$9",
    badgeGreen: false,
    icon: "🏗️",
    title: "The Data Center Concrete Playbook",
    description: "Data centers are being built at record pace. Learn exactly how to position your concrete business to land data center work — the fastest-growing construction segment in 2026.",
    bullets: ["How to find data center projects near you", "Bid strategy for large commercial pours", "Key contacts & procurement process"],
    cta: "Get It for $9 →",
    url: "https://vantaai3.gumroad.com/l/datacenter26",
    tag: "Hot Market",
  },
];

// ── OpenClaw Skills ──────────────────────────────────────────────────────────
// To add a new skill: append one object to this array and redeploy. That's it.
const SKILLS = [
  {
    icon: "📋",
    title: "OpenClaw Quick-Start Checklist",
    tag: "Email Capture",
    tagColor: "blue",
    description: "Top-of-funnel — every download = an email contact. The fastest way to start building your list inside OpenClaw.",
    price: "FREE",
    priceGreen: true,
    url: "https://tauschus.gumroad.com/l/dwbmym",
  },
  {
    icon: "🚀",
    title: "Twitter Autopilot for OpenClaw",
    tag: "No Ban Risk",
    tagColor: "purple",
    description: "API-based Twitter automation — 30+ days live, zero failures. Rotates a content library, posts on schedule, tracks state across restarts.",
    price: "$9",
    priceGreen: false,
    url: "https://tauschus.gumroad.com/l/Twitterautopilot",
  },
  {
    icon: "⏰",
    title: "Cron Starter Kit",
    tag: "Background Tasks",
    tagColor: "teal",
    description: "4-file pattern + 3 real production examples. Drop-in cron jobs for OpenClaw — heartbeats, market scans, overnight builders.",
    price: "$9",
    priceGreen: false,
    url: "https://tauschus.gumroad.com/l/yqvhl",
  },
  {
    icon: "⚙️",
    title: "Small Business Ops Bundle",
    tag: "7 Files",
    tagColor: "orange",
    description: "Full production workspace in 5 minutes — battle-tested. SOUL, HEARTBEAT, MEMORY, TOOLS, AGENTS, SECURITY, and FINANCE all pre-wired.",
    price: "$19",
    priceGreen: false,
    url: "https://tauschus.gumroad.com/l/gikcus",
  },
];

const TAG_COLORS: Record<string, string> = {
  blue:   "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  purple: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  teal:   "bg-teal-500/20 text-teal-300 border border-teal-500/30",
  orange: "bg-orange-400/20 text-orange-300 border border-orange-400/30",
};

const BENEFITS = [
  { icon: "⚡", title: "Instant Download", body: "No waiting, no shipping. Every product is delivered the moment you check out." },
  { icon: "🎯", title: "Built for Trades", body: "Not generic AI content. Every guide is built specifically for concrete contractors and trades businesses." },
  { icon: "🔧", title: "Actionable Systems", body: "Step-by-step workflows with real prompts you can copy and use today. No fluff." },
  { icon: "📈", title: "Real ROI", body: "From cutting 3 hours off your estimating to automating follow-up — these tools pay for themselves fast." },
];

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("formType", "email_signup");
      await fetch("/api/intake", { method: "POST", body: formData });
    } catch (_) {
      // fail silently
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-3xl border border-orange-400/30 bg-slate-900/80 p-10 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">Stay Ahead</p>
        <h2 className="mb-4 text-3xl font-black text-white">Get New Playbooks Before Anyone Else</h2>
        <p className="mx-auto mb-8 max-w-xl text-slate-400">
          Drop your email and we&apos;ll let you know when new AI tools and guides drop. No spam. Unsubscribe anytime.
        </p>
        {submitted ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-400/20 px-6 py-3 text-sm font-bold text-orange-300">
            ✓ You&apos;re in! We&apos;ll be in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-400 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-orange-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-orange-300 disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? "Sending…" : "Notify Me →"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400 text-sm font-black text-slate-950">V</div>
            <span className="font-bold tracking-wide text-white">Tauschus AI</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#products" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">Products</a>
            <a href="#skills" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">Skills</a>
            <a href="#about" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">About</a>
            <a href="/ai-chief-of-staff" className="hidden text-sm font-semibold text-orange-400 transition hover:text-orange-300 sm:block">For Contractors</a>
            <a href="https://tauschus.gumroad.com/l/vbfat" target="_blank" rel="noreferrer"
              className="rounded-full bg-orange-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-orange-300">
              Free Playbook →
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center lg:py-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-xs font-bold text-orange-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
          AI Tools Built for the Trades
        </div>
        <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
          Work Smarter.<br />
          <span className="text-orange-400">Win More Jobs.</span><br />
          Protect Your Margins.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Practical AI playbooks and systems built specifically for concrete contractors and trades businesses. Download instantly. Start using today.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#products"
            className="rounded-full bg-orange-400 px-8 py-4 text-base font-bold text-slate-950 shadow-xl shadow-orange-500/20 transition hover:bg-orange-300">
            Browse Products
          </a>
          <a href="https://tauschus.gumroad.com/l/vbfat" target="_blank" rel="noreferrer"
            className="rounded-full border border-slate-600 px-8 py-4 text-base font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white">
            Free Playbook ↗
          </a>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          <span>✓ Instant download</span>
          <span>✓ No fluff, no filler</span>
          <span>✓ Built for real contractors</span>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">Digital Products</p>
          <h2 className="text-3xl font-black text-white">Tools That Pay for Themselves</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">Every product is built around a real problem contractors face. Actionable, specific, and ready to use today.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {PRODUCTS.map((p) => (
            <div key={p.title} className="group flex flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:border-orange-400/40">
              <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full bg-orange-400/20 px-3 py-1 text-xs font-bold text-orange-300">{p.tag}</span>
                <span className={`rounded-full px-4 py-1.5 text-sm font-black ${p.badgeGreen ? "bg-green-500 text-white" : "bg-orange-400 text-slate-950"}`}>
                  {p.badge}
                </span>
              </div>
              <div className="mb-4 text-4xl">{p.icon}</div>
              <h3 className="mb-3 text-xl font-black leading-tight text-white">{p.title}</h3>
              <p className="mb-5 flex-1 text-sm text-slate-400">{p.description}</p>
              <ul className="mb-7 space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="font-bold text-orange-400">✓</span> {b}
                  </li>
                ))}
              </ul>
              <a href={p.url} target="_blank" rel="noreferrer"
                className={`block w-full rounded-2xl py-4 text-center text-sm font-black shadow-lg transition ${p.badgeGreen ? "bg-orange-400 text-slate-950 hover:bg-orange-300" : "bg-white text-slate-950 hover:bg-slate-100"}`}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-7 text-center">
          <p className="text-sm text-slate-500">
            More products dropping regularly — follow{" "}
            <a href="https://x.com/Vanta410742" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">@Vanta69 on X</a>
            {" "}to get notified.
          </p>
        </div>
      </section>

      {/* ── OPENCLAW SKILLS ──────────────────────────────────────────────── */}
      <section id="skills" className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800/60 px-3 py-1.5 text-xs font-bold text-slate-300">
              <span className="text-base">🦾</span> OpenClaw Skills
              <span className="ml-1 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                {SKILLS.length} live
              </span>
            </div>
            <h2 className="text-3xl font-black text-white">Installable Agent Skills</h2>
            <p className="mt-2 max-w-xl text-slate-400">
              Drop-in automations for OpenClaw operators. Battle-tested in production — Twitter, cron jobs, ops systems. Install in minutes, not days.
            </p>
          </div>
          <a
            href="https://tauschus.gumroad.com"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-orange-400 hover:text-orange-300"
          >
            All Skills on Gumroad ↗
          </a>
        </div>

        {/* Skills grid — data-driven: add to SKILLS array above to add a card */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {SKILLS.map((s) => (
            <a
              key={s.title}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-all duration-200 hover:border-slate-600 hover:bg-slate-900"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-2xl">
                {s.icon}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-orange-300 transition-colors">
                    {s.title}
                  </h3>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${s.priceGreen ? "bg-green-500 text-white" : "bg-orange-400 text-slate-950"}`}>
                    {s.price}
                  </span>
                </div>
                <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TAG_COLORS[s.tagColor] ?? TAG_COLORS.orange}`}>
                  {s.tag}
                </span>
                <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            </a>
          ))}
        </div>

        {/* "More coming" footer */}
        <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-5 text-center">
          <p className="text-sm text-slate-500">
            New skills added frequently —{" "}
            <a href="https://x.com/Vanta410742" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">
              follow @Vanta69
            </a>{" "}
            or drop your email above to get notified first.
          </p>
        </div>
      </section>
      {/* ── END OPENCLAW SKILLS ──────────────────────────────────────────── */}

      {/* AI CHIEF OF STAFF SERVICE */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-orange-400/40 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/30 p-8 lg:p-12">
          {/* Decorative gradient orb */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-orange-500/10 blur-2xl" />

          <div className="relative">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/50 bg-orange-400/15 px-4 py-1.5 text-xs font-bold text-orange-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
              New Service
            </div>

            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              {/* Left: text */}
              <div>
                <h2 className="mb-4 text-3xl font-black leading-tight text-white lg:text-4xl">
                  Want This Running for<br />
                  <span className="text-orange-400">Your Business?</span>
                </h2>
                <p className="mb-8 text-slate-300 leading-relaxed">
                  We built a fully automated AI marketing system for Florida Concrete Alliance — daily social posts, lead capture, 5-minute lead response, and a live dashboard. Now we&apos;re installing it for other contractors.
                </p>

                <ul className="mb-8 space-y-3">
                  {[
                    "Live in 7 days — fully done for you",
                    "Daily Facebook + social posts on autopilot",
                    "Lead capture, follow-up & dashboard included",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-200">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-400/20 text-xs font-black text-orange-400">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mb-8 text-sm font-semibold text-orange-300">
                  Starting at $97/mo — no contracts, cancel anytime
                </p>

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <a
                    href="/ai-chief-of-staff"
                    className="rounded-2xl bg-orange-400 px-8 py-4 text-base font-black text-slate-950 shadow-xl shadow-orange-500/25 transition hover:bg-orange-300"
                  >
                    See How It Works →
                  </a>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Used by Florida Concrete Alliance · Built on real results
                </p>
              </div>

              {/* Right: feature highlights */}
              <div className="space-y-4">
                {[
                  { icon: "📲", title: "Daily Social Posts", body: "AI writes and schedules your Facebook & social content automatically — every single day." },
                  { icon: "⚡", title: "5-Minute Lead Response", body: "Every lead gets followed up within minutes, day or night. Never lose a job to slow response again." },
                  { icon: "📊", title: "Live Dashboard", body: "See your leads, posts, and performance in one place. Full visibility, zero guesswork." },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5">
                    <span className="text-2xl">{f.icon}</span>
                    <div>
                      <p className="mb-1 font-bold text-white">{f.title}</p>
                      <p className="text-sm text-slate-400">{f.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <EmailCapture />

      {/* BENEFITS */}
      <section className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">Why Tauschus AI</p>
            <h2 className="text-3xl font-black text-white">Not Another Generic AI Guide</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="mb-4 text-3xl">{b.icon}</div>
                <h3 className="mb-2 font-bold text-white">{b.title}</h3>
                <p className="text-sm text-slate-400">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-orange-400">About Tauschus AI</p>
            <h2 className="mb-4 text-3xl font-black text-white">Built by People Who Work With Contractors</h2>
            <p className="mb-4 text-slate-400">We build AI systems for small trades businesses — the kind of tools that actually get used on job sites and in truck cabs, not just in boardrooms.</p>
            <p className="mb-6 text-slate-400">Everything we publish is tested against real problems: bad estimates, slow follow-up, labor shortages, margin compression. If it does not solve a real problem, we do not publish it.</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://x.com/Vanta410742" target="_blank" rel="noreferrer"
                className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-orange-400 hover:text-orange-300">
                Follow on X ↗
              </a>
              <a href="https://vantaai3.gumroad.com" target="_blank" rel="noreferrer"
                className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-orange-400 hover:text-orange-300">
                All Products ↗
              </a>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { num: "5", label: "Products Live on Gumroad" },
              { num: "4", label: "OpenClaw Skills Available" },
              { num: "20+", label: "Tweets driving traffic daily" },
              { num: "$0", label: "Cost to get started (free playbook)" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-5 rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-4">
                <span className="min-w-16 text-2xl font-black text-orange-400">{s.num}</span>
                <span className="text-sm text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-orange-400">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="mb-4 text-3xl font-black text-slate-950 lg:text-4xl">Start With the Free Playbook</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-slate-800">The most downloaded resource for concrete contractors learning to bid smarter with AI. Zero cost, instant access.</p>
          <a href="https://vantaai3.gumroad.com/l/AIplaybook1" target="_blank" rel="noreferrer"
            className="inline-block rounded-full bg-slate-950 px-10 py-4 text-base font-black text-white shadow-2xl transition hover:bg-slate-800">
            Download Free Now ↗
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-10">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400 text-sm font-black text-slate-950">V</div>
            <div>
              <p className="text-sm font-bold text-white">Tauschus AI</p>
              <p className="text-xs text-slate-500">Digital products for the trades</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <a href="https://vantaai3.gumroad.com/l/AIplaybook1" target="_blank" rel="noreferrer" className="transition hover:text-orange-400">Free Playbook</a>
            <a href="#skills" className="transition hover:text-orange-400">OpenClaw Skills</a>
            <a href="https://vantaai3.gumroad.com/l/pdcsgr" target="_blank" rel="noreferrer" className="transition hover:text-orange-400">Labor Guide ($9)</a>
            <a href="https://x.com/Vanta410742" target="_blank" rel="noreferrer" className="transition hover:text-orange-400">X / Twitter</a>
            <a href="https://vantaai3.gumroad.com" target="_blank" rel="noreferrer" className="transition hover:text-orange-400">All Products</a>
          </div>
          <p className="w-full text-center text-xs text-slate-600 lg:w-auto lg:text-right">© 2026 Tauschus AI. Built for real contractors.</p>
        </div>
      </footer>

    </main>
  );
}
