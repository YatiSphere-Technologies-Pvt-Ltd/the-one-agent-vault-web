// Seal playground: hash the edited definition with Web Crypto and redraw the live seal from it.
import { sealGeometry } from "@agentvault/ui/seal-geometry";

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const short = (h: string) => `${h.slice(0, 13)}…${h.slice(-4)}`;

export function initPlayground(): void {
  const root = document.querySelector<HTMLElement>("[data-playground]");
  const editor = root?.querySelector<HTMLTextAreaElement>("#playground-editor");
  const seal = root?.querySelector<SVGSVGElement>("#playground-seal");
  const ring = seal?.querySelector<SVGCircleElement>("[data-ring]");
  const hashEl = root?.querySelector<HTMLElement>("[data-live-hash]");
  const status = root?.querySelector<HTMLElement>("[data-status]");
  const restore = root?.querySelector<HTMLButtonElement>("[data-restore]");
  if (!root || !editor || !seal || !ring || !hashEl || !status || !restore) return;
  if (!window.crypto?.subtle) return; // stays read-only: the approved definition is shown

  const pinned = root.dataset.pinned ?? "";
  const original = root.dataset.definition ?? editor.value;
  let request = 0;
  let announceTimer = 0;

  const update = async () => {
    const id = ++request;
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(editor.value));
    if (id !== request) return; // a newer keystroke won
    const hash = `sha256:${toHex(digest)}`;
    const intact = hash === pinned;
    const g = sealGeometry(hash, "intact", 120);
    ring.setAttribute("stroke-dasharray", g.dashArray);
    ring.setAttribute("transform", `rotate(${g.rotation} 36 36)`);
    if ((seal.dataset.state === "intact") !== intact) seal.dataset.state = intact ? "intact" : "broken";
    seal.setAttribute("aria-label", (intact ? status.dataset.labelIntact : status.dataset.labelBroken) ?? "");
    hashEl.textContent = short(hash);
    hashEl.title = hash;
    restore.disabled = intact;
    // Announce the result once typing pauses, not on every keystroke.
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(() => {
      status.querySelectorAll<HTMLElement>("[data-show]").forEach((el) => {
        el.hidden = el.dataset.show !== (intact ? "intact" : "broken");
      });
    }, 250);
  };

  editor.readOnly = false;
  editor.classList.remove("bg-sunken");
  editor.classList.add("bg-surface");
  restore.hidden = false;
  restore.disabled = true;
  root.querySelectorAll<HTMLElement>("[data-js-only]").forEach((el) => (el.hidden = false));
  editor.addEventListener("input", () => void update());
  restore.addEventListener("click", () => {
    editor.value = original;
    void update();
    editor.focus();
  });
}
