import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import ColumnVisibilityFilter from "../../atoms/ColumnVisibilityFilter";
import ConfirmationModal from "../../atoms/ConfirmationModal";
import { Search, ArrowLeft } from "lucide-react";
import ApprovalTreeSlider from "../MyRequest/ApprovalTreeSlider";
import ApprovalDetailForm from "./ApprovalDetailForm";
import SparePartsApprovalDetailForm from "./SparePartsApprovalDetailForm";
import FinishedGoodsApprovalDetailForm from "./FinishedGoodsApprovalDetailForm";

// Sample approval requests data by entity type
const APPROVAL_REQUESTS_DATA = {
  Customers: [
    {
      id: "REQ-20250724-001",
      requestType: "Create",
      requestTitle: "New Customer - ABC Company",
      stepOwner: "Alicia - Credit Officer",
      currentSteps: "Waiting for Approve",
      status: "Pending",
      createdDate: "2025-07-24T10:30:00Z",
    },
    {
      id: "REQ-20250724-005",
      requestType: "Edit",
      requestTitle: "Update Customer - XYZ Co. Ltd",
      stepOwner: "Jame - Credit Supervisor",
      currentSteps: "Waiting for Approve",
      status: "Pending",
      createdDate: "2025-07-25T09:00:00Z",
    },
  ],
  "Spare Parts": [
    {
      id: "REQ-20250724-008",
      requestType: "Create",
      requestTitle: "Add New Hydraulic Pump - Line B",
      stepOwner: "Tony - Technical Lead",
      currentSteps: "Waiting for Approve",
      status: "Pending",
      createdDate: "2025-07-24T14:20:00Z",
    },
    {
      id: "REQ-20250724-009",
      requestType: "Edit",
      requestTitle: "Update Motor Specifications - Assembly A",
      stepOwner: "Linda - Engineering Manager",
      currentSteps: "Waiting for Approve",
      status: "Pending",
      createdDate: "2025-07-25T08:45:00Z",
    },
  ],
  "Finished Goods": [
    {
      id: "REQ-20250724-010",
      requestType: "Create",
      requestTitle: "New Product Line - Premium Feed 2025",
      stepOwner: "Mike - Product Manager",
      currentSteps: "Waiting for Approve",
      status: "Pending",
      createdDate: "2025-07-24T16:30:00Z",
    },
    {
      id: "REQ-20250724-011",
      requestType: "Edit",
      requestTitle: "Update Packaging Specs - Dairy Formula",
      stepOwner: "Sarah - Quality Manager",
      currentSteps: "Waiting for Approve",
      status: "Pending",
      createdDate: "2025-07-25T10:15:00Z",
    },
  ],
};

// Sample approval tree data
const APPROVAL_TREES = {
  "REQ-20250724-001": {
    requestId: "REQ-20250724-001",
    approvalTree: [
      {
        stepName: "Credit Check",
        owners: [
          {
            name: "Alicia",
            title: "Credit Officer",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-24T10:35:00Z",
          },
        ],
      },
      {
        stepName: "Sales Review",
        owners: [
          {
            name: "Jame",
            title: "Sales Supervisor",
            avatarUrl: null,
            status: "Waiting",
          },
        ],
      },
    ],
  },
  "REQ-20250724-005": {
    requestId: "REQ-20250724-005",
    approvalTree: [
      {
        stepName: "Data Validation",
        owners: [
          {
            name: "Jame",
            title: "Credit Supervisor",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-25T09:15:00Z",
          },
        ],
      },
      {
        stepName: "Final Review",
        owners: [
          {
            name: "Tony",
            title: "Head of Division",
            avatarUrl: null,
            status: "Waiting",
          },
        ],
      },
    ],
  },
  // Spare Parts requests
  "REQ-20250724-008": {
    requestId: "REQ-20250724-008",
    approvalTree: [
      {
        stepName: "Technical Review",
        owners: [
          {
            name: "Tony",
            title: "Technical Lead",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-24T14:25:00Z",
          },
        ],
      },
      {
        stepName: "Engineering Approval",
        owners: [
          {
            name: "Linda",
            title: "Engineering Manager",
            avatarUrl: null,
            status: "Waiting",
          },
        ],
      },
    ],
  },
  "REQ-20250724-009": {
    requestId: "REQ-20250724-009",
    approvalTree: [
      {
        stepName: "Specification Review",
        owners: [
          {
            name: "Linda",
            title: "Engineering Manager",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-25T08:50:00Z",
          },
        ],
      },
      {
        stepName: "Quality Assurance",
        owners: [
          {
            name: "Sarah",
            title: "Quality Manager",
            avatarUrl: null,
            status: "Waiting",
          },
        ],
      },
    ],
  },
  // Finished Goods requests
  "REQ-20250724-010": {
    requestId: "REQ-20250724-010",
    approvalTree: [
      {
        stepName: "Product Review",
        owners: [
          {
            name: "Mike",
            title: "Product Manager",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-24T16:35:00Z",
          },
        ],
      },
      {
        stepName: "Marketing Approval",
        owners: [
          {
            name: "Anna",
            title: "Marketing Director",
            avatarUrl: null,
            status: "Waiting",
          },
        ],
      },
    ],
  },
  "REQ-20250724-011": {
    requestId: "REQ-20250724-011",
    approvalTree: [
      {
        stepName: "Quality Review",
        owners: [
          {
            name: "Sarah",
            title: "Quality Manager",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-25T10:20:00Z",
          },
        ],
      },
      {
        stepName: "Production Approval",
        owners: [
          {
            name: "David",
            title: "Production Manager",
            avatarUrl: null,
            status: "Waiting",
          },
        ],
      },
    ],
  },
};

// Column definitions for the approval requests table
const ALL_APPROVAL_COLUMNS = [
  { key: "select", label: "Select" },
  { key: "id", label: "Request ID" },
  { key: "requestTitle", label: "Request Title" },
  { key: "requestType", label: "Type" },
  { key: "stepOwner", label: "Step Owner" },
  { key: "currentSteps", label: "Current Steps" },
  { key: "createdDate", label: "Created Date" },
];

const ApprovalRequestList = ({
  onBack,
  entityType = "Customers",
  hideHeader = false,
  onShowDetail,
}) => {
  const [requests] = useState(APPROVAL_REQUESTS_DATA[entityType] || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);

  // Mass approval functionality
  const [selectedRequests, setSelectedRequests] = useState(new Set());
  const [viewedRequests, setViewedRequests] = useState(new Set());

  // Mass approval modals
  const [showMassApproveModal, setShowMassApproveModal] = useState(false);
  const [showMassRejectModal, setShowMassRejectModal] = useState(false);
  const [showMassUpdateModal, setShowMassUpdateModal] = useState(false);

  // Column visibility and filtering
  const [visibleColumns, setVisibleColumns] = useState([
    "select",
    "id",
    "requestTitle",
    "stepOwner",
    "currentSteps",
    "createdDate",
  ]);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // Filter requests - only show "Waiting for Approve"
  const filteredRequests = requests.filter((request) => {
    // Only show requests that are waiting for approval
    if (request.currentSteps !== "Waiting for Approve") return false;

    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.stepOwner.toLowerCase().includes(searchTerm.toLowerCase());

    // Column filters
    const matchesColumnFilters = visibleColumns.every((colKey) => {
      const filterValue = columnFilters[colKey] || "";
      if (!filterValue) return true;
      return String(request[colKey])
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });

    return matchesSearch && matchesColumnFilters;
  });

  // Get visible column definitions
  const visibleColumnDefs = ALL_APPROVAL_COLUMNS.filter((col) =>
    visibleColumns.includes(col.key)
  );

  // Helper function to render cell content
  const renderCellContent = (request, columnKey) => {
    switch (columnKey) {
      case "select":
        const isViewed = viewedRequests.has(request.id);
        const isSelected = selectedRequests.has(request.id);
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={isSelected}
              disabled={!isViewed}
              onChange={(e) => {
                const newSelected = new Set(selectedRequests);
                if (e.target.checked) {
                  newSelected.add(request.id);
                } else {
                  newSelected.delete(request.id);
                }
                setSelectedRequests(newSelected);
              }}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        );
      case "id":
        return (
          <Text variant="body" weight="medium" className="font-mono text-sm">
            {request.id}
          </Text>
        );
      case "requestTitle":
        return (
          <Text
            variant="body"
            className="truncate max-w-[180px]"
            title={request.requestTitle}
          >
            {request.requestTitle}
          </Text>
        );
      case "requestType":
        return (
          <Text variant="body" className="text-sm">
            {request.requestType}
          </Text>
        );
      case "stepOwner":
        return (
          <Text
            variant="body"
            className="text-sm truncate"
            title={request.stepOwner}
          >
            {request.stepOwner}
          </Text>
        );
      case "currentSteps":
        return (
          <Text variant="body" className="text-sm truncate">
            {request.currentSteps}
          </Text>
        );

      case "createdDate":
        return (
          <Text variant="body" className="text-xs">
            {formatDate(request.createdDate)}
          </Text>
        );
      default:
        return String(request[columnKey] || "");
    }
  };

  const handleRowClick = (request) => {
    // Mark request as viewed
    setViewedRequests((prev) => new Set([...prev, request.id]));

    const approvalData = APPROVAL_TREES[request.id];
    if (approvalData) {
      // Combine request data with approval data
      const combinedData = {
        ...approvalData,
        ...request,
      };
      setSelectedRequestData(combinedData);
      setShowApprovalSlider(true);
    } else {
      // If no approval tree data, still allow viewing detail form
      setSelectedRequestData(request);
      if (onShowDetail) {
        // Direct mode - pass detail component to parent
        const getDetailComponent = () => {
          switch (entityType) {
            case "Customers":
              return (
                <ApprovalDetailForm
                  requestData={request}
                  onBack={() => onShowDetail(null)}
                />
              );
            case "Spare Parts":
              return (
                <SparePartsApprovalDetailForm
                  requestData={request}
                  onBack={() => onShowDetail(null)}
                />
              );
            case "Finished Goods":
              return (
                <FinishedGoodsApprovalDetailForm
                  requestData={request}
                  onBack={() => onShowDetail(null)}
                />
              );
            default:
              return (
                <ApprovalDetailForm
                  requestData={request}
                  onBack={() => onShowDetail(null)}
                />
              );
          }
        };
        onShowDetail(getDetailComponent());
      } else {
        // Cards mode - show detail form locally
        setShowDetailForm(true);
      }
    }
  };

  const handleCloseSlider = () => {
    setShowApprovalSlider(false);
    setSelectedRequestData(null);
  };

  const handleViewDetail = () => {
    setShowApprovalSlider(false);
    if (onShowDetail) {
      // Direct mode - pass detail component to parent
      const getDetailComponent = () => {
        switch (entityType) {
          case "Customers":
            return (
              <ApprovalDetailForm
                requestData={selectedRequestData}
                onBack={() => onShowDetail(null)}
              />
            );
          case "Spare Parts":
            return (
              <SparePartsApprovalDetailForm
                requestData={selectedRequestData}
                onBack={() => onShowDetail(null)}
              />
            );
          case "Finished Goods":
            return (
              <FinishedGoodsApprovalDetailForm
                requestData={selectedRequestData}
                onBack={() => onShowDetail(null)}
              />
            );
          default:
            return (
              <ApprovalDetailForm
                requestData={selectedRequestData}
                onBack={() => onShowDetail(null)}
              />
            );
        }
      };
      onShowDetail(getDetailComponent());
    } else {
      // Cards mode - show detail form locally
      setShowDetailForm(true);
    }
  };

  const handleBackFromDetail = () => {
    setShowDetailForm(false);
    setSelectedRequestData(null);
  };

  // Mass approval handlers
  const handleSelectAll = () => {
    const viewedRequestIds = filteredRequests
      .filter((req) => viewedRequests.has(req.id))
      .map((req) => req.id);
    setSelectedRequests(new Set(viewedRequestIds));
  };

  const handleDeselectAll = () => {
    setSelectedRequests(new Set());
  };

  const handleMassAction = (action) => {
    if (selectedRequests.size === 0) return;

    // Show appropriate modal based on action
    if (action === "approve") {
      setShowMassApproveModal(true);
    } else if (action === "reject") {
      setShowMassRejectModal(true);
    } else if (action === "update") {
      setShowMassUpdateModal(true);
    }
  };

  // Mass approval confirmation handlers
  const handleMassApproveConfirm = (comment) => {
    console.log(
      "Mass approve requests:",
      Array.from(selectedRequests),
      "Comment:",
      comment
    );

    // Clear selections and close modal
    setSelectedRequests(new Set());
    setViewedRequests((prev) => {
      const newViewed = new Set(prev);
      selectedRequests.forEach((id) => newViewed.delete(id));
      return newViewed;
    });
    setShowMassApproveModal(false);

    // In a real app, you would update the backend here
    alert(
      `Successfully approved ${selectedRequests.size} request(s). They have been removed from the list.`
    );
  };

  const handleMassRejectConfirm = (comment) => {
    console.log(
      "Mass reject requests:",
      Array.from(selectedRequests),
      "Reason:",
      comment
    );

    // Clear selections and close modal
    setSelectedRequests(new Set());
    setViewedRequests((prev) => {
      const newViewed = new Set(prev);
      selectedRequests.forEach((id) => newViewed.delete(id));
      return newViewed;
    });
    setShowMassRejectModal(false);

    // In a real app, you would update the backend here
    alert(
      `Successfully rejected ${selectedRequests.size} request(s). They have been removed from the list.`
    );
  };

  const handleMassUpdateConfirm = (comment) => {
    console.log(
      "Mass request update:",
      Array.from(selectedRequests),
      "Comment:",
      comment
    );

    // Clear selections and close modal
    setSelectedRequests(new Set());
    setViewedRequests((prev) => {
      const newViewed = new Set(prev);
      selectedRequests.forEach((id) => newViewed.delete(id));
      return newViewed;
    });
    setShowMassUpdateModal(false);

    // In a real app, you would update the backend here
    alert(
      `Successfully requested updates for ${selectedRequests.size} request(s). They have been removed from the list.`
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show detail form if selected
  if (showDetailForm && selectedRequestData) {
    switch (entityType) {
      case "Customers":
        return (
          <ApprovalDetailForm
            requestData={selectedRequestData}
            onBack={handleBackFromDetail}
          />
        );
      case "Spare Parts":
        return (
          <SparePartsApprovalDetailForm
            requestData={selectedRequestData}
            onBack={handleBackFromDetail}
          />
        );
      case "Finished Goods":
        return (
          <FinishedGoodsApprovalDetailForm
            requestData={selectedRequestData}
            onBack={handleBackFromDetail}
          />
        );
      default:
        return (
          <ApprovalDetailForm
            requestData={selectedRequestData}
            onBack={handleBackFromDetail}
          />
        );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <div>
              <Text variant="heading" size="xl" weight="bold" className="mb-2">
                {entityType}
              </Text>
              <Text variant="body" color="muted">
                Review and approve pending {entityType.toLowerCase()} requests
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showColumnFilters ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowColumnFilters((v) => !v)}
          >
            {showColumnFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <ColumnVisibilityFilter
            columns={ALL_APPROVAL_COLUMNS}
            visibleColumns={visibleColumns}
            onVisibilityChange={setVisibleColumns}
            buttonText="Columns"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                {visibleColumnDefs.map((column) => (
                  <Table.HeaderCell key={column.key} className="min-w-[120px]">
                    {column.key === "select" ? (
                      <input
                        type="checkbox"
                        checked={
                          selectedRequests.size > 0 &&
                          selectedRequests.size ===
                            filteredRequests.filter((req) =>
                              viewedRequests.has(req.id)
                            ).length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleSelectAll();
                          } else {
                            handleDeselectAll();
                          }
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    ) : (
                      column.label
                    )}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
              {/* Filter row */}
              {showColumnFilters && (
                <Table.Row>
                  {visibleColumnDefs.map((column) => (
                    <Table.HeaderCell key={column.key}>
                      {column.key === "select" ? (
                        <div className="w-full h-8"></div>
                      ) : (
                        <Input
                          placeholder={`Filter ${column.label}`}
                          value={columnFilters[column.key] || ""}
                          onChange={(e) =>
                            setColumnFilters((prev) => ({
                              ...prev,
                              [column.key]: e.target.value,
                            }))
                          }
                          className="w-full text-xs px-2 py-1"
                        />
                      )}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              )}
            </Table.Header>
            <Table.Body>
              {filteredRequests.map((request) => {
                const isViewed = viewedRequests.has(request.id);
                return (
                  <Table.Row
                    key={request.id}
                    onClick={() => handleRowClick(request)}
                    className={`cursor-pointer hover:bg-orange-50 ${
                      isViewed ? "bg-blue-50" : ""
                    }`}
                  >
                    {visibleColumnDefs.map((column) => (
                      <Table.Cell key={column.key}>
                        {renderCellContent(request, column.key)}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>

      {/* Mass Action Buttons */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Text variant="body" color="muted" className="text-sm">
            {selectedRequests.size} of {filteredRequests.length} requests
            selected
          </Text>
          {selectedRequests.size > 0 && (
            <Text variant="body" color="muted" className="text-sm">
              •{" "}
              {
                filteredRequests.filter((req) => viewedRequests.has(req.id))
                  .length
              }{" "}
              viewed
            </Text>
          )}
        </div>
        {selectedRequests.size > 0 && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMassAction("update")}
            >
              Request Update
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMassAction("reject")}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Reject
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleMassAction("approve")}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>
          </div>
        )}
      </div>

      {/* No results */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Text variant="body" color="muted">
            No pending approval requests found
          </Text>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredRequests.length} pending approval requests
        </Text>
      </div>

      {/* Approval Tree Slider */}
      <ApprovalTreeSlider
        isOpen={showApprovalSlider}
        onClose={handleCloseSlider}
        requestData={selectedRequestData}
        onViewDetail={handleViewDetail}
        hideViewDetail={showDetailForm}
      />

      {/* Mass Approval Confirmation Modals */}

      {/* Mass Approve Modal */}
      <ConfirmationModal
        isOpen={showMassApproveModal}
        onClose={() => setShowMassApproveModal(false)}
        onConfirm={handleMassApproveConfirm}
        title="Mass Approve Requests"
        message={`Are you sure you want to approve ${selectedRequests.size} selected request(s)? This will move them to the next step in the workflow.`}
        confirmText="Approve All"
        confirmVariant="primary"
        commentLabel="Approval comments"
        commentPlaceholder="Add any comments or notes for this mass approval..."
        commentRequired={false}
      />

      {/* Mass Reject Modal */}
      <ConfirmationModal
        isOpen={showMassRejectModal}
        onClose={() => setShowMassRejectModal(false)}
        onConfirm={handleMassRejectConfirm}
        title="Mass Reject Requests"
        message={`Are you sure you want to reject ${selectedRequests.size} selected request(s)? This action will notify all submitters.`}
        confirmText="Reject All"
        confirmVariant="outline"
        commentLabel="Reason for rejection"
        commentPlaceholder="Please provide a clear reason for rejecting these requests..."
        commentRequired={true}
      />

      {/* Mass Request Update Modal */}
      <ConfirmationModal
        isOpen={showMassUpdateModal}
        onClose={() => setShowMassUpdateModal(false)}
        onConfirm={handleMassUpdateConfirm}
        title="Mass Request Update"
        message={`Request the submitters to update ${selectedRequests.size} selected request(s) with additional information or corrections.`}
        confirmText="Request Updates"
        confirmVariant="outline"
        commentLabel="Update request details"
        commentPlaceholder="Please specify what needs to be updated for these requests..."
        commentRequired={true}
      />
    </div>
  );
};

export default ApprovalRequestList;
