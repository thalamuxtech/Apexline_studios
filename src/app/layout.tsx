import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/content/site";
import { AnalyticsBootstrap } from "@/components/site/AnalyticsBootstrap";
import "./globals.css";

const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });
const editorial = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-editorial", weight: ["300", "400", "500", "600"], style: ["normal", "italic"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", weight: ["300", "400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: "/brand/og-default.png", width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description, images: ["/brand/og-default.png"] },
  keywords: ["architecture Lagos", "construction Nigeria", "interior design Lagos", "Apex-Line Studios", "Sumaila Onimisi Yusuf"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${editorial.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <AnalyticsBootstrap />
      </body>
    </html>
  );
}
