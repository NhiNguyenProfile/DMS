import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import Table from "../../../atoms/Table";
import Modal from "../../../atoms/Modal";
import {
  Search as SearchIcon,
  Plus,
  Edit,
  Trash2,
  Crown,
  Shield,
} from "lucide-react";

// Admin levels
const ADMIN_LEVELS = [
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

// Sample legal entities
const LEGAL_ENTITIES = [
  { value: "DHV", label: "DHV" },
  { value: "DHBH", label: "DHBH" },
  { value: "DHHP", label: "DHHP" },
  { value: "DHHY", label: "DHHY" },
  { value: "DHGC", label: "DHGC" },
  { value: "DHGD", label: "DHGD" },
  { value: "ALL", label: "All Legal Entities" },
];

// Admin permissions
const ADMIN_PERMISSIONS = [
  "user_management",
  "role_management",
  "system_configuration",
  "audit_logs",
  "data_export",
  "workflow_management",
  "permission_management",
  "master_data_sync",
];

// Sample admin users data
const SAMPLE_ADMIN_USERS = [
  {
    id: 1,
    username: "admin.system",
    fullName: "System Administrator",
    email: "admin@deheus.com",
    adminLevel: "super_admin",
    legalEntities: ["ALL"],
    permissions: ADMIN_PERMISSIONS,
    lastLogin: "2025-07-29T08:30:00Z",
    status: "Active",
  },
  {
    id: 2,
    username: "admin.dhv",
    fullName: "DHV Administrator",
    email: "admin.dhv@deheus.com",
    adminLevel: "admin",
    legalEntities: ["DHV"],
    permissions: ["user_management", "role_management", "workflow_management"],
    lastLogin: "2025-07-28T14:20:00Z",
    status: "Active",
  },
  {
    id: 3,
    username: "admin.dhbh",
    fullName: "DHBH Administrator",
    email: "admin.dhbh@deheus.com",
    adminLevel: "admin",
    legalEntities: ["DHBH", "DHHP"],
    permissions: ["user_management", "role_management"],
    lastLogin: "2025-07-27T10:15:00Z",
    status: "Active",
  },
];

const AdminPermissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdminLevel, setSelectedAdminLevel] = useState("");
  const [adminUsers, setAdminUsers] = useState(SAMPLE_ADMIN_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Filter admin users based on search and admin level
  const filteredAdmins = adminUsers.filter((admin) => {
    const matchesSearch =
      admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      !selectedAdminLevel || admin.adminLevel === selectedAdminLevel;

    return matchesSearch && matchesLevel;
  });

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setShowAddModal(true);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setShowAddModal(true);
  };

  const handleDeleteAdmin = (adminId) => {
    setAdminUsers((prev) => prev.filter((admin) => admin.id !== adminId));
  };

  const getAdminLevelBadge = (level) => {
    const colors = {
      super_admin: "bg-purple-100 text-purple-800",
      admin: "bg-blue-100 text-blue-800",
    };
    const icons = {
      super_admin: <Crown size={12} className="mr-1" />,
      admin: <Shield size={12} className="mr-1" />,
    };
    return {
      className: `px-2 py-1 text-xs font-medium rounded flex items-center ${
        colors[level] || "bg-gray-100 text-gray-800"
      }`,
      icon: icons[level],
      label: level === "super_admin" ? "Super Admin" : "Admin",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Admin Permissions
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Manage administrator accounts and roles
          </Text>
        </div>
        <Button onClick={handleAddAdmin}>
          <Plus size={16} className="mr-2" />
          Add Admin
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
            placeholder="Search administrators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          placeholder="Filter by Admin Level"
          value={selectedAdminLevel}
          onChange={setSelectedAdminLevel}
          options={[{ value: "", label: "All Admin Levels" }, ...ADMIN_LEVELS]}
        />
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Account</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredAdmins.map((admin) => {
              const levelBadge = getAdminLevelBadge(admin.adminLevel);
              return (
                <Table.Row key={admin.id} className="hover:bg-gray-50">
                  <Table.Cell>
                    <div>
                      <Text variant="body" weight="medium">
                        {admin.fullName}
                      </Text>
                      <Text variant="caption" color="muted">
                        {admin.email}
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={levelBadge.className}>
                      {levelBadge.icon}
                      {levelBadge.label}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleEditAdmin(admin)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        disabled={admin.adminLevel === "super_admin"}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredAdmins.length} of {adminUsers.length} administrators
        </Text>
      </div>

      {/* Add/Edit Admin Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingAdmin ? "Edit Administrator" : "Add Administrator"}
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            {editingAdmin
              ? "Update administrator account and role"
              : "Configure administrator account and role"}
          </Text>
          {/* Modal content will be implemented later */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              {editingAdmin ? "Update" : "Add"} Administrator
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPermissions;
