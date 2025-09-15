import { useState, useEffect, useRef } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Modal from "../../../atoms/Modal";
import { Search as SearchIcon, Plus, Edit, Trash2 } from "lucide-react";

// Sample duties data (in real app, this would come from API)
const AVAILABLE_DUTIES = [
  {
    id: 1,
    value: "Customer_Management_Duty",
    dutyName: "Customer_Management",
    description: "Full customer CRUD operations",
    privileges: [
      "Customer_Basic_Access",
      "Customer_Advanced_Edit",
      "Customer_Delete_Access",
    ],
    privilegeCount: 8,
    entities: ["Customer"],
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    value: "Sales_Order_Processing_Duty",
    dutyName: "Sales_Order_Processing",
    description: "Create and manage sales orders",
    privileges: [
      "Sales_Order_Create",
      "Sales_Order_Edit",
      "Sales_Order_View",
      "Sales_Order_Delete",
    ],
    privilegeCount: 12,
    entities: ["Sales order"],
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    value: "Inventory_Control_Duty",
    dutyName: "Inventory_Control_Duty",
    description: "Manage inventory and stock levels",
    privileges: ["Inventory_View", "Inventory_Edit", "Stock_Adjustment"],
    privilegeCount: 6,
    entities: ["Spare Part", "Inventory Item"],
    createdAt: "2024-01-15",
  },
  {
    id: 4,
    value: "Purchase_Management_Duty",
    dutyName: "Purchase_Management_Duty",
    description: "Handle purchase orders and suppliers",
    privileges: [
      "Purchase_Order_Create",
      "Purchase_Order_Edit",
      "Supplier_Management",
    ],
    privilegeCount: 10,
    entities: ["Purchase order", "Supplier"],
    createdAt: "2024-01-18",
  },
  {
    id: 5,
    value: "Financial_Reporting_Duty",
    dutyName: "Financial_Reporting_Duty",
    description: "Access to financial reports and analytics",
    privileges: ["Financial_Reports_View", "Analytics_Access"],
    privilegeCount: 5,
    entities: ["Invoice", "Report"],
    createdAt: "2024-01-20",
  },
  {
    id: 6,
    value: "User_Administration_Duty",
    dutyName: "User_Administration_Duty",
    description: "Manage users and permissions",
    privileges: ["User_Management", "Role_Management", "Permission_Management"],
    privilegeCount: 7,
    entities: ["User Account", "Role"],
    createdAt: "2024-01-22",
  },
];

// SearchableDutySelect component with built-in search
const SearchableDutySelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Search and select duties...",
  className = "",
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
        setSearchTerm(""); // Clear search when closing
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      option.dutyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected labels
  const selectedLabels = value.map((val) => {
    const option = options.find((opt) => opt.id === val);
    return option ? option.dutyName : val;
  });

  const handleToggleOption = (optionId) => {
    const newValue = value.includes(optionId)
      ? value.filter((v) => v !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  const handleRemoveOption = (optionId, e) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== optionId);
    onChange(newValue);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Values Display */}
      <div
        className={`
          min-h-[40px] px-3 py-2 border border-gray-300 rounded-md cursor-pointer
          flex items-center justify-between bg-white
          ${
            disabled ? "bg-gray-50 cursor-not-allowed" : "hover:border-gray-400"
          }
          ${isOpen ? "border-blue-500 ring-1 ring-blue-500" : ""}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
              >
                {label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveOption(value[index], e)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">{placeholder}</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown with Search */}
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <SearchIcon
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Search duties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-sm"
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.id);
                return (
                  <div
                    key={option.id}
                    className={`
                      px-3 py-2 cursor-pointer flex items-center justify-between
                      ${
                        isSelected
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50"
                      }
                    `}
                    onClick={() => handleToggleOption(option.id)}
                  >
                    <div className="flex-1">
                      <Text variant="body" className="text-sm font-medium">
                        {option.dutyName}
                      </Text>
                      <Text variant="caption" color="muted" className="text-xs">
                        {option.description} • {option.privilegeCount}{" "}
                        privileges
                      </Text>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2">
                <Text variant="body" color="muted" className="text-sm">
                  {searchTerm
                    ? `No duties found for "${searchTerm}"`
                    : "No duties available"}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const RolesConfig = () => {
  // Sample roles data
  const [roles, setRoles] = useState([
    {
      id: 1,
      roleName: "Sales Manager",
      description: "Manages sales operations and customer relationships",
      duties: [1, 2], // Customer Management, Sales Order Processing
      dutyCount: 2,
      totalPrivileges: 20,
      entities: ["Customer", "Sales order"],
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      roleName: "Warehouse Supervisor",
      description: "Oversees inventory and purchase operations",
      duties: [3, 4], // Inventory Control, Purchase Management
      dutyCount: 2,
      totalPrivileges: 16,
      entities: ["Spare Part", "Inventory Item", "Purchase order", "Supplier"],
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      roleName: "System Administrator",
      description: "Full system access and user management",
      duties: [5, 6], // Financial Reporting, User Administration
      dutyCount: 2,
      totalPrivileges: 12,
      entities: ["Invoice", "Report", "User Account", "Role"],
      createdAt: "2024-01-25",
    },
    {
      id: 4,
      roleName: "Customer Service Rep",
      description: "Handle customer inquiries and basic order management",
      duties: [1], // Customer Management only
      dutyCount: 1,
      totalPrivileges: 8,
      entities: ["Customer", "Sales order"],
      createdAt: "2024-02-01",
    },
    {
      id: 5,
      roleName: "Inventory Manager",
      description: "Full inventory control and spare parts management",
      duties: [3, 4], // Inventory Control, Purchase Management
      dutyCount: 2,
      totalPrivileges: 18,
      entities: ["Spare Part", "Inventory Item", "Purchase order"],
      createdAt: "2024-02-05",
    },
    {
      id: 6,
      roleName: "Finance Officer",
      description: "Financial reporting and invoice management",
      duties: [5], // Financial Reporting
      dutyCount: 1,
      totalPrivileges: 6,
      entities: ["Invoice", "Report"],
      createdAt: "2024-02-10",
    },
  ]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    duties: [],
  });
  const [errors, setErrors] = useState({});

  // State for duty filtering and search
  const [dutySearchTerm, setDutySearchTerm] = useState("");

  // Get filtered available duties (exclude already selected ones)
  const getFilteredAvailableDuties = () => {
    return AVAILABLE_DUTIES.filter((duty) => {
      const matchesSearch =
        duty.dutyName.toLowerCase().includes(dutySearchTerm.toLowerCase()) ||
        duty.description.toLowerCase().includes(dutySearchTerm.toLowerCase());

      // Hide duties that are already selected
      const notSelected = !formData.duties.includes(duty.id);

      return matchesSearch && notSelected;
    });
  };

  // Get selected duties for display
  const getSelectedDuties = () => {
    return formData.duties
      .map((dutyId) => AVAILABLE_DUTIES.find((duty) => duty.id === dutyId))
      .filter(Boolean);
  };

  // Handle direct add duty
  const handleAddDutyDirectly = (dutyId) => {
    if (!formData.duties.includes(dutyId)) {
      setFormData((prev) => ({
        ...prev,
        duties: [...prev.duties, dutyId],
      }));
    }
  };

  // Handle remove duty
  const handleRemoveDuty = (dutyId) => {
    setFormData((prev) => ({
      ...prev,
      duties: prev.duties.filter((id) => id !== dutyId),
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      roleName: "",
      description: "",
      duties: [],
    });
    setErrors({});
    setDutySearchTerm("");
  };

  // Handle add role
  const handleAddRole = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Handle edit role
  const handleEditRole = (role) => {
    setEditingRole(role);
    setFormData({
      roleName: role.roleName,
      description: role.description,
      duties: [...role.duties],
    });
    setErrors({});
    setDutySearchTerm("");
    setShowEditModal(true);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.roleName.trim()) {
      newErrors.roleName = "Role name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.duties.length === 0) {
      newErrors.duties = "At least one duty must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save role
  const handleSaveRole = () => {
    if (!validateForm()) return;

    if (editingRole) {
      // Update existing role
      setRoles((prev) =>
        prev.map((role) =>
          role.id === editingRole.id
            ? {
                ...role,
                ...formData,
                dutyCount: formData.duties.length,
              }
            : role
        )
      );
      setShowEditModal(false);
      setEditingRole(null);
    } else {
      // Add new role
      const newRole = {
        id: Date.now(),
        ...formData,
        dutyCount: formData.duties.length,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRoles((prev) => [...prev, newRole]);
      setShowAddModal(false);
    }

    resetForm();
  };

  // Handle delete role
  const handleDeleteRole = (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
    }
  };

  // Table columns
  const columns = [
    {
      key: "roleName",
      label: "Role Name",
      render: (role) => (
        <div>
          <Text variant="body" weight="medium">
            {role.roleName}
          </Text>
          <Text variant="caption" color="muted">
            {role.description}
          </Text>
        </div>
      ),
    },
    {
      key: "duties",
      label: "Duties & Privileges",
      render: (role) => (
        <div>
          <Text variant="body">
            {role.dutyCount} duties • {role.totalPrivileges || 0} privileges
          </Text>
          <div className="flex flex-wrap gap-1 mt-1">
            {role.entities &&
              role.entities.slice(0, 3).map((entity, index) => (
                <span
                  key={index}
                  className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {entity}
                </span>
              ))}
            {role.entities && role.entities.length > 3 && (
              <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                +{role.entities.length - 3} more
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (role) => (
        <Text variant="body" color="muted">
          {new Date(role.createdAt).toLocaleDateString()}
        </Text>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (role) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleEditRole(role)}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleDeleteRole(role.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Text variant="h3" weight="semibold">
            Roles Configuration
          </Text>
          <Text variant="body" color="muted">
            Manage roles by combining multiple duties
          </Text>
        </div>
        <Button onClick={handleAddRole}>
          <Plus size={16} className="mr-2" />
          Add Role
        </Button>
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No roles configured yet
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Text variant="body" weight="medium">
                          {role.roleName}
                        </Text>
                        <Text variant="caption" color="muted" className="mt-1">
                          {role.description}
                        </Text>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Text variant="body">
                          {role.dutyCount} duties • {role.totalPrivileges || 0}{" "}
                          privileges
                        </Text>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {role.entities &&
                            role.entities.slice(0, 3).map((entity, index) => (
                              <span
                                key={index}
                                className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                              >
                                {entity}
                              </span>
                            ))}
                          {role.entities && role.entities.length > 3 && (
                            <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              +{role.entities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleEditRole(role)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleDeleteRole(role.id)}
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

      {/* Add/Edit Role Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setEditingRole(null);
          resetForm();
        }}
        title={editingRole ? "Edit Role" : "Add New Role"}
        size="large"
      >
        <div className="space-y-6">
          {/* Role Basic Info */}
          <div className="space-y-4">
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Role Name *
              </Text>
              <Input
                placeholder="Enter role name..."
                value={formData.roleName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, roleName: e.target.value }))
                }
                error={errors.roleName}
              />
            </div>

            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Description *
              </Text>
              <Input
                placeholder="Enter role description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                error={errors.description}
              />
            </div>
          </div>

          {/* Duties Selection - Two Column Layout */}
          <div>
            <Text variant="body" weight="medium" className="mb-4">
              Select Duties *
            </Text>
            {errors.duties && (
              <Text variant="caption" color="error" className="mb-2">
                {errors.duties}
              </Text>
            )}

            <div className="grid grid-cols-2 gap-6" style={{ height: "400px" }}>
              {/* Left Column - Available Duties */}
              <div className="border border-gray-200 rounded-lg flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                  <Text variant="body" weight="medium" className="mb-3">
                    Available Duties
                  </Text>

                  {/* Search Duties */}
                  <div className="relative">
                    <SearchIcon
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      placeholder="Search duties..."
                      value={dutySearchTerm}
                      onChange={(e) => setDutySearchTerm(e.target.value)}
                      className="pl-9"
                      size="small"
                    />
                  </div>
                </div>

                {/* Available Duties List */}
                <div className="flex-1 overflow-y-auto p-2">
                  {getFilteredAvailableDuties().map((duty) => (
                    <div
                      key={duty.id}
                      className="p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors"
                      onClick={() => handleAddDutyDirectly(duty.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <Plus size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Text
                            variant="body"
                            weight="medium"
                            className="text-sm"
                          >
                            {duty.dutyName}
                          </Text>
                          <Text
                            variant="caption"
                            color="muted"
                            className="text-xs"
                          >
                            {duty.description}
                          </Text>
                          <div className="flex items-center gap-2 mt-1">
                            <Text
                              variant="caption"
                              color="muted"
                              className="text-xs"
                            >
                              {duty.privilegeCount} privileges
                            </Text>
                            <span className="text-gray-300">•</span>
                            <div className="flex flex-wrap gap-1">
                              {duty.entities.map((entity, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {entity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {getFilteredAvailableDuties().length === 0 && (
                    <div className="p-4 text-center">
                      <Text variant="body" color="muted">
                        {dutySearchTerm
                          ? "No duties found"
                          : "All duties selected"}
                      </Text>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Selected Duties */}
              <div className="border border-gray-200 rounded-lg flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-blue-50 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <Text variant="body" weight="medium">
                      Selected Duties ({getSelectedDuties().length})
                    </Text>
                    {getSelectedDuties().length > 0 && (
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, duties: [] }))
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove All
                      </Button>
                    )}
                  </div>
                </div>

                {/* Selected Duties List */}
                <div className="flex-1 overflow-y-auto p-2">
                  {getSelectedDuties().map((duty) => (
                    <div
                      key={duty.id}
                      className="p-3 border border-gray-200 rounded-lg mb-2 bg-blue-50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <Text
                            variant="body"
                            weight="medium"
                            className="text-sm"
                          >
                            {duty.dutyName}
                          </Text>
                          <Text
                            variant="caption"
                            color="muted"
                            className="text-xs"
                          >
                            {duty.description}
                          </Text>
                          <div className="flex items-center gap-2 mt-1">
                            <Text
                              variant="caption"
                              color="muted"
                              className="text-xs"
                            >
                              {duty.privilegeCount} privileges
                            </Text>
                            <span className="text-gray-300">•</span>
                            <div className="flex flex-wrap gap-1">
                              {duty.entities.map((entity, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                                >
                                  {entity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => handleRemoveDuty(duty.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {getSelectedDuties().length === 0 && (
                    <div className="p-4 text-center">
                      <Text variant="body" color="muted">
                        No duties selected yet
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setEditingRole(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>
              {editingRole ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RolesConfig;
