import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import Select from "../../atoms/Select";
import { Search, Filter, Plus, Calendar, ArrowLeft } from "lucide-react";
import ApprovalTreeSlider from "./ApprovalTreeSlider";
import CustomerDetailForm from "./CustomerDetailForm";

// Sample customer requests data
const CUSTOMER_REQUESTS = [
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
    id: "REQ-20250724-003",
    requestType: "Disable",
    requestTitle: "Disable Agent",
    stepOwner: "You - Sale Admin",
    currentSteps: "Waiting for Entry",
    status: "Approved",
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
];

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
            status: "Rejected",
            rejectedAt: "2025-07-24T10:40:00Z",
            reason: "Missing customer type classification",
          },
        ],
      },
      {
        stepName: "Final Approval",
        owners: [
          {
            name: "Tony",
            title: "Head of Division",
            avatarUrl: null,
            status: "Waiting",
          },
          {
            name: "Linda",
            title: "Deputy Director",
            avatarUrl: null,
            status: "Waiting",
          },
        ],
        parallel: true,
      },
    ],
  },
  "REQ-20250724-003": {
    requestId: "REQ-20250724-003",
    approvalTree: [
      {
        stepName: "Manager Review",
        owners: [
          {
            name: "You",
            title: "Sale Admin",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-24T10:32:00Z",
          },
        ],
      },
      {
        stepName: "Director Approval",
        owners: [
          {
            name: "Linda",
            title: "Deputy Director",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-24T10:45:00Z",
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
};

const REQUEST_TYPES = [
  { value: "Create", label: "Create New Record" },
  { value: "Edit", label: "Edit Existing Record" },
  { value: "Disable", label: "Disable Existing Record" },
  { value: "Reactivate", label: "Reactivate Existing Record" },
];

// Sample existing customers for search
const EXISTING_CUSTOMERS = [
  {
    id: "CUST-001",
    name: "ABC Company Ltd.",
    code: "ABC001",
    type: "Corporate",
    status: "Active",
  },
  {
    id: "CUST-002",
    name: "XYZ Corporation",
    code: "XYZ002",
    type: "Corporate",
    status: "Active",
  },
  {
    id: "CUST-003",
    name: "DEF Industries",
    code: "DEF003",
    type: "SME",
    status: "Active",
  },
  {
    id: "CUST-004",
    name: "GHI Trading Co.",
    code: "GHI004",
    type: "Individual",
    status: "Inactive",
  },
  {
    id: "CUST-005",
    name: "JKL Manufacturing",
    code: "JKL005",
    type: "Corporate",
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

const CustomerRequestList = ({ onBack, hideHeader = false, onShowDetail }) => {
  const [requests, setRequests] = useState(CUSTOMER_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
        requestTitle: "New Customer Record",
        stepOwner: "You - Sale Admin",
        currentSteps: "Waiting for Entry",
        status: "Draft",
        createdDate: new Date().toISOString(),
        isNew: true, // Flag to indicate this is a new request
        approvalTree: [
          {
            stepName: "Waiting for Entry",
            owners: [{ name: "You", role: "Sale Admin", status: "current" }],
            status: "current",
          },
          {
            stepName: "Credit Check",
            owners: [
              { name: "Alicia", role: "Credit Officer", status: "pending" },
            ],
            status: "pending",
          },
          {
            stepName: "Final Approval",
            owners: [
              { name: "James", role: "Credit Supervisor", status: "pending" },
            ],
            status: "pending",
          },
        ],
      };

      // Add to requests list
      setRequests((prev) => [newRequest, ...prev]);

      // Set as selected request and show detail form
      setSelectedRequestData(newRequest);
      setShowDetailForm(true);

      // Also trigger onShowDetail if provided (for parent component)
      if (onShowDetail) {
        onShowDetail(
          <CustomerDetailForm
            requestData={newRequest}
            onBack={() => {
              setShowDetailForm(false);
              onShowDetail(null);
            }}
            onSave={(updatedRequest) => {
              // Update the request in the list
              setRequests((prev) =>
                prev.map((req) =>
                  req.id === updatedRequest.id ? updatedRequest : req
                )
              );
              setShowDetailForm(false);
              onShowDetail(null);
            }}
          />
        );
      }
    } else {
      // For other types, show search modal to find existing records
      setShowSearchModal(true);
      setCustomerSearchTerm("");
      setSearchResults([]);
      setSelectedCustomer(null);
    }
  };

  const handleSearch = (term) => {
    setCustomerSearchTerm(term);
    if (term.trim()) {
      const results = EXISTING_CUSTOMERS.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term.toLowerCase()) ||
          customer.code.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCustomer = (customer) => {
    // Just set the selected customer, don't create request yet
    setSelectedCustomer(customer);
  };

  const handleSendRequest = () => {
    if (!selectedCustomer) return;

    // Create request for selected customer
    const newRequest = {
      id: `REQ-${Date.now()}`,
      requestType: selectedRequestType,
      requestTitle: `${selectedRequestType} Customer - ${selectedCustomer.name}`,
      stepOwner: "You - Sale Admin",
      currentSteps: "Waiting for Approval",
      status: "Pending",
      createdDate: new Date().toISOString(),
      customerId: selectedCustomer.id,
      customerData: selectedCustomer,
      approvalTree: [
        {
          stepName: "Review Request",
          owners: [
            { name: "Alicia", role: "Credit Officer", status: "current" },
          ],
          status: "current",
        },
        {
          stepName: "Final Approval",
          owners: [
            { name: "James", role: "Credit Supervisor", status: "pending" },
          ],
          status: "pending",
        },
      ],
    };

    // Add to requests list
    setRequests((prev) => [newRequest, ...prev]);

    // Close search modal and reset
    setShowSearchModal(false);
    setSelectedRequestType(null);
    setSelectedCustomer(null);
    setCustomerSearchTerm("");
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
        onShowDetail(
          <CustomerDetailForm
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
        <CustomerDetailForm
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

  const handleViewApprovalFromDetail = () => {
    setShowDetailForm(false);
    setShowApprovalSlider(true);
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
      <CustomerDetailForm
        requestData={selectedRequestData}
        onBack={handleBackFromDetail}
        onViewApproval={handleViewApprovalFromDetail}
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
                Customer Requests
              </Text>
              <Text variant="body" color="muted">
                Manage customer-related requests and workflows
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
                  <Table.Cell>
                    <Text
                      variant="body"
                      weight="medium"
                      className="font-mono text-sm"
                    >
                      {request.id}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="text-sm truncate">
                      {request.requestType}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text
                      variant="body"
                      className="truncate max-w-[180px]"
                      title={request.requestTitle}
                    >
                      {request.requestTitle}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="text-sm truncate">
                      {request.stepOwner}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="text-sm truncate">
                      {request.currentSteps}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={getStatusBadge(request.status)}>
                      {request.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
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
        title={`Search Customer for ${selectedRequestType} Request`}
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            Enter customer code or search name to find existing records:
          </Text>

          {/* Search Input */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Enter customer code or search name..."
              value={customerSearchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Customer */}
          {selectedCustomer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Text
                variant="body"
                weight="medium"
                className="text-blue-800 mb-2"
              >
                Selected Customer:
              </Text>
              <div className="flex justify-between items-start">
                <div>
                  <Text variant="body" weight="medium">
                    {selectedCustomer.name}
                  </Text>
                  <Text variant="caption" color="muted">
                    Code: {selectedCustomer.code} • Type:{" "}
                    {selectedCustomer.type}
                  </Text>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    selectedCustomer.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedCustomer.status}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCustomer(null)}
                className="mt-2"
              >
                Change Selection
              </Button>
            </div>
          )}

          {/* Search Results */}
          {!selectedCustomer && searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <Text variant="body" weight="medium" className="text-sm">
                Found {searchResults.length} customer(s):
              </Text>
              {searchResults.map((customer) => (
                <div
                  key={customer.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text variant="body" weight="medium">
                        {customer.name}
                      </Text>
                      <Text variant="caption" color="muted">
                        Code: {customer.code} • Type: {customer.type}
                      </Text>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {customerSearchTerm && searchResults.length === 0 && (
            <div className="text-center py-8">
              <Text variant="body" color="muted">
                No customers found matching "{customerSearchTerm}"
              </Text>
            </div>
          )}

          {/* Instructions */}
          {!customerSearchTerm && !selectedCustomer && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <Text variant="body" className="text-blue-800 text-sm">
                Start typing to search for existing customers. You can search by
                customer name or code. After selecting a customer, click "Send
                Request" to submit.
              </Text>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowSearchModal(false)}>
              Cancel
            </Button>
            {selectedCustomer && (
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

export default CustomerRequestList;
