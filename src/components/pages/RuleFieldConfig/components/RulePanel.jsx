import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import Toggle from "../../../atoms/Toggle";
import Tabs from "../../../atoms/Tabs";
import {
  X,
  Save,
  RotateCcw,
  Check,
  Settings,
  Target,
  Wrench,
} from "lucide-react";
import { RULE_STATUS, JSON_TEMPLATES } from "../../../../constants";
import JSONEditor from "./JSONEditor";

const RulePanel = ({
  rule,
  selectedEntity,
  selectedRequestType,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    rule_name: "",
    rule_description: "",
    status: "Active",
    criteria: JSON.stringify(JSON_TEMPLATES.criteria, null, 2),
    configuration: JSON.stringify(JSON_TEMPLATES.configuration, null, 2),
  });

  const [activeTab, setActiveTab] = useState("general");
  const [errors, setErrors] = useState({});

  // Load rule data when editing
  useEffect(() => {
    if (rule) {
      setFormData({
        rule_name: rule.rule_name || "",
        rule_description: rule.rule_description || "",
        status: rule.status || "Active",
        criteria: JSON.stringify(
          rule.criteria || JSON_TEMPLATES.criteria,
          null,
          2
        ),
        configuration: JSON.stringify(
          rule.configuration || JSON_TEMPLATES.configuration,
          null,
          2
        ),
      });
    }
  }, [rule]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rule_name.trim()) {
      newErrors.rule_name = "Rule name is required";
    }

    try {
      JSON.parse(formData.criteria);
    } catch (e) {
      newErrors.criteria = "Invalid JSON format";
    }

    try {
      JSON.parse(formData.configuration);
    } catch (e) {
      newErrors.configuration = "Invalid JSON format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const saveData = {
        ...formData,
        criteria: JSON.parse(formData.criteria),
        configuration: JSON.parse(formData.configuration),
      };
      onSave(saveData);
    }
  };

  const loadTemplate = (type) => {
    const template = JSON_TEMPLATES[type];
    handleInputChange(type, JSON.stringify(template, null, 2));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-1/2 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Text variant="heading" size="lg" weight="semibold">
            {rule ? "Edit Rule" : "Add New Rule"}
          </Text>
          <Button variant="ghost" size="small" onClick={onClose}>
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
              <div className="p-6 space-y-4">
                <div>
                  <Text variant="body" weight="medium" className="mb-2">
                    Rule Name *
                  </Text>
                  <Input
                    value={formData.rule_name}
                    onChange={(e) =>
                      handleInputChange("rule_name", e.target.value)
                    }
                    placeholder="Enter rule name"
                    error={!!errors.rule_name}
                  />
                  {errors.rule_name && (
                    <Text variant="caption" color="error" className="mt-1">
                      {errors.rule_name}
                    </Text>
                  )}
                </div>

                <div>
                  <Text variant="body" weight="medium" className="mb-2">
                    Rule Description
                  </Text>
                  <textarea
                    value={formData.rule_description}
                    onChange={(e) =>
                      handleInputChange("rule_description", e.target.value)
                    }
                    placeholder="Enter rule description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <Text variant="body" weight="medium" className="mb-2">
                    Applied Request Type
                  </Text>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                    {selectedRequestType}
                  </div>
                </div>

                <div>
                  <Text variant="body" weight="medium" className="mb-2">
                    Status
                  </Text>
                  <Select
                    options={RULE_STATUS}
                    value={formData.status}
                    onChange={(value) => handleInputChange("status", value)}
                  />
                </div>
              </div>
            </Tabs.Panel>

            <Tabs.Panel
              tabId="criteria"
              label="Criteria"
              icon={<Target size={16} />}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Text variant="body" weight="medium">
                    Criteria Configuration
                  </Text>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => loadTemplate("criteria")}
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Load Template
                  </Button>
                </div>

                <Text variant="caption" color="muted" className="mb-4 block">
                  Define conditions under which this rule applies. Example:{" "}
                  {`[{"field_name": "level", "operator": "IN", "values": ["L1", "L2"]}]`}
                </Text>

                <JSONEditor
                  value={formData.criteria}
                  onChange={(value) => handleInputChange("criteria", value)}
                  error={errors.criteria}
                />
              </div>
            </Tabs.Panel>

            <Tabs.Panel
              tabId="configuration"
              label="Configuration"
              icon={<Wrench size={16} />}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Text variant="body" weight="medium">
                    Validation Configuration
                  </Text>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => loadTemplate("configuration")}
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Load Template
                  </Button>
                </div>

                <Text variant="caption" color="muted" className="mb-4 block">
                  Define validation logic for each field. Each object:
                  field_name, operator, value, message.
                </Text>

                <JSONEditor
                  value={formData.configuration}
                  onChange={(value) =>
                    handleInputChange("configuration", value)
                  }
                  error={errors.configuration}
                />
              </div>
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
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RulePanel;
