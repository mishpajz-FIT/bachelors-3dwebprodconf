import { Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

interface SideProps {
  isOpen: boolean;
  larger?: boolean;
  children?: ReactNode;
}

export const Side = ({ isOpen, larger = false, children }: SideProps) => {
  return (
    <>
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-300 transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div
          className={`absolute inset-y-0 right-0 z-[100] size-full p-4 ${larger ? "w-96" : "w-76"}`}
        >
          <div className="simple-panel flex size-full">{children}</div>
        </div>
      </Transition>
    </>
  );
};
