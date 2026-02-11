"use client";

import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SquareTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const allowedRoutes = ["/about", "/blog", "/contact-us"];

  useEffect(() => {
    if (!containerRef.current) return;
    if (!allowedRoutes.includes(pathname)) return;

    const container = containerRef.current;

    // ---------- DEVICE RESPONSIVE GRID ----------
    const isMobile = window.innerWidth < 768;
    const squareSize = isMobile ? 60 : 100; // smaller squares on mobile

    const cols = Math.ceil(window.innerWidth / squareSize);
    const rows = Math.ceil(window.innerHeight / squareSize);
    // const total = cols * rows;
    const maxSquares = isMobile ? 500 : 1500;
    const total = Math.min(cols * rows, maxSquares);

    // ---------- LOCK SCROLL ----------
    const preventScroll = (e: Event) => e.preventDefault();

    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScroll);

    // ---------- RESET ----------
    container.innerHTML = "";
    gsap.killTweensOf("*");

    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    const squares: HTMLDivElement[] = [];

    for (let i = 0; i < total; i++) {
      const square = document.createElement("div");
      square.className = "square w-full h-full";
      container.appendChild(square);
      squares.push(square);
    }

    const tl = gsap.timeline({
      onComplete: unlock,
    });

    tl.fromTo(
      squares,
      {
        opacity: 0,
        scale: isMobile ? 0.9 : 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: isMobile ? 0.06 : 0.08,
        stagger: { each: isMobile ? 0.002 : 0.003, from: "random" },
        ease: "power2.out",
      },
    );

    tl.to(squares, {
      opacity: 0,
      scale: 0.9,
      duration: isMobile ? 0.06 : 0.08,
      delay: isMobile ? 0.2 : 0.3,
      stagger: { each: isMobile ? 0.002 : 0.003, from: "random" },
      ease: "power2.in",
    });

    function unlock() {
      container.style.display = "none";
      container.innerHTML = "";

      document.body.style.overflow = "";
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScroll);
    }

    return () => {
      tl.kill();
      unlock();
    };
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-auto hidden"
    />
  );
}
