import { XMarkIcon } from "@heroicons/react/20/solid";
import { memo } from "react";

interface ContainerHeaderProps {
  title: string;
  onClose: () => void;
}

export const ContainerHeader = memo(
  ({ title, onClose }: ContainerHeaderProps) => (
    <div className="flex items-center justify-between px-2 pt-2">
      <h3 className="text-lg font-extrabold">{title}</h3>
      <button className="other-button" onClick={onClose}>
        <span className="sr-only">Close</span>
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  )
);

ContainerHeader.displayName = "ContainerHeader";
