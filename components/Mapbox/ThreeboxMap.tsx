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

        const mapboxgl = window.mapboxgl;
        const Threebox = window.Threebox;

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

        map = new mapboxgl.Map({
          container: mapRef.current!,
          style: "mapbox://styles/mapbox/outdoors-v11",
          center: [72.5714, 23.0225],
          zoom: 16,
          pitch: 65,
          bearing: -25,
          antialias: true,
        });

        window.tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
          defaultLights: true,
          enableSelectingFeatures: true,
          enableTooltips: true,
        });

        const minZoom = 12;

        map.on("style.load", () => {
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

          map.on("render", () => window.tb.update());
          map.on("SelectedFeatureChange", onSelectedFeatureChange);
        });

        function onSelectedFeatureChange(e: any) {
          const feature = e.detail;
          if (!feature?.state?.select) return;

          popup?.remove();

          const center = window.tb.getFeatureCenter(feature);

          popup = new mapboxgl.Popup({
            closeButton: false,
            offset: [0, -20],
            className: "premium-popup",
          })
            .setLngLat(center)
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
            zoom: 18.3,
            pitch: 80,
            bearing: map.getBearing() + 40,
            speed: 0.9,
            curve: 1.5,
            easing: (t: number) => t * (2 - t),
          });
        }
      } catch (err) {
        console.error("Map init failed", err);
      }
    }

    init();

    return () => {
      popup?.remove();
      map?.remove();
      delete window.tb;
    };
  }, []);

  return <div ref={mapRef} className="w-full h-[650px] rounded-3xl" />;
}
