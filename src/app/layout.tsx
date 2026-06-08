import type { Metadata } from "next";
import { Space_Grotesk, Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Net Nirman — Building Digital Empires",
  description:
    "Net Nirman is an AI-powered web and software development agency based in Noida, India. We build stunning websites, powerful apps, and intelligent digital solutions.",
  keywords: ["web development", "software agency", "Noida", "India", "AI solutions", "Net Nirman"],
  icons: {
    icon: "/nirmanlogo.png",
    shortcut: "/nirmanlogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-cream text-black antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
