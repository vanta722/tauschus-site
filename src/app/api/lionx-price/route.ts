import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const REPO         = 'vanta722/lionx-platform'
const FILE_PATH    = 'frontend/pages/api/query.ts'
const BRANCH       = 'main'
const API_SECRET   = process.env.LIONX_ADMIN_SECRET || 'Vanta2026'

export async function POST(req: NextRequest) {
  try {
    const { toolId, newCost, secret } = await req.json()

    if (secret !== API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const validTools = ['WALLET_ANALYZER', 'CONTRACT_AUDITOR', 'MARKET_INTEL', 'SECURITY_AUDITOR']
    if (!validTools.includes(toolId) || typeof newCost !== 'number' || newCost < 1 || newCost > 10000) {
      return NextResponse.json({ error: 'Invalid tool or cost' }, { status: 400 })
    }

    // Fetch current file from GitHub
    const getRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
    )
    if (!getRes.ok) return NextResponse.json({ error: 'Failed to fetch file from GitHub' }, { status: 500 })

    const fileData = await getRes.json()
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8')

    // Update the TOOL_COSTS entry using regex
    const pattern = new RegExp(`(${toolId}:\\s*)\\d+`)
    if (!pattern.test(currentContent)) {
      return NextResponse.json({ error: `Tool ${toolId} not found in TOOL_COSTS` }, { status: 400 })
    }

    const updatedContent = currentContent.replace(pattern, `$1${newCost}`)
    const encodedContent = Buffer.from(updatedContent).toString('base64')

    // Commit back to GitHub
    const commitRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Update ${toolId} price to ${newCost} LDA via Mission Control`,
          content: encodedContent,
          sha:     fileData.sha,
          branch:  BRANCH,
        }),
      }
    )

    if (!commitRes.ok) {
      const err = await commitRes.json()
      return NextResponse.json({ error: `GitHub commit failed: ${err.message}` }, { status: 500 })
    }

    const commitData = await commitRes.json()
    return NextResponse.json({
      success: true,
      tool: toolId,
      newCost,
      commit: commitData.commit?.sha?.slice(0, 7),
      message: `Price updated — Vercel will redeploy in ~60s`,
    })

  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
