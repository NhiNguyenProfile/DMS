import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Modal from "../../atoms/Modal";
import { ArrowLeft, History, Plus } from "lucide-react";
import RequestHistoryModal from "./RequestHistoryModal";

const SparePartRecordDetail = ({ record, onClose }) => {
  const [showRequestHistory, setShowRequestHistory] = useState(false);
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);

  const handleViewRequestHistory = () => {
    setShowRequestHistory(true);
  };

  const handleCloseRequestHistory = () => {
    setShowRequestHistory(false);
  };

  // Create New Request functionality - Only for detail page (4 types)
  const DETAIL_REQUEST_TYPES = [
    { value: "Copy", label: "Copy Existing Record" },
    { value: "Extend", label: "Extend Existing Record" },
    { value: "Edit", label: "Edit Existing Record" },
  ];

  const handleCreateRequest = (requestType) => {
    setShowCreateRequestModal(false);

    // Show warning modal instead of navigating to request creation
    alert(`No suitable workflow available to perform ${requestType} action.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onClose}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Records
          </Button>
          <div>
            <Text variant="heading" size="xl" weight="bold" className="mb-1">
              Spare Part Details
            </Text>
            <Text variant="body" color="muted">
              {record.partNumber} - {record.partName}
            </Text>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleViewRequestHistory}>
            <History size={16} className="mr-2" />
            View Request History
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCreateRequestModal(true)}
          >
            <Plus size={16} className="mr-2" />
            Create New Request
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-4">
          Basic Information
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Text
              variant="caption"
              color="muted"
              weight="medium"
              className="mb-1"
            >
              Part Number
            </Text>
            <Text variant="body" weight="medium">
              {record.partNumber}
            </Text>
          </div>

          <div>
            <Text
              variant="caption"
              color="muted"
              weight="medium"
              className="mb-1"
            >
              Part Name
            </Text>
            <Text variant="body" weight="medium">
              {record.partName}
            </Text>
          </div>

          <div>
            <Text
              variant="caption"
              color="muted"
              weight="medium"
              className="mb-1"
            >
              Category
            </Text>
            <Text variant="body">{record.category}</Text>
          </div>

          <div>
            <Text
              variant="caption"
              color="muted"
              weight="medium"
              className="mb-1"
            >
              Manufacturer
            </Text>
            <Text variant="body">{record.manufacturer}</Text>
          </div>

          <div>
            <Text
              variant="caption"
              color="muted"
              weight="medium"
              className="mb-1"
            >
              Unit of Measure
            </Text>
            <Text variant="body">{record.unitOfMeasure}</Text>
          </div>

          <div>
            <Text
              variant="caption"
              color="muted"
              weight="medium"
              className="mb-1"
            >
              Status
            </Text>
            <Text variant="body">{record.status}</Text>
          </div>
        </div>
      </div>

      {/* Inventory Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-4">
          Inventory Information
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Text
              variant="caption"
              color="muted"
              weight="medium"
              className="mb-1"
            >
              Current Stock
            </Text>
            <Text variant="body" weight="medium">
              {record.currentStock?.toLocaleString()}
            </Text>
          </div>

          <div>
            <Text
              variant="caption"
              color="muted"
              weight="medium"
              className="mb-1"
            >
              Minimum Stock Level
            </Text>
            <Text variant="body">{record.minStockLevel?.toLocaleString()}</Text>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-4">
          System Information
        </Text>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Text
              variant="caption"
              color="muted"
              weight="medium"
              className="mb-1"
            >
              Created Date
            </Text>
            <Text variant="body">
              {new Date(record.createdDate).toLocaleDateString()}
            </Text>
          </div>

          <div>
            <Text
              variant="caption"
              color="muted"
              weight="medium"
              className="mb-1"
            >
              Last Modified
            </Text>
            <Text variant="body">
              {new Date(record.lastModified).toLocaleDateString()}
            </Text>
          </div>
        </div>
      </div>

      {/* Request History Modal */}
      <RequestHistoryModal
        isOpen={showRequestHistory}
        onClose={handleCloseRequestHistory}
        record={record}
        entityType="SparePart"
      />

      {/* Create New Request Modal */}
      <Modal
        isOpen={showCreateRequestModal}
        onClose={() => setShowCreateRequestModal(false)}
        title="Create New Request"
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            Select the type of request you want to create for this spare part:
          </Text>
          <div className="grid grid-cols-1 gap-3">
            {DETAIL_REQUEST_TYPES.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                onClick={() => handleCreateRequest(type.value)}
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

export default SparePartRecordDetail;
