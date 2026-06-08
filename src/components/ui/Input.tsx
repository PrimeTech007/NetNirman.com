import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-bold font-space">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 border-2 border-black bg-white text-sm transition-all focus:outline-none shadow-brutal-sm focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px] ${error ? "border-red" : ""} ${className}`}
          style={{ borderRadius: "2px" }}
          {...props}
        />
        {error && <p className="text-xs text-red font-bold">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
