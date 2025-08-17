import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import ApprovalDetailForm from "./ApprovalDetailForm";
import SparePartsApprovalDetailForm from "./SparePartsApprovalDetailForm";
import FinishedGoodsApprovalDetailForm from "./FinishedGoodsApprovalDetailForm";
import {
  ArrowLeft,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";

const MassApprovalDetailView = ({ massRequest, entityType, onBack }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [viewedItems, setViewedItems] = useState(new Set()); // Track viewed items
  const [showRequestUpdateModal, setShowRequestUpdateModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [approveMessage, setApproveMessage] = useState("");
  const [rejectMessage, setRejectMessage] = useState("");

  // Mock data for individual items in the mass approval request
  const mockItems = Array.from(
    { length: massRequest.totalCount || 5 },
    (_, index) => {
      const baseData = {
        id: `${massRequest.id}-ITEM-${index + 1}`,
        status: ["Pending", "Approved", "Rejected"][index % 3],
        createdDate: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        requestType:
          massRequest.requestType === "MassCreate" ? "Create" : "Edit",
        stepOwner: massRequest.stepOwner,
        currentSteps: "Waiting for Approve",
      };

      // Entity-specific data
      if (entityType === "Customers") {
        return {
          ...baseData,
          customerCode: `CUST-${String(index + 1).padStart(3, "0")}`,
          customerName: `Customer ${index + 1}`,
          customerType: index % 2 === 0 ? "Corporate" : "SME",
          industry: ["Manufacturing", "Retail", "Trading", "Services"][
            index % 4
          ],
          country: "Vietnam",
          city: index % 2 === 0 ? "Ho Chi Minh City" : "Hanoi",
          requestTitle: `${
            massRequest.requestType === "MassCreate" ? "Create" : "Edit"
          } Customer - Customer ${index + 1}`,
        };
      } else if (entityType === "Spare Parts") {
        return {
          ...baseData,
          partCode: `SP-${String(index + 1).padStart(4, "0")}`,
          partName: `Spare Part ${index + 1}`,
          category: ["Engine", "Transmission", "Brake", "Electrical"][
            index % 4
          ],
          supplier: `Supplier ${(index % 3) + 1}`,
          requestTitle: `${
            massRequest.requestType === "MassCreate" ? "Create" : "Edit"
          } Spare Part - ${`SP-${String(index + 1).padStart(4, "0")}`}`,
        };
      }

      return baseData;
    }
  );

  const handleViewItem = (item) => {
    // Mark item as viewed
    setViewedItems((prev) => new Set([...prev, item.id]));
    setSelectedItem(item);
    setShowItemDetail(true);
  };

  const handleBackFromItemDetail = () => {
    setShowItemDetail(false);
    setSelectedItem(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(mockItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = mockItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Mass approval actions
  const handleSelectAll = () => {
    // Only select items that have been viewed
    const viewedCurrentItems = currentItems
      .filter((item) => viewedItems.has(item.id))
      .map((item) => item.id);
    setSelectedItems(new Set(viewedCurrentItems));
  };

  const handleDeselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleMassApprove = () => {
    setShowApproveModal(true);
  };

  const handleMassReject = () => {
    setShowRejectModal(true);
  };

  const handleMassRequestUpdate = () => {
    setShowRequestUpdateModal(true);
  };

  const handleConfirmRequestUpdate = () => {
    console.log("Mass request update for items:", Array.from(selectedItems));
    console.log("Update message:", updateMessage);
    // TODO: Implement mass request update logic
    setShowRequestUpdateModal(false);
    setUpdateMessage("");
    setSelectedItems(new Set()); // Clear selection after action
  };

  const handleCancelRequestUpdate = () => {
    setShowRequestUpdateModal(false);
    setUpdateMessage("");
  };

  const handleConfirmApprove = () => {
    console.log("Mass approve items:", Array.from(selectedItems));
    console.log("Approve message:", approveMessage);
    // TODO: Implement mass approve logic
    setShowApproveModal(false);
    setApproveMessage("");
    setSelectedItems(new Set()); // Clear selection after action
  };

  const handleCancelApprove = () => {
    setShowApproveModal(false);
    setApproveMessage("");
  };

  const handleConfirmReject = () => {
    console.log("Mass reject items:", Array.from(selectedItems));
    console.log("Reject message:", rejectMessage);
    // TODO: Implement mass reject logic
    setShowRejectModal(false);
    setRejectMessage("");
    setSelectedItems(new Set()); // Clear selection after action
  };

  const handleCancelReject = () => {
    setShowRejectModal(false);
    setRejectMessage("");
  };

  // If showing individual item detail
  if (showItemDetail && selectedItem) {
    const DetailComponent =
      entityType === "Customers"
        ? ApprovalDetailForm
        : entityType === "Spare Parts"
        ? SparePartsApprovalDetailForm
        : FinishedGoodsApprovalDetailForm;

    return (
      <DetailComponent
        requestData={selectedItem}
        onBack={handleBackFromItemDetail}
        onApprove={(approvedItem) => {
          console.log("Approved item:", approvedItem);
          handleBackFromItemDetail();
        }}
        onReject={(rejectedItem) => {
          console.log("Rejected item:", rejectedItem);
          handleBackFromItemDetail();
        }}
      />
    );
  }

  const getColumns = () => {
    const baseColumns = [
      { key: "select", label: "" },
      { key: "status", label: "Status" },
    ];

    if (entityType === "Customers") {
      return [
        ...baseColumns,
        { key: "customerCode", label: "Customer Code" },
        { key: "customerName", label: "Customer Name" },
        { key: "customerType", label: "Type" },
        { key: "industry", label: "Industry" },
        { key: "actions", label: "Actions" },
      ];
    } else if (entityType === "Spare Parts") {
      return [
        ...baseColumns,
        { key: "partCode", label: "Part Code" },
        { key: "partName", label: "Part Name" },
        { key: "category", label: "Category" },
        { key: "supplier", label: "Supplier" },
        { key: "actions", label: "Actions" },
      ];
    }

    return [...baseColumns, { key: "actions", label: "Actions" }];
  };

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "select":
        const isViewed = viewedItems.has(item.id);
        return (
          <input
            type="checkbox"
            checked={selectedItems.has(item.id)}
            disabled={!isViewed}
            onChange={(e) => {
              if (!isViewed) return; // Prevent selection if not viewed
              const newSelected = new Set(selectedItems);
              if (e.target.checked) {
                newSelected.add(item.id);
              } else {
                newSelected.delete(item.id);
              }
              setSelectedItems(newSelected);
            }}
            onClick={(e) => e.stopPropagation()}
            className={!isViewed ? "opacity-50 cursor-not-allowed" : ""}
            title={
              !isViewed ? "You must view this item before selecting it" : ""
            }
          />
        );
      case "status":
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              item.status === "Approved"
                ? "bg-green-100 text-green-800"
                : item.status === "Rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {item.status}
          </span>
        );
      case "actions":
        return (
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleViewItem(item);
            }}
            className="flex items-center gap-1"
          >
            <Eye size={14} />
            Review
          </Button>
        );
      default:
        return String(item[columnKey] || "");
    }
  };

  const columns = getColumns();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Approvals
        </Button>
        <div>
          <Text variant="heading" size="xl" weight="bold" className="mb-2">
            {massRequest.requestTitle}
          </Text>
          <Text variant="body" color="muted">
            Mass Approval Request Details - Review individual items
          </Text>
        </div>
      </div>

      {/* Request Info */}
      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Text variant="caption" color="muted" className="mb-1">
              Request ID
            </Text>
            <Text variant="body" weight="medium">
              {massRequest.id}
            </Text>
          </div>
          <div>
            <Text variant="caption" color="muted" className="mb-1">
              Total Items
            </Text>
            <Text variant="body" weight="medium">
              {massRequest.totalCount} items
            </Text>
          </div>
          <div>
            <Text variant="caption" color="muted" className="mb-1">
              Status
            </Text>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                massRequest.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : massRequest.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {massRequest.status}
            </span>
          </div>
        </div>
      </div>

      {/* Mass Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Text variant="body" weight="medium">
              {selectedItems.size} items selected
            </Text>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="small"
                onClick={handleMassApprove}
                className="flex items-center gap-1 text-white border-none bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle size={16} />
                Approve Selected
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={handleMassRequestUpdate}
                className="flex items-center gap-1 text-white border-none bg-blue-600 hover:bg-blue-700"
              >
                <Edit size={16} />
                Request Update
              </Button>
              <Button
                variant="outline"
                size="small"
                onClick={handleMassReject}
                className="flex items-center gap-1 text-white bg-red-600 border-none hover:bg-red-700"
              >
                <XCircle size={16} />
                Reject Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Individual Items Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div>
            <Text variant="heading" size="lg" weight="bold">
              Individual Items for Approval
            </Text>
            <Text variant="body" color="muted" className="mt-1">
              Click on items to review them first. Only reviewed items can be
              selected for bulk actions.
            </Text>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.key === "select" ? (
                      <input
                        type="checkbox"
                        checked={
                          selectedItems.size > 0 &&
                          selectedItems.size ===
                            currentItems.filter((item) =>
                              viewedItems.has(item.id)
                            ).length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleSelectAll();
                          } else {
                            handleDeselectAll();
                          }
                        }}
                        disabled={
                          currentItems.filter((item) =>
                            viewedItems.has(item.id)
                          ).length === 0
                        }
                        className={
                          currentItems.filter((item) =>
                            viewedItems.has(item.id)
                          ).length === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                        title={
                          currentItems.filter((item) =>
                            viewedItems.has(item.id)
                          ).length === 0
                            ? "No items have been reviewed yet"
                            : "Select/Deselect all reviewed items"
                        }
                      />
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item) => {
                const isViewed = viewedItems.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      isViewed ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleViewItem(item)}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                      >
                        {renderCell(item, column.key)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <Text variant="body" color="muted">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, mockItems.length)} of {mockItems.length}{" "}
                items
              </Text>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="small"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "primary" : "outline"}
                      size="small"
                      onClick={() => handlePageChange(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="small"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Total: {mockItems.length} items | Page {currentPage} of {totalPages} |{" "}
          {viewedItems.size} viewed | {selectedItems.size} selected
        </Text>
      </div>

      {/* Request Update Modal */}
      {showRequestUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <Text variant="heading" size="lg" weight="bold" className="mb-4">
              Request Update
            </Text>
            <Text variant="body" color="muted" className="mb-4">
              Please provide a message explaining what updates are needed for
              the selected {selectedItems.size} item(s):
            </Text>
            <textarea
              value={updateMessage}
              onChange={(e) => setUpdateMessage(e.target.value)}
              placeholder="Enter your update request message..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleCancelRequestUpdate}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmRequestUpdate}
                disabled={!updateMessage.trim()}
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                Send Request Update
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <Text variant="heading" size="lg" weight="bold" className="mb-4">
              Approve Items
            </Text>
            <Text variant="body" color="muted" className="mb-4">
              Please provide a message for approving the selected{" "}
              {selectedItems.size} item(s):
            </Text>
            <textarea
              value={approveMessage}
              onChange={(e) => setApproveMessage(e.target.value)}
              placeholder="Enter your approval message..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleCancelApprove}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmApprove}
                disabled={!approveMessage.trim()}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle size={16} />
                Approve Items
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <Text variant="heading" size="lg" weight="bold" className="mb-4">
              Reject Items
            </Text>
            <Text variant="body" color="muted" className="mb-4">
              Please provide a reason for rejecting the selected{" "}
              {selectedItems.size} item(s):
            </Text>
            <textarea
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              placeholder="Enter your rejection reason..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="outline" onClick={handleCancelReject}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmReject}
                disabled={!rejectMessage.trim()}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <XCircle size={16} />
                Reject Items
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MassApprovalDetailView;
