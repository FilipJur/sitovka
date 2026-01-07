import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn"; // Importing from our local utils

// Defining the rules based on your Design System
const buttonVariants = cva(
  // Base styles (Shared by all)
  "inline-flex items-center justify-center rounded-full text-base font-bold italic transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none font-brand-heading",
  {
    variants: {
      variant: {
        // 1. Primary (Fill) - Green BG with matching border
        primary:
          "bg-brand-green text-brand-dark border-2 border-brand-green hover:bg-brand-dark hover:text-white hover:border-brand-dark hover:shadow-lg",

        // 2. Outline - Transparent BG with configurable border/text
        outline:
          "bg-transparent border-2 hover:bg-brand-green hover:text-brand-dark",

        // 3. Dark (From your Header)
        dark: "bg-brand-dark text-white border-2 border-brand-dark hover:bg-brand-green hover:text-brand-dark hover:border-brand-green hover:shadow-lg",
      },
      size: {
        default: "px-8 py-3", // Your standard padding
        sm: "px-6 py-2 text-sm",
        lg: "px-10 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string; // If provided, renders as <a>
  textColor?:
    | "brand-green"
    | "brand-dark"
    | "brand-surface"
    | "white"
    | "black"; // Text color for outline variant
  borderColor?:
    | "brand-green"
    | "brand-dark"
    | "brand-surface"
    | "white"
    | "black"; // Border color for primary variant
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      href,
      children,
      textColor,
      borderColor,
      ...props
    },
    ref,
  ) => {
    // Build dynamic classes for outline variant
    const outlineClasses =
      variant === "outline"
        ? cn(
            textColor ? `text-${textColor}` : "text-brand-green",
            borderColor ? `border-${borderColor}` : "border-brand-green",
          )
        : "";

    // Build dynamic classes for primary variant border
    const primaryBorderClass =
      variant === "primary" && borderColor ? `border-${borderColor}` : "";

    // Logic: Render as <a> link if href is present
    if (href) {
      return (
        <a
          href={href}
          className={cn(
            buttonVariants({ variant, size, className }),
            outlineClasses,
            primaryBorderClass,
          )}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    // Logic: Render as standard <button> otherwise
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          outlineClasses,
          primaryBorderClass,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
