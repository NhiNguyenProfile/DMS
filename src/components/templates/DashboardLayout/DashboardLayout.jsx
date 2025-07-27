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

  const layoutClass = clsx("min-h-screen", className);

  return (
    <div className={layoutClass} {...props}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div className="lg:ml-64 flex min-h-screen">
        {/* Center Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header title={currentRouteInfo.title} onMenuToggle={toggleSidebar} />

          {/* Page Content */}
          <main className="flex-1 p-6 mx-6 border-t border-x shadow-sm rounded-t-2xl overflow-y-auto bg-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
