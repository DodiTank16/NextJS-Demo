"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { FC, ReactNode, useEffect, useRef } from "react";

type LenisScrollProviderProps = {
  children: ReactNode;
};
const LenisScrollProvider: FC<LenisScrollProviderProps> = ({ children }) => {
  const lenisRef = useRef<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // Lenis owns the window scroll, so Next's scroll restoration / window.scrollTo
  // is overridden by its RAF loop. Reset through Lenis on every route change.
  useEffect(() => {
    const reset = () => {
      lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    };

    reset();
    // Run again on the next frame in case Next restores the scroll after us.
    const raf = requestAnimationFrame(reset);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

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
