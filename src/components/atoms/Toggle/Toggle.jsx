import clsx from "clsx";

const Toggle = ({
  checked = false,
  onChange,
  disabled = false,
  size = "medium",
  className = "",
  label,
  ...props
}) => {
  const sizeClasses = {
    small: {
      track: "w-8 h-4",
      thumb: "w-3 h-3",
      translate: "translate-x-4"
    },
    medium: {
      track: "w-11 h-6", 
      thumb: "w-5 h-5",
      translate: "translate-x-5"
    },
    large: {
      track: "w-14 h-7",
      thumb: "w-6 h-6", 
      translate: "translate-x-7"
    }
  };

  const trackClass = clsx(
    "relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    sizeClasses[size].track,
    {
      "bg-blue-600": checked && !disabled,
      "bg-gray-200": !checked && !disabled,
      "bg-gray-100 cursor-not-allowed": disabled,
      "cursor-pointer": !disabled,
    },
    className
  );

  const thumbClass = clsx(
    "inline-block rounded-full bg-white shadow transform transition-transform duration-200",
    sizeClasses[size].thumb,
    {
      [sizeClasses[size].translate]: checked,
      "translate-x-0": !checked,
    }
  );

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={trackClass}
        {...props}
      >
        <span className={thumbClass} />
      </button>
      {label && (
        <span className={clsx("text-sm", { "text-gray-500": disabled })}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Toggle;
