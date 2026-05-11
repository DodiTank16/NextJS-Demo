/**
 * Smoothly scrolls the window to the top.
 * Safe to call only in the browser (client-side).
 */
export function scrollToTop(behavior: ScrollBehavior = "smooth"): void {
  if (typeof window === "undefined") return; // Prevent SSR errors

  try {
    window.scrollTo({
      top: 0,
      behavior, // "smooth" or "auto"
    });
  } catch (err) {
    console.error("Scroll to top failed:", err);
    // Fallback for older browsers
    window.scrollTo(0, 0);
  }
}
