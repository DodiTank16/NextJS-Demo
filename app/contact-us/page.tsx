"use client";

import ThreeboxMap from "@/components/Mapbox/ThreeboxMap";
import { useEffect, useState } from "react";

export default function ContactUs() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInView(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-30 bg-slate-900">
      <div className="mx-auto px-6 max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <div
            className={`transition-all duration-1000 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
            <h2 className="mb-4 text-4xl sm:text-5xl font-bold text-[#F4F1EC]">Contact Us</h2>
            <p className="mx-auto text-lg text-gray-300 max-w-4xl">
              We're passionate about creating innovative solutions that help businesses thrive in the digital age.
            </p>
          </div>
        </div>

        {/* LARGE MAP */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700 mb-20">
          <ThreeboxMap />
        </div>

        {/* FORM BELOW MAP */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* LEFT INFO */}
          <div>
            <h3 className="text-3xl font-bold text-[#F4F1EC] mb-4">Let’s Build the Future Together</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Founded in 2025, we deliver premium digital & adaptive solutions worldwide.
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-5">
            <input
              placeholder="Your Name"
              className="w-full px-5 py-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <input
              placeholder="Email Address"
              className="w-full px-5 py-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="w-full px-5 py-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-yellow-400 outline-none"
            />

            <button
              type="submit"
              // className="px-8 py-4 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-300 transition"
              className="hero-btn px-8 py-4 text-black rounded-full hover:cursor-pointer bg-[#F4F1EC] hover:bg-yellow-400 hover:shadow-lg">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
