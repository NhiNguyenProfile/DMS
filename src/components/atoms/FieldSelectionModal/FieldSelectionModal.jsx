import { useState, useEffect } from "react";
import Modal from "../Modal";
import Button from "../Button";
import Text from "../Text";
import TreeSelect from "../TreeSelect";

// Field definitions from CustomerDetailForm
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

  // Build tree data structure
  const buildTreeData = () => {
    const treeData = [
      {
        id: "final_customer",
        label: "Final Customer",
        children: [
          {
            id: "final_customer_general",
            label: "General",
            children: FINAL_CUSTOMER_GENERAL.map((field, index) => ({
              id: `final_customer_general_${field.key}`,
              label: field.label,
              key: field.key,
              group: "final_customer_general",
            })),
          },
          {
            id: "final_customer_address",
            label: "Address",
            children: ADDRESS_FIELDS.map((field, index) => ({
              id: `final_customer_address_${field.key}`,
              label: field.label,
              key: field.key,
              group: "final_customer_address",
            })),
          },
          {
            id: "final_customer_contact",
            label: "Contact Information",
            children: FINAL_CUSTOMER_CONTACT.map((field, index) => ({
              id: `final_customer_contact_${field.key}`,
              label: field.label,
              key: field.key,
              group: "final_customer_contact",
            })),
          },
          {
            id: "final_customer_sales",
            label: "Sales Demographic",
            children: FINAL_CUSTOMER_SALES.map((field, index) => ({
              id: `final_customer_sales_${field.key}`,
              label: field.label,
              key: field.key,
              group: "final_customer_sales",
            })),
          },
          {
            id: "final_customer_credit",
            label: "Credit and Collection",
            children: FINAL_CUSTOMER_CREDIT.map((field, index) => ({
              id: `final_customer_credit_${field.key}`,
              label: field.label,
              key: field.key,
              group: "final_customer_credit",
            })),
          },
          {
            id: "final_customer_payment",
            label: "Payment & Invoice",
            children: FINAL_CUSTOMER_PAYMENT.map((field, index) => ({
              id: `final_customer_payment_${field.key}`,
              label: field.label,
              key: field.key,
              group: "final_customer_payment",
            })),
          },
          {
            id: "final_customer_tax",
            label: "Tax Exempt Number",
            children: TAX_FIELDS.map((field, index) => ({
              id: `final_customer_tax_${field.key}`,
              label: field.label,
              key: field.key,
              group: "final_customer_tax",
            })),
          },
        ],
      },
    ];

    return treeData;
  };

  // Get selected field details for CSV generation
  const getSelectedFieldDetails = () => {
    const treeData = buildTreeData();
    const selectedFieldDetails = [];

    const findFieldDetails = (nodes) => {
      nodes.forEach((node) => {
        if (selectedFields.includes(node.id) && node.key) {
          selectedFieldDetails.push({
            key: node.key,
            label: node.label,
            group: node.group,
          });
        }
        if (node.children) {
          findFieldDetails(node.children);
        }
      });
    };

    findFieldDetails(treeData);
    return selectedFieldDetails;
  };

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFields([]);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const fieldDetails = getSelectedFieldDetails();
    onConfirm(fieldDetails);
    onClose();
  };

  const treeData = buildTreeData();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="space-y-4">
        <Text variant="body" color="muted">
          Select the fields you want to include in the CSV template. You can
          select entire groups or individual fields.
        </Text>

        <div className="max-h-96 overflow-y-auto">
          <TreeSelect
            data={treeData}
            value={selectedFields}
            onChange={setSelectedFields}
            showSelectAll={true}
          />
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
