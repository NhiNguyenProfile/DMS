import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import Input from "../../atoms/Input";
import AdvancedObjectSelectModal from "../../atoms/AdvancedObjectSelectModal";
import FieldSelectionModal from "../../atoms/FieldSelectionModal";
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
  const [showFieldSelectionModal, setShowFieldSelectionModal] = useState(false);

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

  const handleSelectExistingCustomer = (selectedCustomers) => {
    // Add selected customers to the list for editing
    const customersForEdit = selectedCustomers.map(
      (selectedCustomer, index) => ({
        ...selectedCustomer,
        id: `MASS-EDIT-${Date.now()}-${customers.length + index + 1}`,
        status: "Draft",
      })
    );

    setCustomers((prev) => [...prev, ...customersForEdit]);
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
    // Show field selection modal instead of directly downloading
    setShowFieldSelectionModal(true);
  };

  const handleFieldSelectionConfirm = (selectedFields) => {
    // Generate CSV with selected fields
    const headers = selectedFields.map((field) => field.label);
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
              variant="primary"
              onClick={handleAddManually}
              className="h-14 flex gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center text-sky-500 justify-center">
                1
              </div>
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
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="h-14 flex gap-2"
            >
              <div className="w-6 h-6 rounded-full !text-sky-500 bg-sky-100 flex items-center justify-center">
                2
              </div>
              <div className="text-center">
                <div className="font-medium">Download Template</div>
                <div className="text-xs text-gray-500">Get CSV template</div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowImportModal(true)}
              className="h-14 flex gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-sky-100 !text-sky-500 flex items-center justify-center">
                3
              </div>
              <div className="text-center">
                <div className="font-medium">Import Excel</div>
                <div className="text-xs text-gray-500">
                  Upload CSV/Excel file
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
      <AdvancedObjectSelectModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        title="Select Customers to Edit"
        allData={[
          // DHV Legal Entity
          {
            customerAccount: "FE100001",
            organizationName: "ABC Company Ltd.",
            mainCustomer: "FE001234M",
            company: "DHV",
            address: "123 Business Street, Jakarta",
            nikNpwp: "01.234.567.8-901.000",
            customerGroup: "LOC_EXT",
            customerType: "Organization",
            legalEntity: "DHV",
            customerClassificationGroup: "External",
            searchName: "ABC Company",
          },
          {
            customerAccount: "FE100002",
            organizationName: "XYZ Corporation",
            mainCustomer: "FE005678M",
            company: "DHV",
            address: "456 Corporate Ave, Surabaya",
            nikNpwp: "02.345.678.9-012.000",
            customerGroup: "AQTP",
            customerType: "Organization",
            legalEntity: "DHV",
            customerClassificationGroup: "Dealer",
            searchName: "XYZ Corp",
          },
          {
            customerAccount: "FE100003",
            organizationName: "DEF Industries",
            mainCustomer: "FE009012M",
            company: "DHV",
            address: "789 Industrial Blvd, Bandung",
            nikNpwp: "03.456.789.0-123.000",
            customerGroup: "LSTP",
            customerType: "Organization",
            legalEntity: "DHV",
            customerClassificationGroup: "External",
            searchName: "DEF Industries",
          },
          // PBH Legal Entity
          {
            customerAccount: "PB200001",
            organizationName: "Global Trading Co.",
            mainCustomer: "PB001234M",
            company: "PBH",
            address: "100 Trade Center, Jakarta",
            nikNpwp: "04.567.890.1-234.000",
            customerGroup: "LOC_EXT",
            customerType: "Organization",
            legalEntity: "PBH",
            customerClassificationGroup: "External",
            searchName: "Global Trading",
          },
          {
            customerAccount: "PB200002",
            organizationName: "Tech Solutions Ltd.",
            mainCustomer: "PB005678M",
            company: "PBH",
            address: "200 Tech Park, Surabaya",
            nikNpwp: "05.678.901.2-345.000",
            customerGroup: "AQTP",
            customerType: "Organization",
            legalEntity: "PBH",
            customerClassificationGroup: "Dealer",
            searchName: "Tech Solutions",
          },
          // PHP Legal Entity
          {
            customerAccount: "PH300001",
            organizationName: "Manufacturing Corp.",
            mainCustomer: "PH001234M",
            company: "PHP",
            address: "300 Industrial Zone, Bandung",
            nikNpwp: "06.789.012.3-456.000",
            customerGroup: "LSTP",
            customerType: "Organization",
            legalEntity: "PHP",
            customerClassificationGroup: "External",
            searchName: "Manufacturing Corp",
          },
          {
            customerAccount: "PH300002",
            organizationName: "Export Import Co.",
            mainCustomer: "PH005678M",
            company: "PHP",
            address: "400 Port Area, Jakarta",
            nikNpwp: "07.890.123.4-567.000",
            customerGroup: "LOC_EXT",
            customerType: "Organization",
            legalEntity: "PHP",
            customerClassificationGroup: "Dealer",
            searchName: "Export Import",
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
          "searchName",
        ]}
        legalEntities={[
          { value: "DHV", label: "DHV" },
          { value: "PBH", label: "PBH" },
          { value: "PHP", label: "PHP" },
        ]}
        onSelect={handleSelectExistingCustomer}
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

      {/* Field Selection Modal */}
      <FieldSelectionModal
        isOpen={showFieldSelectionModal}
        onClose={() => setShowFieldSelectionModal(false)}
        onConfirm={handleFieldSelectionConfirm}
        title="Select Fields for CSV Template"
      />
    </div>
  );
};

export default BulkCreatePage;
