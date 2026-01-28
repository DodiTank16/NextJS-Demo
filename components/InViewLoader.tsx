"use client";

import { useEffect, useRef, useState } from "react";
import DynamicLoader from "./loader/Loader";

type Props = {
  children: React.ReactNode;
  loaderText?: string;
  rootMargin?: string;
};

export default function InViewLoader({
  children,
  loaderText = "Loading",
  rootMargin = "200px",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [rootMargin]);
  

  return (
    <div ref={ref} className="relative min-h-[200px]">
      {!visible && (
        <div className="absolute inset-0 flex items-center justify-center">
          <DynamicLoader fullscreen={true} text={loaderText} />
        </div>
      )}
      {visible && children}
    </div>
  );
}
