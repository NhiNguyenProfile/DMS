import { useState } from "react";
import { ArrowLeft, Plus, Save, Shield, Search } from "lucide-react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Modal from "../../../atoms/Modal";
import MultiSelect from "../../../atoms/MultiSelect";

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
  // Available roles for selection
  const availableRoles = DEFAULT_AVAILABLE_ROLES;

  const [formData, setFormData] = useState(() => ({
    username: account?.username || "",
    fullName: account?.fullName || "",
    email: account?.email || "",
    department: account?.department || "",
    status: account?.status || "Active",
    // New structure: array of role-legal entity assignments
    roleAssignments: account?.roleAssignments || [], // [{ roleId, roleName, roleDescription, allLegal, legalEntities }]
  }));

  const LEGAL_ENTITIES = [
    { id: 1, code: "DHV", name: "De Heus Vietnam" },
    { id: 2, code: "DHBH", name: "De Heus Entity 2" },
    { id: 3, code: "DHHP", name: "De Heus Entity 3" },
    { id: 4, code: "DHHY", name: "De Heus Entity 4" },
    { id: 5, code: "DHGC", name: "De Heus Entity 5" },
    { id: 6, code: "DHGD", name: "De Heus Entity 6" },
  ];

  // Modal states
  const [showAddRoleAssignmentModal, setShowAddRoleAssignmentModal] =
    useState(false);
  const [showEditRoleAssignmentModal, setShowEditRoleAssignmentModal] =
    useState(false);
  const [editingRoleAssignment, setEditingRoleAssignment] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [addRoleAssignmentForm, setAddRoleAssignmentForm] = useState({
    selectedRoleId: "",
    allLegal: false,
    legalEntities: [],
  });

  // Handle opening add role assignment modal
  const handleOpenAddRoleAssignmentModal = () => {
    setShowAddRoleAssignmentModal(true);
    setAddRoleAssignmentForm({
      selectedRoleId: "",
      allLegal: false,
      legalEntities: [],
    });
  };

  // Handle adding a role assignment
  const handleAddRoleAssignment = () => {
    if (!addRoleAssignmentForm.selectedRoleId) return;

    // Check if role already exists
    if (
      formData.roleAssignments.find(
        (ra) => ra.roleId === parseInt(addRoleAssignmentForm.selectedRoleId)
      )
    ) {
      alert("This role is already assigned to this user");
      return;
    }

    const role = availableRoles.find(
      (r) => r.id === parseInt(addRoleAssignmentForm.selectedRoleId)
    );

    const newRoleAssignment = {
      id: Date.now(),
      roleId: role.id,
      roleName: role.name,
      roleDescription: role.description,
      allLegal: addRoleAssignmentForm.allLegal,
      legalEntities: addRoleAssignmentForm.allLegal
        ? []
        : addRoleAssignmentForm.legalEntities,
    };

    setFormData((prev) => ({
      ...prev,
      roleAssignments: [...prev.roleAssignments, newRoleAssignment],
    }));
    setShowAddRoleAssignmentModal(false);
  };

  // Handle removing a role assignment
  const handleRemoveRoleAssignment = (roleAssignmentId) => {
    setFormData((prev) => ({
      ...prev,
      roleAssignments: prev.roleAssignments.filter(
        (ra) => ra.id !== roleAssignmentId
      ),
    }));
  };

  // Handle editing role assignment legal entities
  const handleEditRoleAssignment = (roleAssignment) => {
    setEditingRoleAssignment(roleAssignment);
    setShowEditRoleAssignmentModal(true);
  };

  const handleSaveRoleAssignmentLegalEntities = (
    roleAssignmentId,
    allLegal,
    legalEntities
  ) => {
    setFormData((prev) => ({
      ...prev,
      roleAssignments: prev.roleAssignments.map((ra) =>
        ra.id === roleAssignmentId
          ? { ...ra, allLegal, legalEntities: allLegal ? [] : legalEntities }
          : ra
      ),
    }));
    setShowEditRoleAssignmentModal(false);
    setEditingRoleAssignment(null);
  };

  // Format legal entities display
  const formatLegalEntitiesDisplay = (roleAssignment) => {
    if (roleAssignment.allLegal) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
          All legal
        </span>
      );
    }

    if (roleAssignment.legalEntities.length === 0) {
      return (
        <span className="text-gray-400 text-sm">No entities selected</span>
      );
    }

    const entities = roleAssignment.legalEntities
      .map((id) => LEGAL_ENTITIES.find((le) => le.id === id)?.code)
      .filter(Boolean);

    if (entities.length <= 3) {
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

    const displayEntities = entities.slice(0, 3);
    const remainingCount = entities.length - 3;

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

  // Handle form submission
  const handleSubmit = () => {
    // Show confirmation modal instead of saving directly
    setShowConfirmModal(true);
  };

  // Handle confirm save
  const handleConfirmSave = () => {
    // No validation needed for account info since it's read-only
    // Just validate that we have role assignments if needed
    onSave({
      ...formData,
      id: account?.id || Date.now(),
      createdAt: account?.createdAt || new Date().toISOString().split("T")[0],
    });
    setShowConfirmModal(false);
  };

  return (
    <>
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

        {/* Account Information Section - Profile Style */}
        <div className="mb-6">
          <Text variant="h4" weight="semibold" className="mb-4">
            Account Information
          </Text>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0">
                {formData.fullName
                  ? formData.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "N/A"}
              </div>

              {/* Account Details */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <Text variant="caption" color="muted" className="mb-1">
                    Full Name
                  </Text>
                  <Text variant="body" weight="medium">
                    {formData.fullName || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text variant="caption" color="muted" className="mb-1">
                    Username
                  </Text>
                  <Text variant="body" weight="medium">
                    {formData.username || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text variant="caption" color="muted" className="mb-1">
                    Email
                  </Text>
                  <Text variant="body" weight="medium">
                    {formData.email || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text variant="caption" color="muted" className="mb-1">
                    Department
                  </Text>
                  <Text variant="body" weight="medium">
                    {formData.department || "N/A"}
                  </Text>
                </div>
                <div>
                  <Text variant="caption" color="muted" className="mb-1">
                    Status
                  </Text>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        formData.status === "Active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    ></span>
                    <Text
                      variant="body"
                      weight="medium"
                      className={
                        formData.status === "Active"
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {formData.status}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Assignments Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Text
              variant="h4"
              weight="semibold"
              className="flex items-center gap-2"
            >
              <Shield size={20} />
              Role Assignments
            </Text>
            <Button onClick={handleOpenAddRoleAssignmentModal}>
              <Plus size={16} className="mr-2" />
              Add Role Assignment
            </Button>
          </div>

          {/* Role Assignments Table */}
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
                {formData.roleAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center">
                      <Shield
                        size={48}
                        className="mx-auto text-gray-300 mb-4"
                      />
                      <Text variant="body" color="muted">
                        No role assignments configured
                      </Text>
                      <Text variant="caption" color="muted" className="mt-1">
                        Click "Add Role Assignment" to get started
                      </Text>
                    </td>
                  </tr>
                ) : (
                  formData.roleAssignments.map((roleAssignment) => (
                    <tr key={roleAssignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <Text variant="body" weight="medium">
                            {roleAssignment.roleName}
                          </Text>
                          <Text variant="caption" color="muted">
                            {roleAssignment.roleDescription}
                          </Text>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                          onClick={() =>
                            handleEditRoleAssignment(roleAssignment)
                          }
                        >
                          {formatLegalEntitiesDisplay(roleAssignment)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() =>
                              handleEditRoleAssignment(roleAssignment)
                            }
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Edit
                          </Button>
                          <span className="text-gray-300">·</span>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() =>
                              handleRemoveRoleAssignment(roleAssignment.id)
                            }
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
      </div>

      {/* Add Role Assignment Modal */}
      <Modal
        isOpen={showAddRoleAssignmentModal}
        onClose={() => setShowAddRoleAssignmentModal(false)}
        title="Add Role Assignment"
        size="medium"
        className="max-w-5xl"
      >
        <div className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role <span className="text-red-500">*</span>
            </label>
            <RoleSearchSelect
              selectedRoleId={addRoleAssignmentForm.selectedRoleId}
              onChange={(roleId) =>
                setAddRoleAssignmentForm((prev) => ({
                  ...prev,
                  selectedRoleId: roleId,
                }))
              }
              availableRoles={availableRoles.filter(
                (role) =>
                  !formData.roleAssignments.find((ra) => ra.roleId === role.id)
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
                  checked={addRoleAssignmentForm.allLegal}
                  onChange={(e) =>
                    setAddRoleAssignmentForm((prev) => ({
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

              {!addRoleAssignmentForm.allLegal && (
                <div className="ml-6">
                  <Text variant="caption" color="muted" className="mb-2">
                    Select specific legal entities:
                  </Text>
                  <MultiSelect
                    value={addRoleAssignmentForm.legalEntities}
                    onChange={(entities) =>
                      setAddRoleAssignmentForm((prev) => ({
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
              onClick={() => setShowAddRoleAssignmentModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRoleAssignment}
              disabled={
                !addRoleAssignmentForm.selectedRoleId ||
                (!addRoleAssignmentForm.allLegal &&
                  addRoleAssignmentForm.legalEntities.length === 0)
              }
            >
              Add Role Assignment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Role Assignment Legal Entities Modal */}
      <Modal
        isOpen={showEditRoleAssignmentModal}
        onClose={() => setShowEditRoleAssignmentModal(false)}
        title="Edit Legal Entities"
        size="medium"
      >
        {editingRoleAssignment && (
          <EditRoleAssignmentLegalEntitiesForm
            roleAssignment={editingRoleAssignment}
            legalEntities={LEGAL_ENTITIES}
            onSave={handleSaveRoleAssignmentLegalEntities}
            onCancel={() => setShowEditRoleAssignmentModal(false)}
          />
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Update"
        size="small"
        className="max-w-lg"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Update Account Access
              </Text>
              <Text variant="body" color="muted">
                Are you sure you want to update the access permissions for{" "}
                <span className="font-medium">{formData.fullName}</span>? This
                will modify their role assignments and legal entity access.
              </Text>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSave}>Confirm Update</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

// Role Search Select Component
const RoleSearchSelect = ({ selectedRoleId, onChange, availableRoles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRoles = availableRoles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              <span className="font-medium">{selectedRole.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                {selectedRole.privilegeCount} privileges
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
                    <span className="font-medium">{role.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {role.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {role.privilegeCount} privileges
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

// Edit Role Assignment Legal Entities Form Component
const EditRoleAssignmentLegalEntitiesForm = ({
  roleAssignment,
  legalEntities,
  onSave,
  onCancel,
}) => {
  const [allLegal, setAllLegal] = useState(roleAssignment.allLegal);
  const [selectedEntities, setSelectedEntities] = useState(
    roleAssignment.legalEntities
  );

  const handleSave = () => {
    onSave(roleAssignment.id, allLegal, selectedEntities);
  };

  return (
    <div className="space-y-4">
      <div>
        <Text variant="body" weight="medium" className="mb-3">
          {roleAssignment.roleName}
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
