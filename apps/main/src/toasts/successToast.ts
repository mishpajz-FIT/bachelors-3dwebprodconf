import { toast } from "react-hot-toast";

export const successToast = (message: string) => {
  const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

  toast.success(message, {
    style: {
      color: darkMode ? "white" : "black",
      background: darkMode ? "rgb(24 24 27)" : "white",
    },
  });
};
