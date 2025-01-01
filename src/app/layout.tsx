import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TAROTIE",
  description: "タロットカードに隠されたメッセージを見つけましょう。",
  openGraph: {
    title: "タロットリーディング",
    description: "タロットカードに隠されたメッセージを見つけましょう。",
    images: [
      {
        url: "ogp.jpg",
        width: 1200,
        height: 630,
        alt: "タロットカード",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
