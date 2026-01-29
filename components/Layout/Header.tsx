"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export default function Header() {
  const pathname = usePathname();
  const [atTop, setAtTop] = useState(true);
  const [open, setOpen] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const burgerMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  /* ----------------------------- Scroll → header morph ----------------------------- */
  useEffect(() => {
    const onScroll = () => {
      setAtTop(window.scrollY < 50);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ----------------------------- Cursor-follow underline ----------------------------- */
  const moveUnderline = (el: HTMLElement) => {
    const nav = navRef.current;
    const underline = underlineRef.current;
    if (!nav || !underline) return;

    const navRect = nav.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    gsap.to(underline, {
      width: rect.width,
      x: rect.left - navRect.left,
      opacity: 1,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const hideUnderline = () => {
    gsap.to(underlineRef.current, { opacity: 0, duration: 0.2 });
    // underlineRef.current.style.transform = `translateX(${0}px)`; // optional: reset position of underline
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!progressRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,

          onUpdate: (self) => {
            gsap.to(progressRef.current, {
              opacity: self.progress > 0.01 ? 1 : 0,
              duration: 0.25,
              ease: "power2.out",
            });
          },
        },
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        !burgerMenuButtonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      const target = event.target as Node;

      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        !burgerMenuButtonRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed z-50 inset-x-0 mx-auto mt-4 px-6 py-4 rounded-full transition-all duration-700
      ${atTop ? "max-w-2xl" : "max-w-4xl bg-black/90 backdrop-blur-xl"}`}
    >
      <div className="flex items-center justify-between relative">
        {/* LOGO */}
        <Link
          href="/"
          className={`font-bold uppercase tracking-tight transition-colors text-blue-300 hover:text-yellow-500 text-lg md:text-xl lg:text-lg`}
        >
          <span className={!atTop ? "text-yellow-500" : ""}>✺</span> Tank
          Corporation
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          ref={burgerMenuButtonRef}
          title="Burger Menu"
          onClick={() => setOpen((prev) => !prev)}
          className="relative z-50 md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1 cursor-pointer hover:border-2 border-blue-300 rounded-md p-2 transition-all"
        >
          <span
            className={`h-[2px] w-6 bg-blue-300 transition-all duration-300 ${
              open ? "rotate-45 translate-y-[6px]" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-blue-300 transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-blue-300 transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-[6px]" : ""
            }`}
          />
        </button>

        {/* NAV */}
        <nav
          ref={navRef}
          onMouseLeave={hideUnderline}
          className={`
    absolute md:static top-full left-0 w-full md:w-auto flex flex-col md:flex-row gap-6 md:gap-8 px-6 md:px-0 mt-4 md:mt-0 bg-[#F4F1EC] md:bg-transparent overflow-hidden transition-all duration-500 ease-in
    ${
      open
        ? "max-h-500 h-40 opacity-100 translate-y-0 pointer-events-auto py-6"
        : "max-h-0 opacity-0 -translate-y-2 pointer-events-none md:pointer-events-auto md:opacity-100 md:translate-y-0 md:max-h-none"
    }`}
        >
          {/* DESKTOP CURSOR UNDERLINE */}
          <span
            ref={underlineRef}
            className="absolute bottom-0 bg-current opacity-0 transition-all duration-300 hidden md:block"
          />

          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={(e) => moveUnderline(e.currentTarget)}
                className={`relative text-blue-300 transition-all hover:text-yellow-500 ${
                  isActive
                    ? "font-semibold text-yellow-500 opacity-100"
                    : "opacity-70 hover:opacity-100 hover:text-lg"
                }`}
              >
                {item.label}

                {/* MOBILE ACTIVE INDICATOR */}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-current md:hidden" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* SCROLL PROGRESS BAR */}
      <div className="absolute left-5 bottom-0 w-[calc(100%-40px)] h-[2.5px] bg-white/20 overflow-hidden rounded-full">
        <div
          ref={progressRef}
          className="h-full w-full bg-gradient-to-r from-yellow-400 to-orange-500 origin-left scale-x-0"
        />
      </div>
    </header>
  );
}
