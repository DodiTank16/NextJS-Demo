"use client";

import gsap from "gsap";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const menuItems = [
  { label: "Home", image: "/images/nav-1.jpg", href: "/" },
  { label: "Projects", image: "/images/nav-2.jpg", href: "/projects" },
  { label: "About Us", image: "/images/nav-3.jpg", href: "/about" },
  { label: "Contact Us", image: "/images/nav-4.jpg", href: "/contact" },
  { label: "Blogs", image: "/images/nav-5.jpg", href: "/blog" },
  { label: "Faqs", image: "/images/nav-6.jpg", href: "/faq" },
];

const socialItems = [
  { label: "in", link: "https://www.linkedin.com/in/doditank" },
  { label: "ig", link: "https://www.instagram.com/tankdodi" },
  { label: "gh", link: "https://github.com/DodiTank16" },
  { label: "ps", link: "https://tankdodi.vercel.app/" },
];

export default function CapsulesNavbar() {
  const [open, setOpen] = useState<boolean>(false);
  const [active, setActive] = useState<number>(0);

  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const closeMenu = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setOpen(false);
      },
    });

    tl.to(menuRef.current ? Array.from(menuRef.current.children) : [], {
      y: 18,
      opacity: 0,
      duration: 0.3,
      stagger: 0.035,
      ease: "power3.in",
    });

    tl.to(
      panelRef.current,
      {
        scale: 0.97,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
      },
      "-=0.15",
    );

    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      },
      "-=0.15",
    );
  };

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();

    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });

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
        className="fixed top-6 right-6 z-999 bg-black/85 text-white p-3 rounded-full">
        <Menu size={22} />
      </button>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2a2927] backdrop-blur-md">
          {/* PANEL */}
          <div
            ref={panelRef}
            className="relative w-full h-full bg-[#2a2927] rounded-[30px] p-12 flex shadow-2xl border border-white/10">
            {/* LEFT COLUMN */}
            <div className="flex-1">
              <ul
                ref={menuRef}
                className="space-y-[10px] text-[clamp(42px,4.6vw,68px)] leading-[1.05] font-light text-[#bcb7ae]">
                {menuItems.map((item, i) => (
                  <li
                    key={i}
                    onMouseEnter={() => setActive(i)}
                    className={`transition-colors duration-200 ${pathname === item.href ? "text-white" : "hover:text-white"}`}>
                    <Link href={item.href} onClick={closeMenu} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* SOCIAL + DISCLAIMER */}
              <div className="absolute bottom-10 left-12 flex flex-row items-center gap-8 max-lg:flex-col max-lg:items-start max-lg:gap-4">
                {/* SOCIAL */}
                <div className="flex gap-3">
                  {socialItems.map((s, i) => (
                    <a
                      key={i}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-white/30 text-xs text-white/70 hover:text-white transition hover:bg-white/10 cursor-pointer">
                      {s.label}
                    </a>
                  ))}
                </div>

                {/* DISCLAIMER */}
                <p className="text-xs text-[#9c978d] max-w-85 leading-relaxed ">
                  Building thoughtful digital experiences where creativity meets technology.
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="hidden md:block w-[460px] h-full rounded-[24px] overflow-hidden border border-white/10 relative">
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
              onClick={closeMenu}
              className="absolute bottom-10 right-12 flex items-center gap-3 bg-[#ece9e2] text-black px-5 py-2 rounded-full text-sm hover:bg-white transition">
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
