import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Table from "../../../atoms/Table";
import IconButton from "../../../atoms/IconButton";
import { Select } from "antd";
import { Plus, Trash2, Settings } from "lucide-react";
import { FIELD_GROUPS } from "../../../../data/mockData";

const { Option } = Select;

const SectionConfig = ({ selectedEntity, selectedRequestType, disabled }) => {
  const [sections, setSections] = useState([]);

  // Sample initial data
  useEffect(() => {
    if (selectedEntity && selectedRequestType) {
      setSections([
        {
          id: 1,
          name: "Customer Information",
          field_groups: [
            { id: "general", name: "General Info" },
            { id: "contact", name: "Contact Info" },
          ],
        },
        {
          id: 2,
          name: "Financial Information",
          field_groups: [{ id: "credit", name: "Credit Info" }],
        },
      ]);
    }
  }, [selectedEntity, selectedRequestType]);

  const handleAddSection = () => {
    const newSection = {
      id: Date.now(),
      name: "",
      field_groups: [],
    };
    setSections([...sections, newSection]);
  };

  const handleSectionNameChange = (sectionId, name) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, name } : section
      )
    );
  };

  const handleDeleteSection = (sectionId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      setSections(sections.filter((section) => section.id !== sectionId));
    }
  };

  const handleAddFieldGroups = (sectionId, selectedGroupCodes) => {
    const newGroups = selectedGroupCodes.map((code) => {
      const group = FIELD_GROUPS.find((g) => g.group_code === code);
      return {
        id: group.group_code,
        name: group.name,
      };
    });

    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              field_groups: [
                ...section.field_groups,
                ...newGroups.filter(
                  (newGroup) =>
                    !section.field_groups.some(
                      (existing) => existing.id === newGroup.id
                    )
                ),
              ],
            }
          : section
      )
    );
  };

  const handleDeleteFieldGroup = (sectionId, groupId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              field_groups: section.field_groups.filter(
                (group) => group.id !== groupId
              ),
            }
          : section
      )
    );
  };

  const getAvailableFieldGroups = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    const usedGroupIds = section ? section.field_groups.map((g) => g.id) : [];

    return FIELD_GROUPS.filter(
      (group) => !usedGroupIds.includes(group.group_code)
    ).map((group) => ({
      value: group.group_code,
      label: group.name,
    }));
  };

  if (disabled) {
    return (
      <div className="text-center py-12">
        <Text variant="body" color="muted">
          Please select Entity and Request Type to configure sections
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Section Configuration
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Organize field groups into sections for better user experience
          </Text>
        </div>
        <Button variant="primary" onClick={handleAddSection}>
          <Plus size={16} className="mr-2" />
          Add New Section
        </Button>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 mr-4">
                <Text variant="body" weight="medium" className="mb-2">
                  Section Name *
                </Text>
                <Input
                  value={section.name}
                  onChange={(e) =>
                    handleSectionNameChange(section.id, e.target.value)
                  }
                  placeholder="Enter section name"
                />
              </div>
              <IconButton
                variant="icon"
                color="red"
                tooltip="Delete section"
                onClick={() => handleDeleteSection(section.id)}
              >
                <Trash2 size={16} />
              </IconButton>
            </div>

            {/* Field Groups Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text variant="body" weight="medium">
                  Field Groups in Section
                </Text>
                <AddFieldGroupButton
                  sectionId={section.id}
                  availableGroups={getAvailableFieldGroups(section.id)}
                  onAdd={handleAddFieldGroups}
                />
              </div>

              {section.field_groups.length > 0 ? (
                <Table bordered>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Group Name</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {section.field_groups.map((group) => (
                      <Table.Row key={group.id}>
                        <Table.Cell>
                          <Text variant="body">{group.name}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <IconButton
                            variant="icon"
                            color="red"
                            size="small"
                            tooltip="Remove from section"
                            onClick={() =>
                              handleDeleteFieldGroup(section.id, group.id)
                            }
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <Text variant="body" color="muted">
                    No field groups in this section. Click "Add Field Groups" to
                    add some.
                  </Text>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <Text variant="heading" size="md" weight="medium" className="mb-2">
            No Sections Configured
          </Text>
          <Text variant="body" color="muted" className="mb-4">
            Create sections to organize your field groups for better user
            experience.
          </Text>
          <Button variant="primary" onClick={handleAddSection}>
            <Plus size={16} className="mr-2" />
            Add Your First Section
          </Button>
        </div>
      )}
    </div>
  );
};

// Component for Add Field Groups button with dropdown
const AddFieldGroupButton = ({ sectionId, availableGroups, onAdd }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleAdd = () => {
    if (selectedGroups.length > 0) {
      onAdd(sectionId, selectedGroups);
      setSelectedGroups([]);
      setShowDropdown(false);
    }
  };

  const handleCancel = () => {
    setSelectedGroups([]);
    setShowDropdown(false);
  };

  if (availableGroups.length === 0) {
    return (
      <Text variant="caption" color="muted">
        All field groups are already added
      </Text>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="small"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Plus size={14} className="mr-1" />
        Add Field Groups
      </Button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <Text variant="body" weight="medium" className="mb-3">
            Select Field Groups to Add
          </Text>

          <Select
            mode="multiple"
            value={selectedGroups}
            onChange={setSelectedGroups}
            placeholder="Select field groups"
            className="mb-3 w-full"
          >
            {availableGroups.map((group) => (
              <Option key={group.value} value={group.value}>
                {group.label}
              </Option>
            ))}
          </Select>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="small" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={handleAdd}
              disabled={selectedGroups.length === 0}
            >
              Add Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionConfig;
