import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import Toggle from "../../atoms/Toggle";
import AddressTable from "../../atoms/AddressTable";
import Modal from "../../atoms/Modal";
import { ArrowLeft, History, Plus } from "lucide-react";
import RequestHistoryModal from "../MasterData/RequestHistoryModal";
import EntityStepDetailModal from "../MasterData/EntityStepDetailModal";

const CustomerDetail = ({ customer, onBack }) => {
  const [showRequestHistory, setShowRequestHistory] = useState(false);
  const [showStepDetail, setShowStepDetail] = useState(false);
  const [selectedStepData, setSelectedStepData] = useState(null);
  const [selectedRequestData, setSelectedRequestData] = useState(null);
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);

  // Mock form data based on customer - giống CustomerDetailForm
  const [formData, setFormData] = useState({
    customerAccount: customer.customerAccount || "",
    customerGroup: customer.group || "LOC_EXT",
    customerType: customer.type || "Person",
    firstName: customer.customerName?.split(" ")[0] || "",
    middleName: customer.customerName?.split(" ")[1] || "",
    lastNamePrefix: customer.customerName?.split(" ").slice(2).join(" ") || "",
    organizationName: customer.type === "Company" ? customer.customerName : "",
    generateVirtualAccount: "Yes",
    mainCustomer: customer.mainCustomer || "",
    // Address data
    addresses: [
      {
        id: 1,
        addressType: "Primary",
        street: customer.city || "123 Main Street",
        city: customer.city || "Ho Chi Minh City",
        state: "Ho Chi Minh",
        postalCode: "700000",
        country: "Vietnam",
        isPrimary: true,
      },
    ],
    // Contact data
    emailAddress: customer.emailAddress || "",
    phoneNumber: "+84-123-456-789",
    // Financial data
    currency: customer.currency || "VND",
    creditLimit: "1000000",
    paymentTerms: "Net 30",
  });

  const handleViewRequestHistory = () => {
    setShowRequestHistory(true);
  };

  const handleCloseRequestHistory = () => {
    setShowRequestHistory(false);
  };

  const handleStepClick = (step, request) => {
    // Đóng request history modal trước
    setShowRequestHistory(false);
    // Mở step detail modal
    setSelectedStepData(step);
    setSelectedRequestData(request);
    setShowStepDetail(true);
  };

  // Create New Request functionality - Only for detail page (4 types)
  const DETAIL_REQUEST_TYPES = [
    { value: "Copy", label: "Copy Existing Record" },
    { value: "Extend", label: "Extend Existing Record" },
    { value: "Edit", label: "Edit Existing Record" },
  ];

  const handleCreateRequest = (requestType) => {
    setShowCreateRequestModal(false);

    // Show warning modal instead of navigating to request creation
    alert(`No suitable workflow available to perform ${requestType} action.`);
  };

  const handleCloseStepDetail = () => {
    setShowStepDetail(false);
    setSelectedStepData(null);
    setSelectedRequestData(null);
    // Mở lại request history modal
    setShowRequestHistory(true);
  };

  const getClassificationBadge = (classification) => {
    const colors = {
      Dealer: "bg-blue-100 text-blue-800",
      Reseller: "bg-green-100 text-green-800",
      Retailer: "bg-purple-100 text-purple-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[classification] || "bg-gray-100 text-gray-800"
    }`;
  };

  const getTypeBadge = (type) => {
    const colors = {
      Person: "bg-orange-100 text-orange-800",
      Company: "bg-indigo-100 text-indigo-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[type] || "bg-gray-100 text-gray-800"
    }`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Search Results
          </Button>
          <div>
            <Text variant="heading" size="xl" weight="bold" className="mb-1">
              Customer Details
            </Text>
            <Text variant="body" color="muted" className="font-mono">
              {customer.customerAccount} - {customer.customerName}
            </Text>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleViewRequestHistory}>
            <History size={16} className="mr-2" />
            View Request History
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCreateRequestModal(true)}
          >
            <Plus size={16} className="mr-2" />
            Create New Request
          </Button>
        </div>
      </div>

      {/* Customer Information Form - giống CustomerDetailForm */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-6">
          Customer Information
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Account */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Customer Account *
            </Text>
            <Input
              value={formData.customerAccount}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Customer Group */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Customer Group *
            </Text>
            <Select
              options={[
                {
                  value: "LOC_EXT",
                  label: "LOC_EXT - Local External Customer",
                },
                { value: "AQTP", label: "AQTP - Aquaculture Trading Partner" },
                { value: "LSTP", label: "LSTP - Livestock Trading Partner" },
              ]}
              value={formData.customerGroup}
              disabled
            />
          </div>

          {/* Customer Type */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Customer Type *
            </Text>
            <Select
              options={[
                { value: "Person", label: "Person" },
                { value: "Organization", label: "Organization" },
              ]}
              value={formData.customerType}
              disabled
            />
          </div>

          {/* Generate Virtual Account */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Generate Virtual Account *
            </Text>
            <div className="flex items-center space-x-4">
              <Toggle
                checked={formData.generateVirtualAccount === "Yes"}
                disabled
              />
              <Text variant="body" color="muted">
                {formData.generateVirtualAccount}
              </Text>
            </div>
          </div>

          {/* Conditional fields based on customer type */}
          {formData.customerType === "Person" && (
            <>
              <div>
                <Text variant="body" weight="medium" className="mb-2">
                  First Name *
                </Text>
                <Input
                  value={formData.firstName}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Text variant="body" weight="medium" className="mb-2">
                  Middle Name
                </Text>
                <Input
                  value={formData.middleName}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <Text variant="body" weight="medium" className="mb-2">
                  Last Name Prefix *
                </Text>
                <Input
                  value={formData.lastNamePrefix}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </>
          )}

          {formData.customerType === "Organization" && (
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Organization Name *
              </Text>
              <Input
                value={formData.organizationName}
                disabled
                className="bg-gray-50"
              />
            </div>
          )}

          {/* Main Customer */}
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Main Customer *
            </Text>
            <Input
              value={formData.mainCustomer}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-6">
          Address Information
        </Text>

        <AddressTable
          addresses={formData.addresses}
          onEdit={() => {}}
          onDelete={() => {}}
          onAdd={() => {}}
          disabled={true}
        />
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-6">
          Contact Information
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Email Address *
            </Text>
            <Input
              value={formData.emailAddress}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Phone Number
            </Text>
            <Input
              value={formData.phoneNumber}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-6">
          Financial Information
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Currency *
            </Text>
            <Select
              options={[
                { value: "VND", label: "VND - Vietnamese Dong" },
                { value: "USD", label: "USD - US Dollar" },
                { value: "EUR", label: "EUR - Euro" },
              ]}
              value={formData.currency}
              disabled
            />
          </div>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Credit Limit
            </Text>
            <Input
              value={formData.creditLimit}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Payment Terms
            </Text>
            <Input
              value={formData.paymentTerms}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Request History Modal */}
      <RequestHistoryModal
        isOpen={showRequestHistory}
        onClose={handleCloseRequestHistory}
        record={{
          id: customer.customerAccount,
          customerCode: customer.customerAccount,
          customerName: customer.customerName,
        }}
        entityType="Customer"
        onStepClick={handleStepClick}
      />

      {/* Step Detail Modal */}
      {showStepDetail && (
        <EntityStepDetailModal
          isOpen={showStepDetail}
          onClose={handleCloseStepDetail}
          stepData={selectedStepData}
          requestData={selectedRequestData}
          record={{
            id: customer.customerAccount,
            customerCode: customer.customerAccount,
            customerName: customer.customerName,
          }}
          entityType="Customer"
        />
      )}

      {/* Create New Request Modal */}
      <Modal
        isOpen={showCreateRequestModal}
        onClose={() => setShowCreateRequestModal(false)}
        title="Create New Request"
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            Select the type of request you want to create for this customer:
          </Text>
          <div className="grid grid-cols-1 gap-3">
            {DETAIL_REQUEST_TYPES.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                onClick={() => handleCreateRequest(type.value)}
                className="justify-start"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerDetail;
