import { autoUpdate, offset, useFloating } from "@floating-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TextInput } from "./TextInput.tsx";

interface ImageURLInputProps {
  submitValue: (newValue: string) => void;
  allowEmpty: boolean;
  placeholder: string;
  currentValue?: string;
  inputId?: string;
}

export const ImageURLInput = ({
  submitValue,
  allowEmpty,
  placeholder,
  currentValue,
  inputId,
}: ImageURLInputProps) => {
  const { t } = useTranslation();

  const [isPreviewed, setIsPreviewed] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open: isPreviewed,
    onOpenChange: setIsPreviewed,
    placement: "top",
    middleware: [offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const handleMouseEnter = () => setIsPreviewed(true);
  const handleMouseLeave = () => setIsPreviewed(false);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentValue]);

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={refs.setReference}
      >
        <TextInput
          submitValue={submitValue}
          allowEmpty={allowEmpty}
          placeholder={placeholder}
          inputId={inputId}
          currentValue={currentValue}
        />
      </div>
      {isPreviewed && (
        <div ref={refs.setFloating} style={floatingStyles}>
          <div className="tooltip p-2">
            {imageError ? (
              <span className="px-2 text-xs text-gray-900 dark:text-gray-400">
                {t("imageCouldntBeLoaded")}
              </span>
            ) : (
              <>
                <img
                  src={currentValue}
                  alt={"preview"}
                  className={`transition-all duration-300 ease-in-out ${imageLoaded ? "opacity-100" : "opacity-0"} max-h-64 max-w-64 object-cover`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  style={{
                    display: imageLoaded ? "block" : "none",
                  }}
                />
                {!imageLoaded && (
                  <div
                    className={`size-64 shrink-0 animate-pulse rounded bg-gray-300 dark:bg-gray-600`}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
