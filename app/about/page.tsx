"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Expert Team",
    desc: "50+ skilled professionals with years of experience",
  },
  {
    title: "Global Reach",
    desc: "Serving clients across 25+ countries worldwide",
  },
  {
    title: "Innovation Focus",
    desc: "Always adopting the latest technologies and methodologies",
  },
];

export default function AboutUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.from(".about-heading", {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
      });

      tl.from(".about-text", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
      }, "-=0.6");

      tl.from(".feature-item", {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.5");

      tl.from(".about-image", {
        opacity: 0,
        scale: 0.92,
        duration: 1,
        ease: "power3.out",
      }, "-=0.6");

      tl.from(".stat-item", {
        opacity: 0,
        scale: 0.85,
        stagger: 0.12,
        duration: 0.6,
        ease: "back.out(1.6)",
      }, "-=0.5");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-30 bg-slate-900">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Heading */}
        <div className="mb-16 text-center about-heading">
          <h2 className="mb-4 text-4xl font-bold text-[#F4F1EC] sm:text-5xl underline underline-offset-8 decoration-yellow-500 decoration-4">
            About Our Company
          </h2>
          <p className="mx-auto text-xl text-gray-300 max-w-3xl font-rubik">
            We're passionate about creating innovative solutions that help
            businesses thrive in the digital age.
          </p>
        </div>

        <div className="grid gap-16 mb-20 lg:grid-cols-2 items-center">

          {/* Left Content */}
          <div className="space-y-8 about-text">
            <h3 className="mb-6 text-3xl font-bold text-[#F4F1EC]">
              Building Tomorrow's Solutions Today
            </h3>
            <p className="mb-6 text-lg text-gray-300 leading-relaxed font-rubik">
              Founded in 2020, we've been at the forefront of digital
              transformation, helping over 10,000 businesses worldwide achieve
              their goals through innovative technology solutions.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed font-rubik">
              Our team of expert developers, designers, and strategists work
              tirelessly to deliver cutting-edge solutions that not only meet
              today's challenges but anticipate tomorrow's opportunities.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="feature-item flex items-start space-x-4 rtl:space-x-reverse rounded-lg p-2"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
                    <svg
                      className="w-4 h-4 text-[#F4F1EC]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[#F4F1EC] font-rubik">
                      {item.title}
                    </h4>
                    <p className="text-gray-300 font-rubik">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative about-image">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80"
                alt="Our team at work"
                className="object-cover w-full h-[384px]"
              />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="backdrop-blur-sm p-6 rounded-xl shadow-lg bg-blue-900">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { value: "5+", label: "Years" },
                      { value: "50+", label: "Team" },
                      { value: "25+", label: "Countries" },
                    ].map((stat, index) => (
                      <div key={index} className="stat-item cursor-pointer">
                        <div className="text-2xl font-bold text-[#F4F1EC] hover:text-blue-400 transition font-rubik">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-300">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
