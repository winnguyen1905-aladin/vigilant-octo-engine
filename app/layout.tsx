import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Link from "next/link"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IoT Attack Detection Frontend",
  description: "Real-time IoT network attack detection using GNN",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-primary text-primary-foreground sticky top-0 z-50 border-b">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                IoT Attack Detection
              </Link>
              <div className="flex gap-6">
                <Link href="/" className="hover:opacity-80 transition">
                  Dashboard
                </Link>
                <Link href="/predict" className="hover:opacity-80 transition">
                  Single Prediction
                </Link>
                {/* <Link href="/batch" className="hover:opacity-80 transition">
                  Batch Prediction
                </Link> */}
                <Link href="/capture" className="hover:opacity-80 transition">
                  Live Capture
                </Link>
                <Link href="/model-info" className="hover:opacity-80 transition">
                  Model Info
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="bg-muted py-4 border-t text-center text-muted-foreground text-sm">
            <p>IoT Attack Detection Frontend • Real-time network threat analysis</p>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
