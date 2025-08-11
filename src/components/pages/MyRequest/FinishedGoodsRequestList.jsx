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

const ALL_REQUEST_TYPES = [
  { value: "Create", label: "Create New Record" },
  { value: "MassCreate", label: "Mass Create Records" },
  { value: "MassEdit", label: "Mass Edit Records" },
  { value: "Copy", label: "Copy Existing Record" },
  { value: "Extend", label: "Extend Existing Record" },
  { value: "Edit", label: "Edit Existing Record" },
  { value: "Disable", label: "Disable Existing Record" },
  { value: "Reactivate", label: "Reactivate Existing Record" },
];

// Available finished goods for search
const EXISTING_FINISHED_GOODS = [
  {
    id: "FG-001",
    name: "Premium Steel Pipe 100mm",
    code: "PSP100",
    category: "Steel Products",
    status: "Active",
  },
  {
    id: "FG-002",
    name: "Industrial Valve Set",
    code: "IVS200",
    category: "Valve Systems",
    status: "Active",
  },
  {
    id: "FG-003",
    name: "Heavy Duty Bearing Unit",
    code: "HDBU300",
    category: "Bearings",
    status: "Active",
  },
  {
    id: "FG-004",
    name: "Precision Gear Assembly",
    code: "PGA400",
    category: "Gears",
    status: "Inactive",
  },
  {
    id: "FG-005",
    name: "Control Panel Module",
    code: "CPM500",
    category: "Electronics",
    status: "Active",
  },
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
  allowedRequestTypes = null,
}) => {
  const [requests, setRequests] = useState(FINISHED_GOODS_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);

  // Filter request types based on allowedRequestTypes
  const REQUEST_TYPES = allowedRequestTypes
    ? ALL_REQUEST_TYPES.filter((type) =>
        allowedRequestTypes.includes(type.value)
      )
    : ALL_REQUEST_TYPES;
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [goodsSearchTerm, setGoodsSearchTerm] = useState("");
  const [selectedGoods, setSelectedGoods] = useState(null);
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
    setShowAddModal(false);
    setSelectedRequestType(requestType);

    if (requestType === "Create") {
      // For Create New Record, create new request and go to detail form
      const newRequest = {
        id: `REQ-${Date.now()}`,
        requestType: "Create",
        requestTitle: "New Finished Goods Record",
        stepOwner: "You - Production Manager",
        currentSteps: "Waiting for Entry",
        status: "Draft",
        createdDate: new Date().toISOString(),
        isNew: true, // Flag to indicate this is a new request
        approvalTree: [
          {
            stepName: "Waiting for Entry",
            owners: [
              { name: "You", role: "Production Manager", status: "current" },
            ],
            status: "current",
          },
          {
            stepName: "Quality Check",
            owners: [
              { name: "Anna", role: "QA Supervisor", status: "pending" },
            ],
            status: "pending",
          },
          {
            stepName: "Final Approval",
            owners: [
              { name: "David", role: "Plant Manager", status: "pending" },
            ],
            status: "pending",
          },
        ],
      };

      // Add to requests list
      setRequests((prev) => [newRequest, ...prev]);

      // Also trigger onShowDetail if provided (for parent component)
      if (onShowDetail) {
        onShowDetail(
          <FinishedGoodsDetailForm
            requestData={newRequest}
            onBack={() => {
              onShowDetail(null);
            }}
            onSave={(updatedRequest) => {
              // Update the request in the list
              setRequests((prev) =>
                prev.map((req) =>
                  req.id === updatedRequest.id ? updatedRequest : req
                )
              );
              onShowDetail(null);
            }}
          />
        );
      }
    } else {
      // For other types, show search modal to find existing records
      setShowSearchModal(true);
      setGoodsSearchTerm("");
      setSearchResults([]);
      setSelectedGoods(null);
    }
  };

  const handleSearch = (term) => {
    setGoodsSearchTerm(term);
    if (term.trim()) {
      const results = EXISTING_FINISHED_GOODS.filter(
        (goods) =>
          goods.name.toLowerCase().includes(term.toLowerCase()) ||
          goods.code.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectGoods = (goods) => {
    // Just set the selected goods, don't create request yet
    setSelectedGoods(goods);
  };

  const handleSendRequest = () => {
    if (!selectedGoods) return;

    // Create request for selected goods
    const newRequest = {
      id: `REQ-${Date.now()}`,
      requestType: selectedRequestType,
      requestTitle: `${selectedRequestType} Finished Goods - ${selectedGoods.name}`,
      stepOwner: "You - Production Manager",
      currentSteps: "Waiting for Approval",
      status: "Pending",
      createdDate: new Date().toISOString(),
      goodsId: selectedGoods.id,
      goodsData: selectedGoods,
      approvalTree: [
        {
          stepName: "Review Request",
          owners: [{ name: "Anna", role: "QA Supervisor", status: "current" }],
          status: "current",
        },
        {
          stepName: "Final Approval",
          owners: [{ name: "David", role: "Plant Manager", status: "pending" }],
          status: "pending",
        },
      ],
    };

    // Add to requests list
    setRequests((prev) => [newRequest, ...prev]);

    // Close search modal and reset
    setShowSearchModal(false);
    setSelectedRequestType(null);
    setSelectedGoods(null);
    setGoodsSearchTerm("");
    setSearchResults([]);

    // Show success message (could be a toast notification)
    console.log("Request sent successfully:", newRequest);
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

      {/* Search Existing Records Modal */}
      <Modal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        title={`Search Finished Goods for ${selectedRequestType} Request`}
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            Enter goods code or search name to find existing records:
          </Text>

          {/* Search Input */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Enter goods code or search name..."
              value={goodsSearchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Goods */}
          {selectedGoods && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Text
                variant="body"
                weight="medium"
                className="text-blue-800 mb-2"
              >
                Selected Finished Goods:
              </Text>
              <div className="flex justify-between items-start">
                <div>
                  <Text variant="body" weight="medium">
                    {selectedGoods.name}
                  </Text>
                  <Text variant="caption" color="muted">
                    Code: {selectedGoods.code} • Category:{" "}
                    {selectedGoods.category}
                  </Text>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    selectedGoods.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedGoods.status}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedGoods(null)}
                className="mt-2"
              >
                Change Selection
              </Button>
            </div>
          )}

          {/* Search Results */}
          {!selectedGoods && searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <Text variant="body" weight="medium" className="text-sm">
                Found {searchResults.length} finished goods:
              </Text>
              {searchResults.map((goods) => (
                <div
                  key={goods.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectGoods(goods)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text variant="body" weight="medium">
                        {goods.name}
                      </Text>
                      <Text variant="caption" color="muted">
                        Code: {goods.code} • Category: {goods.category}
                      </Text>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        goods.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {goods.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {goodsSearchTerm && searchResults.length === 0 && (
            <div className="text-center py-8">
              <Text variant="body" color="muted">
                No finished goods found matching "{goodsSearchTerm}"
              </Text>
            </div>
          )}

          {/* Instructions */}
          {!goodsSearchTerm && !selectedGoods && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <Text variant="body" className="text-blue-800 text-sm">
                Start typing to search for existing finished goods. You can
                search by goods name or code. After selecting goods, click "Send
                Request" to submit.
              </Text>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowSearchModal(false)}>
              Cancel
            </Button>
            {selectedGoods && (
              <Button variant="primary" onClick={handleSendRequest}>
                Send Request
              </Button>
            )}
          </div>
        </div>
      </Modal>

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
