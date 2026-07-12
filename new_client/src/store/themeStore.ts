import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface ThemeStore {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const THEME_KEY = "EXPENSE_THEME";
let transitionCleanupTimer: number | undefined;

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "dark" ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_KEY, theme);
}

function transitionToTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    applyTheme(theme);
    return;
  }

  root.classList.add("theme-transition");
  if (transitionCleanupTimer !== undefined) window.clearTimeout(transitionCleanupTimer);
  window.requestAnimationFrame(() => {
    applyTheme(theme);
    transitionCleanupTimer = window.setTimeout(() => {
      root.classList.remove("theme-transition");
      transitionCleanupTimer = undefined;
    }, 360);
  });
}

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    if (theme === get().theme) return;
    transitionToTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark";
    transitionToTheme(nextTheme);
    set({ theme: nextTheme });
  },
}));
