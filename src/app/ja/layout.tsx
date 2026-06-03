import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP, Noto_Sans_SC, Orbitron } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "WBTI · 衛戍プロトコル依存度テスト",
  description: "あなたはどのタイプの衛戍プロトコル中毒？WBTIで診断しよう！",
  keywords: ["WBTI", "衛戍プロトコル", "依存度テスト", "人格テスト", "S.W.E.E.P.", "アークナイツ"],
  openGraph: {
    title: "WBTI · 衛戍プロトコル依存度テスト",
    description: "あなたはどのタイプの衛戍プロトコル中毒？WBTIで診断しよう！",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} ${notoSansSC.variable} ${orbitron.variable} antialiased`}
        style={{
          background: '#050709',
          color: '#e8ecf2',
          fontFamily: "var(--font-noto-sans-jp), var(--font-noto-sans-sc), -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
