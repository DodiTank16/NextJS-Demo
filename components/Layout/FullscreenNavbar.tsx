"use client";

import gsap from "gsap";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const menuItems = [
  { label: "Welcome", image: "/images/nav-1.jpg" },
  { label: "Introduction", image: "/images/nav-2.jpg" },
  { label: "Houses", image: "/images/nav-3.jpg" },
  { label: "Why Capsules®", image: "/images/nav-4.jpg" },
  { label: "Activities", image: "/images/nav-5.jpg" },
  { label: "Feedback", image: "/images/nav-6.jpg" },
];

export default function CapsulesNavbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
        className="fixed top-6 right-6 z-50 bg-black/85 text-white p-3 rounded-full"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2a2927] backdrop-blur-md"
        >
          {/* PANEL */}
          <div
            ref={panelRef}
            className="relative w-full h-full bg-[#2a2927] rounded-[30px] p-12 flex shadow-2xl border border-white/10"
          >
            {/* LEFT COLUMN */}
            <div className="flex-1">
              <ul
                ref={menuRef}
                className="space-y-[10px] text-[clamp(42px,4.6vw,68px)] leading-[1.05] font-light text-[#bcb7ae]"
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
              <div className="absolute bottom-10 left-12 flex gap-3">
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
              <p className="absolute bottom-10 left-[160px] text-xs text-[#9c978d] max-w-[340px] leading-relaxed">
                This website is just the concept work done by Moyra to showcase
                our capabilities.
              </p>
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
            <button
              onClick={() => setOpen(false)}
              className="absolute bottom-10 right-12 flex items-center gap-3 bg-[#ece9e2] text-black px-5 py-2 rounded-full text-sm hover:bg-white transition"
            >
              Close
              <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center">
                <X size={14} />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
