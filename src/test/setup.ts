import "@testing-library/jest-dom/vitest";

// jsdom n'implémente pas matchMedia — polyfill minimal pour usePrefersReducedMotion.
if (typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

// scrollTo n'est pas implémenté non plus (ScrollManager).
if (typeof window.scrollTo !== "function") {
  window.scrollTo = (() => undefined) as typeof window.scrollTo;
}
