import { ContainerHeader } from "@3dwebprodconf/shared/src/components/ContainerHeader.tsx";
import { ReactNode } from "react";

interface AddProps {
  heading: string;
  onClose: () => void;
  showingError?: boolean;
  errorReason?: string;
  children: ReactNode;
}

export const AddContent = ({
  heading,
  onClose,
  showingError,
  errorReason,
  children,
}: AddProps) => {
  return (
    <div className="flex min-w-96 flex-col">
      <ContainerHeader title={heading} onClose={onClose} subheader={true} />
      {showingError && (
        <div className="m-2 rounded-lg bg-[var(--error-light)] p-2 text-sm text-white dark:bg-[var(--error-dark)]">
          {errorReason}
        </div>
      )}
      {children}
    </div>
  );
};
