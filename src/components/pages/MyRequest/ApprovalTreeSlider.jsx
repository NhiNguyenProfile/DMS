import { useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  FileText,
} from "lucide-react";

const ApprovalTreeSlider = ({
  isOpen,
  onClose,
  requestData,
  onViewDetail,
  hideViewDetail = false,
}) => {
  // Close slider on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !requestData) return null;

  // Generate workflow name based on request data
  const getWorkflowName = () => {
    if (requestData.workflowName) {
      return requestData.workflowName;
    }

    // Extract entity from request ID or use default mapping
    let entity = "Customer"; // default
    let requestType = "Create"; // default

    // Try to determine entity from request ID pattern or other data
    if (requestData.requestId) {
      // You can customize this logic based on your request ID patterns
      if (
        requestData.requestId.includes("SPARE") ||
        requestData.entity === "SpareParts"
      ) {
        entity = "Spare Parts";
      } else if (
        requestData.requestId.includes("FINISHED") ||
        requestData.entity === "FinishedGoods"
      ) {
        entity = "Finished Goods";
      }
    }

    // Try to get request type from requestData
    if (requestData.requestType) {
      requestType = requestData.requestType;
    }

    return `${requestType} - Standard - ${entity}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={16} className="text-green-600" />;
      case "Rejected":
        return <XCircle size={16} className="text-red-600" />;
      case "Waiting":
        return <Clock size={16} className="text-gray-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
      Waiting: "bg-gray-100 text-gray-600",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[status] || "bg-gray-100 text-gray-600"
    }`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderOwner = (owner, isParallel = false) => (
    <div
      key={owner.name}
      className={`flex items-start gap-3 ${isParallel ? "ml-6" : ""}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {owner.avatarUrl ? (
          <img
            src={owner.avatarUrl}
            alt={owner.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <Text variant="caption" weight="medium" className="text-gray-600">
              {owner.name.charAt(0).toUpperCase()}
            </Text>
          </div>
        )}
      </div>

      {/* Owner Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Text variant="body" weight="medium" className="truncate">
            {owner.name}
          </Text>
          <span className={getStatusBadge(owner.status)}>{owner.status}</span>
        </div>

        <Text variant="caption" color="muted" className="block mb-1">
          {owner.title}
        </Text>

        {/* Timestamp */}
        {(owner.approvedAt || owner.rejectedAt) && (
          <Text variant="caption" color="muted" className="block mb-1">
            {formatDate(owner.approvedAt || owner.rejectedAt)}
          </Text>
        )}

        {/* Reason/Note */}
        {owner.reason && (
          <div className="flex items-start gap-1 mt-2 p-2 bg-red-50 rounded text-sm">
            <MessageCircle
              size={14}
              className="text-red-500 mt-0.5 flex-shrink-0"
            />
            <Text variant="caption" className="text-red-700">
              {owner.reason}
            </Text>
          </div>
        )}
      </div>

      {/* Status Icon */}
      <div className="flex-shrink-0">{getStatusIcon(owner.status)}</div>
    </div>
  );

  const renderStep = (step, index) => (
    <div key={index} className="relative">
      {/* Timeline Line */}
      {index < requestData.approvalTree.length - 1 && (
        <div className="absolute left-4 top-12 w-0.5 h-16 bg-gray-200"></div>
      )}

      {/* Step Container */}
      <div className="relative">
        {/* Step Number */}
        <div className="absolute left-0 top-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Text variant="caption" weight="bold" className="text-blue-600">
            {index + 1}
          </Text>
        </div>

        {/* Step Content */}
        <div className="ml-12 pb-8">
          {/* Step Name */}
          <div className="flex items-center gap-2 mb-3">
            <Text variant="body" weight="semibold">
              {step.stepName}
            </Text>
            {step.parallel && (
              <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                Parallel
              </span>
            )}
          </div>

          {/* Owners */}
          <div className="space-y-3">
            {step.owners.map((owner) => renderOwner(owner, step.parallel))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 !mt-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slider */}
      <div
        className={`fixed top-0 right-0 h-full w-96 !mt-0 bg-white shadow-xl transform transition-transform z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <Text variant="heading" size="lg" weight="semibold">
              Approval Tree
            </Text>
            <Text variant="caption" color="muted" className="mt-1">
              {getWorkflowName()}
            </Text>
          </div>
          <Button variant="ghost" size="small" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* View Detail Button - only show if not in detail view */}
          {!hideViewDetail && (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={onViewDetail}
                className="w-full"
              >
                <FileText size={16} className="mr-2" />
                View Detail
              </Button>
            </div>
          )}

          <div className="space-y-0">
            {requestData.approvalTree.map((step, index) =>
              renderStep(step, index)
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ApprovalTreeSlider;
