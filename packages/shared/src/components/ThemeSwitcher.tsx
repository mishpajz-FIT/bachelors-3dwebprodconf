import { Tab } from "@headlessui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ThemeSwitcher = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(
    ["system", "light", "dark"].indexOf(
      localStorage.getItem("theme") ?? "system"
    )
  );

  const tabClassName = (selected: boolean) => {
    const basicStyle =
      "w-full rounded-md px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 dark:text-white dark:ring-zinc-600 dark:focus:ring-zinc-500";
    const selectedStyle =
      "bg-white shadow-sm dark:bg-zinc-900 dark:text-white dark:ring-zinc-600";

    return `${basicStyle} ${selected ? selectedStyle : ""}`;
  };

  const setTheme = (newTheme: string) => {
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("themeChange"));
    setActiveTab(["system", "light", "dark"].indexOf(newTheme));
  };

  return (
    <Tab.Group selectedIndex={activeTab}>
      <Tab.List className="flex space-x-1 rounded-md bg-gray-100 p-1 dark:bg-zinc-800">
        {[
          ["system", "systemTheme"],
          ["light", "lightTheme"],
          ["dark", "darkTheme"],
        ].map(([theme, name]) => (
          <Tab
            key={theme}
            onClick={() => setTheme(theme.toLowerCase())}
            className={({ selected }) => tabClassName(selected)}
          >
            {t(name)}
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  );
};
