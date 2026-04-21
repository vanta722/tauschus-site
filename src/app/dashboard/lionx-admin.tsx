"use client";
import { useState, useEffect } from "react";

// ── Live addresses (mainnet) ──
const ADDRESSES = {
  LDA_V1:    "TNP1D18nJCqQHhv4i38qiNtUUuL5VyNoC1",  // LDA token — existing v1, no migration
  TREASURY:  "TG1ZuSqJdgmD11i2FyCXxtjBbTEiEzRVQy",  // Receives all tool payments
  BLACK_HOLE:"TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy",  // Tron black hole — confirmed burned supply
}

const TOOLS = [
  { id: "WALLET_ANALYZER",  icon: "🔍", name: "Wallet Analyzer",    cost: 50,  status: "live" },
  { id: "CONTRACT_AUDITOR", icon: "🛡️", name: "Contract Auditor",   cost: 100, status: "live" },
  { id: "MARKET_INTEL",     icon: "📊", name: "Market Intelligence", cost: 25,  status: "live" },
  { id: "SECURITY_AUDITOR", icon: "🔐", name: "Security Auditor",   cost: 150, status: "building" },
]

const BURN_LOG: { date: string; amount: number; txHash: string; note: string }[] = [
  // Populate manually after each weekly burn
  // { date: "2026-04-21", amount: 0, txHash: "", note: "First weekly burn — pending" },
]

interface LiveStats {
  ldaSupply: number
  holders: number
  transfers: number
  totalBurned: number
  burnPct: number
  treasuryBalance: number
  recentPayments: { from: string; amount: number; time: string; tool: string }[]
}

const DEFAULT_STATS: LiveStats = {
  ldaSupply: 20_207_717,
  holders: 282,
  transfers: 11053,
  totalBurned: 1_050_000,
  burnPct: 5.2,
  treasuryBalance: 0,
  recentPayments: [],
}

export default function LionXAdmin() {
  const [tab,        setTab]       = useState<"overview"|"tools"|"burns"|"security"|"pending">("overview")
  const [stats,      setStats]     = useState<LiveStats>(DEFAULT_STATS)
  const [loading,    setLoading]   = useState(true)
  const [toolPrices, setToolPrices] = useState(TOOLS.map(t => ({ ...t, newCost: t.cost })))
  const [saving,     setSaving]    = useState<string | null>(null)
  const [saveResult, setSaveResult] = useState<{ id: string; msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [tokenRes, blackHoleRes, treasuryRes, paymentsRes] = await Promise.all([
          fetch(`https://apilist.tronscanapi.com/api/token_trc20?contract=${ADDRESSES.LDA_V1}`),
          fetch(`https://apilist.tronscanapi.com/api/account?address=${ADDRESSES.BLACK_HOLE}`),
          fetch(`https://lion-xai.com/api/treasury-balance`),
          fetch(`https://apilist.tronscanapi.com/api/contract/events?contract=${ADDRESSES.LDA_V1}&toAddress=${ADDRESSES.TREASURY}&limit=10`),
        ])

        const tokenData    = await tokenRes.json()
        const blackHole    = await blackHoleRes.json()
        const treasuryData = await treasuryRes.json()
        const paymentsData = await paymentsRes.json()

        const token = tokenData?.trc20_tokens?.[0]
        const ldaSupply = Number(token?.total_supply_with_decimals || 0) / 1e6 || 20_207_717
        const holders   = Number(token?.holders_count || 282)
        const transfers = Number(token?.transfer_num  || 0)

        const burnEntry = (blackHole?.trc20token_balances || []).find(
          (t: any) => t.tokenId === ADDRESSES.LDA_V1
        )
        const totalBurned = burnEntry ? Number(burnEntry.balance) / 1e6 : 1_050_000

        const treasuryBalance = Number(treasuryData?.balance || 0)

        const events = paymentsData?.data || []
        const now = Date.now()
        const recentPayments = events.slice(0, 5).map((e: any) => {
          const amount = Number(e.amount || 0) / 1e6
          const ts     = Number(e.timestamp || 0)
          const diffMin = ts ? Math.floor((now - ts) / 60000) : 0
          let tool = "Wallet Analysis"
          if (amount >= 100) tool = "Contract Audit"
          else if (amount <= 25) tool = "Market Intel"
          return {
            from:   (e.transferFromAddress || "").slice(0,6) + "..." + (e.transferFromAddress || "").slice(-4),
            amount,
            time:   diffMin < 1 ? "Just now" : diffMin < 60 ? `${diffMin}m ago` : `${Math.floor(diffMin/60)}h ago`,
            tool,
          }
        })

        setStats({ ldaSupply, holders, transfers, totalBurned, burnPct: (totalBurned / ldaSupply) * 100, treasuryBalance, recentPayments })
      } catch {}
      setLoading(false)
    }
    fetchStats()
    const t = setInterval(fetchStats, 30000)
    return () => clearInterval(t)
  }, [])

  async function updateToolPrice(toolId: string, newCost: number) {
    setSaving(toolId)
    setSaveResult(null)
    try {
      const res  = await fetch('/api/lionx-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, newCost, secret: 'Vanta2026' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSaveResult({ id: toolId, msg: `✅ ${data.message} (commit ${data.commit})`, ok: true })
      setToolPrices(p => p.map(t => t.id === toolId ? { ...t, cost: newCost, newCost } : t))
    } catch (e: any) {
      setSaveResult({ id: toolId, msg: `❌ ${e?.message}`, ok: false })
    }
    setSaving(null)
  }

  const TABS = [
    { id: "overview",  label: "Overview",  icon: "📊" },
    { id: "tools",     label: "Tools",     icon: "⚡" },
    { id: "burns",     label: "Burns",     icon: "🔥" },
    { id: "security",  label: "Security",  icon: "🛡️" },
    { id: "pending",   label: "Pending",   icon: "⏳" },
  ] as const

  return (
    <section className="rounded-2xl overflow-hidden mt-6" style={{ background: "#0a0a16", border: "1px solid rgba(20,184,166,0.25)" }}>

      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3" style={{ background: "rgba(20,184,166,0.06)", borderBottom: "1px solid rgba(20,184,166,0.15)" }}>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 24, filter: "drop-shadow(0 0 8px #f5a623)" }}>🦁</span>
          <div>
            <div className="font-black text-lg" style={{ color: "#f5a623" }}>Lion X Mission Control</div>
            <div className="text-xs" style={{ color: "#4a5a6a" }}>
              Network: <span style={{ color: "#22c55e" }}>MAINNET</span>
              {" · "}Domain: <a href="https://lion-xai.com" target="_blank" rel="noreferrer" style={{ color: "#14b8a6", textDecoration: "none" }}>lion-xai.com</a>
              {" · "}Model: <span style={{ color: "#a78bfa" }}>Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block" }}/>
            <span className="text-xs font-bold" style={{ color: "#22c55e" }}>LIVE</span>
          </div>
          <a href="https://lion-xai.com/tools" target="_blank" rel="noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-bold no-underline"
            style={{ background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.2)", color: "#14b8a6" }}>
            Open Platform →
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 pt-3 pb-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 text-xs font-bold rounded-t-lg transition-all"
            style={{ background: tab === t.id ? "rgba(20,184,166,0.12)" : "transparent", color: tab === t.id ? "#14b8a6" : "#4a5a6a", border: tab === t.id ? "1px solid rgba(20,184,166,0.2)" : "1px solid transparent", borderBottom: "none", fontFamily: "inherit", cursor: "pointer" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="p-5">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-4">

            {/* Live stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { icon:"💎", label:"LDA Supply",       val: loading ? "..." : stats.ldaSupply.toLocaleString(),        color:"#14b8a6" },
                { icon:"🔥", label:"Total Burned",     val: loading ? "..." : stats.totalBurned.toLocaleString(),      color:"#ef4444" },
                { icon:"📊", label:"Burn %",           val: loading ? "..." : stats.burnPct.toFixed(2) + "%",          color:"#f5a623" },
                { icon:"👥", label:"Holders",          val: loading ? "..." : stats.holders.toLocaleString(),          color:"#22c55e" },
                { icon:"🔄", label:"Total Transfers",  val: loading ? "..." : stats.transfers.toLocaleString(),        color:"#a78bfa" },
                { icon:"🏦", label:"Treasury Balance", val: loading ? "..." : stats.treasuryBalance.toFixed(2) + " LDA", color:"#f5a623" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-black text-lg" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-xs mt-1" style={{ color: "#4a5a6a" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Architecture overview */}
            <div className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#4a5a6a" }}>Platform Architecture</div>
              <div className="space-y-2 text-xs">
                {[
                  ["Payment model",  "Direct LDA transfer to treasury — no smart contract", "#22c55e"],
                  ["Token",          "LDA v1 (existing) — TNP1D18nJCqQHhv4i38qiNtUUuL5VyNoC1", "#14b8a6"],
                  ["Treasury",       "TG1ZuSqJdgmD11i2FyCXxtjBbTEiEzRVQy", "#14b8a6"],
                  ["Burn address",   "TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy (Tron black hole)", "#ef4444"],
                  ["Burn schedule",  "Weekly manual — 70% of treasury burned, 30% retained", "#f5a623"],
                  ["Verification",   "Server-side Tronscan event lookup — client sends address only", "#a78bfa"],
                  ["Replay protect", "Upstash KV (SET key 1 EX 1200 NX) — persistent across cold starts", "#22c55e"],
                  ["Security",       "8.5/10 — 2 audit rounds complete, all findings resolved", "#22c55e"],
                ].map(([k, v, c]) => (
                  <div key={k as string} className="flex gap-3 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="shrink-0 w-32" style={{ color: "#7a8a9a" }}>{k}</span>
                    <span style={{ color: c as string }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#4a5a6a" }}>Quick Links</div>
              <div className="flex gap-2 flex-wrap">
                {[
                  ["🌐 Platform",       "https://lion-xai.com"],
                  ["⚡ Tools",          "https://lion-xai.com/tools"],
                  ["📊 Dashboard",      "https://lion-xai.com/dashboard"],
                  ["💻 GitHub",         "https://github.com/vanta722/lionx-platform"],
                  ["🔍 Treasury",       `https://tronscan.org/#/address/${ADDRESSES.TREASURY}`],
                  ["🔥 Burn Wallet",    `https://tronscan.org/#/address/${ADDRESSES.BLACK_HOLE}`],
                  ["💎 LDA Token",      `https://tronscan.org/#/token20/${ADDRESSES.LDA_V1}`],
                ].map(([label, href]) => (
                  <a key={label as string} href={href as string} target="_blank" rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold no-underline"
                    style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)", color: "#14b8a6" }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Recent payments */}
            <div className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#4a5a6a" }}>Recent Tool Payments (Live)</div>
              {stats.recentPayments.length === 0 ? (
                <p className="text-xs text-center py-3" style={{ color: "#4a5a6a" }}>No recent payments found</p>
              ) : (
                <div className="space-y-2">
                  {stats.recentPayments.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span className="font-mono" style={{ color: "#7a8a9a" }}>{p.from}</span>
                      <span style={{ color: "#14b8a6" }}>{p.tool}</span>
                      <span style={{ color: "#f5a623" }}>{p.amount} LDA</span>
                      <span style={{ color: "#4a5a6a" }}>{p.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TOOLS ── */}
        {tab === "tools" && (
          <div className="space-y-3">
            <p className="text-xs mb-1" style={{ color: "#7a8a9a" }}>
              Edit prices below and hit <strong style={{ color: "#14b8a6" }}>Update Price</strong>. Changes commit to GitHub and Vercel auto-deploys in ~60 seconds.
            </p>

            {saveResult && (
              <div className="rounded-xl px-4 py-2.5 text-xs font-bold" style={{ background: saveResult.ok ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${saveResult.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, color: saveResult.ok ? "#22c55e" : "#ef4444" }}>
                {saveResult.msg}
              </div>
            )}

            {toolPrices.map(tool => (
              <div key={tool.id} className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap"
                style={{ background: "#0c0c18", border: `1px solid ${tool.status === "live" ? "rgba(34,197,94,0.15)" : "rgba(245,166,35,0.15)"}` }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{tool.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{tool.name}</div>
                    <div className="text-xs mt-0.5 font-mono" style={{ color: "#4a5a6a" }}>{tool.id}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#4a5a6a" }}>Current: <span style={{ color: "#f5a623" }}>{tool.cost} LDA</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {tool.status === "live" ? (
                    <>
                      <input
                        type="number"
                        value={tool.newCost}
                        min={1}
                        max={10000}
                        onChange={e => setToolPrices(p => p.map(t => t.id === tool.id ? { ...t, newCost: Number(e.target.value) } : t))}
                        className="w-24 px-3 py-2 rounded-lg text-sm text-center font-bold outline-none"
                        style={{ background: "#161628", border: "1px solid rgba(20,184,166,0.2)", color: "#14b8a6", fontFamily: "inherit" }}
                      />
                      <span className="text-xs" style={{ color: "#4a5a6a" }}>LDA</span>
                      <button
                        onClick={() => updateToolPrice(tool.id, tool.newCost)}
                        disabled={saving === tool.id || tool.newCost === tool.cost || tool.newCost < 1}
                        className="px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-40 transition-all"
                        style={{ background: "rgba(20,184,166,0.12)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.25)", fontFamily: "inherit", cursor: "pointer" }}>
                        {saving === tool.id ? "⏳ Saving..." : "↑ Update Price"}
                      </button>
                    </>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: "rgba(245,166,35,0.1)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.2)" }}>
                      ⏳ BUILDING
                    </span>
                  )}
                  {tool.status === "live" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                      ● LIVE
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-xl p-3 text-xs" style={{ background: "rgba(20,184,166,0.04)", border: "1px solid rgba(20,184,166,0.1)", color: "#7a8a9a" }}>
              ⚡ Prices commit directly to GitHub → Vercel auto-deploys. No wallet or contract needed.
            </div>
          </div>
        )}

        {/* ── BURNS ── */}
        {tab === "burns" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon:"🔥", label:"Total Burned",    val: stats.totalBurned.toLocaleString() + " LDA", color:"#ef4444" },
                { icon:"📊", label:"Burn %",           val: stats.burnPct.toFixed(2) + "% of supply",   color:"#f5a623" },
                { icon:"🏦", label:"Treasury Now",    val: stats.treasuryBalance.toFixed(2) + " LDA",   color:"#a78bfa" },
                { icon:"📅", label:"Next Burn",        val: "Weekly — manual",                          color:"#22c55e" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-black text-lg" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-xs mt-1" style={{ color: "#4a5a6a" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#ef4444" }}>Weekly Burn Protocol</div>
              <div className="text-xs space-y-1" style={{ color: "#7a8a9a" }}>
                <p>1. Send <strong style={{ color: "#f5a623" }}>70%</strong> of treasury LDA to black hole: <code style={{ color: "#14b8a6" }}>TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy</code></p>
                <p>2. Keep <strong style={{ color: "#f5a623" }}>30%</strong> in treasury for operations</p>
                <p>3. Post Tronscan tx link as proof on Twitter @lionxeco</p>
                <p>4. Log the burn in this dashboard below</p>
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#4a5a6a" }}>Burn History</div>
              {BURN_LOG.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: "#4a5a6a" }}>No burns logged yet — first weekly burn pending</p>
              ) : (
                <div className="space-y-2">
                  {BURN_LOG.map((b, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ color: "#7a8a9a" }}>{b.date}</span>
                      <span style={{ color: "#ef4444" }}>🔥 {b.amount.toLocaleString()} LDA</span>
                      <a href={`https://tronscan.org/#/transaction/${b.txHash}`} target="_blank" rel="noreferrer"
                        style={{ color: "#14b8a6", fontSize: 10 }}>proof →</a>
                      <span style={{ color: "#4a5a6a" }}>{b.note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl p-3 text-xs" style={{ background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.15)", color: "#7a8a9a" }}>
              💡 To add a burn entry, edit <code style={{ color: "#14b8a6" }}>BURN_LOG</code> in <code>lionx-admin.tsx</code> with the date, LDA amount, and Tronscan tx hash.
            </div>
          </div>
        )}

        {/* ── SECURITY ── */}
        {tab === "security" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:"Security Score",  val:"8.5 / 10",  color:"#22c55e" },
                { label:"Audit Rounds",    val:"2 Complete", color:"#22c55e" },
                { label:"Open Findings",   val:"0",          color:"#22c55e" },
                { label:"Last Audit",      val:"2026-04-21", color:"#14b8a6" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(34,197,94,0.1)" }}>
                  <div className="font-black text-lg" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-xs mt-1" style={{ color: "#4a5a6a" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#4a5a6a" }}>Security Controls Active</div>
              <div className="space-y-2">
                {[
                  ["CRIT", "Address validation", "Tron format regex + required field check", true],
                  ["CRIT", "Replay protection", "Upstash KV SET NX — persistent across cold starts", true],
                  ["CRIT", "Wallet cooldown", "5-min per wallet/tool — set AFTER payment verified", true],
                  ["HIGH", "toAddress verify", "Empty string + mismatch both rejected", true],
                  ["HIGH", "Error detail stripping", "Internal errors never leak to client", true],
                  ["HIGH", "Input sanitization", "500 char cap + special char strip + format validation", true],
                  ["HIGH", "CORS whitelist", "lion-xai.com + www + vercel preview only", true],
                  ["HIGH", "AI field whitelist", "score/verdict/analysis/metrics/flags only", true],
                  ["MED",  "Wallet signature", "TronLink signMessageV2 — mandatory, catch is fatal", true],
                  ["MED",  "Share URL privacy", "queriedBy stripped before encoding", true],
                  ["MED",  "History masking", "Addresses stored as T1Abc3...4F2A", true],
                  ["LOW",  "Tronscan timeouts", "10s AbortController on all fetches", true],
                  ["LOW",  "Dead code removed", "approvePlatform/executeQuery removed", true],
                  ["LOW",  "Prompt injection", "cleanInput used in AI prompt, not raw input", true],
                ].map(([severity, name, detail, passed]) => (
                  <div key={name as string} className="flex items-start gap-3 text-xs py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-xs font-bold"
                      style={{ background: severity === "CRIT" ? "rgba(239,68,68,0.15)" : severity === "HIGH" ? "rgba(245,166,35,0.15)" : "rgba(107,114,128,0.15)", color: severity === "CRIT" ? "#ef4444" : severity === "HIGH" ? "#f5a623" : "#9ca3af" }}>
                      {severity}
                    </span>
                    <span className="font-bold shrink-0 w-32" style={{ color: "#dde8f0" }}>{name}</span>
                    <span style={{ color: "#7a8a9a" }}>{detail}</span>
                    <span className="ml-auto shrink-0" style={{ color: "#22c55e" }}>✅</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-3 text-xs" style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)", color: "#7a8a9a" }}>
              ⚠️ <strong style={{ color: "#f5a623" }}>Remaining LOW:</strong> IP rate limiting is in-memory per-instance (not KV-backed). Effective at low scale. Move to KV before high-traffic launch.
            </div>
          </div>
        )}

        {/* ── PENDING ── */}
        {tab === "pending" && (
          <div className="space-y-4">

            <div className="rounded-xl p-4" style={{ background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span>🔐</span>
                <div className="font-bold text-sm" style={{ color: "#dde8f0" }}>Security Auditor Tool</div>
                <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(245,166,35,0.15)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.25)" }}>BUILDING</span>
              </div>
              <div className="text-xs space-y-1 mb-3" style={{ color: "#7a8a9a" }}>
                <p>4th AI tool — 150 LDA per query. Input: contract or wallet address.</p>
                <p>Runs full security checklist on-chain: verification, creator wallet age, holder concentration, transfer patterns, large outflows, proxy patterns.</p>
                <p>Output: GO / CAUTION / NO-GO verdict with per-item findings.</p>
              </div>
              <div className="text-xs font-bold mb-2" style={{ color: "#4a5a6a" }}>Build checklist:</div>
              {[
                "Write getSecurityData() — parallel fetch: contract + token + creator wallet",
                "Write checklist-driven AI prompt (pass/fail output format)",
                "Add SECURITY_AUDITOR to TOOL_COSTS (150 LDA) in query.ts",
                "Add as 4th tool in tools.tsx — replace Whale Tracker Coming Soon card",
                "Test on 3+ real contracts (LDA, MANES, known scam)",
                "Deploy + verify",
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1" style={{ color: "#7a8a9a" }}>
                  <span style={{ color: "#4a5a6a" }}>☐</span> {task}
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4" style={{ background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span>📦</span>
                <div className="font-bold text-sm" style={{ color: "#dde8f0" }}>web3-api-security-auditor (Claw Mart Skill)</div>
                <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.25)" }}>BUILT</span>
              </div>
              <div className="text-xs mb-3" style={{ color: "#7a8a9a" }}>
                40-item checklist skill + known bypass patterns. Built from LionX audit. Ready to package and list on Claw Mart at $9.99–$14.99.
              </div>
              {[
                { task: "SKILL.md + references written", done: true },
                { task: "Package with package_skill.py", done: false },
                { task: "Claw Mart seller account (Tash action)", done: false },
                { task: "Write listing description", done: false },
                { task: "Price decision: $9.99 vs $14.99", done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1" style={{ color: item.done ? "#22c55e" : "#7a8a9a" }}>
                  <span>{item.done ? "✅" : "☐"}</span> {item.task}
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#4a5a6a" }}>Phase 2 (Future)</div>
              <div className="space-y-2 text-xs" style={{ color: "#7a8a9a" }}>
                <div>🗳️ GovernanceLDA.sol — on-chain voting for LDA holders</div>
                <div>💰 Staking — lock LDA for yield + governance weight</div>
                <div>🏪 Builder Marketplace — third-party tool submissions</div>
                <div>🔗 Multi-chain expansion — EVM chains (same prompts, new data fetchers)</div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  )
}
