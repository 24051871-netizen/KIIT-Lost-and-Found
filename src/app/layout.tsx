import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "KIIT (R) OS // Campus Property Recovery",
  description:
    "Zero-Trust Lost and Found recovery network tailored for KIIT students, faculty, and hostel residents with QR verification.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KIIT Find",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-black text-zinc-100 antialiased selection:bg-white selection:text-black pb-16 md:pb-0">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomBar />
        </Providers>
      </body>
    </html>
  );
}
