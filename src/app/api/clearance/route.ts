import { NextResponse } from "next/server";

const VPS_URL = "https://floridaconcretealliance.com/api/clearance";
const API_KEY = "mac-memory-2026";

export async function GET() {
  try {
    const res = await fetch(VPS_URL, {
      headers: { "x-api-key": API_KEY },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return NextResponse.json({ deals: [], error: "VPS error" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ deals: [], error: "Could not reach VPS" }, { status: 503 });
  }
}
