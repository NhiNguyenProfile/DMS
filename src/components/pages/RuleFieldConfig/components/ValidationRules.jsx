import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Table from "../../../atoms/Table";
import IconButton from "../../../atoms/IconButton";
import Tabs from "../../../atoms/Tabs";
import { Plus, Edit, Trash2 } from "lucide-react";
import { SAMPLE_VALIDATION_RULES } from "../../../../data/mockData";
import RulePanel from "./RulePanel";

const ValidationRules = ({ selectedEntity, selectedRequestType, disabled }) => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [showRulePanel, setShowRulePanel] = useState(false);

  // Load rules when entity/request type changes
  useEffect(() => {
    if (selectedEntity && selectedRequestType) {
      // Filter rules by entity and request type
      const filteredRules = SAMPLE_VALIDATION_RULES.filter(
        (rule) =>
          rule.applied_entity === selectedEntity &&
          rule.applied_request_type === selectedRequestType
      );
      setRules(filteredRules);
    }
  }, [selectedEntity, selectedRequestType]);

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setShowRulePanel(true);
  };

  const handleAddRule = () => {
    setSelectedRule(null);
    setShowRulePanel(true);
  };

  const handleDeleteRule = (ruleId) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      setRules(rules.filter((r) => r.id !== ruleId));
    }
  };

  const handleClosePanel = () => {
    setShowRulePanel(false);
    setSelectedRule(null);
  };

  if (disabled) {
    return (
      <div className="text-center py-12">
        <Text variant="body" color="muted">
          Please select Entity and Request Type to configure validation rules
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Text variant="heading" size="lg" weight="semibold">
          Validation Rules
        </Text>
        <Button variant="primary" onClick={handleAddRule}>
          <Plus size={16} className="mr-2" />
          Add Rule
        </Button>
      </div>

      {/* Rules Table */}
      <Table hover bordered>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Rule Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rules.map((rule) => (
            <Table.Row key={rule.id} hover>
              <Table.Cell>
                <Text variant="body" weight="medium">
                  {rule.rule_name}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text
                  variant="body"
                  color="muted"
                  className="max-w-xs truncate"
                >
                  {rule.rule_description}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    rule.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {rule.status}
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center space-x-2">
                  <IconButton
                    variant="icon"
                    color="blue"
                    tooltip="Edit rule"
                    onClick={() => handleEditRule(rule)}
                  >
                    <Edit size={16} />
                  </IconButton>
                  <IconButton
                    variant="icon"
                    color="red"
                    tooltip="Delete rule"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {rules.length === 0 && (
        <div className="text-center py-8">
          <Text variant="body" color="muted">
            No validation rules found for the selected entity and request type
          </Text>
        </div>
      )}

      {/* Rule Panel (Slide-in) */}
      {showRulePanel && (
        <RulePanel
          rule={selectedRule}
          selectedEntity={selectedEntity}
          selectedRequestType={selectedRequestType}
          onClose={handleClosePanel}
          onSave={(ruleData) => {
            if (selectedRule) {
              // Update existing rule
              setRules(
                rules.map((r) =>
                  r.id === selectedRule.id ? { ...r, ...ruleData } : r
                )
              );
            } else {
              // Add new rule
              const newRule = {
                id: Date.now(),
                applied_entity: selectedEntity,
                applied_request_type: selectedRequestType,
                ...ruleData,
              };
              setRules([...rules, newRule]);
            }
            handleClosePanel();
          }}
        />
      )}
    </div>
  );
};

export default ValidationRules;
