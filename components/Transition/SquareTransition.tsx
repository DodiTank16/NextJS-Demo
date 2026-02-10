"use client";

import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SquareTransition() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const allowdRoutes = ["/about", "/blog", "/contact-us"]; // Add routes where you want the page-transition to occur

  useEffect(() => {
    if (!containerRef.current) return;
    // Skip transition on homePage and Unknown routes (e.g., 404)
    if (!allowdRoutes.includes(pathname)) return;
    

    const container = containerRef.current;

    // Cleanup previous run
    gsap.killTweensOf("*");
    container.innerHTML = "";

    const squareSize = 100;
    const cols = Math.ceil(window.innerWidth / squareSize);
    const rows = Math.ceil(window.innerHeight / squareSize);
    const total = cols * rows;

    const squares: HTMLDivElement[] = [];

    container.style.display = "flex";

    // Create grid
    for (let i = 0; i < total; i++) {
      const square = document.createElement("div");
      square.className = "square";
      container.appendChild(square);
      squares.push(square);
    }

    // GSAP Timeline
    const tl = gsap.timeline();

    tl.fromTo(
      squares,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.08,
        stagger: { each: 0.005, from: "random" },
        ease: "power2.out",
      },
    );

    tl.to(squares, {
      opacity: 0,
      scale: 0.9,
      duration: 0.08,
      delay: 0.4,
      stagger: { each: 0.005, from: "random" },
      ease: "power2.in",
      onComplete: () => {
        container.style.display = "none";
        container.innerHTML = "";
      },
    });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div id="squareContainer" ref={containerRef} style={{ display: "none" }} />
  );
}
