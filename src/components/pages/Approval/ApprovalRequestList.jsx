import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import Select from "../../atoms/Select";
import { Search, Filter, ArrowLeft } from "lucide-react";
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

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

const ApprovalRequestList = ({ onBack, entityType = "Customers" }) => {
  const [requests, setRequests] = useState(
    APPROVAL_REQUESTS_DATA[entityType] || []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    fromDate: "",
    toDate: "",
  });

  // Filter requests - only show "Waiting for Approve"
  const filteredRequests = requests.filter((request) => {
    // Only show requests that are waiting for approval
    if (request.currentSteps !== "Waiting for Approve") return false;

    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.stepOwner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || request.status === filters.status;

    const matchesDate =
      (!filters.fromDate ||
        new Date(request.createdDate) >= new Date(filters.fromDate)) &&
      (!filters.toDate ||
        new Date(request.createdDate) <= new Date(filters.toDate));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleRowClick = (request) => {
    const approvalData = APPROVAL_TREES[request.id];
    if (approvalData) {
      // Combine request data with approval data
      const combinedData = {
        ...approvalData,
        ...request,
      };
      setSelectedRequestData(combinedData);
      setShowApprovalSlider(true);
    }
  };

  const handleCloseSlider = () => {
    setShowApprovalSlider(false);
    setSelectedRequestData(null);
  };

  const handleViewDetail = () => {
    setShowApprovalSlider(false);
    setShowDetailForm(true);
  };

  const handleBackFromDetail = () => {
    setShowDetailForm(false);
    setSelectedRequestData(null);
  };

  const handleViewApprovalFromDetail = () => {
    setShowDetailForm(false);
    setShowApprovalSlider(true);
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      fromDate: "",
      toDate: "",
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Synced: "bg-blue-100 text-blue-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[status] || "bg-gray-100 text-gray-800"
    }`;
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

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
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
        <Button variant="outline" onClick={() => setShowFilterModal(true)}>
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="min-w-[140px]">
                  Request ID
                </Table.HeaderCell>
                <Table.HeaderCell className="min-w-[100px]">
                  Type
                </Table.HeaderCell>
                <Table.HeaderCell className="min-w-[200px]">
                  Request Title
                </Table.HeaderCell>
                <Table.HeaderCell className="min-w-[150px]">
                  Step Owner
                </Table.HeaderCell>
                <Table.HeaderCell className="min-w-[130px]">
                  Current Steps
                </Table.HeaderCell>
                <Table.HeaderCell className="min-w-[80px]">
                  Status
                </Table.HeaderCell>
                <Table.HeaderCell className="min-w-[120px]">
                  Created Date
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredRequests.map((request) => (
                <Table.Row
                  key={request.id}
                  onClick={() => handleRowClick(request)}
                  className="cursor-pointer hover:bg-orange-50"
                >
                  <Table.Cell className="min-w-[140px]">
                    <Text
                      variant="body"
                      weight="medium"
                      className="font-mono text-sm"
                    >
                      {request.id}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="min-w-[100px]">
                    <Text variant="body" className="text-sm">
                      {request.requestType}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="min-w-[200px]">
                    <Text
                      variant="body"
                      className="truncate max-w-[180px]"
                      title={request.requestTitle}
                    >
                      {request.requestTitle}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="min-w-[150px]">
                    <Text
                      variant="body"
                      className="text-sm truncate"
                      title={request.stepOwner}
                    >
                      {request.stepOwner}
                    </Text>
                  </Table.Cell>
                  <Table.Cell className="min-w-[130px]">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800">
                      {request.currentSteps}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="min-w-[80px]">
                    <span className={getStatusBadge(request.status)}>
                      {request.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="min-w-[120px]">
                    <Text variant="body" className="text-xs">
                      {formatDate(request.createdDate)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
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
    </div>
  );
};

export default ApprovalRequestList;
