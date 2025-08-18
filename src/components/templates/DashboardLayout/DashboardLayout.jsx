import { useState } from "react";
import clsx from "clsx";
import Sidebar from "../../organisms/Sidebar";
import Header from "../../organisms/Header";
import { useRouter, ROUTES } from "../../../hooks/useRouter.jsx";

const DashboardLayout = ({
  children,
  title = "Dashboard",
  className = "",
  ...props
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentRoute } = useRouter();
  const currentRouteInfo = ROUTES[currentRoute] || { title: title };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const layoutClass = clsx("min-h-screen max-w-screen w-screen", className);

  return (
    <div className={layoutClass} {...props}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div className="lg:ml-60 flex-1 flex min-h-screen">
        {/* Center Content */}
        <div className="flex-1 flex flex-col gap-2 pt-2">
          {/* Header */}
          <Header title={currentRouteInfo.title} onMenuToggle={toggleSidebar} />

          {/* Page Content */}
          <main className="flex-1 p-6 mx-4 border-t border-x shadow-sm rounded-t-lg overflow-y-auto overflow-x-hidden bg-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
