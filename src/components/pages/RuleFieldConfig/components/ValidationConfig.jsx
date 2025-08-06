import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Table from "../../../atoms/Table";
import IconButton from "../../../atoms/IconButton";
import { Plus, Edit, Trash2 } from "lucide-react";
import ValidationConfigPanel from "./ValidationConfigPanel";

// Sample validation config data
const SAMPLE_VALIDATION_CONFIG = [
  {
    id: 1,
    ruleName: "Basic Field Validations",
    ruleDescription: "Validate tax code, email, age, and phone number formats",
    status: "Active",
    validationConfig: [
      {
        field_name: "CustomerType",
        validations:
          "[ { 'type': 'VALUE', 'operator': 'DEFAULT', 'message': '', 'value': 'A,B,C'}, { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'bắt buộc điền', 'value': 'true'} ]",
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
          "[ {'type': 'DEFAULT', 'operator': 'DEFAULT', 'message': '', 'value': 'VN'}, {'type': 'DEFAULT', 'operator': 'DEFAULT', 'message': '', 'value': 'VN'}, {'type': 'DISPLAYMODE', 'operator': 'DEFAULT', 'message': '', 'value': 'DISABLE'}]",
      },
    ],
  },
  {
    id: 2,
    ruleName: "Customer Registration Validations",
    ruleDescription: "Validation rules for customer registration form",
    status: "Active",
    validationConfig: [
      {
        field_name: "FullName",
        validations:
          "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'Họ tên là bắt buộc', 'value': 'true'}, { 'type': 'MINLENGTH', 'operator': 'DEFAULT', 'message': 'Họ tên phải có ít nhất 2 ký tự', 'value': '2'}, { 'type': 'MAXLENGTH', 'operator': 'DEFAULT', 'message': 'Họ tên không được quá 50 ký tự', 'value': '50'} ]",
      },
      {
        field_name: "IdNumber",
        validations:
          "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'Số CMND/CCCD là bắt buộc', 'value': 'true'}, { 'type': 'REGEX', 'operator': 'DEFAULT', 'message': 'Số CMND/CCCD không hợp lệ', 'value': '^[0-9]{9,12}$'} ]",
      },
      {
        field_name: "Address",
        validations:
          "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'Địa chỉ là bắt buộc', 'value': 'true'}, { 'type': 'MINLENGTH', 'operator': 'DEFAULT', 'message': 'Địa chỉ phải có ít nhất 10 ký tự', 'value': '10'} ]",
      },
    ],
  },
  {
    id: 3,
    ruleName: "Business Registration Validations",
    ruleDescription: "Validation rules for business entity registration",
    status: "Active",
    validationConfig: [
      {
        field_name: "CompanyName",
        validations:
          "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'Tên công ty là bắt buộc', 'value': 'true'}, { 'type': 'MINLENGTH', 'operator': 'DEFAULT', 'message': 'Tên công ty phải có ít nhất 5 ký tự', 'value': '5'} ]",
      },
      {
        field_name: "BusinessLicense",
        validations:
          "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'Giấy phép kinh doanh là bắt buộc', 'value': 'true'}, { 'type': 'REGEX', 'operator': 'DEFAULT', 'message': 'Số giấy phép không hợp lệ', 'value': '^[0-9]{10,13}$'} ]",
      },
      {
        field_name: "RegisteredCapital",
        validations:
          "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'Vốn điều lệ là bắt buộc', 'value': 'true'}, { 'type': 'MIN', 'operator': 'DEFAULT', 'message': 'Vốn điều lệ tối thiểu 15 triệu VND', 'value': '15000000'} ]",
      },
    ],
  },
  {
    id: 4,
    ruleName: "Financial Form Validations",
    ruleDescription: "Validation rules for financial and payment forms",
    status: "Inactive",
    validationConfig: [
      {
        field_name: "AccountNumber",
        validations:
          "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'Số tài khoản là bắt buộc', 'value': 'true'}, { 'type': 'REGEX', 'operator': 'DEFAULT', 'message': 'Số tài khoản không hợp lệ', 'value': '^[0-9]{8,16}$'} ]",
      },
      {
        field_name: "Amount",
        validations:
          "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'Số tiền là bắt buộc', 'value': 'true'}, { 'type': 'MIN', 'operator': 'DEFAULT', 'message': 'Số tiền tối thiểu 10,000 VND', 'value': '10000'}, { 'type': 'MAX', 'operator': 'DEFAULT', 'message': 'Số tiền tối đa 500,000,000 VND', 'value': '500000000'} ]",
      },
      {
        field_name: "TransferNote",
        validations:
          "[ { 'type': 'MAXLENGTH', 'operator': 'DEFAULT', 'message': 'Ghi chú không được quá 200 ký tự', 'value': '200'} ]",
      },
    ],
  },
];

// Sample validation config data - Updated to new format
const SAMPLE_VALIDATION_CONFIG_OLD = [
  {
    field_name: "CustomerType",
    field_name_display: "Customer Type",
    validations:
      "[ { 'type': 'VALUE', 'operator': 'DEFAULT', 'message': '', 'value': 'A,B,C'}, { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'bắt buộc điền', 'value': 'true'} ]",
  },
  {
    field_name: "Organizationname",
    field_name_display: "Organization Name",
    validations:
      "[ { 'type': 'REQUIRE', 'operator': 'DEFAULT', 'message': 'bắt buộc điền', 'value': 'true'},{ 'type': 'MAXLENGTH', 'operator': 'DEFAULT', 'message': 'tối đa 10 ký tự', 'value': '10'} ]",
  },
  {
    field_name: "Salary",
    field_name_display: "Salary",
    validations:
      "[ {'type': 'MAX', 'operator': 'DEFAULT', 'message': 'MAX 10', 'value': '10'}, {'type': 'MIN', 'operator': 'DEFAULT', 'message': 'MIN 1', 'value': '1'}]",
  },
  {
    field_name: "Country",
    field_name_display: "Country",
    validations:
      "[ {'type': 'DEFAULT', 'operator': 'DEFAULT', 'message': '', 'value': 'VN'}, {'type': 'DEFAULT', 'operator': 'DEFAULT', 'message': '', 'value': 'VN'}, {'type': 'DISPLAYMODE', 'operator': 'DEFAULT', 'message': '', 'value': 'DISABLE'}]",
  },
];

const ValidationConfig = ({
  selectedEntity,
  selectedRequestType,
  disabled,
}) => {
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Load configs when entity/request type changes
  useEffect(() => {
    // Always load sample configs for demo purposes
    setConfigs(SAMPLE_VALIDATION_CONFIG);
  }, [selectedEntity, selectedRequestType]);

  const handleEditConfig = (config) => {
    setSelectedConfig(config);
    setShowConfigPanel(true);
  };

  const handleAddConfig = () => {
    setSelectedConfig(null);
    setShowConfigPanel(true);
  };

  const handleDeleteConfig = (configId) => {
    if (
      window.confirm("Are you sure you want to delete this validation config?")
    ) {
      setConfigs(configs.filter((c) => c.id !== configId));
    }
  };

  const handleClosePanel = () => {
    setShowConfigPanel(false);
    setSelectedConfig(null);
  };

  if (disabled) {
    return (
      <div className="text-center py-12">
        <Text variant="body" color="muted">
          Please select Entity and Request Type to configure validation rules
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
            Validation Configuration
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Configure data validation rules for form fields
          </Text>
        </div>
        <Button variant="primary" onClick={handleAddConfig}>
          <Plus size={16} className="mr-2" />
          Add Validation Config
        </Button>
      </div>

      {/* Configs Table */}
      <Table hover bordered>
        <Table.Header>
          <Table.Row>
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
            No validation configurations found. Click "Add Validation Config" to
            get started.
          </Text>
        </div>
      )}

      {/* Config Panel (Slide-in) */}
      {showConfigPanel && (
        <ValidationConfigPanel
          config={selectedConfig}
          selectedEntity={selectedEntity}
          selectedRequestType={selectedRequestType}
          onClose={handleClosePanel}
          onSave={(configData) => {
            if (selectedConfig) {
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

export default ValidationConfig;
