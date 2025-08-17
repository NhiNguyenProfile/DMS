import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import MultiSelect from "../../../atoms/MultiSelect";
import Toggle from "../../../atoms/Toggle";
import Tabs, { TabPanel } from "../../../atoms/Tabs";
import { X, Save, Info } from "lucide-react";

const ValidationConfigPanel = ({
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
    legalEntities: [],
    request_type: ["Create", "Copy", "Extend", "Edit"],
    criteria: "",
    criteriaLogic: "",
    validationConfigJson: `[
  {
    "field_name": "CustomerType",
    "validations": "[{ 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'bắt buộc điền', 'value': 'true'} ]"
  },
  {
    "field_name": "Organizationname",
    "validations": "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'bắt buộc điền', 'value': 'true'},{ 'type': 'MAXLENGTH', 'operator': 'DEFAULT', 'message': 'tối đa 10 ký tự', 'value': '10'} ]"
  },
  {
    "field_name": "Salary",
    "validations": "[ {'type': 'MAX', 'operator': 'DEFAULT', 'message': 'MAX 10', 'value': '10'}, {'type': 'MIN', 'operator': 'DEFAULT', 'message': 'MIN 1', 'value': '1'}]"
  },
  {
    "field_name": "Country",
    "validations": "[{'type': 'DISPLAYMODE', 'operator': 'DEFAULT', 'message': '', 'value': 'DISABLE'}]"
  }
]`,
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("general");

  // Legal entities options
  const legalEntitiesOptions = [
    { value: "DHV", label: "DHV" },
    { value: "DHBH", label: "DHBH" },
    { value: "DHHP", label: "DHHP" },
    { value: "DHHY", label: "DHHY" },
    { value: "DHGC", label: "DHGC" },
    { value: "DHGD", label: "DHGD" },
  ];

  // Load config data when editing
  useEffect(() => {
    if (config) {
      // Check if config has new format (field_name) or old format (ruleName)
      if (config.field_name) {
        // New format - single field config
        setFormData({
          ruleName: config.field_name || "",
          ruleDescription: `Configuration for ${config.field_name}`,
          status: "Active",
          legalEntities: [],
          criteria: config.criteria || "",
          criteriaLogic: config.criteriaLogic || "",
          validationConfigJson: JSON.stringify([config], null, 2),
        });
      } else {
        // Old format - multiple field config
        setFormData({
          ruleName: config.ruleName || "",
          ruleDescription: config.ruleDescription || "",
          status: config.status || "Active",
          legalEntities: config.legalEntities || [],
          request_type: config.request_type || [
            "Create",
            "Copy",
            "Extend",
            "Edit",
          ],
          criteria: config.criteria || "",
          criteriaLogic: config.criteriaLogic || "",
          validationConfigJson: config.validationConfig
            ? JSON.stringify(config.validationConfig, null, 2)
            : "",
        });
      }
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

    // Validate JSON configuration
    if (formData.validationConfigJson) {
      try {
        JSON.parse(formData.validationConfigJson);
      } catch {
        newErrors.validationConfigJson = "Invalid JSON format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Parse JSON configuration
      let parsedConfig = [];
      try {
        parsedConfig = JSON.parse(formData.validationConfigJson);
      } catch (error) {
        // Should not happen due to validation
        parsedConfig = [];
      }

      // Prepare final data for JSON mode only
      const finalData = {
        ...formData,
        validationConfig: parsedConfig,
        parsedValidationConfig: parsedConfig,
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
          Request Types *
        </Text>
        <MultiSelect
          options={[
            { value: "Create", label: "Create" },
            { value: "Copy", label: "Copy" },
            { value: "Extend", label: "Extend" },
            { value: "Edit", label: "Edit" },
          ]}
          value={formData.request_type || ["Create", "Copy", "Extend", "Edit"]}
          onChange={(values) => handleInputChange("request_type", values)}
          placeholder="Select Request Types"
          className="w-full"
        />
        <Text variant="caption" color="muted" className="mt-1">
          Select which request types this validation rule applies to
        </Text>
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
          Select which legal entities this validation rule applies to
        </Text>
      </div>
    </div>
  );

  const renderConfigurationTab = () => (
    <div className="p-6 space-y-6">
      <Text variant="heading" size="md" weight="semibold">
        JSON Configuration
      </Text>

      {/* Criteria Fields */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Text variant="body" weight="medium" className="mb-2">
            Criteria
          </Text>
          <Input
            value={formData.criteria}
            onChange={(e) => handleInputChange("criteria", e.target.value)}
            placeholder="Enter criteria for validation"
          />
          <Text variant="caption" color="muted" className="mt-1">
            Define the criteria that must be met for this validation rule
          </Text>
        </div>

        <div>
          <Text variant="body" weight="medium" className="mb-2">
            Criteria Logic
          </Text>
          <Input
            value={formData.criteriaLogic}
            onChange={(e) => handleInputChange("criteriaLogic", e.target.value)}
            placeholder="Enter criteria logic (e.g., AND, OR)"
          />
          <Text variant="caption" color="muted" className="mt-1">
            Define the logical operators for combining multiple criteria
          </Text>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Text variant="body" weight="medium">
              Validation Configuration (JSON)
            </Text>
            <div className="group relative">
              <Info
                size={16}
                className="text-gray-400 hover:text-gray-600 cursor-help"
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                New format: field_name, validations (JSON string)
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="small"
            onClick={() => {
              handleInputChange(
                "validationConfigJson",
                JSON.stringify(
                  [
                    {
                      field_name: "CustomerType",
                      validations:
                        "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'bắt buộc điền', 'value': 'true'} ]",
                    },
                    {
                      field_name: "Organizationname",
                      validations:
                        "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'bắt buộc điền', 'value': 'true'},{ 'type': 'MAXLENGTH', 'operator': 'DEFAULT', 'message': 'tối đa 10 ký tự', 'value': '10'} ]",
                    },
                    {
                      field_name: "Salary",
                      validations:
                        "[ {'type': 'MAX', 'operator': 'DEFAULT', 'message': 'MAX 10', 'value': '10'}, {'type': 'MIN', 'operator': 'DEFAULT', 'message': 'MIN 1', 'value': '1'}]",
                    },
                    {
                      field_name: "Country",
                      validations:
                        "[ {'type': 'DISPLAYMODE', 'operator': 'DEFAULT', 'message': '', 'value': 'DISABLE'}]",
                    },
                  ],
                  null,
                  2
                )
              );
            }}
          >
            Load Template
          </Button>
        </div>
        <textarea
          className="w-full h-64 p-3 border border-gray-200 rounded-lg font-mono text-sm"
          value={formData.validationConfigJson || ""}
          onChange={(e) =>
            handleInputChange("validationConfigJson", e.target.value)
          }
          placeholder={`[
  {
    "field_name": "CustomerType",
    "validations": "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'bắt buộc điền', 'value': 'true'} ]"
  },
  {
    "field_name": "Organizationname",
    "validations": "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'bắt buộc điền', 'value': 'true'},{ 'type': 'MAXLENGTH', 'operator': 'DEFAULT', 'message': 'tối đa 10 ký tự', 'value': '10'} ]"
  },
  {
    "field_name": "Salary",
    "validations": "[ {'type': 'MAX', 'operator': 'DEFAULT', 'message': 'MAX 10', 'value': '10'}, {'type': 'MIN', 'operator': 'DEFAULT', 'message': 'MIN 1', 'value': '1'}]"
  },
  {
    "field_name": "Country",
    "validations": "[{'type': 'DEFAULT', 'operator': 'DEFAULT', 'message': '', 'value': 'VN'}, {'type': 'DISPLAYMODE', 'operator': 'DEFAULT', 'message': '', 'value': 'DISABLE'}]"
  }
]`}
        />
        {errors.validationConfigJson && (
          <Text variant="caption" color="error" className="mt-1">
            {errors.validationConfigJson}
          </Text>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 bg-white shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            {config ? "Edit Validation Config" : "Add Validation Config"}
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Configure field validation rules
          </Text>
        </div>
        <Button variant="ghost" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
          <TabPanel tabId="general" label="General">
            {renderGeneralTab()}
          </TabPanel>
          <TabPanel tabId="configuration" label="Configuration">
            {renderConfigurationTab()}
          </TabPanel>
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
  );
};

export default ValidationConfigPanel;
