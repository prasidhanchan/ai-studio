import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Studio",
  description: "Create Nano Banana images without watermark",
  metadataBase: new URL("https://aistudio-unofficial.vercel.app"),
  openGraph: {
    url: "/",
    siteName: "AI Studio",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "AI Studio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/icon1.png",
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="AI Studio" />

        {/* PNG */}
        <link rel="icon" type="image/png" sizes="16x16" href="/icon1.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon2.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/icon3.png" />

        {/* SVG */}
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
      </head>

      {/* Vercel Analytics */}
      <Analytics />
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
