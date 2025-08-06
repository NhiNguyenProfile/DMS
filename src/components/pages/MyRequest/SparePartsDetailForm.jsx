import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import Toggle from "../../atoms/Toggle";
import MultiSelect from "../../atoms/MultiSelect";
import { ArrowLeft, Eye, ChevronDown, ChevronRight } from "lucide-react";
import ApprovalTreeSlider from "./ApprovalTreeSlider";
import ConfirmationModal from "../../atoms/ConfirmationModal";

// Spare Parts Form Fields - Updated according to specification
const GENERAL_FIELDS = [
  {
    label: "Product type",
    type: "text",
    required: false,
    key: "productType",
    defaultValue: "Item",
    readOnly: true,
  },
  {
    label: "Product Subtype",
    type: "text",
    required: false,
    key: "productSubtype",
    defaultValue: "Product",
    readOnly: true,
  },
  {
    label: "Item Number",
    type: "text",
    required: true,
    key: "itemNumber",
  },
  {
    label: "Product number",
    type: "text",
    required: true,
    key: "productNumber",
  },
  {
    label: "Business Sector",
    type: "text",
    required: false,
    key: "businessSector",
  },
  {
    label: "Item type",
    type: "text",
    required: false,
    key: "itemType",
    defaultValue: "Unknown",
    readOnly: true,
  },
  {
    label: "5Class Group",
    type: "text",
    required: false,
    key: "classGroup",
  },
  {
    label: "5Class Type",
    type: "text",
    required: false,
    key: "classType",
    defaultValue: "Spare Part",
    readOnly: true,
  },
  {
    label: "5Class Kind",
    type: "text",
    required: false,
    key: "classKind",
  },
  {
    label: "5Class Sub Group",
    type: "text",
    required: false,
    key: "classSubGroup",
  },
  {
    label: "5Class Ultra Group",
    type: "text",
    required: false,
    key: "classUltraGroup",
  },
  {
    label: "Sync to DHC",
    type: "text",
    required: false,
    key: "syncToDHC",
    defaultValue: "No",
    readOnly: true,
  },
  {
    label: "Product Name",
    type: "text",
    required: true,
    key: "productName",
  },
  {
    label: "Search name",
    type: "text",
    required: true,
    key: "searchName",
  },
  {
    label: "Storage dimension group",
    type: "text",
    required: false,
    key: "storageDimensionGroup",
    defaultValue: "SWFL",
    readOnly: true,
  },
  {
    label: "Tracking dimension group",
    type: "text",
    required: false,
    key: "trackingDimensionGroup",
    defaultValue: "None",
    readOnly: true,
  },
  {
    label: "Item model group",
    type: "select",
    options: ["FIFO", "LIFO", "Standard", "Weighted Average"],
    required: true,
    key: "itemModelGroup",
  },
  {
    label: "Local Item Classification",
    type: "select",
    options: ["Class A", "Class B", "Class C", "Class D"],
    required: true,
    key: "localItemClassification",
  },
];

const PURCHASE_FIELDS = [
  {
    label: "Purchase unit",
    type: "select",
    options: ["PCS", "KG", "L", "M", "SET"],
    required: true,
    key: "purchaseUnit",
  },
  {
    label: "Overdelivery percentage for purchases",
    type: "text",
    required: false,
    key: "overdeliveryPercentagePurchases",
    defaultValue: "0",
    readOnly: true,
  },
  {
    label: "Underdelivery percentage for purchases",
    type: "text",
    required: false,
    key: "underdeliveryPercentagePurchases",
    defaultValue: "100",
    readOnly: true,
  },
  {
    label: "Purchased item quality",
    type: "text",
    required: false,
    key: "purchasedItemQuality",
  },
  {
    label: "Item sales tax group for purchases",
    type: "select",
    options: ["VAT", "Non-VAT", "Exempt", "Zero-rated"],
    required: true,
    key: "itemSalesTaxGroupPurchases",
  },
  {
    label: "Approved vendor check method",
    type: "text",
    required: false,
    key: "approvedVendorCheckMethod",
    defaultValue: "No Check",
    readOnly: true,
  },
];

const SELL_FIELDS = [
  {
    label: "Sale unit",
    type: "select",
    options: ["PCS", "KG", "L", "M", "SET"],
    required: true,
    key: "saleUnit",
  },
  {
    label: "Overdelivery percentage for sales",
    type: "text",
    required: false,
    key: "overdeliveryPercentageSales",
    defaultValue: "0",
    readOnly: true,
  },
  {
    label: "Underdelivery percentage for sales",
    type: "text",
    required: false,
    key: "underdeliveryPercentageSales",
    defaultValue: "100",
    readOnly: true,
  },
  {
    label: "Item sales tax group for sales",
    type: "select",
    options: ["VAT", "Non-VAT", "Exempt", "Zero-rated"],
    required: true,
    key: "itemSalesTaxGroupSales",
  },
  {
    label: "Pricing Formula",
    type: "text",
    required: false,
    key: "pricingFormula",
    defaultValue: "Standard",
    readOnly: true,
  },
  {
    label: "Sales price model",
    type: "text",
    required: false,
    key: "salesPriceModel",
    defaultValue: "None",
    readOnly: true,
  },
  {
    label: "Base price",
    type: "text",
    required: false,
    key: "basePrice",
    defaultValue: "Purchase Price",
    readOnly: true,
  },
  {
    label: "When to use: Alternative product",
    type: "text",
    required: false,
    key: "whenToUseAlternativeProduct",
    defaultValue: "Never",
    readOnly: true,
  },
  {
    label: "Allow sales price adjustment",
    type: "text",
    required: false,
    key: "allowSalesPriceAdjustment",
    defaultValue: "Yes",
    readOnly: true,
  },
  {
    label: "Date of Price",
    type: "date",
    required: false,
    key: "dateOfPrice",
  },
];

const MANAGE_INVENTORY_FIELDS = [
  {
    label: "Net Weight",
    type: "number",
    required: false,
    key: "netWeight",
  },
  {
    label: "Inventory unit",
    type: "select",
    options: ["PCS", "KG", "L", "M", "SET"],
    required: true,
    key: "inventoryUnit",
  },
  {
    label: "Packing group",
    type: "text",
    required: false,
    key: "packingGroup",
    defaultValue: "Bulk",
    readOnly: true,
  },
  {
    label: "Overdelivery percentage for transfer orders",
    type: "text",
    required: false,
    key: "overdeliveryPercentageTransferOrders",
    defaultValue: "0",
    readOnly: true,
  },
  {
    label: "Underdelivery percentage for transfer orders",
    type: "text",
    required: false,
    key: "underdeliveryPercentageTransferOrders",
    defaultValue: "100",
    readOnly: true,
  },
  {
    label: "Yield percent",
    type: "text",
    required: false,
    key: "yieldPercent",
    defaultValue: "0",
    readOnly: true,
  },
  {
    label: "CW unit",
    type: "text",
    required: false,
    key: "cwUnit",
  },
  {
    label: "CW product",
    type: "text",
    required: false,
    key: "cwProduct",
    defaultValue: "No",
    readOnly: true,
  },
  {
    label: "Maximum quantity",
    type: "text",
    required: false,
    key: "maximumQuantity",
    defaultValue: "0",
    readOnly: true,
  },
  {
    label: "Minimum quantity",
    type: "text",
    required: false,
    key: "minimumQuantity",
    defaultValue: "0",
    readOnly: true,
  },
  {
    label: "Bag item",
    type: "select",
    options: ["Yes", "No"],
    required: true,
    key: "bagItem",
  },
  {
    label: "Default Order Settings Menu",
    type: "text",
    required: true,
    key: "defaultOrderSettingsMenu",
  },
];

const ENGINEER_FIELDS = [
  {
    label: "Production type",
    type: "text",
    required: false,
    key: "productionType",
    defaultValue: "None",
    readOnly: true,
  },
  {
    label: "BOM Unit",
    type: "text",
    required: false,
    key: "bomUnit",
    defaultValue: "Blank",
    readOnly: true,
  },
];

const MANAGE_COSTS_FIELDS = [
  {
    label: "Item Group",
    type: "text",
    required: false,
    key: "itemGroup",
    defaultValue: "SPP",
    readOnly: true,
  },
  {
    label: "Latest Cost Price",
    type: "text",
    required: false,
    key: "latestCostPrice",
    defaultValue: "Yes",
    readOnly: true,
  },
];

const FINANCIAL_DIMENSIONS_FIELDS = [
  {
    label: "A00_BusinessUnit",
    type: "text",
    required: false,
    key: "a00BusinessUnit",
  },
  {
    label: "A01_CostCategory",
    type: "text",
    required: false,
    key: "a01CostCategory",
  },
  {
    label: "A02_Intercompany",
    type: "text",
    required: false,
    key: "a02Intercompany",
  },
  {
    label: "A03_Department",
    type: "text",
    required: false,
    key: "a03Department",
  },
  {
    label: "A04_Location",
    type: "text",
    required: false,
    key: "a04Location",
  },
  {
    label: "A05_Employee",
    type: "text",
    required: false,
    key: "a05Employee",
  },
  {
    label: "A06_Cashflow",
    type: "text",
    required: false,
    key: "a06Cashflow",
  },
  {
    label: "A08_Division",
    type: "text",
    required: false,
    key: "a08Division",
  },
  {
    label: "A09_Species",
    type: "text",
    required: false,
    key: "a09Species",
  },
  {
    label: "A10_Bank Account",
    type: "text",
    required: false,
    key: "a10BankAccount",
  },
  {
    label: "A11_Project",
    type: "text",
    required: false,
    key: "a11Project",
  },
  {
    label: "A12_Customer",
    type: "text",
    required: false,
    key: "a12Customer",
  },
  {
    label: "A13_Cost Center",
    type: "text",
    required: false,
    key: "a13CostCenter",
  },
];

const PRODUCT_ATTRIBUTE_FIELDS = [
  {
    label: "Product Form",
    type: "text",
    required: false,
    key: "productForm",
  },
];

const UNIT_OF_CONVERSION_FIELDS = [
  {
    label: "Unit of measure conversion",
    type: "text",
    required: false,
    key: "unitOfMeasureConversion",
  },
];

const SparePartsDetailForm = ({ requestData, onBack, onSave }) => {
  // Debug: Log requestData to check if it's being passed correctly
  console.log("SparePartsDetailForm - requestData:", requestData);

  const [activeTab, setActiveTab] = useState("product");
  const [formData, setFormData] = useState({});
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [selectedLegalEntities, setSelectedLegalEntities] = useState([
    "DHV",
    "DHBH",
    "DHHP",
  ]);

  // Tab configuration - easy to add new tabs
  const tabsConfig = [
    {
      id: "product",
      label: "Product",
      groups: [
        { id: "general", label: "General", fields: GENERAL_FIELDS },
        { id: "purchase", label: "Purchase", fields: PURCHASE_FIELDS },
        { id: "sell", label: "Sell", fields: SELL_FIELDS },
        {
          id: "manageInventory",
          label: "Manage Inventory",
          fields: MANAGE_INVENTORY_FIELDS,
        },
        { id: "engineer", label: "Engineer", fields: ENGINEER_FIELDS },
        {
          id: "manageCosts",
          label: "Manage Costs",
          fields: MANAGE_COSTS_FIELDS,
        },
        {
          id: "financialDimensions",
          label: "Financial Dimensions",
          fields: FINANCIAL_DIMENSIONS_FIELDS,
        },
        {
          id: "productAttribute",
          label: "Product Attribute",
          fields: PRODUCT_ATTRIBUTE_FIELDS,
        },
        {
          id: "unitOfConversion",
          label: "Unit of Conversion",
          fields: UNIT_OF_CONVERSION_FIELDS,
        },
      ],
    },
  ];

  // Create tabs array for manual tab implementation
  const tabs = tabsConfig.map((tab) => ({
    id: tab.id,
    label: tab.label,
    count: tab.groups.length,
  }));

  // Get groups from current active tab
  const groups = tabsConfig.find((tab) => tab.id === activeTab)?.groups || [];

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleGroupCollapse = (groupId) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const renderField = (field) => {
    const value = formData[field.key] || field.defaultValue || "";
    const isEditable =
      requestData?.currentSteps === "Waiting for Entry" && !field.readOnly;

    return (
      <div key={field.key} className="space-y-2">
        <div className="flex items-center gap-1">
          <Text variant="body" weight="medium">
            {field.label}
          </Text>
          {field.required && <span className="text-red-500 text-sm">*</span>}
          {(!isEditable || field.readOnly) && (
            <span className="text-xs text-gray-500 ml-2">
              {field.readOnly ? "(Default Value)" : "(View Only)"}
            </span>
          )}
        </div>

        {(field.type === "text" ||
          field.type === "number" ||
          field.type === "date") && (
          <Input
            type={field.type}
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
          <Toggle
            checked={value === "yes"}
            onChange={(checked) =>
              isEditable && handleInputChange(field.key, checked ? "yes" : "no")
            }
            disabled={!isEditable}
            label={value === "yes" ? "Yes" : "No"}
          />
        )}
      </div>
    );
  };

  const renderAllGroups = () => {
    return (
      <div className="space-y-8">
        {groups.map((group) => {
          const isCollapsed = collapsedGroups[group.id];

          return (
            <div key={group.id} className="space-y-6">
              {/* Group Header with Collapse Toggle */}
              <div className="border-b border-gray-200 pb-2">
                <button
                  onClick={() => toggleGroupCollapse(group.id)}
                  className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronRight size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                  <Text
                    variant="heading"
                    size="lg"
                    weight="bold"
                    className="text-gray-900"
                  >
                    {group.label}
                  </Text>
                </button>
              </div>

              {/* Group Fields - Only show if not collapsed */}
              {!isCollapsed && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {group.fields.map((field) => renderField(field))}
                </div>
              )}
            </div>
          );
        })}
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

    // Different button for mass create vs regular request
    if (requestData.isMassCreate) {
      actions.push({
        label: "Save",
        variant: "primary",
        action: "save",
      });
    } else if (requestData.currentSteps === "Waiting for Entry") {
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
        if (requestData?.isMassCreate) {
          // For mass create, cancel directly without confirmation
          if (onBack) {
            onBack();
          }
        } else {
          // For regular requests, show confirmation modal
          setShowCancelModal(true);
        }
        break;
      case "save":
        // For mass create, save directly
        if (onSave) {
          onSave({ ...requestData, ...formData });
        }
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
    console.log("Submit spare parts request", {
      formData,
      selectedLegalEntities,
    });
    setShowSubmitModal(false);
    // Handle submit logic - product will be released to selected legal entities
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
                {requestData?.id || "No ID"} -{" "}
                {requestData?.requestTitle || "No Title"}
              </Text>
              {/* Debug info */}
              {!requestData && (
                <div className="text-red-500 text-sm mt-1">
                  Debug: requestData is null/undefined
                </div>
              )}
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
          {activeTab === "product" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {renderAllGroups()}
            </div>
          )}
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

      {/* Submit Confirmation Modal with Legal Entity Selection */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-4">
              <Text variant="heading" size="lg" weight="bold">
                Submit Request
              </Text>
              <Text variant="body" className="text-gray-600 mt-2">
                Which legal entities would you like to release this product to?
              </Text>
            </div>

            <div className="mb-6">
              <Text variant="body" weight="medium" className="mb-3">
                Select Legal Entities:
              </Text>
              <MultiSelect
                options={[
                  { value: "DHV", label: "DHV" },
                  { value: "DHBH", label: "DHBH" },
                  { value: "DHHP", label: "DHHP" },
                  { value: "DHHY", label: "DHHY" },
                  { value: "DHGC", label: "DHGC" },
                  { value: "DHGD", label: "DHGD" },
                ]}
                value={selectedLegalEntities}
                onChange={setSelectedLegalEntities}
                placeholder="Select legal entities..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSubmitModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitConfirm}
                disabled={selectedLegalEntities.length === 0}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SparePartsDetailForm;
