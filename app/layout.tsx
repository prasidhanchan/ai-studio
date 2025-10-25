import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Android Chrome */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
