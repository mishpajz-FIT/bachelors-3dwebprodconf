import { createPopper, Placement } from "@popperjs/core";
import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";

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
  const [progress, setProgress] = useState(0);
  const interval = useRef<NodeJS.Timeout | null>(null);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef(null);

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

  useEffect(() => {
    if (buttonRef.current && popoverRef.current) {
      createPopper(buttonRef.current, popoverRef.current, {
        placement: popoverPosition,
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, popoverOffset],
            },
          },
        ],
      });
    }
  }, [isPopoverOpen, popoverOffset, popoverPosition]);

  return (
    <>
      <button
        ref={buttonRef}
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
        <button
          ref={popoverRef}
          className="simple-panel cursor-default select-none p-2 px-4 text-xs outline outline-1 outline-gray-100 dark:outline-gray-700"
          onClick={() => setIsPopoverOpen(false)}
        >
          Hold to confirm
        </button>
      )}
    </>
  );
};
