import clsx from "clsx";

const IconButton = ({
  children,
  variant = "ghost",
  size = "medium",
  color = "gray",
  onClick,
  disabled = false,
  className = "",
  tooltip,
  ...props
}) => {
  const sizeClasses = {
    small: "p-1.5",
    medium: "p-2",
    large: "p-3",
  };

  const colorClasses = {
    gray:
      variant === "icon"
        ? "text-gray-600 hover:text-gray-800"
        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
    blue:
      variant === "icon"
        ? "text-blue-600 hover:text-blue-800"
        : "text-blue-600 hover:text-blue-800 hover:bg-blue-100",
    green:
      variant === "icon"
        ? "text-green-600 hover:text-green-800"
        : "text-green-600 hover:text-green-800 hover:bg-green-100",
    red:
      variant === "icon"
        ? "text-red-600 hover:text-red-800"
        : "text-red-600 hover:text-red-800 hover:bg-red-100",
    yellow:
      variant === "icon"
        ? "text-yellow-600 hover:text-yellow-800"
        : "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100",
    purple:
      variant === "icon"
        ? "text-purple-600 hover:text-purple-800"
        : "text-purple-600 hover:text-purple-800 hover:bg-purple-100",
  };

  const variantClasses = {
    icon: "bg-transparent border-none p-0",
    ghost: "bg-transparent border-none",
    outline: "border border-current bg-transparent",
    solid: "border-none",
  };

  const buttonClass = clsx(
    "inline-flex items-center justify-center rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
    sizeClasses[size],
    variantClasses[variant],
    colorClasses[color],
    {
      "opacity-50 cursor-not-allowed": disabled,
      "cursor-pointer": !disabled,
    },
    className
  );

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
