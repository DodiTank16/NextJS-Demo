"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = "DESIGN".split("");

export default function DesignSection() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      });

      // Letter-by-letter slide up from clip
      tl.from(".ds-letter", {
        yPercent: 115,
        duration: 1.1,
        stagger: 0.055,
        ease: "power4.out",
      });

      // Secondary elements fade in
      tl.from(
        ".ds-fade",
        {
          opacity: 0,
          y: 20,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.6",
      );

      // Horizontal rules expand from left
      tl.from(
        ".ds-rule",
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          stagger: 0.12,
          ease: "power4.inOut",
        },
        "-=0.8",
      );

      // Dot grid stagger pop-in
      tl.from(
        ".ds-dot",
        {
          scale: 0,
          opacity: 0,
          duration: 0.45,
          stagger: { each: 0.03, from: "random" },
          ease: "back.out(2.5)",
        },
        "-=0.9",
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-screen bg-[#F4F1EC] text-black flex flex-col justify-between px-8 md:px-20 py-14 overflow-hidden"
    >
      {/* Ghost watermark */}
      <span className="pointer-events-none select-none absolute -right-8 bottom-0 text-[38vw] font-bold leading-none text-black/4 font-cormorant">
        01
      </span>

      {/* Top bar */}
      <div className="ds-fade flex justify-between items-center relative z-10">
        <span className="text-[10px] tracking-[0.3em] uppercase font-rubik text-black/40">
          01 / 03
        </span>
        <span className="text-[10px] tracking-[0.3em] uppercase font-rubik text-black/40">
          UX &mdash; UI &mdash; Visual Identity
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-end justify-between gap-10">
        {/* Left: title block */}
        <div className="flex flex-col gap-3">
          <span className="ds-fade text-[10px] tracking-[0.3em] uppercase font-rubik text-black/35">
            What we create
          </span>

          {/* Clipped title — each letter has its own clip container */}
          <div className="flex leading-[0.82]" aria-label="Design">
            {LETTERS.map((letter, i) => (
              <span key={i} className="overflow-hidden inline-block">
                <span className="ds-letter inline-block text-[15vw] md:text-[12vw] font-bold tracking-tight">
                  {letter}
                </span>
              </span>
            ))}
          </div>

          <div className="ds-rule h-px bg-black/20 w-full mt-2" />

          <p className="ds-fade text-sm text-gray-500 font-rubik leading-relaxed max-w-xs mt-1">
            We craft pixel-perfect interfaces with intentional hierarchy —
            bridging aesthetics with function through purposeful motion.
          </p>
        </div>

        {/* Right: dot grid + caption */}
        <div className="flex flex-col gap-5 min-w-50">
          <div className="grid grid-cols-10 gap-1.75">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="ds-dot w-1.25 h-1.25 rounded-full bg-black/20"
              />
            ))}
          </div>

          <div className="ds-fade flex flex-col gap-1">
            {["Typography", "Layout Systems", "Motion Design", "Brand Identity"].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-3 h-px bg-black/30" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-rubik text-black/40">
                    {item}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="ds-rule h-px bg-black/15 w-full relative z-10" />
    </div>
  );
}
