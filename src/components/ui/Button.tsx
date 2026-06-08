"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-bold border-2 border-black transition-all duration-150 select-none cursor-pointer";

    const variants: Record<string, string> = {
      primary: "bg-yellow text-black",
      outline: "bg-transparent text-black hover:bg-yellow",
      danger: "bg-red text-white",
      ghost: "bg-transparent text-black border-transparent hover:border-black",
    };

    const sizes: Record<string, string> = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px] ${className}`}
        style={{ borderRadius: "2px" }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
