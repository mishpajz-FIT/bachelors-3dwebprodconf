import {Dialog, Transition} from "@headlessui/react";
import React, {Fragment} from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    isPopupOpen?: boolean
    children?: React.ReactNode
}
export const Modal = ({ isOpen, onClose, isPopupOpen, children } : ModalProps) => {
  const handleClose = () => {
    if (!isPopupOpen) {
      onClose();
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[100] overflow-y-auto" open={isOpen} onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px]" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-full scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-full scale-100"
          leaveTo="opacity-0 translate-y-0 scale-95"
        >
          <div className="fixed inset-0 w-screen overflow-x-auto">
            <div className="flex min-h-full items-end justify-center">
              <Dialog.Panel id="modal-container" className="simple-panel relative w-full rounded-b-none md:w-4/6 md:max-w-5xl">
                {children}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
