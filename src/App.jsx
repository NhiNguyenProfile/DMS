import { RouterProvider, useRouter } from "./hooks/useRouter.jsx";
import DashboardLayout from "./components/templates/DashboardLayout";
import MyRequest from "./components/pages/MyRequest";
import Approval from "./components/pages/Approval";
import Search from "./components/pages/Search";
import ConfigurationWizard from "./components/pages/RuleFieldConfig";
import WorkflowWizard from "./components/pages/Workflows";
import WorkflowEdit from "./components/pages/WorkflowEdit";

function AppContent() {
  const { currentRoute } = useRouter();

  const renderPageContent = () => {
    switch (currentRoute) {
      case "my-request":
        return <MyRequest />;
      case "approval":
        return <Approval />;
      case "search":
        return <Search />;
      case "rule-field-config":
        return <ConfigurationWizard />;
      case "workflows":
        return <WorkflowWizard />;
      case "workflow-edit":
        return <WorkflowEdit />;
      default:
        return <MyRequest />;
    }
  };

  return <DashboardLayout>{renderPageContent()}</DashboardLayout>;
}

function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
