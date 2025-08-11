import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Table from "../../../atoms/Table";
import IconButton from "../../../atoms/IconButton";
import Modal from "../../../atoms/Modal";
import Select from "../../../atoms/Select";
import { Plus, Edit, Trash2, GitBranch, User, Search } from "lucide-react";

// Sample hierarchy data
const SAMPLE_HIERARCHY = [
  {
    id: 1,
    hierarchyName: "Sales Hierarchy",
    staff: {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    },
    reportTo: {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    },
  },
  {
    id: 2,
    hierarchyName: "Finance Hierarchy",
    staff: {
      id: 5,
      name: "David Brown",
      email: "david.brown@company.com",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    },
    reportTo: {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    },
  },
];

// Available users for selection
const AVAILABLE_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Sales Manager",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Sales Executive",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Sales Representative",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Finance Manager",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@company.com",
    role: "Accountant",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Lisa Chen",
    email: "lisa.chen@company.com",
    role: "HR Manager",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
  },
];

const HierarchyConfig = () => {
  const [hierarchies, setHierarchies] = useState(SAMPLE_HIERARCHY);
  const [showModal, setShowModal] = useState(false);
  const [editingHierarchy, setEditingHierarchy] = useState(null);
  const [formData, setFormData] = useState({
    hierarchyName: "",
    staff: null,
    reportTo: null,
  });
  const [staffSearchTerm, setStaffSearchTerm] = useState("");
  const [reportToSearchTerm, setReportToSearchTerm] = useState("");

  const handleAddHierarchy = () => {
    setEditingHierarchy(null);
    setFormData({ hierarchyName: "", staff: null, reportTo: null });
    setStaffSearchTerm("");
    setReportToSearchTerm("");
    setShowModal(true);
  };

  const handleEditHierarchy = (hierarchy) => {
    setEditingHierarchy(hierarchy);
    setFormData({
      hierarchyName: hierarchy.hierarchyName,
      staff: hierarchy.staff,
      reportTo: hierarchy.reportTo,
    });
    setStaffSearchTerm("");
    setReportToSearchTerm("");
    setShowModal(true);
  };

  const handleDeleteHierarchy = (hierarchyId) => {
    if (window.confirm("Are you sure you want to delete this hierarchy?")) {
      setHierarchies(hierarchies.filter((h) => h.id !== hierarchyId));
    }
  };

  const handleSaveHierarchy = () => {
    if (!formData.hierarchyName.trim()) {
      alert("Please enter hierarchy name");
      return;
    }
    if (!formData.staff) {
      alert("Please select staff member");
      return;
    }
    if (!formData.reportTo) {
      alert("Please select report to person");
      return;
    }

    const hierarchyData = { ...formData };

    if (editingHierarchy) {
      // Update existing hierarchy
      setHierarchies(
        hierarchies.map((h) =>
          h.id === editingHierarchy.id ? { ...h, ...hierarchyData } : h
        )
      );
    } else {
      // Add new hierarchy
      const newHierarchy = {
        id: Date.now(),
        ...hierarchyData,
      };
      setHierarchies([...hierarchies, newHierarchy]);
    }

    setShowModal(false);
    setFormData({ hierarchyName: "", staff: null, reportTo: null });
    setStaffSearchTerm("");
    setReportToSearchTerm("");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Filter users based on search term
  const getFilteredUsers = (searchTerm) => {
    if (!searchTerm) return AVAILABLE_USERS;
    return AVAILABLE_USERS.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const UserOption = ({ user, onSelect }) => (
    <div
      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
      onClick={() => onSelect(user)}
    >
      <img
        src={user.avatar}
        alt={user.name}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <Text variant="body" weight="medium">
          {user.name}
        </Text>
        <Text variant="caption" color="muted">
          {user.email}
        </Text>
      </div>
    </div>
  );

  const UserDisplay = ({ user, placeholder }) => {
    if (!user) {
      return (
        <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-md bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={16} className="text-gray-400" />
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
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <Text variant="body" weight="medium">
            {user.name}
          </Text>
          <Text variant="caption" color="muted">
            {user.email}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Hierarchy Configuration
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Configure staff hierarchy and reporting relationships for approval
            workflows
          </Text>
        </div>
        <Button variant="primary" onClick={handleAddHierarchy}>
          <Plus size={16} className="mr-2" />
          Add Hierarchy
        </Button>
      </div>

      {/* Hierarchy Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table hover bordered>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Hierarchy Name</Table.HeaderCell>
              <Table.HeaderCell>Staff</Table.HeaderCell>
              <Table.HeaderCell>Reports To</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {hierarchies.map((hierarchy) => (
              <Table.Row key={hierarchy.id} hover>
                <Table.Cell>
                  <div className="flex items-center">
                    <GitBranch size={16} className="text-blue-600 mr-2" />
                    <Text variant="body" weight="medium">
                      {hierarchy.hierarchyName}
                    </Text>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <img
                      src={hierarchy.staff.avatar}
                      alt={hierarchy.staff.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <Text variant="body" weight="medium">
                        {hierarchy.staff.name}
                      </Text>
                      <Text variant="caption" color="muted">
                        {hierarchy.staff.email}
                      </Text>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <img
                      src={hierarchy.reportTo.avatar}
                      alt={hierarchy.reportTo.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <Text variant="body" weight="medium">
                        {hierarchy.reportTo.name}
                      </Text>
                      <Text variant="caption" color="muted">
                        {hierarchy.reportTo.email}
                      </Text>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center space-x-2">
                    <IconButton
                      variant="icon"
                      color="blue"
                      tooltip="Edit hierarchy"
                      onClick={() => handleEditHierarchy(hierarchy)}
                    >
                      <Edit size={16} />
                    </IconButton>
                    <IconButton
                      variant="icon"
                      color="red"
                      tooltip="Delete hierarchy"
                      onClick={() => handleDeleteHierarchy(hierarchy.id)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {hierarchies.length === 0 && (
          <div className="text-center py-12">
            <GitBranch size={48} className="text-gray-300 mx-auto mb-4" />
            <Text variant="body" color="muted" className="mb-4">
              No hierarchy configurations yet
            </Text>
            <Button variant="outline" onClick={handleAddHierarchy}>
              <Plus size={16} className="mr-2" />
              Add Your First Hierarchy
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Hierarchy Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingHierarchy ? "Edit Hierarchy" : "Add Hierarchy"}
        size="large"
      >
        <div className="space-y-6">
          {/* Hierarchy Name */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Hierarchy Name *
            </Text>
            <Input
              placeholder="Enter hierarchy name"
              value={formData.hierarchyName}
              onChange={(e) =>
                handleInputChange("hierarchyName", e.target.value)
              }
            />
          </div>

          {/* Staff Selection */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Staff *
            </Text>
            <UserDisplay
              user={formData.staff}
              placeholder="Select staff member"
            />

            {/* Staff Search */}
            <div className="mt-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Search by name or email..."
                  value={staffSearchTerm}
                  onChange={(e) => setStaffSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {staffSearchTerm && (
                <div className="mt-2 border border-gray-200 rounded-md max-h-48 overflow-y-auto">
                  {getFilteredUsers(staffSearchTerm).map((user) => (
                    <UserOption
                      key={user.id}
                      user={user}
                      onSelect={(selectedUser) => {
                        handleInputChange("staff", selectedUser);
                        setStaffSearchTerm("");
                      }}
                    />
                  ))}
                  {getFilteredUsers(staffSearchTerm).length === 0 && (
                    <div className="p-4 text-center">
                      <Text variant="body" color="muted">
                        No users found
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Report To Selection */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Report To *
            </Text>
            <UserDisplay
              user={formData.reportTo}
              placeholder="Select report to person"
            />

            {/* Report To Search */}
            <div className="mt-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Search by name or email..."
                  value={reportToSearchTerm}
                  onChange={(e) => setReportToSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {reportToSearchTerm && (
                <div className="mt-2 border border-gray-200 rounded-md max-h-48 overflow-y-auto">
                  {getFilteredUsers(reportToSearchTerm).map((user) => (
                    <UserOption
                      key={user.id}
                      user={user}
                      onSelect={(selectedUser) => {
                        handleInputChange("reportTo", selectedUser);
                        setReportToSearchTerm("");
                      }}
                    />
                  ))}
                  {getFilteredUsers(reportToSearchTerm).length === 0 && (
                    <div className="p-4 text-center">
                      <Text variant="body" color="muted">
                        No users found
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveHierarchy}>
              {editingHierarchy ? "Update" : "Add"} Hierarchy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HierarchyConfig;
