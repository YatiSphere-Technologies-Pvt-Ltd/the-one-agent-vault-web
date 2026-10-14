// Hero seal demo: four tabs (roving tabindex, arrow keys, Home/End) and "Simulate a change".
// Geometry was computed at build time with sealGeometry(); this only swaps attributes and text.

interface Kind {
  key: string;
  name: string;
  type: string;
  okLabel: string;
  heldLabel: string;
  mark: string;
  dash: string;
  rotation: number;
}

export function initSealDemo(): void {
  const root = document.querySelector<HTMLElement>("[data-seal-demo]");
  if (!root) return;
  const kinds = JSON.parse(root.dataset.sealDemo ?? "[]") as Kind[];
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panel = root.querySelector<HTMLElement>('[role="tabpanel"]');
  const seal = root.querySelector<SVGSVGElement>("#hero-seal");
  const ring = seal?.querySelector<SVGCircleElement>("[data-ring]");
  const toggle = root.querySelector<HTMLButtonElement>("[data-toggle]");
  const stopTour = root.querySelector<HTMLButtonElement>("[data-stop-tour]");
  const live = root.querySelector<HTMLElement>("[aria-live]");
  if (!panel || !seal || !ring || !toggle) return;

  let current = 0;
  let changed = false;
  const field = (name: string) => root.querySelector<HTMLElement>(`[data-field="${name}"]`);

  const render = () => {
    const kind = kinds[current];
    if (!kind) return;
    ring.setAttribute("stroke-dasharray", kind.dash);
    ring.setAttribute("transform", `rotate(${kind.rotation} 36 36)`);
    seal.dataset.state = changed ? "broken" : "intact";
    seal.setAttribute("aria-label", (changed ? toggle.dataset.sealBroken : toggle.dataset.sealIntact) ?? "");
    for (const key of ["name", "type", "okLabel", "heldLabel", "mark"] as const) {
      const el = field(key);
      if (el) el.textContent = kind[key];
    }
    root.querySelectorAll<HTMLElement>("[data-when]").forEach((el) => {
      if (el.closest("svg")) return;
      el.hidden = el.dataset.when !== (changed ? "broken" : "intact");
    });
    toggle.textContent = (changed ? toggle.dataset.labelRestore : toggle.dataset.labelSimulate) ?? "";
    toggle.setAttribute("aria-pressed", String(changed));
    tabs.forEach((tab, i) => {
      const selected = i === current;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tabs[current]?.id ?? "");
  };

  const select = (index: number, focus: boolean) => {
    current = (index + tabs.length) % tabs.length;
    changed = false;
    render();
    if (focus) tabs[current]?.focus();
  };

  // ---- A single demonstration of a definition change. Any interaction ends it. ----
  const timers: number[] = [];
  let touring = false;
  const endTour = () => {
    if (!touring) return;
    touring = false;
    timers.forEach((t) => window.clearTimeout(t));
    if (stopTour) stopTour.hidden = true;
    live?.setAttribute("aria-live", "polite");
  };
  const startTour = () => {
    if (!document.documentElement.classList.contains("motion")) return;
    touring = true;
    live?.setAttribute("aria-live", "off"); // do not narrate an automatic tour
    if (stopTour) stopTour.hidden = false;
    // One demonstration only: the first kind breaks once, holds long enough to read, restores.
    timers.push(window.setTimeout(() => { changed = true; render(); }, 3000));
    timers.push(window.setTimeout(() => { changed = false; render(); endTour(); }, 9000));
  };
  for (const type of ["pointerdown", "keydown", "focusin"] as const) {
    root.addEventListener(type, (e) => {
      if (e.target === stopTour) return;
      endTour();
    });
  }
  stopTour?.addEventListener("click", () => {
    endTour();
    select(current, true);
  });

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i, false));
    tab.addEventListener("keydown", (e) => {
      const rtl = document.documentElement.dir === "rtl";
      const next = rtl ? "ArrowLeft" : "ArrowRight";
      const prev = rtl ? "ArrowRight" : "ArrowLeft";
      if (e.key === next) select(current + 1, true);
      else if (e.key === prev) select(current - 1, true);
      else if (e.key === "Home") select(0, true);
      else if (e.key === "End") select(tabs.length - 1, true);
      else return;
      e.preventDefault();
    });
  });

  toggle.addEventListener("click", () => {
    changed = !changed;
    render();
  });

  // The toggle is useless without JavaScript, so it is only revealed here.
  toggle.hidden = false;
  startTour();
}
