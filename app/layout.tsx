import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Bebas_Neue,
  Great_Vibes,
  Agbalumo,
} from "next/font/google";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import "./globals.css";
import LenisScrollProvider from "./providers/lenis-provider";
import SquareTransition from "@/components/Transition/SquareTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

const agbalumo = Agbalumo({
  weight: "400",
  variable: "--font-agbalumo",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${greatVibes.variable} ${agbalumo.variable} antialiased`}
      >
        <SquareTransition />
        <Header />
        <LenisScrollProvider>{children}</LenisScrollProvider>
        <Footer />
      </body>
    </html>
  );
}
