import { useState } from "react";
import Text from "../../atoms/Text";
import EntityCard from "../../atoms/EntityCard";
import { ArrowLeft } from "lucide-react";
import Button from "../../atoms/Button";
import CustomerRecords from "./CustomerRecords";
import SparePartRecords from "./SparePartRecords";
import FinishedGoodRecords from "./FinishedGoodRecords";

const ENTITIES = ["Customer", "Spare Part", "Finished Good"];

const MasterDataRecords = () => {
  const [selectedEntity, setSelectedEntity] = useState("");

  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
  };

  const handleBackToEntities = () => {
    setSelectedEntity("");
  };

  // Show records for selected entity
  if (selectedEntity) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBackToEntities}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Entities
          </Button>
          <div>
            <Text variant="heading" size="xl" weight="bold" className="mb-1">
              {selectedEntity} Records
            </Text>
            <Text variant="body" color="muted">
              View and manage {selectedEntity.toLowerCase()} master data records
            </Text>
          </div>
        </div>

        {/* Entity Records Component */}
        {selectedEntity === "Customer" && <CustomerRecords />}
        {selectedEntity === "Spare Part" && <SparePartRecords />}
        {selectedEntity === "Finished Good" && <FinishedGoodRecords />}
      </div>
    );
  }

  // Show entity selection by default
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Master Data Records
        </Text>
        <Text variant="body" color="muted">
          Choose an entity type to view and manage records
        </Text>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ENTITIES.map((entity) => (
          <EntityCard
            key={entity}
            title={entity}
            description={`View and manage ${entity.toLowerCase()} master data records`}
            image={`https://images.unsplash.com/photo-${
              entity === "Customer"
                ? "1560472354-b33ff0c44a43"
                : entity === "Finished Good"
                ? "1586528116311-ad8dd3c8310d"
                : "1581092918056-0c4c3acd3789"
            }?w=400&h=200&fit=crop`}
            onClick={() => handleEntityClick(entity)}
            className="hover:border-blue-300"
          />
        ))}
      </div>
    </div>
  );
};

export default MasterDataRecords;
