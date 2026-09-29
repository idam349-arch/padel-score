import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Padel Score - Professional & Americano Scoreboard",
  description: "Track your padel matches with professional scoring (sets, games, tiebreak) or Americano rotating partner format with real-time leaderboard.",
  keywords: "padel, score, scoreboard, americano, tiebreak, padel score tracker",
  authors: [{ name: "Padel Score App" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
