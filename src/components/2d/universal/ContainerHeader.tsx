import { XMarkIcon } from "@heroicons/react/20/solid";
import { memo } from "react";

interface ContainerHeaderProps {
  title: string;
  onClose?: () => void;
  subheader?: boolean;
}

export const ContainerHeader = memo(
  ({ title, onClose, subheader = false }: ContainerHeaderProps) => (
    <div className="flex select-none items-center justify-between px-2 pt-2">
      <h3 className={`${subheader ? "text-lg" : "text-2xl"} font-extrabold`}>
        {title}
      </h3>
      {onClose !== undefined && (
        <button className="other-button" onClick={onClose}>
          <span className="sr-only">Close</span>
          <XMarkIcon className="size-4" />
        </button>
      )}
    </div>
  )
);

ContainerHeader.displayName = "ContainerHeader";
