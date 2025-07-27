import { useState, useEffect } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import { X, Save, Plus, Trash2 } from "lucide-react";

// Operators for criteria
const OPERATORS = [
  { value: "==", label: "Equals (==)" },
  { value: "!=", label: "Not Equals (!=)" },
  { value: "in", label: "In Array (in)" },
  { value: "not_in", label: "Not In Array (not_in)" },
  { value: ">", label: "Greater Than (>)" },
  { value: ">=", label: "Greater Than or Equal (>=)" },
  { value: "<", label: "Less Than (<)" },
  { value: "<=", label: "Less Than or Equal (<=)" },
  { value: "contains", label: "Contains" },
  { value: "starts_with", label: "Starts With" },
  { value: "ends_with", label: "Ends With" },
];

// Logic operators
const LOGIC_OPERATORS = [
  { value: "and", label: "AND" },
  { value: "or", label: "OR" },
];

const CriteriaConfigPanel = ({ criteria, onClose, onSave }) => {
  const [criteriaData, setCriteriaData] = useState({
    type: "simple", // simple or complex
    field: "",
    operator: "==",
    value: "",
    conditions: [], // for complex criteria
    logic: "and", // and/or for complex criteria
  });

  const [errors, setErrors] = useState({});

  // Load criteria data when editing
  useEffect(() => {
    if (criteria) {
      if (criteria.and || criteria.or) {
        // Complex criteria
        setCriteriaData({
          type: "complex",
          field: "",
          operator: "==",
          value: "",
          conditions: criteria.and || criteria.or || [],
          logic: criteria.and ? "and" : "or",
        });
      } else {
        // Simple criteria
        setCriteriaData({
          type: "simple",
          field: criteria.field || "",
          operator: criteria.operator || "==",
          value: Array.isArray(criteria.value)
            ? criteria.value.join(", ")
            : criteria.value || "",
          conditions: [],
          logic: "and",
        });
      }
    }
  }, [criteria]);

  const handleInputChange = (field, value) => {
    setCriteriaData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...criteriaData.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setCriteriaData((prev) => ({ ...prev, conditions: newConditions }));
  };

  const addCondition = () => {
    setCriteriaData((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { field: "", operator: "==", value: "" },
      ],
    }));
  };

  const removeCondition = (index) => {
    if (criteriaData.conditions.length > 1) {
      const newConditions = criteriaData.conditions.filter(
        (_, i) => i !== index
      );
      setCriteriaData((prev) => ({ ...prev, conditions: newConditions }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (criteriaData.type === "simple") {
      if (!criteriaData.field.trim()) {
        newErrors.field = "Field is required";
      }
      if (!criteriaData.value.trim()) {
        newErrors.value = "Value is required";
      }
    } else {
      // Validate complex criteria
      if (criteriaData.conditions.length === 0) {
        newErrors.conditions = "At least one condition is required";
      }

      criteriaData.conditions.forEach((condition, index) => {
        if (!condition.field) {
          newErrors[`condition_${index}_field`] = "Field is required";
        }
        if (!condition.value) {
          newErrors[`condition_${index}_value`] = "Value is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      let result;

      if (criteriaData.type === "simple") {
        // Simple criteria
        let value = criteriaData.value;

        // Handle array values for 'in' and 'not_in' operators
        if (["in", "not_in"].includes(criteriaData.operator)) {
          value = criteriaData.value
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v);
        }

        result = {
          field: criteriaData.field,
          operator: criteriaData.operator,
          value: value,
        };
      } else {
        // Complex criteria
        const conditions = criteriaData.conditions.map((condition) => {
          let value = condition.value;

          // Handle array values for 'in' and 'not_in' operators
          if (["in", "not_in"].includes(condition.operator)) {
            value = condition.value
              .split(",")
              .map((v) => v.trim())
              .filter((v) => v);
          }

          return {
            field: condition.field,
            operator: condition.operator,
            value: value,
          };
        });

        result = {
          [criteriaData.logic]: conditions,
        };
      }

      onSave(result);
    }
  };

  const renderSimpleCriteria = () => (
    <div className="space-y-4">
      <div>
        <Text variant="body" weight="medium" className="mb-2">
          Field Name *
        </Text>
        <Input
          value={criteriaData.field}
          onChange={(e) => handleInputChange("field", e.target.value)}
          placeholder="e.g., country, region, customerType"
          error={!!errors.field}
        />
        {errors.field && (
          <Text variant="caption" color="error" className="mt-1">
            {errors.field}
          </Text>
        )}
      </div>

      <div>
        <Text variant="body" weight="medium" className="mb-2">
          Operator *
        </Text>
        <Select
          options={OPERATORS}
          value={criteriaData.operator}
          onChange={(value) => handleInputChange("operator", value)}
        />
      </div>

      <div>
        <Text variant="body" weight="medium" className="mb-2">
          Value *
        </Text>
        <Input
          value={criteriaData.value}
          onChange={(e) => handleInputChange("value", e.target.value)}
          placeholder={
            ["in", "not_in"].includes(criteriaData.operator)
              ? "Enter values separated by comma (e.g., VN, US, JP)"
              : "Enter value"
          }
          error={!!errors.value}
        />
        {errors.value && (
          <Text variant="caption" color="error" className="mt-1">
            {errors.value}
          </Text>
        )}
        {["in", "not_in"].includes(criteriaData.operator) && (
          <Text variant="caption" color="muted" className="mt-1">
            For array operators, separate values with commas
          </Text>
        )}
      </div>
    </div>
  );

  const renderComplexCriteria = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text variant="body" weight="medium">
          Logic Operator
        </Text>
        <Select
          options={LOGIC_OPERATORS}
          value={criteriaData.logic}
          onChange={(value) => handleInputChange("logic", value)}
          className="w-32"
        />
      </div>

      <div className="space-y-4">
        {criteriaData.conditions.map((condition, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <Text variant="body" weight="medium">
                Condition #{index + 1}
              </Text>
              {criteriaData.conditions.length > 1 && (
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => removeCondition(index)}
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Text variant="body" weight="medium" className="mb-2">
                  Field *
                </Text>
                <Input
                  value={condition.field || ""}
                  onChange={(e) =>
                    handleConditionChange(index, "field", e.target.value)
                  }
                  placeholder="Field name"
                  error={!!errors[`condition_${index}_field`]}
                />
                {errors[`condition_${index}_field`] && (
                  <Text variant="caption" color="error" className="mt-1">
                    {errors[`condition_${index}_field`]}
                  </Text>
                )}
              </div>

              <div>
                <Text variant="body" weight="medium" className="mb-2">
                  Operator *
                </Text>
                <Select
                  options={OPERATORS}
                  value={condition.operator || "=="}
                  onChange={(value) =>
                    handleConditionChange(index, "operator", value)
                  }
                />
              </div>

              <div>
                <Text variant="body" weight="medium" className="mb-2">
                  Value *
                </Text>
                <Input
                  value={condition.value || ""}
                  onChange={(e) =>
                    handleConditionChange(index, "value", e.target.value)
                  }
                  placeholder="Value"
                  error={!!errors[`condition_${index}_value`]}
                />
                {errors[`condition_${index}_value`] && (
                  <Text variant="caption" color="error" className="mt-1">
                    {errors[`condition_${index}_value`]}
                  </Text>
                )}
              </div>
            </div>
          </div>
        ))}

        <Button variant="outline" onClick={addCondition} className="w-full">
          <Plus size={16} className="mr-2" />
          Add Condition
        </Button>

        {errors.conditions && (
          <Text variant="caption" color="error">
            {errors.conditions}
          </Text>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-y-0 right-0 w-1/3 bg-white shadow-xl z-60 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Configure Criteria
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Define conditions for dependent field activation
          </Text>
        </div>
        <Button variant="ghost" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Criteria Type */}
        <div>
          <Text variant="body" weight="medium" className="mb-2">
            Criteria Type
          </Text>
          <Select
            options={[
              { value: "simple", label: "Simple (Single Condition)" },
              { value: "complex", label: "Complex (Multiple Conditions)" },
            ]}
            value={criteriaData.type}
            onChange={(value) => handleInputChange("type", value)}
          />
        </div>

        {/* Criteria Configuration */}
        {criteriaData.type === "simple"
          ? renderSimpleCriteria()
          : renderComplexCriteria()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <Save size={16} className="mr-2" />
          Save Criteria
        </Button>
      </div>
    </div>
  );
};

export default CriteriaConfigPanel;
