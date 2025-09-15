import { useState, useEffect, useRef } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import MultiSelect from "../../../atoms/MultiSelect";
import Table from "../../../atoms/Table";
import Modal from "../../../atoms/Modal";
import Tabs from "../../../atoms/Tabs";
import Checkbox from "../../../atoms/Checkbox";
import { Search as SearchIcon, Plus, Edit, Trash2 } from "lucide-react";

// Available entities that can be added
const AVAILABLE_ENTITIES = [
  "Customer",
  "Sales order",
  "Spare Part",
  "Purchase order",
  "Invoice",
  "Quotation",
  "Service Request",
  "Inventory Item",
  "Supplier",
  "Contract",
  "Project",
  "Task",
  "Report",
  "User Account",
  "Role",
  "Department",
  "Location",
  "Asset",
  "Maintenance",
  "Quality Control",
];

// Default capabilities for new entities
const DEFAULT_CAPABILITIES = {
  new: false,
  copy: false,
  useMatch: false,
};

// SearchableMultiSelect component with built-in search
const SearchableMultiSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Search and select...",
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
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected labels
  const selectedLabels = value.map((val) => {
    const option = options.find((opt) => opt.value === val);
    return option ? option.label : val;
  });

  const handleToggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemoveOption = (optionValue, e) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== optionValue);
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
                placeholder="Search entities..."
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
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className={`
                      px-3 py-2 cursor-pointer flex items-center justify-between
                      ${
                        isSelected
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50"
                      }
                    `}
                    onClick={() => handleToggleOption(option.value)}
                  >
                    <Text variant="body" className="text-sm">
                      {option.label}
                    </Text>
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
                    ? `No entities found for "${searchTerm}"`
                    : "No entities available"}
                </Text>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Sample privileges data
const AVAILABLE_PRIVILEGES = [
  {
    id: 1,
    value: "Customer_Basic_Access",
    label:
      "Customer_Basic_Access (Customer - General: Customer, Address; Commerce: Privacy)",
    privilegeName: "Customer_Basic_Access",
    entity: "Customer",
    sessionFieldLevels: {
      General: {
        Customer: "View",
        Address: "Edit",
        "Contact information": "View",
      },
      Commerce: {
        Privacy: "View",
        Receipt: "None",
      },
    },
  },
  {
    id: 2,
    value: "Customer_Full_Access",
    label:
      "Customer_Full_Access (Customer - General: Customer, Address; Invoice: Delivery)",
    privilegeName: "Customer_Full_Access",
    entity: "Customer",
    sessionFieldLevels: {
      General: {
        Customer: "Edit",
        Address: "Edit",
        "Contact information": "Edit",
      },
      "Invoice and delivery": {
        Delivery: "Edit",
        "E-Invoice": "View",
      },
    },
  },
  {
    id: 3,
    value: "SparePart_Limited",
    label:
      "SparePart_Limited (Spare Part - General: Administration; Purchase: Administration)",
    privilegeName: "SparePart_Limited",
    entity: "Spare Part",
    sessionFieldLevels: {
      General: {
        Administration: "View",
      },
      Purchase: {
        Administration: "Edit",
        "Item Quality": "View",
      },
    },
  },
  {
    id: 4,
    value: "Customer_Conflict_Test",
    label: "Customer_Conflict_Test (Customer - General: Address conflict test)",
    privilegeName: "Customer_Conflict_Test",
    entity: "Customer",
    sessionFieldLevels: {
      General: {
        Customer: "Edit",
        Address: "View", // This will conflict with Customer_Basic_Access (Edit)
        "Contact information": "Edit",
      },
      Commerce: {
        Privacy: "Edit", // This will conflict with Customer_Basic_Access (View)
      },
    },
  },
];

// Sample duties data
const SAMPLE_DUTIES = [
  {
    id: 1,
    dutyName: "Manage_Customer_Data",
    description: "Full customer CRUD operations and data management",
    capabilities: {
      Customer: { new: false, copy: true, useMatch: false },
      "Sales order": { new: false, copy: false, useMatch: false },
    },
    privileges: ["Customer_Basic_Access", "Customer_Full_Access"],
    createdAt: "2025-01-15T12:00:00Z",
    updatedAt: "2025-01-15T12:00:00Z",
  },
  {
    id: 2,
    dutyName: "SparePart_Operations",
    description: "Manage spare parts inventory and purchase operations",
    capabilities: {
      "Spare Part": { new: true, copy: false, useMatch: true },
      "Purchase order": { new: false, copy: true, useMatch: false },
    },
    privileges: ["SparePart_Limited"],
    createdAt: "2025-01-15T12:30:00Z",
    updatedAt: "2025-01-15T12:30:00Z",
  },
];

const DutiesConfig = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [duties, setDuties] = useState(SAMPLE_DUTIES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDuty, setEditingDuty] = useState(null);
  const [formData, setFormData] = useState({
    dutyName: "",
    description: "",
    capabilities: {},
    privileges: [],
  });
  const [errors, setErrors] = useState({});
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // State for managing entities in capabilities
  const [selectedEntities, setSelectedEntities] = useState([
    "Customer",
    "Sales order",
    "Spare Part",
    "Purchase order",
  ]);
  const [showAddEntityDropdown, setShowAddEntityDropdown] = useState(false);
  const [entitySearchTerm, setEntitySearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // State for Privileges tab
  const [privilegeSearchTerm, setPrivilegeSearchTerm] = useState("");
  const [selectedEntityFilters, setSelectedEntityFilters] = useState([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAddEntityDropdown(false);
        setEntitySearchTerm(""); // Reset search term when closing
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter duties based on search
  const filteredDuties = duties.filter((duty) => {
    const matchesSearch =
      duty.dutyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      duty.privileges.some((privilege) =>
        privilege.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesSearch;
  });

  // Functions for managing entities
  const handleAddEntity = (entityName) => {
    if (!selectedEntities.includes(entityName)) {
      setSelectedEntities((prev) => [...prev, entityName]);
      // Add default capabilities for new entity
      setFormData((prev) => ({
        ...prev,
        capabilities: {
          ...prev.capabilities,
          [entityName]: { ...DEFAULT_CAPABILITIES },
        },
      }));
    }
    setShowAddEntityDropdown(false);
    setEntitySearchTerm(""); // Reset search term
  };

  const handleRemoveEntity = (entityName) => {
    setSelectedEntities((prev) =>
      prev.filter((entity) => entity !== entityName)
    );
    // Remove capabilities for removed entity
    setFormData((prev) => {
      const newCapabilities = { ...prev.capabilities };
      delete newCapabilities[entityName];
      return {
        ...prev,
        capabilities: newCapabilities,
      };
    });
  };

  const getAvailableEntities = () => {
    return AVAILABLE_ENTITIES.filter(
      (entity) =>
        !selectedEntities.includes(entity) &&
        entity.toLowerCase().includes(entitySearchTerm.toLowerCase())
    );
  };

  // Functions for Privileges tab
  const getUniqueEntities = () => {
    const entities = AVAILABLE_PRIVILEGES.map((p) => p.entity);
    return [...new Set(entities)];
  };

  const getFilteredLibraryPrivileges = () => {
    return AVAILABLE_PRIVILEGES.filter((privilege) => {
      const matchesSearch = privilege.privilegeName
        .toLowerCase()
        .includes(privilegeSearchTerm.toLowerCase());
      const matchesEntityFilter =
        selectedEntityFilters.length === 0 ||
        selectedEntityFilters.includes(privilege.entity);

      // Hide privileges that are already in the duty
      const notInDuty = !formData.privileges.includes(privilege.value);

      return matchesSearch && matchesEntityFilter && notInDuty;
    });
  };

  const handleAddPrivilegeDirectly = (privilegeValue) => {
    // Add privilege directly to duty when clicked
    if (!formData.privileges.includes(privilegeValue)) {
      setFormData((prev) => ({
        ...prev,
        privileges: [...prev.privileges, privilegeValue],
      }));
    }
  };

  const getSelectedPrivilegesDetails = () => {
    return AVAILABLE_PRIVILEGES.filter((p) =>
      formData.privileges.includes(p.value)
    );
  };

  const handleRemovePrivilege = (privilegeValue) => {
    setFormData((prev) => ({
      ...prev,
      privileges: prev.privileges.filter((p) => p !== privilegeValue),
    }));
  };

  const handleRemoveAllPrivileges = () => {
    setFormData((prev) => ({
      ...prev,
      privileges: [],
    }));
  };

  const handleAddDuty = () => {
    setEditingDuty(null);
    // Initialize capabilities with default values for selected entities
    const initialCapabilities = {};
    selectedEntities.forEach((entityName) => {
      initialCapabilities[entityName] = { ...DEFAULT_CAPABILITIES };
    });

    setFormData({
      dutyName: "",
      description: "",
      capabilities: initialCapabilities,
      privileges: [],
    });
    setErrors({});

    // Reset privileges tab state
    setPrivilegeSearchTerm("");
    setSelectedEntityFilters([]);

    setShowAddModal(true);
  };

  const handleEditDuty = (duty) => {
    setEditingDuty(duty);

    // Set selected entities based on existing capabilities
    const existingEntities = Object.keys(duty.capabilities || {});
    if (existingEntities.length > 0) {
      setSelectedEntities(existingEntities);
    }

    // Initialize capabilities with existing values
    const initialCapabilities = duty.capabilities || {};

    setFormData({
      dutyName: duty.dutyName,
      description: duty.description || "",
      capabilities: initialCapabilities,
      privileges: duty.privileges,
    });
    setErrors({});

    // Reset privileges tab state
    setPrivilegeSearchTerm("");
    setSelectedEntityFilters([]);

    setShowAddModal(true);
  };

  const handleDeleteDuty = (dutyId) => {
    if (window.confirm("Are you sure you want to delete this duty?")) {
      setDuties((prev) => prev.filter((duty) => duty.id !== dutyId));
    }
  };

  const handleCapabilityChange = (entity, capability, value) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: {
        ...prev.capabilities,
        [entity]: {
          ...prev.capabilities[entity],
          [capability]: value,
        },
      },
    }));
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.dutyName.trim()) {
      newErrors.dutyName = "Duty name is required";
    } else {
      // Check for duplicate duty name (excluding current editing duty)
      const isDuplicate = duties.some(
        (duty) =>
          duty.dutyName.toLowerCase() === formData.dutyName.toLowerCase() &&
          (!editingDuty || duty.id !== editingDuty.id)
      );
      if (isDuplicate) {
        newErrors.dutyName = "Duty name already exists. Try another.";
      }
    }

    if (!formData.privileges || formData.privileges.length === 0) {
      newErrors.privileges = "At least one privilege must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const dutyData = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    if (editingDuty) {
      setDuties((prev) =>
        prev.map((duty) =>
          duty.id === editingDuty.id ? { ...duty, ...dutyData } : duty
        )
      );
    } else {
      const newDuty = {
        id: Date.now(),
        ...dutyData,
        createdAt: new Date().toISOString(),
      };
      setDuties((prev) => [...prev, newDuty]);
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Duties Configuration
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Configure duties by grouping privileges (Level 2)
          </Text>
        </div>
        <Button onClick={handleAddDuty}>
          <Plus size={20} className="mr-2" />
          Add Duty
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <Input
          placeholder="Search duties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Duties Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Duty Name</Table.HeaderCell>
              <Table.HeaderCell>Capabilities</Table.HeaderCell>
              <Table.HeaderCell>Privileges</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredDuties.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan="4" className="text-center py-8">
                  <Text variant="body" color="muted">
                    {searchTerm
                      ? "No duties found matching your search"
                      : "No duties configured yet"}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredDuties.map((duty) => (
                <Table.Row key={duty.id} className="hover:bg-gray-50">
                  <Table.Cell>
                    <div>
                      <Text variant="body" weight="medium">
                        {duty.dutyName}
                      </Text>
                      {duty.description && (
                        <Text variant="caption" color="muted" className="mt-1">
                          {duty.description}
                        </Text>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="max-w-xs truncate">
                      Capabilities configured
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="max-w-xs truncate">
                      {duty.privileges.join(", ")}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleEditDuty(duty)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="small"
                        onClick={() => handleDeleteDuty(duty.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Add/Edit Duty Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingDuty ? "Edit Duty" : "Add New Duty"}
        size="large"
      >
        <div className="space-y-6">
          {/* Duty Name */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Duty Name *
            </Text>
            <Input
              value={formData.dutyName}
              onChange={(e) => handleInputChange("dutyName", e.target.value)}
              placeholder="e.g., Manage_Customer_Data"
              error={!!errors.dutyName}
            />
            {errors.dutyName && (
              <Text variant="caption" color="error" className="mt-1">
                {errors.dutyName}
              </Text>
            )}
          </div>

          {/* Description */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Description
            </Text>
            <Input
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="e.g., Full customer CRUD operations and data management"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultTab="capabilities" variant="default">
            <Tabs.Panel tabId="capabilities" label="Capabilities">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Text variant="body" weight="medium">
                      Entity Capabilities Configuration
                    </Text>
                    <Text variant="caption" color="muted">
                      Enable/disable workflow entry points for each entity
                    </Text>
                  </div>

                  {/* Add Entity Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => {
                        setShowAddEntityDropdown(!showAddEntityDropdown);
                        if (!showAddEntityDropdown) {
                          setEntitySearchTerm(""); // Reset search when opening
                        }
                      }}
                      disabled={
                        AVAILABLE_ENTITIES.filter(
                          (entity) => !selectedEntities.includes(entity)
                        ).length === 0
                      }
                    >
                      <Plus size={16} className="mr-2" />
                      Add Entity
                    </Button>

                    {showAddEntityDropdown && (
                      <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {/* Search Box */}
                        <div className="p-3 border-b border-gray-200">
                          <div className="relative">
                            <SearchIcon
                              size={16}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <Input
                              placeholder="Search entities..."
                              value={entitySearchTerm}
                              onChange={(e) =>
                                setEntitySearchTerm(e.target.value)
                              }
                              className="pl-9 text-sm"
                              size="small"
                            />
                          </div>
                        </div>

                        {/* Entity List */}
                        <div className="max-h-48 overflow-y-auto">
                          {getAvailableEntities().length === 0 ? (
                            <div className="px-3 py-4 text-center text-sm text-gray-500">
                              {entitySearchTerm
                                ? "No entities found"
                                : "All entities added"}
                            </div>
                          ) : (
                            getAvailableEntities().map((entityName) => (
                              <button
                                key={entityName}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                                onClick={() => handleAddEntity(entityName)}
                              >
                                {entityName}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Entity</Table.HeaderCell>
                        <Table.HeaderCell>New</Table.HeaderCell>
                        <Table.HeaderCell>Copy</Table.HeaderCell>
                        <Table.HeaderCell>Use-match</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {selectedEntities.length === 0 ? (
                        <Table.Row>
                          <Table.Cell colSpan="5" className="text-center py-8">
                            <Text variant="body" color="muted">
                              No entities selected. Click "Add Entity" to add
                              entities.
                            </Text>
                          </Table.Cell>
                        </Table.Row>
                      ) : (
                        selectedEntities.map((entityName) => (
                          <Table.Row key={entityName}>
                            <Table.Cell>
                              <Text variant="body" weight="medium">
                                {entityName}
                              </Text>
                            </Table.Cell>
                            <Table.Cell>
                              <Checkbox
                                checked={
                                  formData.capabilities[entityName]?.new ||
                                  false
                                }
                                onChange={(checked) =>
                                  handleCapabilityChange(
                                    entityName,
                                    "new",
                                    checked
                                  )
                                }
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Checkbox
                                checked={
                                  formData.capabilities[entityName]?.copy ||
                                  false
                                }
                                onChange={(checked) =>
                                  handleCapabilityChange(
                                    entityName,
                                    "copy",
                                    checked
                                  )
                                }
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Checkbox
                                checked={
                                  formData.capabilities[entityName]?.useMatch ||
                                  false
                                }
                                onChange={(checked) =>
                                  handleCapabilityChange(
                                    entityName,
                                    "useMatch",
                                    checked
                                  )
                                }
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Button
                                variant="ghost"
                                size="small"
                                onClick={() => handleRemoveEntity(entityName)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      )}
                    </Table.Body>
                  </Table>
                </div>
              </div>
            </Tabs.Panel>

            <Tabs.Panel tabId="privileges" label="Privileges">
              <div className="h-96 flex gap-4">
                {/* Left Pane - Library */}
                <div className="flex-1 border border-gray-200 rounded-lg flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <Text variant="body" weight="medium" className="mb-3">
                      Library
                    </Text>

                    {/* Search */}
                    <div className="relative mb-3">
                      <SearchIcon
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        placeholder="Search privileges..."
                        value={privilegeSearchTerm}
                        onChange={(e) => setPrivilegeSearchTerm(e.target.value)}
                        className="pl-9 text-sm"
                        size="small"
                      />
                    </div>

                    {/* Entity Filter with Built-in Search */}
                    <div className="space-y-2">
                      <Text variant="caption" color="muted">
                        Filter by entities:
                      </Text>

                      {/* Enhanced MultiSelect with Search - Auto-apply filter */}
                      <SearchableMultiSelect
                        placeholder="Search and select entities to filter..."
                        options={getUniqueEntities().map((entity) => ({
                          value: entity,
                          label: entity,
                        }))}
                        value={selectedEntityFilters}
                        onChange={(newFilters) => {
                          setSelectedEntityFilters(newFilters);
                          // Auto-apply filter immediately when selection changes
                        }}
                        className="text-sm"
                      />

                      {selectedEntityFilters.length > 0 && (
                        <Text
                          variant="caption"
                          color="muted"
                          className="text-xs"
                        >
                          Showing privileges for:{" "}
                          {selectedEntityFilters.join(", ")}
                        </Text>
                      )}
                    </div>
                  </div>

                  {/* Privilege List */}
                  <div className="flex-1 overflow-y-auto p-2">
                    {getFilteredLibraryPrivileges().map((privilege) => (
                      <div
                        key={privilege.id}
                        className="p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-colors"
                        onClick={() =>
                          handleAddPrivilegeDirectly(privilege.value)
                        }
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
                              {privilege.privilegeName}
                            </Text>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                {privilege.entity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {getFilteredLibraryPrivileges().length === 0 && (
                      <div className="text-center py-8">
                        <Text variant="body" color="muted">
                          No privileges found
                        </Text>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Pane - In this Duty */}
                <div className="flex-1 border border-gray-200 rounded-lg flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <Text variant="body" weight="medium">
                        In this Duty ({formData.privileges.length})
                      </Text>
                      {formData.privileges.length > 0 && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={handleRemoveAllPrivileges}
                        >
                          Remove All
                        </Button>
                      )}
                    </div>

                    {errors.privileges && (
                      <Text variant="caption" color="error" className="mb-2">
                        {errors.privileges}
                      </Text>
                    )}
                  </div>

                  {/* Selected Privileges List */}
                  <div className="flex-1 overflow-y-auto p-2">
                    {formData.privileges.length === 0 ? (
                      <div className="text-center py-8">
                        <Text variant="body" color="muted">
                          No privileges selected
                        </Text>
                        <Text variant="caption" color="muted" className="mt-1">
                          Select privileges from the library to add them here
                        </Text>
                      </div>
                    ) : (
                      getSelectedPrivilegesDetails().map((privilege) => (
                        <div
                          key={privilege.id}
                          className="p-3 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <Text
                                variant="body"
                                weight="medium"
                                className="text-sm"
                              >
                                {privilege.privilegeName}
                              </Text>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                  {privilege.entity}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() =>
                                handleRemovePrivilege(privilege.value)
                              }
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </Tabs.Panel>
          </Tabs>

          {/* Modal Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingDuty ? "Save Changes" : "Save Duty"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DutiesConfig;
