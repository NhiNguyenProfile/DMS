import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Table from "../../../atoms/Table";
import IconButton from "../../../atoms/IconButton";
import { Plus, Edit, Trash2 } from "lucide-react";
import AutoFieldConfigPanel from "./AutoFieldConfigPanel";

// Sample auto field config data
const SAMPLE_AUTO_FIELD_CONFIG = [
  // Default Values - Multiple fields in one rule
  {
    id: 1,
    ruleName: "Default Values for Vietnamese Forms",
    ruleDescription:
      "Set default country, currency, and language for Vietnamese customers",
    status: "Active",
    type: "default",
    criteria: null,
    configuration: {
      type: "default",
      fields: [
        { fieldKey: "country", fieldName: "Country", value: "VN" },
        { fieldKey: "currency", fieldName: "Currency", value: "VND" },
        { fieldKey: "language", fieldName: "Language", value: "vi" },
        {
          fieldKey: "timezone",
          fieldName: "Timezone",
          value: "Asia/Ho_Chi_Minh",
        },
      ],
    },
  },
  {
    id: 2,
    ruleName: "Default Business Settings",
    ruleDescription:
      "Set default business-related fields for company registration",
    status: "Active",
    type: "default",
    criteria: null,
    configuration: {
      type: "default",
      fields: [
        {
          fieldKey: "businessType",
          fieldName: "Business Type",
          value: "Limited Company",
        },
        { fieldKey: "taxMethod", fieldName: "Tax Method", value: "Standard" },
        {
          fieldKey: "fiscalYear",
          fieldName: "Fiscal Year",
          value: "Calendar Year",
        },
      ],
    },
  },
  // Dependent Fields - Multiple fields based on criteria
  {
    id: 3,
    ruleName: "Vietnamese Location Auto-fill",
    ruleDescription:
      "Auto-fill region, city, and postal code when country is Vietnam",
    status: "Active",
    type: "dependent",
    criteria: {
      field: "country",
      operator: "==",
      value: "VN",
    },
    configuration: {
      type: "dependent",
      fields: [
        { fieldKey: "region", fieldName: "Region", value: "Miền Bắc" },
        { fieldKey: "city", fieldName: "City", value: "Hà Nội" },
        { fieldKey: "postalCode", fieldName: "Postal Code", value: "100000" },
        { fieldKey: "phonePrefix", fieldName: "Phone Prefix", value: "+84" },
      ],
    },
  },
  {
    id: 4,
    ruleName: "Individual Customer Settings",
    ruleDescription:
      "Auto-fill tax rate, discount, and payment terms for individual customers",
    status: "Active",
    type: "dependent",
    criteria: {
      and: [
        { field: "customerType", operator: "==", value: "Individual" },
        { field: "country", operator: "==", value: "VN" },
      ],
    },
    configuration: {
      type: "dependent",
      fields: [
        { fieldKey: "taxRate", fieldName: "Tax Rate", value: "10%" },
        { fieldKey: "discountRate", fieldName: "Discount Rate", value: "5%" },
        {
          fieldKey: "paymentTerms",
          fieldName: "Payment Terms",
          value: "30 days",
        },
        {
          fieldKey: "creditLimit",
          fieldName: "Credit Limit",
          value: "50000000",
        },
      ],
    },
  },
  {
    id: 5,
    ruleName: "Export Business Configuration",
    ruleDescription: "Auto-fill multiple fields for export businesses",
    status: "Active",
    type: "dependent",
    criteria: {
      or: [
        { field: "businessType", operator: "==", value: "Export" },
        {
          field: "customerCategory",
          operator: "in",
          value: ["Exporter", "International"],
        },
      ],
    },
    configuration: {
      type: "dependent",
      fields: [
        { fieldKey: "taxRate", fieldName: "Tax Rate", value: "0%" },
        { fieldKey: "currency", fieldName: "Currency", value: "USD" },
        {
          fieldKey: "paymentMethod",
          fieldName: "Payment Method",
          value: "Letter of Credit",
        },
        {
          fieldKey: "documentRequired",
          fieldName: "Document Required",
          value: "Export License",
        },
      ],
    },
  },
];

const AutoFieldConfig = ({ selectedEntity, selectedRequestType, disabled }) => {
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Load configs when entity/request type changes
  useEffect(() => {
    if (selectedEntity && selectedRequestType) {
      // Always show all sample configs for demo purposes
      setConfigs(SAMPLE_AUTO_FIELD_CONFIG);
    } else {
      // Show all configs even without selection for demo
      setConfigs(SAMPLE_AUTO_FIELD_CONFIG);
    }
  }, [selectedEntity, selectedRequestType]);

  const handleEditConfig = (config) => {
    setSelectedConfig(config);
    setShowConfigPanel(true);
  };

  const handleAddConfig = (type = "default") => {
    setSelectedConfig({ type });
    setShowConfigPanel(true);
  };

  const handleDeleteConfig = (configId) => {
    if (
      window.confirm("Are you sure you want to delete this auto-field config?")
    ) {
      setConfigs(configs.filter((c) => c.id !== configId));
    }
  };

  const handleClosePanel = () => {
    setShowConfigPanel(false);
    setSelectedConfig(null);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "default":
        return "Default Value";
      case "dependent":
        return "Dependent Field";
      default:
        return "Unknown";
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case "default":
        return "bg-blue-100 text-blue-800";
      case "dependent":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (disabled) {
    return (
      <div className="text-center py-12">
        <Text variant="body" color="muted">
          Please select Entity and Request Type to configure auto-field rules
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Auto-field Configuration
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Configure automatic field value assignment
          </Text>
        </div>
        <Button variant="primary" onClick={() => handleAddConfig()}>
          <Plus size={16} className="mr-2" />
          Add Auto-field Config
        </Button>
      </div>

      {/* Single Table for All Types */}
      <Table hover bordered>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Rule Name</Table.HeaderCell>
            <Table.HeaderCell>Rule Description</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {configs.map((config) => (
            <Table.Row key={config.id} hover>
              <Table.Cell>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${getTypeBadgeColor(
                    config.type
                  )}`}
                >
                  {getTypeLabel(config.type)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <Text
                  variant="body"
                  weight="medium"
                  className="max-w-xs truncate"
                >
                  {config.ruleName}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text
                  variant="body"
                  color="muted"
                  className="max-w-sm truncate"
                >
                  {config.ruleDescription}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    config.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {config.status}
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center space-x-2">
                  <IconButton
                    variant="icon"
                    color="blue"
                    size="small"
                    tooltip="Edit config"
                    onClick={() => handleEditConfig(config)}
                  >
                    <Edit size={14} />
                  </IconButton>
                  <IconButton
                    variant="icon"
                    color="red"
                    size="small"
                    tooltip="Delete config"
                    onClick={() => handleDeleteConfig(config.id)}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {configs.length === 0 && (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <Text variant="body" color="muted">
            No auto-field configurations found. Click "Add Auto-field Config" to
            get started.
          </Text>
        </div>
      )}

      {/* Config Panel (Slide-in) */}
      {showConfigPanel && (
        <AutoFieldConfigPanel
          config={selectedConfig}
          selectedEntity={selectedEntity}
          selectedRequestType={selectedRequestType}
          onClose={handleClosePanel}
          onSave={(configData) => {
            if (selectedConfig && selectedConfig.id) {
              // Update existing config
              setConfigs(
                configs.map((c) =>
                  c.id === selectedConfig.id ? { ...c, ...configData } : c
                )
              );
            } else {
              // Add new config
              const newConfig = {
                id: Date.now(),
                applied_entity: selectedEntity,
                applied_request_type: selectedRequestType,
                ...configData,
              };
              setConfigs([...configs, newConfig]);
            }
            handleClosePanel();
          }}
        />
      )}
    </div>
  );
};

export default AutoFieldConfig;
