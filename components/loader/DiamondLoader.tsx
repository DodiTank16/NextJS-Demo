"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function DiamondLoader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const squares = gsap.utils.toArray<HTMLElement>(".sq");

      if (squares.length !== 4) return; // safety check

      const d = 35;

      const positions = [
        { x: 0, y: -d },
        { x: d, y: 0 },
        { x: 0, y: d },
        { x: -d, y: 0 },
      ];

      squares.forEach((sq, i) => {
        gsap.set(sq, {
          xPercent: -50,
          yPercent: -50,
          x: positions[i].x,
          y: positions[i].y,
          rotate: 45,
        });

        gsap
          .timeline({
            repeat: -1,
            defaults: {
              duration: 0.4,
              ease: "power1.inOut",
            },
          })
          .to(sq, positions[(i + 2) % 4])
          .to(sq, positions[(i + 1) % 4])
          .to(sq, positions[(i + 3) % 4])
          .to(sq, positions[i]);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center bg-[#0b1220] z-999"
    >
      <div className="relative w-40 h-40">
        <div className="sq absolute top-1/2 left-1/2 w-10 h-10 bg-blue-300" />
        <div className="sq absolute top-1/2 left-1/2 w-10 h-10 bg-blue-400" />
        <div className="sq absolute top-1/2 left-1/2 w-10 h-10 bg-blue-500" />
        <div className="sq absolute top-1/2 left-1/2 w-10 h-10 bg-blue-600" />
      </div>
    </div>
  );
}
