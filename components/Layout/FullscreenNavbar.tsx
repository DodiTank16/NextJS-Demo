"use client";

import gsap from "gsap";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const menuItems = [
  { label: "Welcome", image: "https://picsum.photos/id/10/1024/720" },
  { label: "Introduction", image: "https://picsum.photos/id/20/1024/720" },
  { label: "Houses", image: "https://picsum.photos/id/30/1024/720" },
  { label: "Why Capsules®", image: "https://picsum.photos/id/40/1024/720" },
  { label: "Activities", image: "https://picsum.photos/id/50/1024/720" },
  { label: "Feedback", image: "https://picsum.photos/id/60/1024/720" },
];

export default function FullscreenNavbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setOpen(false);
      },
    });

    tl.to(menuRef.current?.children || [], {
      y: 40,
      opacity: 0,
      stagger: {
        each: 0.05,
        from: "end",
      },
      duration: 0.4,
      ease: "power3.in",
    });

    tl.to(
      panelRef.current,
      {
        scale: 0.96,
        opacity: 0,
        duration: 0.4,
        ease: "power3.inOut",
      },
      "-=0.3",
    );

    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.2",
    );
  };

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();

    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power2.out" },
    );

    tl.fromTo(
      panelRef.current,
      { scale: 0.97, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" },
      "-=0.15",
    );

    tl.fromTo(
      menuRef.current ? Array.from(menuRef.current.children) : [],
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.055,
        ease: "power3.out",
      },
      "-=0.2",
    );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        title="Full Menu"
        onClick={() => setOpen(true)}
        className="fixed top-6.5 right-4 md:right-6 z-[100] bg-black/85 text-white p-2.5 md:p-3 rounded-full hover:bg-black/95 transition-all"
      >
        <Menu size={20} className="md:w-[22px] md:h-[22px]" color="#8ec5ff" />
      </button>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#181717] backdrop-blur-md p-2"
        >
          {/* PANEL */}
          <div
            ref={panelRef}
            className="relative w-full h-full bg-[#2a2927] rounded-[90px] p-12 flex shadow-2xl border border-white/10"
          >
            {/* LEFT COLUMN */}
            <div className="flex-1">
              <ul
                ref={menuRef}
                className="space-y-[10px] text-[clamp(42px,4.6vw,68px)] leading-[1.05] font-light text-[#bcb7ae] mb-5"
              >
                {menuItems.map((item, i) => (
                  <li
                    key={i}
                    onMouseEnter={() => setActive(i)}
                    className={`cursor-pointer transition-colors duration-200 ${
                      active === i ? "text-white" : "hover:text-white"
                    }`}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>

              {/* SOCIAL */}
              <div className="flex flex-col items-start absolute gap-6 bottom-10 lg:flex-row">
                <div className="flex gap-3">
                  {["in", "ig", "dr", "be"].map((s, i) => (
                    <span
                      key={i}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-white/30 text-xs text-white/70 hover:text-white transition"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                {/* DISCLAIMER */}
                <p className="flex text-xs text-[#9c978d] max-w-[340px] leading-relaxed">
                  This website is just the concept work done by Dody to showcase
                  his capabilities.
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="hidden md:block w-[460px] h-[600px] rounded-[24px] overflow-hidden border border-white/10 relative">
              {menuItems.map((item, i) => (
                <Image
                  key={i}
                  src={item.image}
                  alt={item.label}
                  fill
                  className={`object-cover transition-opacity duration-500 ${
                    active === i ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* CLOSE BUTTON */}
            {/* <button
              onClick={() => setOpen(false)}
              className="absolute flex bottom-10 right-12 lg:right-12 items-center gap-3 bg-[#ece9e2] text-black px-5 py-2 rounded-full text-sm hover:bg-white transition"
            >
              Close
              <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center">
                <X size={14} />
              </span>
            </button> */}

            <button
              onClick={handleClose}
              className="absolute flex items-center gap-3 top-6 right-6 lg:top-auto lg:bottom-10 lg:right-2/4 bg-[#ece9e2] text-black pl-2 lg:pl-5 pr-2 py-2 rounded-full text-sm hover:bg-white transition-all duration-300 hover:scale-105 z-50 "
            >
              <span className="hidden lg:inline">Close</span>

              <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center">
                <X size={16} />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
