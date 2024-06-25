"use client";
import {
  useRef,
  useState,
  useCallback,
  type ComponentProps,
  type MouseEventHandler,
  type ChangeEventHandler,
} from "react";
import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import Button from "../button";
import Input from "../input";

interface CustomInputNumberProps
  extends Omit<ComponentProps<"div">, "children" | "onChange" | "onBlur">,
    Pick<
      ComponentProps<"input">,
      | "min"
      | "max"
      | "name"
      | "value"
      | "disabled"
      | "readOnly"
      | "onBlur"
      | "onChange"
    > {
  value?: number;
  step?: number;
}

const CustomInputNumber = ({
  className,
  readOnly,
  min,
  max,
  step = 1,
  disabled,
  value,
  name,
  onChange,
  onBlur,
  ...restProps
}: CustomInputNumberProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [internalVal, setInternalVal] = useState<number>(value || 0);
  if (typeof value === "number" && value !== internalVal) {
    setInternalVal(value);
  }

  const forceOnChange = useRef((action: "dec" | "inc") => {
    if (!inputRef.current) return;
    action === "dec" ? inputRef.current.stepDown() : inputRef.current.stepUp();

    // force triggering change event
    const event = new Event("change", { bubbles: true });
    inputRef.current.dispatchEvent(event);
  });

  const onBtnClick = useCallback<
    (action: "dec" | "inc") => MouseEventHandler<HTMLButtonElement>
  >(
    (action) => (_e) => {
      forceOnChange.current(action);
    },
    []
  );
  const onBtnMouseDown = useCallback<
    (action: "dec" | "inc") => MouseEventHandler<HTMLButtonElement>
  >(
    (action) => (e) => {
      if (e.button === 0) {
        timer.current = setInterval(() => {
          forceOnChange.current(action);
        }, 100);
      }
    },
    []
  );
  const onBtnMouseUp = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      if (e.button === 0) {
        clearInterval(timer.current as NodeJS.Timeout);
        timer.current = null;
      }
    },
    []
  );
  const handleOnChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setInternalVal(Number(e.target.value));
      onChange?.(e);
    },
    [onChange]
  );
  return (
    <div {...restProps} className={twMerge(cx("flex gap-2", className))}>
      <Button
        type="button"
        className="rounded size-[48px] text-center  text-base"
        size="small"
        disabled={disabled}
        onMouseDown={onBtnMouseDown("dec")}
        onMouseUp={onBtnMouseUp}
        onMouseLeave={onBtnMouseUp}
        onClick={onBtnClick("dec")}
      >
        -
      </Button>
      <Input
        ref={inputRef}
        type="number"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        readOnly={readOnly}
        value={internalVal}
        name={name}
        className="rounded size-[48px] text-center text-base p-0 [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
        onChange={handleOnChange}
        onBlur={onBlur}
      />
      <Button
        type="button"
        className="rounded size-[48px] text-base text-center"
        size="small"
        disabled={disabled}
        onMouseDown={onBtnMouseDown("inc")}
        onMouseUp={onBtnMouseUp}
        onMouseLeave={onBtnMouseUp}
        onClick={onBtnClick("inc")}
      >
        +
      </Button>
    </div>
  );
};

export default CustomInputNumber;
