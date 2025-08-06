import { useState } from "react";
import { ArrowLeft, Upload, Download, Plus, Edit, Trash2 } from "lucide-react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import Input from "../../atoms/Input";
import MultiSelect from "../../atoms/MultiSelect";
import ObjectSelectModal from "../../atoms/ObjectSelectModal";
import SparePartsDetailForm from "./SparePartsDetailForm";

const SparePartsBulkCreatePage = ({
  mode = "create",
  onBack,
  onSendBulkRequest,
}) => {
  console.log("🔍 SparePartsBulkCreatePage mode:", mode);
  const [spareParts, setSpareParts] = useState([]);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [editingSparePart, setEditingSparePart] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showLegalEntityModal, setShowLegalEntityModal] = useState(false);
  const [selectedLegalEntities, setSelectedLegalEntities] = useState([
    "DHV",
    "DHBH",
    "DHHP",
  ]);

  const handleAddManually = () => {
    if (mode === "edit") {
      // For edit mode, show search modal to select existing spare parts
      setShowSearchModal(true);
    } else {
      // For create mode, show detail form to create new spare part
      setEditingSparePart(null);
      setShowDetailForm(true);
    }
  };

  const handleEditSparePart = (sparePart) => {
    setEditingSparePart(sparePart);
    setShowDetailForm(true);
  };

  const handleSelectExistingSparePart = (selectedSparePart) => {
    // Add selected spare part to the list for editing
    const sparePartForEdit = {
      ...selectedSparePart,
      id: `MASS-EDIT-${Date.now()}-${spareParts.length + 1}`,
      status: "Draft",
    };

    setSpareParts((prev) => [...prev, sparePartForEdit]);
    setShowSearchModal(false);
  };

  const handleDeleteSparePart = (sparePartId) => {
    setSpareParts((prev) => prev.filter((sp) => sp.id !== sparePartId));
  };

  const handleDownloadTemplate = () => {
    // Create CSV template for spare parts
    const headers = [
      "Item Number",
      "Product Name",
      "Product Number",
      "Business Sector",
      "Item Type",
      "Class Type",
      "Purchase Unit",
      "Sale Unit",
      "Inventory Unit",
      "Packing Group",
      "Bag Item",
      "Item Group",
    ];

    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spare_parts_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportExcel = () => {
    setShowImportModal(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImportFile(file);

      // Mock imported data for spare parts
      const mockImportedData = [
        {
          id: `MASS-${Date.now()}-1`,
          itemNumber: "SP200001",
          productName: "Imported Bearing",
          productNumber: "FE500001",
          businessSector: "Feed",
          itemType: "Unknown",
          classType: "Spare Part",
          company: "DHV",
          purchaseUnit: "PCS",
          saleUnit: "PCS",
          inventoryUnit: "PCS",
          packingGroup: "Bulk",
          bagItem: "No",
          itemGroup: "SPP",
          status: "Draft",
        },
        {
          id: `MASS-${Date.now()}-2`,
          itemNumber: "SP200002",
          productName: "Imported Filter",
          productNumber: "FE500002",
          businessSector: "Aqua",
          itemType: "Unknown",
          classType: "Spare Part",
          company: "", // Empty for red highlight test
          purchaseUnit: "PCS",
          saleUnit: "PCS",
          inventoryUnit: "PCS",
          packingGroup: "Bulk",
          bagItem: "Yes",
          itemGroup: "SPP",
          status: "Draft",
        },
      ];

      setSpareParts((prev) => [...prev, ...mockImportedData]);
      setShowImportModal(false);
      setImportFile(null);
    }
  };

  const handleSendMassRequest = () => {
    if (spareParts.length === 0) return;
    // Show legal entity selection modal
    setShowLegalEntityModal(true);
  };

  const handleConfirmSendRequest = () => {
    const massRequest = {
      id: `MASS-REQ-${Date.now()}`,
      requestType: mode === "edit" ? "Mass Edit" : "Mass Create",
      requestTitle:
        mode === "edit"
          ? `Mass Edit ${spareParts.length} Spare Parts`
          : `Mass Create ${spareParts.length} Spare Parts`,
      stepOwner: "You - Maintenance Admin",
      currentSteps: "Waiting for Approval",
      status: "Pending",
      createdDate: new Date().toISOString(),
      spareParts: spareParts,
      totalCount: spareParts.length,
      mode: mode,
      legalEntities: selectedLegalEntities,
    };

    if (onSendBulkRequest) {
      onSendBulkRequest(massRequest);
    }
    setShowLegalEntityModal(false);
  };

  // Mock request data for spare parts detail form
  const mockRequestData = {
    id: mode === "edit" ? "MASS-EDIT" : "MASS-NEW",
    requestType: mode === "edit" ? "Edit" : "Create",
    requestTitle:
      mode === "edit" ? "Edit Spare Part Record" : "New Spare Part Record",
    stepOwner: "You - Maintenance Admin",
    currentSteps: "Waiting for Entry",
    status: "Draft",
    createdDate: new Date().toISOString(),
    isNew: mode === "create",
    isMassCreate: true, // Flag to indicate this is from mass create/edit
    mode: mode, // Add mode to request data
  };

  // Debug: Log mockRequestData to see what's being passed
  console.log("🔍 SparePartsBulkCreatePage mockRequestData:", mockRequestData);

  if (showDetailForm) {
    return (
      <SparePartsDetailForm
        requestData={
          editingSparePart
            ? { ...mockRequestData, ...editingSparePart }
            : mockRequestData
        }
        onBack={() => setShowDetailForm(false)}
        onSave={(savedData) => {
          if (editingSparePart) {
            // Update existing spare part
            setSpareParts((prev) =>
              prev.map((sp) => (sp.id === editingSparePart.id ? savedData : sp))
            );
          } else {
            // Add new spare part with default values for table display
            const newSparePart = {
              ...savedData,
              id: `MASS-${Date.now()}-${spareParts.length + 1}`,
              status: "Draft",
              // Ensure required fields for table display
              itemNumber: savedData.itemNumber || `SP-${Date.now()}`,
              productName: savedData.productName || "New Spare Part",
              productNumber: savedData.productNumber || `PN-${Date.now()}`,
              businessSector: savedData.businessSector || "Feed",
              company: savedData.company || "DHV",
              purchaseUnit: savedData.purchaseUnit || "PCS",
            };
            setSpareParts((prev) => [...prev, newSparePart]);
          }
          setShowDetailForm(false);
          setEditingSparePart(null);
        }}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <div>
                <Text variant="heading" size="xl" weight="bold">
                  {mode === "edit"
                    ? "Mass Edit Spare Parts"
                    : "Mass Create Spare Parts"}
                </Text>
                <Text variant="caption" color="muted">
                  {mode === "edit"
                    ? "Edit multiple existing spare parts at once"
                    : "Create multiple spare parts at once"}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <Text
              variant="heading"
              size="lg"
              weight="semibold"
              className="mb-4"
            >
              {mode === "edit"
                ? "Choose how to select spare parts to edit"
                : "Choose how to add spare parts"}
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
                    {mode === "edit" ? "Select Spare Part" : "Add Manually"}
                  </div>
                  <div className="text-xs text-white/80">
                    {mode === "edit"
                      ? "Choose existing spare part"
                      : "Create one by one"}
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Spare Parts List */}
        {spareParts.length > 0 && (
          <div className="px-6 pb-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <Text variant="heading" size="lg" weight="semibold">
                    {mode === "edit"
                      ? `Spare Parts to Edit (${spareParts.length})`
                      : `Spare Parts to Create (${spareParts.length})`}
                  </Text>
                  <Button
                    variant="primary"
                    onClick={handleSendMassRequest}
                    disabled={spareParts.length === 0}
                  >
                    {mode === "edit"
                      ? `Send Mass Edit Request (${spareParts.length} spare parts)`
                      : `Send Mass Request (${spareParts.length} spare parts)`}
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <Table.Header>
                    <Table.HeaderCell>Item Number</Table.HeaderCell>
                    <Table.HeaderCell>Product Name</Table.HeaderCell>
                    <Table.HeaderCell>Product Number</Table.HeaderCell>
                    <Table.HeaderCell>Business Sector</Table.HeaderCell>
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell>Purchase Unit</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Header>
                  <Table.Body>
                    {spareParts.map((sparePart) => {
                      const isCompanyEmpty =
                        !sparePart.company || sparePart.company.trim() === "";

                      return (
                        <Table.Row
                          key={sparePart.id}
                          className={isCompanyEmpty ? "bg-red-50" : ""}
                        >
                          <Table.Cell>
                            <Text variant="body" weight="medium">
                              {sparePart.itemNumber || "-"}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text variant="body">
                              {sparePart.productName || "-"}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text variant="body">
                              {sparePart.productNumber || "-"}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text variant="body">
                              {sparePart.businessSector || "-"}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text variant="body">
                              {sparePart.company || "-"}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text variant="body">
                              {sparePart.purchaseUnit || "-"}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                              {sparePart.status}
                            </span>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditSparePart(sparePart)}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteSparePart(sparePart.id)
                                }
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
      </div>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Spare Parts"
      >
        <div className="space-y-4">
          <Text variant="body">
            Select an Excel file to import spare parts data.
          </Text>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {importFile && (
            <Text variant="caption" color="muted">
              Selected: {importFile.name}
            </Text>
          )}
        </div>
      </Modal>

      {/* Spare Part Search Modal for Edit Mode */}
      <ObjectSelectModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        title="Select Spare Part to Edit"
        data={[
          {
            itemNumber: "SP001",
            productName: "Bearing Assembly",
            productNumber: "FE400001",
            businessSector: "Feed",
            company: "DHV",
            purchaseUnit: "PCS",
            saleUnit: "PCS",
            inventoryUnit: "PCS",
            packingGroup: "Bulk",
            bagItem: "No",
            itemGroup: "SPP",
          },
          {
            itemNumber: "SP002",
            productName: "Motor Coupling",
            productNumber: "FE400002",
            businessSector: "Aqua",
            company: "DHBH",
            purchaseUnit: "PCS",
            saleUnit: "PCS",
            inventoryUnit: "PCS",
            packingGroup: "Bulk",
            bagItem: "No",
            itemGroup: "SPP",
          },
          {
            itemNumber: "SP003",
            productName: "Filter Element",
            productNumber: "FE400003",
            businessSector: "Pharma",
            company: "DHHP",
            purchaseUnit: "PCS",
            saleUnit: "PCS",
            inventoryUnit: "PCS",
            packingGroup: "Bulk",
            bagItem: "Yes",
            itemGroup: "SPP",
          },
        ]}
        columns={[
          { key: "itemNumber", label: "Item Number" },
          { key: "productName", label: "Product Name" },
          { key: "productNumber", label: "Product Number" },
          { key: "businessSector", label: "Business Sector" },
          { key: "company", label: "Company" },
        ]}
        searchFields={[
          "itemNumber",
          "productName",
          "productNumber",
          "businessSector",
          "company",
        ]}
        onSelect={handleSelectExistingSparePart}
        searchPlaceholder="Search spare parts..."
      />

      {/* Legal Entity Selection Modal */}
      {showLegalEntityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-4">
              <Text variant="heading" size="lg" weight="bold">
                Submit Request
              </Text>
              <Text variant="body" className="text-gray-600 mt-2">
                Which legal entities would you like to release this spare parts
                to?
              </Text>
            </div>

            <div className="mb-6">
              <Text variant="body" weight="medium" className="mb-3">
                Select Legal Entities:
              </Text>
              <MultiSelect
                options={[
                  { value: "DHV", label: "DHV" },
                  { value: "DHBH", label: "DHBH" },
                  { value: "DHHP", label: "DHHP" },
                  { value: "DHHY", label: "DHHY" },
                  { value: "DHGC", label: "DHGC" },
                  { value: "DHGD", label: "DHGD" },
                ]}
                value={selectedLegalEntities}
                onChange={setSelectedLegalEntities}
                placeholder="Select legal entities..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLegalEntityModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmSendRequest}>
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SparePartsBulkCreatePage;
