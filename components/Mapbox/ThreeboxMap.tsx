"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    tb: any;
    mapboxgl: any;
    Threebox: any;
  }
}

// Scripts are loaded once per page session and shared between mounts. Loading
// is keyed by URL so two mounts (Fast Refresh, remounts, etc.) never race and
// resolve before the script has actually executed.
const scriptPromises = new Map<string, Promise<void>>();

function loadScript(src: string, isReady: () => boolean): Promise<void> {
  const cached = scriptPromises.get(src);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    // The script may already be present/executed (e.g. a previous mount).
    if (isReady()) {
      resolve();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }

    const timer = window.setTimeout(() => {
      reject(new Error(`Timed out loading ${src}`));
    }, 20000);

    script.addEventListener(
      "load",
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true },
    );

    script.addEventListener(
      "error",
      () => {
        window.clearTimeout(timer);
        reject(new Error(`Failed to load ${src}`));
      },
      { once: true },
    );
  });

  scriptPromises.set(src, promise);
  // Allow a later mount to retry if this attempt failed.
  promise.catch(() => scriptPromises.delete(src));
  return promise;
}

export default function ThreeboxMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;

    let disposed = false;
    let map: any;
    let popup: any;
    let tb: any;
    let selectedHandler: ((e: CustomEvent) => void) | null = null;

    const onRender = () => tb?.update();

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onMouseEnter = () => {
      document.documentElement.style.overflow = "hidden";
    };
    const onMouseLeave = () => {
      document.documentElement.style.overflow = "";
    };

    async function init() {
      try {
        await loadScript(
          "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js",
          () => !!window.mapboxgl,
        );
        await loadScript("/threebox.js", () => !!window.Threebox);

        if (disposed) return;

        const mapboxgl = window.mapboxgl;
        const Threebox = window.Threebox;

        if (!mapboxgl || !Threebox) {
          throw new Error("Threebox or Mapbox GL failed to load");
        }

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

        map = new mapboxgl.Map({
          container,
          style: "mapbox://styles/mapbox/outdoors-v11",
          center: [72.5714, 23.0225, 0],
          zoom: 16,
          pitch: 65,
          bearing: -25,
          antialias: true,
        });

        const gl =
          map.getCanvas().getContext("webgl") ||
          map.getCanvas().getContext("experimental-webgl");

        tb = new Threebox(map, gl, {
          defaultLights: true,
          enableSelectingFeatures: true,
          enableTooltips: true,
        });
        window.tb = tb;

        selectedHandler = (e: CustomEvent) => {
          const feature = e.detail;
          if (!feature?.state?.select) return;
          console.log("feature selected", feature);

          popup?.remove();

          const coords = tb.getFeatureCenter(feature, null, 0);
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
            pitch: 70,
            bearing: map.getBearing() + 40,
            speed: 0.9,
            curve: 1.5,
          });
        };

        const minZoom = 12;

        map.on("style.load", () => {
          // EXISTING BUILDING LAYER
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

          // SKY LAYER
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

          map.on("render", onRender);
          map.on("SelectedFeatureChange", selectedHandler!);
          map.on("ThreeboxFeatureSelected", selectedHandler!);
        });

        map.scrollZoom.enable();
        map.scrollZoom.setWheelZoomRate(1 / 200);

        // HARD STOP wheel scroll from bubbling to page
        const mapContainer = map.getContainer();
        mapContainer.addEventListener("wheel", onWheel, { passive: false });
        mapContainer.addEventListener("touchmove", onTouchMove, { passive: false });
        mapContainer.addEventListener("mouseenter", onMouseEnter);
        mapContainer.addEventListener("mouseleave", onMouseLeave);
      } catch (err) {
        console.error("Map init failed", err);
      }
    }

    init();

    return () => {
      disposed = true;
      popup?.remove();
      if (map) {
        map.off("render", onRender);
        if (selectedHandler) {
          map.off("SelectedFeatureChange", selectedHandler);
          map.off("ThreeboxFeatureSelected", selectedHandler);
        }
        map.remove();
        map = undefined;
      }
      document.documentElement.style.overflow = "";
      if (tb && window.tb === tb) delete window.tb;
    };
  }, []);

  return <div ref={mapRef} className="w-full h-[650px] rounded-3xl" />;
}
