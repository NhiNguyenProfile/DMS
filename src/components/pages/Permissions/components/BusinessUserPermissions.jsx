import { useState, useEffect, useRef } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import MultiSelect from "../../../atoms/MultiSelect";
import Table from "../../../atoms/Table";
import Modal from "../../../atoms/Modal";
import {
  Search as SearchIcon,
  Plus,
  Edit,
  Trash2,
  Users,
  Shield,
  ChevronDown,
  User,
} from "lucide-react";

// Legal entities
const LEGAL_ENTITIES = [
  { value: "DHV", label: "DHV" },
  { value: "DHBH", label: "DHBH" },
  { value: "DHHP", label: "DHHP" },
];

// Entities that business users can have permissions for
const BUSINESS_ENTITIES = [
  { value: "Customer", label: "Customer" },
  { value: "Spare Part", label: "Spare Part" },
  { value: "Main Customer", label: "Main Customer" },
  { value: "Product", label: "Product" },
];

// Request types that can be permitted
const REQUEST_TYPES = [
  { value: "Create", label: "Create" },
  { value: "Edit", label: "Edit" },
  { value: "Copy", label: "Copy" },
  { value: "Extend", label: "Extend" },
];

// Available users for selection with avatar and department
const AVAILABLE_USERS = [
  {
    id: 1,
    username: "john.doe",
    fullName: "John Doe",
    email: "john.doe@deheus.com",
    department: "Sales",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 2,
    username: "jane.smith",
    fullName: "Jane Smith",
    email: "jane.smith@deheus.com",
    department: "Operations",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 3,
    username: "mike.wilson",
    fullName: "Mike Wilson",
    email: "mike.wilson@deheus.com",
    department: "Credit",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 4,
    username: "sarah.johnson",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@deheus.com",
    department: "Finance",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 5,
    username: "david.brown",
    fullName: "David Brown",
    email: "david.brown@deheus.com",
    department: "HR",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 6,
    username: "lisa.chen",
    fullName: "Lisa Chen",
    email: "lisa.chen@deheus.com",
    department: "IT",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
  },
];

// Sample business users data
const SAMPLE_BUSINESS_USERS = [
  {
    id: 1,
    username: "john.doe",
    fullName: "John Doe",
    email: "john.doe@deheus.com",
    legalEntity: "DHV",
    legalEntities: ["DHV", "DHBH"],
    department: "Sales",
    entityPermissions: {
      Customer: ["Create", "Edit", "Copy"],
      "Spare Part": ["Create", "Edit"],
      Product: ["Create", "Copy"],
    },
    lastLogin: "2025-07-29T08:30:00Z",
    status: "Active",
  },
  {
    id: 2,
    username: "jane.smith",
    fullName: "Jane Smith",
    email: "jane.smith@deheus.com",
    legalEntity: "DHBH",
    legalEntities: ["DHBH"],
    department: "Operations",
    entityPermissions: {
      Customer: ["Edit", "Copy"],
      "Spare Part": ["Create", "Edit", "Copy", "Extend"],
      "Main Customer": ["Edit"],
    },
    lastLogin: "2025-07-28T14:20:00Z",
    status: "Active",
  },
  {
    id: 3,
    username: "mike.wilson",
    fullName: "Mike Wilson",
    email: "mike.wilson@deheus.com",
    legalEntity: "DHHP",
    legalEntities: ["DHHP", "DHV"],
    department: "Credit",
    entityPermissions: {
      Customer: ["Create", "Edit", "Copy", "Extend"],
      "Main Customer": ["Create", "Edit"],
    },
    lastLogin: "2025-07-27T10:15:00Z",
    status: "Active",
  },
];

// UserSelect Component
const UserSelect = ({
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedUser = AVAILABLE_USERS.find(
    (user) =>
      user.username === value?.username ||
      user.email === value?.email ||
      user.id === value?.id
  );

  const filteredUsers = AVAILABLE_USERS.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user) => {
    onChange({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      department: user.department,
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  const UserOption = ({ user }) => (
    <div
      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
      onClick={() => handleUserSelect(user)}
    >
      <img
        src={user.avatar}
        alt={user.fullName}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <Text variant="body" weight="medium">
          {user.fullName}
        </Text>
        <Text variant="caption" color="muted">
          {user.username} • {user.email}
        </Text>
        <Text variant="caption" color="muted" className="text-xs">
          {user.department}
        </Text>
      </div>
    </div>
  );

  const UserDisplay = () => {
    if (!selectedUser) {
      return (
        <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-md bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={20} className="text-gray-400" />
          </div>
          <Text variant="body" color="muted">
            {placeholder}
          </Text>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-md bg-white">
        <img
          src={selectedUser.avatar}
          alt={selectedUser.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <Text variant="body" weight="medium">
            {selectedUser.fullName}
          </Text>
          <Text variant="caption" color="muted">
            {selectedUser.username} • {selectedUser.email}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`cursor-pointer ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        } ${error ? "ring-2 ring-red-500" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <UserDisplay />
        <ChevronDown
          size={16}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="text-sm"
            />
          </div>

          {/* User List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserOption key={user.id} user={user} />
              ))
            ) : (
              <div className="p-4 text-center">
                <Text variant="body" color="muted">
                  No users found
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const BusinessUserPermissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLegalEntity, setSelectedLegalEntity] = useState("");
  const [businessUsers, setBusinessUsers] = useState(SAMPLE_BUSINESS_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    selectedUser: null,
    username: "",
    fullName: "",
    email: "",
    legalEntity: "",
    legalEntities: [], // Array for multiple legal entities
    department: "",
    entityPermissions: {},
  });
  const [errors, setErrors] = useState({});

  // Filter business users based on search and legal entity
  const filteredUsers = businessUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLegalEntity =
      !selectedLegalEntity || user.legalEntity === selectedLegalEntity;

    return matchesSearch && matchesLegalEntity;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      selectedUser: null,
      username: "",
      fullName: "",
      email: "",
      legalEntity: "",
      legalEntities: [],
      department: "",
      entityPermissions: {},
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    // Find the corresponding user from AVAILABLE_USERS for editing
    const availableUser = AVAILABLE_USERS.find(
      (u) => u.username === user.username || u.email === user.email
    );
    setFormData({
      selectedUser: availableUser
        ? {
            username: availableUser.username,
            fullName: availableUser.fullName,
            email: availableUser.email,
            department: availableUser.department,
          }
        : null,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      legalEntity: user.legalEntity,
      legalEntities: user.legalEntities || [user.legalEntity].filter(Boolean), // Convert single to array or use existing array
      department: user.department,
      entityPermissions: user.entityPermissions || {},
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleDeleteUser = (userId) => {
    setBusinessUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleUserSelect = (userData) => {
    setFormData((prev) => ({
      ...prev,
      selectedUser: userData,
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
      department: userData.department,
    }));
    // Clear user-related errors
    setErrors((prev) => ({
      ...prev,
      username: "",
      fullName: "",
      email: "",
      department: "",
    }));
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

  const handleEntityPermissionChange = (entity, permissions) => {
    setFormData((prev) => ({
      ...prev,
      entityPermissions: {
        ...prev.entityPermissions,
        [entity]: permissions,
      },
    }));
  };

  const addEntityPermission = () => {
    const availableEntities = BUSINESS_ENTITIES.filter(
      (entity) =>
        !Object.keys(formData.entityPermissions).includes(entity.value)
    );

    if (availableEntities.length > 0) {
      // Add a placeholder with empty entity to allow selection
      // Default to all request types selected
      const tempKey = `temp_${Date.now()}`;
      const allRequestTypes = REQUEST_TYPES.map((rt) => rt.value);
      setFormData((prev) => ({
        ...prev,
        entityPermissions: {
          ...prev.entityPermissions,
          [tempKey]: allRequestTypes,
        },
      }));
    }
  };

  const removeEntityPermission = (entity) => {
    setFormData((prev) => {
      const newPermissions = { ...prev.entityPermissions };
      delete newPermissions[entity];
      return {
        ...prev,
        entityPermissions: newPermissions,
      };
    });
  };

  const handleEntitySelection = (oldKey, newEntity) => {
    if (!newEntity) return;

    setFormData((prev) => {
      const newPermissions = { ...prev.entityPermissions };
      const permissions = newPermissions[oldKey] || [];
      delete newPermissions[oldKey];
      newPermissions[newEntity] = permissions;
      return {
        ...prev,
        entityPermissions: newPermissions,
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.selectedUser) {
      newErrors.username = "Please select a user";
    }

    if (!formData.legalEntities || formData.legalEntities.length === 0) {
      newErrors.legalEntities = "At least one legal entity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Clean up temporary keys from entityPermissions
    const cleanedEntityPermissions = {};
    Object.keys(formData.entityPermissions).forEach((key) => {
      if (!key.startsWith("temp_")) {
        cleanedEntityPermissions[key] = formData.entityPermissions[key];
      }
    });

    const cleanedFormData = {
      ...formData,
      entityPermissions: cleanedEntityPermissions,
      // Keep backward compatibility with single legalEntity
      legalEntity:
        formData.legalEntities.length > 0 ? formData.legalEntities[0] : "",
    };

    if (editingUser) {
      // Update existing user
      setBusinessUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...cleanedFormData,
                lastLogin: new Date().toISOString(),
              }
            : user
        )
      );
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        ...cleanedFormData,
        lastLogin: new Date().toISOString(),
        status: "Active",
      };
      setBusinessUsers((prev) => [...prev, newUser]);
    }

    setShowAddModal(false);
  };

  // Helper function to get entity permissions display
  const getEntityPermissionsDisplay = (entityPermissions) => {
    const entities = Object.keys(entityPermissions || {}).filter(
      (key) => !key.startsWith("temp_")
    );
    if (entities.length === 0) return "No permissions";

    return (
      entities
        .slice(0, 2)
        .map((entity) => {
          const permissions = entityPermissions[entity];
          const entityLabel =
            BUSINESS_ENTITIES.find((e) => e.value === entity)?.label || entity;
          return `${entityLabel}: ${permissions.join(", ")}`;
        })
        .join(" | ") +
      (entities.length > 2 ? ` +${entities.length - 2} more` : "")
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Business User Permissions
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Manage business user entity permissions and request types
          </Text>
        </div>
        <Button onClick={handleAddUser}>
          <Plus size={16} className="mr-2" />
          Add Business User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <SearchIcon
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search by name, username, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Business Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Department</Table.HeaderCell>
              <Table.HeaderCell>Legal Entities</Table.HeaderCell>
              <Table.HeaderCell>Entity Permissions</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredUsers.map((user) => (
              <Table.Row key={user.id} className="hover:bg-gray-50">
                <Table.Cell>
                  <div>
                    <Text variant="body" weight="medium">
                      {user.fullName}
                    </Text>
                    <Text variant="caption" color="muted">
                      {user.email}
                    </Text>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text variant="body">{user.department}</Text>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-wrap gap-1">
                    {(
                      user.legalEntities || [user.legalEntity].filter(Boolean)
                    ).map((entity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {entity}
                      </span>
                    ))}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text
                    variant="caption"
                    color="muted"
                    className="max-w-xs truncate"
                  >
                    {getEntityPermissionsDisplay(user.entityPermissions)}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleDeleteUser(user.id)}
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
          Showing {filteredUsers.length} of {businessUsers.length} business
          users
        </Text>
      </div>

      {/* Add/Edit Business User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={
          editingUser
            ? "Edit Business User Permissions"
            : "Add Business User Permissions"
        }
        size="large"
      >
        <div className="space-y-6">
          <Text variant="body" color="muted">
            {editingUser
              ? "Update business user information and entity permissions"
              : "Configure business user information and entity permissions"}
          </Text>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Text variant="body" weight="medium" className="mb-2">
                Select User *
              </Text>
              <UserSelect
                value={formData.selectedUser}
                onChange={handleUserSelect}
                placeholder="Select a user account"
                error={!!errors.username || !!errors.fullName || !!errors.email}
              />
              {(errors.username || errors.fullName || errors.email) && (
                <Text variant="caption" color="error" className="mt-1">
                  {errors.username || errors.fullName || errors.email}
                </Text>
              )}
            </div>

            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Department *
              </Text>
              <Input
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                placeholder="Department will be auto-filled"
                disabled={true}
                className="bg-gray-50"
              />
              {errors.department && (
                <Text variant="caption" color="error" className="mt-1">
                  {errors.department}
                </Text>
              )}
            </div>

            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Legal Entity Permission *
              </Text>
              <MultiSelect
                value={formData.legalEntities}
                onChange={(values) =>
                  handleInputChange("legalEntities", values)
                }
                options={LEGAL_ENTITIES}
                placeholder="Select legal entities"
                error={!!errors.legalEntities}
              />
              {errors.legalEntities && (
                <Text variant="caption" color="error" className="mt-1">
                  {errors.legalEntities}
                </Text>
              )}
            </div>
          </div>

          {/* Entity Permissions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Text variant="body" weight="medium">
                  Entity Permissions
                </Text>
                <Text variant="caption" color="muted" className="mt-1">
                  Configure which request types this user can perform for each
                  entity
                </Text>
              </div>
              <Button
                variant="outline"
                size="small"
                onClick={addEntityPermission}
                disabled={
                  Object.keys(formData.entityPermissions).length >=
                  BUSINESS_ENTITIES.length
                }
              >
                <Plus size={16} className="mr-2" />
                Add Entity
              </Button>
            </div>

            <div className="space-y-3">
              {Object.keys(formData.entityPermissions).map((entityKey) => {
                const isTemporary = entityKey.startsWith("temp_");
                const isRealEntity = BUSINESS_ENTITIES.some(
                  (e) => e.value === entityKey
                );

                // For temporary items, show available entities
                // For real entities, show only that entity (disabled)
                const availableEntities = isTemporary
                  ? BUSINESS_ENTITIES.filter(
                      (e) =>
                        !Object.keys(formData.entityPermissions).includes(
                          e.value
                        )
                    )
                  : [
                      BUSINESS_ENTITIES.find((e) => e.value === entityKey),
                    ].filter(Boolean);

                const currentValue = isTemporary ? "" : entityKey;
                const isDisabled = !isTemporary;

                return (
                  <div
                    key={entityKey}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <div>
                        <Text variant="body" weight="medium" className="mb-2">
                          Entity
                        </Text>
                        <Select
                          value={currentValue}
                          onChange={(newEntity) =>
                            handleEntitySelection(entityKey, newEntity)
                          }
                          options={availableEntities}
                          placeholder="Select entity"
                          disabled={isDisabled}
                        />
                      </div>
                      <div>
                        <Text variant="body" weight="medium" className="mb-2">
                          Request Types
                        </Text>
                        <MultiSelect
                          options={REQUEST_TYPES}
                          value={formData.entityPermissions[entityKey] || []}
                          onChange={(permissions) =>
                            handleEntityPermissionChange(entityKey, permissions)
                          }
                          placeholder="Select request types"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => removeEntityPermission(entityKey)}
                      >
                        <Trash2 size={16} className="mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}

              {Object.keys(formData.entityPermissions).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Text variant="body" color="muted">
                    No entity permissions configured. Click "Add Entity" to
                    start.
                  </Text>
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessUserPermissions;
