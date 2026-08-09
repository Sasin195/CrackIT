import { useEffect } from "react";

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "system") {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", systemDark ? "dark" : "light");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

export function useTheme(theme) {
  useEffect(() => {
    applyTheme(theme);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") applyTheme("system");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);
}
