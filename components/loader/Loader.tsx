"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type LoaderProps = {
  text?: string;
  fullscreen?: boolean;
};

export default function Loader({
  text = "Loading",
  fullscreen = false,
}: LoaderProps) {
  const dotsRef = useRef<HTMLSpanElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        dotsRef.current,
        { y: 0, opacity: 0.3 },
        {
          y: -8,
          opacity: 1,
          duration: 0.4,
          stagger: 0.15,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black"
          : "inline-flex items-center gap-2"
      }
    >
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) dotsRef.current[i] = el;
            }}
            className="w-2 h-2 rounded-full bg-yellow-400"
          />
        ))}
      </span>

      <span className="text-[#F4F1EC] text-sm tracking-wide ml-2">{text}</span>
    </div>
  );
}
