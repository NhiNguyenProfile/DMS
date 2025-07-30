import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import Select from "../../atoms/Select";
import { Search, Filter, Plus, ArrowLeft } from "lucide-react";
import ApprovalTreeSlider from "./ApprovalTreeSlider";
import FinishedGoodsDetailForm from "./FinishedGoodsDetailForm";

// Sample finished goods requests data
const FINISHED_GOODS_REQUESTS = [
  {
    id: "REQ-20250724-004",
    requestType: "Unlock",
    requestTitle: "Unlock Feed Product – Dairy Line",
    stepOwner: "Alicia - Credit Officer",
    currentSteps: "Done",
    status: "Rejected",
    createdDate: "2025-07-24T10:30:00Z",
  },
  {
    id: "REQ-20250724-007",
    requestType: "Disable",
    requestTitle: "Disable Expired Product - 1019X",
    stepOwner: "Tony - QA Manager",
    currentSteps: "Waiting for QA",
    status: "Pending",
    createdDate: "2025-07-25T12:00:00Z",
  },
  {
    id: "REQ-20250724-003",
    requestType: "Create",
    requestTitle: "New Product - Premium Feed Mix",
    stepOwner: "Mike - Product Manager",
    currentSteps: "Waiting for Entry",
    status: "Pending",
    createdDate: "2025-07-24T14:15:00Z",
  },
];

// Sample approval tree data for finished goods
const FINISHED_GOODS_APPROVAL_TREES = {
  "REQ-20250724-004": {
    requestId: "REQ-20250724-004",
    approvalTree: [
      {
        stepName: "Product Review",
        owners: [
          {
            name: "Mike",
            title: "Product Manager",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-24T14:20:00Z",
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
  "REQ-20250724-007": {
    requestId: "REQ-20250724-007",
    approvalTree: [
      {
        stepName: "Quality Review",
        owners: [
          {
            name: "Sarah",
            title: "Quality Manager",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-25T09:30:00Z",
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
  "REQ-20250724-003": {
    requestId: "REQ-20250724-003",
    approvalTree: [
      {
        stepName: "Product Review",
        owners: [
          {
            name: "Mike",
            title: "Product Manager",
            avatarUrl: null,
            status: "Waiting",
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
};

const REQUEST_TYPES = [
  { value: "Create", label: "Create Record" },
  { value: "Edit", label: "Edit Record" },
  { value: "Disable", label: "Disable Record" },
  { value: "Reactivate", label: "Reactivate Record" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Synced", label: "Synced" },
];

const FinishedGoodsRequestList = ({
  onBack,
  hideHeader = false,
  onShowDetail,
}) => {
  const [requests, setRequests] = useState(FINISHED_GOODS_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    fromDate: "",
    toDate: "",
  });

  // Filter requests
  const filteredRequests = requests.filter((request) => {
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

  const handleAddRequest = (requestType) => {
    console.log("Creating new finished goods request:", requestType);
    setShowAddModal(false);
    // Handle request creation
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    // Filters are already applied in filteredRequests
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      fromDate: "",
      toDate: "",
    });
  };

  const handleRowClick = (request) => {
    const approvalData = FINISHED_GOODS_APPROVAL_TREES[request.id];
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
        onShowDetail(
          <FinishedGoodsDetailForm
            requestData={request}
            onBack={() => onShowDetail(null)}
            onSave={(updatedRequest) => {
              // Update the request in the list
              setRequests((prev) =>
                prev.map((r) =>
                  r.id === updatedRequest.id ? updatedRequest : r
                )
              );
              onShowDetail(null);
            }}
          />
        );
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
      onShowDetail(
        <FinishedGoodsDetailForm
          requestData={selectedRequestData}
          onBack={() => onShowDetail(null)}
          onSave={(updatedRequest) => {
            // Update the request in the list
            setRequests((prev) =>
              prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
            );
            onShowDetail(null);
          }}
        />
      );
    } else {
      // Cards mode - show detail form locally
      setShowDetailForm(true);
    }
  };

  const handleBackFromDetail = () => {
    setShowDetailForm(false);
    setSelectedRequestData(null);
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
    return (
      <FinishedGoodsDetailForm
        requestData={selectedRequestData}
        onBack={handleBackFromDetail}
      />
    );
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
                Finished Goods Requests
              </Text>
              <Text variant="body" color="muted">
                Manage finished goods production and inventory requests
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        {/* Search and Filter */}
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
          <Button variant="outline" onClick={() => setShowFilterModal(true)}>
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
        </div>

        {/* Add New Button */}
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="mr-2" />
          Add New
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
                  className="cursor-pointer hover:bg-gray-50"
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
                    <Text variant="body" className="text-sm">
                      {request.currentSteps}
                    </Text>
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

      {/* Add New Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Request"
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            Select the type of request you want to create:
          </Text>
          <div className="grid grid-cols-1 gap-3">
            {REQUEST_TYPES.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                onClick={() => handleAddRequest(type.value)}
                className="justify-start"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Requests"
      >
        <div className="space-y-4">
          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Status
            </Text>
            <Select
              options={STATUS_OPTIONS}
              value={filters.status}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            />
          </div>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Created Date Range
            </Text>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Text variant="caption" color="muted" className="mb-1">
                  From Date
                </Text>
                <Input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      fromDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Text variant="caption" color="muted" className="mb-1">
                  To Date
                </Text>
                <Input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, toDate: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilterModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredRequests.length} of {requests.length} requests
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

export default FinishedGoodsRequestList;
