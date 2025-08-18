import clsx from "clsx";
import Text from "../../atoms/Text";
import { ChevronRight } from "lucide-react";

const SidebarItem = ({
  icon,
  label,
  isActive = false,
  onClick,
  hasSubmenu = false,
  isExpanded = false,
  badge,
  className = "",
  ...props
}) => {
  const itemClass = clsx(
    "flex items-center w-full pl-4 pr-2 py-3 text-left transition-colors duration-200 rounded-r-lg group",
    {
      "bg-[#EBFFD0] text-lime-700": isActive,
      "text-gray-700 hover:bg-gray-100": !isActive,
    },
    className
  );

  return (
    <button className={itemClass} onClick={onClick} {...props}>
      <div
        className={clsx("mr-3", {
          "text-lime-800": isActive,
          "text-gray-500 group-hover:text-gray-700": !isActive,
        })}
      >
        {icon}
      </div>
      <Text
        variant="body"
        size="medium"
        className={clsx("flex-1 text-left", {
          "text-lime-800": isActive,
          "text-gray-700": !isActive,
        })}
      >
        {label}
      </Text>
      {badge && (
        <span
          className={clsx(
            "ml-auto px-2 py-1 text-xs font-medium rounded-full",
            {
              "bg-white text-blue-600": isActive,
              "bg-red-500 text-white": !isActive,
            }
          )}
        >
          {badge}
        </span>
      )}
      {hasSubmenu && (
        <ChevronRight
          size={16}
          className={clsx("transition-transform duration-200", {
            "rotate-90": isExpanded,
            "text-white": isActive,
            "text-gray-400": !isActive,
          })}
        />
      )}
    </button>
  );
};

export default SidebarItem;
