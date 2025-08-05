import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import Input from "../../atoms/Input";
import { ArrowLeft, Upload, Download, Plus, Edit, Trash2 } from "lucide-react";
import CustomerDetailForm from "./CustomerDetailForm";

const BulkCreatePage = ({ onBack, onSendBulkRequest }) => {
  const [customers, setCustomers] = useState([]);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  const handleAddManually = () => {
    setEditingCustomer(null);
    setShowDetailForm(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowDetailForm(true);
  };

  const handleSaveCustomer = (customerData) => {
    if (editingCustomer) {
      // Update existing customer
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? { ...customerData, id: editingCustomer.id }
            : c
        )
      );
    } else {
      // Add new customer
      const newCustomer = {
        ...customerData,
        id: `BULK-${Date.now()}`,
        status: "Draft",
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setShowDetailForm(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const headers = [
      "Main Customer Code",
      "Main Customer Name",
      "Company",
      "Address",
      "NIK/NPWP",
      "Customer Classification Group",
      "Customer Group",
      "Customer Type",
      "Organization Name",
      "Search Name",
    ];

    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_bulk_create_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportExcel = () => {
    if (!importFile) return;

    // Mock import logic - in real app, parse Excel/CSV file
    const mockImportedData = [
      {
        id: `BULK-${Date.now()}-1`,
        customerAccount: "IMP001", // Customer Code
        mainCustomerCode: "IMP001",
        mainCustomerName: "Imported Customer 1",
        mainCustomer: "NUSANTARA FARM", // Main Customer
        company: "DHV",
        address: "123 Import Street",
        nikNpwp: "01.111.111.1-111.000",
        customerClassificationGroup: "External",
        customerGroup: "LOC_EXT",
        customerType: "Organization",
        organizationName: "Imported Customer 1", // Customer Name
        searchName: "Imported Cust 1",
        status: "Draft",
      },
      {
        id: `BULK-${Date.now()}-2`,
        customerAccount: "IMP002", // Customer Code
        mainCustomerCode: "IMP002",
        mainCustomerName: "Imported Customer 2",
        mainCustomer: "PT. INDONUSA YP S1", // Main Customer
        company: "", // Empty company to test red highlight
        address: "456 Import Avenue",
        nikNpwp: "02.222.222.2-222.000",
        customerClassificationGroup: "Dealer",
        customerGroup: "AQTP",
        customerType: "Organization",
        organizationName: "Imported Customer 2", // Customer Name
        searchName: "Imported Cust 2",
        status: "Draft",
      },
    ];

    setCustomers((prev) => [...prev, ...mockImportedData]);
    setShowImportModal(false);
    setImportFile(null);
  };

  const handleSendBulkRequest = () => {
    if (customers.length === 0) return;

    const bulkRequest = {
      id: `BULK-REQ-${Date.now()}`,
      requestType: "Bulk Create",
      requestTitle: `Bulk Create ${customers.length} Customers`,
      stepOwner: "You - Sale Admin",
      currentSteps: "Waiting for Approval",
      status: "Pending",
      createdDate: new Date().toISOString(),
      customers: customers,
      totalCount: customers.length,
    };

    if (onSendBulkRequest) {
      onSendBulkRequest(bulkRequest);
    }
  };

  const mockRequestData = {
    id: "BULK-NEW",
    requestType: "Create",
    requestTitle: "New Customer Record",
    stepOwner: "You - Sale Admin",
    currentSteps: "Waiting for Entry",
    status: "Draft",
    createdDate: new Date().toISOString(),
    isNew: true,
    isBulkCreate: true, // Flag to indicate this is from bulk create
  };

  if (showDetailForm) {
    return (
      <CustomerDetailForm
        requestData={
          editingCustomer
            ? { ...mockRequestData, ...editingCustomer }
            : mockRequestData
        }
        onBack={() => {
          setShowDetailForm(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <div>
              <Text variant="heading" size="xl" weight="bold">
                Bulk Create Customers
              </Text>
              <Text variant="caption" color="muted">
                Create multiple customers at once
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Text variant="heading" size="lg" weight="semibold" className="mb-4">
            Choose how to add customers
          </Text>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => setShowImportModal(true)}
              className="h-24 flex-col gap-2"
            >
              <Upload size={24} />
              <div className="text-center">
                <div className="font-medium">Import Excel</div>
                <div className="text-xs text-gray-500">
                  Upload CSV/Excel file
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="h-24 flex-col gap-2"
            >
              <Download size={24} />
              <div className="text-center">
                <div className="font-medium">Download Template</div>
                <div className="text-xs text-gray-500">Get CSV template</div>
              </div>
            </Button>

            <Button
              variant="primary"
              onClick={handleAddManually}
              className="h-24 flex-col gap-2"
            >
              <Plus size={24} />
              <div className="text-center">
                <div className="font-medium">Add Manually</div>
                <div className="text-xs text-white/80">Create one by one</div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Customer List */}
      {customers.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <Text variant="heading" size="lg" weight="semibold">
                Customers to Create ({customers.length})
              </Text>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <Table.Header>
                  <Table.HeaderCell>Customer Code</Table.HeaderCell>
                  <Table.HeaderCell>Customer Name</Table.HeaderCell>
                  <Table.HeaderCell>Main Customer</Table.HeaderCell>
                  <Table.HeaderCell>Company</Table.HeaderCell>
                  <Table.HeaderCell>Customer Group</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                  {customers.map((customer) => {
                    const isCompanyEmpty =
                      !customer.company || customer.company.trim() === "";

                    return (
                      <Table.Row
                        key={customer.id}
                        className={isCompanyEmpty ? "bg-red-50" : ""}
                      >
                        <Table.Cell>
                          <Text variant="body" weight="medium">
                            {customer.customerAccount || "-"}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="body">
                            {customer.organizationName || "-"}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="body">
                            {customer.mainCustomer || "-"}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="body">{customer.company || "-"}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="body">
                            {customer.customerGroup || "-"}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text variant="body">
                            {customer.customerType || "-"}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                            {customer.status}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCustomer(customer)}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>

            {/* Send Request Button */}
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button
                variant="primary"
                onClick={handleSendBulkRequest}
                disabled={customers.length === 0}
              >
                Send Bulk Request ({customers.length} customers)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Customers"
      >
        <div className="space-y-4">
          <Text variant="body">
            Upload a CSV or Excel file with customer data. Make sure to use the
            template format.
          </Text>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Select File
            </Text>
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setImportFile(e.target.files[0])}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowImportModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleImportExcel}
              disabled={!importFile}
            >
              Import
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BulkCreatePage;
