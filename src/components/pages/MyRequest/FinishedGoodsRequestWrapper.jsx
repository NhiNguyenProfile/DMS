import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Tabs, { TabPanel } from "../../atoms/Tabs/Tabs";
import FinishedGoodsRequestList from "./FinishedGoodsRequestList";
import { FileText, Package } from "lucide-react";

// Define request types for filtering
const SINGLE_REQUEST_TYPES = ["Create", "Copy", "Extend", "Edit"];
const PACKAGE_REQUEST_TYPES = ["MassCreate", "MassEdit"];

const FinishedGoodsRequestWrapper = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("single");
  const [showDetail, setShowDetail] = useState(false);
  const [detailComponent, setDetailComponent] = useState(null);

  const handleShowDetail = (component) => {
    setDetailComponent(component);
    setShowDetail(true);
  };

  // If showing detail, render it instead of tabs
  if (showDetail && detailComponent) {
    return detailComponent;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Entities
        </Button>
        <div>
          <Text variant="heading" size="xl" weight="bold" className="mb-2">
            Finished Goods Requests
          </Text>
          <Text variant="body" color="muted">
            Manage finished goods requests - single or package operations
          </Text>
        </div>
      </div>

      {/* Tabs */}
      <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
        <TabPanel
          tabId="single"
          label="Single Request"
          icon={<FileText size={16} />}
        >
          <FinishedGoodsRequestList
            hideHeader={true}
            allowedRequestTypes={SINGLE_REQUEST_TYPES}
            onShowDetail={handleShowDetail}
          />
        </TabPanel>

        <TabPanel
          tabId="package"
          label="Package Request"
          icon={<Package size={16} />}
        >
          <FinishedGoodsRequestList
            hideHeader={true}
            allowedRequestTypes={PACKAGE_REQUEST_TYPES}
            onShowDetail={handleShowDetail}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default FinishedGoodsRequestWrapper;
