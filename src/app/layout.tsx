import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Navbar } from "@/components/layout/navbar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { RoleSwitcher } from "@/components/layout/role-switcher";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OffPeak Spaces | Find spaces at off-peak prices",
  description: "Discover and book underutilized spaces at discounted off-peak prices. Parking, restaurants, hotels, co-working and more.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OffPeak Spaces",
  },
};

export const viewport: Viewport = {
  themeColor: "#14B8A6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Skip to content
        </a>
        <NuqsAdapter>
          <Navbar />
          <main id="main-content" className="flex-1 pb-16 lg:pb-0">
            {children}
          </main>
          <MobileBottomNav />
          <RoleSwitcher />
          <footer className="border-t py-6 px-4 text-center text-sm text-slate-500 pb-20 lg:pb-6">
            <div className="flex justify-center gap-6">
              <Link href="/help">Help</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
            <p className="mt-2">&copy; 2026 OffPeak Spaces by Rothian Spaces</p>
          </footer>
        </NuqsAdapter>
        <script dangerouslySetInnerHTML={{ __html: `
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    })
  }
` }} />
      </body>
    </html>
  );
}
