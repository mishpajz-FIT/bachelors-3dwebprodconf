import { autoUpdate, offset, Placement, useFloating } from "@floating-ui/react";
import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface HoldButtonProps {
  onSubmit: () => void;
  children: ReactNode;
  duration: number;
  popoverPosition: Placement;
  popoverOffset?: number;
  className?: string;
}

export const HoldButton = ({
  onSubmit,
  children,
  className,
  popoverPosition = "top-end",
  popoverOffset = 10,
  duration = 750,
}: HoldButtonProps) => {
  const { t } = useTranslation();

  const [progress, setProgress] = useState(0);
  const interval = useRef<NodeJS.Timeout | null>(null);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open: isPopoverOpen,
    onOpenChange: setIsPopoverOpen,
    placement: popoverPosition,
    middleware: [offset(popoverOffset)],
    whileElementsMounted: autoUpdate,
  });

  const timeIncrease = (duration * 5) / 100;

  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  const startCounter = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    setProgress(0);
    interval.current = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 5);
    }, timeIncrease);
  };

  const stopCounter = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }
    setProgress(0);
  };

  useEffect(() => {
    if (progress >= 100) {
      setProgress(0);
      if (interval.current) {
        clearInterval(interval.current);
      }
      onSubmit();
    }
  }, [progress, onSubmit]);

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, confirm: boolean) => {
    if (e.key === "Enter" || e.key === " ") {
      if (confirm) {
        startCounter();
      } else {
        stopCounter();
      }
    }
  };

  return (
    <>
      <button
        ref={refs.setReference}
        className={className}
        style={{
          backgroundSize: `${progress}%`,
        }}
        onMouseDown={startCounter}
        onMouseUp={stopCounter}
        onMouseLeave={stopCounter}
        onTouchStart={startCounter}
        onTouchEnd={stopCounter}
        onTouchCancel={stopCounter}
        onKeyDown={(e) => handleKey(e, true)}
        onKeyUp={(e) => handleKey(e, false)}
        onClick={() => setIsPopoverOpen(true)}
      >
        {children}
      </button>

      {isPopoverOpen && (
        <div ref={refs.setFloating} style={floatingStyles}>
          <button className="tooltip" onClick={() => setIsPopoverOpen(false)}>
            {t("holdToConfirm")}
          </button>
        </div>
      )}
    </>
  );
};
