"use client";

import gsap from "gsap";
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

  const navRef = useRef(null);
  const underlineRef = useRef(null);

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
  const moveUnderline = (el) => {
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

  // const hideUnderline = () => {
  //   if (!underlineRef.current) return;
  //   underlineRef.current.style.opacity = 0;
  // };

  return (
    <header
      className={`fixed z-50 inset-x-0 mx-auto mt-4 px-6 py-4 rounded-full transition-all duration-700
      ${atTop ? "max-w-2xl" : "max-w-4xl bg-black/90 backdrop-blur-xl"}`}
    >
      <div className="flex items-center justify-between relative">
        {/* LOGO */}
        <Link
          href="/"
          className={`font-bold uppercase tracking-tight transition-colors ${
            atTop ? "text-blue-300" : "text-blue-300"
          }`}
        >
          ✺ Tank Corporation
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="relative z-50 md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1"
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
    absolute md:static top-full left-0 w-full md:w-auto flex flex-col md:flex-row gap-6 md:gap-8 px-6 md:px-0 mt-4 md:mt-0 bg-indigo-800 md:bg-transparent overflow-hidden transition-all duration-500 ease-in
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
                className={`relative text-blue-300 transition-all ${
                  isActive
                    ? "font-semibold text-yellow-500 opacity-100"
                    : "opacity-70 hover:opacity-100"
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
    </header>
  );
}
