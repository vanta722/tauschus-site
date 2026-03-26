import { NextRequest, NextResponse } from "next/server";

const VPS_IP = "187.124.71.71";
const VPS_PORT = "3031";
const API_KEY = "mac-memory-2026";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  const vpsUrl = file
    ? `http://${VPS_IP}:${VPS_PORT}/api/memory/${encodeURIComponent(file)}`
    : `http://${VPS_IP}:${VPS_PORT}/api/memory`;

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
