import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC, Orbitron } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  title: "WBTI · 卫戍协议重度依赖测试",
  description: "你是哪种卫戍协议重度依赖？测测你的WBTI！",
  keywords: ["WBTI", "卫戍协议", "重度依赖测试", "人格测试", "S.W.E.E.P."],
  openGraph: {
    title: "WBTI · 卫戍协议重度依赖测试",
    description: "你是哪种卫戍协议重度依赖？测测你的WBTI！",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable} ${orbitron.variable} antialiased`}
        style={{
          background: '#050709',
          color: '#e8ecf2',
          fontFamily: "var(--font-noto-sans-sc), -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
