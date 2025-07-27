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
import {
  STEP_TYPES,
  TIMEOUT_ACTIONS,
  ASSIGNED_TYPES,
  USERS,
  GROUPS,
  ROLES,
  MAIL_RECIPIENTS,
} from "../../../../constants";
import { FIELD_GROUPS } from "../../../../data/mockData";

const { Option } = Select;

// Sample sections data (would come from SectionConfig)
const AVAILABLE_SECTIONS = [
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
    field_groups: [
      { id: "credit", name: "Credit Info" },
      { id: "address", name: "Address Info" },
    ],
  },
];
const { TextArea } = Input;

const AddStepModal = ({ visible, onCancel, onOk, editingStep = null }) => {
  const [form] = Form.useForm();
  const [stepData, setStepData] = useState({
    order: "",
    step_name: "",
    type: "Entry Data",
    selected_sections: [], // Multiple selected sections
    section_field_groups: [], // Field groups with display settings
    assigned_type: "User",
    assignee: "",
    sla_hours: 24,
    mail_cc: [], // Mail CC recipients
    stepback: "",
    step_resubmit: "",
    // New fields for advanced options
    is_parallel: false,
    approve: false,
    reject: false,
    has_comment: false,
    request_update: false,
  });

  // Load data when editing
  useEffect(() => {
    if (editingStep) {
      setStepData(editingStep);
      form.setFieldsValue(editingStep);
    }
  }, [editingStep, form]);

  const handleFieldChange = (field, value) => {
    setStepData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (toggleField, checked) => {
    setStepData((prev) => ({ ...prev, [toggleField]: checked }));
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const finalData = {
        ...stepData,
        ...values,
        id: editingStep?.id || Date.now(),
        order: editingStep?.order || 1,
        // Ensure field_groups is always an array
        field_groups: stepData.selected_sections || [],
        // Ensure other arrays are initialized
        mail_cc: stepData.mail_cc || [],
      };
      onOk(finalData);
      handleCancel();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setStepData({
      order: "",
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
    });
    onCancel();
  };

  const getAssigneeOptions = () => {
    if (stepData.assigned_type === "User") return USERS;
    if (stepData.assigned_type === "Group") return GROUPS;
    return ROLES;
  };

  // Handle multiple section selection
  const handleSectionChange = (sectionIds) => {
    const allFieldGroups = [];

    sectionIds.forEach((sectionId) => {
      const selectedSection = AVAILABLE_SECTIONS.find(
        (s) => s.id === parseInt(sectionId)
      );
      if (selectedSection) {
        selectedSection.field_groups.forEach((group) => {
          // Check if group already exists to avoid duplicates
          if (!allFieldGroups.find((existing) => existing.id === group.id)) {
            allFieldGroups.push({
              ...group,
              display: true, // Default to display = true
              section_name: selectedSection.name, // Track which section this group belongs to
            });
          }
        });
      }
    });

    setStepData((prev) => ({
      ...prev,
      selected_sections: sectionIds,
      section_field_groups: allFieldGroups,
    }));
  };

  // Handle field group display toggle
  const handleFieldGroupDisplayChange = (groupId, display) => {
    setStepData((prev) => ({
      ...prev,
      section_field_groups: prev.section_field_groups.map((group) =>
        group.id === groupId ? { ...group, display } : group
      ),
    }));
  };

  // Handle remove section (and its field groups)
  const handleRemoveSection = (sectionName) => {
    // Remove all field groups belonging to this section
    const updatedFieldGroups = stepData.section_field_groups.filter(
      (group) => group.section_name !== sectionName
    );

    // Remove section from selected sections
    const sectionToRemove = AVAILABLE_SECTIONS.find(
      (s) => s.name === sectionName
    );
    const updatedSelectedSections = stepData.selected_sections.filter(
      (sectionId) => parseInt(sectionId) !== sectionToRemove?.id
    );

    setStepData((prev) => ({
      ...prev,
      selected_sections: updatedSelectedSections,
      section_field_groups: updatedFieldGroups,
    }));
  };

  return (
    <Modal
      title={editingStep ? "Edit Step" : "Add New Step"}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      okText="Save Step"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" initialValues={stepData}>
        {/* Basic Information */}
        <Divider orientation="left">Basic Information</Divider>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Order"
              name="order"
              rules={[{ required: true, message: "Order is required" }]}
            >
              <Input
                type="number"
                placeholder="Enter order"
                value={stepData.order}
                onChange={(e) => handleFieldChange("order", e.target.value)}
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
            <Form.Item label="Mail CC" name="mail_cc">
              <Select
                mode="multiple"
                placeholder="Select CC recipients"
                value={stepData.mail_cc}
                onChange={(value) => handleFieldChange("mail_cc", value)}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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

        {/* Field Groups & Sections - Only show if type includes "Entry Data" */}
        {(stepData.type === "Entry Data" ||
          stepData.type === "Entry Data + Approval") && (
          <>
            {/* Sections Configuration */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Sections"
                  name="selected_sections"
                  className="mb-4"
                >
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

                {/* Field Groups by Section */}
                {stepData.section_field_groups.length > 0 && (
                  <div className="mt-4">
                    <Text variant="body" weight="medium" className="mb-3">
                      Field Groups in Sections
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
                                Group Name
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
          </>
        )}

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Assigned Type" name="assigned_type">
              <Select
                value={stepData.assigned_type}
                onChange={(value) => handleFieldChange("assigned_type", value)}
                disabled={stepData.type === "System"}
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
            <Col span={8}>
              <Form.Item
                label="Assignee"
                name="assignee"
                rules={[{ required: true, message: "Assignee is required" }]}
              >
                <Select
                  placeholder="Select assignee"
                  value={stepData.assignee}
                  onChange={(value) => handleFieldChange("assignee", value)}
                >
                  {getAssigneeOptions().map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="SLA (hours)"
              name="sla_hours"
              rules={[{ required: true, message: "SLA is required" }]}
            >
              <Input
                type="number"
                min={0}
                placeholder="Enter SLA hours"
                value={stepData.sla_hours}
                onChange={(e) =>
                  handleFieldChange("sla_hours", parseInt(e.target.value) || 0)
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Stepback" name="stepback">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter step number to go back to"
                  value={stepData.stepback}
                  onChange={(e) =>
                    handleFieldChange("stepback", e.target.value)
                  }
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

        {/* Advanced Options */}
        <Divider orientation="left">Advanced Options</Divider>

        <div className="space-y-4">
          {/* Is Parallel - Only show if Assigned Type is Group */}
          {stepData.assigned_type === "Group" && (
            <div>
              <div className="flex items-center space-x-3">
                <Switch
                  checked={stepData.is_parallel}
                  onChange={(checked) =>
                    handleToggleChange("is_parallel", checked)
                  }
                />
                <Text variant="body" weight="medium">
                  Is Parallel
                </Text>
              </div>
            </div>
          )}

          {/* Has Comment - Only toggle, no mail settings */}
          <div>
            <div className="flex items-center space-x-3">
              <Switch
                checked={stepData.has_comment}
                onChange={(checked) =>
                  handleToggleChange("has_comment", checked)
                }
              />
              <Text variant="body" weight="medium">
                Has Comment
              </Text>
            </div>
          </div>

          {/* Approve - With mail settings */}
          <div>
            <div className="flex items-center space-x-3">
              <Switch
                checked={stepData.approve}
                onChange={(checked) => handleToggleChange("approve", checked)}
              />
              <Text variant="body" weight="medium">
                Approve
              </Text>
            </div>
          </div>

          {/* Reject - With mail settings */}
          <div>
            <div className="flex items-center space-x-3">
              <Switch
                checked={stepData.reject}
                onChange={(checked) => handleToggleChange("reject", checked)}
              />
              <Text variant="body" weight="medium">
                Reject
              </Text>
            </div>
          </div>

          {/* Request Update - With mail settings */}
          <div>
            <div className="flex items-center space-x-3">
              <Switch
                checked={stepData.request_update}
                onChange={(checked) =>
                  handleToggleChange("request_update", checked)
                }
              />
              <Text variant="body" weight="medium">
                Request Update
              </Text>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddStepModal;
