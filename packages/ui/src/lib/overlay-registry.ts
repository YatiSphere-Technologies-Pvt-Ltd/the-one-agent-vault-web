// Enforces the overlay rules: one sheet open at a time, no nested dialogs.
type Close = () => void;

const openSheets = new Map<symbol, Close>();
let openDialogs = 0;

/** Register an open sheet; any other open sheet closes. Returns the unregister function. */
export function registerSheet(close: Close): () => void {
  const id = Symbol("sheet");
  for (const [other, closeOther] of openSheets) {
    if (other !== id) closeOther();
  }
  openSheets.set(id, close);
  return () => openSheets.delete(id);
}

/** Register an open dialog; warns in development when one opens on top of another. */
export function registerDialog(): () => void {
  if (openDialogs > 0 && import.meta.env?.DEV) {
    console.error("AgentVault: nested dialogs are not allowed. Close the first dialog before opening another.");
  }
  openDialogs += 1;
  return () => {
    openDialogs -= 1;
  };
}
