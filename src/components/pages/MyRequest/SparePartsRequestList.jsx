import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import Select from "../../atoms/Select";
import ObjectSelectModal from "../../atoms/ObjectSelectModal";
import { Search, Filter, Plus, ArrowLeft, Edit, Copy, Eye } from "lucide-react";
import ApprovalTreeSlider from "./ApprovalTreeSlider";
import SparePartsDetailForm from "./SparePartsDetailForm";
import SparePartsBulkCreatePage from "./SparePartsBulkCreatePage";

// Request Types for Spare Parts
const REQUEST_TYPES = [
  { value: "Create", label: "Create New Record" },
  { value: "MassCreate", label: "Mass Create Records" },
  { value: "MassEdit", label: "Mass Edit Records" },
  { value: "Copy", label: "Copy Existing Record" },
  { value: "Edit", label: "Edit Existing Record" },
];

// Existing Spare Parts for Copy/Edit
const EXISTING_SPARE_PARTS = [
  {
    id: 1,
    itemNumber: "SP001",
    productName: "Bearing Assembly",
    productNumber: "FE400001",
    businessSector: "Feed",
    itemType: "Unknown",
    classType: "Spare Part",
    company: "DHV",
    status: "Active",
    searchName: "Bearing Assy",
    productType: "Item",
    productSubtype: "Product",
    syncToDHC: "No",
    storageDimensionGroup: "SWFL",
    trackingDimensionGroup: "None",
    itemModelGroup: "FIFO",
    localItemClassification: "Class A",
    purchaseUnit: "PCS",
    saleUnit: "PCS",
    inventoryUnit: "PCS",
    packingGroup: "Bulk",
    bagItem: "No",
    itemGroup: "SPP",
    latestCostPrice: "Yes",
    productionType: "None",
    bomUnit: "Blank",
  },
  {
    id: 2,
    itemNumber: "SP002",
    productName: "Motor Coupling",
    productNumber: "FE400002",
    businessSector: "Aqua",
    itemType: "Unknown",
    classType: "Spare Part",
    company: "DHBH",
    status: "Active",
    searchName: "Motor Coupling",
    productType: "Item",
    productSubtype: "Product",
    syncToDHC: "No",
    storageDimensionGroup: "SWFL",
    trackingDimensionGroup: "None",
    itemModelGroup: "Standard",
    localItemClassification: "Class B",
    purchaseUnit: "PCS",
    saleUnit: "PCS",
    inventoryUnit: "PCS",
    packingGroup: "Bulk",
    bagItem: "No",
    itemGroup: "SPP",
    latestCostPrice: "Yes",
    productionType: "None",
    bomUnit: "Blank",
  },
  {
    id: 3,
    itemNumber: "SP003",
    productName: "Filter Element",
    productNumber: "FE400003",
    businessSector: "Pharma",
    itemType: "Unknown",
    classType: "Spare Part",
    company: "DHHP",
    status: "Active",
    searchName: "Filter Element",
    productType: "Item",
    productSubtype: "Product",
    syncToDHC: "No",
    storageDimensionGroup: "SWFL",
    trackingDimensionGroup: "None",
    itemModelGroup: "Weighted Average",
    localItemClassification: "Class C",
    purchaseUnit: "PCS",
    saleUnit: "PCS",
    inventoryUnit: "PCS",
    packingGroup: "Bulk",
    bagItem: "Yes",
    itemGroup: "SPP",
    latestCostPrice: "Yes",
    productionType: "None",
    bomUnit: "Blank",
  },
];

// Sample spare parts requests data
const SPARE_PARTS_REQUESTS = [
  {
    id: "REQ-20250724-002",
    requestType: "Edit",
    requestTitle: "Update Mixer Gear – Line A",
    stepOwner: "Jame - Credit Supervisor",
    currentSteps: "Completed",
    status: "Synced",
    createdDate: "2025-07-24T10:30:00Z",
  },
  {
    id: "REQ-20250724-006",
    requestType: "Create",
    requestTitle: "Add New Conveyor Belt",
    stepOwner: "Linh - Technical Lead",
    currentSteps: "Waiting for QA",
    status: "Pending",
    createdDate: "2025-07-25T11:15:00Z",
  },
  {
    id: "REQ-20250724-007",
    requestType: "Create",
    requestTitle: "New Hydraulic Pump",
    stepOwner: "You",
    currentSteps: "Waiting for Entry",
    status: "Draft",
    createdDate: "2025-07-29T09:00:00Z",
  },
];

// Sample approval tree data for spare parts
const SPARE_PARTS_APPROVAL_TREES = {
  "REQ-20250724-002": {
    requestId: "REQ-20250724-002",
    approvalTree: [
      {
        stepName: "Technical Review",
        owners: [
          {
            name: "Tony",
            title: "Technical Lead",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-24T10:35:00Z",
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
  "REQ-20250724-006": {
    requestId: "REQ-20250724-006",
    approvalTree: [
      {
        stepName: "Specification Review",
        owners: [
          {
            name: "Linh",
            title: "Technical Lead",
            avatarUrl: null,
            status: "Approved",
            approvedAt: "2025-07-25T11:20:00Z",
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
};

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  { value: "Synced", label: "Synced" },
];

const SparePartsRequestList = ({
  onBack,
  hideHeader = false,
  onShowDetail,
}) => {
  const [requests, setRequests] = useState(SPARE_PARTS_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showApprovalSlider, setShowApprovalSlider] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [partSearchTerm, setPartSearchTerm] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState(null);
  const [showObjectSelectModal, setShowObjectSelectModal] = useState(false);
  const [showBulkCreatePage, setShowBulkCreatePage] = useState(false);
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
    // Close the modal first
    setShowAddModal(false);

    if (requestType === "MassCreate") {
      // For Mass Create, show mass create page
      setSelectedRequestType("MassCreate");
      setShowBulkCreatePage(true);

      // Also trigger onShowDetail if provided (for parent component)
      if (onShowDetail) {
        onShowDetail(
          <SparePartsBulkCreatePage
            mode="create"
            onBack={() => {
              setShowBulkCreatePage(false);
              setSelectedRequestType(null);
              onShowDetail(null);
            }}
            onSendBulkRequest={(massRequest) => {
              handleSendMassRequest(massRequest);
              onShowDetail(null);
            }}
          />
        );
      }
    } else if (requestType === "MassEdit") {
      // For Mass Edit, show mass edit page
      setSelectedRequestType("MassEdit");
      setShowBulkCreatePage(true);
      // Also trigger onShowDetail if provided (for parent component)
      if (onShowDetail) {
        console.log("🔍 Parent component mode - Mass Edit, mode='edit'");
        onShowDetail(
          <SparePartsBulkCreatePage
            mode="edit"
            onBack={() => {
              setShowBulkCreatePage(false);
              setSelectedRequestType(null);
              onShowDetail(null);
            }}
            onSendBulkRequest={(massRequest) => {
              handleSendMassRequest(massRequest);
              onShowDetail(null);
            }}
          />
        );
      }
    } else if (requestType === "Create") {
      // For Create New Record, create new request and go to detail form
      const newRequest = {
        id: `REQ-${Date.now()}`,
        requestType: "Create",
        requestTitle: "New Spare Part Record",
        stepOwner: "You - Technical Lead",
        currentSteps: "Waiting for Entry",
        status: "Draft",
        createdDate: new Date().toISOString(),
        isNew: true, // Flag to indicate this is a new request
        approvalTree: [
          {
            stepName: "Waiting for Entry",
            owners: [
              { name: "You", role: "Technical Lead", status: "current" },
            ],
            status: "current",
          },
          {
            stepName: "Technical Review",
            owners: [
              { name: "Mike", role: "Senior Engineer", status: "pending" },
            ],
            status: "pending",
          },
          {
            stepName: "Final Approval",
            owners: [
              { name: "Sarah", role: "Operations Manager", status: "pending" },
            ],
            status: "pending",
          },
        ],
      };

      // Add to requests list
      setRequests((prev) => [newRequest, ...prev]);

      // Always show detail form immediately
      if (onShowDetail) {
        // Parent component mode - pass detail component to parent
        onShowDetail(
          <SparePartsDetailForm
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
      } else {
        // Local mode - show detail form locally
        setSelectedRequestData(newRequest);
        setShowDetailForm(true);
      }
    } else {
      // For other types, show search modal to find existing records
      setShowSearchModal(true);
      setPartSearchTerm("");
      setSearchResults([]);
      setSelectedPart(null);
    }
  };

  const handleSearch = (term) => {
    setPartSearchTerm(term);
    if (term.trim()) {
      const results = EXISTING_SPARE_PARTS.filter(
        (part) =>
          (part.name && part.name.toLowerCase().includes(term.toLowerCase())) ||
          (part.code && part.code.toLowerCase().includes(term.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectPart = (part) => {
    // Just set the selected part, don't create request yet
    setSelectedPart(part);
  };

  const handleSendMassRequest = (massRequest) => {
    // Add mass request to requests list
    setRequests((prev) => [massRequest, ...prev]);

    // Close mass create page
    setShowBulkCreatePage(false);
    setSelectedRequestType(null);

    // Show success message or redirect
    console.log("Mass request created:", massRequest);
  };

  const handleSelectExistingSparePart = (selectedSparePart) => {
    const requestData = {
      ...selectedSparePart,
      id: selectedRequestType === "Copy" ? "SP-COPY" : "SP-EDIT",
      requestType: selectedRequestType,
      requestTitle: `${selectedRequestType} Spare Part - ${selectedSparePart.productName}`,
      stepOwner: "You - Maintenance Admin",
      currentSteps: "Waiting for Entry",
      status: "Draft",
      createdDate: new Date().toISOString(),
      isNew: false,
      isCopy: selectedRequestType === "Copy",
    };

    if (onShowDetail) {
      onShowDetail(
        <SparePartsDetailForm
          requestData={requestData}
          onBack={() => onShowDetail(null)}
          onSave={(savedData) => {
            // Add request to list
            const newRequest = {
              ...savedData,
              id: `SP-REQ-${Date.now()}`,
              createdDate: new Date().toISOString(),
            };
            setRequests((prev) => [newRequest, ...prev]);
            onShowDetail(null);
          }}
        />
      );
    }

    setShowObjectSelectModal(false);
    setSelectedRequestType(null);
  };

  const handleSendRequest = () => {
    if (!selectedPart) return;

    // Create request for selected part
    const newRequest = {
      id: `REQ-${Date.now()}`,
      requestType: selectedRequestType,
      requestTitle: `${selectedRequestType} Spare Part - ${selectedPart.name}`,
      stepOwner: "You - Technical Lead",
      currentSteps: "Waiting for Approval",
      status: "Pending",
      createdDate: new Date().toISOString(),
      partId: selectedPart.id,
      partData: selectedPart,
      approvalTree: [
        {
          stepName: "Review Request",
          owners: [
            { name: "Mike", role: "Senior Engineer", status: "current" },
          ],
          status: "current",
        },
        {
          stepName: "Final Approval",
          owners: [
            { name: "Sarah", role: "Operations Manager", status: "pending" },
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
    setSelectedPart(null);
    setPartSearchTerm("");
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
    console.log("handleRowClick - request data:", request);
    const approvalData = SPARE_PARTS_APPROVAL_TREES[request.id];
    if (approvalData) {
      // Combine request data with approval data
      const combinedData = {
        ...approvalData,
        ...request,
      };
      console.log("handleRowClick - combinedData:", combinedData);
      setSelectedRequestData(combinedData);
      setShowApprovalSlider(true);
    } else {
      // If no approval tree data, still allow viewing detail form
      console.log("handleRowClick - no approval data, using request:", request);
      setSelectedRequestData(request);
      if (onShowDetail) {
        // Direct mode - pass detail component to parent
        onShowDetail(
          <SparePartsDetailForm
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
    console.log("handleViewDetail - selectedRequestData:", selectedRequestData);
    setShowApprovalSlider(false);
    if (onShowDetail) {
      // Direct mode - pass detail component to parent
      onShowDetail(
        <SparePartsDetailForm
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
      <SparePartsDetailForm
        requestData={selectedRequestData}
        onBack={handleBackFromDetail}
      />
    );
  }

  // If showing bulk create page locally (cards mode)
  if (showBulkCreatePage && !onShowDetail) {
    // Cards mode - show mass create/edit page locally
    console.log("🔍 Cards mode - selectedRequestType:", selectedRequestType);
    const mode = selectedRequestType === "MassEdit" ? "edit" : "create";
    console.log("🔍 Cards mode - calculated mode:", mode);
    return (
      <SparePartsBulkCreatePage
        mode={mode}
        onBack={() => {
          setShowBulkCreatePage(false);
          setSelectedRequestType(null);
        }}
        onSendBulkRequest={handleSendMassRequest}
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
                Spare Parts Requests
              </Text>
              <Text variant="body" color="muted">
                Manage spare parts inventory and procurement requests
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
        title={`Search Spare Part for ${selectedRequestType} Request`}
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            Enter part code or search name to find existing records:
          </Text>

          {/* Search Input */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Enter part code or search name..."
              value={partSearchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Part */}
          {selectedPart && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Text
                variant="body"
                weight="medium"
                className="text-blue-800 mb-2"
              >
                Selected Spare Part:
              </Text>
              <div className="flex justify-between items-start">
                <div>
                  <Text variant="body" weight="medium">
                    {selectedPart.name}
                  </Text>
                  <Text variant="caption" color="muted">
                    Code: {selectedPart.code} • Category:{" "}
                    {selectedPart.category}
                  </Text>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    selectedPart.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {selectedPart.status}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPart(null)}
                className="mt-2"
              >
                Change Selection
              </Button>
            </div>
          )}

          {/* Search Results */}
          {!selectedPart && searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              <Text variant="body" weight="medium" className="text-sm">
                Found {searchResults.length} spare part(s):
              </Text>
              {searchResults.map((part) => (
                <div
                  key={part.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectPart(part)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text variant="body" weight="medium">
                        {part.name}
                      </Text>
                      <Text variant="caption" color="muted">
                        Code: {part.code} • Category: {part.category}
                      </Text>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        part.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {part.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {partSearchTerm && searchResults.length === 0 && (
            <div className="text-center py-8">
              <Text variant="body" color="muted">
                No spare parts found matching "{partSearchTerm}"
              </Text>
            </div>
          )}

          {/* Instructions */}
          {!partSearchTerm && !selectedPart && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <Text variant="body" className="text-blue-800 text-sm">
                Start typing to search for existing spare parts. You can search
                by part name or code. After selecting a part, click "Send
                Request" to submit.
              </Text>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setShowSearchModal(false)}>
              Cancel
            </Button>
            {selectedPart && (
              <Button variant="primary" onClick={handleSendRequest}>
                Send Request
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Object Select Modal for Copy/Edit */}
      <ObjectSelectModal
        isOpen={showObjectSelectModal}
        onClose={() => setShowObjectSelectModal(false)}
        title={`Select Spare Part to ${selectedRequestType}`}
        data={EXISTING_SPARE_PARTS}
        columns={[
          { key: "itemNumber", label: "Item Number" },
          { key: "productName", label: "Product Name" },
          { key: "productNumber", label: "Product Number" },
          { key: "businessSector", label: "Business Sector" },
          { key: "company", label: "Company" },
        ]}
        searchFields={[
          "itemNumber",
          "productName",
          "productNumber",
          "businessSector",
          "company",
        ]}
        onSelect={handleSelectExistingSparePart}
        searchPlaceholder="Search spare parts..."
      />

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

export default SparePartsRequestList;
