import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(
    (!window.matchMedia("print").matches &&
      localStorage.getItem("theme") === "dark") ||
      ((localStorage.getItem("theme") ?? "system") === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    const handleThemeChange = () => {
      if (window.matchMedia("print").matches) {
        setIsDarkMode(false);
        return;
      }

      const theme = localStorage.getItem("theme") ?? "system";
      const newIsDarkMode =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(newIsDarkMode);
    };

    const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const printMediaQuery = window.matchMedia("print");
    darkThemeQuery.addEventListener("change", handleThemeChange);
    printMediaQuery.addEventListener("change", handleThemeChange);
    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      darkThemeQuery.removeEventListener("change", handleThemeChange);
      printMediaQuery.removeEventListener("change", handleThemeChange);
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  return isDarkMode;
}
