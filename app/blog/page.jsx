"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";

import DesertAdventureImg from "../../assets/images/Desert-Adventure.jpg";
import Ocean from "../../assets/images/Ocean.jpg";

export default function Blogs() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current], {
        y: 40,
        autoAlpha: 0,
      });

      gsap.set(cardsRef.current, {
        y: 60,
        autoAlpha: 0,
      });

      // Timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.to(titleRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 1,
      })
        .to(
          subtitleRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
          },
          "-=0.4"
        )
        .to(
          cardsRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.2,
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-30 bg-gray-50 dark:bg-indigo-900">
      {/* Title Section */}
      <div className="text-center">
        <h1
          ref={titleRef}
          className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white"
        >
          Discover New Adventures
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg text-gray-600 dark:text-gray-400"
        >
          Explore, discover, and find inspiration through these exciting
          journeys.
        </p>
      </div>

      {/* Content */}
      <div className="px-8 py-10 mx-auto lg:max-w-screen-xl sm:max-w-xl md:max-w-full sm:px-12 md:px-16 lg:py-20 sm:py-16">
        <div className="grid gap-x-8 gap-y-12 sm:gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => (cardsRef.current[i] = el)}
              className="relative"
            >
              <Link
                className="block overflow-hidden group rounded-xl shadow-lg relative"
                href="#"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  width={1080}
                  height={720}
                  loading="lazy"
                  className="object-cover w-full h-56 sm:h-64 transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/0 transition-all duration-700 group-hover:bg-black/20" />
              </Link>

              <div className="relative mt-5 transition-all duration-500 group-hover:-translate-y-1">
                <p className="uppercase font-semibold text-xs mb-2.5 text-purple-600">
                  {card.date}
                </p>

                <h2 className="text-2xl font-bold leading-5 text-black dark:text-white mb-3">
                  {card.title}
                </h2>

                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {card.description}
                </p>

                <span className="font-medium underline text-purple-600 dark:text-purple-400 cursor-pointer">
                  Read More
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Data */
const cards = [
  {
    title: "Journey to the Mountains",
    date: "September 10th 2023",
    image: DesertAdventureImg,
    description:
      "Escape the hustle and explore the serene beauty of the mountains.",
  },
  {
    title: "Explore the Deep Oceans",
    date: "September 15th 2023",
    image: Ocean,
    description: "Dive into the mystery of the underwater world.",
  },
  {
    title: "Desert Safari",
    date: "October 5th 2023",
    image: DesertAdventureImg,
    description: "Experience the thrill of dunes and desert adventures.",
  },
];
