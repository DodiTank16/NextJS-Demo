import { test, expect } from "@playwright/test";

/**
 * Regression checks for the Mapbox + Threebox map on /contact-us.
 * Requires a valid NEXT_PUBLIC_MAPBOX_TOKEN (see .env).
 */

test("map renders, is styled and interactive", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

  await page.goto("/contact-us", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".mapboxgl-canvas", { timeout: 45000 });
  await page.waitForTimeout(6000);

  const layout = await page.evaluate(() => {
    const el = (s: string) => document.querySelector(s) as HTMLElement | null;
    const canvas = el(".mapboxgl-canvas");
    const popup = el(".premium-popup .mapboxgl-popup-content");
    const cs = popup ? getComputedStyle(popup) : null;
    return {
      canvasPos: canvas ? getComputedStyle(canvas).position : null,
      zoomButtons: document.querySelectorAll(
        ".mapboxgl-ctrl-zoom-in, .mapboxgl-ctrl-zoom-out",
      ).length,
      attribution: el(".mapboxgl-ctrl-attrib")?.textContent ?? "",
      logoVisible: !!el(".mapboxgl-ctrl-logo"),
      markerVisible: !!el(".contact-marker"),
      popupText: el(".premium-popup .popup-body")?.textContent ?? "",
      popupBg: cs?.backgroundColor ?? null,
      popupColor: cs?.color ?? null,
      docOverflow: document.documentElement.style.overflow,
    };
  });

  expect(layout.canvasPos).toBe("absolute"); // official mapbox-gl.css is loaded
  expect(layout.zoomButtons).toBe(2); // NavigationControl added by the component
  expect(layout.attribution).toContain("Mapbox");
  expect(layout.logoVisible).toBe(true);
  expect(layout.markerVisible).toBe(true);
  expect(layout.popupText).toContain("Find us here.");
  expect(layout.popupBg).toBe("rgba(15, 23, 42, 0.94)");
  expect(layout.popupColor).toBe("rgb(248, 250, 252)");
  expect(layout.docOverflow).toBe(""); // no page scroll-lock hack
  expect(errors).toEqual([]);
});

test("page scrolls outside the map, map zooms over the map", async ({ page }) => {
  await page.goto("/contact-us", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".mapboxgl-canvas", { timeout: 45000 });
  await page.waitForTimeout(5000);

  const canvas = page.locator(".mapboxgl-canvas");
  const box = (await canvas.boundingBox())!;

  // over the map -> the page does not scroll, the map zooms
  // (hover off the marker popup: mapbox only zooms when the pointer is over the canvas)
  const px = box.x + box.width * 0.2;
  const py = Math.min(box.y + 60, 600);
  const hit = await page.evaluate(
    ([x, y]) =>
      (document.elementFromPoint(x as number, y as number) as HTMLElement)
        ?.className ?? null,
    [px, py],
  );
  expect(hit).not.toBeNull();

  const zoomBefore = await page.evaluate(() => (window as any).__tbMap.getZoom());
  await page.mouse.move(px, py);
  await page.mouse.wheel(0, -400);
  await page.waitForTimeout(1500);
  const zoomAfter = await page.evaluate(() => (window as any).__tbMap.getZoom());
  const scrollWhileOverMap = await page.evaluate(() => window.scrollY);

  expect(zoomAfter).toBeGreaterThan(zoomBefore);
  expect(scrollWhileOverMap).toBe(0);

  // outside the map -> the page scrolls
  await page.mouse.move(5, 5);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1500);
  const scrolled = await page.evaluate(() => window.scrollY);
  expect(scrolled).toBeGreaterThan(0);
});

test("3D building selection opens a styled popup", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

  await page.goto("/contact-us", { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".mapboxgl-canvas", { timeout: 45000 });
  await page.waitForTimeout(6000);

  // find a pixel that actually renders an extruded building
  const target = await page.evaluate(() => {
    const map = (window as any).__tbMap;
    const Point = (window as any).mapboxgl.Point;
    const canvas = map.getCanvas();
    for (let fy = 0.1; fy < 0.95; fy += 0.02) {
      for (let fx = 0.1; fx < 0.95; fx += 0.02) {
        const x = Math.round(fx * canvas.clientWidth);
        const y = Math.round(fy * canvas.clientHeight);
        const feats = map.queryRenderedFeatures(new Point(x, y), {
          layers: ["3d-buildings"],
        });
        if (feats.length) return { x, y };
      }
    }
    return null;
  });

  test.skip(!target, "no extruded building in the current viewport");
  if (!target) return;

  const box = (await page.locator(".mapboxgl-canvas").boundingBox())!;
  await page.mouse.click(box.x + target.x, box.y + target.y);
  await page.waitForTimeout(1500);

  const popup = await page.evaluate(() => {
    const body = document.querySelector(".premium-popup .popup-body");
    const content = document.querySelector(
      ".premium-popup .mapboxgl-popup-content",
    ) as HTMLElement | null;
    const cs = content ? getComputedStyle(content) : null;
    return {
      text: body?.textContent ?? "",
      bg: cs?.backgroundColor ?? null,
      color: cs?.color ?? null,
      popups: document.querySelectorAll(".mapboxgl-popup").length,
    };
  });

  expect(popup.text).toContain("Height:");
  expect(popup.bg).toBe("rgba(15, 23, 42, 0.94)");
  expect(popup.color).toBe("rgb(248, 250, 252)");
  expect(popup.popups).toBe(1);
  expect(errors).toEqual([]);

  // closing the popup restores the contact popup and clears the highlight
  await page.locator(".premium-popup .mapboxgl-popup-close-button").click();
  await page.waitForTimeout(800);

  const afterClose = await page.evaluate(() => ({
    text: document.querySelector(".premium-popup .popup-body")?.textContent ?? "",
    popups: document.querySelectorAll(".mapboxgl-popup").length,
  }));

  expect(afterClose.text).toContain("Find us here.");
  expect(afterClose.popups).toBe(1);
  expect(errors).toEqual([]);
});
