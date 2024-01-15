import {
  useCallback,
  useEffect,
  useRef,
  useState,
  WheelEventHandler,
} from "react";

import { AddComponentTile } from "./AddComponentTile.tsx";
import { ContainerHeader } from "../../universal/ContainerHeader.tsx";

interface AddComponentProps {
  mountableComponentsSpecs: readonly string[];
  onClose: () => void;
  add: (id: string) => void;
}

export const AddComponent = ({
  mountableComponentsSpecs,
  onClose,
  add,
}: AddComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = useCallback(() => {
    if (containerRef.current) {
      const currentOverflow =
        containerRef.current.scrollWidth > containerRef.current.clientWidth;

      setIsOverflowing(currentOverflow);
      containerRef.current.classList.toggle("justify-center", !currentOverflow);
      containerRef.current.classList.toggle("justify-start", currentOverflow);
    }
  }, []);

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [checkOverflow]);

  const onWheel = useCallback<WheelEventHandler<HTMLDivElement>>((e) => {
    if (containerRef.current) {
      const scrollAmount = e.deltaY * 0.9;
      containerRef.current.scrollLeft += scrollAmount;
    }
  }, []);

  const handleAdd = useCallback(
    (componentSpecId: string) => {
      return () => {
        add(componentSpecId);
        onClose();
      };
    },
    [add, onClose]
  );

  return (
    <>
      <ContainerHeader title={"Add component"} onClose={onClose} />

      <div
        ref={containerRef}
        onWheel={onWheel}
        className="flex items-center space-x-2 overflow-x-scroll px-4 py-2"
      >
        {mountableComponentsSpecs.map((componentSpecId) => (
          <AddComponentTile
            key={componentSpecId}
            componentSpecId={componentSpecId}
            add={handleAdd(componentSpecId)}
          />
        ))}

        {isOverflowing && (
          <div className="pointer-events-none absolute bottom-4 right-0 top-10 w-14 bg-gradient-to-r from-white/0 to-white dark:from-gray-900/0 dark:to-gray-900" />
        )}
      </div>
    </>
  );
};
