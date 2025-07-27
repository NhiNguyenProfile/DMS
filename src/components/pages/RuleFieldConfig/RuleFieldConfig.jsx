import { useState, useEffect } from "react";
import Text from "../../atoms/Text";
import Select from "../../atoms/Select";
import Button from "../../atoms/Button";
import Tabs from "../../atoms/Tabs";
import DashboardLayout from "../../templates/DashboardLayout";
import FieldOverview from "./components/FieldOverview";
import ValidationRules from "./components/ValidationRules";
import { ENTITIES, REQUEST_TYPES, COUNTRIES } from "../../../constants";
import { ENTITY_CONFIGS } from "../../../data/mockData";
import { FileText, Shield } from "lucide-react";

const RuleFieldConfig = () => {
  // Header Controls State
  const [selectedEntity, setSelectedEntity] = useState("");
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isCountryLocked, setIsCountryLocked] = useState(false);

  // Available request types based on selected entity
  const [availableRequestTypes, setAvailableRequestTypes] = useState([]);

  // Update available request types when entity changes
  useEffect(() => {
    if (selectedEntity && ENTITY_CONFIGS[selectedEntity]) {
      setAvailableRequestTypes(
        ENTITY_CONFIGS[selectedEntity].available_request_types
      );
      setSelectedRequestType(""); // Reset request type when entity changes
    } else {
      setAvailableRequestTypes([]);
    }
  }, [selectedEntity]);

  return (
    <DashboardLayout title="Rule & Field Configuration">
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Text variant="heading" size="lg" weight="semibold" className="mb-4">
            Configuration Filters
          </Text>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      setSelectedRequestType("");
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

            {/* Request Type */}
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Request Type *
              </Text>
              <Select
                options={availableRequestTypes}
                value={selectedRequestType}
                onChange={setSelectedRequestType}
                placeholder="Select Request Type"
                disabled={!selectedEntity || !selectedCountry}
              />
              {!selectedEntity && selectedCountry && (
                <Text variant="caption" color="muted" className="mt-1">
                  Please select entity first
                </Text>
              )}
            </div>
          </div>

          {/* Load Configuration Button */}
          <div className="mt-4 flex justify-end">
            <Button
              variant="primary"
              disabled={
                !selectedEntity || !selectedRequestType || !selectedCountry
              }
              onClick={() => {
                console.log("Loading configuration for:", {
                  selectedEntity,
                  selectedRequestType,
                  selectedCountry,
                });
                setIsCountryLocked(true);
              }}
            >
              Load Configuration
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Tabs defaultTab="fields" variant="default">
            <Tabs.Panel
              tabId="fields"
              label="Field Overview"
              icon={<FileText size={16} />}
            >
              <FieldOverview
                selectedEntity={selectedEntity}
                selectedRequestType={selectedRequestType}
                disabled={!selectedEntity || !selectedRequestType}
              />
            </Tabs.Panel>

            <Tabs.Panel
              tabId="rules"
              label="Validation Rules"
              icon={<Shield size={16} />}
            >
              <ValidationRules
                selectedEntity={selectedEntity}
                selectedRequestType={selectedRequestType}
                disabled={!selectedEntity || !selectedRequestType}
              />
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RuleFieldConfig;
