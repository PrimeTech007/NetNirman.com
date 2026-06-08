import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-bold font-space">{label}</label>
        )}
        <select
          ref={ref}
          className={`w-full px-4 py-3 border-2 border-black bg-white text-sm transition-all focus:outline-none shadow-brutal-sm focus:shadow-none appearance-none cursor-pointer ${error ? "border-red" : ""} ${className}`}
          style={{ borderRadius: "2px" }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red font-bold">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
