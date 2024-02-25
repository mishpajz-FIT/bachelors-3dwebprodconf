import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, PlusIcon } from "@heroicons/react/24/solid";
import { FormEvent, Fragment, useState } from "react";
import { useSnapshot } from "valtio";

import { ProductStore } from "../../../../../stores/ProductStore.ts";
import { Add } from "../Add.tsx";

interface AddBaseProps {
  onClose: () => void;
}

export const AddBase = ({ onClose }: AddBaseProps) => {
  const productSnap = useSnapshot(ProductStore);

  const [isShowingError, setShowingError] = useState(false);

  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [selectTerm, setSelectTerm] = useState("");

  const filteredComponents = Object.keys(productSnap.componentSpecs).filter(
    (componentSpecId) =>
      componentSpecId.toLowerCase().includes(selectTerm.toLowerCase())
  );

  const addNewBase = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowingError(false);

    const data = new FormData(event.currentTarget);

    if (selectedComponent === null) {
      setShowingError(true);
      return;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        ProductStore.baseSpecs,
        data.get("id") as string
      )
    ) {
      setShowingError(true);
      return;
    }

    ProductStore.baseSpecs[data.get("id") as string] = {
      component: selectedComponent,
    };

    onClose();
  };

  return (
    <Add
      heading={"Add new base"}
      onClose={onClose}
      showingError={isShowingError}
      errorReason={
        selectedComponent === null
          ? "Choose a component this base should use."
          : "Base with this ID already exists."
      }
    >
      <form onSubmit={addNewBase}>
        <div className="m-4 grid grid-cols-1 gap-4">
          <label>
            <span className="label">ID</span>
            <input
              type="text"
              name="id"
              className="field"
              placeholder="red-04"
              required={true}
            />
          </label>
          <div>
            <span className="label">Name</span>
            <div className="w-full px-1 pb-1 pt-2">
              <Combobox
                value={selectedComponent}
                onChange={(value: string) => {
                  setSelectedComponent(value);
                }}
              >
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                    <PlusIcon className="size-4" />
                  </div>
                  <Combobox.Input
                    className="field block w-full bg-transparent ps-10"
                    placeholder={"Add mountable component..."}
                    onChange={(event) => setSelectTerm(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 end-0 flex items-center pe-1">
                    <ChevronUpDownIcon
                      className="size-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setSelectTerm("")}
                >
                  <Combobox.Options className="field absolute mt-1 max-h-60 w-72 overflow-auto">
                    {filteredComponents.length === 0 ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-center text-sm text-gray-900 dark:text-gray-400">
                        Nothing found.
                      </div>
                    ) : (
                      filteredComponents.map((componentSpecId) => (
                        <Combobox.Option
                          key={componentSpecId}
                          className={({ active }) =>
                            `relative cursor-default select-none p-2 ${
                              active ? "font-bold" : ""
                            }`
                          }
                          value={componentSpecId}
                        >
                          <span className={"block truncate"}>
                            {componentSpecId}
                          </span>
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </Combobox>
            </div>
          </div>
          <button type="submit" className="primary-button" tabIndex={0}>
            Add
          </button>
        </div>
      </form>
    </Add>
  );
};
