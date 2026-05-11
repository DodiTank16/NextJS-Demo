"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = "DELIVER".split("");

const STATS = [
  { value: "4+", label: "Years shipping" },
  { value: "50+", label: "Projects launched" },
  { value: "100%", label: "On-time delivery" },
];

export default function DeliverSection() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      });

      tl.from(".dv-letter", {
        yPercent: 115,
        duration: 1.1,
        stagger: 0.05,
        ease: "power4.out",
      });

      tl.from(
        ".dv-fade",
        {
          opacity: 0,
          y: 20,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.65",
      );

      tl.from(
        ".dv-rule",
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power4.inOut",
        },
        "-=0.8",
      );

      // Stat bars animate width on enter
      tl.from(
        ".dv-bar",
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.5",
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-screen bg-[#111111] text-[#F4F1EC] flex flex-col justify-between px-8 md:px-20 py-14 overflow-hidden"
    >
      {/* Ghost watermark */}
      <span className="pointer-events-none select-none absolute -right-4 bottom-0 text-[38vw] font-bold leading-none text-white/3 font-cormorant">
        03
      </span>

      {/* Accent gradient */}
      <div className="absolute bottom-0 left-0 w-150 h-100 bg-linear-to-tr from-[#F8BC14]/10 via-transparent to-transparent pointer-events-none" />

      {/* Top bar */}
      <div className="dv-fade flex justify-between items-center relative z-10">
        <span className="text-[10px] tracking-[0.3em] uppercase font-rubik text-white/30">
          03 / 03
        </span>
        <span className="text-[10px] tracking-[0.3em] uppercase font-rubik text-white/30">
          Launch &mdash; Growth &mdash; Impact
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-end justify-between gap-10">
        {/* Left: title */}
        <div className="flex flex-col gap-3">
          <span className="dv-fade text-[10px] tracking-[0.3em] uppercase font-rubik text-white/25">
            What we ship
          </span>

          <div className="flex flex-wrap leading-[0.82]" aria-label="Deliver">
            {LETTERS.map((letter, i) => (
              <span key={i} className="overflow-hidden inline-block">
                <span className="dv-letter inline-block text-[12vw] md:text-[9.5vw] font-bold tracking-tight">
                  {letter}
                </span>
              </span>
            ))}
          </div>

          <div className="dv-rule h-px bg-white/15 w-full mt-2" />

          <p className="dv-fade text-sm text-white/40 font-rubik leading-relaxed max-w-xs mt-1">
            Shipping products that make an impact — on time, on budget, and
            with the detail that makes users notice the difference.
          </p>
        </div>

        {/* Right: stats */}
        <div className="flex flex-col gap-5 min-w-55">
          {STATS.map(({ value, label }, i) => (
            <div key={i} className="dv-fade flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-bold text-[#F8BC14] font-cormorant leading-none">
                  {value}
                </span>
                <span className="text-[10px] tracking-[0.18em] uppercase font-rubik text-white/30">
                  {label}
                </span>
              </div>
              <div className="h-px bg-white/10 w-full overflow-hidden">
                <div
                  className="dv-bar h-full bg-[#F8BC14]/50"
                  style={{
                    width: i === 0 ? "70%" : i === 1 ? "85%" : "100%",
                  }}
                />
              </div>
            </div>
          ))}

          <div className="dv-fade mt-2">
            <button
              type="button"
              className="group flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase font-rubik text-white/40 hover:text-[#F8BC14] transition-colors duration-300"
            >
              <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-14" />
              Start a project
            </button>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="dv-rule h-px bg-white/10 w-full relative z-10" />
    </div>
  );
}
