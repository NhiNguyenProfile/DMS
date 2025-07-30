import { useState } from "react";
import Text from "../../atoms/Text";
import Input from "../../atoms/Input";
import EntityCard from "../../atoms/EntityCard";
import Tabs from "../../atoms/Tabs";
import Button from "../../atoms/Button";
import { Search, Grid, List } from "lucide-react";
import ApprovalRequestList from "./ApprovalRequestList";

// Sample approval entities
const APPROVAL_ENTITIES = [
  {
    id: 1,
    title: "Customers",
    description:
      "Review and approve customer registration requests, profile updates, and account modifications. Manage customer approval workflows.",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 2,
    title: "Spare Parts",
    description:
      "Approve spare parts procurement requests, inventory adjustments, and supplier changes. Review parts specifications and pricing.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Finished Goods",
    description:
      "Approve finished goods production orders, quality control reports, and shipment authorizations. Review product specifications.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&crop=center",
  },
];

const Approval = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [viewMode, setViewMode] = useState("direct"); // "cards" or "direct"
  const [activeTab, setActiveTab] = useState("Customers"); // Default to Customers
  const [showDetailInDirect, setShowDetailInDirect] = useState(false);
  const [detailComponent, setDetailComponent] = useState(null);

  // Filter entities based on search term
  const filteredEntities = APPROVAL_ENTITIES.filter(
    (entity) =>
      entity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEntityClick = (entity) => {
    console.log("Selected approval entity:", entity);
    setSelectedEntity(entity);
  };

  const handleBackToEntities = () => {
    setSelectedEntity(null);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleShowDetailInDirect = (component) => {
    setDetailComponent(component);
    setShowDetailInDirect(true);
  };

  const handleBackFromDetailInDirect = () => {
    setShowDetailInDirect(false);
    setDetailComponent(null);
  };

  const renderApprovalListByTab = (tabName) => {
    return (
      <ApprovalRequestList
        entityType={tabName}
        hideHeader={true}
        onShowDetail={handleShowDetailInDirect}
      />
    );
  };

  // Show detail form if opened from Direct mode
  if (showDetailInDirect && detailComponent) {
    return detailComponent;
  }

  // Show specific entity approval list if selected (Card mode)
  if (selectedEntity && viewMode === "cards") {
    switch (selectedEntity.title) {
      case "Customers":
        return (
          <ApprovalRequestList
            onBack={handleBackToEntities}
            entityType="Customers"
          />
        );
      case "Spare Parts":
        return (
          <ApprovalRequestList
            onBack={handleBackToEntities}
            entityType="Spare Parts"
          />
        );
      case "Finished Goods":
        return (
          <ApprovalRequestList
            onBack={handleBackToEntities}
            entityType="Finished Goods"
          />
        );
      default:
        return (
          <div>Approval list for {selectedEntity.title} coming soon...</div>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="xl" weight="bold" className="mb-2">
            Approval
          </Text>
          <Text variant="body" color="muted">
            {viewMode === "direct"
              ? "Review and approve pending requests by entity type"
              : "Select an entity type to review approvals"}
          </Text>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === "direct" ? "primary" : "ghost"}
            size="small"
            onClick={() => setViewMode("direct")}
            className="flex items-center gap-2"
          >
            <List size={16} />
            Direct
          </Button>
          <Button
            variant={viewMode === "cards" ? "primary" : "ghost"}
            size="small"
            onClick={() => setViewMode("cards")}
            className="flex items-center gap-2"
          >
            <Grid size={16} />
            Cards
          </Button>
        </div>
      </div>

      {/* Direct Mode - Entity Tabs */}
      {viewMode === "direct" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Tabs activeTab={activeTab} onTabChange={handleTabChange}>
            <Tabs.Panel tabId="Customers" label="Customers">
              <div className="mt-4">{renderApprovalListByTab("Customers")}</div>
            </Tabs.Panel>
            <Tabs.Panel tabId="Spare Parts" label="Spare Parts">
              <div className="mt-4">
                {renderApprovalListByTab("Spare Parts")}
              </div>
            </Tabs.Panel>
            <Tabs.Panel tabId="Finished Goods" label="Finished Goods">
              <div className="mt-4">
                {renderApprovalListByTab("Finished Goods")}
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      )}

      {/* Cards Mode - Search and Entity Cards */}
      {viewMode === "cards" && (
        <>
          {/* Search */}
          <div className="relative max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search entities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Entity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEntities.map((entity) => (
              <EntityCard
                key={entity.id}
                title={entity.title}
                description={entity.description}
                image={entity.image}
                onClick={() => handleEntityClick(entity)}
                className="hover:border-orange-300"
              />
            ))}
          </div>

          {/* No results */}
          {filteredEntities.length === 0 && (
            <div className="text-center py-12">
              <Text variant="body" color="muted">
                No entities found matching "{searchTerm}"
              </Text>
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Text variant="body" color="muted" className="text-sm">
              Showing {filteredEntities.length} of {APPROVAL_ENTITIES.length}{" "}
              entities
            </Text>
          </div>
        </>
      )}
    </div>
  );
};

export default Approval;
