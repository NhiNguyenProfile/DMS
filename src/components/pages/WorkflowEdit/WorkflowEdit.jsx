import { useState, useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import Table from "../../atoms/Table";
import IconButton from "../../atoms/IconButton";
import AddStepModal from "./components/AddStepModal";
import {
  ArrowLeft,
  Save,
  Plus,
  ChevronUp,
  ChevronDown,
  Info,
  Edit,
  Trash2,
} from "lucide-react";
import { useRouter } from "../../../hooks/useRouter.jsx";
import { WORKFLOW_STATUS, ASSIGNED_TYPES } from "../../../constants";
import {
  FIELD_GROUPS,
  SAMPLE_WORKFLOWS,
  ENTITY_CONFIGS,
} from "../../../data/mockData";

const WorkflowEdit = () => {
  const { navigate } = useRouter();

  // Get URL params from hash (e.g., #workflow-edit?id=1&country=Vietnam&entity=Customer)
  const getUrlParams = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.split("?")[1] || "");
    return {
      id: params.get("id"),
      country: params.get("country"),
      entity: params.get("entity"),
    };
  };

  const { id: workflowId, country, entity } = getUrlParams();
  const isNewWorkflow = !workflowId;

  // Find workflow data
  const workflow = workflowId
    ? SAMPLE_WORKFLOWS.find((w) => w.id === parseInt(workflowId))
    : null;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
    entity: entity || "",
    request_type: "",
    steps: [],
  });

  const [errors, setErrors] = useState({});
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [availableRequestTypes, setAvailableRequestTypes] = useState([]);

  // Load available request types when entity changes
  useEffect(() => {
    if (entity && ENTITY_CONFIGS[entity]) {
      setAvailableRequestTypes(ENTITY_CONFIGS[entity].available_request_types);
    } else {
      setAvailableRequestTypes([]);
    }
  }, [entity]);

  // Load workflow data when editing
  useEffect(() => {
    if (workflow) {
      setFormData({
        name: workflow.name || "",
        description: workflow.description || "",
        status: workflow.status || "Active",
        entity: workflow.entity || "",
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
    setEditingStep(null);
    setShowAddStepModal(true);
  };

  const handleEditStep = (step) => {
    setEditingStep(step);
    setShowAddStepModal(true);
  };

  const handleSaveStep = (stepData) => {
    if (editingStep) {
      // Update existing step
      setFormData((prev) => ({
        ...prev,
        steps: prev.steps.map((step) =>
          step.id === editingStep.id ? { ...stepData, order: step.order } : step
        ),
      }));
    } else {
      // Add new step
      const newStep = {
        ...stepData,
        id: Date.now(),
        order: formData.steps.length + 1,
      };
      setFormData((prev) => ({
        ...prev,
        steps: [...prev.steps, newStep],
      }));
    }
    setShowAddStepModal(false);
    setEditingStep(null);
  };

  const handleCancelStep = () => {
    setShowAddStepModal(false);
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

    formData.steps.forEach((step) => {
      if (!step.step_name.trim()) {
        newErrors[`step_${step.id}_name`] = "Step name is required";
      }
      if (
        step.type === "Input" &&
        (!step.field_groups || step.field_groups.length === 0)
      ) {
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
      console.log("Saving workflow:", formData);
      // Here you would save to backend
      alert("Workflow saved successfully!");
      navigate("workflows");
    }
  };

  const handleCancel = () => {
    navigate("workflows");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleCancel}>
              <ArrowLeft size={20} className="mr-2" />
              Back to Workflows
            </Button>
            <div>
              <Text variant="heading" size="xl" weight="bold">
                {isNewWorkflow ? "New Workflow" : "Edit Workflow"}
              </Text>
              {!isNewWorkflow && (
                <Text variant="body" color="muted" className="mt-1">
                  {formData.entity} - {formData.request_type}
                </Text>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Save Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* General Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-6">
          General Information
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="md:col-span-2">
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
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter workflow description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Entity
            </Text>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
              {formData.entity || "Not specified"}
            </div>
          </div>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Request Type *
            </Text>
            <Select
              options={
                availableRequestTypes.length > 0
                  ? availableRequestTypes
                  : [
                      { value: "Create", label: "Create" },
                      { value: "Edit", label: "Edit" },
                      { value: "Disable", label: "Disable" },
                      { value: "Unlock", label: "Unlock" },
                    ]
              }
              value={formData.request_type}
              onChange={(value) => handleInputChange("request_type", value)}
              placeholder="Select Request Type"
              error={!!errors.request_type}
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <Text variant="heading" size="lg" weight="semibold">
            Steps Configuration
          </Text>
          <Button variant="outline" onClick={handleAddStep}>
            <Plus size={16} className="mr-2" />
            Add Step
          </Button>
        </div>

        {errors.steps && (
          <Text variant="caption" color="error" className="mb-4">
            {errors.steps}
          </Text>
        )}

        <div className="overflow-x-auto">
          <Table bordered>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Ord</Table.HeaderCell>
                <Table.HeaderCell>Step Name</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Field Group(s)</Table.HeaderCell>
                <Table.HeaderCell>Assigned Type</Table.HeaderCell>
                <Table.HeaderCell>Assignee(s)</Table.HeaderCell>
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
                    <Text variant="body">{step.step_name}</Text>
                  </Table.Cell>
                  <Table.Cell>
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
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" size="small">
                      {step.field_groups && step.field_groups.length > 0
                        ? step.field_groups
                            .map(
                              (groupCode) =>
                                FIELD_GROUPS.find(
                                  (g) => g.group_code === groupCode
                                )?.name || groupCode
                            )
                            .join(", ")
                        : "—"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" size="small">
                      {step.assigned_type || "User"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" size="small">
                      {step.assignee}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{step.sla_hours}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center space-x-1">
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
                        onClick={() => handleEditStep(step)}
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
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {formData.steps.length === 0 && (
          <div className="text-center py-8 border border-gray-200 rounded-lg mt-4">
            <Text variant="body" color="muted">
              No steps configured. Click "Add Step" to get started.
            </Text>
          </div>
        )}
      </div>

      {/* Add Step Modal */}
      <AddStepModal
        visible={showAddStepModal}
        onCancel={handleCancelStep}
        onOk={handleSaveStep}
        editingStep={editingStep}
      />
    </div>
  );
};

export default WorkflowEdit;
