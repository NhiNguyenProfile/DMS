import Text from "../../../atoms/Text";
import { CheckCircle, XCircle, Clock, MessageCircle } from "lucide-react";

const ApprovalTreePreview = ({ requestData }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={16} className="text-green-500" />;
      case "Rejected":
        return <XCircle size={16} className="text-red-500" />;
      case "In Progress":
        return <Clock size={16} className="text-blue-500" />;
      case "Waiting":
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
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
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
            <Text
              variant="caption"
              weight="medium"
              className="text-gray-600 text-xs"
            >
              {owner.name.charAt(0).toUpperCase()}
            </Text>
          </div>
        )}
      </div>

      {/* Owner Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Text variant="body" weight="medium" className="text-sm">
            {owner.name}
          </Text>
          {getStatusIcon(owner.status)}
        </div>
        <Text variant="caption" color="muted" className="text-xs">
          {owner.title}
        </Text>
        {owner.approvedAt && (
          <Text variant="caption" color="muted" className="text-xs">
            {formatDate(owner.approvedAt)}
          </Text>
        )}

        {/* Reason/Note */}
        {owner.reason && (
          <div className="flex items-start gap-1 mt-1 p-2 bg-red-50 rounded text-xs">
            <MessageCircle
              size={12}
              className="text-red-500 mt-0.5 flex-shrink-0"
            />
            <Text variant="caption" className="text-red-700 text-xs">
              {owner.reason}
            </Text>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep = (step, index) => (
    <div
      key={index}
      className={`relative ${
        step.isCurrentStep ? "bg-blue-50 rounded-lg p-2 -m-2" : ""
      }`}
    >
      {/* Timeline Line */}
      {index < requestData.approvalTree.length - 1 && (
        <div
          className={`absolute left-3 top-8 w-0.5 h-12 ${
            step.isCurrentStep ? "bg-blue-300 left-5 top-9" : "bg-gray-200"
          }`}
        ></div>
      )}

      {/* Step Container */}
      <div className="relative">
        {/* Step Number */}
        <div
          className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
            step.isCurrentStep
              ? "bg-blue-500 text-white"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          <Text
            className={`text-xs ${
              step.isCurrentStep ? " text-white" : " text-blue-600"
            }`}
            variant="caption"
            weight="bold"
          >
            {index + 1}
          </Text>
        </div>

        {/* Step Content */}
        <div className="ml-8 pb-6">
          {/* Step Name */}
          <div className="flex items-center gap-2 mb-2">
            <Text
              variant="body"
              weight="semibold"
              className={`text-sm ${step.isCurrentStep ? "text-blue-700" : ""}`}
            >
              {step.stepName}
            </Text>
            {step.isCurrentStep && (
              <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-200 text-blue-800">
                Editing
              </span>
            )}
            {step.parallel && (
              <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                Parallel
              </span>
            )}
          </div>

          {/* Owners */}
          <div className="space-y-2">
            {step.owners.map((owner) => renderOwner(owner, step.parallel))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!requestData || !requestData.approvalTree) {
    return (
      <div className="text-center py-8">
        <Text variant="body" color="muted" className="text-sm">
          No workflow steps to preview
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-gray-200">
        <Text variant="body" weight="semibold" className="text-sm">
          {requestData.requestId}
        </Text>
        <Text variant="caption" color="muted" className="text-xs">
          {requestData.approvalTree.length} step(s)
        </Text>
      </div>

      {/* Steps */}
      <div className="space-y-0">
        {requestData.approvalTree.map((step, index) => renderStep(step, index))}
      </div>

      {/* Empty State */}
      {requestData.approvalTree.length === 0 && (
        <div className="text-center py-8">
          <Text variant="body" color="muted" className="text-sm">
            No steps configured yet
          </Text>
        </div>
      )}
    </div>
  );
};

export default ApprovalTreePreview;
