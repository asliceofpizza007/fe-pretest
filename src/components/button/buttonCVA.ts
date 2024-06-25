import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  ["font-semibold", "border", "rounded", "border-transparent"],
  {
    variants: {
      variant: {
        primary: [
          "bg-au-primary/80",
          "text-au-background",
          "hover:bg-au-primary",
        ],
        secondary: ["bg-au-secondary/80", "hover:bg-au-secondary"],
        accent: ["bg-au-accent/80", "text-au-background", "hover:bg-au-accent"],
      },
      size: {
        small: ["text-sm", "py-1", "px-2"],
        medium: ["text-base", "py-2", "px-4"],
      },
      disabled: {
        true: "grayscale pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  }
);

// to extend `className` property
export type ButtonVariants = VariantProps<typeof buttonVariants> & {
  className: string | undefined;
};

export const buttonCVA = (variants: ButtonVariants) =>
  twMerge(buttonVariants(variants));

export default buttonCVA;
