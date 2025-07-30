import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import MultiSelect from "../../../atoms/MultiSelect";
import Table from "../../../atoms/Table";
import Modal from "../../../atoms/Modal";
import { Search as SearchIcon, Plus, Edit, Trash2 } from "lucide-react";
import { ROLES } from "../../../../constants";

// Sample legal entities
const LEGAL_ENTITIES = [
  { value: "DHV", label: "DHV" },
  { value: "DHBH", label: "DHBH" },
  { value: "DHHP", label: "DHHP" },
  { value: "DHHY", label: "DHHY" },
  { value: "DHGC", label: "DHGC" },
  { value: "DHGD", label: "DHGD" },
];

// Available tabs for role permissions (matching sidebar tabs)
const AVAILABLE_TABS = [
  { value: "my-request", label: "My Request" },
  { value: "approval", label: "Approval" },
  { value: "search", label: "Search" },
  { value: "rule-field-config", label: "Rule Field Config" },
  { value: "workflows", label: "Workflows" },
  { value: "permissions", label: "Permissions" },
  { value: "master-data", label: "Master Data" },
];

// Roles by Legal Entity (mock data)
const ROLES_BY_LEGAL_ENTITY = {
  DHV: [
    { value: "all", label: "All Departments" },
    { value: "sales", label: "Sales Department" },
    { value: "credit", label: "Credit Department" },
    { value: "legal", label: "Legal Department" },
    { value: "operations", label: "Operations Department" },
  ],
  DHBH: [
    { value: "all", label: "All Departments" },
    { value: "retail", label: "Retail Banking" },
    { value: "corporate", label: "Corporate Banking" },
    { value: "risk", label: "Risk Management" },
  ],
  DHHP: [
    { value: "all", label: "All Departments" },
    { value: "investment", label: "Investment Department" },
    { value: "advisory", label: "Advisory Department" },
    { value: "research", label: "Research Department" },
  ],
  DHHY: [
    { value: "all", label: "All Departments" },
    { value: "underwriting", label: "Underwriting" },
    { value: "claims", label: "Claims Department" },
    { value: "actuarial", label: "Actuarial Department" },
  ],
  DHGC: [
    { value: "all", label: "All Departments" },
    { value: "trading", label: "Trading Department" },
    { value: "settlement", label: "Settlement Department" },
  ],
  DHGD: [
    { value: "all", label: "All Departments" },
    { value: "education", label: "Education Department" },
    { value: "training", label: "Training Department" },
  ],
};

// Sample role permissions data
const SAMPLE_ROLE_PERMISSIONS = [
  {
    id: 1,
    role: "Sale Admin",
    legalEntity: "DHV",
    departments: ["sales", "operations"],
    accessibleTabs: ["my-request", "approval", "search", "rule-field-config"],
    userCount: 5,
    status: "Active",
  },
  {
    id: 2,
    role: "Credit Officer",
    legalEntity: "DHBH",
    departments: ["retail", "corporate"],
    accessibleTabs: ["my-request", "approval", "search"],
    userCount: 3,
    status: "Active",
  },
  {
    id: 3,
    role: "Manager",
    legalEntity: "DHHP",
    departments: ["all"],
    accessibleTabs: ["my-request", "approval", "search", "workflows"],
    userCount: 2,
    status: "Active",
  },
  {
    id: 4,
    role: "Legal",
    legalEntity: "DHV",
    departments: ["legal"],
    accessibleTabs: ["approval", "search"],
    userCount: 1,
    status: "Inactive",
  },
];

const RolePermissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLegalEntity, setSelectedLegalEntity] = useState("");
  const [rolePermissions, setRolePermissions] = useState(
    SAMPLE_ROLE_PERMISSIONS
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    legalEntity: "",
    departments: ["all"], // Default to "All Departments"
    accessibleTabs: [],
    status: "Active",
  });
  const [errors, setErrors] = useState({});

  // Filter permissions based on search and legal entity
  const filteredPermissions = rolePermissions.filter((permission) => {
    const matchesSearch = permission.role
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesLegalEntity =
      !selectedLegalEntity || permission.legalEntity === selectedLegalEntity;

    return matchesSearch && matchesLegalEntity;
  });

  const handleAddRole = () => {
    setEditingRole(null);
    setFormData({
      legalEntity: "",
      departments: ["all"],
      accessibleTabs: [],
      status: "Active",
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      legalEntity: role.legalEntity,
      departments: role.departments || ["all"],
      accessibleTabs: role.accessibleTabs,
      status: role.status,
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleDeleteRole = (roleId) => {
    setRolePermissions((prev) => prev.filter((role) => role.id !== roleId));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleLegalEntityChange = (legalEntity) => {
    setFormData((prev) => ({
      ...prev,
      legalEntity: legalEntity,
      departments: ["all"], // Reset to "All" when legal entity changes
    }));
    // Clear error
    if (errors.legalEntity) {
      setErrors((prev) => ({
        ...prev,
        legalEntity: "",
      }));
    }
  };

  const getAvailableDepartments = () => {
    if (!formData.legalEntity) return [];
    return ROLES_BY_LEGAL_ENTITY[formData.legalEntity] || [];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.legalEntity) {
      newErrors.legalEntity = "Legal entity is required";
    }

    if (formData.departments.length === 0) {
      newErrors.departments = "At least one department must be selected";
    }

    if (formData.accessibleTabs.length === 0) {
      newErrors.accessibleTabs = "At least one tab must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRole = () => {
    if (validateForm()) {
      if (editingRole) {
        // Update existing role
        setRolePermissions((prev) =>
          prev.map((role) =>
            role.id === editingRole.id ? { ...role, ...formData } : role
          )
        );
      } else {
        // Add new role
        const newRole = {
          id: Date.now(),
          ...formData,
        };
        setRolePermissions((prev) => [...prev, newRole]);
      }
      setShowAddModal(false);
      setEditingRole(null);
      setFormData({
        legalEntity: "",
        departments: ["all"],
        accessibleTabs: [],
        status: "Active",
      });
      setErrors({});
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-red-100 text-red-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[status] || "bg-gray-100 text-gray-800"
    }`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Department Permissions
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Configure department-based access to tabs and legal entities
          </Text>
        </div>
        <Button onClick={handleAddRole}>
          <Plus size={16} className="mr-2" />
          Add Role
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md">
          <SearchIcon
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          placeholder="Filter by Legal Entity"
          value={selectedLegalEntity}
          onChange={setSelectedLegalEntity}
          options={[
            { value: "", label: "All Legal Entities" },
            ...LEGAL_ENTITIES,
          ]}
        />
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Role Name</Table.HeaderCell>
              <Table.HeaderCell>Legal Entity</Table.HeaderCell>
              <Table.HeaderCell>Departments</Table.HeaderCell>
              <Table.HeaderCell>Accessible Modules</Table.HeaderCell>
              <Table.HeaderCell>Users</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredPermissions.map((permission) => (
              <Table.Row key={permission.id} className="hover:bg-gray-50">
                <Table.Cell>
                  <Text variant="body" weight="medium">
                    {permission.role}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text variant="body" weight="medium">
                    {permission.legalEntity}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-wrap gap-1">
                    {(permission.departments || ["all"])
                      .slice(0, 2)
                      .map((dept) => {
                        const deptLabel =
                          ROLES_BY_LEGAL_ENTITY[permission.legalEntity]?.find(
                            (d) => d.value === dept
                          )?.label || dept;
                        return (
                          <span
                            key={dept}
                            className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                          >
                            {deptLabel}
                          </span>
                        );
                      })}
                    {(permission.departments || ["all"]).length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{(permission.departments || ["all"]).length - 2} more
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-wrap gap-1">
                    {permission.accessibleTabs.slice(0, 2).map((tab) => (
                      <span
                        key={tab}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {AVAILABLE_TABS.find((t) => t.value === tab)?.label ||
                          tab}
                      </span>
                    ))}
                    {permission.accessibleTabs.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{permission.accessibleTabs.length - 2} more
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text variant="body" weight="medium">
                    {permission.userCount}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <span className={getStatusBadge(permission.status)}>
                    {permission.status}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleEditRole(permission)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleDeleteRole(permission.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredPermissions.length} of {rolePermissions.length} role
          configurations
        </Text>
      </div>

      {/* Add/Edit Role Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={
          editingRole
            ? "Edit Department Permissions"
            : "Add Department Permissions"
        }
      >
        <div className="space-y-6">
          <Text variant="body" color="muted">
            {editingRole
              ? "Update role permissions and access to tabs"
              : "Configure role-based permissions and access to tabs"}
          </Text>

          {/* Legal Entity */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Legal Entity *
            </Text>
            <Select
              value={formData.legalEntity}
              onChange={handleLegalEntityChange}
              options={LEGAL_ENTITIES}
              placeholder="Select legal entity"
              error={!!errors.legalEntity}
            />
            {errors.legalEntity && (
              <Text variant="caption" color="error" className="mt-1">
                {errors.legalEntity}
              </Text>
            )}
          </div>

          {/* Departments */}
          {formData.legalEntity && (
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Departments *
              </Text>
              <MultiSelect
                options={getAvailableDepartments()}
                value={formData.departments}
                onChange={(selectedValues) =>
                  handleInputChange("departments", selectedValues)
                }
                placeholder="Select departments"
                className="w-full"
                error={!!errors.departments}
              />
              {errors.departments && (
                <Text variant="caption" color="error" className="mt-1">
                  {errors.departments}
                </Text>
              )}
              <Text variant="caption" color="muted" className="mt-1">
                Select departments for this role. "All Departments" is selected
                by default.
              </Text>
            </div>
          )}

          {/* Accessible Tabs */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Accessible Tabs *
            </Text>
            <MultiSelect
              options={AVAILABLE_TABS}
              value={formData.accessibleTabs}
              onChange={(selectedValues) =>
                handleInputChange("accessibleTabs", selectedValues)
              }
              placeholder="Select accessible tabs"
              className="w-full"
              error={!!errors.accessibleTabs}
            />
            {errors.accessibleTabs && (
              <Text variant="caption" color="error" className="mt-1">
                {errors.accessibleTabs}
              </Text>
            )}
            <Text variant="caption" color="muted" className="mt-1">
              Select which tabs this role can access
            </Text>
          </div>

          {/* Status */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Status
            </Text>
            <Select
              value={formData.status}
              onChange={(value) => handleInputChange("status", value)}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveRole}>
              {editingRole ? "Update" : "Add"} Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RolePermissions;
