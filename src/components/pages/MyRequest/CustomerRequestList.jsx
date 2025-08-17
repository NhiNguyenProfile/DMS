import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import ColumnVisibilityFilter from "../../atoms/ColumnVisibilityFilter";
import { Search, Plus, ArrowLeft } from "lucide-react";
import ApprovalTreeSlider from "./ApprovalTreeSlider";
import CustomerDetailForm from "./CustomerDetailForm";
import BulkCreatePage from "./BulkCreatePage";
import MassRequestDetailView from "./MassRequestDetailView";

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
  // Mass Create Request
  {
    id: "MASS-REQ-20250724-001",
    requestType: "MassCreate",
    requestTitle: "Mass Create 15 Customers",
    stepOwner: "You - Sale Admin",
    currentSteps: "Waiting for Approval",
    status: "Pending",
    createdDate: "2025-07-24T14:30:00Z",
    totalCount: 15,
    mode: "create",
  },
  // Mass Edit Request
  {
    id: "MASS-REQ-20250723-002",
    requestType: "MassEdit",
    requestTitle: "Mass Edit 8 Customer Records",
    stepOwner: "Mike - Sales Manager",
    currentSteps: "Technical Review",
    status: "In Progress",
    createdDate: "2025-07-23T11:15:00Z",
    totalCount: 8,
    mode: "edit",
  },
  // Another Mass Create Request
  {
    id: "MASS-REQ-20250722-003",
    requestType: "MassCreate",
    requestTitle: "Mass Create 25 New Customers",
    stepOwner: "Sarah - Regional Manager",
    currentSteps: "Final Approval",
    status: "Approved",
    createdDate: "2025-07-22T16:45:00Z",
    totalCount: 25,
    mode: "create",
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

const ALL_REQUEST_TYPES = [
  { value: "Create", label: "Create New Record" },
  { value: "MassCreate", label: "Mass Create Records" },
  { value: "MassEdit", label: "Mass Edit Records" },
  { value: "Copy", label: "Copy Existing Record" },
  { value: "Extend", label: "Extend Existing Record" },
  { value: "Edit", label: "Edit Existing Record" },
  // { value: "Disable", label: "Disable Existing Record" },
  // { value: "Reactivate", label: "Reactivate Existing Record" },
];

// Column definitions for the requests table
const ALL_REQUEST_COLUMNS = [
  { key: "id", label: "Request ID" },
  { key: "requestTitle", label: "Request Title" },
  { key: "requestType", label: "Type" },
  { key: "stepOwner", label: "Step Owner" },
  { key: "currentSteps", label: "Current Steps" },
  { key: "createdDate", label: "Created Date" },
];

// Sample existing customers for search
const EXISTING_CUSTOMERS = [
  {
    id: "CUST-001",
    partyId: "PARTY-001",
    name: "ABC Company Ltd.",
    code: "ABC001",
    type: "Organization",
    status: "Active",
    company: "DHV",
    customerAccount: "FE300001",
    classificationGroup: "External",
    group: "LOC_EXT",
    searchName: "ABC Company Limited",
    // Additional fields for pre-fill
    address: "123 Business Street, Jakarta",
    nikNpwp: "01.234.567.8-901.000",
    city: "Jakarta",
    district: "Central Jakarta",
    street: "123 Business Street",
    country: "IDN",
    countryISO: "ID",
    email: "contact@abc.com",
    phone: "+62-21-1234567",
    currency: "IDR",
    lineOfBusiness: "Farm",
    segment: "Corporate",
    subsegment: "Large Enterprise",
    creditLimit: "1000000000",
    creditManagementGroup: "External",
    priceGroup: "CORP",
    termsOfPayment: "30 Days",
    methodOfPayment: "Bank",
    deliveryTerms: "Franco",
    modeOfDelivery: "Truck",
    salesTaxGroup: "VAT",
    taxExemptNumber: "01.234.567.8-901.000",
  },
  {
    id: "CUST-002",
    partyId: "PARTY-002",
    name: "XYZ Corporation",
    code: "XYZ002",
    type: "Organization",
    status: "Active",
    company: "PBH",
    customerAccount: "FE300002",
    classificationGroup: "Dealer",
    group: "AQTP",
    searchName: "XYZ Corp",
    // Additional fields for pre-fill
    address: "456 Trade Avenue, Surabaya",
    nikNpwp: "02.345.678.9-012.000",
    city: "Surabaya",
    district: "East Surabaya",
    street: "456 Trade Avenue",
    country: "IDN",
    countryISO: "ID",
    email: "info@xyz.com",
    phone: "+62-31-2345678",
    currency: "IDR",
    lineOfBusiness: "POULTRY",
    segment: "Dealer",
    subsegment: "Regional Dealer",
    creditLimit: "500000000",
    creditManagementGroup: "AFF",
    priceGroup: "DEAL",
    termsOfPayment: "90DAI",
    methodOfPayment: "Bank",
    deliveryTerms: "Collect",
    modeOfDelivery: "Ship",
    salesTaxGroup: "PPN OUT EX 11",
    taxExemptNumber: "02.345.678.9-012.000",
  },
  {
    id: "CUST-003",
    partyId: "PARTY-003",
    name: "DEF Industries",
    code: "DEF003",
    type: "Organization",
    status: "Active",
    company: "PHP",
    customerAccount: "FE300003",
    classificationGroup: "Internal",
    group: "LSTP",
    searchName: "DEF Industries Ltd",
    // Additional fields for pre-fill
    address: "789 Industrial Park, Bandung",
    nikNpwp: "03.456.789.0-123.000",
    city: "Bandung",
    district: "West Bandung",
    street: "789 Industrial Park",
    country: "IDN",
    countryISO: "ID",
    email: "contact@def.com",
    phone: "+62-22-3456789",
    currency: "IDR",
    lineOfBusiness: "SHRIMP",
    segment: "Industrial",
    subsegment: "Manufacturing",
    creditLimit: "750000000",
    creditManagementGroup: "Internal",
    priceGroup: "IND",
    termsOfPayment: "Immediate",
    methodOfPayment: "Cash",
    deliveryTerms: "Franco",
    modeOfDelivery: "Air",
    salesTaxGroup: "VAT",
    taxExemptNumber: "03.456.789.0-123.000",
  },
  {
    id: "CUST-004",
    partyId: "PARTY-004",
    name: "GHI Trading Co.",
    code: "GHI004",
    type: "Person",
    status: "Inactive",
    company: "PHY",
    customerAccount: "FE300004",
    classificationGroup: "External",
    group: "LOC_EXT",
    searchName: "GHI Trading",
    // Additional fields for pre-fill
    address: "321 Market Street, Medan",
    nikNpwp: "04.567.890.1-234.000",
    city: "Medan",
    district: "North Medan",
    street: "321 Market Street",
    country: "IDN",
    countryISO: "ID",
    email: "ghi@trading.com",
    phone: "+62-61-4567890",
    currency: "IDR",
    lineOfBusiness: "FISH",
    segment: "SME",
    subsegment: "Small Business",
    creditLimit: "100000000",
    creditManagementGroup: "External",
    priceGroup: "SME",
    termsOfPayment: "30 Days",
    methodOfPayment: "Bank",
    deliveryTerms: "Collect",
    modeOfDelivery: "Truck",
    salesTaxGroup: "VAT",
    taxExemptNumber: "04.567.890.1-234.000",
  },
  {
    id: "CUST-005",
    partyId: "PARTY-005",
    name: "JKL Manufacturing",
    code: "JKL005",
    type: "Organization",
    status: "Active",
    company: "DGC",
    customerAccount: "FE300005",
    classificationGroup: "Dealer",
    group: "AQTP",
    searchName: "JKL Mfg",
    // Additional fields for pre-fill
    address: "654 Factory Road, Semarang",
    nikNpwp: "05.678.901.2-345.000",
    city: "Semarang",
    district: "Central Semarang",
    street: "654 Factory Road",
    country: "IDN",
    countryISO: "ID",
    email: "info@jkl.com",
    phone: "+62-24-5678901",
    currency: "IDR",
    lineOfBusiness: "Farm",
    segment: "Manufacturing",
    subsegment: "Medium Enterprise",
    creditLimit: "300000000",
    creditManagementGroup: "AFF",
    priceGroup: "MFG",
    termsOfPayment: "30 Days",
    methodOfPayment: "Bank",
    deliveryTerms: "Franco",
    modeOfDelivery: "Truck",
    salesTaxGroup: "PPN OUT EX 11",
    taxExemptNumber: "05.678.901.2-345.000",
  },
];

const CustomerRequestList = ({
  onBack,
  hideHeader = false,
  onShowDetail,
  allowedRequestTypes = null,
}) => {
  const [requests, setRequests] = useState(CUSTOMER_REQUESTS);
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

  const [selectedRequestData, setSelectedRequestData] = useState(null);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [showBulkCreatePage, setShowBulkCreatePage] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
  });

  // Column visibility and filtering
  const [visibleColumns, setVisibleColumns] = useState([
    "id",
    "requestTitle",
    "stepOwner",
    "currentSteps",
    "createdDate",
  ]);
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.stepOwner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      (!filters.fromDate ||
        new Date(request.createdDate) >= new Date(filters.fromDate)) &&
      (!filters.toDate ||
        new Date(request.createdDate) <= new Date(filters.toDate));

    // Column filters
    const matchesColumnFilters = visibleColumns.every((colKey) => {
      const filterValue = columnFilters[colKey] || "";
      if (!filterValue) return true;
      return String(request[colKey])
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });

    // Filter by allowed request types (for tab filtering)
    const matchesRequestType = allowedRequestTypes
      ? allowedRequestTypes.includes(request.requestType)
      : true;

    return (
      matchesSearch && matchesDate && matchesColumnFilters && matchesRequestType
    );
  });

  // Get visible column definitions
  const visibleColumnDefs = ALL_REQUEST_COLUMNS.filter((col) =>
    visibleColumns.includes(col.key)
  );

  // Helper function to render cell content
  const renderCellContent = (request, columnKey) => {
    switch (columnKey) {
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
          <Text variant="body" className="text-sm truncate">
            {request.requestType}
          </Text>
        );
      case "stepOwner":
        return (
          <Text variant="body" className="text-sm truncate">
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

  const handleAddRequest = (requestType) => {
    setShowAddModal(false);
    setSelectedRequestType(requestType);

    if (requestType === "MassCreate") {
      // For Mass Create, show mass create page
      setShowBulkCreatePage(true);

      // Also trigger onShowDetail if provided (for parent component)
      if (onShowDetail) {
        onShowDetail(
          <BulkCreatePage
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
      setShowBulkCreatePage(true);

      // Also trigger onShowDetail if provided (for parent component)
      if (onShowDetail) {
        onShowDetail(
          <BulkCreatePage
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
    } else if (requestType === "Copy" || requestType === "Extend") {
      // For Copy and Extend, show search modal to find existing record to copy/extend from
      setShowSearchModal(true);
      setCustomerSearchTerm("");
      setSearchResults([]);
      setSelectedCustomer(null);
    } else {
      // For other types, show search modal to find existing records
      setShowSearchModal(true);
      setCustomerSearchTerm("");
      setSearchResults([]);
      setSelectedCustomer(null);
    }
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

  const handleSearch = (term) => {
    setCustomerSearchTerm(term);
    if (term.trim()) {
      const results = EXISTING_CUSTOMERS.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term.toLowerCase()) ||
          customer.code.toLowerCase().includes(term.toLowerCase()) ||
          customer.partyId.toLowerCase().includes(term.toLowerCase()) ||
          customer.company.toLowerCase().includes(term.toLowerCase()) ||
          customer.customerAccount.toLowerCase().includes(term.toLowerCase()) ||
          customer.classificationGroup
            .toLowerCase()
            .includes(term.toLowerCase()) ||
          customer.group.toLowerCase().includes(term.toLowerCase()) ||
          customer.searchName.toLowerCase().includes(term.toLowerCase())
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

    if (selectedRequestType === "Copy") {
      // For Copy, create new request with copied data and go to detail form
      const newRequest = {
        id: `REQ-${Date.now()}`,
        requestType: "Create", // Copy becomes Create with pre-filled data
        requestTitle: `Copy of Customer - ${selectedCustomer.name}`,
        stepOwner: "You - Sale Admin",
        currentSteps: "Waiting for Entry",
        status: "Draft",
        createdDate: new Date().toISOString(),
        isNew: true,
        isCopy: true, // Flag to indicate this is copied from existing
        sourceCustomerId: selectedCustomer.id,
        sourceCustomerData: selectedCustomer, // Store original data for pre-filling
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

      // Close search modal and reset
      setShowSearchModal(false);
      setSelectedRequestType(null);
      setSelectedCustomer(null);
      setCustomerSearchTerm("");
      setSearchResults([]);

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
    } else if (selectedRequestType === "Extend") {
      // For Extend, create new request with extended data and go to detail form
      const newRequest = {
        id: `REQ-${Date.now()}`,
        requestType: "Create", // Extend becomes Create with pre-filled data
        requestTitle: `Extend Customer - ${selectedCustomer.name}`,
        stepOwner: "You - Sale Admin",
        currentSteps: "Waiting for Entry",
        status: "Draft",
        createdDate: new Date().toISOString(),
        isNew: true,
        isExtend: true, // Flag to indicate this is extended from existing
        sourceCustomerId: selectedCustomer.id,
        sourceCustomerData: selectedCustomer, // Store original data for pre-filling
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

      // Close search modal and reset
      setShowSearchModal(false);
      setSelectedRequestType(null);
      setSelectedCustomer(null);
      setCustomerSearchTerm("");
      setSearchResults([]);

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
    } else if (selectedRequestType === "Edit") {
      // For Edit, create request with full data and go to detail form
      const newRequest = {
        id: `REQ-${Date.now()}`,
        requestType: "Edit",
        requestTitle: `Edit Customer - ${selectedCustomer.name}`,
        stepOwner: "You - Sale Admin",
        currentSteps: "Waiting for Entry",
        status: "Draft",
        createdDate: new Date().toISOString(),
        isEdit: true, // Flag to indicate this is edit request
        sourceCustomerId: selectedCustomer.id,
        sourceCustomerData: selectedCustomer, // Store original data for pre-filling
        approvalTree: [
          {
            stepName: "Waiting for Entry",
            owners: [{ name: "You", role: "Sale Admin", status: "current" }],
            status: "current",
          },
          {
            stepName: "Review Changes",
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

      // Close search modal and reset
      setShowSearchModal(false);
      setSelectedRequestType(null);
      setSelectedCustomer(null);
      setCustomerSearchTerm("");
      setSearchResults([]);

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
      // For other types (Disable, Reactivate), create regular request
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
    }
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    // Filters are already applied in filteredRequests
  };

  const handleResetFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
    });
  };

  const handleRowClick = (request) => {
    // Check if this is a mass request
    const isMassRequest =
      request.requestType === "MassCreate" ||
      request.requestType === "MassEdit";

    if (isMassRequest) {
      // For mass requests, show the mass request detail view
      if (onShowDetail) {
        onShowDetail(
          <MassRequestDetailView
            massRequest={request}
            onBack={() => onShowDetail(null)}
          />
        );
      }
      return;
    }

    // For regular requests, use existing logic
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show bulk create page if selected
  if (showBulkCreatePage) {
    if (onShowDetail) {
      // Direct mode - pass bulk create component to parent
      onShowDetail(
        <BulkCreatePage
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
      return null;
    } else {
      // Cards mode - show mass create/edit page locally
      return (
        <BulkCreatePage
          mode={selectedRequestType === "MassEdit" ? "edit" : "create"}
          onBack={() => {
            setShowBulkCreatePage(false);
            setSelectedRequestType(null);
          }}
          onSendBulkRequest={handleSendMassRequest}
        />
      );
    }
  }

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
            columns={ALL_REQUEST_COLUMNS}
            visibleColumns={visibleColumns}
            onVisibilityChange={setVisibleColumns}
            buttonText="Columns"
          />
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={16} className="mr-2" />
            Add New
          </Button>
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
                    {column.label}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
              {/* Filter row */}
              {showColumnFilters && (
                <Table.Row>
                  {visibleColumnDefs.map((column) => (
                    <Table.HeaderCell key={column.key}>
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
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              )}
            </Table.Header>
            <Table.Body>
              {filteredRequests.map((request) => (
                <Table.Row
                  key={request.id}
                  onClick={() => handleRowClick(request)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  {visibleColumnDefs.map((column) => (
                    <Table.Cell key={column.key}>
                      {renderCellContent(request, column.key)}
                    </Table.Cell>
                  ))}
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

          {/* Search Results Table */}
          {!selectedCustomer && searchResults.length > 0 && (
            <div className="space-y-3">
              <Text variant="body" weight="medium" className="text-sm">
                Found {searchResults.length} customer(s):
              </Text>
              <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Party ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Customer Account
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Customer Classification Group
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Customer Group
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Customer Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Organization Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Search Name
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResults.map((customer) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div
                            className="truncate max-w-xs"
                            title={customer.partyId}
                          >
                            {customer.partyId}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div
                            className="truncate max-w-xs"
                            title={customer.company}
                          >
                            {customer.company}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div
                            className="truncate max-w-xs"
                            title={customer.customerAccount}
                          >
                            {customer.customerAccount || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div
                            className="truncate max-w-xs"
                            title={customer.classificationGroup}
                          >
                            {customer.classificationGroup}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div
                            className="truncate max-w-xs"
                            title={customer.group}
                          >
                            {customer.group}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div
                            className="truncate max-w-xs"
                            title={customer.type}
                          >
                            {customer.type}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div
                            className="truncate max-w-xs"
                            title={customer.name}
                          >
                            {customer.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div
                            className="truncate max-w-xs"
                            title={customer.searchName}
                          >
                            {customer.searchName || customer.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSelectCustomer(customer)}
                          >
                            Select
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                Confirm to continue
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
