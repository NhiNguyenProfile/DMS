import clsx from "clsx";
import Button from "../../atoms/Button";
import { Menu, ChevronRight } from "lucide-react";
import { useRouter, ROUTES } from "../../../hooks/useRouter.jsx";

const Header = ({
  title = "Dashboard",
  onMenuToggle,
  className = "",
  ...props
}) => {
  const { currentRoute } = useRouter();
  const currentRouteInfo = ROUTES[currentRoute] || { breadcrumb: title };
  const headerClass = clsx(
    "bg-white px-4 py-5 bg-cover bg-center bg-no-repeat mx-4 rounded-lg",
    className
  );

  const headerStyle = {
    backgroundImage: "url('/images/header-v2.svg')",
  };

  return (
    <header className={headerClass} style={headerStyle} {...props}>
      <div className="flex items-center justify-between">
        {/* Left side - Breadcrumb */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="small"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu size={20} />
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-white/80">
            <span>Overview</span>
            <ChevronRight size={16} />
            <span className="font-medium text-white">
              {currentRouteInfo.breadcrumb}
            </span>
          </div>
        </div>

        {/* Right side - Language Toggle */}
        {/* <div className="flex items-center space-x-2">
          <button className="px-2 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded">
            VN
          </button>
          <span className="text-gray-400">|</span>
          <button className="px-2 py-1 text-sm font-medium text-gray-600 hover:text-blue-600">
            EN
          </button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
