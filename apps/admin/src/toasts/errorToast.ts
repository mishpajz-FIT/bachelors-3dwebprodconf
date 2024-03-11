import { toast } from "react-hot-toast";

import { defaultAdminConfig } from "../configurations/Config.ts";

export const errorToast = (message: string) => {
  const darkMode = window.matchMedia("(prefers-color-scheme: dark)");

  toast.error(message, {
    style: {
      color: "white",
      background: darkMode
        ? defaultAdminConfig.ui.colors.error.dark
        : defaultAdminConfig.ui.colors.error.light,
    },
    iconTheme: {
      secondary: darkMode
        ? defaultAdminConfig.ui.colors.error.dark
        : defaultAdminConfig.ui.colors.error.light,
      primary: "white",
    },
  });
};
