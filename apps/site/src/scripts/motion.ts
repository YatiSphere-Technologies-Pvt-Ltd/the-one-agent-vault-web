// Landing-page motion controller. Only runs when <html> has the "motion" class (set in <head>
// unless the visitor prefers reduced motion).
//  - [data-reveal], [data-scene], [data-seal-anim]: get data-inview once they scroll into view.
//  - [data-loop]: get data-running while on screen; a [data-motion-toggle] inside pauses/plays it.
export function initMotion(): void {
  const root = document.documentElement;
  if (!root.classList.contains("motion") || !("IntersectionObserver" in window)) {
    root.classList.remove("motion");
    return;
  }
  root.dataset.motionReady = "";

  const once = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.inview = "";
        once.unobserve(entry.target);
      }
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
  );
  document.querySelectorAll("[data-reveal], [data-scene], [data-seal-anim]").forEach((el) => once.observe(el));

  const loops = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) el.dataset.running = "";
      else delete el.dataset.running;
    }
  });
  document.querySelectorAll<HTMLElement>("[data-loop]").forEach((loop) => {
    loops.observe(loop);
    const toggle = loop.querySelector<HTMLButtonElement>("[data-motion-toggle]");
    if (!toggle) return;
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      const paused = loop.dataset.paused === undefined;
      if (paused) loop.dataset.paused = "";
      else delete loop.dataset.paused;
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.textContent = (paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause) ?? "";
    });
  });

  // Loops stop entirely while the tab is hidden.
  document.addEventListener("visibilitychange", () => {
    document.querySelectorAll<HTMLElement>("[data-loop]").forEach((loop) => {
      if (document.hidden) delete loop.dataset.running;
    });
  });
}
