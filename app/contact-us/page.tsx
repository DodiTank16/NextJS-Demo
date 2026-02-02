"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function ContactUs() {
  const [inView, setInView] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  let boost = 0;

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setInView(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [72.5714, 23.0225],
      zoom: 15.3,
      pitch: 65,
      bearing: -25,
      antialias: true,
      scrollZoom: true, // keep zoom
    });

    map.scrollZoom.disable();

    mapRef.current.addEventListener("mouseenter", () => {
      map.scrollZoom.enable();
    });

    mapRef.current.addEventListener("mouseleave", () => {
      map.scrollZoom.disable();
    });

    mapInstance.current = map;
    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      // 3D Buildings
      map.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 14,
        paint: {
          "fill-extrusion-color": "#9ca3af",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.85,
        },
      });

      // Hover Highlight
      map.addLayer({
        id: "hover-building",
        source: "composite",
        "source-layer": "building",
        type: "fill-extrusion",
        filter: ["==", ["id"], ""],
        paint: {
          "fill-extrusion-color": "#FFD700",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.8,
        },
      });

      // Isolated building effect
      map.addLayer({
        id: "isolated-building",
        source: "composite",
        "source-layer": "building",
        type: "fill-extrusion",
        filter: ["==", ["id"], ""],
        paint: {
          "fill-extrusion-color": "#ffffff",
          "fill-extrusion-height": ["+", ["get", "height"], 30],
          "fill-extrusion-opacity": 1,
        },
      });

      // Click Highlight
      map.addLayer({
        id: "click-building",
        source: "composite",
        "source-layer": "building",
        type: "fill-extrusion",
        filter: ["==", "id", ""],
        paint: {
          "fill-extrusion-color": "#22c55e",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-opacity": 1,
        },
      });

      // Selected Building Highlight
      map.addLayer({
        id: "selected-building",
        source: "composite",
        "source-layer": "building",
        type: "fill-extrusion",
        filter: ["==", ["id"], ""],
        paint: {
          "fill-extrusion-color": "#00FFD1",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 1,
        },
      });

      map.moveLayer("hover-building");
      map.moveLayer("selected-building");
      map.moveLayer("isolated-building");

      const explodeInterval = setInterval(() => {
        boost += 4;
        if (boost > 50) clearInterval(explodeInterval);

        map.setPaintProperty("isolated-building", "fill-extrusion-height", [
          "+",
          ["get", "height"],
          boost,
        ]);
      }, 20);

      map.setPaintProperty("3d-buildings", "fill-extrusion-opacity", [
        "case",
        ["boolean", ["feature-state", "selected"], false],
        1,
        0.15,
      ]);

      // Glowing Marker
      const marker = document.createElement("div");
      marker.className = "glow-marker";

      new mapboxgl.Marker(marker)
        .setLngLat([72.5714, 23.0225])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <strong>Dodi Construction</strong><br/>
            Ahmedabad, Gujarat<br/>
            📞 +91 99999 99999
          `),
        )
        .addTo(map);
    });

    // Hover highlight buildings
    map.on("mousemove", "3d-buildings", (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      const id = feature.id || feature.properties?.osm_id;

      map.getCanvas().style.cursor = "pointer";

      map.setFilter("hover-building", ["==", ["id"], id]);
    });

    map.on("mouseleave", "3d-buildings", () => {
      map.setFilter("hover-building", ["==", ["id"], ""]);
      map.getCanvas().style.cursor = "";
    });

    // Click building → popup info
    map.on("click", "3d-buildings", (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      const id = feature.id || feature.properties?.osm_id;
      const props = feature.properties;
      const coords = e.lngLat;

      // Reset isolate boost
      boost = 0;

      // Apply highlight
      map.setFilter("selected-building", ["==", ["id"], id]);

      // Explode isolate
      map.setFilter("isolated-building", ["==", ["id"], id]);

      // Animate explosion
      const explode = setInterval(() => {
        boost += 4;
        if (boost > 60) clearInterval(explode);

        map.setPaintProperty("isolated-building", "fill-extrusion-height", [
          "+",
          ["get", "height"],
          boost,
        ]);
      }, 16);

      // Cinematic camera move
      map.flyTo({
        center: coords,
        zoom: 18.2,
        pitch: 82,
        bearing: Math.random() * 120,
        speed: 0.75,
        curve: 1.7,
      });

      setSelectedBuilding({
        name: props?.name || "Premium Tower",
        height: props?.height || "Unknown",
        levels: props?.levels || "N/A",
        type: props?.type || "Commercial",
      });
    });

    return () => map.remove();
  }, []);

  return (
    <section className="py-28 bg-slate-900">
      <div className="mx-auto px-6 max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <div
            className={`transition-all duration-1000 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="mb-4 text-4xl sm:text-5xl font-bold text-[#F4F1EC]">
              Contact Us
            </h2>
            <p className="mx-auto text-lg text-gray-300 max-w-4xl">
              We're passionate about creating innovative solutions that help
              businesses thrive in the digital age.
            </p>
          </div>
        </div>

        {/* LARGE MAP */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700 mb-20">
          <div ref={mapRef} className="h-[520px] w-full" />
        </div>

        {/* SIDE PANEL */}
        <div
          className={`fixed top-0 right-0 h-full w-[360px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-500 ${
            selectedBuilding ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#F4F1EC]">
                Building Details
              </h3>

              <button
                onClick={() => setSelectedBuilding(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {selectedBuilding && (
              <div className="space-y-4 text-gray-300 text-sm">
                <p>
                  <strong>Name:</strong> {selectedBuilding.name}
                </p>
                <p>
                  <strong>Height:</strong> {selectedBuilding.height} m
                </p>
                <p>
                  <strong>Floors:</strong> {selectedBuilding.levels}
                </p>
                <p>
                  <strong>Type:</strong> {selectedBuilding.type}
                </p>

                <button className="w-full mt-4 px-5 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition">
                  View Property
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FORM BELOW MAP */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* LEFT INFO */}
          <div>
            <h3 className="text-3xl font-bold text-[#F4F1EC] mb-4">
              Let’s Build the Future Together
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Founded in 2025, we deliver premium digital & adaptive solutions
              worldwide.
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
              className="px-8 py-4 bg-yellow-400 text-black rounded-full font-semibold hover:bg-yellow-300 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Glow Marker CSS */}
      <style jsx global>{`
        .glow-marker {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #facc15;
          box-shadow:
            0 0 15px #facc15,
            0 0 30px #facc15;
          animation: pulse 1.6s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
