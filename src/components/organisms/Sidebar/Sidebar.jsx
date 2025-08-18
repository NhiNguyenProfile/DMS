import clsx from "clsx";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import SidebarItem from "../../molecules/SidebarItem";
import {
  Settings,
  Workflow,
  Menu,
  X,
  FileText,
  CheckCircle,
  Search,
  Shield,
  Database,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "../../../hooks/useRouter.jsx";

const Sidebar = ({ isOpen = true, onToggle, className = "", ...props }) => {
  const { currentRoute, navigate } = useRouter();

  const menuItems = [
    {
      id: "my-request",
      icon: <FileText size={20} />,
      label: "My Request",
    },
    {
      id: "approval",
      icon: <CheckCircle size={20} />,
      label: "Approval",
    },
    {
      id: "search",
      icon: <Search size={20} />,
      label: "Master Data Records",
    },
    {
      id: "rule-field-config",
      icon: <Settings size={20} />,
      label: "Form Configuration",
    },
    {
      id: "workflows",
      icon: <Workflow size={20} />,
      label: "Workflows",
    },
    {
      id: "permissions",
      icon: <Shield size={20} />,
      label: "Permissions",
    },
    {
      id: "master-data",
      icon: <Database size={20} />,
      label: "Data Management",
    },
    {
      id: "sync-history",
      icon: <RefreshCw size={20} />,
      label: "Synchronize History",
    },
  ];

  const sidebarClass = clsx(
    "fixed left-0 top-0 h-full bg-white transition-transform duration-300 ease-in-out z-50 w-60",
    {
      // Desktop: always visible, Mobile: toggle based on isOpen
      "translate-x-0": true, // Always visible on desktop
      "lg:translate-x-0": true, // Ensure visible on large screens
      "-translate-x-full lg:translate-x-0": !isOpen, // Hide on mobile when closed, show on desktop
    },
    className
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClass} {...props}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-gray-200">
          <div className="w-full flex justify-center items-center space-x-2">
            <img src="/images/logo.svg" className="h-16 w-16" />
            {/* <Text variant="heading" size="lg" weight="bold">
              DMS
            </Text> */}
          </div>
          <Button
            variant="ghost"
            size="small"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={currentRoute === item.id}
              onClick={() => navigate(item.id)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-[18px]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
              <Text variant="body" size="small" color="white" weight="medium">
                U
              </Text>
            </div>
            <div className="flex-1">
              <Text variant="body" size="small" weight="medium">
                User Name
              </Text>
              <Text variant="caption" color="muted">
                user@example.com
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
