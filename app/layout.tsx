import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: { default: "CarsAndBikes — Vehicle Marketplace", template: "%s · CarsAndBikes" },
  description: "Buy and sell premium vehicles with confidence. Real-time chat, secure transactions, verified dealers.",
  keywords: ["cars", "bikes", "vehicles", "marketplace", "buy", "sell"],
  authors: [{ name: "CarsAndBikes" }],
  openGraph: {
    type: "website",
    siteName: "CarsAndBikes",
    title: "CarsAndBikes — Vehicle Marketplace",
    description: "Buy and sell premium vehicles with confidence.",
  },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "CarsAndBikes" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
