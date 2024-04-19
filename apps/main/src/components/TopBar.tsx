import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { LanguageSwitcher } from "@3dwebprodconf/shared/src/components/LanguageSwitcher.tsx";
import { ThemeSwitcher } from "@3dwebprodconf/shared/src/components/ThemeSwitcher.tsx";
import { useDarkMode } from "@3dwebprodconf/shared/src/hooks/useDarkMode.ts";
import { Popover, Transition } from "@headlessui/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Fragment, ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { globalConfig } from "../configurations/Config.ts";

interface TopBarProps {
  children: ReactNode;
}

export const TopBar = ({ children }: TopBarProps) => {
  const { t } = useTranslation();

  const isDarkmode = useDarkMode();

  return (
    <div className="app flex h-dvh flex-col">
      <div className="other-background z-[90] block border-b border-gray-200 p-2 shadow-sm dark:border-zinc-700">
        <div className="flex flex-row items-center justify-between">
          <a
            href={globalConfig.config.sources.homepageUrl}
            className="ml-2 inline-flex h-full items-center"
          >
            <img
              src={
                isDarkmode
                  ? globalConfig.config.images.logo.dark
                  : globalConfig.config.images.logo.light
              }
              alt={"logo"}
              className="max-h-8"
            />
          </a>

          <Popover className="relative">
            <Popover.Button className="other-button">
              <Cog6ToothIcon className="size-4" />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-[150] ml-10 mt-1 -translate-x-full px-2">
                <div className="glass-panel">
                  <div className="flex flex-col">
                    <ContainerHeader title={t("settings")} subheader={true} />
                    <div className="flex flex-col px-2 pb-2">
                      <div className="w-full">
                        <div className="mt-2 space-y-1">
                          <span className="label">{t("theme")}</span>
                          <ThemeSwitcher />
                        </div>
                        {globalConfig.config.ui.languages.all.length > 1 && (
                          <div className="mt-2 space-y-1">
                            <span className="label">{t("language")}</span>
                            <LanguageSwitcher />
                          </div>
                        )}
                        <span className="mt-4 flex items-center justify-center text-xs font-light text-gray-400 dark:text-zinc-600">
                          3dwebprodconf
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
      </div>
      {children}
    </div>
  );
};
