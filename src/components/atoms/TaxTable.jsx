import { useState } from "react";
import Text from "./Text";
import Button from "./Button";
import Input from "./Input";
import Toggle from "./Toggle";
import Modal from "./Modal";
import Table from "./Table";
import { Plus, Edit, Trash2 } from "lucide-react";

const TaxTable = ({ taxRecords = [], onChange, disabled = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [formData, setFormData] = useState({
    taxExemptNumber: "",
    companyName: "",
    nik: "",
    nonNpwp: false,
  });

  const handleAddTax = () => {
    setEditingTax(null);
    setFormData({
      taxExemptNumber: "",
      companyName: "",
      nik: "",
      nonNpwp: false,
    });
    setShowModal(true);
  };

  const handleEditTax = (tax, index) => {
    setEditingTax(index);
    setFormData({ ...tax });
    setShowModal(true);
  };

  const handleDeleteTax = (index) => {
    const newTaxRecords = taxRecords.filter((_, i) => i !== index);
    onChange(newTaxRecords);
  };

  const handleSaveTax = () => {
    if (!formData.taxExemptNumber || !formData.companyName || !formData.nik) {
      alert("Please fill in required fields: Tax Exempt Number, Company Name, and NIK");
      return;
    }

    const newTax = {
      ...formData,
      id: editingTax !== null ? taxRecords[editingTax].id : Date.now(),
    };

    let newTaxRecords;
    if (editingTax !== null) {
      // Update existing tax record
      newTaxRecords = taxRecords.map((tax, index) =>
        index === editingTax ? newTax : tax
      );
    } else {
      // Add new tax record
      newTaxRecords = [...taxRecords, newTax];
    }

    onChange(newTaxRecords);
    setShowModal(false);
    setEditingTax(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      {!disabled && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTax}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Tax Record
          </Button>
        </div>
      )}

      {/* Tax Table */}
      {taxRecords.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <Table.Header>
              <Table.HeaderCell>Tax Exempt Number</Table.HeaderCell>
              <Table.HeaderCell>Company Name</Table.HeaderCell>
              <Table.HeaderCell>NIK</Table.HeaderCell>
              <Table.HeaderCell>Non NPWP</Table.HeaderCell>
              {!disabled && <Table.HeaderCell>Actions</Table.HeaderCell>}
            </Table.Header>
            <Table.Body>
              {taxRecords.map((tax, index) => (
                <Table.Row key={tax.id || index}>
                  <Table.Cell>
                    <Text variant="body" weight="medium">
                      {tax.taxExemptNumber}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{tax.companyName}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{tax.nik}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">
                      {tax.nonNpwp ? "Yes" : "No"}
                    </Text>
                  </Table.Cell>
                  {!disabled && (
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTax(tax, index)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTax(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-8 text-center">
          <Text variant="body" className="text-gray-500">
            No tax records added yet.
          </Text>
          {!disabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddTax}
              className="mt-4 flex items-center gap-2 mx-auto"
            >
              <Plus size={16} />
              Add Tax Record
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTax !== null ? "Edit Tax Record" : "Add Tax Record"}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Tax Exempt Number *
              </Text>
              <Input
                value={formData.taxExemptNumber}
                onChange={(e) => handleInputChange("taxExemptNumber", e.target.value)}
                placeholder="Enter tax exempt number"
              />
            </div>

            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Company Name *
              </Text>
              <Input
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div>
              <Text variant="body" weight="medium" className="mb-2">
                NIK *
              </Text>
              <Input
                value={formData.nik}
                onChange={(e) => handleInputChange("nik", e.target.value)}
                placeholder="Enter NIK"
              />
            </div>

            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Non NPWP
              </Text>
              <Toggle
                checked={formData.nonNpwp}
                onChange={(checked) => handleInputChange("nonNpwp", checked)}
                label={formData.nonNpwp ? "Yes" : "No"}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveTax}
            >
              {editingTax !== null ? "Update" : "Add"} Tax Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaxTable;
