import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
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

// Available tabs/modules
const AVAILABLE_TABS = [
  { value: "my-request", label: "My Request" },
  { value: "approval", label: "Approval" },
  { value: "search", label: "Search" },
  { value: "rule-field-config", label: "Form Configuration" },
  { value: "workflows", label: "Workflows" },
  { value: "permissions", label: "Permissions" },
  { value: "master-data", label: "Master Data" },
];

// Sample role permissions data
const SAMPLE_ROLE_PERMISSIONS = [
  {
    id: 1,
    role: "Sale Admin",
    legalEntity: "DHV",
    accessibleTabs: ["my-request", "approval", "search", "rule-field-config"],
    userCount: 5,
    status: "Active",
  },
  {
    id: 2,
    role: "Credit Officer",
    legalEntity: "DHBH",
    accessibleTabs: ["my-request", "approval", "search"],
    userCount: 3,
    status: "Active",
  },
  {
    id: 3,
    role: "Manager",
    legalEntity: "DHHP",
    accessibleTabs: ["my-request", "approval", "search", "workflows"],
    userCount: 2,
    status: "Active",
  },
  {
    id: 4,
    role: "Legal",
    legalEntity: "DHV",
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
    setShowAddModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowAddModal(true);
  };

  const handleDeleteRole = (roleId) => {
    setRolePermissions((prev) => prev.filter((role) => role.id !== roleId));
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
            Role Permissions
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Configure role-based access to tabs and legal entities
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
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Legal Entity</Table.HeaderCell>
              <Table.HeaderCell>Accessible Tabs</Table.HeaderCell>
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
        title={editingRole ? "Edit Role Permissions" : "Add Role Permissions"}
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            {editingRole
              ? "Update role permissions and access to tabs"
              : "Configure role-based permissions and access to tabs"}
          </Text>
          {/* Modal content will be implemented later */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              {editingRole ? "Update" : "Add"} Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RolePermissions;
