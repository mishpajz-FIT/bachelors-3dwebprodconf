import {Transition} from "@headlessui/react";
import {Fragment, ReactNode} from "react";

interface SideProps {
  isOpen: boolean;
  children?: ReactNode
}

export const Side = ({isOpen, children} : SideProps) => {
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
        leaveTo="translate-x-full">

        <div className="fixed right-0 top-0 z-[100] h-full w-full p-4 sm:w-72">
          <div className="simple-panel flex h-full w-full">
            {children}
          </div>
        </div>
      </Transition>
    </>
  );
};
