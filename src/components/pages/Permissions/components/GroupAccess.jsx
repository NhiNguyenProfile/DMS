import React, { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Modal from "../../../atoms/Modal";
import GroupDetail from "./GroupDetail";
import {
  Search as SearchIcon,
  Plus,
  Edit,
  Trash2,
  Users,
  X,
} from "lucide-react";

// Sample groups data
const SAMPLE_GROUPS = [
  {
    id: 1,
    groupName: "Sales Team",
    description: "Sales representatives and managers",
    memberCount: 12,
    roleCount: 3,
    roles: ["Sales Manager", "Customer Service Rep"],
    owner: "John Smith",
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    groupName: "Warehouse Operations",
    description: "Warehouse staff and supervisors",
    memberCount: 8,
    roleCount: 2,
    roles: ["Warehouse Supervisor", "Inventory Manager"],
    owner: "Sarah Johnson",
    status: "Active",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    groupName: "Finance Department",
    description: "Financial analysts and officers",
    memberCount: 6,
    roleCount: 2,
    roles: ["Finance Officer", "System Administrator"],
    owner: "Mike Chen",
    status: "Active",
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    groupName: "Customer Support",
    description: "Customer service and support team",
    memberCount: 15,
    roleCount: 1,
    roles: ["Customer Service Rep"],
    owner: "Lisa Wang",
    status: "Inactive",
    createdAt: "2024-02-10",
  },
];

const GroupAccess = () => {
  const [groups, setGroups] = useState(SAMPLE_GROUPS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [currentView, setCurrentView] = useState("list"); // "list" or "detail"
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formData, setFormData] = useState({
    groupName: "",
    description: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({});

  // Filter groups based on search term
  const filteredGroups = groups.filter(
    (group) =>
      group.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Validate group name uniqueness
  const validateGroupName = (name, excludeId = null) => {
    return !groups.some(
      (g) =>
        g.groupName.toLowerCase() === name.toLowerCase() && g.id !== excludeId
    );
  };

  const handleAddGroup = () => {
    setSelectedGroup(null);
    setCurrentView("detail");
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedGroup(null);
  };

  const handleSaveGroup = (groupData) => {
    if (selectedGroup) {
      // Update existing group
      setGroups((prev) =>
        prev.map((g) =>
          g.id === selectedGroup.id ? { ...groupData, id: selectedGroup.id } : g
        )
      );
    } else {
      // Add new group
      const newGroup = {
        ...groupData,
        id: Math.max(...groups.map((g) => g.id)) + 1,
        memberCount: 0,
        roleCount: 0,
        roles: [],
        createdAt: new Date().toISOString().split("T")[0],
      };
      setGroups((prev) => [...prev, newGroup]);
    }
    setCurrentView("list");
    setSelectedGroup(null);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingGroup(null);
    setFormData({
      groupName: "",
      description: "",
      status: "Active",
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Real-time validation for group name
    if (field === "groupName" && value) {
      const isUnique = validateGroupName(value, editingGroup?.id);
      if (!isUnique) {
        setErrors((prev) => ({
          ...prev,
          groupName:
            "Group name already exists. Please choose a different name.",
        }));
      }
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      setGroups(groups.filter((g) => g.id !== groupId));
    }
  };

  const handleRowClick = (group) => {
    setSelectedGroup(group);
    setCurrentView("detail");
  };

  // Show detail view
  if (currentView === "detail") {
    return (
      <GroupDetail
        group={selectedGroup}
        onBack={handleBackToList}
        onSave={handleSaveGroup}
      />
    );
  }

  // Show list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Text variant="h3" weight="semibold">
            Group Access Management
          </Text>
          <Text variant="body" color="muted">
            Manage user groups with roles and legal entity access
          </Text>
        </div>
        <Button onClick={handleAddGroup}>
          <Plus size={16} className="mr-2" />
          Add Group
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative max-w-md">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search groups by name, description, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members & Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm ? (
                      <div>
                        <Text variant="body">
                          No groups found matching "{searchTerm}"
                        </Text>
                        <Text variant="caption" color="muted" className="mt-1">
                          Try adjusting your search terms
                        </Text>
                      </div>
                    ) : (
                      <div>
                        <Users
                          size={48}
                          className="mx-auto text-gray-300 mb-4"
                        />
                        <Text variant="body">No groups configured yet</Text>
                        <Text variant="caption" color="muted" className="mt-1">
                          Create your first group to manage user access
                        </Text>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredGroups.map((group) => (
                  <tr
                    key={group.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(group)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Text variant="body" weight="medium">
                          {group.groupName}
                        </Text>
                        {group.description && (
                          <Text
                            variant="caption"
                            color="muted"
                            className="mt-1"
                          >
                            {group.description}
                          </Text>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Text variant="body">
                          {group.memberCount} members • {group.roleCount} roles
                        </Text>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {group.roles.slice(0, 2).map((role, index) => (
                            <span
                              key={index}
                              className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded"
                            >
                              {role}
                            </span>
                          ))}
                          {group.roles.length > 2 && (
                            <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              +{group.roles.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            group.status === "Active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        <Text
                          variant="body"
                          className={
                            group.status === "Active"
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          {group.status}
                        </Text>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGroup(group);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
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

      {/* Summary */}
      {filteredGroups.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <Text variant="caption" color="muted">
            Showing {filteredGroups.length} of {groups.length} groups
            {searchTerm && ` matching "${searchTerm}"`}
          </Text>
        </div>
      )}

      {/* Add/Edit Group Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={handleCloseModal}
        title={showEditModal ? "Edit Group" : "Add New Group"}
        size="medium"
      >
        <div className="space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <Text variant="h4" weight="semibold">
              General Information
            </Text>

            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.groupName}
                onChange={(e) => handleInputChange("groupName", e.target.value)}
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

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleSaveGroup}>
              {showEditModal ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GroupAccess;
