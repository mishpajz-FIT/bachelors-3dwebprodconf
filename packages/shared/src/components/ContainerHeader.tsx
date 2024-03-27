import { XMarkIcon } from "@heroicons/react/20/solid";
import { memo } from "react";
import { useTranslation } from "react-i18next";

interface ContainerHeaderProps {
  title: string;
  onClose?: () => void;
  subheader?: boolean;
}

export const ContainerHeader = memo(
  ({ title, onClose, subheader = false }: ContainerHeaderProps) => {
    const { t } = useTranslation();

    return (
      <div className="flex select-none items-center justify-between px-2 pt-2">
        <h3 className={`${subheader ? "text-lg" : "text-2xl"} font-extrabold`}>
          {title}
        </h3>
        {onClose !== undefined && (
          <button className="other-button" onClick={onClose}>
            <span className="sr-only">{t("close")}</span>
            <XMarkIcon className="size-4" />
          </button>
        )}
      </div>
    );
  }
);

ContainerHeader.displayName = "ContainerHeader";
