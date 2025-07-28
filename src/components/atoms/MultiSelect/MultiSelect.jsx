import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import Text from "../Text";

const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Select options...",
  className = "",
  disabled = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleOption = (optionValue) => {
    if (disabled) return;

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    
    onChange(newValue);
  };

  const handleRemoveOption = (optionValue, event) => {
    event.stopPropagation();
    if (disabled) return;
    
    const newValue = value.filter((v) => v !== optionValue);
    onChange(newValue);
  };

  const getSelectedLabels = () => {
    return value.map((val) => {
      const option = options.find((opt) => opt.value === val);
      return option ? option.label : val;
    });
  };

  const selectedLabels = getSelectedLabels();

  return (
    <div className={`relative ${className}`} ref={dropdownRef} {...props}>
      {/* Selected Values Display */}
      <div
        className={`
          min-h-[40px] px-3 py-2 border border-gray-300 rounded-md cursor-pointer
          flex items-center justify-between bg-white
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "hover:border-gray-400"}
          ${isOpen ? "border-blue-500 ring-1 ring-blue-500" : ""}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
              >
                {label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveOption(value[index], e)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            ))
          ) : (
            <Text variant="body" color="muted" className="text-sm">
              {placeholder}
            </Text>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option) => {
              const isSelected = value.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`
                    px-3 py-2 cursor-pointer flex items-center justify-between
                    ${isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}
                  `}
                  onClick={() => handleToggleOption(option.value)}
                >
                  <Text variant="body" className="text-sm">
                    {option.label}
                  </Text>
                  {isSelected && (
                    <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-2">
              <Text variant="body" color="muted" className="text-sm">
                No options available
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
