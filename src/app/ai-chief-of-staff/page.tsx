"use client";

import { useState } from "react";

const FEATURES = [
  {
    icon: "📱",
    title: "Daily Social Autopilot",
    body: "Facebook + Twitter posts every day, written by AI, promoting your business automatically.",
  },
  {
    icon: "📧",
    title: "Lead Capture System",
    body: "Email opt-in on your website captures every visitor who doesn't call.",
  },
  {
    icon: "⚡",
    title: "5-Minute Lead Response",
    body: "Auto-reply to new Marketplace, Facebook, and Google leads instantly.",
  },
  {
    icon: "📊",
    title: "Mission Control Dashboard",
    body: "See all your leads, posts, and activity in one place, updated daily.",
  },
  {
    icon: "🌙",
    title: "Overnight Content Engine",
    body: "Fresh marketing content and digital products built while you sleep.",
  },
  {
    icon: "📈",
    title: "Monthly Strategy Call",
    body: "30-min monthly call to review results and sharpen the system.",
  },
];

const STEPS = [
  {
    icon: "⚙️",
    title: "Onboarding Call",
    body: "We learn your business, service area, and goals. 30 minutes.",
  },
  {
    icon: "🏗️",
    title: "We Build Your Stack",
    body: "Lead capture, social autopilot, follow-up sequences, dashboard. Done in 7 days.",
  },
  {
    icon: "🤖",
    title: "AI Goes Live",
    body: "Your system starts posting, capturing leads, and following up automatically.",
  },
  {
    icon: "📈",
    title: "You Get Results",
    body: "Daily activity reports. You see every lead, post, and action in your dashboard.",
  },
];

const PAIN_POINTS = [
  {
    icon: "🐌",
    title: "Slow follow-up",
    body: "67% of leads go with the first contractor who responds. If you're not replying in 5 minutes, you're losing jobs.",
  },
  {
    icon: "📱",
    title: "No consistent presence",
    body: "Contractors who post consistently on Facebook and Google get 3x more inbound leads. Most never post at all.",
  },
  {
    icon: "📋",
    title: "Manual everything",
    body: "You're writing quotes, chasing leads, posting content, and running jobs. Something always gets dropped.",
  },
];

const FAQS = [
  {
    q: "How long does setup take?",
    a: "Your system is live within 7 days of onboarding. Most clients see their first automated posts within 48 hours.",
  },
  {
    q: "Do I need to be tech-savvy?",
    a: "No. We handle 100% of the setup. You just answer a few questions about your business and we do the rest.",
  },
  {
    q: "What kind of contractors is this built for?",
    a: "Any trade business — concrete, roofing, landscaping, plumbing, HVAC, painting. If you do on-site service work, this system works for you.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees. We earn your business every month.",
  },
  {
    q: "What makes this different from hiring a marketing agency?",
    a: "Agencies charge $2,000–$5,000/mo and take months to produce results. We use AI to deliver the same output at a fraction of the cost — and it's running 24/7, not just during business hours.",
  },
  {
    q: "Is this really automated or do I have to manage it?",
    a: "Fully automated. The system posts, responds, captures leads, and reports back to you daily. Your only job is closing the leads that come in.",
  },
];

export default function AIChiefOfStaff() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-400 text-sm font-black text-slate-950">V</div>
            <span className="font-bold tracking-wide text-white">Tauschus AI</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/#products" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">Products</a>
            <a href="/#about" className="hidden text-sm text-slate-400 transition hover:text-white sm:block">About</a>
            <a href="/ai-chief-of-staff" className="hidden text-sm font-semibold text-orange-400 transition hover:text-orange-300 sm:block">For Contractors</a>
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
          Now Accepting Clients — Limited Spots
        </div>
        <h1 className="mx-auto max-w-4xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
          Your AI Chief of Staff.<br />
          <span className="text-orange-400">Built for Contractors.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          We install a done-for-you AI system that handles your leads, social media, follow-ups, and content — 24/7. You focus on the work. The system handles the rest.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#pricing"
            className="rounded-full bg-orange-400 px-8 py-4 text-base font-bold text-slate-950 shadow-xl shadow-orange-500/20 transition hover:bg-orange-300">
            Get My System →
          </a>
          <a href="#how-it-works"
            className="rounded-full border border-slate-600 px-8 py-4 text-base font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white">
            See How It Works ↓
          </a>
        </div>
        <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2.5 text-sm text-slate-400">
          <span className="font-bold text-orange-400">✓</span>
          Powering Florida Concrete Alliance — 0 to daily automated leads in 30 days
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">The Problem</p>
            <h2 className="text-3xl font-black text-white">You&apos;re Losing Jobs You Never Knew You Had</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {PAIN_POINTS.map((p) => (
              <div key={p.title} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
                <div className="mb-4 text-4xl">{p.icon}</div>
                <h3 className="mb-2 text-lg font-black text-white">{p.title}</h3>
                <p className="text-sm text-slate-400">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">The Process</p>
          <h2 className="text-3xl font-black text-white">We Build Your System. Then It Runs Itself.</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
              <div className="mb-2 text-xs font-bold text-orange-400/60">STEP {i + 1}</div>
              <div className="mb-4 text-4xl">{step.icon}</div>
              <h3 className="mb-2 text-lg font-black text-white">{step.title}</h3>
              <p className="text-sm text-slate-400">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section id="included" className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">What You Get</p>
            <h2 className="text-3xl font-black text-white">Everything You Need. Nothing You Don&apos;t.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7">
                <div className="mb-4 text-4xl">{f.icon}</div>
                <h3 className="mb-2 text-lg font-black text-white">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">Proof</p>
          <h2 className="text-3xl font-black text-white">Built on a Real Business. Proven on FCA.</h2>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 lg:p-12" style={{ borderLeft: "4px solid #fb923c" }}>
          <p className="mb-8 text-lg leading-relaxed text-slate-300">
            &ldquo;Florida Concrete Alliance went from zero online presence to a fully automated marketing system in under 30 days — daily Facebook posts, Twitter content, Google Business Profile live, email capture running, and a 24/7 lead response system. This is the exact system we install for every client.&rdquo;
          </p>
          <div className="flex flex-wrap gap-3">
            {["30 days to live", "5 automations running", "24/7 lead response", "Zero manual posting"].map((stat) => (
              <span key={stat} className="rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm font-bold text-orange-300">
                ✓ {stat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-4 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">Pricing</p>
            <h2 className="text-3xl font-black text-white">Simple, Transparent Pricing</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">No contracts. Cancel anytime. Results or your money back.</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">

            {/* Starter */}
            <div className="flex flex-col rounded-3xl border border-slate-700 bg-slate-900/60 p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-orange-400/20 px-3 py-1 text-xs font-bold text-orange-300">Most Popular</span>
                <span className="rounded-full bg-orange-400 px-4 py-1.5 text-sm font-black text-slate-950">$97/mo</span>
              </div>
              <h3 className="mb-1 text-2xl font-black text-white">Starter</h3>
              <p className="mb-6 text-sm text-slate-400">For: Solo contractors &amp; small crews</p>
              <ul className="mb-8 flex-1 space-y-3">
                {FEATURES.map((f) => (
                  <li key={f.title} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 font-bold text-orange-400">✓</span>
                    <span><span className="font-semibold">{f.title}</span> — {f.body}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:therealvantaai@gmail.com?subject=AI Chief of Staff - Starter"
                className="block w-full rounded-2xl bg-orange-400 py-4 text-center text-sm font-black text-slate-950 shadow-lg transition hover:bg-orange-300"
              >
                Get Started →
              </a>
            </div>

            {/* Pro */}
            <div className="flex flex-col rounded-3xl border border-orange-400/40 bg-slate-900/60 p-8 ring-1 ring-orange-400/20">
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-orange-400/20 px-3 py-1 text-xs font-bold text-orange-300">Best Results</span>
                <span className="rounded-full bg-white px-4 py-1.5 text-sm font-black text-slate-950">$297/mo</span>
              </div>
              <h3 className="mb-1 text-2xl font-black text-white">Pro</h3>
              <p className="mb-6 text-sm text-slate-400">For: Growing contractors ready to scale</p>
              <ul className="mb-8 flex-1 space-y-3">
                {FEATURES.map((f) => (
                  <li key={f.title} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 font-bold text-orange-400">✓</span>
                    <span><span className="font-semibold">{f.title}</span> — {f.body}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-0.5 font-bold text-orange-400">✓</span>
                  <span><span className="font-semibold">Custom website</span> built &amp; hosted</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-0.5 font-bold text-orange-400">✓</span>
                  <span><span className="font-semibold">Google Ads</span> setup &amp; management</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-0.5 font-bold text-orange-400">✓</span>
                  <span><span className="font-semibold">Weekly strategy calls</span> (not monthly)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-0.5 font-bold text-orange-400">✓</span>
                  <span><span className="font-semibold">Priority support</span></span>
                </li>
              </ul>
              <a
                href="mailto:therealvantaai@gmail.com?subject=AI Chief of Staff - Pro"
                className="block w-full rounded-2xl bg-white py-4 text-center text-sm font-black text-slate-950 shadow-lg transition hover:bg-slate-100"
              >
                Apply for Pro →
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Not sure which plan?{" "}
            <a href="mailto:therealvantaai@gmail.com" className="text-orange-400 hover:underline">
              Email us at therealvantaai@gmail.com
            </a>{" "}
            and we&apos;ll figure it out together.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-orange-400">FAQ</p>
          <h2 className="text-3xl font-black text-white">Common Questions</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-bold text-white">{faq.q}</span>
                <span className="ml-4 flex-shrink-0 text-orange-400 text-xl font-bold">
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className="border-t border-slate-800 px-6 py-5">
                  <p className="text-sm text-slate-400">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-orange-400">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="mb-4 text-3xl font-black text-slate-950 lg:text-4xl">Ready to Stop Losing Leads?</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-slate-800">
            We&apos;re accepting a limited number of new clients. Spots fill fast.
          </p>
          <a href="#pricing"
            className="inline-block rounded-full bg-slate-950 px-10 py-4 text-base font-black text-white shadow-2xl transition hover:bg-slate-800">
            Get My AI System →
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
