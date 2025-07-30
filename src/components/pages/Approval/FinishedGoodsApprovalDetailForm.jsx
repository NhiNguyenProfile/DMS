import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import { ArrowLeft, Eye, Edit, Check, X } from "lucide-react";
import ApprovalTreeSlider from "../MyRequest/ApprovalTreeSlider";
import ConfirmationModal from "../../atoms/ConfirmationModal";

// Import same field definitions from FinishedGoodsDetailForm
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

const FinishedGoodsApprovalDetailForm = ({ requestData, onBack }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({});
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestUpdateModal, setShowRequestUpdateModal] = useState(false);

  const tabs = [{ id: "general", label: "General", fields: GENERAL_FIELDS }];

  const renderField = (field) => {
    const value = formData[field.key] || "";
    // For approval, all fields are view-only

    return (
      <div key={field.key} className="space-y-2">
        <div className="flex items-center gap-1">
          <Text variant="body" weight="medium">
            {field.label}
          </Text>
          {field.required && <span className="text-red-500 text-sm">*</span>}
          <span className="text-xs text-gray-500 ml-2">(Review Only)</span>
        </div>

        {field.type === "text" && (
          <Input
            value={value}
            disabled={true}
            className="bg-gray-50 cursor-not-allowed"
            placeholder=""
          />
        )}

        {field.type === "select" && (
          <Select
            options={field.options.map((opt) => ({ value: opt, label: opt }))}
            value={value}
            disabled={true}
            placeholder=""
          />
        )}

        {field.type === "yes-no" && (
          <Select
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            value={value}
            disabled={true}
            placeholder=""
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

  const handleApprove = () => {
    setShowApproveModal(true);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleRequestUpdate = () => {
    setShowRequestUpdateModal(true);
  };

  const handleApproveConfirm = (comment) => {
    console.log(
      "Approve finished goods request:",
      requestData?.id,
      "Comment:",
      comment
    );
    setShowApproveModal(false);
    // Handle approval logic
  };

  const handleRejectConfirm = (comment) => {
    console.log(
      "Reject finished goods request:",
      requestData?.id,
      "Reason:",
      comment
    );
    setShowRejectModal(false);
    // Handle rejection logic
  };

  const handleRequestUpdateConfirm = (comment) => {
    console.log(
      "Request update for finished goods:",
      requestData?.id,
      "Comment:",
      comment
    );
    setShowRequestUpdateModal(false);
    // Handle request update logic
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
                <span className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800">
                  {requestData?.currentSteps}
                </span>
                <span className="text-xs text-orange-600 font-medium">
                  {requestData?.stepOwner}
                </span>
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
                    ? "border-orange-500 text-orange-600"
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
          <Button variant="outline" onClick={handleRequestUpdate}>
            <Edit size={16} className="mr-2" />
            Request Update
          </Button>
          <Button
            variant="outline"
            onClick={handleReject}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <X size={16} className="mr-2" />
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check size={16} className="mr-2" />
            Approve
          </Button>
        </div>
      </div>

      {/* Approval Tree Slider */}
      <ApprovalTreeSlider
        isOpen={showApprovalSlider}
        onClose={() => setShowApprovalSlider(false)}
        requestData={requestData}
        hideViewDetail={true}
      />

      {/* Request Update Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRequestUpdateModal}
        onClose={() => setShowRequestUpdateModal(false)}
        onConfirm={handleRequestUpdateConfirm}
        title="Request Update"
        message="Request the submitter to update this finished goods request with additional information or corrections."
        confirmText="Request Update"
        confirmVariant="outline"
        commentLabel="Update request details"
        commentPlaceholder="Please specify what needs to be updated..."
        commentRequired={true}
      />

      {/* Reject Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectConfirm}
        title="Reject Request"
        message="Are you sure you want to reject this finished goods request? This action will notify the submitter."
        confirmText="Reject Request"
        confirmVariant="outline"
        commentLabel="Reason for rejection"
        commentPlaceholder="Please provide a clear reason for rejecting this request..."
        commentRequired={true}
      />

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApproveConfirm}
        title="Approve Request"
        message="Are you sure you want to approve this finished goods request? This will move it to the next step in the workflow."
        confirmText="Approve Request"
        confirmVariant="primary"
        commentLabel="Approval comments"
        commentPlaceholder="Add any comments or notes for this approval..."
        commentRequired={false}
      />
    </div>
  );
};

export default FinishedGoodsApprovalDetailForm;
