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
    badge: "$17",
    badgeGreen: false,
    icon: "🏗️",
    title: "Data Center Concrete: The Small Contractor's Playbook",
    description: "$300B in data centers are being built right now. Small concrete contractors can access civil and site scopes — if they know how to find and bid them.",
    bullets: ["How to find data center projects near you", "Bidding strategy & pricing benchmarks", "AI tools to compete against larger GCs"],
    cta: "Get It for $17 →",
    url: "https://vantaai3.gumroad.com/l/datacenter26",
    tag: "Hot Topic",
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

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400 text-sm font-black text-slate-950">V</div>
            <span className="font-bold tracking-wide text-white">Tauschus AI</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#products" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">Products</a>
            <a href="#about" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">About</a>
            <a href="https://vantaai3.gumroad.com/l/AIplaybook1" target="_blank" rel="noreferrer"
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
          <a href="https://vantaai3.gumroad.com/l/AIplaybook1" target="_blank" rel="noreferrer"
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
        <div className="grid gap-6 lg:grid-cols-3">
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
              { num: "3", label: "Products Live on Gumroad" },
              { num: "17+", label: "Tweets driving traffic daily" },
              { num: "349K", label: "Workers short — the problem we solve" },
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
