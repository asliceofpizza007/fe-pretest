import { type ComponentProps, type ForwardedRef, forwardRef } from "react";

import inputCVA, { type InputVariants } from "./inputCVA";

interface InputProps
  extends Omit<ComponentProps<"input">, "size">,
    Omit<InputVariants, "className"> {}

const Input = forwardRef(
  (
    { className, size, ...restProps }: InputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        ref={ref}
        {...restProps}
        className={inputCVA({ className, size })}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
