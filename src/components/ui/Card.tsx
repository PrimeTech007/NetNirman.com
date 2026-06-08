import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tilt?: "left" | "right" | "none";
  color?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ tilt = "none", color, className = "", children, ...props }, ref) => {
    const tiltClasses = {
      left: "hover:rotate-0 tilt-left",
      right: "hover:rotate-0 tilt-right",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={`border-2 border-black p-6 transition-all duration-150 shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${tiltClasses[tilt]} ${className}`}
        style={{ borderRadius: "2px", backgroundColor: color || "#FFFFFF" }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export default Card;
