import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const sans = localFont({ src: "./fonts/GeistVF.woff", variable: "--font-sans", weight: "100 900", display: "swap" });
const mono = localFont({ src: "./fonts/GeistMonoVF.woff", variable: "--font-mono", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  title: "Nay Htet Kyaw (Anascence) — full-stack engineer",
  description: "Nay Htet Kyaw builds internal products at Issa Compass. Go, TypeScript, Next.js, PostgreSQL and Docker.",
  icons: { icon: "/dev.ico" },
};

export const viewport: Viewport = { themeColor: "#0b0b0b", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
