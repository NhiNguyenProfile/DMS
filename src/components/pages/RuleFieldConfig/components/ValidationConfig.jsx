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
        fieldKey: "taxCode",
        validations: [
          { type: "required", message: "Trường này là bắt buộc" },
          {
            type: "regex",
            pattern: "^[0-9]{10}$",
            message: "Mã số thuế phải gồm đúng 10 chữ số",
          },
        ],
      },
      {
        fieldKey: "email",
        validations: [
          { type: "required", message: "Vui lòng nhập email" },
          {
            type: "regex",
            pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
            message: "Email không đúng định dạng",
          },
        ],
      },
      {
        fieldKey: "age",
        validations: [
          { type: "required" },
          { type: "min", value: 18, message: "Tuổi tối thiểu là 18" },
          { type: "max", value: 65, message: "Tuổi tối đa là 65" },
        ],
      },
      {
        fieldKey: "phoneNumber",
        validations: [
          {
            type: "regex",
            pattern: "^0\\d{9}$",
            message: "Số điện thoại không hợp lệ",
          },
        ],
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
        fieldKey: "fullName",
        validations: [
          { type: "required", message: "Họ tên là bắt buộc" },
          {
            type: "minLength",
            value: 2,
            message: "Họ tên phải có ít nhất 2 ký tự",
          },
          {
            type: "maxLength",
            value: 50,
            message: "Họ tên không được quá 50 ký tự",
          },
        ],
      },
      {
        fieldKey: "idNumber",
        validations: [
          { type: "required", message: "Số CMND/CCCD là bắt buộc" },
          {
            type: "regex",
            pattern: "^[0-9]{9,12}$",
            message: "Số CMND/CCCD không hợp lệ",
          },
        ],
      },
      {
        fieldKey: "address",
        validations: [
          { type: "required", message: "Địa chỉ là bắt buộc" },
          {
            type: "minLength",
            value: 10,
            message: "Địa chỉ phải có ít nhất 10 ký tự",
          },
        ],
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
        fieldKey: "companyName",
        validations: [
          { type: "required", message: "Tên công ty là bắt buộc" },
          {
            type: "minLength",
            value: 5,
            message: "Tên công ty phải có ít nhất 5 ký tự",
          },
        ],
      },
      {
        fieldKey: "businessLicense",
        validations: [
          { type: "required", message: "Giấy phép kinh doanh là bắt buộc" },
          {
            type: "regex",
            pattern: "^[0-9]{10,13}$",
            message: "Số giấy phép không hợp lệ",
          },
        ],
      },
      {
        fieldKey: "registeredCapital",
        validations: [
          { type: "required", message: "Vốn điều lệ là bắt buộc" },
          {
            type: "min",
            value: 15000000,
            message: "Vốn điều lệ tối thiểu 15 triệu VND",
          },
        ],
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
        fieldKey: "accountNumber",
        validations: [
          { type: "required", message: "Số tài khoản là bắt buộc" },
          {
            type: "regex",
            pattern: "^[0-9]{8,16}$",
            message: "Số tài khoản không hợp lệ",
          },
        ],
      },
      {
        fieldKey: "amount",
        validations: [
          { type: "required", message: "Số tiền là bắt buộc" },
          {
            type: "min",
            value: 10000,
            message: "Số tiền tối thiểu 10,000 VND",
          },
          {
            type: "max",
            value: 500000000,
            message: "Số tiền tối đa 500,000,000 VND",
          },
        ],
      },
      {
        fieldKey: "transferNote",
        validations: [
          {
            type: "maxLength",
            value: 200,
            message: "Ghi chú không được quá 200 ký tự",
          },
        ],
      },
    ],
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
    if (selectedEntity && selectedRequestType) {
      // Filter configs by entity and request type
      const filteredConfigs = SAMPLE_VALIDATION_CONFIG.filter(
        (config) =>
          config.applied_entity === selectedEntity || !config.applied_entity
      );
      setConfigs(filteredConfigs);
    }
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
