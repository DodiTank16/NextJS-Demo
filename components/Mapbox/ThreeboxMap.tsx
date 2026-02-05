"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    tb: any;
    mapboxgl: any;
    Threebox: any;
  }
}

export default function ThreeboxMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let map: any;
    let popup: any;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = reject;
        document.body.appendChild(script);
      });

    async function init() {
      try {
        await loadScript("https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js");
        await loadScript("/threebox.js");

        if (!window.Threebox) {
          throw new Error("Threebox failed to load");
        }

        const mapboxgl = window.mapboxgl;
        const Threebox = window.Threebox;

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

        map = new mapboxgl.Map({
          container: mapRef.current!,
          style: "mapbox://styles/mapbox/outdoors-v11",
          center: [72.5714, 23.0225, 0],
          zoom: 16,
          pitch: 65,
          bearing: -25,
          antialias: true,
        });

        const gl = map.getCanvas().getContext("webgl") || map.getCanvas().getContext("experimental-webgl");

        window.tb = new Threebox(map, gl, {
          defaultLights: true,
          enableSelectingFeatures: true,
          enableTooltips: true,
        });

        const minZoom = 12;

        map.on("style.load", () => {
          // 🏙 EXISTING BUILDING LAYER
          if (!map.getLayer("3d-buildings")) {
            map.addLayer({
              id: "3d-buildings",
              source: "composite",
              "source-layer": "building",
              filter: ["==", "extrude", "true"],
              type: "fill-extrusion",
              minzoom: minZoom,
              paint: {
                "fill-extrusion-color": [
                  "case",
                  ["boolean", ["feature-state", "select"], false],
                  "#00FFD1",
                  ["boolean", ["feature-state", "hover"], false],
                  "#FFD700",
                  "#9ca3af",
                ],
                "fill-extrusion-height": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  minZoom,
                  0,
                  minZoom + 0.05,
                  ["get", "height"],
                ],
                "fill-extrusion-opacity": 0.9,
              },
            });
          }

          // 🌤 SKY LAYER — ADD HERE
          if (!map.getLayer("sky")) {
            map.addLayer({
              id: "sky",
              type: "sky",
              paint: {
                "sky-type": "atmosphere",
                "sky-atmosphere-color": "#9ca3af",
                "sky-atmosphere-halo-color": "#38bdf8",
                "sky-atmosphere-sun": [0.0, 0.2],
                "sky-atmosphere-sun-intensity": 10,
                "sky-opacity": 0.95,
              },
            });
          }

          map.on("render", () => window.tb.update());
          map.on("SelectedFeatureChange", onSelectedFeatureChange);
          map.on("ThreeboxFeatureSelected", onSelectedFeatureChange);
        });

        function onSelectedFeatureChange(e: any) {
          const feature = e.detail;
          if (!feature?.state?.select) return;
          console.log("feature selected", feature);

          popup?.remove();

          const coords = window.tb.getFeatureCenter(feature, null, 0);
          const center = [coords[0], coords[1]];

          popup = new mapboxgl.Popup({
            offset: [0, -10],
            closeButton: false,
            className: "premium-popup",
          })
            .setLngLat([coords[0], coords[1]])
            .setHTML(
              `
              <div style="font-size:14px">
                <strong>${feature.properties?.name || "Premium Tower"}</strong><br/>
                Height: ${feature.properties?.height || "Unknown"} m<br/>
                Floors: ${feature.properties?.levels || "N/A"}
              </div>
            `,
            )
            .addTo(map);

          map.flyTo({
            center,
            zoom: 18.2,
            pitch: 70, // instead of 80
            bearing: map.getBearing() + 40,
            speed: 0.9,
            curve: 1.5,
          });
        }
        map.scrollZoom.enable();
        map.scrollZoom.setWheelZoomRate(1 / 200);
      } catch (err) {
        console.error("Map init failed", err);
      }

      const container = map.getContainer();

      // HARD STOP wheel scroll from bubbling to page
      container.addEventListener(
        "wheel",
        (e: any) => {
          e.preventDefault();
          e.stopPropagation();
        },
        { passive: false },
      );

      // HARD STOP touch scroll on mobile
      container.addEventListener(
        "touchmove",
        (e: any) => {
          e.preventDefault();
          e.stopPropagation();
        },
        { passive: false },
      );

      container.addEventListener("mouseenter", () => {
        document.documentElement.style.overflow = "hidden";
      });

      container.addEventListener("mouseleave", () => {
        document.documentElement.style.overflow = "";
      });
    }

    init();

    return () => {
      popup?.remove();
      map?.off("render", () => window.tb.update());
      map?.remove();
      delete window.tb;
    };
  }, []);

  return <div ref={mapRef} className="w-full h-[650px] rounded-3xl" />;
}
