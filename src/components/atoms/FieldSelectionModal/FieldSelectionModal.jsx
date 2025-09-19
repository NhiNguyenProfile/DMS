import { useState, useEffect } from "react";
import Modal from "../Modal";
import Button from "../Button";
import Text from "../Text";
import Input from "../Input";
import Checkbox from "../Checkbox";

// Field definitions from CustomerDetailForm
const FINAL_CUSTOMER_GENERAL = [
  {
    label: "Customer Account",
    type: "text",
    required: false,
    key: "customerAccount",
  },
  {
    label: "Main Customer",
    type: "text",
    required: false,
    key: "MainCustomer",
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
  },
  {
    label: "Customer Type",
    type: "select",
    options: ["Person", "Organization"],
    required: true,
    key: "customerType",
  },
];

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

// Address fields
const ADDRESS_FIELDS = [
  { label: "City", key: "city" },
  { label: "District", key: "district" },
  { label: "Street", key: "street" },
  { label: "Country Region", key: "finalCountryRegion" },
  { label: "Country ISO", key: "countryRegionISO" },
  { label: "State", key: "state" },
  { label: "Address Description", key: "addressDescription" },
];

// Tax fields
const TAX_FIELDS = [
  { label: "Tax Exempt Number", key: "taxExemptNumber" },
  { label: "Tax Authority", key: "taxAuthority" },
];

const FieldSelectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Select Fields for Template",
}) => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Build flat field options for MultiSelect
  const buildFieldOptions = () => {
    const fieldOptions = [];

    // Add General fields
    FINAL_CUSTOMER_GENERAL.forEach((field) => {
      fieldOptions.push({
        value: `final_customer_general_${field.key}`,
        label: `General - ${field.label}`,
        key: field.key,
        group: "final_customer_general",
      });
    });

    // Add Address fields
    ADDRESS_FIELDS.forEach((field) => {
      fieldOptions.push({
        value: `final_customer_address_${field.key}`,
        label: `Address - ${field.label}`,
        key: field.key,
        group: "final_customer_address",
      });
    });

    // Add Contact fields
    FINAL_CUSTOMER_CONTACT.forEach((field) => {
      fieldOptions.push({
        value: `final_customer_contact_${field.key}`,
        label: `Contact - ${field.label}`,
        key: field.key,
        group: "final_customer_contact",
      });
    });

    // Add Sales fields
    FINAL_CUSTOMER_SALES.forEach((field) => {
      fieldOptions.push({
        value: `final_customer_sales_${field.key}`,
        label: `Sales - ${field.label}`,
        key: field.key,
        group: "final_customer_sales",
      });
    });

    // Add Credit fields
    FINAL_CUSTOMER_CREDIT.forEach((field) => {
      fieldOptions.push({
        value: `final_customer_credit_${field.key}`,
        label: `Credit - ${field.label}`,
        key: field.key,
        group: "final_customer_credit",
      });
    });

    // Add Payment fields
    FINAL_CUSTOMER_PAYMENT.forEach((field) => {
      fieldOptions.push({
        value: `final_customer_payment_${field.key}`,
        label: `Payment - ${field.label}`,
        key: field.key,
        group: "final_customer_payment",
      });
    });

    // Add Tax fields
    TAX_FIELDS.forEach((field) => {
      fieldOptions.push({
        value: `final_customer_tax_${field.key}`,
        label: `Tax - ${field.label}`,
        key: field.key,
        group: "final_customer_tax",
      });
    });

    return fieldOptions;
  };

  // Get selected field details for CSV generation
  const getSelectedFieldDetails = () => {
    const fieldOptions = buildFieldOptions();
    const selectedFieldDetails = [];

    selectedFields.forEach((selectedValue) => {
      const field = fieldOptions.find(
        (option) => option.value === selectedValue
      );
      if (field) {
        selectedFieldDetails.push({
          key: field.key,
          label: field.label.split(" - ")[1], // Remove the group prefix
          group: field.group,
        });
      }
    });

    return selectedFieldDetails;
  };

  // Filter fields based on search term
  const getFilteredFields = () => {
    const fieldOptions = buildFieldOptions();
    if (!searchTerm.trim()) {
      return fieldOptions;
    }

    return fieldOptions.filter(
      (field) =>
        field.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Handle checkbox change
  const handleFieldToggle = (fieldValue) => {
    setSelectedFields((prev) => {
      if (prev.includes(fieldValue)) {
        return prev.filter((value) => value !== fieldValue);
      } else {
        return [...prev, fieldValue];
      }
    });
  };

  // Handle select all filtered fields
  const handleSelectAllFiltered = () => {
    const filteredFields = getFilteredFields();
    const filteredValues = filteredFields.map((field) => field.value);
    const allFilteredSelected = filteredValues.every((value) =>
      selectedFields.includes(value)
    );

    if (allFilteredSelected) {
      // Deselect all filtered fields
      setSelectedFields((prev) =>
        prev.filter((value) => !filteredValues.includes(value))
      );
    } else {
      // Select all filtered fields
      setSelectedFields((prev) => {
        const newSelection = [...prev];
        filteredValues.forEach((value) => {
          if (!newSelection.includes(value)) {
            newSelection.push(value);
          }
        });
        return newSelection;
      });
    }
  };

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFields([]);
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const fieldDetails = getSelectedFieldDetails();
    onConfirm(fieldDetails);
    onClose();
  };

  const filteredFields = getFilteredFields();
  const filteredValues = filteredFields.map((field) => field.value);
  const allFilteredSelected =
    filteredValues.length > 0 &&
    filteredValues.every((value) => selectedFields.includes(value));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="space-y-4">
        <Text variant="body" color="muted">
          Select the fields you want to include in the CSV template.
        </Text>

        {/* Search Input */}
        <div>
          <Input
            type="text"
            placeholder="Search fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Field List */}
        <div className="border border-gray-300 rounded-lg bg-white">
          {/* Select All */}
          {filteredFields.length > 0 && (
            <div className="border-b border-gray-200 p-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allFilteredSelected}
                  onChange={handleSelectAllFiltered}
                />
                <Text
                  variant="body"
                  weight="medium"
                  className="cursor-pointer"
                  onClick={handleSelectAllFiltered}
                >
                  Select All {searchTerm ? "Filtered " : ""}Fields
                </Text>
              </div>
            </div>
          )}

          {/* Field Options */}
          <div className="p-2 max-h-80 overflow-y-auto">
            {filteredFields.length > 0 ? (
              filteredFields.map((field) => (
                <div
                  key={field.value}
                  className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded"
                >
                  <Checkbox
                    checked={selectedFields.includes(field.value)}
                    onChange={() => handleFieldToggle(field.value)}
                  />
                  <Text
                    variant="body"
                    className="flex-1 cursor-pointer"
                    onClick={() => handleFieldToggle(field.value)}
                  >
                    {field.label}
                  </Text>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Text variant="body" color="muted">
                  {searchTerm
                    ? "No fields found matching your search."
                    : "No fields available."}
                </Text>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Text variant="caption" color="muted">
            {getSelectedFieldDetails().length} field(s) selected
          </Text>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={selectedFields.length === 0}
            >
              Download Template
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FieldSelectionModal;
