import { useEffect, useRef, useState } from "react";

type UseInViewOptions = IntersectionObserverInit & {
  /** If true, stays true after first intersection — prevents remounting heavy components on re-entry */
  once?: boolean;
};

export function useInView(
  options: UseInViewOptions = { threshold: 0.1 }
) {
  const { once, ...observerOptions } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) observer.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, observerOptions);

    observer.observe(ref.current);

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
