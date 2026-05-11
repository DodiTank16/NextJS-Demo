"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const LETTERS = "BUILD".split("");

const STACK = [
  "React",
  "·",
  "Next.js",
  "·",
  "TypeScript",
  "·",
  "Node.js",
  "·",
  "GSAP",
  "·",
  "PostgreSQL",
  "·",
  "Redis",
  "·",
  "Tailwind",
  "·",
  "GraphQL",
  "·",
  "Docker",
  "·",
  "Prisma",
  "·",
  "AWS",
  "·",
];

export default function BuildSection() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const marqueeTween = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Seamless marquee — content is duplicated so we animate by 50%
      if (trackRef.current) {
        marqueeTween.current = gsap.to(trackRef.current, {
          x: () => -(trackRef.current!.scrollWidth / 2),
          ease: "none",
          duration: 22,
          repeat: -1,
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          refreshPriority: -1,
        },
      });

      tl.from(".bs-letter", {
        yPercent: 115,
        duration: 1.1,
        stagger: 0.07,
        ease: "power4.out",
      });

      tl.from(
        ".bs-fade",
        {
          opacity: 0,
          y: 20,
          duration: 0.9,
          stagger: 0.09,
          ease: "power3.out",
        },
        "-=0.7",
      );

      tl.from(
        ".bs-rule",
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power4.inOut",
        },
        "-=0.8",
      );
    }, ref);

    return () => {
      marqueeTween.current?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-screen bg-[#0a0a0a] text-[#F4F1EC] flex flex-col justify-between py-14 overflow-hidden"
    >
      {/* Ghost watermark */}
      <span className="pointer-events-none select-none absolute -left-4 bottom-0 text-[38vw] font-bold leading-none text-white/3 font-cormorant">
        02
      </span>

      {/* Yellow glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-125 h-125 rounded-full bg-[#F8BC14]/8 blur-[120px] pointer-events-none" />

      {/* Top bar */}
      <div className="bs-fade flex justify-between items-center px-8 md:px-20 relative z-10">
        <span className="text-[10px] tracking-[0.3em] uppercase font-rubik text-white/30">
          02 / 03
        </span>
        <span className="text-[10px] tracking-[0.3em] uppercase font-rubik text-white/30">
          Engineering &mdash; Performance &mdash; Scale
        </span>
      </div>

      {/* Marquee band */}
      <div className="relative z-10 overflow-hidden border-y border-white/8 py-3">
        <div
          ref={trackRef}
          className="flex whitespace-nowrap will-change-transform"
        >
          {/* Duplicated for seamless loop */}
          {[...STACK, ...STACK].map((item, i) => (
            <span
              key={i}
              className={`inline-block px-4 text-[11px] tracking-[0.25em] uppercase font-rubik ${
                item === "·" ? "text-[#F8BC14]" : "text-white/25"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="px-8 md:px-20 relative z-10 flex flex-col lg:flex-row items-end justify-between gap-10">
        {/* Left: title */}
        <div className="flex flex-col gap-3">
          <span className="bs-fade text-[10px] tracking-[0.3em] uppercase font-rubik text-white/25">
            What we engineer
          </span>

          <div className="flex leading-[0.82]" aria-label="Build">
            {LETTERS.map((letter, i) => (
              <span key={i} className="overflow-hidden inline-block">
                <span className="bs-letter inline-block text-[15vw] md:text-[12vw] font-bold tracking-tight text-[#F8BC14]">
                  {letter}
                </span>
              </span>
            ))}
          </div>

          <div className="bs-rule h-px bg-white/15 w-full mt-2" />

          <p className="bs-fade text-sm text-white/40 font-rubik leading-relaxed max-w-xs mt-1">
            Engineering scalable systems that perform at the edge. We turn
            complex requirements into clean, maintainable architecture.
          </p>
        </div>

        {/* Right: tech list + stat */}
        <div className="flex flex-col gap-6 min-w-55">
          {/* Stat */}
          <div className="bs-fade flex flex-col">
            <span className="text-5xl font-bold text-[#F8BC14] font-cormorant leading-none">
              99.9
              <span className="text-2xl">%</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-rubik text-white/30 mt-1">
              Uptime guarantee
            </span>
          </div>

          <div className="bs-rule h-px bg-white/12 w-full" />

          {/* Tech grid */}
          <div className="bs-fade grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              "React",
              "Next.js",
              "TypeScript",
              "Node.js",
              "PostgreSQL",
              "Redis",
            ].map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-rubik text-white/30"
              >
                <span className="w-1 h-1 rounded-full bg-[#F8BC14] shrink-0" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="bs-rule h-px bg-white/8 w-full relative z-10 mx-0" />
    </div>
  );
}
