import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Toggle from "../../../atoms/Toggle";
import Table from "../../../atoms/Table";
import { Search } from "lucide-react";

// Sample field data
const SAMPLE_FIELD_DATA = [
  { fieldKey: "taxCode", fieldName: "Mã số thuế", isApprovalRequired: true },
  { fieldKey: "email", fieldName: "Email", isApprovalRequired: false },
  {
    fieldKey: "phoneNumber",
    fieldName: "Số điện thoại",
    isApprovalRequired: false,
  },
  { fieldKey: "fullName", fieldName: "Họ và tên", isApprovalRequired: true },
  { fieldKey: "idNumber", fieldName: "Số CMND/CCCD", isApprovalRequired: true },
  { fieldKey: "address", fieldName: "Địa chỉ", isApprovalRequired: false },
  {
    fieldKey: "companyName",
    fieldName: "Tên công ty",
    isApprovalRequired: true,
  },
  {
    fieldKey: "businessLicense",
    fieldName: "Giấy phép kinh doanh",
    isApprovalRequired: true,
  },
  {
    fieldKey: "registeredCapital",
    fieldName: "Vốn điều lệ",
    isApprovalRequired: true,
  },
  {
    fieldKey: "accountNumber",
    fieldName: "Số tài khoản",
    isApprovalRequired: true,
  },
  { fieldKey: "amount", fieldName: "Số tiền", isApprovalRequired: true },
  { fieldKey: "currency", fieldName: "Tỷ giá", isApprovalRequired: false },
  {
    fieldKey: "transferNote",
    fieldName: "Ghi chú chuyển khoản",
    isApprovalRequired: false,
  },
  { fieldKey: "birthDate", fieldName: "Ngày sinh", isApprovalRequired: false },
  { fieldKey: "gender", fieldName: "Giới tính", isApprovalRequired: false },
  {
    fieldKey: "nationality",
    fieldName: "Quốc tịch",
    isApprovalRequired: false,
  },
  {
    fieldKey: "occupation",
    fieldName: "Nghề nghiệp",
    isApprovalRequired: false,
  },
  { fieldKey: "income", fieldName: "Thu nhập", isApprovalRequired: true },
  {
    fieldKey: "bankName",
    fieldName: "Tên ngân hàng",
    isApprovalRequired: false,
  },
  { fieldKey: "branchName", fieldName: "Chi nhánh", isApprovalRequired: false },
];

const FieldConfig = ({ selectedEntity, selectedRequestType, disabled }) => {
  const [fieldData, setFieldData] = useState(SAMPLE_FIELD_DATA);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Filter fields based on search term
  const filteredFields = fieldData.filter(
    (field) =>
      field.fieldKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.fieldName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditMode = () => {
    if (isEditMode) {
      // Save all changes
      setFieldData((prev) =>
        prev.map((field) => ({
          ...field,
          fieldName: editValues[field.fieldKey]?.fieldName || field.fieldName,
          isApprovalRequired:
            editValues[field.fieldKey]?.isApprovalRequired !== undefined
              ? editValues[field.fieldKey].isApprovalRequired
              : field.isApprovalRequired,
        }))
      );
      setEditValues({});
    } else {
      // Initialize edit values with current field data
      const initialValues = {};
      fieldData.forEach((field) => {
        initialValues[field.fieldKey] = {
          fieldName: field.fieldName,
          isApprovalRequired: field.isApprovalRequired,
        };
      });
      setEditValues(initialValues);
    }
    setIsEditMode(!isEditMode);
  };

  const handleFieldNameChange = (fieldKey, value) => {
    setEditValues((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        fieldName: value,
      },
    }));
  };

  const handleApprovalRequiredChange = (fieldKey, checked) => {
    setEditValues((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        isApprovalRequired: checked,
      },
    }));
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditValues({});
  };

  // Show content even if disabled for demo purposes
  // if (disabled) {
  //   return (
  //     <div className="text-center py-12">
  //       <Text variant="body" color="muted">
  //         Please select country and entity to configure field names
  //       </Text>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Form Configuration
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Configure display names for field keys
          </Text>
        </div>
        <div className="flex items-center space-x-3">
          {isEditMode && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant={isEditMode ? "primary" : "outline"}
            onClick={handleEditMode}
          >
            {isEditMode ? "Save Changes" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <Input
          placeholder="Search by field key or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Field Key</Table.HeaderCell>
              <Table.HeaderCell>Field Name</Table.HeaderCell>
              <Table.HeaderCell>Approval Required</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredFields.map((field) => (
              <Table.Row key={field.fieldKey}>
                <Table.Cell>
                  <Text
                    variant="body"
                    weight="medium"
                    className="font-mono text-sm"
                  >
                    {field.fieldKey}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  {isEditMode ? (
                    <Input
                      value={
                        editValues[field.fieldKey]?.fieldName || field.fieldName
                      }
                      onChange={(e) =>
                        handleFieldNameChange(field.fieldKey, e.target.value)
                      }
                      className="w-full"
                    />
                  ) : (
                    <Text variant="body">{field.fieldName}</Text>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {isEditMode ? (
                    <Toggle
                      checked={
                        editValues[field.fieldKey]?.isApprovalRequired !==
                        undefined
                          ? editValues[field.fieldKey].isApprovalRequired
                          : field.isApprovalRequired
                      }
                      onChange={(checked) =>
                        handleApprovalRequiredChange(field.fieldKey, checked)
                      }
                    />
                  ) : (
                    <Toggle
                      checked={field.isApprovalRequired}
                      disabled={true}
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Total fields: {filteredFields.length}
          {searchTerm && ` (filtered from ${fieldData.length})`}
        </Text>
      </div>
    </div>
  );
};

export default FieldConfig;
