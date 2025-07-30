import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import EntityCard from "../../atoms/EntityCard";
import Tabs from "../../atoms/Tabs";
import { ArrowLeft } from "lucide-react";
import { COUNTRIES, ENTITIES } from "../../../constants";
import WorkflowsContent from "./WorkflowsContentNew";

const WorkflowWizard = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");

  const handleCountryClick = (country) => {
    setSelectedCountry(country.value);
    setSelectedEntity(""); // Reset entity when country changes
  };

  const handleEntityTabChange = (entityValue) => {
    setSelectedEntity(entityValue);
  };

  // Show workflow management if country is selected
  if (selectedCountry) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedCountry("")}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Countries
          </Button>
          <div>
            <Text variant="heading" size="xl" weight="bold" className="mb-2">
              Workflow Management
            </Text>
            <Text variant="body" color="muted">
              {COUNTRIES.find((c) => c.value === selectedCountry)?.label}
            </Text>
          </div>
        </div>

        {/* Entity Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Tabs activeTab={selectedEntity} onTabChange={handleEntityTabChange}>
            {ENTITIES.map((entity) => (
              <Tabs.Panel key={entity} tabId={entity} label={entity}>
                <div className="mt-4">
                  <WorkflowsContent
                    selectedCountry={selectedCountry}
                    selectedEntity={entity}
                    hideFilters={true}
                  />
                </div>
              </Tabs.Panel>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }

  // Show country selection (default view)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Workflow Management
        </Text>
        <Text variant="body" color="muted">
          Select a country to start managing workflows
        </Text>
      </div>

      {/* Country Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COUNTRIES.map((country) => (
          <EntityCard
            key={country.value}
            title={country.label}
            description={`Manage approval workflows and processes for ${country.label} operations`}
            image={
              country.value === "VN"
                ? "https://www.deheus.com.vn/contentassets/20da7b24992f46eeb74f1914a3ce1735/premix-plant.png?mode=crop&width=622"
                : country.value === "NL"
                ? "https://www.deheus.com/globalassets/careers/hoofdkantoor-ede.jpg?mode=crop&width=750&height=402"
                : "https://images.unsplash.com/photo-1480796927426-f609979314bd"
            }
            onClick={() => handleCountryClick(country)}
            className="hover:border-blue-300"
          />
        ))}
      </div>
    </div>
  );
};

export default WorkflowWizard;
