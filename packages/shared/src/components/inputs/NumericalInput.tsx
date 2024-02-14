import {
  arrow,
  autoUpdate,
  FloatingArrow,
  offset,
  useFloating,
} from "@floating-ui/react";
import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface NumericalInputProps {
  submitValue: (newValue: number) => void;
  allowEmpty: boolean;
  minimum?: number;
  maximum?: number;
  placeholder: number;
  currentValue?: number;
}

export const NumericalInput = ({
  submitValue,
  allowEmpty,
  minimum,
  maximum,
  placeholder,
  currentValue,
}: NumericalInputProps) => {
  const [innerValue, setInnerValue] = useState<string>(
    currentValue?.toString() ?? ""
  );
  const [isValid, setIsValid] = useState<boolean>(true);

  const [tooltipText, setTooltipText] = useState("");
  const tooltipArrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: !isValid,
    onOpenChange: setIsValid,
    placement: "bottom",
    middleware: [offset(10), arrow({ element: tooltipArrowRef })],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    setInnerValue(currentValue?.toString() ?? "");
  }, [currentValue]);

  const validate = (value: string) => {
    const isNumeric = /^-?[0-9]*[.,]?[0-9]*$/;

    if (value === "" && !allowEmpty) {
      setInnerValue(value);
      setIsValid(false);
      return false;
    }

    if (isNumeric.test(value)) {
      const numericValue = parseFloat(value.replace(",", "."));

      if (minimum !== undefined && numericValue < minimum) {
        setInnerValue(value);
        setTooltipText(`Value cannot be less than ${minimum}`);
        setIsValid(false);
        return false;
      }

      if (maximum !== undefined && numericValue > maximum) {
        setInnerValue(value);
        setTooltipText(`Value cannot be greater than ${maximum}`);
        setIsValid(false);
        return false;
      }

      setInnerValue(value);
    }

    if (innerValue !== "") {
      setTooltipText(`Cannot be empty`);
      setIsValid(true);
      return true;
    }

    setIsValid(false);
    return false;
  };

  const submit = (value: string) => {
    if (!validate(value)) {
      setInnerValue(currentValue?.toString() ?? "");
      setIsValid(true);
      return;
    }

    const parsedValue = parseFloat(value.replace(",", "."));

    submitValue(parsedValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    validate(value);
  };

  const handleFocus = (
    e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    const { value } = e.target as HTMLInputElement;

    submit(value);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    handleFocus(e);
  };

  return (
    <>
      <input
        type={"text"}
        className={`field ${isValid ? "" : "outline outline-1 outline-rose-500 dark:outline-rose-600"}`}
        placeholder={placeholder.toString()}
        value={innerValue}
        onChange={handleChange}
        onKeyDown={handleKey}
        onBlur={handleFocus}
        ref={refs.setReference}
      />
      {!isValid && (
        <div ref={refs.setFloating} style={floatingStyles}>
          <div className="simple-panel cursor-default select-none p-2 px-4 text-xs outline outline-1 outline-gray-100 dark:outline-gray-700">
            {tooltipText}
          </div>
          <FloatingArrow
            ref={tooltipArrowRef}
            context={context}
            className="fill-zinc-50 dark:fill-zinc-950 [&>path:first-of-type]:stroke-gray-200 dark:[&>path:first-of-type]:stroke-zinc-700"
          />
        </div>
      )}
    </>
  );
};
