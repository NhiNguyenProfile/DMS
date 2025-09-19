import { useState, useEffect } from "react";
import { X, Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import Text from "./Text";
import Select from "./Select";
import Checkbox from "./Checkbox";
import ColumnVisibilityFilter from "./ColumnVisibilityFilter";

const AdvancedObjectSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  title,
  columns,
  allData = [], // All available data
  searchFields,
  legalEntities = [],
  selectedValue,
}) => {
  const [selectedLegalEntity, setSelectedLegalEntity] = useState("");
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [columnFilters, setColumnFilters] = useState({});
  const [sidebarFilters, setSidebarFilters] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.key)
  );

  // Initialize filters for all columns
  const initializeAllFilters = (columns) => {
    return columns.map((col, index) => ({
      field: col.key,
      value: "",
      id: index + 1,
      label: col.label,
      fieldLabel: col.label,
    }));
  };

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedLegalEntity("");
      setColumnFilters({});
      setSidebarFilters(initializeAllFilters(columns)); // Show all columns as filters
      setFilteredData([]); // Start with empty data
      setSelectedItems([]);
      setHasSearched(false); // Don't show data initially
      setShowFilterSidebar(false);
      setVisibleColumns(columns.map((col) => col.key));
    }
  }, [isOpen, columns]);

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1500));

    applyFilters();
    setIsLoading(false);
  };

  const handleColumnFilterChange = (column, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: value,
    }));

    // Auto-apply column filters
    if (hasSearched) {
      setTimeout(() => applyFilters(), 300); // Debounce
    }
  };

  const applyFilters = () => {
    let filtered = [...allData];

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

    // Keep all selected items from all legal entities
    // Don't filter out selected items that are not in current filtered data
    // This allows multi-legal-entity selection
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

    // Auto-apply sidebar filters when value changes
    if (field === "value" && hasSearched) {
      setTimeout(() => applyFilters(), 300); // Debounce
    }
  };

  // Removed removeSidebarFilter since filters are now predefined

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

  const handleConfirmSelection = () => {
    if (selectedItems.length > 0) {
      onSelect(selectedItems);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <Text variant="heading" size="lg" weight="semibold">
            {title}
          </Text>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between gap-4 items-end">
            <div className="flex gap-4 items-end">
              {/* Legal Entity Select */}
              <div className="w-64">
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
                columns={columns}
                visibleColumns={visibleColumns}
                onVisibilityChange={setVisibleColumns}
                buttonText="Columns"
              />
            </div>

            {/* Search Button */}
            <Button
              variant="primary"
              size="medium"
              onClick={handleSearch}
              disabled={isLoading}
              className="flex items-center gap-2 py-[10px]"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Search
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Filter Sidebar */}
          {showFilterSidebar && (
            <div className="w-80 border-r border-gray-200 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <Text variant="heading" size="md" weight="semibold">
                  Advanced Filters
                </Text>
                {/* <Button
                  variant="outline"
                  size="small"
                  onClick={addSidebarFilter}
                >
                  Add Filter
                </Button> */}
              </div>

              <div className="space-y-4">
                {sidebarFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="mb-2">
                      <Text
                        variant="body"
                        size="sm"
                        weight="medium"
                        className="text-gray-700"
                      >
                        {filter.fieldLabel}
                      </Text>
                    </div>
                    <Input
                      value={filter.value}
                      onChange={(e) =>
                        updateSidebarFilter(filter.id, "value", e.target.value)
                      }
                      placeholder={`Filter ${filter.fieldLabel?.toLowerCase()}...`}
                      size="small"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Table */}
            <div className="flex-1 overflow-hidden p-4 sm:p-6">
              {!hasSearched ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Search size={48} className="mx-auto mb-4 text-gray-300" />
                    <Text variant="body" size="lg">
                      Select filters and click Search to view data
                    </Text>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center h-full">
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
                <div className="border border-gray-200 rounded-lg overflow-x-auto h-full">
                  <table className="w-full min-w-max">
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
                                visibleSelectedItems.length <
                                  filteredData.length
                              );
                            })()}
                            onChange={handleSelectAll}
                          />
                        </th>
                        {columns
                          .filter((column) =>
                            visibleColumns.includes(column.key)
                          )
                          .map((column) => (
                            <th
                              key={column.key}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                            >
                              <div className="space-y-2">
                                <div>{column.label}</div>
                                {hasSearched && (
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
                                )}
                              </div>
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={visibleColumns.length + 1}
                            className="px-6 py-8 text-center text-gray-500"
                          >
                            No data found
                          </td>
                        </tr>
                      ) : (
                        filteredData.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <Checkbox
                                checked={selectedItems.some(
                                  (selected) =>
                                    selected.customerAccount ===
                                    item.customerAccount
                                )}
                                onChange={() => handleSelectItem(item)}
                              />
                            </td>
                            {columns
                              .filter((column) =>
                                visibleColumns.includes(column.key)
                              )
                              .map((column) => (
                                <td
                                  key={column.key}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 min-w-0"
                                >
                                  <div
                                    className="truncate max-w-xs"
                                    title={item[column.key]}
                                  >
                                    {item[column.key]}
                                  </div>
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
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
          <Text variant="body" color="muted">
            {selectedItems.length} item(s) selected
          </Text>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmSelection}
              disabled={selectedItems.length === 0}
            >
              Select ({selectedItems.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedObjectSelectModal;
