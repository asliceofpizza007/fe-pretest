import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const inputVariants = cva(
  [
    "w-full",
    "border",
    "border-gray-300",
    "rounded",
    "focus:outline-none",
    "bg-transparent",
  ],
  {
    variants: {
      size: {
        small: ["text-sm", "p-1"],
        medium: ["text-base", "p-2"],
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

// to extend `className` property
export type InputVariants = VariantProps<typeof inputVariants> & {
  className: string | undefined;
};

export const inputCVA = (variants: InputVariants) =>
  twMerge(inputVariants(variants));

export default inputCVA;
