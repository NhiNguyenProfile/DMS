import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import MultiSelect from "../../../atoms/MultiSelect";
import Table from "../../../atoms/Table";
import Modal from "../../../atoms/Modal";
import { Search as SearchIcon, Plus, Edit, Trash2, Eye } from "lucide-react";

// Entities dropdown options
const ENTITIES = [
  { value: "Customer", label: "Customer" },
  { value: "Spare Part", label: "Spare Part" },
];

// Entity-specific sessions and field groups
const ENTITY_SESSIONS = {
  Customer: {
    Commerce: ["Loyalty Enrollment", "Privacy", "Receipt", "Retail"],
    "Credit and collections": [
      "Collection letter",
      "Collections",
      "Credit review",
      "Eligible credit limit",
      "General",
      "Notes",
      "Risk",
      "Status",
      "Total credit limit",
    ],
    "Direct debit mandates": [
      "Bank account",
      "Expiration",
      "Identification",
      "Mandate payments",
      "Mandate scheme",
      "Signature",
      "Timing",
    ],
    "Direct debit mandates - Table": ["Identification"],
    "Financial dimensions": ["Default financial dimensions"],
    General: [
      "Customer",
      "Organization details",
      "Other information",
      "Address",
      "Contact information",
      "Sites",
    ],
    "Invoice and delivery": [
      "Delivery",
      "E-Invoice",
      "Freight",
      "Indonesian tax",
      "Packing material fee",
      "Sales tax",
      "VAS E-invoice",
      "VAT Information",
    ],
    "Miscellaneous details": [
      "Automatic notification and cancelation processing",
      "Customer self-service",
      "Government identification",
      "Intercompany",
      "Remittance",
    ],
    "Payment defaults": [
      "Check holds",
      "Notification to the central bank",
      "Payment",
      "Prepayment",
    ],
    "Sales demographics": ["Marketing"],
    "Sales other defaults": [
      "Advanced notes",
      "Allocation",
      "Discount",
      "Groups",
      "Sales order",
    ],
    Transportation: ["Bill of lading"],
    Warehouse: ["ASN", "Release to warehouse", "Shipment Processing"],
  },
  "Spare Part": {
    General: ["Administration"],
    Purchase: ["Administration", "Item Quality"],
    Sell: ["Alternative product", "Installments"],
    "Manage inventory": ["Potency", "Item data", "Catch weight"],
    Engineer: ["BOM or formula", "Measurement"],
    Warehouse: [
      "Physical dimension",
      "Description",
      "Product filter codes",
      "Grouping of filter codes",
      "Production",
      "National Motor Freight Classification",
      "Additional codes",
      "Release to warehouse",
      "Batch details",
    ],
    Commerce: ["Bar code"],
    "Product variants": ["Default product variant"],
  },
};

// Level options for each field group
const LEVEL_OPTIONS = [
  { value: "None", label: "None" },
  { value: "View", label: "View" },
  { value: "Edit", label: "Edit" },
];

// Sample privileges data
const SAMPLE_PRIVILEGES = [
  {
    id: 1,
    privilegeName: "Customer_Basic_Access",
    entity: "Customer",
    sessionFieldLevels: {
      General: {
        Customer: "View",
        Address: "Edit",
        "Contact information": "View",
      },
      Commerce: {
        Privacy: "View",
        Receipt: "None",
      },
    },
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    privilegeName: "Customer_Full_Access",
    entity: "Customer",
    sessionFieldLevels: {
      General: {
        Customer: "Edit",
        Address: "Edit",
        "Contact information": "Edit",
      },
      "Invoice and delivery": {
        Delivery: "Edit",
        "E-Invoice": "View",
      },
    },
    createdAt: "2025-01-15T11:00:00Z",
    updatedAt: "2025-01-15T11:00:00Z",
  },
  {
    id: 3,
    privilegeName: "SparePart_Limited",
    entity: "Spare Part",
    sessionFieldLevels: {
      General: {
        Administration: "View",
      },
      Purchase: {
        Administration: "Edit",
        "Item Quality": "View",
      },
    },
    createdAt: "2025-01-15T11:30:00Z",
    updatedAt: "2025-01-15T11:30:00Z",
  },
];

const PrivilegeConfig = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [privileges, setPrivileges] = useState(SAMPLE_PRIVILEGES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrivilege, setEditingPrivilege] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState({
    privilegeName: "",
    entity: "",
    sessionFieldLevels: {},
  });
  const [errors, setErrors] = useState({});

  // Filter privileges based on search
  const filteredPrivileges = privileges.filter((privilege) => {
    const matchesSearch =
      privilege.privilegeName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      privilege.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.keys(privilege.sessionFieldLevels || {}).some((session) =>
        session.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      Object.values(privilege.sessionFieldLevels || {}).some(
        (fields) =>
          Object.keys(fields).some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          Object.values(fields).some((level) =>
            level.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );

    return matchesSearch;
  });

  const handleAddPrivilege = () => {
    setEditingPrivilege(null);
    setFormData({
      privilegeName: "",
      entity: "",
      sessionFieldLevels: {},
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleEditPrivilege = (privilege) => {
    setEditingPrivilege(privilege);
    setFormData({
      privilegeName: privilege.privilegeName,
      entity: privilege.entity,
      sessionFieldLevels: privilege.sessionFieldLevels || {},
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleDeletePrivilege = (privilegeId) => {
    if (window.confirm("Are you sure you want to delete this privilege?")) {
      setPrivileges((prev) =>
        prev.filter((privilege) => privilege.id !== privilegeId)
      );
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFieldLevelChange = (session, field, level) => {
    setFormData((prev) => ({
      ...prev,
      sessionFieldLevels: {
        ...prev.sessionFieldLevels,
        [session]: {
          ...prev.sessionFieldLevels[session],
          [field]: level,
        },
      },
    }));
  };

  // Initialize session field levels when entity changes
  const handleEntityChange = (entity) => {
    const initialSessionFieldLevels = {};
    const entitySessions = ENTITY_SESSIONS[entity] || {};

    Object.keys(entitySessions).forEach((session) => {
      initialSessionFieldLevels[session] = {};
      entitySessions[session].forEach((field) => {
        initialSessionFieldLevels[session][field] = "None";
      });
    });

    setFormData((prev) => ({
      ...prev,
      entity: entity,
      sessionFieldLevels: initialSessionFieldLevels,
    }));

    if (errors.entity) {
      setErrors((prev) => ({
        ...prev,
        entity: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.privilegeName.trim()) {
      newErrors.privilegeName = "Privilege name is required";
    } else {
      // Check for duplicate privilege name (excluding current editing privilege)
      const isDuplicate = privileges.some(
        (privilege) =>
          privilege.privilegeName.toLowerCase() ===
            formData.privilegeName.toLowerCase() &&
          (!editingPrivilege || privilege.id !== editingPrivilege.id)
      );
      if (isDuplicate) {
        newErrors.privilegeName = "Privilege name already exists. Try another.";
      }
    }

    if (!formData.entity) {
      newErrors.entity = "Entity is required";
    }

    // Check if at least one field has a level other than "None"
    const hasActiveFields = Object.values(formData.sessionFieldLevels).some(
      (sessionFields) =>
        Object.values(sessionFields).some((level) => level !== "None")
    );
    if (!hasActiveFields) {
      newErrors.sessionFieldLevels =
        "At least one field must have View or Edit level";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const privilegeData = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    if (editingPrivilege) {
      setPrivileges((prev) =>
        prev.map((privilege) =>
          privilege.id === editingPrivilege.id
            ? { ...privilege, ...privilegeData }
            : privilege
        )
      );
    } else {
      const newPrivilege = {
        id: Date.now(),
        ...privilegeData,
        createdAt: new Date().toISOString(),
      };
      setPrivileges((prev) => [...prev, newPrivilege]);
    }

    setShowAddModal(false);
  };

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  const getSessionFieldLevelsDisplay = (sessionFieldLevels) => {
    if (!sessionFieldLevels || Object.keys(sessionFieldLevels).length === 0)
      return "No levels set";

    const activeLevels = [];
    Object.entries(sessionFieldLevels).forEach(([session, fields]) => {
      Object.entries(fields).forEach(([field, level]) => {
        if (level !== "None") {
          activeLevels.push(`${session} - ${field}: ${level}`);
        }
      });
    });

    if (activeLevels.length === 0) return "All fields: None";

    return (
      activeLevels.slice(0, 2).join(", ") +
      (activeLevels.length > 2 ? ` +${activeLevels.length - 2} more` : "")
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Privilege Configuration
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Configure privileges for entities and actions (Level 1)
          </Text>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePreview}>
            <Eye size={16} className="mr-2" />
            Preview
          </Button>
          <Button onClick={handleAddPrivilege}>
            <Plus size={16} className="mr-2" />
            Add Privilege
          </Button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white border-gray-200">
        <div className="relative max-w-md">
          <SearchIcon
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search privileges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Privileges Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Privilege Name</Table.HeaderCell>
              <Table.HeaderCell>Entity</Table.HeaderCell>
              <Table.HeaderCell>Session - Field Levels</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredPrivileges.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan="4" className="text-center py-8">
                  <Text variant="body" color="muted">
                    {searchTerm
                      ? "No privileges found matching your search"
                      : "No privileges configured yet"}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredPrivileges.map((privilege) => (
                <Table.Row key={privilege.id} className="hover:bg-gray-50">
                  <Table.Cell>
                    <Text variant="body" weight="medium">
                      {privilege.privilegeName}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{privilege.entity}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="max-w-xs truncate">
                      {getSessionFieldLevelsDisplay(
                        privilege.sessionFieldLevels
                      )}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleEditPrivilege(privilege)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleDeletePrivilege(privilege.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredPrivileges.length} of {privileges.length} privileges
        </Text>
      </div>

      {/* Add/Edit Privilege Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingPrivilege ? "Edit Privilege" : "Add New Privilege"}
        size="large"
      >
        <div className="space-y-6">
          <Text variant="body" color="muted">
            {editingPrivilege
              ? "Update privilege configuration"
              : "Configure a new privilege for entity access control"}
          </Text>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text variant="body" weight="medium" className="mb-2">
                  Privilege Name *
                </Text>
                <Input
                  value={formData.privilegeName}
                  onChange={(e) =>
                    handleInputChange("privilegeName", e.target.value)
                  }
                  placeholder="e.g., Customer_Basic_Access"
                  error={!!errors.privilegeName}
                />
                {errors.privilegeName && (
                  <Text variant="caption" color="error" className="mt-1">
                    {errors.privilegeName}
                  </Text>
                )}
              </div>

              <div>
                <Text variant="body" weight="medium" className="mb-2">
                  Entity *
                </Text>
                <Select
                  value={formData.entity}
                  onChange={handleEntityChange}
                  options={ENTITIES}
                  placeholder="Select entity"
                  error={!!errors.entity}
                />
                {errors.entity && (
                  <Text variant="caption" color="error" className="mt-1">
                    {errors.entity}
                  </Text>
                )}
              </div>
            </div>

            {/* Session Field Levels Table */}
            {formData.entity && (
              <div>
                <Text variant="body" weight="medium" className="mb-3">
                  Sessions & Field Levels *
                </Text>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Session</Table.HeaderCell>
                        <Table.HeaderCell>Field Group</Table.HeaderCell>
                        <Table.HeaderCell>Level</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {Object.entries(
                        ENTITY_SESSIONS[formData.entity] || {}
                      ).map(([session, fields]) =>
                        fields.map((field, fieldIndex) => (
                          <Table.Row key={`${session}_${field}`}>
                            {fieldIndex === 0 && (
                              <Table.Cell rowSpan={fields.length}>
                                <Text
                                  variant="body"
                                  weight="medium"
                                  className="text-blue-700"
                                >
                                  {session}
                                </Text>
                              </Table.Cell>
                            )}
                            <Table.Cell>
                              <Text variant="body" className="text-sm">
                                {field}
                              </Text>
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex gap-4">
                                {LEVEL_OPTIONS.map((level) => (
                                  <label
                                    key={level.value}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <input
                                      type="radio"
                                      name={`level_${session}_${field}`}
                                      value={level.value}
                                      checked={
                                        formData.sessionFieldLevels[session]?.[
                                          field
                                        ] === level.value
                                      }
                                      onChange={() =>
                                        handleFieldLevelChange(
                                          session,
                                          field,
                                          level.value
                                        )
                                      }
                                      className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <Text variant="body" className="text-sm">
                                      {level.label}
                                    </Text>
                                  </label>
                                ))}
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      )}
                    </Table.Body>
                  </Table>
                </div>
                {errors.sessionFieldLevels && (
                  <Text variant="caption" color="error" className="mt-1">
                    {errors.sessionFieldLevels}
                  </Text>
                )}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingPrivilege ? "Save Changes" : "Save Privilege"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Privilege Preview - Customer Form"
        size="large"
      >
        <div className="space-y-6">
          <Text variant="body" color="muted">
            Preview how privileges apply to the Customer form
          </Text>

          <div className="bg-gray-50 rounded-lg p-6">
            <Text variant="body" weight="medium" className="mb-4">
              Customer Form Preview
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* General Fields */}
              <div className="space-y-3">
                <Text
                  variant="body"
                  weight="medium"
                  className="text-sm text-gray-700"
                >
                  General Information
                </Text>
                <div className="space-y-2">
                  <Input placeholder="Customer Name" disabled />
                  <Input placeholder="Customer Code" disabled />
                  <Input placeholder="Phone Number" disabled />
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-3">
                <Text
                  variant="body"
                  weight="medium"
                  className="text-sm text-gray-700"
                >
                  Address Information
                </Text>
                <div className="space-y-2">
                  <Input placeholder="Street Address" disabled />
                  <Input placeholder="City" disabled />
                  <Input placeholder="Postal Code" disabled />
                </div>
              </div>

              {/* Invoice and Delivery Fields */}
              <div className="space-y-3 md:col-span-2">
                <Text
                  variant="body"
                  weight="medium"
                  className="text-sm text-gray-700"
                >
                  Invoice and Delivery
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input placeholder="Invoice Address" disabled />
                  <Input placeholder="Delivery Address" disabled />
                  <Input placeholder="Payment Terms" disabled />
                  <Input placeholder="Delivery Method" disabled />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <Text
                variant="body"
                weight="medium"
                className="text-blue-800 mb-2"
              >
                Applied Privileges:
              </Text>
              <div className="space-y-1">
                {privileges.map((privilege) => (
                  <Text
                    key={privilege.id}
                    variant="caption"
                    className="text-blue-700"
                  >
                    • {privilege.privilegeName} ({privilege.entity}):{" "}
                    {getSessionFieldLevelsDisplay(privilege.sessionFieldLevels)}
                  </Text>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowPreviewModal(false)}
            >
              Close Preview
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PrivilegeConfig;
