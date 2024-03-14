import { toast } from "react-hot-toast";

export const warningToast = (message: string) => {
  const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  toast(message, {
    icon: "⚠️",
    style: {
      color: darkMode ? "white" : "black",
      background: darkMode ? "rgb(24 24 27)" : "white",
    },
  });
};
