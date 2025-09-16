import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import Text from "./Text";

const ObjectSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  title,
  columns,
  data,
  searchFields,
  selectedValue,
  selectedItems = [], // Add this to track selected items
  showEntities = false, // Add this to control entities display
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data || []);

  useEffect(() => {
    if (!data) return;

    // Filter out selected items and apply search
    const availableData = data.filter(
      (item) => !selectedItems.some((selected) => selected.id === item.id)
    );

    if (!searchTerm.trim()) {
      setFilteredData(availableData);
      return;
    }

    const filtered = availableData.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [searchTerm, data, searchFields, selectedItems]);

  const handleSelect = (item) => {
    onSelect(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
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

        {/* Search */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden p-4 sm:p-6">
          <div className="border border-gray-200 rounded-lg overflow-x-auto h-full">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchTerm.trim()
                        ? "No data found"
                        : "No items available for selection"}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-6 py-4 text-sm text-gray-900"
                        >
                          {column.key === "description" ? (
                            <div className="space-y-1">
                              <div>{item[column.key]}</div>
                              {showEntities && item.entities && (
                                <div className="flex flex-wrap gap-1">
                                  {item.entities.map((entity, i) => (
                                    <span
                                      key={i}
                                      className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                    >
                                      {entity}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="truncate max-w-xs" title={item[column.key]}>
                              {item[column.key]}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSelect(item)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ObjectSelectModal;