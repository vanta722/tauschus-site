import type { ImmersiveMode } from "@/components/scene/ImmersiveScene";

const KEY = "immersive_mode";

export function getInitialMode(defaultMode: ImmersiveMode): ImmersiveMode {
  if (typeof window === "undefined") return defaultMode;

  const queryMode = new URLSearchParams(window.location.search).get("mode");
  if (queryMode === "lionx" || queryMode === "wuntoo" || queryMode === "fca") {
    localStorage.setItem(KEY, queryMode);
    return queryMode;
  }

  const saved = localStorage.getItem(KEY);
  if (saved === "lionx" || saved === "wuntoo" || saved === "fca") return saved;

  return defaultMode;
}

export function setMode(mode: ImmersiveMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, mode);
}
