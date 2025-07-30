import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import { ArrowLeft, Eye } from "lucide-react";
import ApprovalTreeSlider from "./ApprovalTreeSlider";
import ConfirmationModal from "../../atoms/ConfirmationModal";

// Form data structure
const MAIN_CUSTOMER_FIELDS = [
  {
    label: "Customer Account",
    type: "text",
    required: true,
    key: "customerAccount",
  },
  {
    label: "Main Customer Name",
    type: "text",
    required: true,
    key: "mainCustomerName",
  },
  {
    label: "Company",
    type: "select",
    options: ["uab", "wel", "wir"],
    required: true,
    key: "company",
  },
  {
    label: "Address",
    type: "text",
    required: true,
    key: "address",
  },
  {
    label: "NIK/NPWP",
    type: "text",
    required: false,
    key: "nikNpwp",
  },
];

const TAX_FIELDS = [
  {
    label: "Country/Region",
    type: "select",
    options: ["IDN", "VNM"],
    required: true,
    key: "countryRegion",
  },
  {
    label: "Tax Exempt Number",
    type: "text",
    required: true,
    key: "taxExemptNumber",
  },
  {
    label: "Company",
    type: "select",
    options: ["uab", "wel", "wir"],
    required: true,
    key: "taxCompany",
  },
  {
    label: "Company Name",
    type: "text",
    required: true,
    key: "companyName",
  },
  {
    label: "NIK",
    type: "text",
    required: true,
    key: "nik",
  },
  {
    label: "Non NPWP",
    type: "yes-no",
    required: false,
    key: "nonNpwp",
  },
];

// Final Customer Fields - General
const FINAL_CUSTOMER_GENERAL = [
  {
    label: "Customer Classification Group",
    type: "select",
    options: ["Dealer", "Internal", "External"],
    required: true,
    key: "customerClassificationGroup",
  },
  {
    label: "Customer Group",
    type: "select",
    options: ["LOC_EXT", "AQTP", "LSTP"],
    required: true,
    key: "customerGroup",
  },
  {
    label: "Customer Type",
    type: "select",
    options: ["Person", "Organization"],
    required: true,
    key: "customerType",
  },
  {
    label: "Generate Virtual Account",
    type: "yes-no",
    required: true,
    key: "generateVirtualAccount",
  },
  {
    label: "Main Customer",
    type: "select",
    options: ["NUSANTARA FARM", "PT. INDONUSA YP S1", "Others..."],
    required: true,
    key: "mainCustomer",
  },
  {
    label: "Organization Name",
    type: "text",
    required: true,
    key: "organizationName",
  },
  {
    label: "Search Name",
    type: "text",
    required: true,
    key: "searchName",
  },
];

// Final Customer Fields - Address
const FINAL_CUSTOMER_ADDRESS = [
  {
    label: "City",
    type: "select",
    options: ["T. Thái Nguyên", "Others..."],
    required: true,
    key: "city",
  },
  {
    label: "District",
    type: "select",
    options: ["H. Đại Từ", "Others..."],
    required: true,
    key: "district",
  },
  {
    label: "Street",
    type: "text",
    required: true,
    key: "street",
  },
  {
    label: "Country/Region",
    type: "select",
    options: ["VNM", "IDN"],
    required: true,
    key: "finalCountryRegion",
  },
  {
    label: "Country/Region ISO",
    type: "select",
    options: ["VN", "ID"],
    required: true,
    key: "countryRegionISO",
  },
  {
    label: "State",
    type: "text",
    required: false,
    key: "state",
  },
  {
    label: "Address Description",
    type: "text",
    required: true,
    key: "addressDescription",
  },
];

// Final Customer Fields - Contact Information
const FINAL_CUSTOMER_CONTACT = [
  {
    label: "Primary Email",
    type: "text",
    required: false,
    key: "primaryEmail",
  },
  {
    label: "Primary Phone",
    type: "text",
    required: false,
    key: "primaryPhone",
  },
  {
    label: "Contact Type",
    type: "select",
    options: ["Phone", "Email", "Fax"],
    required: false,
    key: "contactType",
  },
];

// Final Customer Fields - Sales Demographic
const FINAL_CUSTOMER_SALES = [
  {
    label: "Currency",
    type: "select",
    options: ["IDR", "VND"],
    required: true,
    key: "currency",
  },
  {
    label: "Line of Business",
    type: "select",
    options: ["Farm", "Dealer", "POULTRY", "SHRIMP", "FISH"],
    required: true,
    key: "lineOfBusiness",
  },
  {
    label: "Segment",
    type: "select",
    options: ["Miền Bắc", "Miền Nam"],
    required: true,
    key: "segment",
  },
  {
    label: "Subsegment",
    type: "select",
    options: ["Miền Bắc", "Miền Trung"],
    required: true,
    key: "subsegment",
  },
];

// Final Customer Fields - Credit and Collection
const FINAL_CUSTOMER_CREDIT = [
  {
    label: "Credit Limit",
    type: "text",
    required: false,
    key: "creditLimit",
  },
  {
    label: "Mandatory Credit Limit",
    type: "yes-no",
    required: true,
    key: "mandatoryCreditLimit",
  },
  {
    label: "Credit Management Group",
    type: "select",
    options: ["Internal", "AFF"],
    required: false,
    key: "creditManagementGroup",
  },
  {
    label: "Exclude from Credit Management",
    type: "yes-no",
    required: false,
    key: "excludeFromCreditManagement",
  },
  {
    label: "Invoicing and Delivery on Hold",
    type: "select",
    options: ["Yes", "No"],
    required: false,
    key: "invoicingDeliveryOnHold",
  },
];

// Final Customer Fields - Payment & Invoice
const FINAL_CUSTOMER_PAYMENT = [
  {
    label: "Price Group",
    type: "text",
    required: true,
    key: "priceGroup",
  },
  {
    label: "Terms of Payment",
    type: "select",
    options: ["Immediate", "30 Days", "90DAI"],
    required: true,
    key: "termsOfPayment",
  },
  {
    label: "Method of Payment",
    type: "select",
    options: ["Bank", "Cash"],
    required: true,
    key: "methodOfPayment",
  },
  {
    label: "Delivery Terms",
    type: "select",
    options: ["Collect", "Franco"],
    required: true,
    key: "deliveryTerms",
  },
  {
    label: "Mode of Delivery",
    type: "select",
    options: ["Truck", "Ship", "Air"],
    required: true,
    key: "modeOfDelivery",
  },
  {
    label: "Sales Tax Group",
    type: "select",
    options: ["VAT", "PPN OUT EX 11"],
    required: true,
    key: "salesTaxGroup",
  },
  {
    label: "Tax Exempt Number",
    type: "text",
    required: true,
    key: "finalTaxExemptNumber",
  },
  {
    label: "VAS E-Invoice",
    type: "yes-no",
    required: true,
    key: "vasEInvoice",
  },
];

const CustomerDetailForm = ({
  requestData,
  onBack,
  onViewApproval,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState("main");
  const [formData, setFormData] = useState({});
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const tabs = [
    { id: "main", label: "Main Customer", fields: MAIN_CUSTOMER_FIELDS },
    { id: "tax", label: "Tax", fields: TAX_FIELDS },
    {
      id: "final",
      label: "Final Customer",
      sections: [
        { title: "General", fields: FINAL_CUSTOMER_GENERAL },
        { title: "Address", fields: FINAL_CUSTOMER_ADDRESS },
        { title: "Contact Information", fields: FINAL_CUSTOMER_CONTACT },
        { title: "Sales Demographic", fields: FINAL_CUSTOMER_SALES },
        { title: "Credit and Collection", fields: FINAL_CUSTOMER_CREDIT },
        { title: "Payment & Invoice", fields: FINAL_CUSTOMER_PAYMENT },
      ],
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

        {field.note && (
          <Text variant="caption" color="muted" className="text-xs">
            {field.note}
          </Text>
        )}

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

    // Handle Final Customer tab with sections
    if (currentTab.sections) {
      return (
        <div className="space-y-8">
          {currentTab.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <Text
                variant="heading"
                size="lg"
                weight="semibold"
                className="border-b border-gray-200 pb-2"
              >
                {section.title}
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => renderField(field))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Handle Main Customer and Tax tabs
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
    console.log("Cancel request with comment:", comment);
    setShowCancelModal(false);
    // Handle cancel logic
  };

  const handleSubmitConfirm = () => {
    console.log("Submit request", formData);
    setShowSubmitModal(false);
    // Handle submit logic
    if (onSave) {
      onSave({ ...requestData, ...formData });
    }
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
        message="Are you sure you want to cancel this request? This action cannot be undone."
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
        message="Are you sure you want to submit this request for approval?"
        confirmText="Submit Request"
        showCommentInput={false}
      />
    </div>
  );
};

export default CustomerDetailForm;
