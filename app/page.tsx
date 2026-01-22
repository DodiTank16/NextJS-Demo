"use client";

import MorphSVG from "@/components/MorphSVG";
import GridScanBackground from "@/components/backgrounds/GridScanBackground";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(MorphSVGPlugin);

// function SciFiCharacter(props: any) {
//   const group = useRef<any>(null);
//   const { scene, animations } = useGLTF("/models/primary_ion_drive.glb");
//   const { actions } = useAnimations(animations, group);

//   useEffect(() => {
//     // Play embedded GLTF animation
//     const firstAction = actions[Object.keys(actions)[0]];
//     firstAction?.play();
//   }, [actions]);

//   return (
//     <div className="h-[750px]">
//       <Canvas camera={{ position: [5, 5, 5], fov: 80 }}>
//         <ambientLight intensity={0.8} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />
//         <group ref={group} {...props}>
//           <primitive object={scene} scale={2.5} />
//         </group>
//         <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} />
//       </Canvas>
//     </div>
//   );
// }

export default function page() {
  const pathname = usePathname();

  const sectionRef = useRef<HTMLElement | null>(null);
  const panelsRef = useRef<HTMLElement[]>([]);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const titleRef = useRef<HTMLSpanElement | null>(null);

  const codeRef = useRef<HTMLSpanElement | null>(null);
  const craftRef = useRef<HTMLSpanElement | null>(null);
  const launchRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // PINNED PANELS
      panelsRef.current.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          end: "+=100%", // IMPORTANT
          pin: true,
          pinSpacing: true,
          scrub: true,
        });
      });

      // PARALLAX IMAGES
      gsap.utils.toArray(".parallax").forEach((img) => {
        gsap.fromTo(
          img as any,
          { y: -100 },
          {
            y: 100,
            scrollTrigger: {
              trigger: img,
              scrub: true,
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useLayoutEffect(() => {
    if (!codeRef.current || !craftRef.current || !launchRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });

    /* ---------------- CODE (typing) ---------------- */
    const text = "Code.";
    const obj = { i: 0 };

    gsap.set([craftRef.current, launchRef.current], { opacity: 0 });

    tl.set(codeRef.current, { opacity: 1, textContent: "" });

    tl.to(obj, {
      i: text.length,
      duration: text.length * 0.09,
      ease: "none",
      delay: 0.6,
      onUpdate: () => {
        codeRef.current!.textContent = text.slice(0, Math.floor(obj.i));
      },
    });

    tl.to(codeRef.current, { opacity: 0, duration: 0.3, delay: 1.0 });

    /* ---------------- CRAFT (magnetic snap) ---------------- */
    const letters = craftRef.current.querySelectorAll(".craft-letter");

    tl.set(craftRef.current, { opacity: 1 });

    tl.fromTo(
      letters,
      {
        opacity: 0,
        x: () => gsap.utils.random(-200, 200),
        y: () => gsap.utils.random(-150, 150),
        rotate: () => gsap.utils.random(-120, 120),
        scale: 0.3,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        duration: 0.9,
        stagger: { each: 0.2, from: "random" },
        ease: "elastic.out(1, 0.45)",
        delay: 0.6,
      },
    );

    tl.to(craftRef.current, { opacity: 0, duration: 0.3, delay: 0.4 });

    /* ---------------- LAUNCH (rocket) ---------------- */
    tl.set(launchRef.current, {
      opacity: 1,
      y: 120,
      scale: 0.7,
    });

    tl.to(launchRef.current, {
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.8)",
    });

    tl.to(launchRef.current, {
      y: -160,
      duration: 0.45,
      ease: "power2.in",
      delay: 0.6,
    });

    tl.to(launchRef.current, { opacity: 0, duration: 0.2 });

    return () => tl.kill();
  }, []);

  return (
    <>
      <main className="text-white">
        <section
          ref={sectionRef}
          // className="relative min-h-screen grid md:grid-cols-2 items-center px-10 pt-25 md:pt-0 text-center md:text-left overflow-hidden"
          className="relative min-h-screen overflow-hidden"
        >
          <div className="absolute inset-0">
            <GridScanBackground
              sensitivity={0.55}
              lineThickness={1}
              linesColor="#F8BC14"
              gridScale={0.1}
              scanColor="#fcc700"
              scanOpacity={0.4}
              enablePost
              bloomIntensity={0.6}
              chromaticAberration={0.002}
              noiseIntensity={0.01}
            />
          </div>
          <div className="relative min-h-screen grid md:grid-cols-2 items-center px-10 pt-25 md:pt-0 text-center md:text-left overflow-hidden">
            <div>
              <h1 className="text-6xl font-bold mb-5 overflow-hidden leading-tight relative h-[72px]">
                {/* CODE */}
                <span
                  ref={codeRef}
                  className="absolute left-0 top-0 inline-block whitespace-nowrap"
                />

                {/* CRAFT */}
                <span
                  ref={craftRef}
                  className="absolute left-0 top-0 inline-block whitespace-nowrap"
                >
                  {"Craft.".split("").map((c, i) => (
                    <span key={i} className="craft-letter inline-block">
                      {c}
                    </span>
                  ))}
                </span>

                {/* LAUNCH */}
                <span
                  ref={launchRef}
                  className="absolute left-0 top-0 inline-block whitespace-nowrap"
                >
                  Launch.
                </span>
              </h1>

              <p
                ref={textRef}
                className="hero-text text-slate-300 mb-8 max-w-xl"
              >
                {"I'm a full-stack software engineer with 4+ years of experience building fast, scalable web applications — from clean APIs to polished, animated user interfaces."
                  .split(" ")
                  .map((word, i) => (
                    <span key={i} className="inline-block overflow-hidden mr-1">
                      <span className="word inline-block">{word}</span>
                    </span>
                  ))}
              </p>
              <button
                ref={btnRef}
                className="hero-btn px-8 py-4 bg-yellow-500 text-black rounded-full hover:cursor-pointer hover:bg-yellow-400 hover:shadow-lg"
              >
                View Project
              </button>
            </div>

            <div className="h-[400px] md:h-[750px] flex items-center justify-center">
              <MorphSVG />
            </div>
            {/* <SciFiCharacter /> */}
          </div>
        </section>

        {/* PINNED PANELS */}

        {["Design", "Build", "Deliver"].map((item, i) => (
          <section
            key={item}
            ref={(el) => {
              if (el) panelsRef.current[i] = el;
            }}
            className="min-h-screen flex items-center justify-center text-7xl font-bold bg-slate-900"
          >
            {item}
          </section>
        ))}

        {/* PARALLAX SECTION */}
        <section className="relative h-screen overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
            className="parallax absolute inset-0 w-full h-full object-cover"
            alt="photo"
          />
          <div className="relative z-10 h-full flex items-center justify-center bg-black/50">
            <h2 className="text-5xl font-bold">Built to Last</h2>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 text-center bg-yellow-500 text-black">
          <h2 className="text-4xl font-bold mb-6">Let’s Build Together</h2>
          <button
            type="button"
            className="px-10 py-4 bg-black text-white rounded-full"
          >
            Contact Us
          </button>
        </section>
      </main>
    </>
  );
}
