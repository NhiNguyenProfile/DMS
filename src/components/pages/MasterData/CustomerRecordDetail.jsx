import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import { ArrowLeft, History } from "lucide-react";
import RequestHistoryModal from "./RequestHistoryModal";

const CustomerRecordDetail = ({ record, onClose }) => {
  const [showRequestHistory, setShowRequestHistory] = useState(false);

  const handleViewRequestHistory = () => {
    setShowRequestHistory(true);
  };

  const handleCloseRequestHistory = () => {
    setShowRequestHistory(false);
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
              Customer Details
            </Text>
            <Text variant="body" color="muted">
              {record.customerCode} - {record.customerName}
            </Text>
          </div>
        </div>
        
        {/* View Request History Button */}
        <Button variant="outline" onClick={handleViewRequestHistory}>
          <History size={16} className="mr-2" />
          View Request History
        </Button>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-4">
          Basic Information
        </Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Customer Code
            </Text>
            <Text variant="body" weight="medium">
              {record.customerCode}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Customer Name
            </Text>
            <Text variant="body" weight="medium">
              {record.customerName}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Customer Type
            </Text>
            <Text variant="body">
              {record.customerType}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Industry
            </Text>
            <Text variant="body">
              {record.industry}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Tax Code
            </Text>
            <Text variant="body">
              {record.taxCode}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Status
            </Text>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                record.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {record.status}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-4">
          Contact Information
        </Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Address
            </Text>
            <Text variant="body">
              {record.address}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              City
            </Text>
            <Text variant="body">
              {record.city}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Country
            </Text>
            <Text variant="body">
              {record.country}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Phone
            </Text>
            <Text variant="body">
              {record.phone}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Email
            </Text>
            <Text variant="body">
              {record.email}
            </Text>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Text variant="heading" size="lg" weight="semibold" className="mb-4">
          Financial Information
        </Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Credit Limit
            </Text>
            <Text variant="body" weight="medium">
              ${record.creditLimit?.toLocaleString()}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Payment Terms
            </Text>
            <Text variant="body">
              {record.paymentTerms}
            </Text>
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
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
              Created Date
            </Text>
            <Text variant="body">
              {new Date(record.createdDate).toLocaleDateString()}
            </Text>
          </div>
          
          <div>
            <Text variant="caption" color="muted" weight="medium" className="mb-1">
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
        entityType="Customer"
      />
    </div>
  );
};

export default CustomerRecordDetail;
