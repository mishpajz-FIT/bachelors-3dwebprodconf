import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { HoldButton } from "@3dwebprodconf/shared/src/components/HoldButton.tsx";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

interface EditContentProps {
  panelTitle: string;
  itemName: string;
  removeButton: string;
  onClose: () => void;
  onRemove: () => void;
  children: ReactNode;
  otherButtons?: ReactNode;
}

export const EditContent = ({
  panelTitle,
  itemName,
  removeButton,
  onClose,
  onRemove,
  children,
  otherButtons,
}: EditContentProps) => {
  return (
    <div className="flex w-full select-text flex-col overflow-x-clip overflow-y-scroll">
      <ContainerHeader title={panelTitle} onClose={onClose} subheader={true} />
      <h2 className="w-full shrink-0 truncate p-4 font-mono text-lg font-semibold tracking-tight text-gray-700 dark:text-gray-300">
        {itemName}
      </h2>
      {children}

      <div className="mt-auto flex w-full items-center justify-center p-4">
        <div className="mt-7 w-full flex-col items-center justify-center">
          {otherButtons}
          <HoldButton
            className="other-button destructive-button-on-hold mt-2 flex w-full items-center justify-center"
            onSubmit={onRemove}
            duration={650}
            popoverPosition={"top-end"}
            popoverOffset={6}
          >
            <TrashIcon className="size-4" />
            <span className="ml-2">{removeButton}</span>
          </HoldButton>
        </div>
      </div>
    </div>
  );
};
