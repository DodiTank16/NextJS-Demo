"use client";

import { useEffect, useState } from "react";

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
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInView(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-30 bg-slate-900">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <div
            className={`transition-all duration-1000 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="mb-4 text-4xl font-bold text-[#F4F1EC] sm:text-5xl">
              About Our Company
            </h2>
            <p className="mx-auto text-xl text-gray-300 max-w-3xl">
              We're passionate about creating innovative solutions that help
              businesses thrive in the digital age.
            </p>
          </div>
        </div>

        <div className="grid gap-16 mb-20 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div
              className={`transition-all duration-1000 ease-out delay-200 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h3 className="mb-6 text-3xl font-bold text-[#F4F1EC]">
                Building Tomorrow's Solutions Today
              </h3>
              <p className="mb-6 text-lg text-gray-300 leading-relaxed">
                Founded in 2020, we've been at the forefront of digital
                transformation, helping over 10,000 businesses worldwide achieve
                their goals through innovative technology solutions.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Our team of expert developers, designers, and strategists work
                tirelessly to deliver cutting-edge solutions that not only meet
                today's challenges but anticipate tomorrow's opportunities.
              </p>
            </div>

            {/* Feature List */}
            <div
              className={`transition-all duration-1000 ease-out delay-200 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="space-y-4">
                {features.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 rtl:space-x-reverse cursor-default hover:bg-gray-700 rounded-lg"
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
                      <h4 className="text-lg font-semibold text-[#F4F1EC]">
                        {item.title}
                      </h4>
                      <p className="text-gray-300">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Image Card */}
          <div className="relative">
            <div
              className={`transition-all duration-1000 ease-out delay-300 ${
                inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
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
                        <div key={index} className="cursor-pointer">
                          <div className="text-2xl font-bold text-[#F4F1EC] hover:text-blue-400">
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
      </div>
    </section>
  );
}
