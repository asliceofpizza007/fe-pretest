import { type ComponentProps } from "react";

import buttonCVA, { type ButtonVariants } from "./buttonCVA";

interface ButtonProps
  extends ComponentProps<"button">,
    Omit<ButtonVariants, "className" | "disabled"> {}

const Button = ({
  children,
  className,
  size,
  variant,
  disabled,
  ...restProps
}: ButtonProps) => {
  return (
    <button
      {...restProps}
      className={buttonCVA({ className, size, variant, disabled })}
    >
      {children}
    </button>
  );
};

export default Button;
