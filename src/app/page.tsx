import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vanta AI — Digital Products for Trades & Builders",
  description: "AI playbooks, systems guides, and tools built specifically for concrete contractors and trades businesses. Download instantly.",
};

const PRODUCTS = [
  {
    badge: "FREE",
    badgeColor: "bg-green-500 text-white",
    icon: "📘",
    title: "The Concrete Contractor's AI Estimating Playbook 2026",
    description: "Stop losing bids to bad numbers. The exact AI tools, prompts, and workflow used to estimate faster, win more jobs, and protect your margins.",
    bullets: ["5 AI tools reviewed", "6-step estimating workflow", "7+ ready-to-use ChatGPT prompts"],
    cta: "Download Free",
    ctaStyle: "bg-orange-400 hover:bg-orange-300 text-slate-950",
    url: "https://vantaai3.gumroad.com/l/AIplaybook1",
    tag: "Most Downloaded",
    tagColor: "bg-orange-400/20 text-orange-300",
  },
  {
    badge: "$9",
    badgeColor: "bg-orange-400 text-slate-950",
    icon: "🦺",
    title: "The Labor Shortage Survival Guide for Concrete Contractors",
    description: "The industry is short 349,000 workers in 2026. You can't hire your way out — but you can systematize your way through it.",
    bullets: ["7 AI systems to run lean", "Lead auto-response & estimating", "Crew scheduling, invoicing & reviews"],
    cta: "Get It for $9",
    ctaStyle: "bg-white hover:bg-slate-100 text-slate-950",
    url: "https://vantaai3.gumroad.com/l/pdcsgr",
    tag: "New Release",
    tagColor: "bg-blue-400/20 text-blue-300",
  },
];

const BENEFITS = [
  { icon: "⚡", title: "Instant Download", body: "No waiting, no shipping. Every product is delivered the moment you check out." },
  { icon: "🎯", title: "Built for Trades", body: "Not generic AI content. Every guide is built specifically for concrete contractors and trades businesses." },
  { icon: "🔧", title: "Actionable Systems", body: "Step-by-step workflows with real prompts you can copy and use today. No fluff." },
  { icon: "📈", title: "Real ROI", body: "From cutting 3 hours off your estimating to automating follow-up — these tools pay for themselves fast." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">

      {/* ── NAV ── */}
      <nav className="border-b border-slate-800/60 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400 text-sm font-black text-slate-950">V</div>
            <span className="font-bold text-white tracking-wide">Vanta AI</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#products" className="hidden sm:block text-sm text-slate-400 hover:text-white transition">Products</a>
            <a href="#about" className="hidden sm:block text-sm text-slate-400 hover:text-white transition">About</a>
            <a href="https://vantaai3.gumroad.com/l/AIplaybook1" target="_blank" rel="noreferrer"
              className="rounded-full bg-orange-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-orange-300 transition">
              Free Playbook →
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-xs font-bold text-orange-300 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            AI Tools Built for the Trades
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl mx-auto">
            Work Smarter.<br />
            <span className="text-orange-400">Win More Jobs.</span><br />
            Protect Your Margins.
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Practical AI playbooks and systems built specifically for concrete contractors and trades businesses. Download instantly. Start using today.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#products"
              className="rounded-full bg-orange-400 px-8 py-4 text-base font-bold text-slate-950 shadow-xl shadow-orange-500/20 hover:bg-orange-300 transition">
              Browse Products
            </a>
            <a href="https://vantaai3.gumroad.com/l/AIplaybook1" target="_blank" rel="noreferrer"
              className="rounded-full border border-slate-600 px-8 py-4 text-base font-semibold text-slate-300 hover:border-slate-400 hover:text-white transition">
              Free Playbook ↗
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
            <span>✓ Instant download</span>
            <span>✓ No fluff, no filler</span>
            <span>✓ Built for real contractors</span>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-3">Digital Products</p>
          <h2 className="text-3xl font-black text-white">Tools That Pay for Themselves</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">Every product is built around a real problem contractors face. Actionable, specific, and ready to use today.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {PRODUCTS.map((p) => (
            <div key={p.title} className="group relative flex flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-7 hover:border-orange-400/40 transition-all duration-300">
              {/* Tag */}
              <div className="flex items-center justify-between mb-5">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.tagColor}`}>{p.tag}</span>
                <span className={`rounded-full px-4 py-1.5 text-sm font-black ${p.badgeColor}`}>{p.badge}</span>
              </div>
              {/* Icon + Title */}
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3 className="text-xl font-black text-white leading-tight mb-3">{p.title}</h3>
              <p className="text-sm text-slate-400 mb-5 flex-1">{p.description}</p>
              {/* Bullets */}
              <ul className="space-y-2 mb-7">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-orange-400 font-bold">✓</span> {b}
                  </li>
                ))}
              </ul>
              {/* CTA */}
              <a href={p.url} target="_blank" rel="noreferrer"
                className={`block w-full rounded-2xl py-4 text-center text-sm font-black transition shadow-lg ${p.ctaStyle}`}>
                {p.cta} ↗
              </a>
            </div>
          ))}
        </div>
        {/* More coming */}
        <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-7 text-center">
          <p className="text-slate-500 text-sm">More products dropping regularly — follow <a href="https://x.com/Vanta410742" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">@Vanta69 on X</a> to get notified.</p>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="bg-slate-900/40 border-y border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-3">Why Vanta AI</p>
            <h2 className="text-3xl font-black text-white">Not Another Generic AI Guide</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="text-3xl mb-4">{b.icon}</div>
                <h3 className="font-bold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-slate-400">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 lg:p-12 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-4">About Vanta AI</p>
            <h2 className="text-3xl font-black text-white mb-4">Built by People Who Work With Contractors</h2>
            <p className="text-slate-400 mb-4">We build AI systems for small trades businesses — the kind of tools that actually get used on job sites and in truck cabs, not just in boardrooms.</p>
            <p className="text-slate-400 mb-6">Everything we publish is tested against real problems: bad estimates, slow follow-up, labor shortages, margin compression. If it doesn't solve a real problem, we don't publish it.</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://x.com/Vanta410742" target="_blank" rel="noreferrer"
                className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:border-orange-400 hover:text-orange-300 transition">
                Follow on X ↗
              </a>
              <a href="https://vantaai3.gumroad.com" target="_blank" rel="noreferrer"
                className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:border-orange-400 hover:text-orange-300 transition">
                All Products ↗
              </a>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { num: "2", label: "Products Live" },
              { num: "12+", label: "Tweets driving traffic" },
              { num: "349K", label: "Workers short — the problem we're solving" },
              { num: "$0", label: "Cost to get started (free playbook)" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-5 rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-4">
                <span className="text-2xl font-black text-orange-400 min-w-16">{s.num}</span>
                <span className="text-sm text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-orange-400">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-950 mb-4">Start With the Free Playbook</h2>
          <p className="text-slate-800 text-lg mb-8 max-w-xl mx-auto">The most downloaded resource for concrete contractors learning to bid smarter with AI. Zero cost, instant access.</p>
          <a href="https://vantaai3.gumroad.com/l/AIplaybook1" target="_blank" rel="noreferrer"
            className="inline-block rounded-full bg-slate-950 px-10 py-4 text-base font-black text-white hover:bg-slate-800 transition shadow-2xl">
            Download Free Now ↗
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400 text-sm font-black text-slate-950">V</div>
            <div>
              <p className="font-bold text-white text-sm">Vanta AI</p>
              <p className="text-xs text-slate-500">Digital products for the trades</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <a href="https://vantaai3.gumroad.com/l/AIplaybook1" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">Free Playbook</a>
            <a href="https://vantaai3.gumroad.com/l/pdcsgr" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">Labor Guide ($9)</a>
            <a href="https://x.com/Vanta410742" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">X / Twitter</a>
            <a href="https://vantaai3.gumroad.com" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition">All Products</a>
          </div>
          <p className="text-xs text-slate-600 w-full lg:w-auto text-center lg:text-right">© 2026 Vanta AI. Built for real contractors.</p>
        </div>
      </footer>

    </main>
  );
}
