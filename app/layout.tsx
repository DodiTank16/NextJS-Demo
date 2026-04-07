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
import LenisScrollProvider from "./providers/lenis-provider";

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
      <body
        className={`${merriweather.variable} ${rubik.variable} ${inknutAntiqua.variable} ${cormorant.variable} antialiased`}
      >
        {/* <FullscreenNavbar /> */}
        <SquareTransition />
        <Header />
        <LenisScrollProvider>{children}</LenisScrollProvider>
        <Footer />
      </body>
    </html>
  );
}
