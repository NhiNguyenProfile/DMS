import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Table from "../../../atoms/Table";
import IconButton from "../../../atoms/IconButton";
import Select from "../../../atoms/Select";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { FIELD_GROUPS, SAMPLE_FIELDS } from "../../../../data/mockData";

const FieldOverview = ({ selectedEntity, selectedRequestType, disabled }) => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);

  // Load fields when entity/request type changes
  useEffect(() => {
    if (selectedEntity && selectedRequestType) {
      // In real app, this would be an API call
      setFields(SAMPLE_FIELDS);
      setSelectedGroup(FIELD_GROUPS[0]?.group_code || "");
    }
  }, [selectedEntity, selectedRequestType]);

  // Filter fields by selected group
  useEffect(() => {
    if (selectedGroup) {
      setFilteredFields(
        fields.filter((field) => field.group_code === selectedGroup)
      );
    } else {
      setFilteredFields(fields);
    }
  }, [fields, selectedGroup]);

  const handleMoveField = (fieldId, direction) => {
    const currentFields = [...filteredFields];
    const fieldIndex = currentFields.findIndex((f) => f.id === fieldId);

    if (direction === "up" && fieldIndex > 0) {
      [currentFields[fieldIndex], currentFields[fieldIndex - 1]] = [
        currentFields[fieldIndex - 1],
        currentFields[fieldIndex],
      ];
    } else if (direction === "down" && fieldIndex < currentFields.length - 1) {
      [currentFields[fieldIndex], currentFields[fieldIndex + 1]] = [
        currentFields[fieldIndex + 1],
        currentFields[fieldIndex],
      ];
    }

    setFilteredFields(currentFields);
  };

  const handleDeleteField = (fieldId) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      setFields(fields.filter((f) => f.id !== fieldId));
    }
  };

  if (disabled) {
    return (
      <div className="text-center py-12">
        <Text variant="body" color="muted">
          Please select Entity and Request Type to configure fields
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Group Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Text variant="body" weight="medium">
            Field Group:
          </Text>
          <Select
            options={FIELD_GROUPS.map((g) => ({
              value: g.group_code,
              label: g.name,
            }))}
            value={selectedGroup}
            onChange={setSelectedGroup}
            placeholder="Select Group"
            className="w-64"
          />
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="small">
            <Plus size={16} className="mr-2" />
            New Group
          </Button>
          <Button variant="primary" size="small">
            <Plus size={16} className="mr-2" />
            Add Field
          </Button>
        </div>
      </div>

      {/* Field List Table */}
      <Table hover bordered>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Field Key</Table.HeaderCell>
            <Table.HeaderCell>Field Name</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Order</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredFields.map((field, index) => (
            <Table.Row key={field.id} hover>
              <Table.Cell>
                <Text
                  variant="body"
                  weight="medium"
                  className="font-mono text-sm"
                >
                  {field.field_code}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text variant="body">{field.label}</Text>
              </Table.Cell>
              <Table.Cell>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  {field.type}
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center space-x-1">
                  <Text variant="body" size="small" className="mr-2">
                    {field.order}
                  </Text>
                  <IconButton
                    variant="icon"
                    color="gray"
                    size="small"
                    tooltip="Move up"
                    onClick={() => handleMoveField(field.id, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp size={14} />
                  </IconButton>
                  <IconButton
                    variant="icon"
                    color="gray"
                    size="small"
                    tooltip="Move down"
                    onClick={() => handleMoveField(field.id, "down")}
                    disabled={index === filteredFields.length - 1}
                  >
                    <ChevronDown size={14} />
                  </IconButton>
                </div>
              </Table.Cell>
              <Table.Cell>
                <IconButton
                  variant="icon"
                  color="red"
                  tooltip="Delete field"
                  onClick={() => handleDeleteField(field.id)}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {filteredFields.length === 0 && (
        <div className="text-center py-8">
          <Text variant="body" color="muted">
            No fields found for the selected group
          </Text>
        </div>
      )}
    </div>
  );
};

export default FieldOverview;
