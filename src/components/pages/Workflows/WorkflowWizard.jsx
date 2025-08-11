import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import EntityCard from "../../atoms/EntityCard";
import Tabs from "../../atoms/Tabs";
import { ArrowLeft, Workflow, Users, GitBranch } from "lucide-react";
import { ENTITIES } from "../../../constants";
import WorkflowsContent from "./WorkflowsContentNew";
import GroupConfig from "./components/GroupConfig";
import HierarchyConfig from "./components/HierarchyConfig";

const WorkflowWizard = () => {
  const [selectedEntity, setSelectedEntity] = useState("");

  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
  };

  // Show workflow management if entity is selected
  if (selectedEntity) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedEntity("")}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Entities
          </Button>
          <div>
            <Text variant="heading" size="xl" weight="bold" className="mb-2">
              Workflow Management
            </Text>
            <Text variant="body" color="muted">
              {selectedEntity}
            </Text>
          </div>
        </div>

        {/* Configuration Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Tabs defaultTab="workflow-config" variant="default">
            <Tabs.Panel
              tabId="workflow-config"
              label="Workflow Config"
              icon={<Workflow size={16} />}
            >
              <div className="mt-4">
                <WorkflowsContent
                  selectedCountry="Vietnam"
                  selectedEntity={selectedEntity}
                  hideFilters={true}
                />
              </div>
            </Tabs.Panel>

            <Tabs.Panel
              tabId="group-config"
              label="Group Config"
              icon={<Users size={16} />}
            >
              <div className="mt-4">
                <GroupConfig />
              </div>
            </Tabs.Panel>

            <Tabs.Panel
              tabId="hierarchy-config"
              label="Hierarchy Config"
              icon={<GitBranch size={16} />}
            >
              <div className="mt-4">
                <HierarchyConfig />
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    );
  }

  // Show entity selection (default view)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Workflow Management
        </Text>
        <Text variant="body" color="muted">
          Choose an entity type to manage workflows
        </Text>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ENTITIES.map((entity) => (
          <EntityCard
            key={entity}
            title={entity}
            description={`Manage approval workflows and processes for ${entity.toLowerCase()}`}
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

export default WorkflowWizard;
