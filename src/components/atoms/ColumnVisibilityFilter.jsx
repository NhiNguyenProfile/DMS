import { useState } from "react";
import Button from "./Button";
import Text from "./Text";
import Modal from "./Modal";
import { Eye, EyeOff, Settings } from "lucide-react";

const ColumnVisibilityFilter = ({ 
  columns, 
  visibleColumns, 
  onVisibilityChange,
  buttonText = "Columns",
  buttonVariant = "outline"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleColumn = (columnKey) => {
    const newVisibleColumns = visibleColumns.includes(columnKey)
      ? visibleColumns.filter(key => key !== columnKey)
      : [...visibleColumns, columnKey];
    
    onVisibilityChange(newVisibleColumns);
  };

  const handleSelectAll = () => {
    onVisibilityChange(columns.map(col => col.key));
  };

  const handleDeselectAll = () => {
    onVisibilityChange([]);
  };

  const handleReset = () => {
    // Reset to default visible columns (first 6 columns or all if less than 6)
    const defaultColumns = columns.slice(0, Math.min(6, columns.length)).map(col => col.key);
    onVisibilityChange(defaultColumns);
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Settings size={16} />
        {buttonText}
        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
          {visibleColumns.length}/{columns.length}
        </span>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Column Visibility"
        size="md"
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            Select which columns to show or hide in the table. You can show up to {columns.length} columns.
          </Text>

          {/* Action Buttons */}
          <div className="flex gap-2 pb-4 border-b border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="flex items-center gap-1"
            >
              <Eye size={14} />
              Show All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              className="flex items-center gap-1"
            >
              <EyeOff size={14} />
              Hide All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              Reset to Default
            </Button>
          </div>

          {/* Column List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {columns.map((column) => {
              const isVisible = visibleColumns.includes(column.key);
              return (
                <div
                  key={column.key}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    isVisible
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => handleToggleColumn(column.key)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        isVisible
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isVisible && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <Text variant="body" weight="medium">
                        {column.label}
                      </Text>
                      {column.description && (
                        <Text variant="caption" color="muted">
                          {column.description}
                        </Text>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isVisible ? (
                      <Eye size={16} className="text-blue-500" />
                    ) : (
                      <EyeOff size={16} className="text-gray-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="pt-4 border-t border-gray-200">
            <Text variant="caption" color="muted">
              {visibleColumns.length} of {columns.length} columns visible
              {visibleColumns.length === 0 && " (table will be empty)"}
            </Text>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsOpen(false)}
            >
              Apply Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ColumnVisibilityFilter;
