const stats = [
  { label: "Avg response time", value: "2 min" },
  { label: "Jacksonville leads processed", value: "480+" },
  { label: "Automations deployed", value: "120" },
];

const services = [
  {
    title: "Lead Funnel Kit",
    description:
      "Done-for-you landing page, intake form, and follow-up automations that turn cold clicks into booked estimates.",
    bullets: ["Carrd / Vercel ready", "SMS + email follow-ups", "Notion pipeline"],
  },
  {
    title: "AI Deal Desk",
    description:
      "24/7 intake concierge that qualifies homeowners, estimates square footage, and books calendar slots while crews pour concrete.",
    bullets: ["Voice + chat", "CRM sync", "Contract-ready briefs"],
  },
];

const steps = [
  {
    number: "01",
    title: "Blueprint Call",
    body: "Drop your priorities (service calls, facility contracts, compliance) and we map workflows in under 30 minutes.",
  },
  {
    number: "02",
    title: "Build + Automate",
    body: "We deploy the landing pages, intake forms, reminders, and dashboards—fully white-labeled for your trade.",
  },
  {
    number: "03",
    title: "Scale + Report",
    body: "Daily deal desk summaries, live dashboards, and refinement loops keep revenue compounding across every crew.",
  },
];

export default function Home({ searchParams }: { searchParams: { submitted?: string } }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 lg:py-20">
        {searchParams?.submitted === "1" && (
          <div className="rounded-2xl border border-green-500/40 bg-green-500/10 p-5 text-sm text-green-200">
            <p className="text-base font-semibold text-green-100">Thank you!
            </p>
            <p className="mt-1">Form received. We’ll respond via SMS/email right away with next steps.
            </p>
          </div>
        )}
        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="text-sm uppercase tracking-[0.4em] text-orange-300">
              Tauschus · AI Operator Studio
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Deal desks, compliance, and lead funnels for trades across Northeast Florida.
            </h1>
            <p className="text-lg text-slate-300">
              We engineer autonomous systems that capture every homeowner lead,
              qualify commercial or facilities inquiries, and surface the next job before
              your crew even rolls up.
            </p>
            {/* ── FREE PLAYBOOK BANNER ── */}
            <a
              href="https://vantaai3.gumroad.com/l/AIplaybook1"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-orange-400/40 bg-orange-400/10 p-4 transition hover:bg-orange-400/20"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-400 text-2xl shadow-lg shadow-orange-500/30">
                📘
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-300">Free Download</p>
                <p className="text-sm font-semibold text-white">The Concrete Contractor's AI Estimating Playbook 2026</p>
                <p className="text-xs text-slate-400">5 AI tools · 6-step workflow · Ready-to-use prompts</p>
              </div>
              <span className="shrink-0 rounded-full bg-orange-400 px-4 py-2 text-xs font-bold text-slate-950 shadow transition group-hover:bg-orange-300">
                Get It Free →
              </span>
            </a>

            {/* ── PAID GUIDE BANNER ── */}
            <a
              href="https://vantaai3.gumroad.com/l/pdcsgr"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-slate-600/60 bg-slate-800/60 p-4 transition hover:border-orange-400/40 hover:bg-slate-800"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-2xl shadow-lg">
                🦺
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">$9 Guide</p>
                <p className="text-sm font-semibold text-white">The Labor Shortage Survival Guide for Concrete Contractors</p>
                <p className="text-xs text-slate-500">7 AI systems · Run lean · Win more jobs in 2026</p>
              </div>
              <span className="shrink-0 rounded-full border border-slate-500 px-4 py-2 text-xs font-bold text-slate-300 shadow transition group-hover:border-orange-400 group-hover:text-orange-300">
                Get It $9 →
              </span>
            </a>

            <div className="flex flex-wrap gap-4">
              <a
                href="#blueprint-form"
                className="rounded-full bg-orange-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/30 transition hover:bg-orange-300"
              >
                Start Blueprint Intake
              </a>
              <a
                href="https://buy.stripe.com/fZueVd1qj5oTciEcIq8k80c"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-400"
              >
                Concrete AI Ops Blueprint
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl shadow-black/50">
            <div
              id="intake-form"
              className="rounded-2xl bg-slate-950/70 p-6"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Service Request Intake
              </p>
              <form
                action="/api/intake"
                method="POST"
                className="mt-6 space-y-4"
              >
                <input type="hidden" name="formType" value="homeowner" />
                <label className="block text-sm text-slate-300">
                  Full Name
                  <input
                    name="name"
                    type="text"
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none"
                    placeholder="Jordan Matthews"
                    required
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Phone
                  <input
                    name="phone"
                    type="tel"
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none"
                    placeholder="904-555-1020"
                    required
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Email
                  <input
                    name="email"
                    type="email"
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none"
                    placeholder="you@email.com"
                    required
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Project Address
                  <input
                    name="address"
                    type="text"
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none"
                    placeholder="1234 Atlantic Blvd, Jacksonville"
                    required
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Surface Dimensions
                  <input
                    name="dimensions"
                    type="text"
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none"
                    placeholder="e.g. 200 ft electrical trench"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Timeline & Notes
                  <textarea
                    name="timeline"
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none"
                    rows={3}
                    placeholder="Need panel upgrade before June. Existing service failing."
                  />
                </label>
                <button className="mt-4 w-full rounded-xl bg-orange-400 py-3 font-semibold text-slate-950 shadow-lg shadow-orange-500/30">
                  Get My Quote
                </button>
                <p className="text-xs text-slate-500">
                  We’ll confirm within 2 minutes during business hours. SMS + email notifications enabled.
                </p>
              </form>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-300">
              <p className="font-semibold text-white">Pipeline Snapshot</p>
              <ul className="mt-3 space-y-2 text-slate-400">
                <li>Lead → Qualified → Quote → Crew Scheduled/Dispatched</li>
                <li>Automated SMS &amp; inbox monitoring</li>
                <li>Shareable dashboards for HOAs, property managers, and GC partners</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="blueprint-form" className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-orange-300">Automatic onboarding</p>
              <h2 className="text-3xl font-semibold text-white">Blueprint intake runs without meetings.</h2>
              <p className="text-slate-300">Drop the basics and our ops stack spins up the right workflow—homeowner drip, commercial/industrial proposal, or compliance kit for property managers.</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Instant confirmation + Slack/SMS alerts</li>
                <li>• Auto-created Notion board with next steps</li>
                <li>• Calendar slot suggestions if a call is needed</li>
              </ul>
            </div>
            <form action="/api/intake" method="POST" className="space-y-4">
              <input type="hidden" name="formType" value="blueprint" />
              <label className="block text-sm text-slate-300">
                Company / Crew Name
                <input name="company" type="text" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none" placeholder="Your trade company" required />
              </label>
              <label className="block text-sm text-slate-300">
                Contact Email
                <input name="contactEmail" type="email" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none" placeholder="ops@yourcompany.com" required />
              </label>
              <label className="block text-sm text-slate-300">
                Primary Focus
                <select name="focus" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-base text-white focus:border-orange-400 focus:outline-none">
                  <option>Residential jobs / service calls</option>
                  <option>Commercial / HOA / facility work</option>
                  <option>Both residential + commercial / industrial</option>
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                Target Start
                <input name="targetStart" type="text" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none" placeholder="Need live within 14 days" />
              </label>
              <label className="block text-sm text-slate-300">
                Notes
                <textarea name="notes" rows={3} className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-base text-white placeholder-slate-500 focus:border-orange-400 focus:outline-none" placeholder="Drop current pain points, tools, budget, etc."></textarea>
              </label>
              <button className="w-full rounded-xl bg-orange-400 py-3 font-semibold text-slate-950 shadow-lg shadow-orange-500/30">Spin Up My Deal Desk</button>
            </form>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Systems we deploy</h2>
            <span className="text-sm text-slate-400">Built once, cloned for each market</span>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                {service.title === "Lead Funnel Kit" && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
                      <p className="mt-3 text-sm text-slate-300">{service.description}</p>
                      <ul className="mt-4 space-y-2 text-sm text-slate-400">
                        {service.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2">
                            <span className="text-orange-300">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-inner shadow-black/20">
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">One-time setup</p>
                      <p className="mt-2 text-3xl font-semibold text-white">$99.99 Limited Offer</p>
                      <p className="mt-1 text-sm text-slate-400">Limited-time launch price. Delivered with full onboarding assets.</p>
                      <a
                        href="https://buy.stripe.com/14AaEX6KD7x1fuQeQy8k809"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-orange-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/30 transition hover:bg-orange-300"
                      >
                        Buy Lead Funnel Kit
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>



        <section id="offers" className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.4em] text-orange-300">AI Deal Desk</p>
              <h2 className="text-3xl font-semibold text-white">24/7 intake concierge + briefing packs.</h2>
              <p className="text-slate-300">
                We wire up voice/chat bots that capture leads, estimate footage, and drop contract-ready briefs in Notion and Slack so crews only say “yes/no.”
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• Voice + chat capture with CRM sync</li>
                <li>• Auto-generated scope + quote briefs</li>
                <li>• Calendar + SMS coordination</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-inner shadow-black/20">
              <p className="text-sm text-slate-400">One-time setup</p>
              <p className="mt-2 text-3xl font-semibold text-white">$199 Limited Offer</p>
              <p className="mt-1 text-sm text-slate-400">Includes bot prompts, integrations, and a live test call.</p>
              <a
                href="https://buy.stripe.com/4gMcN50mf4kPbeA8sa8k80b"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-orange-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/30 transition hover:bg-orange-300"
              >
                Buy AI Deal Desk Setup
              </a>
              <p className="mt-3 text-xs text-slate-500">Add-on automations (Zendesk, ServiceTitan, etc.) quoted after install.</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-orange-300">Blueprint drop</p>
              <h2 className="text-3xl font-semibold text-white">Concrete AI Ops Blueprint</h2>
              <p className="mt-3 text-slate-300">
                A 10-section guide that breaks down the exact workflow we run for contractors: audits, funnel launch, compliance autopilot, OpenClaw agent setup, AI deal desk, and the weekly ops rhythm that keeps crews booked.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li>• Step-by-step automation sprint</li>
                <li>• Compliance board template + reminders</li>
                <li>• AI desk scripts and escalation flows</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <p className="text-sm text-slate-400">Instant download ($3.99)</p>
              <p className="mt-2 text-lg text-white">Get the PDF + delivery email immediately after checkout.</p>
              <a
                href="https://buy.stripe.com/fZueVd1qj5oTciEcIq8k80c"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-orange-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/30 transition hover:bg-orange-300"
              >
                Buy Concrete AI Ops Blueprint
              </a>
              <p className="mt-2 text-xs text-slate-500">Includes lifetime PDF updates (we refresh it whenever we ship new playbooks).</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.4em] text-orange-300">Compliance Guard Express</p>
              <h2 className="text-3xl font-semibold text-white">Same-day license + insurance packets.</h2>
              <p className="text-slate-300">
                Drop your license numbers, insurance certificates, and safety docs. We build a shareable dashboard, renewal reminders,
                and a PDF packet you can send to HOAs, general contractors, and inspectors—delivered within hours.
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>• License + insurance tracker in Notion</li>
                <li>• Automated renewal email/SMS reminders</li>
                <li>• Ready-to-send compliance packet (PDF)</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-inner shadow-black/20">
              <p className="text-sm text-slate-400">One-time setup</p>
              <p className="mt-2 text-3xl font-semibold text-white">$29.99 Limited Offer</p>
              <p className="mt-1 text-sm text-slate-400">Limited-time launch price. Delivered same-day, Monday–Saturday.</p>
              <a
                href="https://buy.stripe.com/6oU5kD1qjdVp3M8aAi8k80a"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-orange-400 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/30 transition hover:bg-orange-300"
              >
                Buy Compliance Guard Express
              </a>
              <p className="mt-3 text-xs text-slate-500">Need ongoing monitoring? Mention it in the notes and we’ll upgrade you to the annual plan.</p>
            </div>
          </div>
        </section>
        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          <div className="space-y-6">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold text-white">Jacksonville crews, zero missed opportunities</h2>
                <p className="mt-3 text-slate-300">
                  We act like your chief of staff: every homeowner or HOA ping is captured, the offer goes out automatically, and you wake up with booked work instead of unanswered DMs.
                </p>
              </div>
              <div className="mt-4 rounded-2xl border border-orange-400/40 bg-orange-400/10 p-5 text-orange-100 lg:mt-0 lg:w-80">
                <p className="text-sm uppercase tracking-[0.3em]">Fast action bonus</p>
                <p className="mt-2 text-2xl font-semibold text-white">Buy 2 kits → get AI Deal Desk at $149</p>
                <p className="mt-1 text-sm">Ping us “BUNDLE” after purchase and we’ll send the discounted link.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                <p className="text-sm text-orange-300">01</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Blueprint Call</h3>
                <p className="mt-2 text-sm text-slate-300">Drop your driveways, HOAs, compliance pain. We map workflows in &lt;30 minutes.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                <p className="text-sm text-orange-300">02</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Launch in 24 hrs</h3>
                <p className="mt-2 text-sm text-slate-300">Landing page, intake forms, reminders, dashboards—fully white-labeled and live.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                <p className="text-sm text-orange-300">03</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Scale + Report</h3>
                <p className="mt-2 text-sm text-slate-300">Daily AI desk summaries, live dashboards, and refinement loops keep revenue compounding.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
