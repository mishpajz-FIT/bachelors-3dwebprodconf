import { ReactNode, useEffect, useState } from "react";

import { Config } from "../configurations/Config.ts";
import {
  ConfigContext,
  DefaultConfig,
} from "../configurations/contexts/ConfigContext.ts";

interface ConfigContextProviderProps {
  children: ReactNode;
}

export const ConfigContextProvider = ({
  children,
}: ConfigContextProviderProps) => {
  const [config, setConfig] = useState(DefaultConfig);

  useEffect(() => {
    const fetchConfig = () => {
      fetch("/AppConfig.json")
        .then((response) => response.json())
        .then((data: Config) => setConfig(data))
        .catch((error) =>
          console.error("Failed to load app configuration:", error)
        );
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  );
};
