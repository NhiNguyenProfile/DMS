import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import Table from "../../../atoms/Table";
import IconButton from "../../../atoms/IconButton";
import {
  X,
  Save,
  Plus,
  Check,
  X as XIcon,
  ChevronUp,
  ChevronDown,
  Info,
  Edit,
  Trash2,
} from "lucide-react";
import {
  WORKFLOW_STATUS,
  STEP_TYPES,
  TIMEOUT_ACTIONS,
  ROLES,
  USERS,
  REQUEST_TYPES,
} from "../../../../constants";
import { ENTITY_CONFIGS } from "../../../../data/mockData";
import { FIELD_GROUPS } from "../../../../data/mockData";

const WorkflowPanel = ({ workflow, selectedEntity, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
    request_type: "",
    steps: [],
  });

  const [errors, setErrors] = useState({});
  const [editingStep, setEditingStep] = useState(null);
  const [availableRequestTypes, setAvailableRequestTypes] = useState([]);

  // Load available request types when entity changes
  useEffect(() => {
    if (selectedEntity && ENTITY_CONFIGS[selectedEntity]) {
      setAvailableRequestTypes(
        ENTITY_CONFIGS[selectedEntity].available_request_types
      );
    } else {
      setAvailableRequestTypes([]);
    }
  }, [selectedEntity]);

  // Load workflow data when editing
  useEffect(() => {
    if (workflow) {
      setFormData({
        name: workflow.name || "",
        description: workflow.description || "",
        status: workflow.status || "Active",
        request_type: workflow.request_type || "",
        steps: workflow.steps || [],
      });
    }
  }, [workflow]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleStepChange = (stepId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step
      ),
    }));
  };

  const handleAddStep = () => {
    const newStep = {
      id: Date.now(),
      order: formData.steps.length + 1,
      step_name: "",
      type: "Input",
      field_groups: [],
      assignee_type: "Role",
      assignee: "",
      sla_hours: 24,
      timeout_action: "None",
    };
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
    setEditingStep(newStep.id);
  };

  const handleSaveStep = (stepId) => {
    setEditingStep(null);
  };

  const handleCancelStep = (stepId) => {
    if (formData.steps.find((s) => s.id === stepId && !s.step_name)) {
      // Remove new step if it's empty
      setFormData((prev) => ({
        ...prev,
        steps: prev.steps.filter((s) => s.id !== stepId),
      }));
    }
    setEditingStep(null);
  };

  const handleDeleteStep = (stepId) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps
        .filter((s) => s.id !== stepId)
        .map((step, index) => ({
          ...step,
          order: index + 1,
        })),
    }));
  };

  const handleMoveStep = (stepId, direction) => {
    const steps = [...formData.steps];
    const stepIndex = steps.findIndex((s) => s.id === stepId);

    if (direction === "up" && stepIndex > 0) {
      [steps[stepIndex], steps[stepIndex - 1]] = [
        steps[stepIndex - 1],
        steps[stepIndex],
      ];
    } else if (direction === "down" && stepIndex < steps.length - 1) {
      [steps[stepIndex], steps[stepIndex + 1]] = [
        steps[stepIndex + 1],
        steps[stepIndex],
      ];
    }

    // Update order numbers
    const reorderedSteps = steps.map((step, index) => ({
      ...step,
      order: index + 1,
    }));

    setFormData((prev) => ({ ...prev, steps: reorderedSteps }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Workflow name is required";
    }

    if (!formData.request_type) {
      newErrors.request_type = "Request type is required";
    }

    if (formData.steps.length === 0) {
      newErrors.steps = "At least one step is required";
    }

    formData.steps.forEach((step, index) => {
      if (!step.step_name.trim()) {
        newErrors[`step_${step.id}_name`] = "Step name is required";
      }
      if (step.type === "Input" && step.field_groups.length === 0) {
        newErrors[`step_${step.id}_groups`] =
          "Field groups are required for Input steps";
      }
      if (!step.assignee && step.type !== "System") {
        newErrors[`step_${step.id}_assignee`] = "Assignee is required";
      }
      if (step.sla_hours < 0) {
        newErrors[`step_${step.id}_sla`] = "SLA must be >= 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const getAssigneeOptions = (stepType) => {
    if (stepType === "System") return [{ value: "System", label: "System" }];
    return ROLES;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-2/3 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Text variant="heading" size="lg" weight="semibold">
            {workflow ? "Edit Workflow" : "New Workflow"}
          </Text>
          <Button variant="ghost" size="small" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* General Info */}
          <div className="space-y-4">
            <Text variant="heading" size="md" weight="semibold">
              General Information
            </Text>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Text variant="body" weight="medium">
                    Workflow Name *
                  </Text>
                  <Info
                    size={14}
                    className="text-gray-400"
                    title="Enter a descriptive name for this workflow"
                  />
                </div>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter workflow name"
                  error={!!errors.name}
                />
                {errors.name && (
                  <Text variant="caption" color="error" className="mt-1">
                    {errors.name}
                  </Text>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Text variant="body" weight="medium">
                    Status
                  </Text>
                  <Info
                    size={14}
                    className="text-gray-400"
                    title="Set workflow status to Active or Inactive"
                  />
                </div>
                <Select
                  options={WORKFLOW_STATUS}
                  value={formData.status}
                  onChange={(value) => handleInputChange("status", value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Text variant="body" weight="medium">
                  Description
                </Text>
                <Info
                  size={14}
                  className="text-gray-400"
                  title="Optional description for this workflow"
                />
              </div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter workflow description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text variant="body" weight="medium" className="mb-2">
                  Entity
                </Text>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                  {selectedEntity}
                </div>
              </div>

              <div>
                <Text variant="body" weight="medium" className="mb-2">
                  Request Type *
                </Text>
                <Select
                  options={availableRequestTypes}
                  value={formData.request_type}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, request_type: value }))
                  }
                  placeholder="Select Request Type"
                />
                {errors.request_type && (
                  <Text variant="caption" color="error" className="mt-1">
                    {errors.request_type}
                  </Text>
                )}
              </div>
            </div>
          </div>

          {/* Steps Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Text variant="heading" size="md" weight="semibold">
                Steps Configuration
              </Text>
              <Button variant="outline" size="small" onClick={handleAddStep}>
                <Plus size={16} className="mr-2" />
                Add Step
              </Button>
            </div>

            {errors.steps && (
              <Text variant="caption" color="error">
                {errors.steps}
              </Text>
            )}

            <Table bordered>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Ord</Table.HeaderCell>
                  <Table.HeaderCell>Step Name</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Field Group(s)</Table.HeaderCell>
                  <Table.HeaderCell>Assignee</Table.HeaderCell>
                  <Table.HeaderCell>SLA (h)</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {formData.steps.map((step, index) => (
                  <Table.Row key={step.id}>
                    <Table.Cell>
                      <Text variant="body" weight="medium">
                        {step.order}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      {editingStep === step.id ? (
                        <Input
                          value={step.step_name}
                          onChange={(e) =>
                            handleStepChange(
                              step.id,
                              "step_name",
                              e.target.value
                            )
                          }
                          placeholder="Enter step name"
                          size="small"
                          error={!!errors[`step_${step.id}_name`]}
                        />
                      ) : (
                        <Text variant="body">{step.step_name}</Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {editingStep === step.id ? (
                        <Select
                          options={STEP_TYPES}
                          value={step.type}
                          onChange={(value) =>
                            handleStepChange(step.id, "type", value)
                          }
                          size="small"
                        />
                      ) : (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            step.type === "Input"
                              ? "bg-blue-100 text-blue-800"
                              : step.type === "Approval"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {step.type}
                        </span>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {editingStep === step.id ? (
                        <Select
                          options={FIELD_GROUPS.map((g) => ({
                            value: g.group_code,
                            label: g.name,
                          }))}
                          value={step.field_groups[0] || ""}
                          onChange={(value) =>
                            handleStepChange(
                              step.id,
                              "field_groups",
                              value ? [value] : []
                            )
                          }
                          placeholder="Select field group"
                          size="small"
                          disabled={step.type === "System"}
                          error={!!errors[`step_${step.id}_groups`]}
                        />
                      ) : (
                        <Text variant="body" size="small">
                          {step.field_groups.length > 0
                            ? FIELD_GROUPS.find(
                                (g) => g.group_code === step.field_groups[0]
                              )?.name || step.field_groups[0]
                            : "—"}
                        </Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {editingStep === step.id ? (
                        <Select
                          options={getAssigneeOptions(step.type)}
                          value={step.assignee}
                          onChange={(value) =>
                            handleStepChange(step.id, "assignee", value)
                          }
                          placeholder="Select assignee"
                          size="small"
                          disabled={step.type === "System"}
                          error={!!errors[`step_${step.id}_assignee`]}
                        />
                      ) : (
                        <Text variant="body" size="small">
                          {step.assignee}
                        </Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {editingStep === step.id ? (
                        <Input
                          type="number"
                          value={step.sla_hours}
                          onChange={(e) =>
                            handleStepChange(
                              step.id,
                              "sla_hours",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="Hours"
                          size="small"
                          error={!!errors[`step_${step.id}_sla`]}
                        />
                      ) : (
                        <Text variant="body">{step.sla_hours}</Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-1">
                        {editingStep === step.id ? (
                          <>
                            <IconButton
                              variant="icon"
                              color="green"
                              size="small"
                              tooltip="Save step"
                              onClick={() => handleSaveStep(step.id)}
                            >
                              <Check size={14} />
                            </IconButton>
                            <IconButton
                              variant="icon"
                              color="red"
                              size="small"
                              tooltip="Cancel"
                              onClick={() => handleCancelStep(step.id)}
                            >
                              <XIcon size={14} />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              variant="icon"
                              color="gray"
                              size="small"
                              tooltip="Move up"
                              onClick={() => handleMoveStep(step.id, "up")}
                              disabled={index === 0}
                            >
                              <ChevronUp size={14} />
                            </IconButton>
                            <IconButton
                              variant="icon"
                              color="gray"
                              size="small"
                              tooltip="Move down"
                              onClick={() => handleMoveStep(step.id, "down")}
                              disabled={index === formData.steps.length - 1}
                            >
                              <ChevronDown size={14} />
                            </IconButton>
                            <IconButton
                              variant="icon"
                              color="blue"
                              size="small"
                              tooltip="Edit step"
                              onClick={() => setEditingStep(step.id)}
                            >
                              <Edit size={14} />
                            </IconButton>
                            <IconButton
                              variant="icon"
                              color="red"
                              size="small"
                              tooltip="Delete step"
                              onClick={() => handleDeleteStep(step.id)}
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {formData.steps.length === 0 && (
              <div className="text-center py-8 border border-gray-200 rounded-lg">
                <Text variant="body" color="muted">
                  No steps configured. Click "Add Step" to get started.
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <Save size={16} className="mr-2" />
            Save Workflow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowPanel;
