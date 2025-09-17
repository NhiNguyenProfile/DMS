import { useState } from "react";
import Button from "../atoms/Button";
import Text from "../atoms/Text";
import FieldSelectionModal from "../atoms/FieldSelectionModal";

const TestFieldSelection = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);

  const handleConfirm = (fields) => {
    setSelectedFields(fields);
    console.log("Selected fields:", fields);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Test Field Selection Modal
        </Text>
        <Text variant="body" color="muted">
          Test the TreeSelect component and field selection functionality
        </Text>
      </div>

      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
      >
        Open Field Selection Modal
      </Button>

      {selectedFields.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <Text variant="heading" size="lg" weight="semibold" className="mb-3">
            Selected Fields ({selectedFields.length}):
          </Text>
          <div className="space-y-2">
            {selectedFields.map((field, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {field.group}
                </span>
                <Text variant="body">{field.label}</Text>
                <Text variant="caption" color="muted">({field.key})</Text>
              </div>
            ))}
          </div>
        </div>
      )}

      <FieldSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title="Test Field Selection"
      />
    </div>
  );
};

export default TestFieldSelection;
