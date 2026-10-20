import type { Metadata, Viewport } from "next";
import { Martian_Mono, Space_Grotesk, Unbounded } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bizcraft.co.in"),
  title: "Bizcraft — Custom bag manufacturer in Mumbai since 2003",
  description:
    "Bizcraft designs and manufactures custom backpacks, laptop, travel and duffle bags for employee kits, promotions, OEM brands and the forces — from our own factory in Bhiwandi.",
  openGraph: {
    title: "Bizcraft — Bags built to your brief",
    description:
      "Custom bags for employee kits, promotions, OEM brands and the forces. Manufacturing in Bhiwandi since 2003.",
    type: "website",
    locale: "en_IN",
  },
};

// Without JS, show everything that would otherwise wait for an animation.
const noJs =
  "[data-hero],[data-split],[data-reveal],[data-reveal] > *{opacity:1!important}[data-intro]{display:none!important}";

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${unbounded.variable} ${grotesk.variable} ${martian.variable} antialiased`}
    >
      <head>
        <noscript>
          <style>{noJs}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
