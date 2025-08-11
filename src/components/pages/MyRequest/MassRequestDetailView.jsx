import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Table from "../../atoms/Table";
import CustomerDetailForm from "./CustomerDetailForm";
import { ArrowLeft, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const MassRequestDetailView = ({ massRequest, onBack }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Items per page

  // Mock data for individual customers in the mass request
  const mockCustomers = Array.from(
    { length: massRequest.totalCount || 5 },
    (_, index) => ({
      id: `CUST-${massRequest.id}-${index + 1}`,
      customerCode: `CUST-${String(index + 1).padStart(3, "0")}`,
      customerName: `Customer ${index + 1}`,
      customerType: index % 2 === 0 ? "Corporate" : "SME",
      industry: ["Manufacturing", "Retail", "Trading", "Services"][index % 4],
      country: "Vietnam",
      city: index % 2 === 0 ? "Ho Chi Minh City" : "Hanoi",
      email: `customer${index + 1}@example.com`,
      phone: `+84-${Math.floor(Math.random() * 100)}-${Math.floor(
        Math.random() * 1000
      )}-${Math.floor(Math.random() * 10000)}`,
      status: ["Pending", "Approved", "In Review"][index % 3],
      createdDate: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    })
  );

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetail(true);
  };

  const handleBackFromCustomerDetail = () => {
    setShowCustomerDetail(false);
    setSelectedCustomer(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(mockCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = mockCustomers.slice(startIndex, endIndex);

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

  // If showing individual customer detail
  if (showCustomerDetail && selectedCustomer) {
    return (
      <CustomerDetailForm
        requestData={{
          ...selectedCustomer,
          requestType:
            massRequest.requestType === "MassCreate" ? "Create" : "Edit",
          requestTitle: `${
            massRequest.requestType === "MassCreate" ? "Create" : "Edit"
          } Customer - ${selectedCustomer.customerName}`,
        }}
        onBack={handleBackFromCustomerDetail}
      />
    );
  }

  const columns = [
    { key: "customerCode", label: "Customer Code" },
    { key: "customerName", label: "Customer Name" },
    { key: "customerType", label: "Type" },
    { key: "industry", label: "Industry" },
    { key: "country", label: "Country" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (customer, columnKey) => {
    switch (columnKey) {
      case "status":
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              customer.status === "Approved"
                ? "bg-green-100 text-green-800"
                : customer.status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {customer.status}
          </span>
        );
      case "actions":
        return (
          <Button
            variant="ghost"
            size="small"
            onClick={() => handleViewCustomer(customer)}
            className="flex items-center gap-1"
          >
            <Eye size={14} />
            View
          </Button>
        );
      default:
        return String(customer[columnKey] || "");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Requests
        </Button>
        <div>
          <Text variant="heading" size="xl" weight="bold" className="mb-2">
            {massRequest.requestTitle}
          </Text>
          <Text variant="body" color="muted">
            {massRequest.mode === "create" ? "Mass Create" : "Mass Edit"}{" "}
            Request Details
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
              Total Requests
            </Text>
            <Text variant="body" weight="medium">
              {massRequest.totalCount} request
            </Text>
          </div>

          <div>
            <Text variant="caption" color="muted" className="mb-1">
              Created Date
            </Text>
            <Text variant="body" weight="medium">
              {new Date(massRequest.createdDate).toLocaleDateString()}
            </Text>
          </div>
        </div>
      </div>

      {/* Individual Records Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <Text variant="heading" size="lg" weight="bold">
            Individual Customer Records
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Click on any record to view details
          </Text>
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
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleViewCustomer(customer)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      onClick={(e) => {
                        if (column.key === "actions") {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {renderCell(customer, column.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <Text variant="body" color="muted">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, mockCustomers.length)} of{" "}
                {mockCustomers.length} records
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
          Total: {mockCustomers.length} records | Page {currentPage} of{" "}
          {totalPages}
        </Text>
      </div>
    </div>
  );
};

export default MassRequestDetailView;
