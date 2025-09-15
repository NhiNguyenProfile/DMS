import clsx from "clsx";
import Button from "../../atoms/Button";
import Select from "../../atoms/Select";
import { Menu, ChevronRight } from "lucide-react";
import { useRouter, ROUTES } from "../../../hooks/useRouter.jsx";
import { useState } from "react";

// Legal entities options
const LEGAL_ENTITIES = [
  { value: "DHV", label: "DHV" },
  { value: "DHBH", label: "DHBH" },
  { value: "DHHP", label: "DHHP" },
  { value: "DHHY", label: "DHHY" },
  { value: "DHGC", label: "DHGC" },
  { value: "DHGD", label: "DHGD" },
];

const Header = ({
  title = "Dashboard",
  onMenuToggle,
  className = "",
  ...props
}) => {
  const { currentRoute } = useRouter();
  const currentRouteInfo = ROUTES[currentRoute] || { breadcrumb: title };
  const [selectedLegalEntity, setSelectedLegalEntity] = useState("DHV");
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

        {/* Right side - Legal Entity Selector */}
        {/* <div className="flex items-center space-x-2">
          <Select
            options={LEGAL_ENTITIES}
            value={selectedLegalEntity}
            onChange={setSelectedLegalEntity}
            className="w-24 text-sm"
            size="small"
          />
        </div> */}
      </div>
    </header>
  );
};

export default Header;
