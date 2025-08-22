import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import MultiSelect from "../../../atoms/MultiSelect";
import Table from "../../../atoms/Table";
import Modal from "../../../atoms/Modal";
import { Search as SearchIcon, Plus, Edit, Trash2 } from "lucide-react";

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

// Assigned Groups
const ASSIGNED_GROUPS = [
  { value: "Sale Admin", label: "Sale Admin" },
  { value: "Credit Control", label: "Credit Control" },
  { value: "System Admin", label: "System Admin" },
];

// Sample business users data
const SAMPLE_BUSINESS_USERS = [
  {
    id: 1,
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
    assignedGroup: "Sale Admin",
  },
  {
    id: 2,
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
    assignedGroup: "Credit Control",
  },
];

const BusinessUserPermissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLegalEntity, setSelectedLegalEntity] = useState("");
  const [businessUsers, setBusinessUsers] = useState(SAMPLE_BUSINESS_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    // selectedUser: null, // Bỏ hẳn UserSelect
    fullName: "",
    email: "",
    legalEntity: "",
    legalEntities: [],
    // department: "",
    entityPermissions: {},
    assignedGroup: "",
  });
  const [errors, setErrors] = useState({});

  // Filter business users based on search and legal entity
  const filteredUsers = businessUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.assignedGroup.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLegalEntity =
      !selectedLegalEntity || user.legalEntity === selectedLegalEntity;

    return matchesSearch && matchesLegalEntity;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      // selectedUser: null,
      fullName: "",
      email: "",
      legalEntity: "",
      legalEntities: [],
      // department: "",
      entityPermissions: {},
      assignedGroup: "",
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      // selectedUser: null,
      fullName: user.fullName,
      email: user.email,
      legalEntity: user.legalEntity,
      legalEntities: user.legalEntities || [user.legalEntity].filter(Boolean),
      // department: user.department,
      entityPermissions: user.entityPermissions || {},
      assignedGroup: user.assignedGroup || "",
    });
    setErrors({});
    setShowAddModal(true);
  };

  const handleDeleteUser = (userId) => {
    setBusinessUsers((prev) => prev.filter((user) => user.id !== userId));
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
      return { ...prev, entityPermissions: newPermissions };
    });
  };

  const handleEntitySelection = (oldKey, newEntity) => {
    if (!newEntity) return;
    setFormData((prev) => {
      const newPermissions = { ...prev.entityPermissions };
      const permissions = newPermissions[oldKey] || [];
      delete newPermissions[oldKey];
      newPermissions[newEntity] = permissions;
      return { ...prev, entityPermissions: newPermissions };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.assignedGroup) {
      newErrors.assignedGroup = "Please select an assigned group";
    }
    if (!formData.legalEntities || formData.legalEntities.length === 0) {
      newErrors.legalEntities = "At least one legal entity is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const cleanedEntityPermissions = {};
    Object.keys(formData.entityPermissions).forEach((key) => {
      if (!key.startsWith("temp_")) {
        cleanedEntityPermissions[key] = formData.entityPermissions[key];
      }
    });

    const cleanedFormData = {
      ...formData,
      entityPermissions: cleanedEntityPermissions,
      legalEntity:
        formData.legalEntities.length > 0 ? formData.legalEntities[0] : "",
    };

    if (editingUser) {
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
          Add New Group
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
              placeholder="Search by assigned group"
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
              {/* <Table.HeaderCell>User</Table.HeaderCell> */} {/* Ẩn User */}
              {/* <Table.HeaderCell>Department</Table.HeaderCell> */}
              <Table.HeaderCell>Assigned Group</Table.HeaderCell>
              <Table.HeaderCell>Legal Entities</Table.HeaderCell>
              <Table.HeaderCell>Entity Permissions</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredUsers.map((user) => (
              <Table.Row key={user.id} className="hover:bg-gray-50">
                {/* <Table.Cell>
                  <div>
                    <Text variant="body" weight="medium">
                      {user.fullName}
                    </Text>
                    <Text variant="caption" color="muted">
                      {user.email}
                    </Text>
                  </div>
                </Table.Cell> */}
                {/* <Table.Cell>
                  <Text variant="body">{user.department}</Text>
                </Table.Cell> */}
                <Table.Cell>
                  <Text variant="body">{user.assignedGroup}</Text>
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
          Showing {filteredUsers.length} of {businessUsers.length} groups
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
            {/* <div className="md:col-span-2"> */}
            {/*   <Text variant="body" weight="medium" className="mb-2"> */}
            {/*     Select User * */}
            {/*   </Text> */}
            {/*   <UserSelect ... /> */}
            {/* </div> */}

            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Assigned Group *
              </Text>
              <Select
                value={formData.assignedGroup}
                onChange={(value) => handleInputChange("assignedGroup", value)}
                options={ASSIGNED_GROUPS}
                placeholder="Select assigned group"
                error={!!errors.assignedGroup}
              />
              {errors.assignedGroup && (
                <Text variant="caption" color="error" className="mt-1">
                  {errors.assignedGroup}
                </Text>
              )}
            </div>

            {/* <div>
              <Text variant="body" weight="medium" className="mb-2">
                Department *
              </Text>
              <Input
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                placeholder="Department"
              />
            </div> */}

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
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingUser ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BusinessUserPermissions;
