"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    tb: any;
  }
}

export default function ThreeboxMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadScript = (src: string) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.body.appendChild(script);
      });

    async function init() {
      await loadScript("https://api.mapbox.com/mapbox-gl-js/v2.2.0/mapbox-gl.js");
      await loadScript("/threebox.js");

      const mapboxgl = (window as any).mapboxgl;
      const Threebox = (window as any).Threebox;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapRef.current,
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
      let popup: any;

      function createBuildingsLayer() {
        return {
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
        };
      }

      map.on("style.load", () => {
        map.addLayer(createBuildingsLayer());

        map.on("render", () => window.tb.update());

        map.on("SelectedFeatureChange", onSelectedFeatureChange);
      });

      function onSelectedFeatureChange(e: any) {
        const feature = e.detail;
        if (!feature?.state?.select) return;

        if (popup) popup.remove();

        const center = window.tb.getFeatureCenter(feature);
        const height = Number(feature.properties?.height || 40);

        // Project popup to building top
        const lifted = window.tb.projectToWorld([center[0], center[1], height + 10]);

        popup = new mapboxgl.Popup({
          closeButton: false,
          offset: 12,
          className: "premium-popup",
        })
          .setLngLat([lifted[0], lifted[1]])
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

        // Cinematic fly-in
        map.flyTo({
          center: [center[0], center[1]],
          zoom: 18.4,
          pitch: 82,
          bearing: Math.random() * 120,
          speed: 0.85,
          curve: 1.6,
        });
      }
    }

    init();
  }, []);

  return <div ref={mapRef} className="w-full h-[650px] rounded-3xl" />;
}
