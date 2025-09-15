import { useState, useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Modal from "../../atoms/Modal";
import Select from "../../atoms/Select";
import Checkbox from "../../atoms/Checkbox";
import ColumnVisibilityFilter from "../../atoms/ColumnVisibilityFilter";
import {
  Search as SearchIcon,
  ArrowLeft,
  Loader2,
  Plus,
  Filter,
  X,
} from "lucide-react";
import CustomerDetail from "./CustomerDetail";

// Sample customer records data with legal entities
const ALL_CUSTOMER_RECORDS = [
  // DHV Legal Entity
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
    legalEntity: "DHV",
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
    legalEntity: "DHV",
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
    legalEntity: "DHV",
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
    legalEntity: "DHV",
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
    legalEntity: "DHV",
  },
  // PBH Legal Entity
  {
    customerAccount: "PB200001",
    customerName: "Global Trading Co.",
    classification: "External",
    group: "LOC_EXT",
    type: "Company",
    mainCustomer: "PB001234M",
    city: "Jakarta",
    currency: "IDR",
    segment: "Trading - Indonesia",
    emailAddress: "contact@globaltrading.id",
    legalEntity: "PBH",
  },
  {
    customerAccount: "PB200002",
    customerName: "Tech Solutions Ltd.",
    classification: "Dealer",
    group: "AQTP",
    type: "Company",
    mainCustomer: "PB005678M",
    city: "Surabaya",
    currency: "IDR",
    segment: "Technology - Indonesia",
    emailAddress: "info@techsolutions.id",
    legalEntity: "PBH",
  },
  // PHP Legal Entity
  {
    customerAccount: "PH300001",
    customerName: "Manufacturing Corp.",
    classification: "External",
    group: "LSTP",
    type: "Company",
    mainCustomer: "PH001234M",
    city: "Bandung",
    currency: "IDR",
    segment: "Manufacturing - Indonesia",
    emailAddress: "sales@manufacturing.id",
    legalEntity: "PHP",
  },
  {
    customerAccount: "PH300002",
    customerName: "Export Import Co.",
    classification: "Dealer",
    group: "LOC_EXT",
    type: "Company",
    mainCustomer: "PH005678M",
    city: "Jakarta",
    currency: "USD",
    segment: "Import Export - Indonesia",
    emailAddress: "trade@exportimport.id",
    legalEntity: "PHP",
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
  // New advanced search states
  const [selectedLegalEntity, setSelectedLegalEntity] = useState("");
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [sidebarFilters, setSidebarFilters] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Legacy states (keeping for compatibility)
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

  // Add New Request state
  const [showAddModal, setShowAddModal] = useState(false);

  // Default visible columns (first 6 columns)
  const [visibleColumns, setVisibleColumns] = useState([
    "customerAccount",
    "customerName",
    "classification",
    "group",
    "type",
    "mainCustomer",
  ]);

  // State for each column filter
  const [columnFilters, setColumnFilters] = useState({});

  // Legal entities
  const legalEntities = [
    { value: "DHV", label: "DHV" },
    { value: "PBH", label: "PBH" },
    { value: "PHP", label: "PHP" },
  ];

  // Advanced search functions
  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1500));

    applyFilters();
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...ALL_CUSTOMER_RECORDS];

    // Filter by legal entity
    if (selectedLegalEntity) {
      filtered = filtered.filter(
        (item) => item.legalEntity === selectedLegalEntity
      );
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (filterValue.trim()) {
        filtered = filtered.filter((item) =>
          item[column]
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        );
      }
    });

    // Apply sidebar filters
    sidebarFilters.forEach((filter) => {
      if (filter.value.trim()) {
        filtered = filtered.filter((item) =>
          item[filter.field]
            ?.toString()
            .toLowerCase()
            .includes(filter.value.toLowerCase())
        );
      }
    });

    setFilteredData(filtered);
  };

  const handleColumnFilterChange = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));

    // Auto-apply column filters (keep this for column filters)
    if (hasSearched) {
      setTimeout(() => applyFilters(), 300); // Debounce
    }
  };

  const addSidebarFilter = () => {
    setSidebarFilters((prev) => [
      ...prev,
      { field: "", value: "", id: Date.now() },
    ]);
  };

  const updateSidebarFilter = (id, field, value) => {
    setSidebarFilters((prev) =>
      prev.map((filter) =>
        filter.id === id ? { ...filter, [field]: value } : filter
      )
    );

    // Remove auto-apply for sidebar filters - only apply when clicking Apply button
  };

  const removeSidebarFilter = (id) => {
    setSidebarFilters((prev) => prev.filter((filter) => filter.id !== id));

    // Remove auto-apply for sidebar filters - only apply when clicking Apply button
  };

  const handleSelectItem = (item) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some(
        (selected) => selected.customerAccount === item.customerAccount
      );
      if (isSelected) {
        return prev.filter(
          (selected) => selected.customerAccount !== item.customerAccount
        );
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSelectAll = () => {
    // Get currently visible items that are selected
    const visibleSelectedItems = selectedItems.filter((selectedItem) =>
      filteredData.some(
        (filteredItem) =>
          filteredItem.customerAccount === selectedItem.customerAccount
      )
    );

    // Get items from other legal entities (not currently visible)
    const otherLegalEntityItems = selectedItems.filter(
      (selectedItem) =>
        !filteredData.some(
          (filteredItem) =>
            filteredItem.customerAccount === selectedItem.customerAccount
        )
    );

    if (visibleSelectedItems.length === filteredData.length) {
      // Unselect all visible items, keep items from other legal entities
      setSelectedItems(otherLegalEntityItems);
    } else {
      // Select all visible items, plus keep items from other legal entities
      const newSelectedItems = [...otherLegalEntityItems, ...filteredData];
      // Remove duplicates based on customerAccount
      const uniqueItems = newSelectedItems.filter(
        (item, index, self) =>
          index ===
          self.findIndex((t) => t.customerAccount === item.customerAccount)
      );
      setSelectedItems(uniqueItems);
    }
  };

  // Legacy filter for compatibility (will be replaced by new logic)
  const filteredRecords = hasSearched ? filteredData : [];

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

  // Add New Request functionality - Only Create and Mass Create for main search page
  const REQUEST_TYPES = [
    { value: "Create", label: "Create New Record" },
    { value: "MassCreate", label: "Mass Create Records" },
    { value: "MassEdit", label: "Mass Edit Records" },
  ];

  const handleAddRequest = (requestType) => {
    setShowAddModal(false);

    // Show warning modal instead of navigating to request creation
    alert("No suitable workflow available to perform this action.");
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

      {/* Advanced Search Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex gap-4 items-end mb-4 justify-between">
          <div className="flex gap-4 items-end">
            {/* Legal Entity Select */}
            <div className="max-w-52 w-full">
              <Text variant="body" weight="medium" className="mb-2">
                Legal Entity
              </Text>
              <Select
                value={selectedLegalEntity}
                onChange={setSelectedLegalEntity}
                options={legalEntities}
                placeholder="Select Legal Entity"
              />
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilterSidebar(!showFilterSidebar)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filter
            </Button>

            {/* Column Visibility */}
            <ColumnVisibilityFilter
              columns={ALL_CUSTOMER_COLUMNS}
              visibleColumns={visibleColumns}
              onVisibilityChange={setVisibleColumns}
              buttonText="Columns"
            />

            {/* Search Button */}
            <Button
              variant="primary"
              onClick={handleSearch}
              disabled={isLoading}
              className="flex items-center gap-2 py-[10px]"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <SearchIcon size={16} />
              )}
              Search
            </Button>
          </div>
          <div className="flex gap-4 items-end">
            {/* Add New Request */}
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 whitespace-nowrap py-[10px]"
            >
              <Plus size={16} />
              Add New Request
            </Button>
          </div>
        </div>

        {/* Selected Items Counter */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <Text variant="body" color="muted">
              {selectedItems.length} item(s) selected from multiple legal
              entities
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedItems([])}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div className="flex">
        {/* Results Table */}
        <div
          className={` bg-white rounded-lg border border-gray-200 overflow-hidden ${
            showFilterSidebar ? "flex-1 mr-6 overflow-x-scroll" : "w-full"
          }`}
        >
          {!hasSearched ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <SearchIcon size={48} className="mx-auto mb-4 text-gray-300" />
                <Text variant="body" size="lg">
                  Select filters and click Search to view data
                </Text>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2
                  size={48}
                  className="mx-auto mb-4 animate-spin text-blue-500"
                />
                <Text variant="body" size="lg">
                  Loading data...
                </Text>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto max-w-full">
              <table
                className="w-full table-auto"
                style={{
                  minWidth: `${Math.max(
                    800,
                    visibleColumnDefs.filter((col) =>
                      visibleColumns.includes(col.key)
                    ).length * 150
                  )}px`,
                }}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <Checkbox
                        checked={(() => {
                          const visibleSelectedItems = selectedItems.filter(
                            (selectedItem) =>
                              filteredData.some(
                                (filteredItem) =>
                                  filteredItem.customerAccount ===
                                  selectedItem.customerAccount
                              )
                          );
                          return (
                            visibleSelectedItems.length ===
                              filteredData.length && filteredData.length > 0
                          );
                        })()}
                        indeterminate={(() => {
                          const visibleSelectedItems = selectedItems.filter(
                            (selectedItem) =>
                              filteredData.some(
                                (filteredItem) =>
                                  filteredItem.customerAccount ===
                                  selectedItem.customerAccount
                              )
                          );
                          return (
                            visibleSelectedItems.length > 0 &&
                            visibleSelectedItems.length < filteredData.length
                          );
                        })()}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {visibleColumnDefs
                      .filter((column) => visibleColumns.includes(column.key))
                      .map((column) => (
                        <th
                          key={column.key}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          <div className="space-y-2">
                            <div>{column.label}</div>
                            <Input
                              value={columnFilters[column.key] || ""}
                              onChange={(e) =>
                                handleColumnFilterChange(
                                  column.key,
                                  e.target.value
                                )
                              }
                              placeholder={`Filter ${column.label}`}
                              size="small"
                              className="text-xs"
                            />
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={visibleColumnDefs.length + 1}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <SearchIcon
                          size={48}
                          className="mx-auto mb-4 text-gray-300"
                        />
                        <Text variant="body" size="lg">
                          No data found with current filters
                        </Text>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((record, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Checkbox
                            checked={selectedItems.some(
                              (item) =>
                                item.customerAccount === record.customerAccount
                            )}
                            onChange={() => handleSelectItem(record)}
                          />
                        </td>
                        {visibleColumnDefs
                          .filter((column) =>
                            visibleColumns.includes(column.key)
                          )
                          .map((column) => (
                            <td
                              key={column.key}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
                              onClick={() => handleCustomerClick(record)}
                            >
                              {renderCellContent(record, column.key)}
                            </td>
                          ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Filter Sidebar */}
        {showFilterSidebar && (
          <div className="w-96 bg-white rounded-lg border border-gray-200">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Text variant="heading" size="md" weight="semibold">
                  Advanced Filters
                </Text>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSidebarFilter}
                    className="flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilterSidebar(false)}
                    className="flex items-center gap-1"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 max-h-96 overflow-y-auto p-4">
                <div className="space-y-4">
                  {sidebarFilters.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Filter
                        size={48}
                        className="mx-auto mb-4 text-gray-300"
                      />
                      <Text variant="body" color="muted">
                        No filters added yet
                      </Text>
                      <Text
                        variant="body"
                        color="muted"
                        className="text-sm mt-1"
                      >
                        Click "Add Filter" to create your first filter
                      </Text>
                    </div>
                  ) : (
                    sidebarFilters.map((filter) => (
                      <div
                        key={filter.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        <div className="space-y-3">
                          <div>
                            <Text
                              variant="body"
                              weight="medium"
                              className="mb-2 text-sm"
                            >
                              Field
                            </Text>
                            <Select
                              value={filter.field}
                              onChange={(value) =>
                                updateSidebarFilter(filter.id, "field", value)
                              }
                              options={ALL_CUSTOMER_COLUMNS.map((col) => ({
                                value: col.key,
                                label: col.label,
                              }))}
                              placeholder="Select Field"
                              size="small"
                            />
                          </div>
                          <div>
                            <Text
                              variant="body"
                              weight="medium"
                              className="mb-2 text-sm"
                            >
                              Value (contains)
                            </Text>
                            <Input
                              value={filter.value}
                              onChange={(e) =>
                                updateSidebarFilter(
                                  filter.id,
                                  "value",
                                  e.target.value
                                )
                              }
                              placeholder="Enter filter value"
                              size="small"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSidebarFilter(filter.id)}
                            className="w-full text-red-600 hover:text-red-700 hover:border-red-300 flex items-center justify-center gap-2"
                          >
                            <X size={14} />
                            Remove Filter
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (hasSearched) {
                        applyFilters();
                      }
                    }}
                    disabled={!hasSearched}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSidebarFilters([]);
                      if (hasSearched) {
                        applyFilters();
                      }
                    }}
                    size="sm"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {hasSearched && (
        <div className="bg-gray-50 rounded-lg p-4">
          <Text variant="body" color="muted" className="text-sm">
            Showing {filteredData.length} of {ALL_CUSTOMER_RECORDS.length}{" "}
            customer records
            {selectedItems.length > 0 && (
              <span className="ml-2 text-blue-600 font-medium">
                • {selectedItems.length} selected
              </span>
            )}
          </Text>
        </div>
      )}

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

      {/* Add New Request Modal */}
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
    </div>
  );
};

export default CustomerSearchResults;
