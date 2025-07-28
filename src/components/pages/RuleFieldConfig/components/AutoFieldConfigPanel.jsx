import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import MultiSelect from "../../../atoms/MultiSelect";
import Toggle from "../../../atoms/Toggle";
import Tabs from "../../../atoms/Tabs";
import { X, Save, Settings, Target, Zap, Info, Edit3 } from "lucide-react";

// System methods
const SYSTEM_METHODS = [
  { value: "currentDate", label: "Current Date" },
  { value: "currentTime", label: "Current Time" },
  { value: "currentDateTime", label: "Current Date & Time" },
  { value: "currentUser", label: "Current User" },
  { value: "currentUserEmail", label: "Current User Email" },
  { value: "currentUserRole", label: "Current User Role" },
];

// API methods
const API_METHODS = [
  { value: "generateCustomerCode", label: "Generate Customer Code" },
  { value: "generateInvoiceNumber", label: "Generate Invoice Number" },
  { value: "generateReferenceId", label: "Generate Reference ID" },
  { value: "getNextSequence", label: "Get Next Sequence" },
  { value: "calculateTaxAmount", label: "Calculate Tax Amount" },
  { value: "getExchangeRate", label: "Get Exchange Rate" },
];

const AutoFieldConfigPanel = ({
  config,
  selectedEntity,
  selectedRequestType,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    ruleName: "",
    ruleDescription: "",
    status: "Active",
    autoFillType: "default",
    legalEntities: [],
    criteriaJson: "",
    configurationJson: "",
  });

  const [activeTab, setActiveTab] = useState("general");
  const [errors, setErrors] = useState({});
  const [showCriteriaEditor, setShowCriteriaEditor] = useState(false);
  const [showConfigEditor, setShowConfigEditor] = useState(false);

  // Legal entities options
  const legalEntitiesOptions = [
    { value: "DHV", label: "DHV" },
    { value: "PBH", label: "PBH" },
    { value: "PHP", label: "PHP" },
    { value: "PHY", label: "PHY" },
    { value: "DGC", label: "DGC" },
    { value: "DGD", label: "DGD" },
  ];

  // Load config data when editing
  useEffect(() => {
    if (config) {
      setFormData({
        ruleName: config.ruleName || "",
        ruleDescription: config.ruleDescription || "",
        status: config.status || "Active",
        autoFillType: config.type || "default",
        legalEntities: config.legalEntities || [],
        criteriaJson: config.criteria
          ? JSON.stringify(config.criteria, null, 2)
          : "",
        configurationJson: config.configuration
          ? JSON.stringify(config.configuration, null, 2)
          : "",
      });
    }
  }, [config]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate JSON fields
    if (formData.criteriaJson) {
      try {
        JSON.parse(formData.criteriaJson);
      } catch {
        newErrors.criteriaJson = "Invalid JSON format";
      }
    }

    if (formData.configurationJson) {
      try {
        JSON.parse(formData.configurationJson);
      } catch {
        newErrors.configurationJson = "Invalid JSON format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Parse JSON and create final data
      let criteria = null;
      let configuration = null;

      if (formData.criteriaJson) {
        try {
          criteria = JSON.parse(formData.criteriaJson);
        } catch {
          // Already validated, should not happen
        }
      }

      if (formData.configurationJson) {
        try {
          configuration = JSON.parse(formData.configurationJson);
        } catch {
          // Already validated, should not happen
        }
      }

      const finalData = {
        ...formData,
        type: formData.autoFillType,
        criteria,
        configuration,
      };

      onSave(finalData);
    }
  };

  const renderGeneralTab = () => (
    <div className="p-6 space-y-4">
      <div>
        <Text variant="body" weight="medium" className="mb-2">
          Rule Name
        </Text>
        <Input
          value={formData.ruleName}
          onChange={(e) => handleInputChange("ruleName", e.target.value)}
          placeholder="Enter rule name"
        />
      </div>

      <div>
        <Text variant="body" weight="medium" className="mb-2">
          Rule Description
        </Text>
        <Input
          value={formData.ruleDescription}
          onChange={(e) => handleInputChange("ruleDescription", e.target.value)}
          placeholder="Enter rule description"
        />
      </div>

      <div>
        <Text variant="body" weight="medium" className="mb-2">
          Status
        </Text>
        <Toggle
          checked={formData.status === "Active"}
          onChange={(checked) =>
            handleInputChange("status", checked ? "Active" : "Inactive")
          }
          label={formData.status}
        />
      </div>

      <div>
        <Text variant="body" weight="medium" className="mb-2">
          Legal Entities (Apply)
        </Text>
        <MultiSelect
          options={legalEntitiesOptions}
          value={formData.legalEntities}
          onChange={(selectedValues) =>
            handleInputChange("legalEntities", selectedValues)
          }
          placeholder="Select legal entities"
          className="w-full"
        />
        <Text variant="caption" color="muted" className="mt-1">
          Select which legal entities this auto-field rule applies to
        </Text>
      </div>
    </div>
  );

  const renderConfigurationTab = () => (
    <div className="p-6 space-y-6">
      <Text variant="heading" size="md" weight="semibold">
        Auto-field Configuration
      </Text>

      {/* Auto-fill Type Selector */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Text variant="body" weight="medium">
            Auto-fill Type *
          </Text>
          <div className="group relative">
            <Info
              size={16}
              className="text-gray-400 hover:text-gray-600 cursor-help"
            />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              Choose between default values or dependent field logic
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
        <Select
          options={[
            {
              value: "default",
              label: "Default Value - Set fixed values for fields",
            },
            {
              value: "dependent",
              label: "Dependent Field - Conditional logic based on criteria",
            },
          ]}
          value={formData.autoFillType}
          onChange={(value) => {
            handleInputChange("autoFillType", value);
            // Clear criteria when switching to default
            if (value === "default") {
              handleInputChange("criteriaJson", "");
            }
          }}
        />
      </div>

      {/* Criteria Section - Only show for dependent type */}
      {formData.autoFillType === "dependent" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Text variant="body" weight="medium">
                Criteria (JSON)
              </Text>
              <div className="group relative">
                <Info
                  size={16}
                  className="text-gray-400 hover:text-gray-600 cursor-help"
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Define conditions for when this auto-field rule should be
                  applied
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!config && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => {
                    setShowCriteriaEditor(true);
                    // Load template if empty
                    if (!formData.criteriaJson) {
                      handleInputChange(
                        "criteriaJson",
                        JSON.stringify(
                          {
                            field: "",
                            operator: "==",
                            value: "",
                          },
                          null,
                          2
                        )
                      );
                    }
                  }}
                >
                  <Edit3 size={14} className="mr-1" />
                  JSON Editor
                </Button>
              )}
              <Button
                variant="outline"
                size="small"
                onClick={() => {
                  handleInputChange(
                    "criteriaJson",
                    JSON.stringify(
                      {
                        field: "",
                        operator: "==",
                        value: "",
                      },
                      null,
                      2
                    )
                  );
                }}
              >
                Load Template
              </Button>
            </div>
          </div>
          <textarea
            className="w-full h-32 p-3 border border-gray-200 rounded-lg font-mono text-sm"
            value={formData.criteriaJson || ""}
            onChange={(e) => handleInputChange("criteriaJson", e.target.value)}
            placeholder={`{
  "field": "country",
  "operator": "==",
  "value": "VN"
}

or for complex criteria:

{
  "and": [
    {"field": "country", "operator": "==", "value": "VN"},
    {"field": "customerType", "operator": "!=", "value": "Company"}
  ]
}`}
          />
          {errors.criteriaJson && (
            <Text variant="caption" color="error" className="mt-1">
              {errors.criteriaJson}
            </Text>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Text variant="body" weight="medium">
              Configuration (JSON)
            </Text>
            <div className="group relative">
              <Info
                size={16}
                className="text-gray-400 hover:text-gray-600 cursor-help"
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Define the auto-field configuration including type, field
                details, and values
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!config && (
              <Button
                variant="outline"
                size="small"
                onClick={() => {
                  setShowConfigEditor(true);
                  // Load template if empty
                  if (!formData.configurationJson) {
                    handleInputChange(
                      "configurationJson",
                      JSON.stringify(
                        {
                          type: formData.autoFillType,
                          fields: [
                            {
                              fieldKey: "",
                              fieldName: "",
                              value: "",
                            },
                          ],
                        },
                        null,
                        2
                      )
                    );
                  }
                }}
              >
                <Edit3 size={14} className="mr-1" />
                JSON Editor
              </Button>
            )}
            <Button
              variant="outline"
              size="small"
              onClick={() => {
                handleInputChange(
                  "configurationJson",
                  JSON.stringify(
                    {
                      type: formData.autoFillType,
                      fields: [
                        {
                          fieldKey: "",
                          fieldName: "",
                          value: "",
                        },
                      ],
                    },
                    null,
                    2
                  )
                );
              }}
            >
              Load Template
            </Button>
          </div>
        </div>
        <textarea
          className="w-full h-40 p-3 border border-gray-200 rounded-lg font-mono text-sm"
          value={formData.configurationJson || ""}
          onChange={(e) =>
            handleInputChange("configurationJson", e.target.value)
          }
          placeholder={`{
  "type": "default",
  "fieldKey": "country",
  "fieldName": "Country",
  "value": "VN"
}

or for dependent fields:

{
  "type": "dependent",
  "fieldKey": "region",
  "fieldName": "Region",
  "value": "Miền Bắc"
}

or for system/API:

{
  "type": "system",
  "fieldKey": "createdBy",
  "fieldName": "Created By",
  "method": "currentUser"
}`}
        />
        {errors.configurationJson && (
          <Text variant="caption" color="error" className="mt-1">
            {errors.configurationJson}
          </Text>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-1/2 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <Text variant="heading" size="lg" weight="semibold">
              {config?.id ? "Edit Auto-field Config" : "Add Auto-field Config"}
            </Text>
            <Text variant="body" color="muted" className="mt-1">
              Configure automatic field value assignment
            </Text>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs
            defaultTab="general"
            onChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <Tabs.Panel
              tabId="general"
              label="General"
              icon={<Settings size={16} />}
            >
              {renderGeneralTab()}
            </Tabs.Panel>

            <Tabs.Panel
              tabId="configuration"
              label="Configuration"
              icon={<Target size={16} />}
            >
              {renderConfigurationTab()}
            </Tabs.Panel>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Save size={16} className="mr-2" />
            Save Config
          </Button>
        </div>
      </div>

      {/* Criteria JSON Editor Modal */}
      {showCriteriaEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-3/4 h-3/4 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <Text variant="heading" size="md" weight="semibold">
                Criteria JSON Editor
              </Text>
              <IconButton
                variant="icon"
                color="gray"
                onClick={() => setShowCriteriaEditor(false)}
              >
                <X size={20} />
              </IconButton>
            </div>
            <div className="flex-1 p-4">
              <textarea
                className="w-full h-full p-4 border border-gray-200 rounded-lg font-mono text-sm resize-none"
                value={formData.criteriaJson || ""}
                onChange={(e) =>
                  handleInputChange("criteriaJson", e.target.value)
                }
                placeholder={`{
  "field": "country",
  "operator": "==",
  "value": "VN"
}

or for complex criteria:

{
  "and": [
    {"field": "country", "operator": "==", "value": "VN"},
    {"field": "customerType", "operator": "!=", "value": "Company"}
  ]
}`}
              />
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowCriteriaEditor(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowCriteriaEditor(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration JSON Editor Modal */}
      {showConfigEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-3/4 h-3/4 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <Text variant="heading" size="md" weight="semibold">
                Configuration JSON Editor
              </Text>
              <IconButton
                variant="icon"
                color="gray"
                onClick={() => setShowConfigEditor(false)}
              >
                <X size={20} />
              </IconButton>
            </div>
            <div className="flex-1 p-4">
              <textarea
                className="w-full h-full p-4 border border-gray-200 rounded-lg font-mono text-sm resize-none"
                value={formData.configurationJson || ""}
                onChange={(e) =>
                  handleInputChange("configurationJson", e.target.value)
                }
                placeholder={`{
  "type": "${formData.autoFillType}",
  "fields": [
    {
      "fieldKey": "country",
      "fieldName": "Country",
      "value": "VN"
    },
    {
      "fieldKey": "currency",
      "fieldName": "Currency",
      "value": "VND"
    }
  ]
}`}
              />
            </div>
            <div className="flex justify-end gap-3 p-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowConfigEditor(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowConfigEditor(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutoFieldConfigPanel;
