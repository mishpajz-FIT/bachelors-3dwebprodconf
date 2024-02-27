import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const themeListener = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkThemeQuery.addEventListener("change", themeListener);
    return () => darkThemeQuery.removeEventListener("change", themeListener);
  }, []);

  return isDarkMode;
}
