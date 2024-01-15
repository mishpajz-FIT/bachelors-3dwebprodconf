import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";

interface HoldButtonProps {
  onSubmit: () => void;
  children: ReactNode;
  duration: number;
  className?: string;
}

export const HoldButton = ({
  onSubmit,
  children,
  className,
  duration = 750,
}: HoldButtonProps) => {
  const [progress, setProgress] = useState(0);
  const interval = useRef<NodeJS.Timeout | undefined>(undefined);

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
    <button
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
    >
      {children}
    </button>
  );
};
