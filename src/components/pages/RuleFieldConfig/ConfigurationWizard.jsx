import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import EntityCard from "../../atoms/EntityCard";
import { ArrowLeft } from "lucide-react";
import { COUNTRIES, ENTITIES } from "../../../constants";
import RuleFieldConfigContent from "./RuleFieldConfigContent";

const ConfigurationWizard = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");

  const handleCountryClick = (country) => {
    setSelectedCountry(country.value);
    setSelectedEntity(""); // Reset entity when country changes
  };

  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
  };

  // Show configuration if both country and entity are selected
  if (selectedCountry && selectedEntity) {
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
              Form Configuration
            </Text>
            <Text variant="body" color="muted">
              {COUNTRIES.find((c) => c.value === selectedCountry)?.label} →{" "}
              {selectedEntity}
            </Text>
          </div>
        </div>

        {/* Configuration Content */}
        <RuleFieldConfigContent
          selectedCountry={selectedCountry}
          selectedEntity={selectedEntity}
          hideFilters={true}
        />
      </div>
    );
  }

  // Show entity selection if country is selected
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
              Select Entity Type
            </Text>
            <Text variant="body" color="muted">
              Choose an entity type to configure for{" "}
              {COUNTRIES.find((c) => c.value === selectedCountry)?.label}
            </Text>
          </div>
        </div>

        {/* Entity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENTITIES.map((entity) => (
            <EntityCard
              key={entity}
              title={entity}
              description={`Configure ${entity.toLowerCase()} fields and validation rules`}
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
  }

  // Show country selection (default view)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Form Configuration
        </Text>
        <Text variant="body" color="muted">
          Select a country to start configuring field rules and validation
        </Text>
      </div>

      {/* Country Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COUNTRIES.map((country) => (
          <EntityCard
            key={country.value}
            title={country.label}
            description={`Configure field rules and validation for ${country.label} operations`}
            image={`${
              country.value === "VN"
                ? "https://www.deheus.com.vn/contentassets/20da7b24992f46eeb74f1914a3ce1735/premix-plant.png?mode=crop&width=622"
                : country.value === "NL"
                ? "https://www.deheus.com/globalassets/careers/hoofdkantoor-ede.jpg?mode=crop&width=750&height=402"
                : "https://images.unsplash.com/photo-1480796927426-f609979314bd"
            }?w=400&h=200&fit=crop`}
            onClick={() => handleCountryClick(country)}
            className="hover:border-blue-300"
          />
        ))}
      </div>
    </div>
  );
};

export default ConfigurationWizard;
