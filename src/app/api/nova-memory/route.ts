import { NextRequest, NextResponse } from "next/server";

const NOVA_MEMORY_BASE = "https://floridaconcretealliance.com/api/nova-memory";
const API_KEY = "mac-memory-2026";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  const vpsUrl = file
    ? `${NOVA_MEMORY_BASE}?file=${encodeURIComponent(file)}`
    : NOVA_MEMORY_BASE;

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
    console.error("Nova memory API proxy error:", err);
    return NextResponse.json({ error: "Could not reach Nova memory API" }, { status: 503 });
  }
}
