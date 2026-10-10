import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./redline.css";
import "./responsive.css";
import { SITE_URL, SITE_DESCRIPTION, socialImage } from "@/lib/seo";
import PwaManager from "@/components/redline/pwa-manager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Redline \u2014 Financial Intelligence, In Focus.", template: "%s | Redline" },
  description: SITE_DESCRIPTION, applicationName: "Redline", manifest: "/manifest.webmanifest",
  openGraph: { type: "website", siteName: "Redline", title: "Redline \u2014 Financial Intelligence, In Focus.", description: SITE_DESCRIPTION, url: SITE_URL, images: [socialImage] },
  twitter: { card: "summary_large_image", title: "Redline \u2014 Financial Intelligence, In Focus.", description: SITE_DESCRIPTION, images: [socialImage.url] },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  appleWebApp: { capable: true, title: "Redline", statusBarStyle: "black-translucent" },
};
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#08090C", colorScheme: "dark", viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<PwaManager /></body>
    </html>
  );
}
