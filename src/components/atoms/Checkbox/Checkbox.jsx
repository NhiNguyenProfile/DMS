import clsx from "clsx";
import { Check } from "lucide-react";

const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  label,
  className = "",
  size = "medium",
  ...props
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6"
  };

  const checkboxClass = clsx(
    "relative inline-flex items-center justify-center border-2 rounded transition-all duration-200 cursor-pointer",
    sizeClasses[size],
    {
      "border-gray-300 bg-white hover:border-gray-400": !checked && !disabled && !indeterminate,
      "border-blue-500 bg-blue-500 text-white": checked && !disabled,
      "border-blue-400 bg-blue-400 text-white": indeterminate && !disabled,
      "border-gray-200 bg-gray-100 cursor-not-allowed": disabled,
      "hover:border-blue-600 hover:bg-blue-600": checked && !disabled,
    },
    className
  );

  const iconSize = size === "small" ? 12 : size === "medium" ? 14 : 16;

  return (
    <label className={clsx("inline-flex items-center gap-2", { "cursor-not-allowed": disabled })}>
      <div
        className={checkboxClass}
        onClick={() => !disabled && onChange?.(!checked)}
        {...props}
      >
        {(checked || indeterminate) && (
          <Check 
            size={iconSize} 
            className={clsx("transition-opacity duration-200", {
              "opacity-100": checked || indeterminate,
              "opacity-0": !checked && !indeterminate
            })}
          />
        )}
        {indeterminate && !checked && (
          <div className="w-2 h-0.5 bg-white rounded" />
        )}
      </div>
      {label && (
        <span className={clsx("text-sm", {
          "text-gray-500": disabled,
          "text-gray-900": !disabled
        })}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
