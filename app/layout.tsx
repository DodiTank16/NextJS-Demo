import SquareTransition from "@/components/Transition/SquareTransition";
import type { Metadata, Viewport } from "next";
import {
  Cormorant,
  Inknut_Antiqua,
  Merriweather,
  Rubik,
} from "next/font/google";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import "./globals.css";
import LenisScrollProvider from "@/app/providers/lenis-provider";
import FullscreenNavbar from "@/components/Layout/FullscreenNavbar";
import { Analytics } from "@vercel/analytics/next";

const merriweather = Merriweather({
  weight: "400",
  variable: "--font-merriweather",
  subsets: ["latin"],
});

const rubik = Rubik({
  weight: "400",
  variable: "--font-rubik",
  subsets: ["latin"],
});

const inknutAntiqua = Inknut_Antiqua({
  weight: "400",
  variable: "--font-inknut-antiqua",
  subsets: ["latin"],
});

const cormorant = Cormorant({
  weight: "400",
  variable: "--font-cormorant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tank Corporation",
  description: "This is my first demo of Next.js application!",
};

export const viewport: Viewport = {
  themeColor: "white",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Base Mapbox GL layout styles — must match the runtime script version (v2.15.0) */}
        <link rel="stylesheet" href="/mapbox-gl.css" />
      </head>
      <body
        className={`${merriweather.variable} ${rubik.variable} ${inknutAntiqua.variable} ${cormorant.variable} antialiased`}
      >
        <div className="relative z-10 bg-background">
          <FullscreenNavbar />
          <SquareTransition />
          <Header />
          <LenisScrollProvider>{children}</LenisScrollProvider>
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
