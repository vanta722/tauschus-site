import { NextRequest, NextResponse } from "next/server";

const MEMORY_BASE = "https://floridaconcretealliance.com/api/memory";
const API_KEY = "mac-memory-2026";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  const vpsUrl = file
    ? `${MEMORY_BASE}?file=${encodeURIComponent(file)}`
    : MEMORY_BASE;

  try {
    const res = await fetch(vpsUrl, {
      headers: { "x-api-key": API_KEY },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "VPS returned error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Memory API proxy error:", err);
    return NextResponse.json({ error: "Could not reach VPS memory API" }, { status: 503 });
  }
}
