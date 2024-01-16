import { ContainerHeader } from "../../universal/ContainerHeader.tsx";

export const ProductConfirmation = () => {
  return (
    <div className="flex select-none flex-col items-center justify-center bg-white p-4 dark:bg-gray-900">
      <div className="w-full md:w-4/5 lg:w-2/3">
        <ContainerHeader title={"Confirm configuration"} onClose={undefined} />
      </div>
      <div className="flex w-full flex-col justify-center gap-4 md:w-4/5 lg:w-2/3">
        Test
      </div>
    </div>
  );
};
