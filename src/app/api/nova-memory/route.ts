import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NOVA_WORKSPACE = "/home/tash/.openclaw/workspace";

// Core files to always include
const CORE_FILES = [
  { key: "MEMORY.md", label: "Long-Term Memory" },
  { key: "IDENTITY.md", label: "Identity" },
  { key: "SOUL.md", label: "Soul" },
  { key: "AGENTS.md", label: "Agents Config" },
  { key: "HEARTBEAT.md", label: "Heartbeat Protocol" },
  { key: "TOOLS.md", label: "Tools" },
  { key: "USER.md", label: "User Profile" },
  { key: "BOOTSTRAP.md", label: "Bootstrap" },
];

const MEMORY_FILES_TO_SHOW = [
  "todo.md",
  "deals.md",
  "opportunities.md",
  "systems.md",
  "CRONS.md",
  "market-scans.md",
];

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function readFile(filePath: string): { content: string; updatedAt: string | null } {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const stat = fs.statSync(filePath);
    return { content, updatedAt: stat.mtime.toISOString() };
  } catch {
    return { content: "", updatedAt: null };
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  // Return file content
  if (file) {
    // Sanitize: only allow filenames, no path traversal
    const basename = path.basename(file);
    let filePath: string;

    // Allow files in memory/ subdirectory
    if (file.startsWith("memory/")) {
      const memFile = path.basename(file);
      filePath = path.join(NOVA_WORKSPACE, "memory", memFile);
    } else {
      filePath = path.join(NOVA_WORKSPACE, basename);
    }

    if (!fileExists(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const { content, updatedAt } = readFile(filePath);
    return NextResponse.json({ content, updatedAt });
  }

  // Return file list
  const files: { key: string; label: string; group: string }[] = [];

  // Core files
  for (const f of CORE_FILES) {
    const filePath = path.join(NOVA_WORKSPACE, f.key);
    if (fileExists(filePath)) {
      files.push({ key: f.key, label: f.label, group: "core" });
    }
  }

  // Memory subfolder files
  for (const f of MEMORY_FILES_TO_SHOW) {
    const filePath = path.join(NOVA_WORKSPACE, "memory", f);
    if (fileExists(filePath)) {
      files.push({ key: `memory/${f}`, label: f.replace(".md", "").replace(/-/g, " "), group: "memory" });
    }
  }

  // Daily logs (memory/YYYY-MM-DD.md)
  const memDir = path.join(NOVA_WORKSPACE, "memory");
  if (fileExists(memDir)) {
    try {
      const entries = fs.readdirSync(memDir)
        .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
        .sort()
        .reverse()
        .slice(0, 30);
      for (const entry of entries) {
        const label = entry.replace(".md", "");
        files.push({ key: `memory/${entry}`, label, group: "daily" });
      }
    } catch {}
  }

  return NextResponse.json({ files });
}
