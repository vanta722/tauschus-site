"use client";
import { useState, useEffect } from "react";

// ── Contract addresses (Shasta testnet — update to mainnet after deploy) ──
// Addresses read from env vars — set NEXT_PUBLIC_* in Vercel before mainnet deploy
// Shasta testnet addresses used as fallback during development
const CONTRACTS = {
  LDA_V2:    process.env.NEXT_PUBLIC_LDA_V2    || "TURQgDcWWeg633Azz8SMrDrHHYdgM3Nfxi",
  MIGRATION: process.env.NEXT_PUBLIC_MIGRATION || "TBJewkqJqCRqurLMiTnqYkRhVxYWeHvrVP",
  PLATFORM:  process.env.NEXT_PUBLIC_PLATFORM  || "TYKu4AJv6cqNwoyZtnjzpsyE9Tf5WkLQhh",
  TREASURY:  "TG1ZuSqJdgmD11i2FyCXxtjBbTEiEzRVQy",
  NETWORK:   "shasta", // change to "mainnet" after deployment
}

const TOOLS = [
  { id: "WALLET_ANALYZER",  name: "🔍 Wallet Analyzer",    cost: 50  },
  { id: "CONTRACT_AUDITOR", name: "🛡️ Contract Auditor",   cost: 100 },
  { id: "MARKET_INTEL",     name: "📊 Market Intelligence", cost: 25  },
]

const BUILDER_APPS = [
  { id: 1, tool: "Tron Sentiment Scanner", builder: "0xdev_labs", contact: "@trondevlabs", wallet: "", cost: 75,  category: "Analytics", status: "pending", submitted: "2 days ago" },
  { id: 2, tool: "NFT Floor Predictor",    builder: "nft_ai",    contact: "nftai@dev.io", wallet: "", cost: 50,  category: "NFT",       status: "pending", submitted: "5 days ago" },
  { id: 3, tool: "Rug Pull Detector Pro",  builder: "safu_tools", contact: "@safutools",  wallet: "", cost: 80,  category: "Security",  status: "approved", submitted: "8 days ago" },
]

interface TokenStats {
  v2Supply: number
  totalBurned: number
  treasuryBalance: number
  migrationOpen: boolean
  timeRemaining: number
  oldLDAMigrated: number
  v2Issued: number
}

export default function LionXAdmin() {
  const [tab,           setTab]           = useState<"overview"|"tools"|"builders"|"migration"|"governance">("overview")
  const [stats,         setStats]         = useState<TokenStats | null>(null)
  const [toolPrices,    setToolPrices]     = useState(TOOLS.map(t => ({ ...t, newCost: t.cost })))
  const [builders,      setBuilders]       = useState(BUILDER_APPS)
  const [saving,        setSaving]         = useState<string | null>(null)
  const [saved,         setSaved]          = useState<string | null>(null)
  const [txResult,      setTxResult]       = useState<string | null>(null)
  // Governance state
  const [proposals,     setProposals]      = useState<{id:number; description:string; blockNumber:number; active:boolean; forVotes:number; againstVotes:number}[]>([])
  const [propLoading,   setPropLoading]    = useState(false)
  const [newProposal,   setNewProposal]    = useState("")
  const [creatingProp,  setCreatingProp]   = useState(false)
  const [govTxResult,   setGovTxResult]    = useState<string | null>(null)

  // Fetch live stats from Tronscan
  useEffect(() => {
    async function fetchStats() {
      try {
        const [tokenRes, migRes] = await Promise.all([
          fetch(`https://apilist.tronscanapi.com/api/token_trc20?contract=${CONTRACTS.LDA_V2}`),
          fetch(`https://apilist.tronscanapi.com/api/accountv2?address=${CONTRACTS.TREASURY}`)
        ])
        const tokenData = await tokenRes.json()
        const token = tokenData?.trc20_tokens?.[0]
        if (token) {
          setStats({
            v2Supply:       Number(token.total_supply_with_decimals || 0) / 1e6,
            totalBurned:    0, // from contract
            treasuryBalance: 0, // from contract
            migrationOpen:  true,
            timeRemaining:  30 * 86400,
            oldLDAMigrated: 0,
            v2Issued:       0,
          })
        }
      } catch {}
    }
    fetchStats()
    const t = setInterval(fetchStats, 30000)
    return () => clearInterval(t)
  }, [])

  async function updateToolPrice(toolId: string, newCost: number) {
    setSaving(toolId)
    setTxResult(null)
    try {
      const tw = (window as any).tronWeb
      if (!tw) throw new Error("TronLink not connected")
      const platform = await tw.contract().at(CONTRACTS.PLATFORM)
      const toolIdBytes = tw.sha3(toolId) // keccak256 — matches LDAPlatform.sol registration
      const tx = await platform.updateTool(toolIdBytes, newCost * 1e6, true).send({ feeLimit: 100_000_000 })
      setTxResult(`✅ Price updated — tx: ${tx.slice(0,20)}...`)
      setSaved(toolId)
      setTimeout(() => setSaved(null), 3000)
    } catch (e: any) {
      setTxResult(`❌ Failed: ${e?.message || "Transaction error"}`)
    } finally {
      setSaving(null)
    }
  }

  async function toggleMigration(open: boolean) {
    setSaving("migration")
    try {
      const tw = (window as any).tronWeb
      if (!tw) throw new Error("TronLink not connected")
      const mig = await tw.contract().at(CONTRACTS.MIGRATION)
      if (open) await mig.openMigration(30).send({ feeLimit: 100_000_000 })
      else       await mig.closeMigration().send({ feeLimit: 100_000_000 })
      setTxResult(`✅ Migration ${open ? "opened" : "closed"}`)
    } catch (e: any) {
      setTxResult(`❌ Failed: ${e?.message}`)
    } finally {
      setSaving(null)
    }
  }

  async function approveBuilder(id: number) {
    const builder = builders.find(b => b.id === id)
    if (!builder) return
    // Require a valid Tron wallet address before attempting on-chain call
    if (!builder.wallet || !builder.wallet.startsWith('T') || builder.wallet.length < 30) {
      setTxResult(`❌ Cannot approve: no valid Tron wallet address on file for ${builder.builder}. Ask them to submit their TRX wallet address first.`)
      return
    }
    setSaving(`builder-${id}`)
    setTxResult(null)
    try {
      const tw = (window as any).tronWeb
      if (!tw) throw new Error("TronLink not connected")
      const contract = await tw.contract().at(CONTRACTS.LDA_V2)
      const toolId   = tw.sha3(builder.tool.toUpperCase().replace(/ /g, '_'))
      // registerBuilder(bytes32 toolId, address wallet, uint256 sharePercent)
      const tx = await contract.registerBuilder(toolId, builder.wallet, 10).send({ feeLimit: 150_000_000 })
      setBuilders(b => b.map(x => x.id === id ? { ...x, status: "approved" } : x))
      setTxResult(`✅ Builder approved on-chain — tx: ${tx.slice(0,24)}...`)
    } catch (e: any) {
      setBuilders(b => b.map(x => x.id === id ? { ...x, status: "approved" } : x))
      setTxResult(`⚠️ UI approved. On-chain call failed: ${e?.message || 'check wallet'} — call registerBuilder() manually.`)
    }
    setSaving(null)
  }

  function rejectBuilder(id: number) {
    setBuilders(b => b.map(x => x.id === id ? { ...x, status: "rejected" } : x))
  }

  async function fetchProposals() {
    setPropLoading(true)
    setGovTxResult(null)
    try {
      const tw = (window as any).tronWeb
      if (!tw) { setPropLoading(false); return }
      const contract = await tw.contract().at(CONTRACTS.LDA_V2)
      const count = Number(await contract.snapshotCount().call())
      const loaded = []
      for (let i = count; i >= 1; i--) {
        try {
          const s = await contract.snapshots(i).call()
          const r = await contract.getVoteResults(i).call()
          loaded.push({
            id:           i,
            description:  s.description,
            blockNumber:  Number(s.blockNumber),
            active:       s.active,
            forVotes:     Number(r.forVotes) / 1e6,
            againstVotes: Number(r.againstVotes) / 1e6,
          })
        } catch {}
      }
      setProposals(loaded)
    } catch (e: any) {
      setGovTxResult(`❌ Failed to load: ${e?.message}`)
    }
    setPropLoading(false)
  }

  async function createProposal() {
    if (!newProposal.trim()) return
    setCreatingProp(true)
    setGovTxResult(null)
    try {
      const tw = (window as any).tronWeb
      if (!tw) throw new Error("TronLink not connected — connect owner wallet")
      const contract = await tw.contract().at(CONTRACTS.LDA_V2)
      const tx = await contract.createSnapshot(newProposal.trim()).send({ feeLimit: 100_000_000 })
      setGovTxResult(`✅ Proposal created — tx: ${tx.slice(0,24)}...`)
      setNewProposal("")
      setTimeout(fetchProposals, 4000)
    } catch (e: any) {
      setGovTxResult(`❌ Failed: ${e?.message || "Transaction error"}`)
    }
    setCreatingProp(false)
  }

  async function closeProposal(id: number) {
    setSaving(`close-${id}`)
    setGovTxResult(null)
    try {
      const tw = (window as any).tronWeb
      if (!tw) throw new Error("TronLink not connected")
      const contract = await tw.contract().at(CONTRACTS.LDA_V2)
      const tx = await contract.closeSnapshot(id).send({ feeLimit: 100_000_000 })
      setGovTxResult(`✅ Proposal #${id} closed — tx: ${tx.slice(0,24)}...`)
      setTimeout(fetchProposals, 4000)
    } catch (e: any) {
      setGovTxResult(`❌ Failed: ${e?.message}`)
    }
    setSaving(null)
  }

  const TABS = [
    { id: "overview",    label: "Overview",    icon: "📊" },
    { id: "tools",       label: "Tools",       icon: "🔧" },
    { id: "builders",   label: "Builders",    icon: "👷" },
    { id: "migration",  label: "Migration",   icon: "🔄" },
    { id: "governance", label: "Governance",  icon: "🗳️" },
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
              Network: <span style={{ color: CONTRACTS.NETWORK === "mainnet" ? "#22c55e" : "#f5a623" }}>{CONTRACTS.NETWORK.toUpperCase()}</span>
              {" · "}Platform: <span className="font-mono text-xs" style={{ color: "#14b8a6" }}>{CONTRACTS.PLATFORM.slice(0,8)}...{CONTRACTS.PLATFORM.slice(-4)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block" }}/>
          <span className="text-xs font-bold" style={{ color: "#22c55e" }}>Platform Online</span>
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

        {/* Tx result */}
        {txResult && (
          <div className="mb-4 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: txResult.startsWith("✅") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${txResult.startsWith("✅") ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, color: txResult.startsWith("✅") ? "#22c55e" : "#ef4444" }}>
            {txResult}
          </div>
        )}

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon:"💎", label:"LDA v2 Supply",    val: stats ? stats.v2Supply.toLocaleString() : "Loading...", color:"#14b8a6" },
                { icon:"🔥", label:"Total Burned",     val: stats ? stats.totalBurned.toLocaleString() : "—",        color:"#ef4444" },
                { icon:"🏦", label:"Treasury Balance", val: stats ? stats.treasuryBalance.toLocaleString() : "—",    color:"#a78bfa" },
                { icon:"🔄", label:"Migration",        val: stats?.migrationOpen ? "OPEN" : "CLOSED",                color: stats?.migrationOpen ? "#22c55e" : "#ef4444" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-black text-lg" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-xs mt-1" style={{ color: "#4a5a6a" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#4a5a6a" }}>Contract Addresses</div>
              {Object.entries(CONTRACTS).filter(([k]) => k !== "NETWORK").map(([key, addr]) => (
                <div key={key} className="flex items-center justify-between py-2 text-xs" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: "#7a8a9a" }}>{key}</span>
                  <a href={`https://${CONTRACTS.NETWORK === "mainnet" ? "" : "shasta."}tronscan.org/#/contract/${addr}`} target="_blank" rel="noreferrer"
                    className="font-mono" style={{ color: "#14b8a6", textDecoration: "none" }}>
                    {addr.slice(0,8)}...{addr.slice(-6)}
                  </a>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#4a5a6a" }}>Quick Links</div>
              <div className="flex gap-2 flex-wrap">
                {[
                  ["🌐 Platform", "https://frontend-phi-blond-32.vercel.app"],
                  ["📊 Dashboard", "https://frontend-phi-blond-32.vercel.app/dashboard"],
                  ["🔍 Tronscan (Shasta)", `https://shasta.tronscan.org/#/contract/${CONTRACTS.LDA_V2}`],
                  ["💻 GitHub", "https://github.com/vanta722/lionx-platform"],
                ].map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold no-underline transition-all"
                    style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)", color: "#14b8a6" }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TOOL PRICES ── */}
        {tab === "tools" && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: "#7a8a9a" }}>
              Connect owner wallet to update prices on-chain. Changes take effect immediately.
            </p>
            {toolPrices.map(tool => (
              <div key={tool.id} className="rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div className="font-bold text-sm">{tool.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#4a5a6a" }}>Current: <span style={{ color: "#f5a623" }}>{tool.cost} LDA v2</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="number" value={tool.newCost} min={1}
                    onChange={e => setToolPrices(p => p.map(t => t.id === tool.id ? { ...t, newCost: Number(e.target.value) } : t))}
                    className="w-24 px-3 py-2 rounded-lg text-sm text-center font-bold outline-none"
                    style={{ background: "#161628", border: "1px solid rgba(20,184,166,0.2)", color: "#14b8a6", fontFamily: "inherit" }}/>
                  <span className="text-xs" style={{ color: "#4a5a6a" }}>LDA v2</span>
                  <button onClick={() => updateToolPrice(tool.id, tool.newCost)}
                    disabled={saving === tool.id || tool.newCost === tool.cost}
                    className="px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-40 transition-all"
                    style={{ background: saved === tool.id ? "rgba(34,197,94,0.15)" : "rgba(20,184,166,0.12)", color: saved === tool.id ? "#22c55e" : "#14b8a6", border: `1px solid ${saved === tool.id ? "rgba(34,197,94,0.25)" : "rgba(20,184,166,0.25)"}`, fontFamily: "inherit", cursor: "pointer" }}>
                    {saving === tool.id ? "Updating..." : saved === tool.id ? "✅ Saved" : "Update Price"}
                  </button>
                </div>
              </div>
            ))}
            <div className="rounded-xl p-4 text-xs" style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)", color: "#7a8a9a" }}>
              💡 <strong style={{ color: "#f5a623" }}>Pricing guide:</strong> Adjust based on LDA v2 price. Target $1–3 USD per query. At $0.10/LDA: Wallet=50 ($5), Audit=100 ($10), Intel=25 ($2.50)
            </div>
          </div>
        )}

        {/* ── BUILDER APPLICATIONS ── */}
        {tab === "builders" && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: "#7a8a9a" }}>
              Review builder applications. Approved tools go live on the marketplace.
            </p>
            {builders.map(b => (
              <div key={b.id} className="rounded-xl p-4" style={{ background: "#0c0c18", border: `1px solid ${b.status === "approved" ? "rgba(34,197,94,0.2)" : b.status === "rejected" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)"}` }}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-bold text-sm mb-1">{b.tool}</div>
                    <div className="flex gap-3 text-xs flex-wrap" style={{ color: "#7a8a9a" }}>
                      <span>👤 {b.builder}</span>
                      <span>💬 {b.contact}</span>
                      <span>📂 {b.category}</span>
                      <span>🔥 {b.cost} LDA v2</span>
                      <span>📅 {b.submitted}</span>
                    </div>
                    {b.status === "pending" && (
                      <div className="mt-2">
                        <input
                          placeholder="Builder TRX wallet address (required to approve on-chain)"
                          value={b.wallet}
                          onChange={e => setBuilders(bx => bx.map(x => x.id === b.id ? { ...x, wallet: e.target.value } : x))}
                          className="w-full rounded-lg px-3 py-1.5 text-xs font-mono"
                          style={{ background: "#0a0a16", border: `1px solid ${b.wallet?.startsWith('T') && b.wallet.length >= 30 ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`, color: "#dde8f0", fontFamily: "monospace", outline: "none" }}
                        />
                        {b.wallet && (!b.wallet.startsWith('T') || b.wallet.length < 30) && (
                          <p className="text-xs mt-1" style={{ color: "#ef4444" }}>Must be a valid Tron address (starts with T, 34 chars)</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {b.status === "pending" ? (
                      <>
                        <button onClick={() => approveBuilder(b.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold"
                          style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)", fontFamily: "inherit", cursor: "pointer" }}>
                          ✅ Approve
                        </button>
                        <button onClick={() => rejectBuilder(b.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold"
                          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", fontFamily: "inherit", cursor: "pointer" }}>
                          ✗ Reject
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ background: b.status === "approved" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: b.status === "approved" ? "#22c55e" : "#ef4444", border: `1px solid ${b.status === "approved" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)"}` }}>
                        {b.status === "approved" ? "✅ Approved" : "✗ Rejected"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {builders.filter(b => b.status === "pending").length === 0 && (
              <div className="text-center py-6 text-xs" style={{ color: "#4a5a6a" }}>No pending applications</div>
            )}
          </div>
        )}

        {/* ── MIGRATION CONTROL ── */}
        {tab === "migration" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:"Old LDA Total",    val:"20,207,717", color:"#7a8a9a" },
                { label:"Migrated So Far",  val: stats ? stats.oldLDAMigrated.toLocaleString() : "—", color:"#f5a623" },
                { label:"LDA v2 Issued",    val: stats ? stats.v2Issued.toLocaleString() : "—",       color:"#14b8a6" },
                { label:"Max v2 Supply",    val:"10,000,000",  color:"#14b8a6" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4" style={{ background: "#0c0c18", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="font-black text-xl" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-xs mt-1" style={{ color: "#4a5a6a" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-5" style={{ background: "#0c0c18", border: "1px solid rgba(20,184,166,0.2)" }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#4a5a6a" }}>Migration Window Control</div>
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: stats?.migrationOpen ? "#22c55e" : "#ef4444", boxShadow: `0 0 8px ${stats?.migrationOpen ? "#22c55e" : "#ef4444"}`, display: "inline-block" }}/>
                  <span className="font-bold text-sm" style={{ color: stats?.migrationOpen ? "#22c55e" : "#ef4444" }}>
                    Migration {stats?.migrationOpen ? "OPEN" : "CLOSED"}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => toggleMigration(true)} disabled={saving === "migration"}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
                  style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)", fontFamily: "inherit", cursor: "pointer" }}>
                  {saving === "migration" ? "Processing..." : "🔓 Open Migration (30 days)"}
                </button>
                <button onClick={() => toggleMigration(false)} disabled={saving === "migration"}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", fontFamily: "inherit", cursor: "pointer" }}>
                  {saving === "migration" ? "Processing..." : "🔒 Close Migration"}
                </button>
              </div>
              <p className="mt-3 text-xs" style={{ color: "#4a5a6a" }}>
                ⚠️ Closing migration locks out remaining old LDA holders permanently. Do this only after the window expires naturally.
              </p>
            </div>

            <div className="rounded-xl p-4 text-xs" style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)", color: "#7a8a9a" }}>
              🔑 <strong style={{ color: "#f5a623" }}>Post-migration checklist:</strong> Once window closes → renounce mint() on LDA v2 contract → lock LP tokens on SunSwap → announce to community.
            </div>
          </div>
        )}

        {/* ── GOVERNANCE TAB ───────────────────────── */}
        {tab === "governance" && (
          <div className="space-y-4">

            {/* Create Proposal */}
            <div className="rounded-xl p-5" style={{ background: "rgba(20,184,166,0.05)", border: "1px solid rgba(20,184,166,0.15)" }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#14b8a6" }}>Create New Proposal</div>
              <p className="text-xs mb-4" style={{ color: "#7a8a9a" }}>
                Creates an on-chain snapshot. Holder balances at this block are locked for voting — tokens bought after this point have no voting power on this proposal.
              </p>
              <textarea
                value={newProposal}
                onChange={e => setNewProposal(e.target.value)}
                placeholder="Proposal description e.g. 'Add DEX aggregator tool at 75 LDA v2 per query'"
                rows={3}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none mb-3"
                style={{ background: "#0a0a16", border: "1px solid rgba(20,184,166,0.2)", color: "#dde8f0", fontFamily: "inherit", outline: "none" }}
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={createProposal}
                  disabled={creatingProp || !newProposal.trim()}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg,#14b8a6,#0d9488)", color: "#000", border: "none", fontFamily: "inherit", cursor: "pointer" }}>
                  {creatingProp ? "⏳ Creating..." : "📢 Create Proposal"}
                </button>
                <span className="text-xs" style={{ color: "#4a5a6a" }}>Requires owner wallet connected via TronLink</span>
              </div>
            </div>

            {/* Load + Proposal list */}
            <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "#14b8a6" }}>Live Proposals</div>
                <button
                  onClick={fetchProposals}
                  disabled={propLoading}
                  className="text-xs px-3 py-1.5 rounded-lg font-bold disabled:opacity-40"
                  style={{ border: "1px solid rgba(20,184,166,0.25)", color: "#14b8a6", background: "transparent", fontFamily: "inherit", cursor: "pointer" }}>
                  {propLoading ? "⏳ Loading..." : "↻ Load from Chain"}
                </button>
              </div>

              {proposals.length === 0 && !propLoading && (
                <p className="text-sm text-center py-6" style={{ color: "#4a5a6a" }}>
                  Click “Load from Chain” to fetch proposals, or create your first one above.
                </p>
              )}

              <div className="space-y-3">
                {proposals.map(p => {
                  const total = p.forVotes + p.againstVotes
                  const forPct = total > 0 ? Math.round((p.forVotes / total) * 100) : 50
                  return (
                    <div key={p.id} className="rounded-xl p-4" style={{ background: "#0a0a16", border: `1px solid ${p.active ? "rgba(20,184,166,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold" style={{ color: "#4a5a6a" }}>#{p.id}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: p.active ? "rgba(20,184,166,0.15)" : "rgba(107,114,128,0.15)",
                                     color: p.active ? "#14b8a6" : "#6b7280" }}>
                            {p.active ? "● ACTIVE" : "✓ CLOSED"}
                          </span>
                        </div>
                        {p.active && (
                          <button
                            onClick={() => closeProposal(p.id)}
                            disabled={saving === `close-${p.id}`}
                            className="text-xs px-3 py-1 rounded-lg font-bold shrink-0 disabled:opacity-40"
                            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", fontFamily: "inherit", cursor: "pointer" }}>
                            {saving === `close-${p.id}` ? "⏳" : "🔒 Close"}
                          </button>
                        )}
                      </div>
                      <p className="text-sm font-semibold mb-3" style={{ color: "#dde8f0" }}>{p.description}</p>
                      {/* Vote bar */}
                      <div className="rounded-full overflow-hidden mb-2" style={{ height: 6, background: "rgba(255,255,255,0.06)" }}>
                        <div style={{ width: `${forPct}%`, height: "100%", background: "#22c55e", transition: "width 0.4s" }} />
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: "#6b7280" }}>
                        <span style={{ color: "#22c55e", fontWeight: 700 }}>✓ FOR {forPct}% ({p.forVotes.toLocaleString()} LDA)</span>
                        <span style={{ color: "#ef4444", fontWeight: 700 }}>✗ AGAINST {100-forPct}% ({p.againstVotes.toLocaleString()} LDA)</span>
                      </div>
                      <div className="mt-2 text-xs" style={{ color: "#4a5a6a" }}>Snapshot block #{p.blockNumber.toLocaleString()}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tx feedback */}
            {govTxResult && (
              <div className="rounded-xl px-4 py-3 text-sm font-semibold"
                style={{ background: govTxResult.startsWith("✅") ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                         border: `1px solid ${govTxResult.startsWith("✅") ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                         color:  govTxResult.startsWith("✅") ? "#22c55e" : "#ef4444" }}>
                {govTxResult}
              </div>
            )}

            <div className="rounded-xl p-4 text-xs" style={{ background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)", color: "#7a8a9a" }}>
              💡 <strong style={{ color: "#f5a623" }}>Governance flow:</strong> Create proposal here → holders vote at{" "}
              <a href="https://frontend-phi-blond-32.vercel.app/governance" target="_blank" rel="noreferrer" style={{ color: "#14b8a6" }}>Lion X Governance page</a>{" "}→ close proposal here when voting period ends.
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
