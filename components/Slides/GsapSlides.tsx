"use client";

import { sentences } from "@/utils/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function GsapSlides() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils
        .toArray<HTMLElement>(".gsapSlides-section")
        .slice(0, -1);

      panels.forEach((panel) => {
        const innerpanel = panel.querySelector(
          ".gsapSlides-inner",
        ) as HTMLElement;
        if (!innerpanel) return;

        const panelHeight = innerpanel.offsetHeight;
        const windowHeight = window.innerHeight;
        const difference = panelHeight - windowHeight;

        const fakeScrollRatio =
          difference > 0 ? difference / (difference + windowHeight) : 0;

        if (fakeScrollRatio) {
          panel.style.marginBottom = panelHeight * fakeScrollRatio + "px";
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "bottom bottom",
            end: fakeScrollRatio
              ? `+=${innerpanel.offsetHeight}`
              : "bottom top",
            pinSpacing: false,
            pin: true,
            scrub: true,
          },
        });

        if (fakeScrollRatio) {
          tl.to(innerpanel, {
            yPercent: -100,
            y: windowHeight,
            duration: 1 / (1 - fakeScrollRatio) - 1,
            ease: "none",
          });
        }

        tl.fromTo(
          panel,
          { scale: 1, opacity: 1 },
          {
            scale: 0.7,
            opacity: 0.5,
            duration: 0.9,
          },
        ).to(panel, { opacity: 0, duration: 0.1 });
      });

      ScrollTrigger.refresh();
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="pt-20 pb-2 bg-slate-900">
      <section className="gsapSlides-section gsapSlides-section-2 bg-[#f5f2dc] text-black">
        <div className="gsapSlides-content">
          <div className="gsapSlides-inner">
            <h1>Section 1</h1>
            <Image
              className="gsapSlides-image"
              src="https://preview.redd.it/a7fuw14klmw61.jpg?width=1080&crop=smart&auto=webp&s=ac56ef0b284d346ea0dcf4de15b3300e9e6cb13b"
              alt="Portrait of a person"
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="gsapSlides-section gsapSlides-section-2 bg-[#ffe9fe] text-black">
        <div className="gsapSlides-content">
          <div className="gsapSlides-inner">
            <h1>Section 2</h1>
            {sentences.map((sentence, i) => (
              <p key={i}>{sentence}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="gsapSlides-section gsapSlides-section-2 bg-[#1f1f1f] text-[#f5f2dc]">
        <div className="gsapSlides-content">
          <div className="gsapSlides-inner">
            <h1>Section 3</h1>
            <Image
              className="gsapSlides-image"
              src="https://static.vecteezy.com/system/resources/thumbnails/046/075/532/small_2x/a-black-man-stands-with-his-arms-outstretched-as-if-embracing-the-vastness-of-the-cosmos-dd-in-a-billowing-ethereal-cloak-he-exudes-a-sense-of-otherworldly-wisdom-and-knowledge-photo.jpg"
              alt="Portrait of a person"
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>

      <section className="gsapSlides-section gsapSlides-section-2 bg-[#d2ceff] text-black">
        <div className="gsapSlides-content">
          <div className="gsapSlides-inner">
            <h1>Section 4</h1>
            <Image
              className="gsapSlides-image"
              src="https://i1.sndcdn.com/avatars-000619663707-cm286i-t1080x1080.jpg"
              alt="Portrait of a person"
              width={400}
              height={400}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
