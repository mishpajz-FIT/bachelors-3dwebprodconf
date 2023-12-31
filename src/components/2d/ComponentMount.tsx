import {useEffect, useRef, useState, WheelEventHandler} from "react";
import {XMarkIcon} from "@heroicons/react/20/solid";

interface ComponentMountProps {
  closeModal: () => void
}

export const ComponentMount = ({closeModal} : ComponentMountProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = () => {
    if (containerRef.current) {
      const currentOverflow = containerRef.current.scrollWidth > containerRef.current.clientWidth;
      setIsOverflowing(currentOverflow);
      containerRef.current.classList.toggle('justify-center', !currentOverflow);
      containerRef.current.classList.toggle('justify-start', currentOverflow);
    }
  };

  const onWheel: WheelEventHandler<HTMLDivElement> = (e) => {
    if (containerRef.current) {
      const scrollAmount = e.deltaY * 0.9;
      containerRef.current.scrollLeft += scrollAmount;
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <>
      <div className="flex justify-end px-2 pt-2">
        <button className="other-button" onClick={closeModal}>
          <span className="sr-only">Close</span>
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <div ref={containerRef} onWheel={onWheel} className="flex items-center space-x-2 overflow-x-auto px-4 py-2">

        {/* TODO insert content */}

        {isOverflowing &&
          (<div className="pointer-events-none absolute bottom-4 right-0 top-10 w-14 bg-gradient-to-r from-white/0 to-white dark:from-gray-900/0 dark:to-gray-900" />)}
      </div></>
  );
};