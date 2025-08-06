import { useState, useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import ColumnVisibilityFilter from "../../atoms/ColumnVisibilityFilter";
import { Search as SearchIcon, ArrowLeft, Loader2 } from "lucide-react";
import CustomerDetail from "./CustomerDetail";

// Sample customer records data
const CUSTOMER_RECORDS = [
  {
    customerAccount: "FE016977",
    customerName: "Trần Mạnh Hiệp",
    classification: "Dealer",
    group: "LOC_EXT",
    type: "Person",
    mainCustomer: "FE016977M",
    city: "T. Thái Nguyên",
    currency: "VND",
    segment: "Feed - Miền Bắc",
    emailAddress: "hieptm@gmail.com",
  },
  {
    customerAccount: "FE017112",
    customerName: "Lê Thị Hồng",
    classification: "Reseller",
    group: "LOC_INT",
    type: "Company",
    mainCustomer: "FE017112",
    city: "TP. HCM",
    currency: "USD",
    segment: "Feed - Miền Trung",
    emailAddress: "hong.le@reseller.com",
  },
  {
    customerAccount: "FE016580",
    customerName: "Nguyễn Văn Dũng",
    classification: "Dealer",
    group: "LOC_EXT",
    type: "Person",
    mainCustomer: "FE016580M",
    city: "Hà Nội",
    currency: "VND",
    segment: "Feed - Miền Nam",
    emailAddress: "dungnv@dealer.vn",
  },
  {
    customerAccount: "FE017215",
    customerName: "Đặng Văn Nam",
    classification: "Dealer",
    group: "LOC_EXT",
    type: "Person",
    mainCustomer: "FE017215M",
    city: "Hải Dương",
    currency: "VND",
    segment: "Feed - Miền Bắc",
    emailAddress: "namdv@dealer.vn",
  },
  {
    customerAccount: "FE017350",
    customerName: "Công ty Minh Long",
    classification: "Retailer",
    group: "LOC_INT",
    type: "Company",
    mainCustomer: "FE017350",
    city: "Đà Nẵng",
    currency: "USD",
    segment: "Feed - Miền Trung",
    emailAddress: "info@minhlong.com",
  },
];

// Define all available columns for customers
const ALL_CUSTOMER_COLUMNS = [
  {
    key: "customerAccount",
    label: "Customer Account",
    description: "Customer account number",
  },
  {
    key: "customerName",
    label: "Customer Name",
    description: "Full customer name",
  },
  {
    key: "classification",
    label: "Classification",
    description: "Customer classification",
  },
  { key: "group", label: "Group", description: "Customer group" },
  { key: "type", label: "Type", description: "Customer type" },
  {
    key: "mainCustomer",
    label: "Main Customer",
    description: "Main customer reference",
  },
  { key: "city", label: "City", description: "Customer city" },
  { key: "currency", label: "Currency", description: "Customer currency" },
  { key: "segment", label: "Segment", description: "Customer segment" },
  {
    key: "emailAddress",
    label: "Email Address",
    description: "Customer email",
  },
];

const CustomerSearchResults = ({ onBack, country }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchWithDynamic365, setSearchWithDynamic365] = useState(false);
  const [showDynamic365Modal, setShowDynamic365Modal] = useState(false);
  const [showDynamic365SearchModal, setShowDynamic365SearchModal] =
    useState(false);
  const [dynamic365SearchTerm, setDynamic365SearchTerm] = useState("");
  const [isSearchingDynamic365, setIsSearchingDynamic365] = useState(false);
  const [dynamic365SearchCompleted, setDynamic365SearchCompleted] =
    useState(false);

  // Customer detail page state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);

  // Default visible columns (first 6 columns)
  const [visibleColumns, setVisibleColumns] = useState([
    "customerAccount",
    "customerName",
    "classification",
    "group",
    "type",
    "mainCustomer",
  ]);

  // Toggle filter row
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  // State for each column filter
  const [columnFilters, setColumnFilters] = useState({});

  // Filter records based on search term and column filters
  const filteredRecords = CUSTOMER_RECORDS.filter((record) => {
    // Search term filter (giữ nguyên)
    const matchesSearch =
      record.customerAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.classification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.emailAddress.toLowerCase().includes(searchTerm.toLowerCase());

    // Column filters
    const matchesColumnFilters = visibleColumns.every((colKey) => {
      const filterValue = columnFilters[colKey] || "";
      if (!filterValue) return true;
      return String(record[colKey])
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });

    return matchesSearch && matchesColumnFilters;
  });

  // Get visible column definitions
  const visibleColumnDefs = ALL_CUSTOMER_COLUMNS.filter((col) =>
    visibleColumns.includes(col.key)
  );

  // Function to render cell content based on column type
  const renderCellContent = (record, columnKey) => {
    const value = record[columnKey];

    switch (columnKey) {
      case "customerAccount":
        return (
          <Text variant="body" weight="medium" className="font-mono text-sm">
            {value}
          </Text>
        );
      case "customerName":
        return (
          <Text variant="body" weight="medium">
            {value}
          </Text>
        );
      case "classification":
        return <span className={getClassificationBadge(value)}>{value}</span>;
      case "type":
        return <span className={getTypeBadge(value)}>{value}</span>;
      case "emailAddress":
        return (
          <Text variant="body" className="text-sm">
            {value}
          </Text>
        );
      default:
        return (
          <Text variant="body" className="text-sm">
            {value}
          </Text>
        );
    }
  };

  // Check if search has no results and should show Dynamic 365 modal
  const shouldShowDynamic365Suggestion =
    searchTerm.length > 0 && filteredRecords.length === 0;

  // Handle customer row click
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetail(true);
  };

  const handleCloseCustomerDetail = () => {
    setShowCustomerDetail(false);
    setSelectedCustomer(null);
  };

  const handleToggleDynamic365 = () => {
    setSearchWithDynamic365(!searchWithDynamic365);
    console.log("Search with Dynamic 365:", !searchWithDynamic365);
    // Handle Dynamic 365 search integration
  };

  const handleSearchDynamic365 = () => {
    setShowDynamic365Modal(false);
    setDynamic365SearchTerm(searchTerm);
    setShowDynamic365SearchModal(true);
    setIsSearchingDynamic365(true);
    setDynamic365SearchCompleted(false);

    // Simulate search with 2 second delay
    setTimeout(() => {
      setIsSearchingDynamic365(false);
      setDynamic365SearchCompleted(true);
    }, 2000);
  };

  const handleCloseDynamic365SearchModal = () => {
    setShowDynamic365SearchModal(false);
    setDynamic365SearchCompleted(false);
    setIsSearchingDynamic365(false);
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

  // Show customer detail page if selected
  if (showCustomerDetail && selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={handleCloseCustomerDetail}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <Text variant="heading" size="xl" weight="bold" className="mb-2">
            Master Data Records - Customer - {country?.name}
          </Text>
          <Text variant="body" color="muted">
            Search and view customer information
          </Text>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative max-w-md">
            <SearchIcon
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search customers..."
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
        <ColumnVisibilityFilter
          columns={ALL_CUSTOMER_COLUMNS}
          visibleColumns={visibleColumns}
          onVisibilityChange={setVisibleColumns}
          buttonText="Columns"
        />
      </div>

      {/* Results Table */}
      <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div
            className={`min-w-[${Math.max(
              800,
              visibleColumnDefs.length * 150
            )}px]`}
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  {visibleColumnDefs.map((column) => (
                    <Table.HeaderCell key={column.key}>
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
                {filteredRecords.map((record, index) => (
                  <Table.Row
                    key={index}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleCustomerClick(record)}
                  >
                    {visibleColumnDefs.map((column) => (
                      <Table.Cell key={column.key}>
                        {renderCellContent(record, column.key)}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

      {/* No results */}
      {filteredRecords.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Text variant="body" color="muted" className="mb-4">
            No customer records found matching "{searchTerm}"
          </Text>
          <Button
            variant="outline"
            onClick={() => setShowDynamic365Modal(true)}
            className="mt-2"
          >
            Search on Dynamic 365
          </Button>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredRecords.length} of {CUSTOMER_RECORDS.length} customer
          records
        </Text>
      </div>

      {/* Dynamic 365 Confirmation Modal */}
      <Modal
        isOpen={showDynamic365Modal}
        onClose={() => setShowDynamic365Modal(false)}
        title="Search on Dynamic 365"
      >
        <div className="space-y-4">
          <Text variant="body">
            No results found in local database. Do you want to search for "
            {searchTerm}" on Dynamic 365?
          </Text>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDynamic365Modal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSearchDynamic365}>
              Yes, Search Dynamic 365
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dynamic 365 Search Modal */}
      <Modal
        isOpen={showDynamic365SearchModal}
        onClose={handleCloseDynamic365SearchModal}
        title="Dynamic 365 Search"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SearchIcon size={20} className="text-gray-400" />
            <Input
              value={dynamic365SearchTerm}
              onChange={(e) => setDynamic365SearchTerm(e.target.value)}
              placeholder="Search on Dynamic 365..."
              disabled={isSearchingDynamic365}
              className="flex-1"
            />
          </div>

          {isSearchingDynamic365 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-blue-600 mr-2" />
              <Text variant="body" color="muted">
                Searching Dynamic 365...
              </Text>
            </div>
          )}

          {dynamic365SearchCompleted && !isSearchingDynamic365 && (
            <div className="text-center py-8">
              <Text variant="body" color="muted" className="mb-4">
                No data found on Dynamic 365 for "{dynamic365SearchTerm}"
              </Text>
              <Button
                variant="outline"
                onClick={handleCloseDynamic365SearchModal}
              >
                Close
              </Button>
            </div>
          )}

          {!isSearchingDynamic365 && !dynamic365SearchCompleted && (
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCloseDynamic365SearchModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsSearchingDynamic365(true);
                  setDynamic365SearchCompleted(false);
                  setTimeout(() => {
                    setIsSearchingDynamic365(false);
                    setDynamic365SearchCompleted(true);
                  }, 2000);
                }}
              >
                Search
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CustomerSearchResults;
