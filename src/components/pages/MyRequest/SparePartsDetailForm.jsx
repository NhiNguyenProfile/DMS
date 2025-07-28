import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import { ArrowLeft, Eye } from "lucide-react";
import ApprovalTreeSlider from "./ApprovalTreeSlider";
import ConfirmationModal from "../../atoms/ConfirmationModal";

// Spare Parts Form Fields
const GENERAL_FIELDS = [
  { label: "Product Type", type: "text", required: true, key: "productType" },
  {
    label: "Product Subtype",
    type: "text",
    required: false,
    key: "productSubtype",
  },
  { label: "Item Number", type: "text", required: true, key: "itemNumber" },
  {
    label: "Product Number",
    type: "text",
    required: false,
    key: "productNumber",
  },
  { label: "Product Name", type: "text", required: true, key: "productName" },
  { label: "Search Name", type: "text", required: false, key: "searchName" },
  { label: "Class Group", type: "text", required: false, key: "classGroup" },
  { label: "Class Type", type: "text", required: false, key: "classType" },
  { label: "Class Kind", type: "text", required: false, key: "classKind" },
  {
    label: "Business Sector",
    type: "select",
    options: ["Feed", "Aqua", "Pharma"],
    required: false,
    key: "businessSector",
  },
  { label: "Sync to DHC", type: "yes-no", required: false, key: "syncToDHC" },
];

const PURCHASE_FIELDS = [
  {
    label: "Purchase Unit",
    type: "text",
    required: false,
    key: "purchaseUnit",
  },
  {
    label: "Sales Tax Group (Purchase)",
    type: "select",
    options: ["VAT", "PPN"],
    required: false,
    key: "salesTaxGroupPurchase",
  },
  {
    label: "Vendor Check Method",
    type: "select",
    options: ["Strict", "Relaxed"],
    required: false,
    key: "vendorCheckMethod",
  },
];

const SELL_FIELDS = [
  { label: "Sales Unit", type: "text", required: true, key: "salesUnit" },
  {
    label: "Sales Tax Group (Sales)",
    type: "select",
    options: ["VAT", "PPN"],
    required: true,
    key: "salesTaxGroupSales",
  },
  {
    label: "Pricing Formula",
    type: "text",
    required: false,
    key: "pricingFormula",
  },
  {
    label: "Sales Price Model",
    type: "select",
    options: ["Standard", "Promotion", "Volume Based"],
    required: false,
    key: "salesPriceModel",
  },
];

const INVENTORY_FIELDS = [
  {
    label: "Inventory Unit",
    type: "text",
    required: true,
    key: "inventoryUnit",
  },
  { label: "CW Product", type: "yes-no", required: false, key: "cwProduct" },
  {
    label: "Packing Group",
    type: "text",
    required: false,
    key: "packingGroup",
  },
  { label: "Bag Item", type: "yes-no", required: false, key: "bagItem" },
  {
    label: "Storage/Tracking Group",
    type: "text",
    required: false,
    key: "storageTrackingGroup",
  },
];

const ENGINEER_FIELDS = [
  {
    label: "Production Type",
    type: "text",
    required: false,
    key: "productionType",
  },
  { label: "BOM Unit", type: "text", required: false, key: "bomUnit" },
  {
    label: "Item Group",
    type: "select",
    options: ["FGD", "RAW", "SPARE"],
    required: true,
    key: "itemGroup",
  },
  {
    label: "Product Form",
    type: "select",
    options: ["Solid", "Liquid", "Powder"],
    required: true,
    key: "productForm",
  },
  {
    label: "Dimensions A00",
    type: "text",
    required: false,
    key: "dimensionsA00",
  },
  {
    label: "Dimensions A01",
    type: "text",
    required: false,
    key: "dimensionsA01",
  },
  {
    label: "Dimensions A02",
    type: "text",
    required: false,
    key: "dimensionsA02",
  },
  {
    label: "Dimensions A03",
    type: "text",
    required: false,
    key: "dimensionsA03",
  },
  {
    label: "Dimensions A04",
    type: "text",
    required: false,
    key: "dimensionsA04",
  },
  {
    label: "Dimensions A05",
    type: "text",
    required: false,
    key: "dimensionsA05",
  },
  {
    label: "Dimensions A06",
    type: "text",
    required: false,
    key: "dimensionsA06",
  },
  {
    label: "Dimensions A07",
    type: "text",
    required: false,
    key: "dimensionsA07",
  },
  {
    label: "Dimensions A08",
    type: "text",
    required: false,
    key: "dimensionsA08",
  },
  {
    label: "Dimensions A09",
    type: "text",
    required: false,
    key: "dimensionsA09",
  },
  {
    label: "Dimensions A10",
    type: "text",
    required: false,
    key: "dimensionsA10",
  },
  {
    label: "Dimensions A11",
    type: "text",
    required: false,
    key: "dimensionsA11",
  },
  {
    label: "Dimensions A12",
    type: "text",
    required: false,
    key: "dimensionsA12",
  },
  {
    label: "Dimensions A13",
    type: "text",
    required: false,
    key: "dimensionsA13",
  },
];

const SparePartsDetailForm = ({ requestData, onBack }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({});
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const tabs = [
    { id: "general", label: "General", fields: GENERAL_FIELDS },
    { id: "purchase", label: "Purchase", fields: PURCHASE_FIELDS },
    { id: "sell", label: "Sell", fields: SELL_FIELDS },
    { id: "inventory", label: "Inventory", fields: INVENTORY_FIELDS },
    {
      id: "engineer",
      label: "Engineer / Cost / Finance",
      fields: ENGINEER_FIELDS,
    },
  ];

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
    console.log("Cancel spare parts request with comment:", comment);
    setShowCancelModal(false);
    // Handle cancel logic
  };

  const handleSubmitConfirm = () => {
    console.log("Submit spare parts request", formData);
    setShowSubmitModal(false);
    // Handle submit logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                Spare Parts Request Detail
              </Text>
              <Text variant="body" color="muted" className="mt-1">
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
      <div className="flex-1 px-6 py-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
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
        message="Are you sure you want to cancel this spare parts request? This action cannot be undone."
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
        message="Are you sure you want to submit this spare parts request for approval?"
        confirmText="Submit Request"
        showCommentInput={false}
      />
    </div>
  );
};

export default SparePartsDetailForm;
