import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Check Your IP Address | IPPeek",
  description: "Instantly check your IP address, location, ISP, and device information with IPPeek's free IP lookup tool.",
  keywords: ["IP checker", "IP lookup", "IP address", "IP location", "ISP lookup", "device info"],
  openGraph: {
    title: "Check Your IP Address | IPPeek",
    description: "Instantly check your IP address, location, ISP, and device information with IPPeek's free IP lookup tool.",
    url: "https://ippeek.example.com",
    siteName: "IPPeek",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
