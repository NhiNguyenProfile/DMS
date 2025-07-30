import { useState, useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import MultiSelect from "../../atoms/MultiSelect";
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
import { WORKFLOW_STATUS, ASSIGNED_TYPES, ENTITIES } from "../../../constants";
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
    legalEntities: [],
    request_type: "",
    steps: [],
  });

  const [errors, setErrors] = useState({});
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  // Legal entities options
  const legalEntitiesOptions = [
    { value: "DHV", label: "DHV" },
    { value: "DHBH", label: "DHBH" },
    { value: "DHHP", label: "DHHP" },
    { value: "DHHY", label: "DHHY" },
    { value: "DHGC", label: "DHGC" },
    { value: "DHGD", label: "DHGD" },
  ];
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
        legalEntities: workflow.legalEntities || [],
        request_type: workflow.request_type || "",
        steps:
          workflow.steps?.map((step) => ({
            ...step,
            subSteps: step.subSteps || [],
          })) || [],
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
    console.log("handleEditStep called with:", step); // Debug log
    console.log("Setting editingStep to:", step);
    console.log("Opening modal...");
    setEditingStep(step);
    setShowAddStepModal(true);
    console.log("Modal should be open now");
  };

  const handleSaveStep = (stepData) => {
    console.log("handleSaveStep called with:", stepData);
    console.log("editingStep:", editingStep);
    console.log("editingStep.id:", editingStep?.id);
    console.log("editingStep.parentId:", editingStep?.parentId);

    if (editingStep && editingStep.id) {
      console.log("Updating existing step with ID:", editingStep.id);
      // Update existing step or sub-step
      setFormData((prev) => ({
        ...prev,
        steps: prev.steps.map((step) => {
          if (step.id === editingStep.id) {
            return {
              ...stepData,
              id: step.id, // Preserve the original id
              order: step.order,
              subSteps: step.subSteps || [],
            };
          }
          // Check if editing a sub-step (recursive)
          if (step.subSteps && step.subSteps.length > 0) {
            const updatedSubSteps = updateSubStepRecursive(
              step.subSteps,
              editingStep.id,
              stepData
            );
            if (updatedSubSteps !== step.subSteps) {
              return { ...step, subSteps: updatedSubSteps };
            }
          }
          return step;
        }),
      }));
    } else if (editingStep && editingStep.parentId) {
      console.log("Adding new sub-step with parentId:", editingStep.parentId);
      // Add new sub-step (could be nested)
      const newSubStep = {
        ...stepData,
        id: Date.now(),
        order: editingStep.order,
        parentId: editingStep.parentId,
        subSteps: [],
      };

      setFormData((prev) => ({
        ...prev,
        steps: addSubStepToStructure(
          prev.steps,
          editingStep.parentId,
          newSubStep
        ),
      }));
    } else {
      console.log("Adding new main step");
      // Add new main step
      const newStep = {
        ...stepData,
        id: Date.now(),
        order: formData.steps.length + 1,
        subSteps: [],
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
    if (window.confirm("Are you sure you want to delete this step?")) {
      setFormData((prev) => ({
        ...prev,
        steps: deleteStepFromStructure(prev.steps, stepId),
      }));
    }
  };

  const deleteStepFromStructure = (steps, stepId) => {
    return steps
      .map((step) => {
        // Check if deleting a sub-step recursively
        if (step.subSteps && step.subSteps.length > 0) {
          const updatedSubSteps = deleteStepFromSubSteps(
            step.subSteps,
            stepId,
            step.order
          );
          return { ...step, subSteps: updatedSubSteps };
        }
        return step;
      })
      .filter((s) => s.id !== stepId) // Remove main step if it matches
      .map((step, index) => ({
        ...step,
        order: index + 1,
        // Re-number all sub-steps when main step order changes
        subSteps: renumberSubSteps(step.subSteps, index + 1),
      }));
  };

  const deleteStepFromSubSteps = (subSteps, stepId, parentOrder) => {
    return subSteps
      .map((subStep) => {
        // Check nested sub-steps
        if (subStep.subSteps && subStep.subSteps.length > 0) {
          const updatedNestedSubSteps = deleteStepFromSubSteps(
            subStep.subSteps,
            stepId,
            subStep.order
          );
          return { ...subStep, subSteps: updatedNestedSubSteps };
        }
        return subStep;
      })
      .filter((sub) => sub.id !== stepId) // Remove sub-step if it matches
      .map((subStep, index) => ({
        ...subStep,
        order: `${parentOrder}.${index + 1}`,
        // Re-number nested sub-steps
        subSteps: renumberSubSteps(
          subStep.subSteps,
          `${parentOrder}.${index + 1}`
        ),
      }));
  };

  const renumberSubSteps = (subSteps, parentOrder) => {
    if (!subSteps || subSteps.length === 0) return [];

    return subSteps.map((subStep, index) => ({
      ...subStep,
      order: `${parentOrder}.${index + 1}`,
      subSteps: renumberSubSteps(
        subStep.subSteps,
        `${parentOrder}.${index + 1}`
      ),
    }));
  };

  const updateSubStepRecursive = (subSteps, targetId, stepData) => {
    return subSteps.map((subStep) => {
      if (subStep.id === targetId) {
        // Found the target sub-step, update it
        return {
          ...stepData,
          order: subStep.order,
          subSteps: subStep.subSteps || [],
        };
      }

      // Check nested sub-steps
      if (subStep.subSteps && subStep.subSteps.length > 0) {
        const updatedNestedSubSteps = updateSubStepRecursive(
          subStep.subSteps,
          targetId,
          stepData
        );
        if (updatedNestedSubSteps !== subStep.subSteps) {
          return { ...subStep, subSteps: updatedNestedSubSteps };
        }
      }

      return subStep;
    });
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

    if (!formData.entity) {
      newErrors.entity = "Entity is required";
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

  const handleAddSubStep = (parentStepId, parentOrder = null) => {
    // Find parent step (could be main step or sub-step)
    let parentStep = null;
    let parentOrderStr = "";

    if (parentOrder) {
      // Adding sub-step to an existing sub-step
      parentOrderStr = parentOrder;
    } else {
      // Adding sub-step to main step
      parentStep = formData.steps.find((step) => step.id === parentStepId);
      if (parentStep) {
        parentOrderStr = parentStep.order.toString();
      }
    }

    if (parentOrderStr) {
      // Count existing sub-steps at this level
      const existingSubSteps = getAllSubStepsAtLevel(parentOrderStr);
      const subStepOrder = `${parentOrderStr}.${existingSubSteps.length + 1}`;

      setEditingStep({
        parentId: parentStepId,
        parentOrder: parentOrderStr,
        order: subStepOrder,
        isSubStep: true,
      });
      setShowAddStepModal(true);
    }
  };

  const getAllSubStepsAtLevel = (parentOrder) => {
    const allSubSteps = [];
    const searchInSteps = (steps, targetParentOrder) => {
      steps.forEach((step) => {
        if (step.subSteps) {
          step.subSteps.forEach((subStep) => {
            if (
              subStep.order.startsWith(`${targetParentOrder}.`) &&
              subStep.order.split(".").length ===
                targetParentOrder.split(".").length + 1
            ) {
              allSubSteps.push(subStep);
            }
            // Recursively search in nested sub-steps
            if (subStep.subSteps) {
              searchInSteps(
                [{ subSteps: subStep.subSteps }],
                targetParentOrder
              );
            }
          });
        }
      });
    };

    searchInSteps(formData.steps, parentOrder);
    return allSubSteps;
  };

  const addSubStepToStructure = (steps, parentId, newSubStep) => {
    return steps.map((step) => {
      if (step.id === parentId) {
        // Found the parent, add sub-step
        return {
          ...step,
          subSteps: [...(step.subSteps || []), newSubStep],
        };
      }

      // Search in sub-steps recursively
      if (step.subSteps && step.subSteps.length > 0) {
        const updatedSubSteps = addSubStepToSubSteps(
          step.subSteps,
          parentId,
          newSubStep
        );
        if (updatedSubSteps !== step.subSteps) {
          return { ...step, subSteps: updatedSubSteps };
        }
      }

      return step;
    });
  };

  const addSubStepToSubSteps = (subSteps, parentId, newSubStep) => {
    for (let i = 0; i < subSteps.length; i++) {
      const subStep = subSteps[i];

      if (subStep.id === parentId) {
        // Found the parent sub-step, add new sub-step
        const updatedSubSteps = [...subSteps];
        updatedSubSteps[i] = {
          ...subStep,
          subSteps: [...(subStep.subSteps || []), newSubStep],
        };
        return updatedSubSteps;
      }

      // Search deeper if this sub-step has its own sub-steps
      if (subStep.subSteps && subStep.subSteps.length > 0) {
        const updatedNestedSubSteps = addSubStepToSubSteps(
          subStep.subSteps,
          parentId,
          newSubStep
        );
        if (updatedNestedSubSteps !== subStep.subSteps) {
          const updatedSubSteps = [...subSteps];
          updatedSubSteps[i] = { ...subStep, subSteps: updatedNestedSubSteps };
          return updatedSubSteps;
        }
      }
    }

    return subSteps; // No changes
  };

  const renderWorkflowSteps = () => {
    return (
      <div className="space-y-6">
        {formData.steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Main Step */}
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white text-blue-500 px-3 py-1 rounded font-bold text-lg">
                    {step.order}
                  </div>
                  <div>
                    <Text
                      variant="body"
                      weight="semibold"
                      className="text-white"
                    >
                      {step.step_name}
                    </Text>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="bg-blue-400 px-2 py-1 rounded text-xs">
                        {step.type}
                      </span>
                      <span className="text-blue-100 text-sm">
                        SLA: {step.sla_hours}h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleAddSubStep(step.id)}
                    className="bg-white text-blue-500 border-white hover:bg-blue-50"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Sub-step
                  </Button>
                  <IconButton
                    variant="icon"
                    color="white"
                    size="small"
                    tooltip="Edit step"
                    onClick={() => handleEditStep(step)}
                    className="text-white hover:bg-blue-400"
                  >
                    <Edit size={16} />
                  </IconButton>
                  <IconButton
                    variant="icon"
                    color="white"
                    size="small"
                    tooltip="Delete step"
                    onClick={() => handleDeleteStep(step.id)}
                    className="text-white hover:bg-red-500"
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </div>

              {/* Arrow pointing to sub-steps */}
              {step.subSteps && step.subSteps.length > 0 && (
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gray-800"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              )}
            </div>

            {/* Sub-steps */}
            {step.subSteps && step.subSteps.length > 0 && (
              <div className="ml-12 mt-4 space-y-3">
                {step.subSteps.map((subStep, subIndex) =>
                  renderSubStep(subStep, subIndex, step.subSteps.length, 1)
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSubStep = (subStep, subIndex, totalSubSteps, level) => {
    const bgColor = level === 1 ? "bg-blue-400" : "bg-blue-300";
    const textColor = level === 1 ? "text-blue-400" : "text-blue-300";
    const hoverColor = level === 1 ? "hover:bg-blue-300" : "hover:bg-blue-200";

    return (
      <div key={subStep.id} className="relative">
        <div className={`${bgColor} text-white p-3 rounded-lg shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`bg-white ${textColor} px-2 py-1 rounded font-bold`}
              >
                {subStep.order}
              </div>
              <div>
                <Text variant="body" weight="medium" className="text-white">
                  {subStep.step_name}
                </Text>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`${
                      level === 1 ? "bg-blue-300" : "bg-blue-200"
                    } px-2 py-1 rounded text-xs`}
                  >
                    {subStep.type}
                  </span>
                  <span className="text-blue-100 text-sm">
                    SLA: {subStep.sla_hours}h
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="small"
                onClick={() => handleAddSubStep(subStep.id, subStep.order)}
                className="bg-white text-blue-500 border-white hover:bg-blue-50 text-xs px-2 py-1"
              >
                <Plus size={12} className="mr-1" />
                Add Sub-step
              </Button>
              <IconButton
                variant="icon"
                color="white"
                size="small"
                tooltip="Edit sub-step"
                onClick={() => handleEditStep(subStep)}
                className={`text-white ${hoverColor}`}
              >
                <Edit size={14} />
              </IconButton>
              <IconButton
                variant="icon"
                color="white"
                size="small"
                tooltip="Delete sub-step"
                onClick={() => handleDeleteStep(subStep.id)}
                className="text-white hover:bg-red-400"
              >
                <Trash2 size={14} />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Nested Sub-steps */}
        {subStep.subSteps && subStep.subSteps.length > 0 && (
          <div className="ml-8 mt-3 space-y-2">
            {subStep.subSteps.map((nestedSubStep, nestedIndex) =>
              renderSubStep(
                nestedSubStep,
                nestedIndex,
                subStep.subSteps.length,
                level + 1
              )
            )}
          </div>
        )}

        {/* Arrow for next sub-step at same level */}
        {subIndex < totalSubSteps - 1 && (
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
          </div>
        )}
      </div>
    );
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
            <div className="flex items-center space-x-2 mb-2">
              <Text variant="body" weight="medium">
                Entity *
              </Text>
              <Info
                size={14}
                className="text-gray-400"
                title="Select the entity type this workflow applies to"
              />
            </div>
            <Select
              options={ENTITIES.map((entity) => ({
                value: entity,
                label: entity,
              }))}
              value={formData.entity}
              onChange={(value) => handleInputChange("entity", value)}
              placeholder="Select Entity"
            />
            {errors.entity && (
              <Text variant="caption" color="error" className="mt-1">
                {errors.entity}
              </Text>
            )}
          </div>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Legal Entities *
            </Text>
            <MultiSelect
              options={legalEntitiesOptions}
              value={formData.legalEntities}
              onChange={(selectedValues) =>
                handleInputChange("legalEntities", selectedValues)
              }
              placeholder="Select legal entities"
              className="w-full"
            />
            <Text variant="caption" color="muted" className="mt-1">
              Select which legal entities this workflow applies to
            </Text>
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

        {/* Visual Workflow Builder */}
        <div className="space-y-4">
          {formData.steps.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Text variant="body" color="muted" className="mb-4">
                No steps configured yet
              </Text>
              <Button variant="outline" onClick={handleAddStep}>
                <Plus size={16} className="mr-2" />
                Add Your First Step
              </Button>
            </div>
          ) : (
            renderWorkflowSteps()
          )}
        </div>
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
