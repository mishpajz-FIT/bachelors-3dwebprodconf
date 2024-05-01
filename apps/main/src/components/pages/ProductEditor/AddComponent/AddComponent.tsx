import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  WheelEventHandler,
} from "react";
import { useTranslation } from "react-i18next";
import { useSnapshot } from "valtio";

import { AddComponentTile } from "./subcomponents/AddComponentTile.tsx";
import { ProductSpecificationStore } from "../../../../stores/ProductSpecificationStore.ts";

interface AddComponentProps {
  mountableComponentsSpecs: readonly string[];
  disabledComponentSpecs: string[];
  onClose: () => void;
  onAdd: (id: string) => void;
}

export const AddComponent = ({
  mountableComponentsSpecs,
  disabledComponentSpecs,
  onClose,
  onAdd,
}: AddComponentProps) => {
  const { t } = useTranslation();

  const productSpecsSnap = useSnapshot(ProductSpecificationStore);

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

  const sortComponents = (
    lhsComponentSpecId: string,
    rhsComponentSpecId: string
  ): number => {
    const lhsComponentSpec =
      // eslint-disable-next-line valtio/state-snapshot-rule
      productSpecsSnap.componentSpecs[lhsComponentSpecId];
    const rhsComponentSpec =
      // eslint-disable-next-line valtio/state-snapshot-rule
      productSpecsSnap.componentSpecs[rhsComponentSpecId];

    const lhsDisabled = disabledComponentSpecs.includes(lhsComponentSpecId);
    const rhsDisabled = disabledComponentSpecs.includes(rhsComponentSpecId);

    if (lhsDisabled && !rhsDisabled) {
      return 1;
    } else if (!lhsDisabled && rhsDisabled) {
      return -1;
    }

    if (
      lhsComponentSpec.sortIndex !== undefined &&
      rhsComponentSpec.sortIndex !== undefined
    ) {
      return lhsComponentSpec.sortIndex - rhsComponentSpec.sortIndex;
    } else if (lhsComponentSpec.sortIndex === undefined) {
      return 1;
    } else {
      return -1;
    }
  };

  return (
    <>
      <ContainerHeader
        title={t("addComponent")}
        onClose={onClose}
        subheader={true}
      />

      <div
        ref={containerRef}
        onWheel={onWheel}
        className="flex items-center space-x-2 overflow-x-scroll px-4 py-2"
      >
        {[...mountableComponentsSpecs]
          .sort(sortComponents)
          .map((componentSpecId, index) => (
            <div className="m-2 h-[150px] w-[360px] shrink-0" key={index}>
              <AddComponentTile
                componentSpecId={componentSpecId}
                onAdd={() => {
                  onAdd(componentSpecId);
                  onClose();
                }}
                disabled={disabledComponentSpecs.includes(componentSpecId)}
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
