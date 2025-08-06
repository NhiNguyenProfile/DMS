import { useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Badge from "../../atoms/Badge";
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  User,
  FileText,
} from "lucide-react";

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
        requestedChanges: ["Address update", "Contact information verification"],
        stepSpecificData: {
          validationStatus: "Passed",
          addressVerified: true,
          contactVerified: true,
          documentsChecked: ["Business License", "Tax Certificate", "Bank Statement"],
        },
      },
    },
  },
};

const EntityStepDetailModal = ({ isOpen, onClose, stepData, requestData, record, entityType }) => {
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

  const entityData = ENTITY_STEP_DATA[entityType]?.[requestData.requestId]?.[stepData.stepName];

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
        className="fixed inset-0 !mt-0 bg-black bg-opacity-50 transition-opacity z-60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 !mt-0 flex items-center justify-center z-60 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText size={16} className="text-blue-600" />
              </div>
              <div>
                <Text variant="heading" size="lg" weight="semibold">
                  {entityType} Details at Step: {stepData.stepName}
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
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {entityData ? (
              <div className="space-y-6">
                {/* Step Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Text variant="body" weight="semibold">
                      Step Information
                    </Text>
                    {getStatusBadge(entityData.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Text variant="caption" color="muted" weight="medium" className="mb-1">
                        Request Type
                      </Text>
                      <Text variant="body">
                        {requestData.requestType}
                      </Text>
                    </div>
                    
                    <div>
                      <Text variant="caption" color="muted" weight="medium" className="mb-1">
                        Current Status
                      </Text>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entityData.status)}
                        <Text variant="body">
                          {entityData.status}
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* Requested Changes */}
                  {entityData.requestedChanges && entityData.requestedChanges.length > 0 && (
                    <div className="mt-4">
                      <Text variant="caption" color="muted" weight="medium" className="mb-2">
                        Changes in this Step
                      </Text>
                      <ul className="list-disc list-inside space-y-1">
                        {entityData.requestedChanges.map((change, index) => (
                          <li key={index}>
                            <Text variant="body" className="text-blue-700">
                              {change}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Entity Data */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <Text variant="heading" size="lg" weight="semibold" className="mb-4">
                    {entityType} Information
                  </Text>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <Text variant="caption" color="muted" weight="medium" className="mb-1">
                        Customer Code
                      </Text>
                      <Text variant="body" weight="medium">
                        {entityData.customerCode}
                      </Text>
                    </div>
                    
                    <div>
                      <Text variant="caption" color="muted" weight="medium" className="mb-1">
                        Customer Name
                      </Text>
                      <Text variant="body" weight="medium">
                        {entityData.customerName}
                      </Text>
                    </div>
                    
                    <div>
                      <Text variant="caption" color="muted" weight="medium" className="mb-1">
                        Customer Type
                      </Text>
                      <Text variant="body">
                        {entityData.customerType}
                      </Text>
                    </div>
                    
                    <div>
                      <Text variant="caption" color="muted" weight="medium" className="mb-1">
                        Industry
                      </Text>
                      <Text variant="body">
                        {entityData.industry}
                      </Text>
                    </div>
                    
                    <div>
                      <Text variant="caption" color="muted" weight="medium" className="mb-1">
                        Credit Limit
                      </Text>
                      <Text variant="body" weight="medium" className="text-green-600">
                        ${entityData.creditLimit?.toLocaleString()}
                      </Text>
                    </div>
                    
                    <div>
                      <Text variant="caption" color="muted" weight="medium" className="mb-1">
                        Payment Terms
                      </Text>
                      <Text variant="body">
                        {entityData.paymentTerms}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Step-Specific Data */}
                {entityData.stepSpecificData && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <Text variant="heading" size="lg" weight="semibold" className="mb-4">
                      {stepData.stepName} - Specific Information
                    </Text>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(entityData.stepSpecificData).map(([key, value]) => (
                        <div key={key}>
                          <Text variant="caption" color="muted" weight="medium" className="mb-1">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Text>
                          <Text variant="body" weight="medium">
                            {Array.isArray(value) ? value.join(', ') : 
                             typeof value === 'number' ? value.toLocaleString() : 
                             value}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approver Notes */}
                {stepData.owners && stepData.owners.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <Text variant="heading" size="lg" weight="semibold" className="mb-4">
                      Approver Notes
                    </Text>
                    
                    <div className="space-y-4">
                      {stepData.owners.map((owner, index) => (
                        <div key={index} className="border-l-4 border-blue-200 pl-4">
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
                                <MessageCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                <Text variant="body" className="text-blue-700">
                                  {owner.note}
                                </Text>
                              </div>
                            </div>
                          )}
                          
                          {owner.approvedAt && (
                            <Text variant="caption" color="muted" className="mt-2">
                              Approved at: {formatDateTime(owner.approvedAt)}
                            </Text>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
          <div className="flex justify-end p-6 border-t border-gray-200">
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
