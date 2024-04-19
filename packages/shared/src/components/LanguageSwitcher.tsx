import { Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
  };

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  return (
    <Listbox value={selectedLanguage} onChange={changeLanguage}>
      {({ open }) => (
        <div className="relative w-full">
          <Listbox.Button className="w-full rounded-md bg-gray-100 px-2.5 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300/50 dark:bg-zinc-800 dark:text-white dark:ring-zinc-600 dark:focus:ring-zinc-500">
            {selectedLanguage.toUpperCase()}
          </Listbox.Button>
          {open && (
            <Listbox.Options className="glass-panel absolute max-h-64 w-full overflow-y-auto rounded-md py-1">
              {i18n.options.supportedLngs !== false &&
                i18n.options?.supportedLngs
                  ?.filter((lng) => lng !== "cimode")
                  .map((lng) => (
                    <Listbox.Option key={lng} value={lng} as={Fragment}>
                      {({ active, selected }) => (
                        <li
                          className={`flex cursor-pointer items-center justify-between px-2.5 py-1.5 text-sm dark:text-white ${
                            active
                              ? "bg-gray-100 shadow-sm dark:bg-zinc-900 dark:ring-zinc-600"
                              : ""
                          } ${selected ? "font-bold" : "font-semibold"}`}
                        >
                          {lng.toUpperCase()}
                          {selected && <CheckIcon className="ml-2 size-4" />}
                        </li>
                      )}
                    </Listbox.Option>
                  ))}
            </Listbox.Options>
          )}
        </div>
      )}
    </Listbox>
  );
};
