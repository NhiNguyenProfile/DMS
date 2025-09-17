import { useState } from "react";
import { ChevronDown, ChevronRight, Check, Minus } from "lucide-react";
import Text from "../Text";

const TreeSelect = ({
  data = [],
  value = [],
  onChange,
  className = "",
  disabled = false,
  showSelectAll = true,
  ...props
}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  // Helper function to get all child IDs recursively
  const getAllChildIds = (node) => {
    let ids = [node.id];
    if (node.children) {
      node.children.forEach((child) => {
        ids = [...ids, ...getAllChildIds(child)];
      });
    }
    return ids;
  };

  // Helper function to get all parent IDs
  const getAllParentIds = (nodeId, data, parents = []) => {
    for (const node of data) {
      if (node.id === nodeId) {
        return parents;
      }
      if (node.children) {
        const found = getAllParentIds(nodeId, node.children, [
          ...parents,
          node.id,
        ]);
        if (found.length > parents.length) {
          return found;
        }
      }
    }
    return parents;
  };

  // Helper function to check if all children are selected
  const areAllChildrenSelected = (node) => {
    if (!node.children || node.children.length === 0) return false;
    return node.children.every((child) => {
      const childIds = getAllChildIds(child);
      return childIds.every((id) => value.includes(id));
    });
  };

  // Helper function to check if some children are selected
  const areSomeChildrenSelected = (node) => {
    if (!node.children || node.children.length === 0) return false;
    return node.children.some((child) => {
      const childIds = getAllChildIds(child);
      return childIds.some((id) => value.includes(id));
    });
  };

  // Get checkbox state for a node
  const getCheckboxState = (node) => {
    const isSelected = value.includes(node.id);
    const allChildrenSelected = areAllChildrenSelected(node);
    const someChildrenSelected = areSomeChildrenSelected(node);

    if (isSelected || allChildrenSelected) {
      return "checked";
    } else if (someChildrenSelected) {
      return "indeterminate";
    }
    return "unchecked";
  };

  // Toggle node expansion
  const toggleExpanded = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Handle checkbox change
  const handleCheckboxChange = (node) => {
    if (disabled) return;

    const nodeIds = getAllChildIds(node);
    const isCurrentlySelected = value.includes(node.id);
    const allChildrenSelected = areAllChildrenSelected(node);

    let newValue = [...value];

    if (isCurrentlySelected || allChildrenSelected) {
      // Unselect this node and all its children
      newValue = newValue.filter((id) => !nodeIds.includes(id));
    } else {
      // Select this node and all its children
      nodeIds.forEach((id) => {
        if (!newValue.includes(id)) {
          newValue.push(id);
        }
      });
    }

    // Auto-select/deselect parents based on children state
    const updateParents = (data) => {
      data.forEach((parentNode) => {
        if (parentNode.children) {
          const allChildrenNowSelected = parentNode.children.every((child) => {
            const childIds = getAllChildIds(child);
            return childIds.every((id) => newValue.includes(id));
          });

          if (allChildrenNowSelected && !newValue.includes(parentNode.id)) {
            newValue.push(parentNode.id);
          } else if (
            !allChildrenNowSelected &&
            newValue.includes(parentNode.id)
          ) {
            newValue = newValue.filter((id) => id !== parentNode.id);
          }

          updateParents(parentNode.children);
        }
      });
    };

    updateParents(data);
    onChange(newValue);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (disabled) return;

    const allIds = [];
    const collectAllIds = (nodes) => {
      nodes.forEach((node) => {
        allIds.push(node.id);
        if (node.children) {
          collectAllIds(node.children);
        }
      });
    };
    collectAllIds(data);

    const allSelected = allIds.every((id) => value.includes(id));
    onChange(allSelected ? [] : allIds);
  };

  // Render checkbox
  const renderCheckbox = (state) => {
    const baseClasses =
      "w-4 h-4 border-2 rounded flex items-center justify-center cursor-pointer transition-colors";

    if (state === "checked") {
      return (
        <div className={`${baseClasses} bg-blue-600 border-blue-600`}>
          <Check size={12} className="text-white" />
        </div>
      );
    } else if (state === "indeterminate") {
      return (
        <div className={`${baseClasses} bg-blue-600 border-blue-600`}>
          <Minus size={12} className="text-white" />
        </div>
      );
    } else {
      return (
        <div
          className={`${baseClasses} border-gray-300 hover:border-gray-400`}
        />
      );
    }
  };

  // Render tree node
  const renderNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const checkboxState = getCheckboxState(node);

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded"
          style={{ marginLeft: level * 16 }}
        >
          {/* Expand/Collapse Icon */}
          <div className="w-4 h-4 flex items-center justify-center">
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(node.id)}
                className="p-0 hover:bg-gray-200 rounded"
                disabled={disabled}
              >
                {isExpanded ? (
                  <ChevronDown size={14} className="text-gray-600" />
                ) : (
                  <ChevronRight size={14} className="text-gray-600" />
                )}
              </button>
            )}
          </div>

          {/* Checkbox */}
          <div onClick={() => handleCheckboxChange(node)}>
            {renderCheckbox(checkboxState)}
          </div>

          {/* Label */}
          <Text
            variant="body"
            className={`flex-1 cursor-pointer ${
              disabled ? "text-gray-400" : ""
            }`}
            onClick={() => handleCheckboxChange(node)}
          >
            {node.label}
          </Text>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Calculate select all state
  const allIds = [];
  const collectAllIds = (nodes) => {
    nodes.forEach((node) => {
      allIds.push(node.id);
      if (node.children) {
        collectAllIds(node.children);
      }
    });
  };
  collectAllIds(data);

  const allSelected =
    allIds.length > 0 && allIds.every((id) => value.includes(id));
  const someSelected = allIds.some((id) => value.includes(id));
  const selectAllState = allSelected
    ? "checked"
    : someSelected
    ? "indeterminate"
    : "unchecked";

  return (
    <div
      className={`border border-gray-300 rounded-lg bg-white ${className}`}
      {...props}
    >
      {/* Select All */}
      {showSelectAll && data.length > 0 && (
        <div className="border-b border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div onClick={handleSelectAll}>
              {renderCheckbox(selectAllState)}
            </div>
            <Text
              variant="body"
              weight="medium"
              className={`cursor-pointer ${disabled ? "text-gray-400" : ""}`}
              onClick={handleSelectAll}
            >
              Select All
            </Text>
          </div>
        </div>
      )}

      {/* Tree Content */}
      <div className="p-2 max-h-80 overflow-y-auto">
        {data.length > 0 ? (
          data.map((node) => renderNode(node))
        ) : (
          <div className="text-center py-8">
            <Text variant="body" color="muted">
              No data available
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeSelect;
