import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import Input from "../../atoms/Input";
import ObjectSelectModal from "../../atoms/ObjectSelectModal";
import { ArrowLeft, Upload, Download, Plus, Edit, Trash2 } from "lucide-react";
import CustomerDetailForm from "./CustomerDetailForm";

const BulkCreatePage = ({ mode = "create", onBack, onSendBulkRequest }) => {
  const [customers, setCustomers] = useState([]);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [packageTitle, setPackageTitle] = useState("");
  const [showPackageTitleModal, setShowPackageTitleModal] = useState(false);

  const handleAddManually = () => {
    if (mode === "edit") {
      // For edit mode, show search modal to select existing customers
      setShowSearchModal(true);
    } else {
      // For create mode, show detail form to create new customer
      setEditingCustomer(null);
      setShowDetailForm(true);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowDetailForm(true);
  };

  const handleSelectExistingCustomer = (selectedCustomer) => {
    // Add selected customer to the list for editing
    const customerForEdit = {
      ...selectedCustomer,
      id: `MASS-EDIT-${Date.now()}-${customers.length + 1}`,
      status: "Draft",
    };

    setCustomers((prev) => [...prev, customerForEdit]);
    setShowSearchModal(false);
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
        id: `MASS-${Date.now()}-1`,
        customerAccount: "FE200001", // Customer Code
        mainCustomerName: "Imported Customer 1",
        mainCustomer: "FE001234M", // Main Customer
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
        id: `MASS-${Date.now()}-2`,
        customerAccount: "FE200002", // Customer Code
        mainCustomerName: "Imported Customer 2",
        mainCustomer: "FE005678M", // Main Customer
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

  const handleSendMassRequest = () => {
    if (customers.length === 0) return;
    setShowPackageTitleModal(true);
  };

  const handleConfirmSendRequest = () => {
    const massRequest = {
      id: `MASS-REQ-${Date.now()}`,
      requestType: mode === "edit" ? "MassEdit" : "MassCreate",
      requestTitle:
        packageTitle ||
        (mode === "edit"
          ? `Mass Edit ${customers.length} Customers`
          : `Mass Create ${customers.length} Customers`),
      stepOwner: "You - Sale Admin",
      currentSteps: "Waiting for Approval",
      status: "Pending",
      createdDate: new Date().toISOString(),
      customers: customers,
      totalCount: customers.length,
      mode: mode,
      packageTitle: packageTitle,
    };

    if (onSendBulkRequest) {
      onSendBulkRequest(massRequest);
    }
    setShowPackageTitleModal(false);
    setPackageTitle("");
  };

  const mockRequestData = {
    id: "MASS-NEW",
    requestType: "Create",
    requestTitle: "New Customer Record",
    stepOwner: "You - Sale Admin",
    currentSteps: "Waiting for Entry",
    status: "Draft",
    createdDate: new Date().toISOString(),
    isNew: true,
    isMassCreate: true, // Flag to indicate this is from mass create
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
                {mode === "edit"
                  ? "Mass Edit Customers"
                  : "Mass Create Customers"}
              </Text>
              <Text variant="caption" color="muted">
                {mode === "edit"
                  ? "Edit multiple existing customers at once"
                  : "Create multiple customers at once"}
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
                <div className="font-medium">
                  {mode === "edit" ? "Select Customer" : "Add Manually"}
                </div>
                <div className="text-xs text-white/80">
                  {mode === "edit"
                    ? "Choose existing customer"
                    : "Create one by one"}
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Customer List */}
      {customers.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <Text variant="heading" size="lg" weight="semibold">
                Customers to {mode === "edit" ? "Edit" : "Create"} (
                {customers.length})
              </Text>
              <Button
                variant="primary"
                onClick={handleSendMassRequest}
                disabled={customers.length === 0}
              >
                {mode === "edit"
                  ? `Send Mass Edit Request (${customers.length})`
                  : `Send Mass Request (${customers.length})`}
              </Button>
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

      {/* Customer Search Modal for Edit Mode */}
      <ObjectSelectModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        title="Select Customer to Edit"
        data={[
          {
            customerAccount: "FE100001",
            organizationName: "ABC Company Ltd.",
            mainCustomer: "FE001234M",
            company: "DHV",
            address: "123 Business Street, Jakarta",
            nikNpwp: "01.234.567.8-901.000",
            customerGroup: "LOC_EXT",
            customerType: "Organization",
          },
          {
            customerAccount: "FE100002",
            organizationName: "XYZ Corporation",
            mainCustomer: "FE005678M",
            company: "PBH",
            address: "456 Corporate Ave, Surabaya",
            nikNpwp: "02.345.678.9-012.000",
            customerGroup: "AQTP",
            customerType: "Organization",
          },
          {
            customerAccount: "FE100003",
            organizationName: "DEF Industries",
            mainCustomer: "FE009012M",
            company: "PHP",
            address: "789 Industrial Blvd, Bandung",
            nikNpwp: "03.456.789.0-123.000",
            customerGroup: "LSTP",
            customerType: "Organization",
          },
        ]}
        columns={[
          { key: "customerAccount", label: "Customer Code" },
          { key: "organizationName", label: "Customer Name" },
          { key: "mainCustomer", label: "Main Customer" },
          { key: "company", label: "Company" },
          { key: "customerGroup", label: "Customer Group" },
        ]}
        searchFields={[
          "customerAccount",
          "organizationName",
          "mainCustomer",
          "company",
          "customerGroup",
        ]}
        onSelect={handleSelectExistingCustomer}
        searchPlaceholder="Search customers..."
      />

      {/* Package Title Modal */}
      <Modal
        isOpen={showPackageTitleModal}
        onClose={() => setShowPackageTitleModal(false)}
        title="Package Title"
        size="md"
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            Enter a title for this{" "}
            {mode === "edit" ? "mass edit" : "mass create"} package:
          </Text>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Package Title *
            </Text>
            <Input
              value={packageTitle}
              onChange={(e) => setPackageTitle(e.target.value)}
              placeholder={`Enter package title for ${
                mode === "edit" ? "mass edit" : "mass create"
              }...`}
              className="w-full"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPackageTitleModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmSendRequest}
              disabled={!packageTitle.trim()}
            >
              {mode === "edit"
                ? `Send Mass Edit Request (${customers.length})`
                : `Send Mass Request (${customers.length})`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BulkCreatePage;
