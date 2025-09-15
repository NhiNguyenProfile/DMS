import React, { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Tabs from "../../../atoms/Tabs";
import Modal from "../../../atoms/Modal";
import MultiSelect from "../../../atoms/MultiSelect";
import {
  ArrowLeft,
  Settings,
  Users,
  Shield,
  Search,
  Plus,
  X,
  Upload,
  UserPlus,
  Trash2,
} from "lucide-react";

// Sample directory users
const SAMPLE_USERS = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Sales",
    location: "New York",
    status: "Active",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Warehouse",
    location: "Chicago",
    status: "Active",
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@company.com",
    department: "Finance",
    location: "San Francisco",
    status: "Active",
    avatar: "MC",
  },
  {
    id: 4,
    name: "Lisa Wang",
    email: "lisa.wang@company.com",
    department: "Customer Support",
    location: "Seattle",
    status: "Guest",
    avatar: "LW",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@company.com",
    department: "IT",
    location: "Austin",
    status: "Active",
    avatar: "DB",
  },
];

// Sample roles data
const SAMPLE_ROLES = [
  {
    id: 1,
    roleName: "Sales Manager",
    description: "Manages sales operations and customer relationships",
    domain: "Sales",
    privileges: 20,
    entities: ["Customer", "Sales order"],
  },
  {
    id: 2,
    roleName: "Warehouse Supervisor",
    description: "Oversees inventory and purchase operations",
    domain: "Warehouse",
    privileges: 16,
    entities: ["Spare Part", "Inventory Item", "Purchase order", "Supplier"],
  },
  {
    id: 3,
    roleName: "Finance Officer",
    description: "Financial reporting and invoice management",
    domain: "Finance",
    privileges: 6,
    entities: ["Invoice", "Report"],
  },
  {
    id: 4,
    roleName: "Customer Service Rep",
    description: "Handle customer inquiries and basic order management",
    domain: "Customer Support",
    privileges: 8,
    entities: ["Customer", "Sales order"],
  },
];

// Legal entities from master data
const LEGAL_ENTITIES = [
  { id: 1, code: "DHV", name: "De Heus Vietnam" },
  { id: 2, code: "DHBH", name: "De Heus Entity 2" },
  { id: 3, code: "DHHP", name: "De Heus Entity 3" },
  { id: 4, code: "DHHY", name: "De Heus Entity 4" },
  { id: 5, code: "DHGC", name: "De Heus Entity 5" },
  { id: 6, code: "DHGD", name: "De Heus Entity 6" },
];

const GroupDetail = ({ group, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    groupName: group?.groupName || "",
    description: group?.description || "",
    status: group?.status || "Active",
  });
  const [errors, setErrors] = useState({});

  // Members tab state
  const [selectedMembers, setSelectedMembers] = useState(group?.members || []);
  const [memberSearch, setMemberSearch] = useState("");

  const [selectedMemberSearch, setSelectedMemberSearch] = useState("");

  // Roles tab state
  const [selectedRoles, setSelectedRoles] = useState(group?.roles || []);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditLegalModal, setShowEditLegalModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [addRoleForm, setAddRoleForm] = useState({
    selectedRoleId: "",
    allLegal: false,
    legalEntities: [],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Members functions
  const filteredUsers = SAMPLE_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(memberSearch.toLowerCase());
    const notSelected = !selectedMembers.find((m) => m.id === user.id);

    return matchesSearch && notSelected;
  });

  const filteredSelectedMembers = selectedMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(selectedMemberSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(selectedMemberSearch.toLowerCase())
  );

  const handleAddMember = (user) => {
    setSelectedMembers((prev) => [...prev, user]);
  };

  const handleRemoveMember = (userId) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  const handleRemoveAllMembers = () => {
    if (window.confirm("Remove all members from this group?")) {
      setSelectedMembers([]);
    }
  };

  // Roles functions
  const handleOpenAddRoleModal = () => {
    setShowAddRoleModal(true);
    setAddRoleForm({
      selectedRoleId: "",
      allLegal: false,
      legalEntities: [],
    });
  };

  const handleAddRole = () => {
    if (!addRoleForm.selectedRoleId) return;

    // Check if role already exists
    if (
      selectedRoles.find(
        (r) => r.roleId === parseInt(addRoleForm.selectedRoleId)
      )
    ) {
      alert("This role is already assigned to the group");
      return;
    }

    const role = SAMPLE_ROLES.find(
      (r) => r.id === parseInt(addRoleForm.selectedRoleId)
    );
    const newRole = {
      roleId: role.id,
      roleName: role.roleName,
      description: role.description,
      domain: role.domain,
      privileges: role.privileges,
      entities: role.entities,
      allLegal: addRoleForm.allLegal,
      legalEntities: addRoleForm.allLegal ? [] : addRoleForm.legalEntities,
    };

    setSelectedRoles((prev) => [...prev, newRole]);
    setShowAddRoleModal(false);
  };

  const handleRemoveRole = (roleId) => {
    if (window.confirm("Remove this role from the group?")) {
      setSelectedRoles((prev) => prev.filter((r) => r.roleId !== roleId));
    }
  };

  const handleEditLegalEntities = (role) => {
    setEditingRole(role);
    setShowEditLegalModal(true);
  };

  const handleSaveLegalEntities = (roleId, allLegal, legalEntities) => {
    setSelectedRoles((prev) =>
      prev.map((role) =>
        role.roleId === roleId
          ? { ...role, allLegal, legalEntities: allLegal ? [] : legalEntities }
          : role
      )
    );
    setShowEditLegalModal(false);
    setEditingRole(null);
  };

  const formatLegalEntitiesDisplay = (role) => {
    if (role.allLegal) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          All legal
        </span>
      );
    }

    if (role.legalEntities.length === 0) {
      return (
        <span className="text-gray-400 text-sm">No entities selected</span>
      );
    }

    const entities = role.legalEntities
      .map((id) => LEGAL_ENTITIES.find((le) => le.id === id)?.code)
      .filter(Boolean);

    if (entities.length <= 5) {
      return (
        <div className="flex flex-wrap gap-1">
          {entities.map((code) => (
            <span
              key={code}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {code}
            </span>
          ))}
        </div>
      );
    }

    const displayEntities = entities.slice(0, 5);
    const remainingCount = entities.length - 5;

    return (
      <div className="flex flex-wrap gap-1">
        {displayEntities.map((code) => (
          <span
            key={code}
            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
          >
            {code}
          </span>
        ))}
        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          +{remainingCount}
        </span>
      </div>
    );
  };

  const handleSave = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.groupName.trim()) {
      newErrors.groupName = "Group name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...group,
      groupName: formData.groupName.trim(),
      description: formData.description.trim(),
      status: formData.status,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <Text variant="h3" weight="semibold">
              {group ? `Edit Group: ${group.groupName}` : "Add New Group"}
            </Text>
            <Text variant="body" color="muted">
              Configure group settings, members, and role assignments
            </Text>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {group ? "Update Group" : "Create Group"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Tabs defaultTab="general" variant="default">
          <Tabs.Panel
            tabId="general"
            label="General"
            icon={<Settings size={16} />}
          >
            <div className="p-6 space-y-6">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) =>
                    handleInputChange("groupName", e.target.value)
                  }
                  placeholder="Enter unique group name"
                  className={errors.groupName ? "border-red-500" : ""}
                />
                {errors.groupName && (
                  <Text variant="caption" className="text-red-500 mt-1">
                    {errors.groupName}
                  </Text>
                )}
                <Text variant="caption" color="muted" className="mt-1">
                  Must be unique across all groups
                </Text>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description of this group's purpose"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <Text variant="caption" color="muted" className="mt-1">
                  Help others understand what this group is for
                </Text>
              </div>

              {/* Status Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Group Status
                </label>
                <div className="flex items-center gap-3">
                  <Text
                    variant="body"
                    className={
                      formData.status === "Inactive"
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    Inactive
                  </Text>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange(
                        "status",
                        formData.status === "Active" ? "Inactive" : "Active"
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      formData.status === "Active"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.status === "Active"
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                  <Text
                    variant="body"
                    className={
                      formData.status === "Active"
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    Active
                  </Text>
                </div>
                <Text variant="caption" color="muted" className="mt-1">
                  Inactive groups cannot be assigned new members or roles
                </Text>
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel
            tabId="members"
            label="Members"
            icon={<Users size={16} />}
          >
            <div className="p-6">
              {/* 2-Pane Layout */}
              <div className="grid grid-cols-2 gap-6 h-[500px]">
                {/* Left Pane: Directory Search */}
                <div className="border border-gray-200 rounded-lg flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <Text variant="body" weight="medium" className="mb-3">
                      Directory Search
                    </Text>

                    {/* Search */}
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        type="text"
                        placeholder="Search by name or email..."
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* User List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Text variant="body">No users found</Text>
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="p-3 border-b border-gray-100 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {user.avatar}
                            </div>
                            <div>
                              <Text variant="body" weight="medium">
                                {user.name}
                              </Text>
                              <Text variant="caption" color="muted">
                                {user.email}
                              </Text>
                              <Text variant="caption" color="muted">
                                {user.department} • {user.status}
                              </Text>
                            </div>
                          </div>
                          <Button
                            size="small"
                            onClick={() => handleAddMember(user)}
                          >
                            <UserPlus size={14} />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Pane: Selected Members */}
                <div className="border border-gray-200 rounded-lg flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                    <div className="flex justify-between items-center mb-3">
                      <Text variant="body" weight="medium">
                        Selected Members ({selectedMembers.length})
                      </Text>
                      {selectedMembers.length > 0 && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={handleRemoveAllMembers}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove All
                        </Button>
                      )}
                    </div>

                    {/* Search Selected */}
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        type="text"
                        placeholder="Search selected members..."
                        value={selectedMemberSearch}
                        onChange={(e) =>
                          setSelectedMemberSearch(e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Selected Members List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredSelectedMembers.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Users
                          size={48}
                          className="mx-auto text-gray-300 mb-4"
                        />
                        <Text variant="body">No members selected</Text>
                        <Text variant="caption" color="muted" className="mt-1">
                          Add members from the directory on the left
                        </Text>
                      </div>
                    ) : (
                      filteredSelectedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 border-b border-gray-100 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {member.avatar}
                            </div>
                            <div>
                              <Text variant="body" weight="medium">
                                {member.name}
                              </Text>
                              <Text variant="caption" color="muted">
                                {member.email}
                              </Text>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Panel>

          <Tabs.Panel
            tabId="roles"
            label="Roles & Legal Entities"
            icon={<Shield size={16} />}
          >
            <div className="p-6">
              {/* Header with Add Role button */}
              <div className="flex justify-between items-center mb-6">
                <Text variant="h4" weight="semibold">
                  Role Assignments
                </Text>
                <Button onClick={handleOpenAddRoleModal}>
                  <Plus size={16} className="mr-2" />
                  Add Role
                </Button>
              </div>

              {/* Roles Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Legal Entities
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedRoles.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center">
                          <Shield
                            size={48}
                            className="mx-auto text-gray-300 mb-4"
                          />
                          <Text variant="body" color="muted">
                            No roles assigned
                          </Text>
                          <Text
                            variant="caption"
                            color="muted"
                            className="mt-1"
                          >
                            Click "Add Role" to get started
                          </Text>
                        </td>
                      </tr>
                    ) : (
                      selectedRoles.map((role) => (
                        <tr key={role.roleId} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <Text variant="body" weight="medium">
                                  {role.roleName}
                                </Text>
                                <div className="flex items-center gap-2 mt-1">
                                  <Text variant="caption" color="muted">
                                    {role.privileges} privileges
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                              onClick={() => handleEditLegalEntities(role)}
                            >
                              {formatLegalEntitiesDisplay(role)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="small"
                                onClick={() => handleEditLegalEntities(role)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Edit
                              </Button>
                              <span className="text-gray-300">·</span>
                              <Button
                                variant="ghost"
                                size="small"
                                onClick={() => handleRemoveRole(role.roleId)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>

      {/* Add Role Modal */}
      <Modal
        isOpen={showAddRoleModal}
        onClose={() => setShowAddRoleModal(false)}
        title="Add Role"
        size="medium"
      >
        <div className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role <span className="text-red-500">*</span>
            </label>
            <RoleSearchSelect
              selectedRoleId={addRoleForm.selectedRoleId}
              onChange={(roleId) =>
                setAddRoleForm((prev) => ({ ...prev, selectedRoleId: roleId }))
              }
              availableRoles={SAMPLE_ROLES.filter(
                (role) => !selectedRoles.find((r) => r.roleId === role.id)
              )}
            />
          </div>

          {/* Legal Entity Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Legal Entity Access <span className="text-red-500">*</span>
            </label>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="add-all-legal"
                  checked={addRoleForm.allLegal}
                  onChange={(e) =>
                    setAddRoleForm((prev) => ({
                      ...prev,
                      allLegal: e.target.checked,
                      legalEntities: e.target.checked ? [] : prev.legalEntities,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="add-all-legal" className="text-sm font-medium">
                  All Legal Entities
                </label>
              </div>

              {!addRoleForm.allLegal && (
                <div className="ml-6">
                  <Text variant="caption" color="muted" className="mb-2">
                    Select specific legal entities:
                  </Text>
                  <MultiSelect
                    value={addRoleForm.legalEntities}
                    onChange={(entities) =>
                      setAddRoleForm((prev) => ({
                        ...prev,
                        legalEntities: entities,
                      }))
                    }
                    options={LEGAL_ENTITIES.map((entity) => ({
                      value: entity.id,
                      label: `${entity.code} - ${entity.name}`,
                    }))}
                    placeholder="Select legal entities..."
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowAddRoleModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRole}
              disabled={
                !addRoleForm.selectedRoleId ||
                (!addRoleForm.allLegal &&
                  addRoleForm.legalEntities.length === 0)
              }
            >
              Add Role
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Legal Entities Modal */}
      <Modal
        isOpen={showEditLegalModal}
        onClose={() => setShowEditLegalModal(false)}
        title="Edit Legal Entities"
        size="medium"
      >
        {editingRole && (
          <EditLegalEntitiesForm
            role={editingRole}
            legalEntities={LEGAL_ENTITIES}
            onSave={handleSaveLegalEntities}
            onCancel={() => setShowEditLegalModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

// Role Search Select Component
const RoleSearchSelect = ({ selectedRoleId, onChange, availableRoles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = availableRoles.filter(
    (role) =>
      role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedRole = availableRoles.find(
    (role) => role.id.toString() === selectedRoleId
  );

  const handleSelectRole = (roleId) => {
    onChange(roleId.toString());
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer bg-white min-h-[38px] flex items-center justify-between focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          {selectedRole ? (
            <div>
              <span className="font-medium">{selectedRole.roleName}</span>
              <span className="ml-2 text-sm text-gray-500">
                {selectedRole.privileges} privileges
              </span>
            </div>
          ) : (
            <span className="text-gray-400">Choose a role...</span>
          )}
        </div>
        <Search size={16} className="text-gray-400 flex-shrink-0" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredRoles.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                No roles found
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelectRole(role.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{role.roleName}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {role.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {role.privileges} privileges
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Legal Entities Form Component
const EditLegalEntitiesForm = ({ role, legalEntities, onSave, onCancel }) => {
  const [allLegal, setAllLegal] = useState(role.allLegal);
  const [selectedEntities, setSelectedEntities] = useState(role.legalEntities);

  const handleSave = () => {
    onSave(role.roleId, allLegal, selectedEntities);
  };

  return (
    <div className="space-y-4">
      <div>
        <Text variant="body" weight="medium" className="mb-3">
          {role.roleName}
        </Text>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-all-legal"
              checked={allLegal}
              onChange={(e) => {
                setAllLegal(e.target.checked);
                if (e.target.checked) {
                  setSelectedEntities([]);
                }
              }}
              className="rounded border-gray-300"
            />
            <label htmlFor="edit-all-legal" className="text-sm font-medium">
              All Legal Entities
            </label>
          </div>

          {!allLegal && (
            <div className="ml-6">
              <Text variant="caption" color="muted" className="mb-2">
                Select specific legal entities:
              </Text>
              <MultiSelect
                value={selectedEntities}
                onChange={setSelectedEntities}
                options={legalEntities.map((entity) => ({
                  value: entity.id,
                  label: `${entity.code} - ${entity.name}`,
                }))}
                placeholder="Select legal entities..."
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!allLegal && selectedEntities.length === 0}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default GroupDetail;
