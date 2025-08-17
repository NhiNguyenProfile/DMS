import { useState, useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import MultiSelect from "../../atoms/MultiSelect";
import Toggle from "../../atoms/Toggle";
import ObjectSelectModal from "../../atoms/ObjectSelectModal";
import AddressTable from "../../atoms/AddressTable";
import TaxTable from "../../atoms/TaxTable";
import { ArrowLeft, Eye, X } from "lucide-react";
import ApprovalTreeSlider from "./ApprovalTreeSlider";
import ConfirmationModal from "../../atoms/ConfirmationModal";

// Form data structure
const MAIN_CUSTOMER_FIELDS = [
  {
    label: "Main Customer",
    type: "text",
    required: true,
    key: "mainCustomerCode",
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
    options: ["DHV", "PBH", "PHP", "PHY", "DGC", "DGD"],
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

// Final Customer Fields - General
const FINAL_CUSTOMER_GENERAL = [
  {
    label: "Customer Account",
    type: "text",
    required: false,
    key: "customerAccount",
    conditionalDisable: {
      dependsOn: "customerGroup",
      disableWhen: "LOC_EXT",
    },
  },
  {
    label: "Customer Classification Group",
    type: "select",
    options: ["Dealer", "Internal", "External"],
    required: true,
    key: "customerClassificationGroup",
  },
  {
    label: "Customer Group",
    type: "object-select",
    required: true,
    key: "customerGroup",
    objectConfig: {
      displayField: "customerGroup", // Field to show in input
      searchFields: ["customerGroup", "description"], // Fields to search in
      columns: [
        { key: "customerGroup", label: "Customer Group" },
        { key: "description", label: "Description" },
      ],
      data: [
        { customerGroup: "LOC_EXT", description: "Local External Customer" },
        { customerGroup: "AQTP", description: "Aquaculture Trading Partner" },
        { customerGroup: "LSTP", description: "Livestock Trading Partner" },
      ],
    },
  },
  {
    label: "Customer Type",
    type: "select",
    options: ["Person", "Organization"],
    required: true,
    key: "customerType",
  },
  // Conditional fields for Person
  {
    label: "First Name",
    type: "text",
    required: true,
    key: "firstName",
    conditional: {
      dependsOn: "customerType",
      showWhen: "Person",
    },
  },
  {
    label: "Middle Name",
    type: "text",
    required: false,
    key: "middleName",
    conditional: {
      dependsOn: "customerType",
      showWhen: "Person",
    },
  },
  {
    label: "Last Name Prefix",
    type: "text",
    required: true,
    key: "lastNamePrefix",
    conditional: {
      dependsOn: "customerType",
      showWhen: "Person",
    },
  },
  // Conditional field for Organization
  {
    label: "Name",
    type: "text",
    required: true,
    key: "organizationName",
    conditional: {
      dependsOn: "customerType",
      showWhen: "Organization",
    },
  },
  {
    label: "Generate Virtual Account",
    type: "yes-no",
    required: true,
    key: "generateVirtualAccount",
  },
  {
    label: "Main Customer",
    type: "object-select",
    required: true,
    key: "mainCustomer",
    objectConfig: {
      displayField: "mainCustomer", // Field to show in input
      searchFields: ["mainCustomer", "mainCustomerName", "company", "address"], // Fields to search in
      columns: [
        { key: "mainCustomer", label: "Main Customer" },
        { key: "mainCustomerName", label: "Main Customer Name" },
        { key: "company", label: "Company" },
        { key: "address", label: "Address" },
        { key: "nikNpwp", label: "NIK/NPWP" },
      ],
      data: [
        {
          mainCustomer: "FE001234M",
          mainCustomerName: "PT. Nusantara Farm Indonesia",
          company: "DHV",
          address: "Jl. Raya Jakarta No. 123, Jakarta Selatan",
          nikNpwp: "01.234.567.8-901.000",
        },
        {
          mainCustomer: "FE005678M",
          mainCustomerName: "PT. Indonusa Yudha Perkasa Sejahtera 1",
          company: "PBH",
          address: "Jl. Industri Raya No. 45, Bekasi",
          nikNpwp: "02.345.678.9-012.000",
        },
        {
          mainCustomer: "FE009012M",
          mainCustomerName: "PT. Charoen Pokphand Indonesia",
          company: "PHP",
          address: "Jl. Industri Selatan No. 78, Surabaya",
          nikNpwp: "03.456.789.0-123.000",
        },
        {
          mainCustomer: "FE003456M",
          mainCustomerName: "PT. Japfa Comfeed Indonesia",
          company: "PHY",
          address: "Jl. Raya Bogor No. 99, Bogor",
          nikNpwp: "04.567.890.1-234.000",
        },
        {
          mainCustomer: "FE007890M",
          mainCustomerName: "PT. Gold Coin Indonesia",
          company: "DGC",
          address: "Jl. Industri Utara No. 56, Medan",
          nikNpwp: "05.678.901.2-345.000",
        },
        {
          mainCustomer: "FE002468M",
          mainCustomerName: "PT. Diamond Feed Indonesia",
          company: "DGD",
          address: "Jl. Raya Semarang No. 34, Semarang",
          nikNpwp: "06.789.012.3-456.000",
        },
        {
          mainCustomer: "NEW CUSTOMER",
          mainCustomerName: "",
          company: "",
          address: "",
          nikNpwp: "",
        },
      ],
    },
  },
  {
    label: "Search Name",
    type: "text",
    required: true,
    key: "searchName",
  },
];

// Address data is now handled by AddressTable component

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
  const [activeTab, setActiveTab] = useState("final");
  const [formData, setFormData] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [taxRecords, setTaxRecords] = useState([]);
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedLegalEntities, setSelectedLegalEntities] = useState([]);
  const [objectSelectModal, setObjectSelectModal] = useState({
    isOpen: false,
    field: null,
  });

  // Pre-fill data for Copy and Edit requests
  useEffect(() => {
    if (requestData?.sourceCustomerData) {
      const sourceData = requestData.sourceCustomerData;

      if (requestData?.isCopy) {
        // For Copy: Copy everything EXCEPT code (Customer Account + Main Customer), name, address, tax number
        const preFillData = {
          // Main Customer section - EXCLUDE these fields for Copy
          mainCustomerCode: "", // Don't copy code
          mainCustomerName: "", // Don't copy name
          company: sourceData.company || "",
          address: "", // Don't copy address
          nikNpwp: "", // Don't copy tax number

          // Final Customer section - Copy all other fields
          customerAccount: "", // Don't copy Customer Account code
          customerClassificationGroup: sourceData.classificationGroup || "",
          customerGroup: sourceData.group || "",
          customerType: sourceData.type || "Organization",
          generateVirtualAccount: sourceData.generateVirtualAccount || "no",
          mainCustomer: "", // Don't copy Main Customer name
          organizationName: "", // Don't copy organization name
          searchName: "", // Don't copy search name

          // Copy all other fields that exist in sourceData
          ...Object.keys(sourceData).reduce((acc, key) => {
            // Skip the excluded fields
            const excludedFields = [
              "code",
              "name",
              "address",
              "nikNpwp",
              "customerAccount",
            ];
            if (!excludedFields.includes(key)) {
              acc[key] = sourceData[key];
            }
            return acc;
          }, {}),
        };

        setFormData(preFillData);
      } else if (requestData?.isExtend) {
        // For Extend: Keep code (Customer Account + Main Customer), name, address, tax number
        const preFillData = {
          // Main Customer section
          mainCustomerCode: sourceData.code || "",
          mainCustomerName: sourceData.name || "",
          company: sourceData.company || "",
          address: sourceData.address || "",
          nikNpwp: sourceData.nikNpwp || "",

          // Final Customer section - General - Keep existing codes and basic info
          customerAccount: sourceData.customerAccount || "",
          mainCustomer: sourceData.name || "",
          organizationName: sourceData.name || "",
          searchName: sourceData.searchName || sourceData.name || "",

          // Other fields left empty for user input
          customerClassificationGroup: "",
          customerGroup: "",
          customerType: "Organization",
          generateVirtualAccount: "no",
        };

        setFormData(preFillData);
      } else if (requestData?.requestType === "Edit") {
        // For Edit: Pre-fill all sections with complete data
        const preFillData = {
          // Main Customer section
          mainCustomerCode: sourceData.code || "",
          mainCustomerName: sourceData.name || "",
          company: sourceData.company || "",
          address: sourceData.address || "",
          nikNpwp: sourceData.nikNpwp || "",

          // Final Customer section - General
          customerAccount: sourceData.customerAccount || "",
          customerClassificationGroup: sourceData.classificationGroup || "",
          customerGroup: sourceData.group || "",
          customerType: sourceData.type || "Organization",
          generateVirtualAccount: "no",
          mainCustomer: sourceData.name || "",
          organizationName: sourceData.name || "",
          searchName: sourceData.searchName || sourceData.name || "",

          // Address data will be handled separately

          // Final Customer section - Contact
          primaryEmail: sourceData.email || "",
          primaryPhone: sourceData.phone || "",
          contactType: "Email",

          // Final Customer section - Sales
          currency: sourceData.currency || "VND",
          lineOfBusiness: sourceData.lineOfBusiness || "Farm",
          segment: sourceData.segment || "",
          subsegment: sourceData.subsegment || "",

          // Final Customer section - Credit
          creditLimit: sourceData.creditLimit || "",
          mandatoryCreditLimit: "no",
          creditManagementGroup: sourceData.creditManagementGroup || "",
          excludeFromCreditManagement: "no",
          invoicingDeliveryOnHold: "No",

          // Final Customer section - Payment
          priceGroup: sourceData.priceGroup || "",
          termsOfPayment: sourceData.termsOfPayment || "30 Days",
          methodOfPayment: sourceData.methodOfPayment || "Bank",
          deliveryTerms: sourceData.deliveryTerms || "Franco",
          modeOfDelivery: sourceData.modeOfDelivery || "Truck",
          salesTaxGroup: sourceData.salesTaxGroup || "VAT",
          finalTaxExemptNumber: sourceData.taxExemptNumber || "",
          vasEInvoice: "no",
        };

        setFormData(preFillData);

        // Set sample addresses for Edit mode
        if (requestData?.requestType === "Edit") {
          setAddresses([
            {
              id: 1,
              city: sourceData.city || "T. Thái Nguyên",
              district: sourceData.district || "H. Đại Từ",
              street: sourceData.street || "123 Main Street",
              finalCountryRegion: "VNM",
              countryRegionISO: "VN",
              state: sourceData.state || "Thái Nguyên",
              addressDescription:
                sourceData.address || "Primary business address",
            },
          ]);
        }
      }
    }
  }, [requestData]);

  // Dynamic tabs based on whether Main Customer is selected
  const tabs = [
    {
      id: "final",
      label: "Final Customer",
      sections: [
        { title: "General", fields: FINAL_CUSTOMER_GENERAL },
        { title: "Address", isAddressTable: true },
        { title: "Contact Information", fields: FINAL_CUSTOMER_CONTACT },
        { title: "Sales Demographic", fields: FINAL_CUSTOMER_SALES },
        { title: "Credit and Collection", fields: FINAL_CUSTOMER_CREDIT },
        { title: "Payment & Invoice", fields: FINAL_CUSTOMER_PAYMENT },
        { title: "Tax Exempt Number", isTaxTable: true },
      ],
    },
    // Show Main Customer tab logic:
    // - If NOT in edit mode: always show tab
    // - If in edit mode: only show if main customer is selected (including "NEW CUSTOMER")
    ...(requestData?.currentSteps !== "Waiting for Entry" ||
    formData.mainCustomer
      ? [
          {
            id: "main",
            label: "Main Customer",
            fields: MAIN_CUSTOMER_FIELDS,
          },
        ]
      : []),
  ];

  const handleInputChange = (key, value) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [key]: value,
      };

      // If Main Customer is completely cleared in edit mode, switch back to final tab
      if (
        key === "mainCustomer" &&
        !value &&
        activeTab === "main" &&
        requestData?.currentSteps === "Waiting for Entry"
      ) {
        setActiveTab("final");
      }

      // Handle conditional disable logic - clear disabled fields
      if (key === "customerGroup") {
        // If Customer Group is LOC_EXT, clear Customer Account
        if (value === "LOC_EXT") {
          newData.customerAccount = "";
        }
      }

      return newData;
    });
  };

  const handleObjectSelect = (field) => {
    setObjectSelectModal({
      isOpen: true,
      field: field,
    });
  };

  const handleObjectSelectConfirm = (selectedItem) => {
    if (objectSelectModal.field) {
      const displayValue =
        selectedItem[objectSelectModal.field.objectConfig.displayField];

      // Special handling for Main Customer selection - auto-fill Main Customer section
      if (objectSelectModal.field.key === "mainCustomer") {
        setFormData((prev) => ({
          ...prev,
          [objectSelectModal.field.key]: displayValue,
          [`${objectSelectModal.field.key}_object`]: selectedItem,
          // Fill Main Customer section fields
          mainCustomerCode: selectedItem.mainCustomer || "", // Map mainCustomer to mainCustomerCode
          mainCustomerName: selectedItem.mainCustomerName || "",
          company: selectedItem.company || "",
          address: selectedItem.address || "",
          nikNpwp: selectedItem.nikNpwp || "",
        }));
      } else {
        // Normal handling for other object-select fields
        handleInputChange(objectSelectModal.field.key, displayValue);
        // Store the full object for reference if needed
        handleInputChange(
          `${objectSelectModal.field.key}_object`,
          selectedItem
        );
      }
    }
    setObjectSelectModal({ isOpen: false, field: null });
  };

  const handleObjectSelectClose = () => {
    setObjectSelectModal({ isOpen: false, field: null });
  };

  const renderField = (field) => {
    const value = formData[field.key] || "";
    const isEditable = requestData?.currentSteps === "Waiting for Entry";

    // Check if field should be conditionally rendered
    if (field.conditional) {
      const dependentValue = formData[field.conditional.dependsOn];
      if (dependentValue !== field.conditional.showWhen) {
        return null; // Don't render this field
      }
    }

    // Check if field should be conditionally disabled
    let isFieldDisabled = !isEditable;
    if (field.conditionalDisable && isEditable) {
      const dependentValue = formData[field.conditionalDisable.dependsOn];
      if (dependentValue === field.conditionalDisable.disableWhen) {
        isFieldDisabled = true;
      }
    }

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
          {isFieldDisabled && isEditable && (
            <span className="text-xs text-orange-500 ml-2">(Disabled)</span>
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
              !isFieldDisabled
                ? (e) => handleInputChange(field.key, e.target.value)
                : undefined
            }
            placeholder={
              !isFieldDisabled ? `Enter ${field.label.toLowerCase()}` : ""
            }
            required={field.required}
            disabled={isFieldDisabled}
            className={isFieldDisabled ? "bg-gray-50 cursor-not-allowed" : ""}
          />
        )}

        {field.type === "select" && (
          <Select
            options={field.options.map((opt) => ({ value: opt, label: opt }))}
            value={value}
            onChange={
              !isFieldDisabled
                ? (val) => handleInputChange(field.key, val)
                : undefined
            }
            placeholder={
              !isFieldDisabled ? `Select ${field.label.toLowerCase()}` : ""
            }
            disabled={isFieldDisabled}
          />
        )}

        {field.type === "yes-no" && (
          <Toggle
            checked={value === "yes"}
            onChange={(checked) =>
              !isFieldDisabled &&
              handleInputChange(field.key, checked ? "yes" : "no")
            }
            disabled={isFieldDisabled}
            label={value === "yes" ? "Yes" : "No"}
          />
        )}

        {field.type === "object-select" && (
          <div className="relative">
            <Input
              value={value}
              placeholder={
                !isFieldDisabled ? `Select ${field.label.toLowerCase()}` : ""
              }
              readOnly
              disabled={isFieldDisabled}
              className={`cursor-pointer ${
                isFieldDisabled ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
              onClick={
                !isFieldDisabled ? () => handleObjectSelect(field) : undefined
              }
            />
            {!isFieldDisabled && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>
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
          {currentTab.sections.map((section, index) => {
            // Handle Address Table section
            if (section.isAddressTable) {
              return (
                <div key={index} className="space-y-4">
                  <Text
                    variant="heading"
                    size="lg"
                    weight="semibold"
                    className="border-b border-gray-200 pb-2"
                  >
                    {section.title}
                  </Text>
                  <AddressTable
                    addresses={addresses}
                    onChange={setAddresses}
                    disabled={requestData?.currentSteps !== "Waiting for Entry"}
                  />
                </div>
              );
            }

            // Handle Tax Table section
            if (section.isTaxTable) {
              return (
                <div key={index} className="space-y-4">
                  <Text
                    variant="heading"
                    size="lg"
                    weight="semibold"
                    className="border-b border-gray-200 pb-2"
                  >
                    {section.title}
                  </Text>
                  <TaxTable
                    taxRecords={taxRecords}
                    onChange={setTaxRecords}
                    disabled={requestData?.currentSteps !== "Waiting for Entry"}
                  />
                </div>
              );
            }

            // Filter fields that should be rendered (including conditional logic)
            const visibleFields = section.fields.filter((field) => {
              if (!field.conditional) return true;
              const dependentValue = formData[field.conditional.dependsOn];
              return dependentValue === field.conditional.showWhen;
            });

            return (
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
                  {visibleFields.map((field) => renderField(field))}
                </div>
              </div>
            );
          })}
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

    // Different button text and behavior for mass create
    if (requestData.isMassCreate) {
      actions.push({
        label: "Save",
        variant: "primary",
        action: "save",
      });
    } else if (requestData.currentSteps === "Waiting for Entry") {
      // Submit button only for "Waiting for Entry" status
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
        // For mass create, save directly without confirmation
        if (onSave) {
          onSave({ ...requestData, ...formData, addresses });
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
    console.log("Cancel request with comment:", comment);
    setShowCancelModal(false);
    // Handle cancel logic
  };

  const handleSubmitConfirm = () => {
    console.log("Submit request", formData);
    console.log("Selected Legal Entities:", selectedLegalEntities);
    setShowSubmitModal(false);

    // Handle submit logic with selected legal entities
    if (onSave) {
      onSave({
        ...requestData,
        ...formData,
        addresses,
        copyToLegalEntities: selectedLegalEntities,
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-full">
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
      <div className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 mt-8">
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

      {/* Submit Confirmation Modal with Legal Entity Selection */}
      {showSubmitModal && (
        <div className="fixed inset-0 !mt-0 bg-black bg-opacity-50 transition-opacity z-[100]">
          <div className="fixed inset-0 !mt-0 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-visible">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                <div>
                  <Text variant="heading" size="lg" weight="semibold">
                    Submit Request
                  </Text>
                  <Text variant="caption" color="muted">
                    {requestData?.isCopy || requestData?.requestType === "Copy"
                      ? "Confirm your copy request submission"
                      : "Confirm submission for approval"}
                  </Text>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setShowSubmitModal(false)}
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto overflow-x-visible min-h-0">
                <div className="space-y-4">
                  {requestData?.isCopy ||
                  requestData?.requestType === "Copy" ? (
                    <>
                      <Text variant="body" className="mb-4">
                        Are you sure you want to submit this copy request for
                        approval?
                      </Text>
                      <Text variant="body" color="muted" className="text-sm">
                        The request will be sent to the approval workflow.
                      </Text>
                    </>
                  ) : requestData?.isExtend ? (
                    <>
                      <Text variant="body" className="mb-4">
                        This customer record will be extended to the selected
                        Legal Entities.
                      </Text>

                      <div>
                        <Text variant="body" weight="medium" className="mb-3">
                          Select Legal Entities to extend to:
                        </Text>

                        <div style={{ position: "relative", zIndex: 9999 }}>
                          <MultiSelect
                            options={[
                              { value: "DHV", label: "DHV" },
                              { value: "PBH", label: "PBH" },
                              { value: "PHP", label: "PHP" },
                              { value: "PHY", label: "PHY" },
                              { value: "DGC", label: "DGC" },
                              { value: "DGD", label: "DGD" },
                              { value: "DHP", label: "DHP" },
                              {
                                value: "DHT",
                                label: "DHT",
                              },
                            ]}
                            value={selectedLegalEntities}
                            onChange={setSelectedLegalEntities}
                            placeholder="Select Legal Entities to extend to..."
                            searchable={true}
                            dropdownClassName="!z-[9999] absolute"
                            className="relative"
                            style={{ zIndex: 9999 }}
                          />
                        </div>

                        {selectedLegalEntities.length > 0 && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <Text
                              variant="body"
                              weight="medium"
                              className="mb-2"
                            >
                              Selected Legal Entities (
                              {selectedLegalEntities.length}):
                            </Text>
                            <div className="flex flex-wrap gap-2">
                              {selectedLegalEntities.map((entity) => (
                                <span
                                  key={entity}
                                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                >
                                  {entity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <Text variant="body">
                      Are you sure you want to submit this request for approval?
                    </Text>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmitModal(false)}
                >
                  {requestData?.isCopy || requestData?.requestType === "Copy"
                    ? "No"
                    : "Cancel"}
                </Button>
                <Button variant="primary" onClick={handleSubmitConfirm}>
                  {requestData?.isCopy || requestData?.requestType === "Copy"
                    ? "Yes"
                    : "Submit Request"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Object Select Modal */}
      {objectSelectModal.field && (
        <ObjectSelectModal
          isOpen={objectSelectModal.isOpen}
          onClose={handleObjectSelectClose}
          onSelect={handleObjectSelectConfirm}
          title={`Select ${objectSelectModal.field.label}`}
          columns={objectSelectModal.field.objectConfig.columns}
          data={objectSelectModal.field.objectConfig.data}
          searchFields={objectSelectModal.field.objectConfig.searchFields}
          selectedValue={formData[objectSelectModal.field.key]}
        />
      )}
    </div>
  );
};

export default CustomerDetailForm;
