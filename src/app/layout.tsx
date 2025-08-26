import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Time & Date Tools - World Clock, Time Zone Converter, Calendar & More",
  description: "Comprehensive time and date tools including world clock, time zone converter, calendar, date calculator, timer, stopwatch, and astronomical calculations. Free, no registration required.",
  keywords: [
    "time tools", "date tools", "world clock", "time zone converter", "calendar", 
    "date calculator", "timer", "stopwatch", "sunrise sunset", "moon phases", 
    "meeting planner", "time zones", "astronomical calculations", "free time tools"
  ],
  authors: [{ name: "Time & Date Tools Team" }],
  creator: "Time & Date Tools",
  publisher: "Time & Date Tools",
  robots: "index, follow",
  openGraph: {
    title: "Time & Date Tools - Comprehensive Time & Date Calculator Suite",
    description: "Free online time and date tools including world clock, time zone converter, calendar, timer, and astronomical calculations. No registration required.",
    url: "https://timedatetools.com",
    siteName: "Time & Date Tools",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-time-date-tools.jpg",
        width: 1200,
        height: 630,
        alt: "Time & Date Tools - World Clock and Time Zone Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Time & Date Tools - Free Online Time & Date Calculators",
    description: "World clock, time zone converter, calendar, timer, and astronomical tools. Free and easy to use.",
    images: ["/og-time-date-tools.jpg"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
  other: {
    "twitter:label1": "Tools Available",
    "twitter:data1": "7+ Time & Date Tools",
    "twitter:label2": "Registration",
    "twitter:data2": "Not Required",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Time & Date Tools" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
