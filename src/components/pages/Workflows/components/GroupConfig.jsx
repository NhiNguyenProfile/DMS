import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Table from "../../../atoms/Table";
import IconButton from "../../../atoms/IconButton";
import Modal from "../../../atoms/Modal";
import MultiSelect from "../../../atoms/MultiSelect";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// Sample workflow groups data
const SAMPLE_WORKFLOW_GROUPS = [
  {
    id: 1,
    name: "Sales Team",
    description: "Sales department workflow group for customer management",
    users: [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@company.com",
        role: "Sales Manager",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@company.com",
        role: "Sales Executive",
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        role: "Sales Representative",
      },
    ],
  },
  {
    id: 2,
    name: "Finance Team",
    description: "Finance department for approval processes",
    users: [
      {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah.wilson@company.com",
        role: "Finance Manager",
      },
      {
        id: 5,
        name: "David Brown",
        email: "david.brown@company.com",
        role: "Accountant",
      },
    ],
  },
];

// Sample available users
const AVAILABLE_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Sales Manager",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Sales Executive",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Sales Representative",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Finance Manager",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@company.com",
    role: "Accountant",
  },
  {
    id: 6,
    name: "Lisa Chen",
    email: "lisa.chen@company.com",
    role: "Operations Manager",
  },
  {
    id: 7,
    name: "Tom Anderson",
    email: "tom.anderson@company.com",
    role: "Operations Specialist",
  },
  {
    id: 8,
    name: "Anna Garcia",
    email: "anna.garcia@company.com",
    role: "Process Coordinator",
  },
  {
    id: 9,
    name: "Robert Lee",
    email: "robert.lee@company.com",
    role: "Technical Lead",
  },
  {
    id: 10,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "QA Supervisor",
  },
];

const GroupConfig = () => {
  const [groups, setGroups] = useState(SAMPLE_WORKFLOW_GROUPS);
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    users: [],
  });
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleAddGroup = () => {
    setEditingGroup(null);
    setFormData({ name: "", description: "", users: [] });
    setSelectedUsers([]);
    setShowModal(true);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      users: group.users,
    });
    setSelectedUsers(group.users.map((u) => u.id));
    setShowModal(true);
  };

  const handleDeleteGroup = (groupId) => {
    if (
      window.confirm("Are you sure you want to delete this workflow group?")
    ) {
      setGroups(groups.filter((g) => g.id !== groupId));
    }
  };

  const handleSaveGroup = () => {
    if (!formData.name.trim()) {
      alert("Please enter group name");
      return;
    }

    // Get selected user objects
    const selectedUserObjects = AVAILABLE_USERS.filter((user) =>
      selectedUsers.includes(user.id)
    );

    const groupData = {
      ...formData,
      users: selectedUserObjects,
    };

    if (editingGroup) {
      // Update existing group
      setGroups(
        groups.map((g) =>
          g.id === editingGroup.id ? { ...g, ...groupData } : g
        )
      );
    } else {
      // Add new group
      const newGroup = {
        id: Date.now(),
        ...groupData,
      };
      setGroups([...groups, newGroup]);
    }

    setShowModal(false);
    setFormData({ name: "", description: "", users: [] });
    setSelectedUsers([]);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddUsers = (userIds) => {
    console.log("handleAddUsers called with:", userIds);
    console.log("Current selectedUsers:", selectedUsers);

    // userIds is the complete array of selected values from MultiSelect
    setSelectedUsers(userIds);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
  };

  const handleMoveUser = (userId, direction) => {
    const currentIndex = selectedUsers.indexOf(userId);
    if (currentIndex === -1) return;

    const newSelectedUsers = [...selectedUsers];

    if (direction === "up" && currentIndex > 0) {
      // Swap with previous user
      [newSelectedUsers[currentIndex], newSelectedUsers[currentIndex - 1]] = [
        newSelectedUsers[currentIndex - 1],
        newSelectedUsers[currentIndex],
      ];
    } else if (
      direction === "down" &&
      currentIndex < selectedUsers.length - 1
    ) {
      // Swap with next user
      [newSelectedUsers[currentIndex], newSelectedUsers[currentIndex + 1]] = [
        newSelectedUsers[currentIndex + 1],
        newSelectedUsers[currentIndex],
      ];
    }

    setSelectedUsers(newSelectedUsers);
  };

  const getAvailableUsers = () => {
    return AVAILABLE_USERS.filter((user) => !selectedUsers.includes(user.id));
  };

  const getSelectedUserObjects = () => {
    // Preserve order from selectedUsers array
    return selectedUsers
      .map((userId) => AVAILABLE_USERS.find((user) => user.id === userId))
      .filter(Boolean); // Remove any undefined users
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Group Configuration
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Manage workflow groups for user assignments across all entities
          </Text>
        </div>
        <Button variant="primary" onClick={handleAddGroup}>
          <Plus size={16} className="mr-2" />
          Add Group
        </Button>
      </div>

      {/* Groups Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table hover bordered>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Group Name</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {groups.map((group) => (
              <Table.Row key={group.id} hover>
                <Table.Cell>
                  <div className="flex items-center">
                    <Users size={16} className="text-blue-600 mr-2" />
                    <Text variant="body" weight="medium">
                      {group.name}
                    </Text>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Text variant="body" color="muted">
                    {group.description}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center space-x-2">
                    <IconButton
                      variant="icon"
                      color="blue"
                      tooltip="Edit group"
                      onClick={() => handleEditGroup(group)}
                    >
                      <Edit size={16} />
                    </IconButton>
                    <IconButton
                      variant="icon"
                      color="red"
                      tooltip="Delete group"
                      onClick={() => handleDeleteGroup(group.id)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        {/* Empty State */}
        {groups.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <Text variant="heading" size="md" weight="medium" className="mb-2">
              No Workflow Groups
            </Text>
            <Text variant="body" color="muted" className="mb-4">
              Create workflow groups to organize users for workflow assignments
            </Text>
            <Button variant="primary" onClick={handleAddGroup}>
              <Plus size={16} className="mr-2" />
              Add Your First Group
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Group Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingGroup ? "Edit Workflow Group" : "Add Workflow Group"}
        size="large"
      >
        <div className="space-y-6">
          {/* Group Name */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Group Name *
            </Text>
            <Input
              placeholder="Enter group name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Description
            </Text>
            <Input
              placeholder="Enter group description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          {/* Users Management */}
          <div>
            <Text variant="body" weight="medium" className="mb-3">
              Group Members
            </Text>

            {/* Add Users */}
            <div className="mb-4">
              <MultiSelect
                placeholder="Select users to add to group"
                options={AVAILABLE_USERS.map((user) => ({
                  value: user.id,
                  label: `${user.name} (${user.role})`,
                }))}
                onChange={(values) => handleAddUsers(values)}
                value={selectedUsers}
              />
            </div>

            {/* Selected Users Table */}
            {getSelectedUserObjects().length > 0 && (
              <div className="border border-gray-200 rounded-lg">
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Order</Table.HeaderCell>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>Role</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {getSelectedUserObjects().map((user, index) => (
                      <Table.Row key={user.id}>
                        <Table.Cell>
                          <div className="flex items-center gap-2">
                            <Text
                              variant="body"
                              weight="medium"
                              className="min-w-[20px]"
                            >
                              {index + 1}
                            </Text>
                            <div className="flex flex-col gap-1">
                              <IconButton
                                variant="icon"
                                color="gray"
                                size="small"
                                tooltip="Move up"
                                onClick={() => handleMoveUser(user.id, "up")}
                                disabled={index === 0}
                              >
                                <ChevronUp size={12} />
                              </IconButton>
                              <IconButton
                                variant="icon"
                                color="gray"
                                size="small"
                                tooltip="Move down"
                                onClick={() => handleMoveUser(user.id, "down")}
                                disabled={
                                  index === getSelectedUserObjects().length - 1
                                }
                              >
                                <ChevronDown size={12} />
                              </IconButton>
                            </div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="body" weight="medium">
                            {user.name}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="body" color="muted">
                            {user.email}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="body">{user.role}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <IconButton
                            variant="icon"
                            color="red"
                            size="small"
                            tooltip="Remove from group"
                            onClick={() => handleRemoveUser(user.id)}
                          >
                            <X size={14} />
                          </IconButton>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            )}

            {getSelectedUserObjects().length === 0 && (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <Users size={32} className="mx-auto text-gray-400 mb-2" />
                <Text variant="body" color="muted">
                  No users selected. Use the multi-select above to add users to
                  this group.
                </Text>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveGroup}>
              {editingGroup ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GroupConfig;
