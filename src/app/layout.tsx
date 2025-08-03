import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FeatherIcons from "@/components/FeatherIcons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slide – Deliver Along Your Commute",
  description: "Slide pairs local packages with everyday drivers already headed the right direction—cutting costs for merchants and putting money back in drivers' pockets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://unpkg.com/feather-icons"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800`}
      >
        {children}
        <FeatherIcons />
      </body>
    </html>
  );
}
