"use client";

import MorphSVG from "@/components/MorphSVG";
import SciFiCharacter from "@/components/SciFiCharacter";
import GridScanBackground from "@/components/backgrounds/GridScanBackground";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
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

  // useLayoutEffect(() => {
  //   if (!sectionRef.current) return;

  //   const ctx = gsap.context(() => {
  //     const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  //     /* ------------------ CODE → Typing Effect ------------------ */
  //     const codeText = "Code.";
  //     const obj = { i: 0 };
  //     codeRef.current!.textContent = "";

  //     tl.to(obj, {
  //       i: codeText.length,
  //       duration: codeText.length * 0.05, // faster typing (was 0.08)
  //       ease: "none",
  //       onUpdate: () => {
  //         codeRef.current!.textContent = codeText.slice(0, Math.floor(obj.i));
  //       },
  //     });

  //     /* ------------------ CRAFT → Build / Assemble ------------------ */
  //     tl.from(
  //       craftRef.current,
  //       {
  //         opacity: 0,
  //         y: 50, // slightly less distance
  //         scale: 0.9,
  //         filter: "blur(6px)", // slightly less blur
  //         duration: 0.6, // faster
  //       },
  //       "+=0.1", // shorter delay
  //     );

  //     tl.fromTo(
  //       craftRef.current,
  //       { backgroundSize: "0% 2px" },
  //       {
  //         backgroundSize: "100% 2px",
  //         backgroundImage: "linear-gradient(#facc15, #facc15)",
  //         backgroundRepeat: "no-repeat",
  //         backgroundPosition: "0 100%",
  //         duration: 0.4, // faster
  //         ease: "power2.out",
  //       },
  //       "-=0.3",
  //     );

  //     /* ------------------ LAUNCH → Rocket Lift-off ------------------ */
  //     tl.from(
  //       launchRef.current,
  //       {
  //         y: 100, // less distance
  //         opacity: 0,
  //         scale: 0.8, // slightly bigger start
  //         rotate: -5,
  //         duration: 0.7, // faster
  //         ease: "back.out(1.8)",
  //       },
  //       "-=0.2",
  //     )
  //       .to(launchRef.current, { y: -8, duration: 0.12, ease: "power1.out" }) // faster
  //       .to(launchRef.current, {
  //         y: 0,
  //         duration: 0.18,
  //         ease: "elastic.out(1,0.4)",
  //       });

  //     /* ------------------ PARAGRAPH → Word Reveal ------------------ */
  //     tl.from(
  //       ".word",
  //       {
  //         y: 15,
  //         opacity: 0,
  //         stagger: 0.025, // faster stagger
  //         duration: 0.45, // faster
  //       },
  //       "-=0.3",
  //     );

  //     /* ------------------ BUTTON ------------------ */
  //     tl.from(
  //       btnRef.current,
  //       {
  //         y: 15,
  //         opacity: 0,
  //         scale: 0.95,
  //         duration: 0.3, // faster
  //       },
  //       "-=0.2",
  //     );
  //   }, sectionRef);

  //   return () => ctx.revert();
  // }, []);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        repeat: -1,
        defaults: { ease: "power3.out" },
        repeatDelay: 0.5,
      });

      /* ------------------ CODE → Typing Effect ------------------ */
      const codeText = "Code.";
      const codeObj = { i: 0 };

      timeline.set(codeRef.current, { textContent: "" });
      timeline.to(codeObj, {
        i: codeText.length,
        duration: codeText.length * 0.05,
        ease: "none",
        onUpdate: () => {
          if (codeRef.current)
            codeRef.current.textContent = codeText.slice(
              0,
              Math.floor(codeObj.i),
            );
        },
      });

      timeline.to(codeRef.current, { opacity: 0, duration: 0.2, delay: 0.3 });

      /* ------------------ CRAFT → Characters from Different Directions ------------------ */
      timeline.set(craftRef.current, { textContent: "Craft." });
      timeline.set(craftRef.current, { opacity: 0 });
      timeline.fromTo(
        craftRef.current,
        { y: -50, x: 50, rotate: -45, opacity: 0 },
        { y: 0, x: 0, rotate: 0, opacity: 1, duration: 0.8 },
        "+=0.1",
      );
      timeline.to(craftRef.current, {
        opacity: 0,
        y: 50,
        x: -50,
        duration: 0.3,
        delay: 0.3,
      });

      /* ------------------ LAUNCH → Rocket Lift-off ------------------ */
      timeline.set(launchRef.current, { textContent: "Launch." });
      timeline.set(launchRef.current, {
        opacity: 1,
        y: -100,
        scale: 0.6,
        rotate: -10,
      });
      timeline.to(launchRef.current, {
        y: 0,
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration: 0.6,
      });
      timeline.to(launchRef.current, {
        y: -120,
        duration: 0.4,
        ease: "power2.in",
      });
      timeline.to(launchRef.current, { opacity: 0, duration: 0.2, delay: 0.2 });
    }, sectionRef);

    return () => ctx.revert();
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
              <h1 className="text-6xl font-bold flex gap-6 mb-5 overflow-hidden leading-tight">
                <span
                  ref={codeRef}
                  className="inline-block whitespace-nowrap"
                ></span>
                <span
                  ref={craftRef}
                  className="inline-block whitespace-nowrap relative"
                ></span>
                <span
                  ref={launchRef}
                  className="inline-block whitespace-nowrap"
                ></span>
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
