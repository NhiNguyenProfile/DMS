import { useState } from "react";
import Text from "../../atoms/Text";
import Input from "../../atoms/Input";
import EntityCard from "../../atoms/EntityCard";
import CustomerRequestList from "./CustomerRequestList";
import SparePartsRequestList from "./SparePartsRequestList";
import FinishedGoodsRequestList from "./FinishedGoodsRequestList";
import { Search } from "lucide-react";

// Sample entity data
const SAMPLE_ENTITIES = [
  {
    id: 1,
    title: "Customers",
    description:
      "Manage customer information, accounts, and relationships. Create, update, and maintain customer profiles with comprehensive data management.",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 2,
    title: "Spare Parts",
    description:
      "Inventory management for spare parts including stock levels, procurement, and distribution. Track parts availability and maintenance schedules.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Finished Goods",
    description:
      "Complete product management from production to delivery. Monitor finished goods inventory, quality control, and shipment tracking.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&crop=center",
  },
];

const MyRequest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Filter entities based on search term
  const filteredEntities = SAMPLE_ENTITIES.filter(
    (entity) =>
      entity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEntityClick = (entity) => {
    console.log("Selected entity:", entity);
    setSelectedEntity(entity);
  };

  const handleBackToEntities = () => {
    setSelectedEntity(null);
  };

  // Show specific entity request list if selected
  if (selectedEntity) {
    switch (selectedEntity.title) {
      case "Customers":
        return <CustomerRequestList onBack={handleBackToEntities} />;
      case "Spare Parts":
        return <SparePartsRequestList onBack={handleBackToEntities} />;
      case "Finished Goods":
        return <FinishedGoodsRequestList onBack={handleBackToEntities} />;
      default:
        return (
          <div>Request list for {selectedEntity.title} coming soon...</div>
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          My Request
        </Text>
        <Text variant="body" color="muted">
          Select an entity type to create a new request
        </Text>
      </div>

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
            className="hover:border-blue-300"
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
          Showing {filteredEntities.length} of {SAMPLE_ENTITIES.length} entities
        </Text>
      </div>
    </div>
  );
};

export default MyRequest;
