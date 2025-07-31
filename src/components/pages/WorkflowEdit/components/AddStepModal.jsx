import { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  Switch,
  Form,
  Row,
  Col,
  Divider,
  Button,
} from "antd";
import { Plus, Trash2, Info } from "lucide-react";
import Text from "../../../atoms/Text";
import Tabs from "../../../atoms/Tabs";
import ApprovalTreePreview from "./ApprovalTreePreview";
import {
  STEP_TYPES,
  ASSIGNED_TYPES,
  USERS,
  GROUPS,
  MAIL_RECIPIENTS,
} from "../../../../constants";

const { Option } = Select;

// Sample team members data
const TEAM_MEMBERS = {
  "Sales Team": [
    { name: "John Doe", title: "Sales Manager", avatarUrl: null },
    { name: "Jane Smith", title: "Sales Executive", avatarUrl: null },
    { name: "Mike Johnson", title: "Sales Representative", avatarUrl: null },
  ],
  "Finance Team": [
    { name: "Sarah Wilson", title: "Finance Manager", avatarUrl: null },
    { name: "David Brown", title: "Accountant", avatarUrl: null },
  ],
  "Operations Team": [
    { name: "Lisa Chen", title: "Operations Manager", avatarUrl: null },
    { name: "Tom Anderson", title: "Operations Specialist", avatarUrl: null },
    { name: "Anna Garcia", title: "Process Coordinator", avatarUrl: null },
  ],
  "Technical Team": [
    { name: "Robert Lee", title: "Technical Lead", avatarUrl: null },
    { name: "Emily Davis", title: "Senior Developer", avatarUrl: null },
    { name: "Alex Kim", title: "QA Engineer", avatarUrl: null },
  ],
  "Management Team": [
    { name: "Tony Wilson", title: "Head of Division", avatarUrl: null },
    { name: "Linda Chen", title: "Deputy Director", avatarUrl: null },
  ],
};

// Mock data for available sections (will be moved to constants later)
const AVAILABLE_SECTIONS = [
  {
    id: 1,
    name: "Personal Information",
    field_groups: [
      { id: 1, name: "Basic Details" },
      { id: 2, name: "Contact Information" },
      { id: 3, name: "Address" },
    ],
  },
  {
    id: 2,
    name: "Financial Information",
    field_groups: [
      { id: 4, name: "Income Details" },
      { id: 5, name: "Bank Information" },
      { id: 6, name: "Credit History" },
    ],
  },
  {
    id: 3,
    name: "Employment Information",
    field_groups: [
      { id: 7, name: "Current Employment" },
      { id: 8, name: "Employment History" },
      { id: 9, name: "References" },
    ],
  },
];

const AddStepModal = ({
  visible,
  onCancel,
  onOk,
  editingStep = null,
  allSteps = [],
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("basic");
  const [showApprovalTree, setShowApprovalTree] = useState(false);
  const [approvalTreeKey, setApprovalTreeKey] = useState(0); // Force re-render
  const [stepData, setStepData] = useState({
    step_name: "",
    type: "Entry Data",
    selected_sections: [],
    section_field_groups: [],
    assigned_type: "User",
    assignee: "",
    sla_hours: 24,
    mail_cc: [],
    stepback: "",
    step_resubmit: "",
    is_parallel: false,
    approve: false,
    reject: false,
    has_comment: false,
    request_update: false,
    criteria: "",
  });

  // Load step data when editing
  useEffect(() => {
    if (!visible) return; // Only run when modal is visible

    // Reset activeTab when modal opens
    setActiveTab("basic");

    console.log("AddStepModal useEffect - editingStep:", editingStep); // Debug log
    console.log("Modal visible:", visible);
    console.log("editingStep.id:", editingStep?.id);
    console.log(
      "editingStep keys:",
      editingStep ? Object.keys(editingStep) : "no editingStep"
    );

    if (editingStep && (editingStep.id || editingStep.step_name)) {
      console.log("Loading existing step data:", editingStep);
      const stepDataToLoad = {
        step_name: editingStep.step_name || "",
        type: editingStep.type || "Entry Data",
        selected_sections: editingStep.selected_sections || [],
        section_field_groups: editingStep.section_field_groups || [],
        assigned_type: editingStep.assigned_type || "User",
        assignee: editingStep.assignee || "",
        sla_hours: editingStep.sla_hours || 24,
        mail_cc: editingStep.mail_cc || [],
        stepback: editingStep.stepback || "",
        step_resubmit: editingStep.step_resubmit || "",
        is_parallel: editingStep.is_parallel || false,
        approve: editingStep.approve || false,
        reject: editingStep.reject || false,
        has_comment: editingStep.has_comment || false,
        request_update: editingStep.request_update || false,
        criteria: editingStep.criteria || "",
      };

      setStepData(stepDataToLoad);
      form.setFieldsValue({
        step_name: stepDataToLoad.step_name,
        type: stepDataToLoad.type,
        assigned_type: stepDataToLoad.assigned_type,
        assignee: stepDataToLoad.assignee,
        sla_hours: stepDataToLoad.sla_hours,
        mail_cc: stepDataToLoad.mail_cc,
        stepback: stepDataToLoad.stepback,
        step_resubmit: stepDataToLoad.step_resubmit,
        criteria: stepDataToLoad.criteria,
      });
    } else {
      console.log("Resetting form for new step");
      // Reset form for new step
      const defaultData = {
        step_name: "",
        type: "Entry Data",
        selected_sections: [],
        section_field_groups: [],
        assigned_type: "User",
        assignee: "",
        sla_hours: 24,
        mail_cc: [],
        stepback: "",
        step_resubmit: "",
        is_parallel: false,
        approve: false,
        reject: false,
        has_comment: false,
        request_update: false,
        criteria: "",
      };

      setStepData(defaultData);
      form.resetFields();
    }
  }, [editingStep, form, visible]);

  // Force approval tree re-render when stepData changes
  useEffect(() => {
    setApprovalTreeKey((prev) => prev + 1);
  }, [
    stepData.step_name,
    stepData.assignee,
    stepData.assigned_type,
    stepData.is_parallel,
  ]);

  const handleFieldChange = (field, value) => {
    console.log("handleFieldChange:", field, "=", value);
    setStepData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log("Updated stepData:", newData);
      return newData;
    });
  };

  const handleToggleChange = (field, checked) => {
    setStepData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleSectionAdd = (sectionName) => {
    const section = AVAILABLE_SECTIONS.find((s) => s.name === sectionName);
    if (section) {
      const newFieldGroups = section.field_groups.map((group) => ({
        ...group,
        section_name: sectionName,
        display: true,
      }));

      setStepData((prev) => ({
        ...prev,
        selected_sections: [...prev.selected_sections, section.id.toString()],
        section_field_groups: [...prev.section_field_groups, ...newFieldGroups],
      }));
    }
  };

  const handleSectionRemove = (sectionName) => {
    const section = AVAILABLE_SECTIONS.find((s) => s.name === sectionName);
    if (section) {
      setStepData((prev) => ({
        ...prev,
        selected_sections: prev.selected_sections.filter(
          (id) => id !== section.id.toString()
        ),
        section_field_groups: prev.section_field_groups.filter(
          (group) => group.section_name !== sectionName
        ),
      }));
    }
  };

  const handleFieldGroupDisplayChange = (groupId, display) => {
    setStepData((prev) => ({
      ...prev,
      section_field_groups: prev.section_field_groups.map((group) =>
        group.id === groupId ? { ...group, display } : group
      ),
    }));
  };

  const handleSectionChange = (selectedSectionIds) => {
    // Get currently selected sections
    const currentSectionIds = stepData.selected_sections;

    // Find newly added sections
    const addedSectionIds = selectedSectionIds.filter(
      (id) => !currentSectionIds.includes(id)
    );

    // Find removed sections
    const removedSectionIds = currentSectionIds.filter(
      (id) => !selectedSectionIds.includes(id)
    );

    // Add field groups for newly selected sections
    let newFieldGroups = [...stepData.section_field_groups];

    addedSectionIds.forEach((sectionId) => {
      const section = AVAILABLE_SECTIONS.find(
        (s) => s.id === parseInt(sectionId)
      );
      if (section) {
        const sectionFieldGroups = section.field_groups.map((group) => ({
          ...group,
          section_name: section.name,
          display: true,
        }));
        newFieldGroups = [...newFieldGroups, ...sectionFieldGroups];
      }
    });

    // Remove field groups for deselected sections
    removedSectionIds.forEach((sectionId) => {
      const section = AVAILABLE_SECTIONS.find(
        (s) => s.id === parseInt(sectionId)
      );
      if (section) {
        newFieldGroups = newFieldGroups.filter(
          (group) => group.section_name !== section.name
        );
      }
    });

    setStepData((prev) => ({
      ...prev,
      selected_sections: selectedSectionIds,
      section_field_groups: newFieldGroups,
    }));
  };

  const handleRemoveSection = (sectionName) => {
    const section = AVAILABLE_SECTIONS.find((s) => s.name === sectionName);
    if (section) {
      setStepData((prev) => ({
        ...prev,
        selected_sections: prev.selected_sections.filter(
          (id) => id !== section.id.toString()
        ),
        section_field_groups: prev.section_field_groups.filter(
          (group) => group.section_name !== sectionName
        ),
      }));
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        console.log("Saving step data:", stepData);
        onOk(stepData);

        // Reset form after successful save
        form.resetFields();
        setStepData({
          step_name: "",
          type: "Entry Data",
          selected_sections: [],
          section_field_groups: [],
          assigned_type: "User",
          assignee: "",
          sla_hours: 24,
          mail_cc: [],
          stepback: "",
          step_resubmit: "",
          is_parallel: false,
          approve: false,
          reject: false,
          has_comment: false,
          request_update: false,
          criteria: "",
        });
        setActiveTab("basic");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setStepData({
      step_name: "",
      type: "Entry Data",
      selected_sections: [],
      section_field_groups: [],
      assigned_type: "User",
      assignee: "",
      sla_hours: 24,
      mail_cc: [],
      stepback: "",
      step_resubmit: "",
      is_parallel: false,
      approve: false,
      reject: false,
      has_comment: false,
      request_update: false,
      criteria: "",
    });
    setActiveTab("basic");
    onCancel();
  };

  // Generate approval tree data from workflow steps
  const generateApprovalTreeData = () => {
    console.log("generateApprovalTreeData - allSteps:", allSteps);
    console.log("generateApprovalTreeData - editingStep:", editingStep);
    console.log("generateApprovalTreeData - stepData:", stepData);

    // Include current step being edited/added
    const stepsToShow = [...allSteps];

    if (editingStep && !editingStep.isSubStep) {
      // Update existing step with form data (could be main step or substep)
      const updateStepInArray = (steps) => {
        return steps.map((step) => {
          if (step.id === editingStep.id) {
            // Found the editing step, update it
            return {
              ...step,
              ...stepData,
            };
          } else if (step.subSteps && step.subSteps.length > 0) {
            // Check substeps recursively
            return {
              ...step,
              subSteps: updateStepInArray(step.subSteps),
            };
          }
          return step;
        });
      };

      const updatedSteps = updateStepInArray(stepsToShow);
      stepsToShow.splice(0, stepsToShow.length, ...updatedSteps);
    } else if (editingStep && editingStep.isSubStep) {
      // Adding new substep - add it to the structure
      console.log("Adding new substep with editingStep:", editingStep);
      const newSubStep = {
        id: Date.now(),
        ...stepData,
        order: editingStep.order,
        parentId: editingStep.parentId,
        subSteps: [],
      };
      console.log("New substep created:", newSubStep);

      // Add substep to parent in stepsToShow
      const addSubStepToParent = (steps, parentId, newSubStep) => {
        return steps.map((step) => {
          if (step.id === parentId) {
            return {
              ...step,
              subSteps: [...(step.subSteps || []), newSubStep],
            };
          } else if (step.subSteps && step.subSteps.length > 0) {
            return {
              ...step,
              subSteps: addSubStepToParent(step.subSteps, parentId, newSubStep),
            };
          }
          return step;
        });
      };

      const updatedSteps = addSubStepToParent(
        stepsToShow,
        editingStep.parentId,
        newSubStep
      );
      stepsToShow.splice(0, stepsToShow.length, ...updatedSteps);
    } else {
      // Add new step
      console.log("Adding new step with stepData:", stepData);
      const newStep = {
        id: Date.now(),
        order: stepData.order || stepsToShow.length + 1,
        ...stepData,
      };
      console.log("New step created:", newStep);
      stepsToShow.push(newStep);
    }

    // Build single workflow path (not all possible paths)
    const buildWorkflowPath = () => {
      const workflowPath = [];

      // Helper function to find which substep path to follow
      const findSubstepPath = (step) => {
        if (!step.subSteps || step.subSteps.length === 0) {
          return null;
        }

        // If editing a direct substep of this step
        if (editingStep) {
          const directSubstep = step.subSteps.find(
            (sub) => sub.id === editingStep.id
          );
          if (directSubstep) {
            return directSubstep;
          }

          // Check if editing step is nested deeper in any substep
          for (const substep of step.subSteps) {
            const hasNestedEditingStep = checkIfContainsEditingStep(substep);
            if (hasNestedEditingStep) {
              return substep;
            }
          }
        }

        // Default: return first substep
        return step.subSteps[0];
      };

      // Helper function to check if a step contains the editing step in its hierarchy
      const checkIfContainsEditingStep = (step) => {
        if (!editingStep) return false;
        if (step.id === editingStep.id) return true;

        if (step.subSteps && step.subSteps.length > 0) {
          return step.subSteps.some((substep) =>
            checkIfContainsEditingStep(substep)
          );
        }

        return false;
      };

      // Helper function to find the complete path to editing step
      const findPathToEditingStep = (steps, currentPath = []) => {
        for (const step of steps) {
          const newPath = [...currentPath, step];

          if (step.id === editingStep?.id) {
            return newPath;
          }

          if (step.subSteps && step.subSteps.length > 0) {
            const foundPath = findPathToEditingStep(step.subSteps, newPath);
            if (foundPath) {
              return foundPath;
            }
          }
        }
        return null;
      };

      // Build path - if editing a specific step, show path to that step
      if (editingStep && !editingStep.isSubStep) {
        // Editing existing step
        const pathToEditingStep = findPathToEditingStep(stepsToShow);
        if (pathToEditingStep) {
          workflowPath.push(...pathToEditingStep);

          // Continue with remaining steps after the editing step's parent
          const continueFromStep = (steps, afterStepId) => {
            let foundAfterStep = false;

            for (const step of steps) {
              if (foundAfterStep) {
                workflowPath.push(step);
                // For subsequent steps, follow default path (first substep)
                const substepToFollow = findSubstepPath(step);
                if (substepToFollow) {
                  continueFromStep([substepToFollow], null);
                }
              } else if (step.id === afterStepId) {
                foundAfterStep = true;
              } else if (step.subSteps && step.subSteps.length > 0) {
                continueFromStep(step.subSteps, afterStepId);
              }
            }
          };

          // Find the top-level parent of editing step to continue from
          const findTopLevelParent = (steps, targetId) => {
            for (const step of steps) {
              if (step.id === targetId) return step;
              if (step.subSteps && checkIfContainsEditingStep(step)) {
                return step;
              }
            }
            return null;
          };

          const topLevelParent = findTopLevelParent(
            stepsToShow,
            editingStep.id
          );
          if (topLevelParent) {
            continueFromStep(stepsToShow, topLevelParent.id);
          }
        }
      } else if (editingStep && editingStep.isSubStep) {
        // Adding new substep - show path including the new substep
        const findParentAndShowPath = (steps, parentId, newSubstepOrder) => {
          for (const step of steps) {
            if (step.id === parentId) {
              // Found parent, build path to parent + new substep
              const findPathToParent = (steps, currentPath = []) => {
                for (const step of steps) {
                  const newPath = [...currentPath, step];

                  if (step.id === parentId) {
                    return newPath;
                  }

                  if (step.subSteps && step.subSteps.length > 0) {
                    const foundPath = findPathToParent(step.subSteps, newPath);
                    if (foundPath) {
                      return foundPath;
                    }
                  }
                }
                return null;
              };

              const pathToParent = findPathToParent(stepsToShow);
              if (pathToParent) {
                workflowPath.push(...pathToParent);
                // Add the new substep being created
                const newSubstepInPath = {
                  id: Date.now(),
                  order: newSubstepOrder,
                  step_name: stepData.step_name || "New Sub-step",
                  ...stepData,
                };
                workflowPath.push(newSubstepInPath);
              }
              return true;
            }
            if (step.subSteps && step.subSteps.length > 0) {
              if (
                findParentAndShowPath(step.subSteps, parentId, newSubstepOrder)
              ) {
                return true;
              }
            }
          }
          return false;
        };

        findParentAndShowPath(
          stepsToShow,
          editingStep.parentId,
          editingStep.order
        );

        // Continue with remaining steps after parent
        const continueAfterParent = (steps, parentId) => {
          let foundParent = false;
          for (const step of steps) {
            if (foundParent) {
              workflowPath.push(step);
              const substepToFollow = findSubstepPath(step);
              if (substepToFollow) {
                continueAfterParent([substepToFollow], null);
              }
            } else if (step.id === parentId) {
              foundParent = true;
            }
          }
        };

        continueAfterParent(stepsToShow, editingStep.parentId);
      } else {
        // Default path for new steps
        const buildDefaultPath = (steps) => {
          steps.forEach((step) => {
            workflowPath.push(step);
            const substepToFollow = findSubstepPath(step);
            if (substepToFollow) {
              buildDefaultPath([substepToFollow]);
            }
          });
        };

        buildDefaultPath(stepsToShow);
      }

      console.log("buildWorkflowPath - single path:", workflowPath);
      return workflowPath;
    };

    const workflowPath = buildWorkflowPath();
    console.log("workflowPath:", workflowPath);

    // Convert workflow path to approval tree format
    const approvalTree = workflowPath.map((step, index) => {
      let owners = [];

      // Determine if this step is the current editing step
      const isCurrentStep = editingStep
        ? step.id === editingStep.id
        : index === workflowPath.length - 1;
      const isBeforeCurrentStep = editingStep
        ? workflowPath.findIndex((s) => s.id === editingStep.id) > index
        : index < workflowPath.length - 1;

      if (
        step.assigned_type === "Group" &&
        step.assignee &&
        TEAM_MEMBERS[step.assignee]
      ) {
        // If it's a group/team, show all team members
        owners = TEAM_MEMBERS[step.assignee].map((member) => ({
          name: member.name,
          title: member.title,
          avatarUrl: member.avatarUrl,
          status: isBeforeCurrentStep
            ? "Approved"
            : isCurrentStep
            ? "In Progress"
            : "Waiting",
          approvedAt: isBeforeCurrentStep ? new Date().toISOString() : null,
        }));
      } else if (step.assigned_type === "Request Owner") {
        // Request Owner - special assignee type
        owners = [
          {
            name: "Request Owner",
            title: "Request Submitter",
            avatarUrl: null,
            status: isBeforeCurrentStep
              ? "Approved"
              : isCurrentStep
              ? "In Progress"
              : "Waiting",
            approvedAt: isBeforeCurrentStep ? new Date().toISOString() : null,
          },
        ];
      } else if (step.assigned_type === "Head of Department") {
        // Head of Department - special assignee type
        owners = [
          {
            name: "Head of Department",
            title: "Department Manager",
            avatarUrl: null,
            status: isBeforeCurrentStep
              ? "Approved"
              : isCurrentStep
              ? "In Progress"
              : "Waiting",
            approvedAt: isBeforeCurrentStep ? new Date().toISOString() : null,
          },
        ];
      } else {
        // If it's a single user or unassigned
        owners = [
          {
            name: step.assignee || "Unassigned",
            title: step.assigned_type === "Group" ? "Group" : "User",
            avatarUrl: null,
            status: isBeforeCurrentStep
              ? "Approved"
              : isCurrentStep
              ? "In Progress"
              : "Waiting",
            approvedAt: isBeforeCurrentStep ? new Date().toISOString() : null,
          },
        ];
      }

      // Format step name with order - keep original order format
      let stepName;
      if (step.step_name) {
        stepName = `${step.order}. ${step.step_name}`;
      } else {
        // Default names based on order
        if (typeof step.order === "string" && step.order.includes(".")) {
          stepName = `${step.order}. Sub-step`;
        } else {
          stepName = `${step.order}. Main Step`;
        }
      }

      return {
        stepName,
        parallel: step.is_parallel || false,
        owners,
        isCurrentStep, // Add flag for highlighting
      };
    });

    return {
      requestId: "WORKFLOW-PREVIEW",
      approvalTree,
    };
  };

  const renderBasicInfoTab = () => (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item label="Order">
            <Input
              value={editingStep?.order || "Auto-generated"}
              disabled
              className="bg-gray-50"
            />
          </Form.Item>
        </Col>

        <Col span={18}>
          <Form.Item
            label="Step Name"
            name="step_name"
            rules={[{ required: true, message: "Step name is required" }]}
          >
            <Input
              placeholder="Enter step name"
              value={stepData.step_name}
              onChange={(e) => handleFieldChange("step_name", e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Type is required" }]}
          >
            <Select
              value={stepData.type}
              onChange={(value) => handleFieldChange("type", value)}
            >
              {STEP_TYPES.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="SLA (Hours)"
            name="sla_hours"
            rules={[{ required: true, message: "SLA is required" }]}
          >
            <Input
              type="number"
              placeholder="Enter SLA hours"
              value={stepData.sla_hours}
              onChange={(e) =>
                handleFieldChange("sla_hours", parseInt(e.target.value) || 0)
              }
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );

  const renderFieldGroupsTab = () => (
    <div className="space-y-4">
      <Text variant="body" weight="medium" className="mb-3">
        Section Configuration
      </Text>

      {/* Section Selection */}
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Sections" name="selected_sections" className="mb-4">
            <Select
              mode="multiple"
              placeholder="Select sections"
              value={stepData.selected_sections}
              onChange={handleSectionChange}
            >
              {AVAILABLE_SECTIONS.map((section) => (
                <Option key={section.id} value={section.id}>
                  {section.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Field Groups Table */}
          {stepData.section_field_groups.length > 0 && (
            <div className="mt-4">
              <Text variant="body" weight="medium" className="mb-3">
                Field Groups Configuration
              </Text>

              {/* Group field groups by section */}
              {Object.entries(
                stepData.section_field_groups.reduce((acc, group) => {
                  if (!acc[group.section_name]) {
                    acc[group.section_name] = [];
                  }
                  acc[group.section_name].push(group);
                  return acc;
                }, {})
              ).map(([sectionName, groups]) => (
                <div
                  key={sectionName}
                  className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b">
                    <Text
                      variant="body"
                      weight="medium"
                      className="text-gray-700"
                    >
                      {sectionName}
                    </Text>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(sectionName)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Remove section"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Field Groups Table */}
                  <table className="w-full">
                    <thead className="bg-gray-25">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">
                          Field Group
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b">
                          Display
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map((group) => (
                        <tr
                          key={group.id}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {group.name}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={group.display}
                              onChange={(e) =>
                                handleFieldGroupDisplayChange(
                                  group.id,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );

  const renderAssignmentTab = () => (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Assigned Type"
            name="assigned_type"
            rules={[{ required: true, message: "Assigned type is required" }]}
          >
            <Select
              value={stepData.assigned_type}
              onChange={(value) => handleFieldChange("assigned_type", value)}
            >
              {ASSIGNED_TYPES.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Only show Assignee if not Request Owner or Head of Department */}
        {!["Request Owner", "Head of Department"].includes(
          stepData.assigned_type
        ) && (
          <Col span={12}>
            <Form.Item
              label="Assignee"
              name="assignee"
              rules={[{ required: true, message: "Assignee is required" }]}
            >
              <Select
                value={stepData.assignee}
                onChange={(value) => handleFieldChange("assignee", value)}
                placeholder="Select assignee"
              >
                {stepData.assigned_type === "User"
                  ? USERS.map((user) => (
                      <Option key={user.value} value={user.value}>
                        {user.label}
                      </Option>
                    ))
                  : GROUPS.map((group) => (
                      <Option key={group.value} value={group.value}>
                        {group.label}
                      </Option>
                    ))}
              </Select>
            </Form.Item>
          </Col>
        )}
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Mail CC" name="mail_cc">
            <Select
              mode="multiple"
              placeholder="Select CC recipients"
              value={stepData.mail_cc}
              onChange={(value) => handleFieldChange("mail_cc", value)}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {MAIL_RECIPIENTS.map((recipient) => (
                <Option key={recipient.value} value={recipient.value}>
                  {recipient.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Step Back" name="stepback">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter step number to go back to"
                value={stepData.stepback}
                onChange={(e) => handleFieldChange("stepback", e.target.value)}
              />
              <div className="relative group">
                <Info
                  size={16}
                  className="text-gray-400 border border-gray-300 rounded-full p-1 cursor-help"
                  style={{ width: "20px", height: "20px" }}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Defines which step to go back to when user selects "Request
                  Update" during approval
                </div>
              </div>
            </div>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Step Resubmit" name="step_resubmit">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter step number to proceed to"
                value={stepData.step_resubmit}
                onChange={(e) =>
                  handleFieldChange("step_resubmit", e.target.value)
                }
              />
              <div className="relative group">
                <Info
                  size={16}
                  className="text-gray-400 border border-gray-300 rounded-full p-1 cursor-help"
                  style={{ width: "20px", height: "20px" }}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Defines which step the request will proceed to after user
                  updates and resubmits
                </div>
              </div>
            </div>
          </Form.Item>
        </Col>
      </Row>

      {/* Step Options - Only show for Approval types */}
      {(stepData.type === "Approval" ||
        stepData.type === "Entry Data + Approval") && (
        <div className="space-y-4">
          <Text variant="body" weight="medium">
            Step Options
          </Text>

          <div className="grid grid-cols-2 gap-4">
            {/* Parallel Processing - Only show if Assigned Type is Group */}
            {stepData.assigned_type === "Group" && (
              <div className="flex items-center space-x-3">
                <Switch
                  checked={stepData.is_parallel}
                  onChange={(checked) =>
                    handleToggleChange("is_parallel", checked)
                  }
                />
                <Text variant="body">Parallel Processing</Text>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Switch
                checked={stepData.approve}
                onChange={(checked) => handleToggleChange("approve", checked)}
              />
              <Text variant="body">Approve</Text>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={stepData.reject}
                onChange={(checked) => handleToggleChange("reject", checked)}
              />
              <Text variant="body">Reject</Text>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={stepData.request_update}
                onChange={(checked) =>
                  handleToggleChange("request_update", checked)
                }
              />
              <Text variant="body">Request Update</Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCriteriaTab = () => (
    <div className="space-y-4">
      <Text variant="body" weight="medium" className="mb-3">
        Criteria Configuration
      </Text>

      <Form.Item
        label="Criteria JSON"
        name="criteria"
        help="Enter JSON configuration for step criteria"
      >
        <Input.TextArea
          rows={10}
          placeholder={`{
  "conditions": [
    {
      "field": "amount",
      "operator": "greater_than",
      "value": 10000
    },
    {
      "field": "department",
      "operator": "equals",
      "value": "Finance"
    }
  ],
  "logic": "AND"
}`}
          value={stepData.criteria}
          onChange={(e) => handleFieldChange("criteria", e.target.value)}
          style={{ fontFamily: "monospace" }}
        />
      </Form.Item>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info size={16} className="text-blue-600 mt-0.5" />
          <div>
            <Text variant="body" weight="medium" className="text-blue-800 mb-1">
              JSON Format Guidelines
            </Text>
            <Text variant="body" size="sm" className="text-blue-700">
              • Use "conditions" array for multiple criteria
              <br />
              • Supported operators: equals, not_equals, greater_than,
              less_than, contains
              <br />
              • Use "logic" field to specify AND/OR between conditions
              <br />• Ensure valid JSON syntax
            </Text>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      title={editingStep ? "Edit Step" : "Add New Step"}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1400}
      okText="Save Step"
      cancelText="Cancel"
    >
      <div className="flex gap-6">
        {/* Left Column - Form */}
        <div className="flex-1">
          <Form form={form} layout="vertical" initialValues={stepData}>
            <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
              <Tabs.Panel tabId="basic" label="Basic Info">
                {renderBasicInfoTab()}
              </Tabs.Panel>
              <Tabs.Panel tabId="fields" label="Field Groups">
                {renderFieldGroupsTab()}
              </Tabs.Panel>
              <Tabs.Panel tabId="assignment" label="Assignment">
                {renderAssignmentTab()}
              </Tabs.Panel>
              <Tabs.Panel tabId="advanced" label="Advanced">
                {renderAdvancedTab()}
              </Tabs.Panel>
              {/* Only show Criteria tab for sub-steps */}
              {editingStep &&
                (editingStep.parentId ||
                  (editingStep.order &&
                    typeof editingStep.order === "string" &&
                    editingStep.order.includes("."))) && (
                  <Tabs.Panel tabId="criteria" label="Criteria">
                    {renderCriteriaTab()}
                  </Tabs.Panel>
                )}
            </Tabs>
          </Form>
        </div>

        {/* Right Column - Approval Tree Preview */}
        <div className="w-96 border-l border-gray-200 pl-6">
          <div className="mb-4">
            <Text
              variant="heading"
              size="md"
              weight="semibold"
              className="mb-2"
            >
              Workflow Preview
            </Text>
            <Text variant="body" color="muted" className="text-sm">
              Preview how this step fits in the overall workflow
            </Text>
          </div>

          {/* Approval Tree Container */}
          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
            <ApprovalTreePreview
              key={approvalTreeKey}
              requestData={generateApprovalTreeData()}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddStepModal;
