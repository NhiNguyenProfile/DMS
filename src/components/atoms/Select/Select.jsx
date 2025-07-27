import clsx from "clsx";
import { ChevronDown } from "lucide-react";

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  error = false,
  className = "",
  size = "medium",
  ...props
}) => {
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-3 py-2 text-base",
    large: "px-4 py-3 text-lg"
  };

  const selectClass = clsx(
    "w-full appearance-none bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200",
    sizeClasses[size],
    {
      "border-gray-300": !error && !disabled,
      "border-red-500": error,
      "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed": disabled,
      "hover:border-gray-400": !disabled && !error,
    },
    className
  );

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={selectClass}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={typeof option === 'object' ? option.value : option} 
            value={typeof option === 'object' ? option.value : option}
          >
            {typeof option === 'object' ? option.label : option}
          </option>
        ))}
      </select>
      <ChevronDown 
        size={16} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
      />
    </div>
  );
};

export default Select;
