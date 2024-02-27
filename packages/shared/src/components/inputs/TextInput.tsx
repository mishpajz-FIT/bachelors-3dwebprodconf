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

interface TextInputProps {
  submitValue: (newValue: string) => void;
  allowEmpty: boolean;
  placeholder: string;
  currentValue?: string;
  inputId?: string;
}

export const TextInput = ({
  submitValue,
  allowEmpty,
  placeholder,
  currentValue,
  inputId,
}: TextInputProps) => {
  const [innerValue, setInnerValue] = useState<string>(currentValue ?? "");
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
    setInnerValue(value);
    if (value === "" && !allowEmpty) {
      setTooltipText("Cannot be empty");
      setIsValid(false);
      return false;
    }

    setIsValid(true);
    return true;
  };

  const submit = (value: string) => {
    if (!validate(value)) {
      setInnerValue(currentValue ?? "");
      setIsValid(true);
      return;
    }

    submitValue(value);
  };

  const handleFocus = (
    e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    const { value } = e.target as HTMLInputElement;

    submit(value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    validate(value);
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
        id={inputId}
        type={"text"}
        className={`field ${isValid ? "" : "outline outline-1 outline-rose-500 dark:outline-rose-600"}`}
        placeholder={placeholder}
        value={innerValue}
        onChange={handleChange}
        onKeyDown={handleKey}
        onBlur={handleFocus}
        ref={refs.setReference}
      />
      {!isValid && (
        <div ref={refs.setFloating} style={floatingStyles}>
          <div className="tooltip">{tooltipText}</div>
          <FloatingArrow
            ref={tooltipArrowRef}
            context={context}
            className="fill-white/[0.3] dark:fill-zinc-800/[0.7] [&>path:first-of-type]:stroke-gray-200 dark:[&>path:first-of-type]:stroke-zinc-700"
          />
        </div>
      )}
    </>
  );
};
