"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";

export default function Blogs() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
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
          "-=0.4",
        )
        .to(
          cardsRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.2,
          },
          "-=0.3",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-30 bg-slate-900">
      {/* Title Section */}
      <div className="text-center">
        <h1
          ref={titleRef}
          className="mb-4 text-4xl font-bold  sm:text-5xl text-[#F4F1EC] underline underline-offset-8 decoration-yellow-500 decoration-4"
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
              className="group relative border border-gray-700 rounded-xl p-6 bg-gray-800 text-[#F4F1EC] hover:bg-blue-300 hover:text-gray-800 hover:shadow-lg transition-all duration-300 flex flex-col "
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
                  blurDataURL={card.image}
                  className="object-cover w-full h-56 sm:h-64 transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/0 transition-all duration-700 group-hover:bg-black/20" />
              </Link>

              <div className="relative mt-5 flex flex-col flex-1 transition-all duration-500 group-hover:-translate-y-1">
                <p className="uppercase font-semibold text-xs mb-2.5 text-blue-300 transition-colors duration-300 group-hover:text-[#F4F1EC]">
                  {card.date}
                </p>

                <h2 className="text-2xl font-bold leading-snug mb-3">
                  {card.title}
                </h2>

                <p className="mb-4">{card.description}</p>

                <span className="mt-auto font-medium underline text-blue-600 dark:text-blue-300 opacity-70 transition-all duration-300 group-hover:text-[#F4F1EC] group-hover:opacity-100 hover:text-gray-800 cursor-pointer">
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
    title: "Exploring the Majestic Mountains",
    date: "September 10th 2023",
    image: `https://wallpapercave.com/wp/wp11156430.png`,
    description:
      "Escape the hustle and explore the serene beauty of the mountains.",
  },
  {
    title: "Chill Vibes at the Beach",
    date: "September 15th 2023",
    image: `https://wallpapers.com/images/hd/bored-ape-yacht-club-ry8yhyrooilne9v8.jpg`,
    description: "Dive into the mystery of the underwater world.",
  },
  {
    title: "Sea and Surfing Adventures",
    date: "October 5th 2023",
    image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrufbR7hPJktVgh9bpG3WWlPXdarcRXoCANA&s`,
    description: "Experience the thrill of dunes and desert adventures.",
  },
];
