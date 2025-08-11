import { useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Badge from "../../atoms/Badge";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import Toggle from "../../atoms/Toggle";
import AddressTable from "../../atoms/AddressTable";
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  User,
  FileText,
} from "lucide-react";
import Table from "../../atoms/Table";

// Mock entity data at different steps (showing changes over time)
const ENTITY_STEP_DATA = {
  Customer: {
    "REQ-20241201-001": {
      "Credit Check": {
        customerCode: "ABC-CORP",
        customerName: "ABC Corporation",
        customerType: "Corporate",
        industry: "Manufacturing",
        country: "Vietnam",
        city: "Ho Chi Minh City",
        address: "123 Nguyen Hue Street, District 1",
        phone: "+84-28-1234-5678",
        email: "contact@abccorp.com",
        taxCode: "0123456789",
        creditLimit: 500000, // Initial request
        paymentTerms: "Net 30",
        status: "Pending Approval",
        requestedChanges: ["Credit Limit increase from $500,000 to $1,000,000"],
        stepSpecificData: {
          creditScore: 750,
          creditRating: "A-",
          riskAssessment: "Low Risk",
          recommendedLimit: 1000000,
        },
      },
      "Sales Review": {
        customerCode: "ABC-CORP",
        customerName: "ABC Corporation",
        customerType: "Corporate",
        industry: "Manufacturing",
        country: "Vietnam",
        city: "Ho Chi Minh City",
        address: "123 Nguyen Hue Street, District 1",
        phone: "+84-28-1234-5678",
        email: "contact@abccorp.com",
        taxCode: "0123456789",
        creditLimit: 1000000, // Approved by credit check
        paymentTerms: "Net 30",
        status: "Approved",
        requestedChanges: ["Credit Limit approved at $1,000,000"],
        stepSpecificData: {
          salesPotential: "High",
          marketSegment: "Manufacturing - Tier 1",
          expectedAnnualRevenue: 2500000,
          strategicImportance: "High",
        },
      },
    },
    "REQ-20241115-002": {
      "Data Validation": {
        customerCode: "ABC-CORP",
        customerName: "ABC Corporation",
        customerType: "Corporate",
        industry: "Manufacturing",
        country: "Vietnam",
        city: "Ho Chi Minh City",
        address: "123 Nguyen Hue Street, District 1", // Updated address
        phone: "+84-28-1234-5678",
        email: "contact@abccorp.com",
        taxCode: "0123456789",
        creditLimit: 1000000,
        paymentTerms: "Net 30",
        status: "Approved",
        requestedChanges: [
          "Address update",
          "Contact information verification",
        ],
        stepSpecificData: {
          validationStatus: "Passed",
          addressVerified: true,
          contactVerified: true,
          documentsChecked: [
            "Business License",
            "Tax Certificate",
            "Bank Statement",
          ],
        },
      },
    },
    // Mock data cho customers từ search results
    "REQ-20241205-003": {
      "Document Verification": {
        customerAccount: "FE016977",
        customerName: "Trần Mạnh Hiệp",
        customerType: "Person",
        classification: "Dealer",
        group: "LOC_EXT",
        city: "Ho Chi Minh City",
        currency: "VND",
        emailAddress: "hiep.tran@email.com",
        phoneNumber: "+84-901-234-567",
        status: "Pending Approval",
        requestedChanges: ["New dealer registration", "Document submission"],
        stepSpecificData: {
          documentsSubmitted: [
            "ID Card",
            "Business License",
            "Tax Registration",
          ],
          verificationStatus: "In Progress",
          documentQuality: "Good",
          missingDocuments: [],
        },
      },
      "Credit Assessment": {
        customerAccount: "FE016977",
        customerName: "Trần Mạnh Hiệp",
        customerType: "Person",
        classification: "Dealer",
        group: "LOC_EXT",
        city: "Ho Chi Minh City",
        currency: "VND",
        emailAddress: "hiep.tran@email.com",
        phoneNumber: "+84-901-234-567",
        creditLimit: 500000,
        paymentTerms: "Net 15",
        status: "Approved",
        requestedChanges: ["Credit limit assessment completed"],
        stepSpecificData: {
          creditScore: 720,
          creditRating: "B+",
          riskLevel: "Medium",
          recommendedLimit: 500000,
          paymentHistory: "No previous history",
        },
      },
      "Final Approval": {
        customerAccount: "FE016977",
        customerName: "Trần Mạnh Hiệp",
        customerType: "Person",
        classification: "Dealer",
        group: "LOC_EXT",
        city: "Ho Chi Minh City",
        currency: "VND",
        emailAddress: "hiep.tran@email.com",
        phoneNumber: "+84-901-234-567",
        creditLimit: 500000,
        paymentTerms: "Net 15",
        status: "Approved",
        requestedChanges: ["Final approval granted for dealer partnership"],
        stepSpecificData: {
          approvalLevel: "Regional Manager",
          territoryAssigned: "Ho Chi Minh City - District 1,3,5",
          dealerCode: "VN001-DEALER",
          activationDate: "2024-12-06",
        },
      },
    },
    "REQ-20241120-004": {
      "Information Update": {
        customerAccount: "FE016977",
        customerName: "Trần Mạnh Hiệp",
        customerType: "Person",
        classification: "Dealer",
        group: "LOC_EXT",
        city: "Ho Chi Minh City",
        currency: "VND",
        emailAddress: "hiep.tran.new@email.com", // Updated email
        phoneNumber: "+84-901-234-999", // Updated phone
        status: "Approved",
        requestedChanges: ["Email and phone number update"],
        stepSpecificData: {
          updatedFields: ["Email Address", "Phone Number"],
          previousEmail: "hiep.tran@email.com",
          previousPhone: "+84-901-234-567",
          updateReason: "Customer requested contact update",
        },
      },
    },
    "REQ-20241203-005": {
      "Initial Review": {
        customerAccount: "FE017112",
        customerName: "Lê Thị Hồng",
        customerType: "Person",
        classification: "Reseller",
        group: "LOC_EXT",
        city: "Hanoi",
        currency: "VND",
        emailAddress: "hong.le@email.com",
        phoneNumber: "+84-902-345-678",
        status: "Under Review",
        requestedChanges: ["New reseller application"],
        stepSpecificData: {
          applicationDate: "2024-12-03",
          reviewStatus: "Initial screening passed",
          businessType: "Retail Store",
          expectedVolume: "Medium",
        },
      },
      "Business Verification": {
        customerAccount: "FE017112",
        customerName: "Lê Thị Hồng",
        customerType: "Person",
        classification: "Reseller",
        group: "LOC_EXT",
        city: "Hanoi",
        currency: "VND",
        emailAddress: "hong.le@email.com",
        phoneNumber: "+84-902-345-678",
        status: "In Progress",
        requestedChanges: ["Business verification in progress"],
        stepSpecificData: {
          businessRegistration: "Pending verification",
          storeLocation: "123 Ba Trieu Street, Hanoi",
          storeSize: "50 sqm",
          verificationMethod: "On-site visit scheduled",
        },
      },
      "Final Approval": {
        customerAccount: "FE017112",
        customerName: "Lê Thị Hồng",
        customerType: "Person",
        classification: "Reseller",
        group: "LOC_EXT",
        city: "Hanoi",
        currency: "VND",
        emailAddress: "hong.le@email.com",
        phoneNumber: "+84-902-345-678",
        status: "Waiting",
        requestedChanges: ["Awaiting final approval"],
        stepSpecificData: {
          pendingItems: [
            "Business verification completion",
            "Store inspection report",
          ],
          expectedApprovalDate: "2024-12-10",
          assignedTerritory: "Hanoi - Hai Ba Trung District",
        },
      },
    },
  },
};

// Change log data for edit requests
const CHANGE_LOG_DATA = {
  "REQ-20241120-004": [
    {
      fieldName: "Customer Name",
      previousValue: "ABC Company Ltd.",
      newValue: "ABC Corporation Ltd.",
    },
    {
      fieldName: "Contact Person",
      previousValue: "John Smith",
      newValue: "Jane Smith",
    },
    {
      fieldName: "Phone Number",
      previousValue: "+84-28-1234-5678",
      newValue: "+84-28-9876-5432",
    },
    {
      fieldName: "Email Address",
      previousValue: "contact@abccompany.com",
      newValue: "info@abccorporation.com",
    },
    {
      fieldName: "Address",
      previousValue: "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
      newValue: "456 Le Loi Boulevard, District 1, Ho Chi Minh City",
    },
  ],
};

const EntityStepDetailModal = ({
  isOpen,
  onClose,
  stepData,
  requestData,
  record,
  entityType,
}) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !stepData || !requestData) return null;

  const entityData =
    ENTITY_STEP_DATA[entityType]?.[requestData.requestId]?.[stepData.stepName];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={16} className="text-green-500" />;
      case "Rejected":
        return <XCircle size={16} className="text-red-500" />;
      case "In Progress":
        return <Clock size={16} className="text-blue-500" />;
      case "Waiting":
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Approved: "success",
      Rejected: "error",
      "In Progress": "info",
      "Pending Approval": "warning",
      Waiting: "warning",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 !mt-0 bg-black bg-opacity-50 transition-opacity z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 !mt-0 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText size={16} className="text-blue-600" />
              </div>
              <div>
                <Text variant="heading" size="lg" weight="semibold">
                  {requestData.requestId === "REQ-20241120-004"
                    ? `Change Log at Step: ${stepData.stepName}`
                    : `${entityType} Details at Step: ${stepData.stepName}`}
                </Text>
                <Text variant="caption" color="muted">
                  {requestData.requestId} - {requestData.requestType} Request
                </Text>
              </div>
            </div>
            <Button variant="ghost" size="small" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto min-h-0">
            {entityData ? (
              <div className="space-y-6">
                {/* Step Workflow & Actions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Text variant="body" weight="semibold">
                      Step Workflow & Actions
                    </Text>
                    {getStatusBadge(entityData.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Text
                        variant="caption"
                        color="muted"
                        weight="medium"
                        className="mb-1"
                      >
                        Request Type
                      </Text>
                      <Text variant="body" weight="medium">
                        {requestData.requestType}
                      </Text>
                    </div>

                    <div>
                      <Text
                        variant="caption"
                        color="muted"
                        weight="medium"
                        className="mb-1"
                      >
                        Current Status
                      </Text>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entityData.status)}
                        <Text variant="body" weight="medium">
                          {entityData.status}
                        </Text>
                      </div>
                    </div>

                    <div>
                      <Text
                        variant="caption"
                        color="muted"
                        weight="medium"
                        className="mb-1"
                      >
                        Step Duration
                      </Text>
                      <Text variant="body" weight="medium">
                        {stepData.owners?.[0]?.approvedAt
                          ? `${Math.round(
                              (new Date(stepData.owners[0].approvedAt) -
                                new Date(requestData.submittedDate)) /
                                (1000 * 60 * 60)
                            )}h`
                          : "In Progress"}
                      </Text>
                    </div>
                  </div>

                  {/* Step Execution Details */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <Text
                      variant="body"
                      weight="semibold"
                      className="mb-3 text-gray-700"
                    >
                      Execution Timeline
                    </Text>

                    <div className="space-y-3">
                      {stepData.owners.map((owner, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Text
                                variant="caption"
                                weight="bold"
                                className="text-blue-600"
                              >
                                {owner.name.charAt(0).toUpperCase()}
                              </Text>
                            </div>
                            <div>
                              <Text variant="body" weight="medium">
                                {owner.name}
                              </Text>
                              <Text variant="caption" color="muted">
                                {owner.title}
                              </Text>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              {getStatusIcon(owner.status)}
                              <Text variant="caption" weight="medium">
                                {owner.status}
                              </Text>
                            </div>
                            <Text variant="caption" color="muted">
                              {owner.approvedAt
                                ? formatDateTime(owner.approvedAt)
                                : "Pending"}
                            </Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Approver Notes */}
                {stepData.owners && stepData.owners.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <Text
                      variant="heading"
                      size="lg"
                      weight="semibold"
                      className="mb-4"
                    >
                      Approver Notes
                    </Text>

                    <div className="space-y-4">
                      {stepData.owners.map((owner, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-200 pl-4"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <User size={16} className="text-gray-500" />
                            <Text variant="body" weight="semibold">
                              {owner.name}
                            </Text>
                            <Text variant="caption" color="muted">
                              ({owner.title})
                            </Text>
                            {getStatusBadge(owner.status)}
                          </div>

                          {owner.note && (
                            <div className="bg-blue-50 rounded p-3 mt-2">
                              <div className="flex items-start space-x-2">
                                <MessageCircle
                                  size={14}
                                  className="text-blue-500 mt-0.5 flex-shrink-0"
                                />
                                <Text variant="body" className="text-blue-700">
                                  {owner.note}
                                </Text>
                              </div>
                            </div>
                          )}

                          {owner.approvedAt && (
                            <Text
                              variant="caption"
                              color="muted"
                              className="mt-2"
                            >
                              Approved at: {formatDateTime(owner.approvedAt)}
                            </Text>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Form Detail at This Step OR Change Log for REQ-20241120-004 */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  {requestData.requestId === "REQ-20241120-004" ? (
                    <>
                      <Text
                        variant="heading"
                        size="lg"
                        weight="semibold"
                        className="mb-6"
                      >
                        Change Log - {stepData.stepName}
                      </Text>

                      <Text
                        variant="body"
                        color="muted"
                        className="text-sm mb-6"
                      >
                        The following fields were modified during this step:
                      </Text>

                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <Table>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell className="w-1/3">
                                Field Name
                              </Table.HeaderCell>
                              <Table.HeaderCell className="w-1/3">
                                Previous Value
                              </Table.HeaderCell>
                              <Table.HeaderCell className="w-1/3">
                                New Value
                              </Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {CHANGE_LOG_DATA["REQ-20241120-004"].map(
                              (change, index) => (
                                <Table.Row key={index}>
                                  <Table.Cell>
                                    <Text variant="body" weight="medium">
                                      {change.fieldName}
                                    </Text>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <div className="bg-red-50 border border-red-200 rounded px-3 py-2">
                                      <Text
                                        variant="body"
                                        className="text-red-800 text-sm"
                                      >
                                        {change.previousValue || "—"}
                                      </Text>
                                    </div>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                                      <Text
                                        variant="body"
                                        className="text-green-800 text-sm"
                                      >
                                        {change.newValue || "—"}
                                      </Text>
                                    </div>
                                  </Table.Cell>
                                </Table.Row>
                              )
                            )}
                          </Table.Body>
                        </Table>
                      </div>
                    </>
                  ) : (
                    <>
                      <Text
                        variant="heading"
                        size="lg"
                        weight="semibold"
                        className="mb-6"
                      >
                        {entityType} Form Detail at Step: {stepData.stepName}
                      </Text>

                      {/* Customer Information Form */}
                      <div className="space-y-6">
                        <div>
                          <Text
                            variant="body"
                            weight="semibold"
                            className="mb-4 text-blue-600"
                          >
                            Customer Information
                          </Text>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Account */}
                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                Customer Account *
                              </Text>
                              <Input
                                value={
                                  entityData.customerAccount ||
                                  entityData.customerCode ||
                                  ""
                                }
                                disabled
                                className="bg-gray-50"
                              />
                            </div>

                            {/* Customer Group */}
                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                Customer Group *
                              </Text>
                              <Select
                                options={[
                                  {
                                    value: "LOC_EXT",
                                    label: "LOC_EXT - Local External Customer",
                                  },
                                  {
                                    value: "AQTP",
                                    label: "AQTP - Aquaculture Trading Partner",
                                  },
                                  {
                                    value: "LSTP",
                                    label: "LSTP - Livestock Trading Partner",
                                  },
                                ]}
                                value={entityData.group || "LOC_EXT"}
                                disabled
                              />
                            </div>

                            {/* Customer Type */}
                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                Customer Type *
                              </Text>
                              <Select
                                options={[
                                  { value: "Person", label: "Person" },
                                  {
                                    value: "Organization",
                                    label: "Organization",
                                  },
                                ]}
                                value={entityData.customerType || "Person"}
                                disabled
                              />
                            </div>

                            {/* Generate Virtual Account */}
                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                Generate Virtual Account *
                              </Text>
                              <div className="flex items-center space-x-4">
                                <Toggle checked={true} disabled />
                                <Text variant="body" color="muted">
                                  Yes
                                </Text>
                              </div>
                            </div>

                            {/* Customer Name Fields */}
                            {entityData.customerType === "Person" && (
                              <>
                                <div>
                                  <Text
                                    variant="body"
                                    weight="medium"
                                    className="mb-2"
                                  >
                                    First Name *
                                  </Text>
                                  <Input
                                    value={
                                      entityData.customerName?.split(" ")[0] ||
                                      ""
                                    }
                                    disabled
                                    className="bg-gray-50"
                                  />
                                </div>

                                <div>
                                  <Text
                                    variant="body"
                                    weight="medium"
                                    className="mb-2"
                                  >
                                    Last Name *
                                  </Text>
                                  <Input
                                    value={
                                      entityData.customerName
                                        ?.split(" ")
                                        .slice(1)
                                        .join(" ") || ""
                                    }
                                    disabled
                                    className="bg-gray-50"
                                  />
                                </div>
                              </>
                            )}

                            {entityData.customerType === "Organization" && (
                              <div>
                                <Text
                                  variant="body"
                                  weight="medium"
                                  className="mb-2"
                                >
                                  Organization Name *
                                </Text>
                                <Input
                                  value={entityData.customerName || ""}
                                  disabled
                                  className="bg-gray-50"
                                />
                              </div>
                            )}

                            {/* Classification */}
                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                Classification *
                              </Text>
                              <Select
                                options={[
                                  { value: "Dealer", label: "Dealer" },
                                  { value: "Reseller", label: "Reseller" },
                                  { value: "Retailer", label: "Retailer" },
                                ]}
                                value={entityData.classification || "Dealer"}
                                disabled
                              />
                            </div>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                          <Text
                            variant="body"
                            weight="semibold"
                            className="mb-4 text-blue-600"
                          >
                            Contact Information
                          </Text>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                Email Address *
                              </Text>
                              <Input
                                value={
                                  entityData.emailAddress ||
                                  entityData.email ||
                                  ""
                                }
                                disabled
                                className="bg-gray-50"
                              />
                            </div>

                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                Phone Number
                              </Text>
                              <Input
                                value={
                                  entityData.phoneNumber ||
                                  entityData.phone ||
                                  ""
                                }
                                disabled
                                className="bg-gray-50"
                              />
                            </div>

                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                City
                              </Text>
                              <Input
                                value={entityData.city || ""}
                                disabled
                                className="bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Financial Information */}
                        <div>
                          <Text
                            variant="body"
                            weight="semibold"
                            className="mb-4 text-blue-600"
                          >
                            Financial Information
                          </Text>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                Currency *
                              </Text>
                              <Select
                                options={[
                                  {
                                    value: "VND",
                                    label: "VND - Vietnamese Dong",
                                  },
                                  { value: "USD", label: "USD - US Dollar" },
                                  { value: "EUR", label: "EUR - Euro" },
                                ]}
                                value={entityData.currency || "VND"}
                                disabled
                              />
                            </div>

                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                Credit Limit
                              </Text>
                              <Input
                                value={
                                  entityData.creditLimit
                                    ? `$${entityData.creditLimit.toLocaleString()}`
                                    : ""
                                }
                                disabled
                                className="bg-gray-50"
                              />
                            </div>

                            <div>
                              <Text
                                variant="body"
                                weight="medium"
                                className="mb-2"
                              >
                                Payment Terms
                              </Text>
                              <Input
                                value={entityData.paymentTerms || ""}
                                disabled
                                className="bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Text variant="body" color="muted">
                  No detailed information available for this step
                </Text>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 flex-shrink-0">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntityStepDetailModal;
