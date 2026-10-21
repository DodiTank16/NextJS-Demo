"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    mapboxgl: any;
    Threebox: any;
  }
}

// Where visitors should come to find us (Rajkot, Gujarat).
const CONTACT_LOCATION: [number, number] = [70.8125984, 22.2904899];

// Runtime Mapbox GL version. /mapbox-gl.css in /public must match this version.
const MAPBOX_GL_URL = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";
const THREEBOX_URL = "/threebox.js";

const SCRIPT_TIMEOUT_MS = 20000;

// Classic teardrop map pin, revealed when the marker is hovered/focused.
// Static, trusted markup — no user input involved.
const CONTACT_PIN_SVG = `
<svg viewBox="0 0 24 38" width="100%" height="100%" focusable="false" aria-hidden="true">
  <defs>
    <linearGradient id="contactPinFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f4f4a1" />
      <stop offset="55%" stop-color="#d9d908" />
      <stop offset="100%" stop-color="#9c9c05" />
    </linearGradient>
  </defs>
  <path
    d="M12 0C5.373 0 0 5.373 0 12c0 8.333 12 26 12 26s12-17.667 12-26C24 5.373 18.627 0 12 0z"
    fill="url(#contactPinFill)"
    stroke="#0b0b0f"
    stroke-width="1.5"
    stroke-linejoin="round"
  />
  <circle cx="12" cy="12" r="4.8" fill="#0b0b0f" />
  <circle cx="12" cy="12" r="1.9" fill="#f8fafc" />
</svg>`;

type MapStatus = "loading" | "ready" | "error";

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

    let script = document.querySelector<HTMLScriptElement>(`script[data-map-src="${src}"]`);

    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.mapSrc = src;
      document.head.appendChild(script);
    }

    let timer: number | undefined;

    const cleanup = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      script?.removeEventListener("load", onLoad);
      script?.removeEventListener("error", onError);
    };

    const onLoad = () => {
      cleanup();
      if (script) script.dataset.loaded = "true";
      resolve();
    };

    const onError = () => {
      cleanup();
      // A failed <script> never fires "load" again — drop it so a later mount
      // can retry with a fresh tag instead of hanging on the timeout.
      script?.remove();
      reject(new Error(`Failed to load ${src}`));
    };

    // Tag already finished loading before this listener was attached.
    if (script.dataset.loaded === "true") {
      resolve();
      return;
    }

    timer = window.setTimeout(() => {
      cleanup();
      script?.remove();
      reject(new Error(`Timed out loading ${src}`));
    }, SCRIPT_TIMEOUT_MS);

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
  });

  scriptPromises.set(src, promise);
  // Allow a later mount to retry if this attempt failed.
  promise.catch(() => {
    if (scriptPromises.get(src) === promise) scriptPromises.delete(src);
  });
  return promise;
}

function buildPopupBody(title?: string, rows: Array<[string, string]> = []): HTMLDivElement {
  const body = document.createElement("div");
  body.className = "popup-body";

  if (title) {
    const strong = document.createElement("strong");
    strong.textContent = title;
    body.appendChild(strong);
  }

  for (const [label, value] of rows) {
    if (value === undefined || value === null || value === "") continue;
    const row = document.createElement("div");
    // textContent, never innerHTML — feature properties are untrusted input.
    row.textContent = `${label}: ${value}`;
    body.appendChild(row);
  }

  return body;
}

export default function ThreeboxMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;

    let disposed = false;
    let map: any;
    let popup: any;
    let contactMarker: any;
    let contactPopup: any;
    let tb: any;
    let mapReady = false;
    let fatal = false;
    let loadTimer: number | undefined;
    let selectedHandler: ((e: CustomEvent) => void) | null = null;
    let markerEl: HTMLButtonElement | null = null;

    const onRender = () => tb?.update();

    // Keep the page (Lenis) from scrolling while the pointer is over the map.
    // Mapbox zoom still works: its own wheel handler runs on the canvas first.
    const onWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    // The map pin grows upwards on hover — lift the popup so it never covers
    // the pin, and drop it back when the pointer leaves.
    const onMarkerEnter = () => contactPopup?.setOffset([0, -44]);
    const onMarkerLeave = () => contactPopup?.setOffset([0, -18]);

    const openContactPopup = () => {
      if (!contactPopup || !map) return;
      if (!contactPopup.isOpen()) contactPopup.addTo(map);
    };

    // Clicking the marker flies the camera to the contact location and zooms in.
    const onMarkerClick = (e: MouseEvent) => {
      // Keep the click away from the canvas — no building gets selected by accident.
      e.stopPropagation();
      e.preventDefault();
      if (!map) return;
      openContactPopup();
      map.flyTo({
        center: CONTACT_LOCATION,
        zoom: 19,
        pitch: 70,
        bearing: -25,
        speed: 0.9,
        curve: 1.5,
      });
    };

    async function init() {
      try {
        await loadScript(MAPBOX_GL_URL, () => !!window.mapboxgl);
        await loadScript(THREEBOX_URL, () => !!window.Threebox);
        if (disposed) return;

        const mapboxgl = window.mapboxgl;
        const Threebox = window.Threebox;

        if (!mapboxgl) {
          throw new Error("Mapbox GL failed to load");
        }

        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
          throw new Error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
        }
        mapboxgl.accessToken = token;

        map = new mapboxgl.Map({
          container,
          style: "mapbox://styles/mapbox/outdoors-v11",
          center: CONTACT_LOCATION,
          zoom: 16,
          pitch: 65,
          bearing: -25,
          antialias: true,
        });

        // Dev-only handle for debugging / e2e checks.
        if (process.env.NODE_ENV !== "production") {
          (window as any).__tbMap = map;
        }

        map.on("error", (e: any) => {
          const message = e?.error?.message;
          const code = e?.error?.status;
          if (message) console.error("Mapbox error:", message);
          // Only auth failures are fatal — a missing tile must not kill the map.
          if ((code === 401 || code === 403) && !fatal) {
            fatal = true;
            setErrorMessage(message ?? "Mapbox rejected the access token");
            setStatus("error");
          }
        });

        map.once("load", () => {
          if (disposed) return;
          mapReady = true;
          if (loadTimer !== undefined) window.clearTimeout(loadTimer);
          setStatus("ready");
        });

        // Style never loading (bad style URL, offline CDN) must not leave the
        // loading overlay spinning forever.
        loadTimer = window.setTimeout(() => {
          if (disposed || mapReady || fatal) return;
          fatal = true;
          setErrorMessage("Map took too long to load");
          setStatus("error");
        }, 15000);

        // THREEBOX — optional. If it fails the 2D map keeps working.
        try {
          const canvas = map.getCanvas();
          const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
          if (!gl) throw new Error("WebGL context unavailable");

          tb = new Threebox(map, gl, {
            defaultLights: true,
            enableSelectingFeatures: true,
            // Custom popup replaces threebox tooltips (no duplicate UI).
            enableTooltips: false,
          });
        } catch (tbError) {
          console.error("Threebox init failed", tbError);
          tb = undefined;
        }

        // CONTACT MARKER — points at the place where visitors should find us.
        markerEl = document.createElement("button");
        markerEl.type = "button";
        markerEl.className = "contact-marker";
        markerEl.setAttribute("aria-label", "Find us here.");

        // Hover/focus reveals a classic map pin above the beacon dot.
        const pinEl = document.createElement("span");
        pinEl.className = "contact-marker-pin";
        pinEl.setAttribute("aria-hidden", "true");
        pinEl.innerHTML = CONTACT_PIN_SVG;
        markerEl.appendChild(pinEl);

        contactPopup = new mapboxgl.Popup({
          offset: [0, -18],
          closeButton: false,
          className: "premium-popup",
        })
          .setLngLat(CONTACT_LOCATION)
          .setDOMContent(buildPopupBody("Find us here."));

        markerEl.addEventListener("mouseenter", onMarkerEnter);
        markerEl.addEventListener("mouseleave", onMarkerLeave);
        markerEl.addEventListener("focus", onMarkerEnter);
        markerEl.addEventListener("blur", onMarkerLeave);
        markerEl.addEventListener("click", onMarkerClick);

        // No setPopup here — clicking the marker zooms to the location instead
        // of toggling the popup.
        contactMarker = new mapboxgl.Marker({
          element: markerEl,
          anchor: "center",
        })
          .setLngLat(CONTACT_LOCATION)
          .addTo(map);

        // Reveal the marker popup once the map has settled.
        map.once("load", () => {
          if (!disposed) openContactPopup();
        });

        // FEATURE SELECTION — threebox v2 fires "SelectedFeatureChange" only.
        selectedHandler = (e: CustomEvent) => {
          const feature = e?.detail;

          if (!feature?.state?.select) {
            // Deselected (or no state) — drop building popup, restore contact popup.
            popup?.remove();
            popup = undefined;
            openContactPopup();
            return;
          }

          if (!tb) return;

          const coords = tb.getFeatureCenter(feature, null, 0);
          if (
            !Array.isArray(coords) ||
            coords.length < 2 ||
            !Number.isFinite(coords[0]) ||
            !Number.isFinite(coords[1])
          ) {
            console.warn("Feature has no usable center", feature);
            return;
          }

          popup?.remove();
          contactPopup?.remove();

          const props = feature.properties ?? {};
          const rows: Array<[string, string]> = [];
          if (props.height !== undefined && props.height !== null) {
            rows.push(["Height", `${props.height} m`]);
          }
          if (props.levels !== undefined && props.levels !== null) {
            rows.push(["Floors", String(props.levels)]);
          }
          const content = buildPopupBody(props.name || "Building", rows);

          popup = new mapboxgl.Popup({
            offset: [0, -10],
            closeButton: true,
            className: "premium-popup premium-popup--building",
          })
            .setLngLat([coords[0], coords[1]])
            .setDOMContent(content)
            .on("close", () => {
              // Drop the highlight again so the building is not stuck selected.
              if (feature.id !== undefined) {
                map.setFeatureState(
                  {
                    source: feature.source,
                    sourceLayer: feature.sourceLayer,
                    id: feature.id,
                  },
                  { select: false },
                );
              }
              popup = undefined;
              if (!disposed) openContactPopup();
            })
            .addTo(map);

          map.flyTo({
            center: [coords[0], coords[1]],
            zoom: 19,
            pitch: 70,
            bearing: -25,
            speed: 0.9,
            curve: 1.5,
          });
        };

        map.on("SelectedFeatureChange", selectedHandler);
        map.on("render", onRender);

        const minZoom = 12;

        map.on("style.load", () => {
          try {
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
                    minZoom + 1,
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
          } catch (layerError) {
            console.error("Failed to add map layers", layerError);
          }
        });

        map.scrollZoom.enable();
        map.scrollZoom.setWheelZoomRate(1 / 200);

        // mapbox-gl v2 ships no navigation control by default — add zoom/compass.
        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

        const mapContainer = map.getContainer();
        mapContainer.addEventListener("wheel", onWheel, { passive: true });
      } catch (err) {
        if (disposed) return;
        if (loadTimer !== undefined) window.clearTimeout(loadTimer);
        fatal = true;
        const message = err instanceof Error ? err.message : String(err);
        console.error("Map init failed", err);
        setErrorMessage(message);
        setStatus("error");
      }
    }

    init();

    return () => {
      disposed = true;
      if (loadTimer !== undefined) window.clearTimeout(loadTimer);
      popup?.remove();
      contactPopup?.remove();
      contactMarker?.remove();
      if (markerEl) {
        markerEl.removeEventListener("mouseenter", onMarkerEnter);
        markerEl.removeEventListener("mouseleave", onMarkerLeave);
        markerEl.removeEventListener("focus", onMarkerEnter);
        markerEl.removeEventListener("blur", onMarkerLeave);
        markerEl.removeEventListener("click", onMarkerClick);
        markerEl = null;
      }
      if (map) {
        map.off("render", onRender);
        map.getContainer().removeEventListener("wheel", onWheel);
        if (selectedHandler) {
          map.off("SelectedFeatureChange", selectedHandler);
        }
        map.remove();
        map = undefined;
      }
      delete (window as any).__tbMap;
    };
  }, []);

  return (
    <div
      className="relative w-full h-[650px] overflow-hidden rounded-3xl"
      role="region"
      aria-label="Map showing our location">
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center bg-slate-900/80 text-sm text-slate-300">
          Loading map…
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-slate-900/90 px-6 text-center text-sm text-red-300">
          Map unavailable. {errorMessage}
        </div>
      )}
    </div>
  );
}
