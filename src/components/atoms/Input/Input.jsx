import clsx from "clsx";

const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  size = "medium",
  className = "",
  ...props
}) => {
  const baseClasses = "w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-5 py-3 text-lg"
  };

  const stateClasses = {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    error: "border-red-300 focus:border-red-500 focus:ring-red-500",
    disabled: "bg-gray-100 border-gray-200 cursor-not-allowed"
  };

  const getStateClass = () => {
    if (disabled) return stateClasses.disabled;
    if (error) return stateClasses.error;
    return stateClasses.default;
  };

  const inputClass = clsx(
    baseClasses,
    sizeClasses[size],
    getStateClass(),
    className
  );

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={inputClass}
      {...props}
    />
  );
};

export default Input;
