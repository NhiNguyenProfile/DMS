import { useState, useEffect, createContext, useContext } from "react";

// Router Context
const RouterContext = createContext();

// Router Provider
export const RouterProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState("workflows");

  const navigate = (route) => {
    console.log("Navigating to:", route); // Debug log
    setCurrentRoute(route);
    // Update URL hash for better UX
    window.location.hash = route;
  };

  // Initialize from URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setCurrentRoute(hash);
    }
  }, []);

  // Debug log current route
  console.log("Current route:", currentRoute);

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

// Router hook
export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within RouterProvider");
  }
  return context;
};

// Route definitions
export const ROUTES = {
  "rule-field-config": {
    id: "rule-field-config",
    title: "Rule & Field Configuration",
    breadcrumb: "Configuration",
  },
  workflows: {
    id: "workflows",
    title: "Workflows",
    breadcrumb: "Workflows",
  },
  "workflow-edit": {
    id: "workflow-edit",
    title: "Edit Workflow",
    breadcrumb: "Edit Workflow",
  },
};
