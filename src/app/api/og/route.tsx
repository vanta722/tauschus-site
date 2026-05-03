import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pick = searchParams.get("pick") || "TODAY'S PICKS";
  const odds = searchParams.get("odds") || "LIVE";
  const edge = searchParams.get("edge") || "BETA";
  const game = searchParams.get("game") || "MAC + ACE MODEL";
  const sport = searchParams.get("sport") || "MLB";
  const sportEmoji = sport.toUpperCase().includes("NBA") ? "🏀" : "⚾";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#030303",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "Georgia, serif",
          overflow: "hidden",
        }}
      >
        {/* Gold top border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, transparent, #D4AF37, #FFD700, #D4AF37, transparent)",
          }}
        />

        {/* Radial glow center */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)",
            borderRadius: "50%",
            transform: "translate(-350px, -350px)",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "44px 60px 0",
          }}
        >
          {/* WUNTOO logo */}
          <div
            style={{
              fontSize: "56px",
              fontWeight: "900",
              color: "#FFD700",
              letterSpacing: "-1px",
            }}
          >
            WUNTOO
          </div>

          {/* Sport badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.45)",
              borderRadius: "100px",
              padding: "12px 26px",
              fontSize: "22px",
              color: "#FFD700",
              letterSpacing: "0.05em",
            }}
          >
            {sportEmoji} {sport}
          </div>
        </div>

        {/* Center content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 60px",
          }}
        >
          {/* Game matchup */}
          <div
            style={{
              fontSize: "21px",
              color: "rgba(232,232,232,0.45)",
              letterSpacing: "0.25em",
              marginBottom: "22px",
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {game}
          </div>

          {/* Big pick */}
          <div
            style={{
              fontSize: "120px",
              fontWeight: "900",
              color: "#FFD700",
              letterSpacing: "-2px",
              lineHeight: "1",
              marginBottom: "36px",
              textShadow: "0 0 60px rgba(212,175,55,0.5)",
            }}
          >
            {pick}
          </div>

          {/* Odds + Edge pills */}
          <div
            style={{
              display: "flex",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "rgba(212,175,55,0.12)",
                border: "1px solid rgba(212,175,55,0.5)",
                borderRadius: "8px",
                padding: "14px 32px",
                fontSize: "26px",
                fontWeight: "700",
                color: "#FFD700",
                letterSpacing: "0.05em",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {odds}
            </div>
            <div
              style={{
                background: "rgba(212,175,55,0.05)",
                border: "1px solid rgba(212,175,55,0.25)",
                borderRadius: "8px",
                padding: "14px 32px",
                fontSize: "26px",
                fontWeight: "700",
                color: "rgba(212,175,55,0.65)",
                letterSpacing: "0.05em",
                fontFamily: "Arial, sans-serif",
              }}
            >
              EDGE {edge}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 60px 44px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: "#C0C0C0",
              letterSpacing: "0.12em",
              fontFamily: "Arial, sans-serif",
            }}
          >
            tauschus.com/wuntoo
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, #B8860B, #FFD700)",
              borderRadius: "4px",
              padding: "7px 18px",
              fontSize: "13px",
              fontWeight: "700",
              color: "#000",
              letterSpacing: "0.25em",
              fontFamily: "Arial, sans-serif",
            }}
          >
            BETA
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
