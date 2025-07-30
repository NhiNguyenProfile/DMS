import { useState } from "react";
import Text from "../../atoms/Text";
import Select from "../../atoms/Select";
import Button from "../../atoms/Button";
import Tabs from "../../atoms/Tabs";
import FieldConfig from "./components/FieldConfig";
import ValidationConfig from "./components/ValidationConfig";
import AutoFieldConfig from "./components/AutoFieldConfig";
import { ENTITIES, COUNTRIES } from "../../../constants";
import { FileText, Shield, Layout } from "lucide-react";

const RuleFieldConfigContent = ({
  selectedCountry: propSelectedCountry,
  selectedEntity: propSelectedEntity,
  hideFilters = false,
}) => {
  // Header Controls State
  const [selectedEntity, setSelectedEntity] = useState(
    propSelectedEntity || ""
  );
  const [selectedCountry, setSelectedCountry] = useState(
    propSelectedCountry || ""
  );
  const [isCountryLocked, setIsCountryLocked] = useState(false);

  // Use props if provided
  const finalSelectedCountry = propSelectedCountry || selectedCountry;
  const finalSelectedEntity = propSelectedEntity || selectedEntity;

  return (
    <div className="space-y-6">
      {/* Header Controls - Only show if not hidden */}
      {!hideFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Text variant="heading" size="lg" weight="semibold" className="mb-4">
            Configuration Filters
          </Text>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country - First selection */}
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Country *
              </Text>
              <Select
                options={COUNTRIES}
                value={selectedCountry}
                onChange={(value) => {
                  setSelectedCountry(value);
                  if (value) {
                    setIsCountryLocked(true);
                  }
                }}
                placeholder="Select Country"
                disabled={isCountryLocked}
              />
              {isCountryLocked && (
                <div className="mt-2 flex items-center justify-between">
                  <Text variant="caption" color="muted">
                    Country locked for this session
                  </Text>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => {
                      setIsCountryLocked(false);
                      setSelectedEntity("");
                    }}
                  >
                    Change Country
                  </Button>
                </div>
              )}
            </div>

            {/* Entity Selector */}
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Entity Type *
              </Text>
              <Select
                options={ENTITIES}
                value={selectedEntity}
                onChange={setSelectedEntity}
                placeholder="Select Entity"
                disabled={!selectedCountry}
              />
              {!selectedCountry && (
                <Text variant="caption" color="muted" className="mt-1">
                  Please select country first
                </Text>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Tabs defaultTab="field-config" variant="default">
          <Tabs.Panel
            tabId="field-config"
            label="Field Config"
            icon={<FileText size={16} />}
          >
            <FieldConfig
              selectedEntity={finalSelectedEntity}
              selectedRequestType="Create"
              disabled={!finalSelectedEntity || !finalSelectedCountry}
            />
          </Tabs.Panel>

          <Tabs.Panel
            tabId="validation-config"
            label="Validation Config"
            icon={<Shield size={16} />}
          >
            <ValidationConfig
              selectedEntity={finalSelectedEntity}
              selectedRequestType="Create"
              disabled={!finalSelectedEntity || !finalSelectedCountry}
            />
          </Tabs.Panel>

          <Tabs.Panel
            tabId="auto-field-config"
            label="Auto-field Config"
            icon={<Layout size={16} />}
          >
            <AutoFieldConfig
              selectedEntity={finalSelectedEntity}
              selectedRequestType="Create"
              disabled={!finalSelectedEntity || !finalSelectedCountry}
            />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default RuleFieldConfigContent;
