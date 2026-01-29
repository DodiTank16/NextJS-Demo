"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { FC, ReactNode, useEffect, useRef } from "react";

type LenisScrollProviderProps = {
  children: ReactNode;
};
const LenisScrollProvider: FC<LenisScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  });

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}
      autoRaf={false}
    >
      {children as any}
    </ReactLenis>
  );
};

export default LenisScrollProvider;
