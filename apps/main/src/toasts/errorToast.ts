import { toast } from "react-hot-toast";

import { globalConfig } from "../configurations/Config.ts";

export const errorToast = (message: string) => {
  const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  toast.error(message, {
    style: {
      color: "white",
      background: darkMode
        ? globalConfig.config.ui.colors.error.dark
        : globalConfig.config.ui.colors.error.light,
    },
    iconTheme: {
      secondary: darkMode
        ? globalConfig.config.ui.colors.error.dark
        : globalConfig.config.ui.colors.error.light,
      primary: "white",
    },
  });
};
