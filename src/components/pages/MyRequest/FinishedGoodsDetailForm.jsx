import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import { ArrowLeft, Eye } from "lucide-react";
import ApprovalTreeSlider from "./ApprovalTreeSlider";
import ConfirmationModal from "../../atoms/ConfirmationModal";

// Finished Goods Form Fields
const GENERAL_FIELDS = [
  { label: "Product Name", type: "text", required: true, key: "productName" },
  { label: "Item Number", type: "text", required: true, key: "itemNumber" },
  { label: "SKU", type: "text", required: true, key: "sku" },
  { label: "Sales Unit", type: "text", required: true, key: "salesUnit" },
  {
    label: "Product Form",
    type: "select",
    options: ["Solid", "Liquid", "Powder"],
    required: true,
    key: "productForm",
  },
  {
    label: "Packaging Type",
    type: "text",
    required: true,
    key: "packagingType",
  },
  { label: "Dimensions", type: "text", required: false, key: "dimensions" },
  { label: "Net Weight", type: "text", required: false, key: "netWeight" },
  {
    label: "Item Group",
    type: "select",
    options: ["FGD"],
    required: true,
    key: "itemGroup",
  },
  {
    label: "Sales Tax Group",
    type: "select",
    options: ["VAT", "PPN"],
    required: true,
    key: "salesTaxGroup",
  },
  { label: "Sync to DHC", type: "yes-no", required: false, key: "syncToDHC" },
];

const FinishedGoodsDetailForm = ({ requestData, onBack, onSave }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({});
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const tabs = [{ id: "general", label: "General", fields: GENERAL_FIELDS }];

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderField = (field) => {
    const value = formData[field.key] || "";
    const isEditable = requestData?.currentSteps === "Waiting for Entry";

    return (
      <div key={field.key} className="space-y-2">
        <div className="flex items-center gap-1">
          <Text variant="body" weight="medium">
            {field.label}
          </Text>
          {field.required && <span className="text-red-500 text-sm">*</span>}
          {!isEditable && (
            <span className="text-xs text-gray-500 ml-2">(View Only)</span>
          )}
        </div>

        {field.type === "text" && (
          <Input
            value={value}
            onChange={
              isEditable
                ? (e) => handleInputChange(field.key, e.target.value)
                : undefined
            }
            placeholder={isEditable ? `Enter ${field.label.toLowerCase()}` : ""}
            required={field.required}
            disabled={!isEditable}
            className={!isEditable ? "bg-gray-50 cursor-not-allowed" : ""}
          />
        )}

        {field.type === "select" && (
          <Select
            options={field.options.map((opt) => ({ value: opt, label: opt }))}
            value={value}
            onChange={
              isEditable
                ? (val) => handleInputChange(field.key, val)
                : undefined
            }
            placeholder={
              isEditable ? `Select ${field.label.toLowerCase()}` : ""
            }
            disabled={!isEditable}
          />
        )}

        {field.type === "yes-no" && (
          <Select
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            value={value}
            onChange={
              isEditable
                ? (val) => handleInputChange(field.key, val)
                : undefined
            }
            placeholder={isEditable ? "Select option" : ""}
            disabled={!isEditable}
          />
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    if (!currentTab) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentTab.fields.map((field) => renderField(field))}
      </div>
    );
  };

  // Determine available actions based on request status
  const getAvailableActions = () => {
    if (!requestData) return [];

    const actions = [];

    // Cancel button always available
    actions.push({
      label: "Cancel",
      variant: "outline",
      action: "cancel",
    });

    // Submit button only for "Waiting for Entry" status
    if (requestData.currentSteps === "Waiting for Entry") {
      actions.push({
        label: "Submit Request",
        variant: "primary",
        action: "submit",
      });
    }

    return actions;
  };

  const handleAction = (action) => {
    switch (action) {
      case "cancel":
        setShowCancelModal(true);
        break;
      case "submit":
        setShowSubmitModal(true);
        break;
      default:
        break;
    }
  };

  const handleCancelConfirm = (comment) => {
    console.log("Cancel finished goods request with comment:", comment);
    setShowCancelModal(false);
    // Handle cancel logic
  };

  const handleSubmitConfirm = () => {
    console.log("Submit finished goods request", formData);
    setShowSubmitModal(false);
    // Handle submit logic
    if (onSave) {
      onSave({ ...requestData, ...formData });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <div>
              <Text variant="heading" size="xl" weight="bold">
                {requestData?.id} - {requestData?.requestTitle}
              </Text>
              {/* Current Step Indicator */}
              <div className="flex items-center gap-2 mt-2">
                <Text variant="caption" color="muted">
                  Current Step:
                </Text>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    requestData?.currentSteps === "Waiting for Entry"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {requestData?.currentSteps}
                </span>
                <span
                  className={`text-xs font-medium  ${
                    requestData?.currentSteps === "Waiting for Entry"
                      ? " text-blue-800"
                      : " text-gray-600"
                  }`}
                >
                  {requestData?.stepOwner}
                </span>
                {requestData?.currentSteps === "Waiting for Entry" && (
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Editable
                  </span>
                )}
                {requestData?.currentSteps !== "Waiting for Entry" && (
                  <span className="text-xs text-gray-500">View Only</span>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowApprovalSlider(true)}>
            <Eye size={16} className="mr-2" />
            View Approval Tree
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 py-8 pb-24 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 px-6 py-4 z-10">
        <div className="max-w-6xl mx-auto flex justify-end gap-3">
          {getAvailableActions().map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={() => handleAction(action.action)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Approval Tree Slider */}
      <ApprovalTreeSlider
        isOpen={showApprovalSlider}
        onClose={() => setShowApprovalSlider(false)}
        requestData={requestData}
        hideViewDetail={true}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Request"
        message="Are you sure you want to cancel this finished goods request? This action cannot be undone."
        confirmText="Cancel Request"
        confirmVariant="outline"
        commentLabel="Reason for cancellation"
        commentPlaceholder="Please provide a reason for cancelling this request..."
        commentRequired={true}
      />

      {/* Submit Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleSubmitConfirm}
        title="Submit Request"
        message="Are you sure you want to submit this finished goods request for approval?"
        confirmText="Submit Request"
        showCommentInput={false}
      />
    </div>
  );
};

export default FinishedGoodsDetailForm;
