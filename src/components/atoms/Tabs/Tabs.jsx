import { useState } from "react";
import { Children } from "react";
import clsx from "clsx";

const Tabs = ({
  children,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  onChange,
  variant = "default",
  size = "medium",
  className = "",
  ...props
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || "");

  // Use controlled activeTab if provided, otherwise use internal state
  const activeTab =
    controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabChange = (tabId) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
    onChange?.(tabId);
  };

  const sizeClasses = {
    small: "text-sm py-2 px-3",
    medium: "text-base py-3 px-4",
    large: "text-lg py-4 px-6",
  };

  const variantClasses = {
    default: "border-b border-gray-200",
    pills: "bg-gray-100 rounded-lg p-1",
    underline: "border-b-2 border-transparent",
  };

  return (
    <div className={clsx("w-full", className)} {...props}>
      {/* Tab Navigation */}
      <div className={clsx("flex", variantClasses[variant])}>
        {Children.toArray(children)
          .filter((child) => child !== null && child !== undefined)
          .map((child) => {
            if (child.type !== TabPanel) return null;

            const isActive = activeTab === child.props.tabId;

            return (
              <button
                key={child.props.tabId}
                onClick={() => handleTabChange(child.props.tabId)}
                className={clsx(
                  "font-medium transition-colors duration-200 focus:outline-none flex items-center",
                  sizeClasses[size],
                  {
                    // Default variant
                    "border-b-2 border-blue-500 text-blue-600":
                      variant === "default" && isActive,
                    "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300":
                      variant === "default" && !isActive,

                    // Pills variant
                    "bg-white text-gray-900 shadow-sm rounded-md":
                      variant === "pills" && isActive,
                    "text-gray-600 hover:text-gray-900":
                      variant === "pills" && !isActive,

                    // Underline variant
                    "border-b-2 border-blue-500 text-blue-600":
                      variant === "underline" && isActive,
                    "text-gray-500 hover:text-gray-700":
                      variant === "underline" && !isActive,
                  }
                )}
              >
                {child.props.icon && (
                  <span className="mr-2">{child.props.icon}</span>
                )}
                {child.props.label}
                {child.props.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {child.props.badge}
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {(() => {
          const validChildren = Children.toArray(children).filter(
            (child) => child !== null && child !== undefined
          );
          const activeTabContent = validChildren.find(
            (child) => child.props.tabId === activeTab
          );
          if (activeTabContent) {
            return activeTabContent;
          }

          // Fallback to first tab if activeTab not found
          const firstTab = validChildren[0];
          if (firstTab && activeTab !== firstTab.props.tabId) {
            handleTabChange(firstTab.props.tabId);
          }

          return (
            firstTab || (
              <div className="text-red-500 p-4">
                No tabs available. ActiveTab: "{activeTab}"
              </div>
            )
          );
        })()}
      </div>
    </div>
  );
};

const TabPanel = ({
  children,
  tabId,
  label,
  icon,
  badge,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className={clsx("w-full", className)} {...props}>
      {children}
    </div>
  );
};

// Export both components
Tabs.Panel = TabPanel;

export default Tabs;
export { TabPanel };
