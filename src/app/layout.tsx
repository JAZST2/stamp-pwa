import type { Metadata } from "next";
import { inter, sora, spaceMono } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "PerklyPh",
  description: "Your loyalty, rewarded.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
