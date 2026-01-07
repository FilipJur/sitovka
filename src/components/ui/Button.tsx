import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn'; // Importing from our local utils

// Defining the rules based on your Design System
const buttonVariants = cva(
  // Base styles (Shared by all)
  "inline-flex items-center justify-center rounded-full text-base font-bold italic transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none tracking-wide font-brand-heading",
  {
    variants: {
      variant: {
        // 1. Primary (Fill) - Green BG
        primary: "bg-brand-green text-brand-dark hover:bg-brand-dark hover:text-white hover:shadow-lg",
        
        // 2. Outline - Transparent BG, Green Border
        outline: "border-2 border-brand-green bg-transparent text-brand-green hover:bg-brand-green hover:text-brand-dark",
        
        // 3. Dark (From your Header)
        dark: "bg-brand-dark text-white hover:bg-brand-green hover:text-brand-dark hover:shadow-lg",
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
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string; // If provided, renders as <a>
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    
    // Logic: Render as <a> link if href is present
    if (href) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    // Logic: Render as standard <button> otherwise
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";