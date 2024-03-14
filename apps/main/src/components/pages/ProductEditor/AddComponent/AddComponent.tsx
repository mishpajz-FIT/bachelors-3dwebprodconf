import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  WheelEventHandler,
} from "react";

import { AddComponentTile } from "./subcomponents/AddComponentTile.tsx";

interface AddComponentProps {
  mountableComponentsSpecs: readonly string[];
  onClose: () => void;
  onAdd: (id: string) => void;
}

export const AddComponent = ({
  mountableComponentsSpecs,
  onClose,
  onAdd,
}: AddComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const updateLayout = useCallback(() => {
    if (!containerRef.current) return;
    const currentOverflow =
      containerRef.current.scrollWidth > containerRef.current.clientWidth;

    setIsOverflowing(currentOverflow);
    containerRef.current.classList.toggle("justify-center", !currentOverflow);
    containerRef.current.classList.toggle("justify-start", currentOverflow);
  }, []);

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [updateLayout]);

  const onWheel = useCallback<WheelEventHandler<HTMLDivElement>>((e) => {
    if (containerRef.current) {
      const scrollAmount = e.deltaY * 0.9;
      containerRef.current.scrollLeft += scrollAmount;
    }
  }, []);

  return (
    <>
      <ContainerHeader
        title={"Add component"}
        onClose={onClose}
        subheader={true}
      />

      <div
        ref={containerRef}
        onWheel={onWheel}
        className="flex items-center space-x-2 overflow-x-scroll px-4 py-2"
      >
        {[...mountableComponentsSpecs].sort().map((componentSpecId, index) => (
          <div className="m-2 h-[150px] w-[360px] shrink-0" key={index}>
            <AddComponentTile
              componentSpecId={componentSpecId}
              onAdd={() => {
                onAdd(componentSpecId);
                onClose();
              }}
            />
          </div>
        ))}

        {isOverflowing && (
          <div className="other-background-fade-right pointer-events-none absolute bottom-4 right-0 top-12 w-14" />
        )}
      </div>
    </>
  );
};
