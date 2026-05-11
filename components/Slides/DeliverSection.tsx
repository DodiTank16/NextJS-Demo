"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = "DELIVER".split("");

const STATS = [
  { value: "4+", label: "Years shipping", pct: 70 },
  { value: "50+", label: "Projects launched", pct: 85 },
  { value: "100%", label: "On-time delivery", pct: 100 },
];

// SVG arc for the circular progress ring
const RADIUS = 88;
const CIRC = 2 * Math.PI * RADIUS;

export default function DeliverSection() {
  const ref = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          refreshPriority: -1,
        },
      });

      tl.from(".dv-letter", {
        yPercent: 115,
        opacity: 0,
        duration: 1.1,
        stagger: 0.05,
        ease: "power4.out",
      });

      tl.from(
        ".dv-fade",
        { opacity: 0, y: 22, duration: 0.85, stagger: 0.1, ease: "power3.out" },
        "-=0.6",
      );

      tl.from(
        ".dv-rule",
        {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 1.0,
          ease: "power4.inOut",
        },
        "-=0.7",
      );

      // Circular arc draw-in
      if (ringRef.current) {
        gsap.set(ringRef.current, { strokeDashoffset: CIRC });
        tl.to(
          ringRef.current,
          { strokeDashoffset: 0, duration: 1.4, ease: "power3.out" },
          "-=0.9",
        );
      }

      // Stat number count-up feel
      tl.from(
        ".dv-stat-val",
        {
          opacity: 0,
          y: 16,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(2)",
        },
        "-=0.8",
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-screen bg-[#0e0b06] text-[#F4F1EC] flex flex-col justify-between px-8 md:px-20 py-14 overflow-hidden"
    >
      {/* Warm amber glow — bottom-right, opposite of Build's cool glow */}
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-150 h-150 rounded-full bg-[#F8BC14]/6 blur-[130px] pointer-events-none" />

      {/* Ghost watermark */}
      <span className="pointer-events-none select-none absolute -right-4 bottom-0 text-[38vw] font-bold leading-none text-white/3 font-cormorant">
        03
      </span>

      {/* Top bar */}
      <div className="dv-fade flex justify-between items-center relative z-10">
        <span className="text-[10px] tracking-[0.3em] uppercase font-rubik text-white/25">
          Launch &mdash; Growth &mdash; Impact
        </span>
        <span className="text-[10px] tracking-[0.3em] uppercase font-rubik text-white/25">
          03 / 03
        </span>
      </div>

      {/* Main content — REVERSED: stats left, title right */}
      <div className="relative z-10 flex flex-col lg:flex-row items-end justify-between gap-10">
        {/* Left: circular ring + stats */}
        <div className="flex flex-col gap-6 min-w-60">
          {/* Ring */}
          <div className="relative w-52 h-52 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              {/* Track */}
              <circle
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
              />
              {/* Animated arc */}
              <circle
                ref={ringRef}
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke="#F8BC14"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC}
              />
            </svg>
            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-cormorant text-[#F8BC14] leading-none">
                03
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase font-rubik text-white/25 mt-1">
                Stage
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-3">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="flex items-baseline justify-between gap-6"
              >
                <span className="dv-stat-val text-2xl font-bold font-cormorant text-[#F8BC14] leading-none">
                  {value}
                </span>
                <span className="text-[10px] tracking-[0.18em] uppercase font-rubik text-white/30">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: title block — RIGHT aligned */}
        <div className="flex flex-col gap-3 items-end text-right">
          <span className="dv-fade text-[10px] tracking-[0.3em] uppercase font-rubik text-white/25">
            What we ship
          </span>

          <div
            className="flex flex-wrap justify-end leading-[0.82]"
            aria-label="Deliver"
          >
            {LETTERS.map((letter, i) => (
              <span key={i} className="overflow-hidden inline-block">
                <span
                  className="dv-letter inline-block text-[12vw] md:text-[9.5vw] font-bold tracking-tight"
                >
                  {letter}
                </span>
              </span>
            ))}
          </div>

          <div className="dv-rule h-px bg-white/15 w-full mt-2" />

          <p className="dv-fade text-sm text-white/40 font-rubik leading-relaxed max-w-xs mt-1">
            Shipping products that make an impact — on time, on budget, and with
            the detail that makes users notice the difference.
          </p>

          <div className="dv-fade mt-1">
            <button
              type="button"
              className="group flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase font-rubik text-white/40 hover:text-[#F8BC14] transition-colors duration-300"
            >
              Start a project
              <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-14" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="dv-rule h-px bg-white/10 w-full relative z-10" />
    </div>
  );
}
