import { NextResponse } from "next/server";

const API_KEY = "35e27c649b858c3f0c34bd3a9c3a91e6";

export async function GET() {
  const url = `https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?apiKey=${API_KEY}&regions=us&markets=h2h,totals&oddsFormat=american`;
  const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
  const data = await res.json();
  return NextResponse.json(data);
}
