import { useState, useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Badge from "../../atoms/Badge";
import {
  X,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
} from "lucide-react";
import EntityStepDetailModal from "./EntityStepDetailModal";
import ChangeLogModal from "./ChangeLogModal";

// Mock request history data
const REQUEST_HISTORY = {
  Customer: {
    "CUST-001": [
      {
        requestId: "REQ-20241201-001",
        requestType: "Create",
        status: "Approved",
        submittedBy: "John Doe",
        submittedDate: "2024-12-01T09:00:00Z",
        completedDate: "2024-12-01T15:30:00Z",
        approvalTree: [
          {
            stepName: "Credit Check",
            owners: [
              {
                name: "Alice Johnson",
                title: "Credit Officer",
                status: "Approved",
                approvedAt: "2024-12-01T10:30:00Z",
                note: "Credit score acceptable for requested limit",
              },
            ],
          },
          {
            stepName: "Sales Review",
            owners: [
              {
                name: "Bob Smith",
                title: "Sales Manager",
                status: "Approved",
                approvedAt: "2024-12-01T15:30:00Z",
                note: "Customer profile looks good for our target market",
              },
            ],
          },
        ],
      },
      {
        requestId: "REQ-20241115-002",
        requestType: "Edit",
        status: "Approved",
        submittedBy: "Jane Smith",
        submittedDate: "2024-11-15T14:00:00Z",
        completedDate: "2024-11-15T16:45:00Z",
        approvalTree: [
          {
            stepName: "Data Validation",
            owners: [
              {
                name: "Carol Wilson",
                title: "Data Analyst",
                status: "Approved",
                approvedAt: "2024-11-15T16:45:00Z",
                note: "All changes validated successfully",
              },
            ],
          },
        ],
      },
      {
        requestId: "REQ-20241210-004",
        requestType: "Edit",
        status: "Approved",
        submittedBy: "Jane Smith",
        submittedDate: "2024-12-10T14:00:00Z",
        completedDate: "2024-12-10T18:45:00Z",
        approvalTree: [
          {
            stepName: "Information Update",
            owners: [
              {
                name: "Mike Johnson",
                title: "Data Manager",
                status: "Approved",
                approvedAt: "2024-12-10T15:30:00Z",
                note: "Address and contact information updated successfully",
              },
            ],
          },
          {
            stepName: "Credit Review",
            owners: [
              {
                name: "Sarah Wilson",
                title: "Credit Officer",
                status: "Approved",
                approvedAt: "2024-12-10T17:15:00Z",
                note: "Credit limit increase approved based on payment history",
              },
            ],
          },
          {
            stepName: "Final Approval",
            owners: [
              {
                name: "David Brown",
                title: "Operations Manager",
                status: "Approved",
                approvedAt: "2024-12-10T18:45:00Z",
                note: "All changes approved and implemented",
              },
            ],
          },
        ],
      },
    ],
    // Mock data cho customers từ search results
    FE016977: [
      {
        requestId: "REQ-20241205-003",
        requestType: "Create",
        status: "Approved",
        submittedBy: "Trần Mạnh Hiệp",
        submittedDate: "2024-12-05T08:30:00Z",
        completedDate: "2024-12-05T17:15:00Z",
        approvalTree: [
          {
            stepName: "Document Verification",
            owners: [
              {
                name: "Nguyễn Thị Mai",
                title: "Document Officer",
                status: "Approved",
                approvedAt: "2024-12-05T11:00:00Z",
                note: "All required documents verified and complete",
              },
            ],
          },
          {
            stepName: "Credit Assessment",
            owners: [
              {
                name: "Lê Văn Đức",
                title: "Credit Manager",
                status: "Approved",
                approvedAt: "2024-12-05T14:30:00Z",
                note: "Customer meets credit requirements for dealer classification",
              },
            ],
          },
          {
            stepName: "Final Approval",
            owners: [
              {
                name: "Phạm Thị Hoa",
                title: "Regional Manager",
                status: "Approved",
                approvedAt: "2024-12-05T17:15:00Z",
                note: "Approved for dealer partnership in Ho Chi Minh region",
              },
            ],
          },
        ],
      },
      {
        requestId: "REQ-20241120-004",
        requestType: "Edit",
        status: "Approved",
        submittedBy: "Admin User",
        submittedDate: "2024-11-20T13:00:00Z",
        completedDate: "2024-11-20T15:45:00Z",
        approvalTree: [
          {
            stepName: "Information Update",
            owners: [
              {
                name: "Võ Thị Lan",
                title: "Data Specialist",
                status: "Approved",
                approvedAt: "2024-11-20T15:45:00Z",
                note: "Contact information and address updated successfully",
              },
            ],
          },
        ],
      },
    ],
    FE017112: [
      {
        requestId: "REQ-20241203-005",
        requestType: "Create",
        status: "In Progress",
        submittedBy: "Lê Thị Hồng",
        submittedDate: "2024-12-03T10:15:00Z",
        completedDate: null,
        approvalTree: [
          {
            stepName: "Initial Review",
            owners: [
              {
                name: "Trần Văn Nam",
                title: "Review Officer",
                status: "Approved",
                approvedAt: "2024-12-03T14:20:00Z",
                note: "Initial documentation review completed",
              },
            ],
          },
          {
            stepName: "Business Verification",
            owners: [
              {
                name: "Hoàng Thị Kim",
                title: "Business Analyst",
                status: "In Progress",
                approvedAt: null,
                note: "Currently verifying business registration details",
              },
            ],
          },
          {
            stepName: "Final Approval",
            owners: [
              {
                name: "Đỗ Văn Minh",
                title: "Branch Manager",
                status: "Waiting",
                approvedAt: null,
                note: null,
              },
            ],
          },
        ],
      },
    ],
  },
};

const RequestHistoryModal = ({
  isOpen,
  onClose,
  record,
  entityType,
  onStepClick,
}) => {
  const [expandedRequests, setExpandedRequests] = useState(new Set());
  const [showStepDetail, setShowStepDetail] = useState(false);
  const [showChangeLog, setShowChangeLog] = useState(false);
  const [selectedStepData, setSelectedStepData] = useState(null);
  const [selectedRequestData, setSelectedRequestData] = useState(null);
  const [changeLogData, setChangeLogData] = useState({
    requestId: null,
    stepName: null,
  });

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

  if (!isOpen) return null;

  const requests = REQUEST_HISTORY[entityType]?.[record.id] || [];

  const toggleRequest = (requestId) => {
    const newExpanded = new Set(expandedRequests);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRequests(newExpanded);
  };

  const handleStepClick = (step, request) => {
    if (onStepClick) {
      // Nếu có onStepClick prop, sử dụng nó (từ CustomerDetail)
      onStepClick(step, request);
    } else {
      // Check if this is an edit request
      if (request.requestType === "Edit") {
        // Show change log for edit requests
        setChangeLogData({
          requestId: request.requestId,
          stepName: step.stepName,
        });
        setShowChangeLog(true);
      } else {
        // Show regular step detail for create requests
        setSelectedStepData(step);
        setSelectedRequestData(request);
        setShowStepDetail(true);
      }
    }
  };

  const handleCloseStepDetail = () => {
    setShowStepDetail(false);
    setSelectedStepData(null);
    setSelectedRequestData(null);
  };

  const handleCloseChangeLog = () => {
    setShowChangeLog(false);
    setChangeLogData({ requestId: null, stepName: null });
  };

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
        className="fixed inset-0 !mt-0 bg-black bg-opacity-50 transition-opacity z-[90]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 !mt-0 flex items-center justify-center z-[90] p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Text variant="heading" size="lg" weight="semibold">
                Request History
              </Text>
              <Text variant="caption" color="muted">
                {record.customerCode} - {record.customerName}
              </Text>
            </div>
            <Button variant="ghost" size="small" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <Text variant="body" color="muted">
                  No request history found for this record
                </Text>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.requestId}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Request Header */}
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleRequest(request.requestId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="small"
                            className="p-1 h-auto"
                          >
                            {expandedRequests.has(request.requestId) ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </Button>

                          <div>
                            <Text variant="body" weight="semibold">
                              {request.requestId}
                            </Text>
                            <Text variant="caption" color="muted">
                              {request.requestType} request by{" "}
                              {request.submittedBy}
                            </Text>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Text variant="caption" color="muted">
                              Submitted: {formatDateTime(request.submittedDate)}
                            </Text>
                            {request.completedDate && (
                              <Text variant="caption" color="muted">
                                Completed:{" "}
                                {formatDateTime(request.completedDate)}
                              </Text>
                            )}
                          </div>

                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                    </div>

                    {/* Approval Tree (Collapsible) */}
                    {expandedRequests.has(request.requestId) && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <Text variant="body" weight="medium" className="mb-3">
                          Approval Tree ({request.approvalTree.length} steps)
                        </Text>

                        <div className="space-y-4">
                          {request.approvalTree.map((step, index) => (
                            <div key={index} className="relative">
                              {/* Timeline Line */}
                              {index < request.approvalTree.length - 1 && (
                                <div className="absolute left-4 top-12 w-0.5 h-16 bg-gray-200"></div>
                              )}

                              {/* Step Container */}
                              <div className="relative">
                                {/* Step Number */}
                                <div className="absolute left-0 top-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Text
                                    variant="caption"
                                    weight="bold"
                                    className="text-blue-600"
                                  >
                                    {index + 1}
                                  </Text>
                                </div>

                                {/* Step Content - Clickable */}
                                <div
                                  className="ml-12 bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                  onClick={() => handleStepClick(step, request)}
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <Text variant="body" weight="semibold">
                                      {step.stepName}
                                    </Text>
                                    <Text variant="caption" color="muted">
                                      Click to view details
                                    </Text>
                                  </div>

                                  {/* Owners */}
                                  <div className="space-y-2">
                                    {step.owners.map((owner, ownerIndex) => (
                                      <div
                                        key={ownerIndex}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                            <Text
                                              variant="caption"
                                              weight="medium"
                                              className="text-gray-600"
                                            >
                                              {owner.name
                                                .charAt(0)
                                                .toUpperCase()}
                                            </Text>
                                          </div>
                                          <div>
                                            <Text
                                              variant="body"
                                              weight="medium"
                                            >
                                              {owner.name}
                                            </Text>
                                            <Text
                                              variant="caption"
                                              color="muted"
                                            >
                                              {owner.title}
                                            </Text>
                                          </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                          {getStatusIcon(owner.status)}
                                          {getStatusBadge(owner.status)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <Button
              onClick={() => {
                // Handle export report logic here
                console.log("Exporting report...");
                // You can add actual export functionality here
              }}
            >
              Export Report
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Entity Step Detail Modal */}
      <EntityStepDetailModal
        isOpen={showStepDetail}
        onClose={handleCloseStepDetail}
        stepData={selectedStepData}
        requestData={selectedRequestData}
        record={record}
        entityType={entityType}
      />

      {/* Change Log Modal */}
      <ChangeLogModal
        isOpen={showChangeLog}
        onClose={handleCloseChangeLog}
        requestId={changeLogData.requestId}
        stepName={changeLogData.stepName}
      />
    </>
  );
};

export default RequestHistoryModal;
