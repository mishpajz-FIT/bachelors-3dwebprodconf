import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      ((localStorage.getItem("theme") ?? "system") === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme") ?? "system";
      const newIsDarkMode =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDarkMode(newIsDarkMode);
    };

    const darkThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkThemeQuery.addEventListener("change", handleThemeChange);

    window.addEventListener("themeChange", handleThemeChange);

    return () => {
      darkThemeQuery.removeEventListener("change", handleThemeChange);
      window.removeEventListener("themeChange", handleThemeChange);
    };
  }, []);

  return isDarkMode;
}
