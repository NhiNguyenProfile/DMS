import React, { useState } from "react";
import { ArrowLeft, Plus, Save, Trash2, Building, Shield } from "lucide-react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Modal from "../../../atoms/Modal";
import SearchableSelect from "../../../atoms/SearchableSelect";

// Define available roles outside of component
const DEFAULT_AVAILABLE_ROLES = [
  {
    id: 1,
    name: "Sales Manager",
    description: "Manages sales operations",
    duties: [1, 2], // Customer Management, Sales Order Processing
    entities: ["Customer"],
    privileges: [
      "Customer_Basic_Access",
      "Customer_Advanced_Edit",
      "Sales_Order_Create",
      "Sales_Order_Edit",
    ],
    privilegeCount: 4,
  },
  {
    id: 2,
    name: "Account Manager",
    description: "Manages customer accounts",
    duties: [1], // Customer Management only
    entities: ["Customer"],
    privileges: ["Customer_Basic_Access", "Customer_Advanced_Edit"],
    privilegeCount: 2,
  },
  {
    id: 3,
    name: "Operations Manager",
    description: "Manages warehouse operations",
    duties: [3], // Inventory Control
    entities: ["Spare Part"],
    privileges: ["Inventory_View", "Inventory_Edit", "Stock_Adjustment"],
    privilegeCount: 3,
  },
  {
    id: 4,
    name: "Finance Officer",
    description: "Manages financial operations",
    duties: [4], // Purchase Management
    entities: ["Spare Part"],
    privileges: ["Purchase_Order_Create", "Purchase_Order_Edit"],
    privilegeCount: 2,
  },
  {
    id: 5,
    name: "System Administrator",
    description: "Manages system configuration",
    duties: [1, 3], // Customer Management & Inventory Control
    entities: ["Customer", "Spare Part"],
    privileges: ["Customer_Basic_Access", "Inventory_View", "Inventory_Edit"],
    privilegeCount: 3,
  },
];

export default function AccountDetail({ account, onBack, onSave }) {
  // State for managing lists of roles and legal entities
  const [availableRoles, setAvailableRoles] = useState(DEFAULT_AVAILABLE_ROLES);

  const [formData, setFormData] = useState(() => ({
    username: account?.username || "",
    fullName: account?.fullName || "",
    email: account?.email || "",
    department: account?.department || "",
    status: account?.status || "Active",
    legalEntities: account?.legalEntities || [], // Array of legal entity values (e.g., ["DHV", "DHBH"])
    roles:
      account?.roles?.map((role) => {
        // If it's existing data, get role from DEFAULT_AVAILABLE_ROLES to ensure complete information
        const fullRoleData = DEFAULT_AVAILABLE_ROLES.find(
          (r) => r.id === role.id
        );
        if (fullRoleData) {
          return {
            ...fullRoleData,
            privilegeCount: fullRoleData.privileges.length,
          };
        }
        return role;
      }) || [],
  }));

  const LEGAL_ENTITIES = [
    { value: "DHV", label: "DHV" },
    { value: "DHBH", label: "DHBH" },
    { value: "DHHP", label: "DHHP" },
    { value: "DHHY", label: "DHHY" },
    { value: "DHGC", label: "DHGC" },
    { value: "DHGD", label: "DHGD" },
  ];
  const [legalEntities, setLegalEntities] = useState(LEGAL_ENTITIES);

  const [errors, setErrors] = useState({});
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");

  // Modal states
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showAddEntityModal, setShowAddEntityModal] = useState(false);
  const [newRoleData, setNewRoleData] = useState({ name: "", description: "" });
  const [newEntityData, setNewEntityData] = useState({ name: "", code: "" });

  // Handle adding a new role
  const handleAddNewRole = () => {
    if (!newRoleData.name) return;

    const newRole = {
      id: Math.max(...availableRoles.map((r) => r.id)) + 1,
      name: newRoleData.name,
      description: newRoleData.description,
      duties: [], // New role starts with no duties
      entities: [], // No entities initially
      privileges: [], // No privileges initially
      privilegeCount: 0,
    };

    setAvailableRoles((prev) => [...prev, newRole]);
    setNewRoleData({ name: "", description: "" });
    setShowAddRoleModal(false);
  };

  // Handle adding a new legal entity
  const handleAddNewEntity = () => {
    if (!newEntityData.name || !newEntityData.code) return;

    const newEntity = {
      id: Math.max(...legalEntities.map((e) => e.id)) + 1,
      name: newEntityData.name,
      code: newEntityData.code,
    };

    setLegalEntities((prev) => [...prev, newEntity]);
    setNewEntityData({ name: "", code: "" });
    setShowAddEntityModal(false);
  };

  // Handle adding a role
  const handleAddRole = () => {
    if (!selectedRole) return;

    const roleToAdd = availableRoles.find((role) => role.id === selectedRole);
    if (roleToAdd && !formData.roles.some((r) => r.id === roleToAdd.id)) {
      // Clone role để đảm bảo có đầy đủ thông tin
      const roleWithData = {
        ...roleToAdd,
        privilegeCount: roleToAdd.privileges.length,
      };

      setFormData((prev) => ({
        ...prev,
        roles: [...prev.roles, roleWithData],
      }));
    }
    setSelectedRole("");
  };

  // Handle removing a role
  const handleRemoveRole = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter((role) => role.id !== roleId),
    }));
  };

  // Handle adding a legal entity
  const handleAddEntity = () => {
    if (!selectedEntity) return;

    // selectedEntity sẽ là value (ví dụ: "DHV")
    const entityToAdd = LEGAL_ENTITIES.find(
      (entity) => entity.value === selectedEntity
    );

    if (entityToAdd && !formData.legalEntities.includes(selectedEntity)) {
      setFormData((prev) => ({
        ...prev,
        legalEntities: [...prev.legalEntities, selectedEntity],
      }));
    }
    setSelectedEntity("");
  };

  // Handle removing a legal entity
  const handleRemoveEntity = (entityValue) => {
    setFormData((prev) => ({
      ...prev,
      legalEntities: prev.legalEntities.filter(
        (value) => value !== entityValue
      ),
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.department) newErrors.department = "Department is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: account?.id || Date.now(),
      createdAt: account?.createdAt || new Date().toISOString().split("T")[0],
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
              {account ? "Edit Account Access" : "Configure New Account"}
            </Text>
            <Text variant="body" color="muted">
              Configure account access, roles, and legal entities
            </Text>
          </div>
        </div>
        <Button onClick={handleSubmit}>
          <Save size={16} className="mr-2" />
          {account ? "Update Access" : "Save Access"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Account Information Section */}
        <div className="space-y-4">
          <Text variant="h4" weight="semibold">
            Account Information
          </Text>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                error={errors.username}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                error={errors.fullName}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                error={errors.email}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                error={errors.department}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <SearchableSelect
                value={formData.status}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Legal Entities Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Text
              variant="h4"
              weight="semibold"
              className="flex items-center gap-2"
            >
              <Building size={20} />
              Legal Entities
            </Text>
          </div>
          <div className="flex gap-2">
            <SearchableSelect
              value={selectedEntity}
              onChange={setSelectedEntity}
              options={legalEntities.filter(
                (entity) => !formData.legalEntities.includes(entity.value)
              )}
              placeholder="Select legal entity..."
              className="flex-1"
            />
            <Button onClick={handleAddEntity} disabled={!selectedEntity}>
              <Plus size={16} className="mr-2" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {formData.legalEntities.map((entityValue, index) => {
              const entity = LEGAL_ENTITIES.find(
                (e) => e.value === entityValue
              );
              if (!entity) return null; // Skip if entity not found

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <Text variant="body" weight="medium">
                      {entity.label}
                    </Text>
                    <Text variant="caption" color="muted">
                      {entity.value}
                    </Text>
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleRemoveEntity(entity.value)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              );
            })}
            {formData.legalEntities.length === 0 && (
              <Text variant="body" color="muted" className="text-center py-4">
                No legal entities assigned
              </Text>
            )}
          </div>
        </div>

        {/* Roles Section */}
        <div className="space-y-4 col-span-2">
          <div className="flex items-center justify-between">
            <Text
              variant="h4"
              weight="semibold"
              className="flex items-center gap-2"
            >
              <Shield size={20} />
              Roles
            </Text>
          </div>
          <div className="flex gap-2">
            <SearchableSelect
              value={selectedRole}
              onChange={setSelectedRole}
              options={availableRoles
                .filter((role) => !formData.roles.some((r) => r.id === role.id))
                .map((role) => ({
                  value: role.id,
                  label: role.name,
                }))}
              placeholder="Select role..."
              className="flex-1"
              onAddNew={() => setShowAddRoleModal(true)}
            />
            <Button onClick={handleAddRole} disabled={!selectedRole}>
              <Plus size={16} className="mr-2" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {formData.roles.map((role) => {
              // Ensure we have all role data
              const fullRoleData =
                availableRoles.find((r) => r.id === role.id) || role;

              return (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <Text variant="body" weight="medium">
                      {fullRoleData.name}
                    </Text>
                    <Text variant="caption" color="muted">
                      {fullRoleData.description}
                    </Text>
                    <div className="mt-2">
                      <Text variant="caption" color="muted" className="text-xs">
                        {fullRoleData.duties?.length || 0} duties •{" "}
                        {fullRoleData.privileges?.length || 0} privileges
                      </Text>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {fullRoleData.entities
                          ?.slice(0, 3)
                          .map((entity, index) => (
                            <span
                              key={index}
                              className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                            >
                              {entity}
                            </span>
                          ))}
                        {(fullRoleData.entities?.length || 0) > 3 && (
                          <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                            +{fullRoleData.entities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleRemoveRole(role.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              );
            })}
            {formData.roles.length === 0 && (
              <Text variant="body" color="muted" className="text-center py-4">
                No roles assigned
              </Text>
            )}
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      <Modal
        isOpen={showAddRoleModal}
        onClose={() => setShowAddRoleModal(false)}
        title="Add New Role"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={newRoleData.name}
              onChange={(e) =>
                setNewRoleData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter role name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newRoleData.description}
              onChange={(e) =>
                setNewRoleData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter role description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddRoleModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNewRole} disabled={!newRoleData.name}>
              Add Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
