import { Html } from "@react-three/drei";
import { Vector3 } from "three";
import { snapshot } from "valtio";

import { ConfiguratorValuesStore } from "../../../stores/ConfiguratorValuesStore.ts";

interface SelectionButtonProps {
  componentId: string;
  position: Vector3;
}

export const SelectionButton = ({
  componentId,
  position,
}: SelectionButtonProps) => {
  const configuratorValuesSnap = snapshot(ConfiguratorValuesStore);

  return (
    <Html zIndexRange={[50, 0]} position={position}>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        hidden={!configuratorValuesSnap.showMountingPoints}
      >
        <button
          className="size-3 cursor-pointer rounded-full border border-gray-300 bg-[var(--primary-light)] dark:border-zinc-700 dark:bg-[var(--primary-dark)]"
          onClick={(event) => {
            event.stopPropagation();
            ConfiguratorValuesStore.selectedComponentId = componentId;
          }}
        ></button>
      </div>
    </Html>
  );
};
