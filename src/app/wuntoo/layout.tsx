export const metadata = {
  title: "WunToo — Dual-Model Betting Intelligence",
  description:
    "MLB & NBA picks powered by MAC + ACE models. Edge-based, transparent, real bets.",
  openGraph: {
    title: "WunToo — Today's Picks",
    description:
      "MAC + ACE dual-model intelligence. Edge-based MLB & NBA picks.",
    images: [
      {
        url: "https://tauschus.com/api/og?pick=TODAY%27S+PICKS&sport=MLB+%C2%B7+NBA&game=MAC+%2B+ACE+MODEL&odds=LIVE&edge=BETA",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function WunTooLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
