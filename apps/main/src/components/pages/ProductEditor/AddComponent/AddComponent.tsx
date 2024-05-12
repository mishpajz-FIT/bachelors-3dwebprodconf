import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
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
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isOverflowingRight, setIsOverflowingRight] = useState(false);
  const [isOverflowingLeft, setIsOverflowingLeft] = useState(false);

  useEffect(() => {
    const updateOverflows = () => {
      if (!containerRef.current) return;
      const { scrollWidth, clientWidth, scrollLeft } = containerRef.current;
      const isScrollable = scrollWidth > clientWidth;
      const isNotFullyScrolled = scrollLeft < scrollWidth - clientWidth - 1;

      setIsOverflowingRight(isScrollable && isNotFullyScrolled);
      setIsOverflowingLeft(scrollLeft !== 0);

      containerRef.current.classList.toggle("justify-center", !isScrollable);
      containerRef.current.classList.toggle("justify-start", isScrollable);
    };

    const container = containerRef.current;
    if (!container) return;
    updateOverflows();
    container.addEventListener("scroll", updateOverflows);
    window.addEventListener("resize", updateOverflows);
    return () => {
      container.removeEventListener("scroll", updateOverflows);
      window.removeEventListener("resize", updateOverflows);
    };
  }, []);

  const onWheel = useCallback<WheelEventHandler<HTMLDivElement>>((e) => {
    if (containerRef.current) {
      const scrollAmount = e.deltaY * 0.9;
      containerRef.current.scrollLeft += scrollAmount;
    }
  }, []);

  const scrollRight = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;

    let nextItemIndex = itemRefs.current.findIndex(
      (item) =>
        item && item.offsetLeft > scrollLeft + clientWidth - item.offsetWidth
    );

    if (nextItemIndex === -1) {
      nextItemIndex = itemRefs.current.length - 1;
    }

    const nextItem = itemRefs.current[nextItemIndex];

    if (nextItem) {
      containerRef.current.scrollTo({
        left: nextItem.offsetLeft - clientWidth + nextItem.offsetWidth + 50,
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (!containerRef.current) return;
    const { scrollLeft } = containerRef.current;

    let prevItemIndex = [...itemRefs.current]
      .reverse()
      .findIndex((item) => item && item.offsetLeft < scrollLeft);

    if (prevItemIndex === -1) {
      prevItemIndex = itemRefs.current.length - 1;
    }

    const prevItem =
      itemRefs.current[itemRefs.current.length - 1 - prevItemIndex];

    if (prevItem) {
      containerRef.current.scrollTo({
        left: prevItem.offsetLeft - 50,
        behavior: "smooth",
      });
    }
  };

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

      <div>
        <div
          ref={containerRef}
          onWheel={onWheel}
          className="flex items-center space-x-2 overflow-x-scroll px-4 py-2"
        >
          {[...mountableComponentsSpecs]
            .sort(sortComponents)
            .map((componentSpecId, index) => (
              <div
                className="m-2 h-[150px] w-[360px] shrink-0"
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
              >
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
        </div>

        <div
          className="other-background-fade-left pointer-events-none absolute bottom-4 left-0 top-12 w-28"
          hidden={!isOverflowingLeft}
        >
          <button
            className="other-background-fade-left pointer-events-auto absolute inset-y-0 left-0 flex w-14 items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              scrollLeft();
            }}
          >
            <ChevronLeftIcon className="other-background-fade-left size-8 stroke-gray-900/60 dark:stroke-white/60" />
          </button>
        </div>

        <div
          className="other-background-fade-right pointer-events-none absolute bottom-4 right-0 top-12 w-28"
          hidden={!isOverflowingRight}
        >
          <button
            className="other-background-fade-right pointer-events-auto absolute inset-y-0 right-0 flex w-14 items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              scrollRight();
            }}
          >
            <ChevronRightIcon className="other-background-fade-right size-8 stroke-gray-900/60 dark:stroke-white/60" />
          </button>
        </div>
      </div>
    </>
  );
};
