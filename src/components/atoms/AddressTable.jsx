import { useState } from "react";
import Text from "./Text";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Modal from "./Modal";
import Table from "./Table";
import { Plus, Edit, Trash2 } from "lucide-react";

const AddressTable = ({ addresses = [], onChange, disabled = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    city: "",
    district: "",
    street: "",
    finalCountryRegion: "VNM",
    countryRegionISO: "VN",
    state: "",
    addressDescription: "",
  });

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      city: "",
      district: "",
      street: "",
      finalCountryRegion: "VNM",
      countryRegionISO: "VN",
      state: "",
      addressDescription: "",
    });
    setShowModal(true);
  };

  const handleEditAddress = (address, index) => {
    setEditingAddress(index);
    setFormData({ ...address });
    setShowModal(true);
  };

  const handleDeleteAddress = (index) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    onChange(newAddresses);
  };

  const handleSaveAddress = () => {
    if (!formData.city || !formData.district || !formData.street) {
      alert("Please fill in required fields: City, District, and Street");
      return;
    }

    const newAddress = {
      ...formData,
      id: editingAddress !== null ? addresses[editingAddress].id : Date.now(),
    };

    let newAddresses;
    if (editingAddress !== null) {
      // Update existing address
      newAddresses = addresses.map((addr, index) =>
        index === editingAddress ? newAddress : addr
      );
    } else {
      // Add new address
      newAddresses = [...addresses, newAddress];
    }

    onChange(newAddresses);
    setShowModal(false);
    setEditingAddress(null);
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <Text variant="heading" size="lg" weight="semibold">
          Addresses ({addresses.length})
        </Text>
        {!disabled && (
          <Button variant="primary" size="sm" onClick={handleAddAddress}>
            <Plus size={16} className="mr-2" />
            Add Address
          </Button>
        )}
      </div>

      {/* Address Table */}
      {addresses.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <Table.Header>
              <Table.HeaderCell>City</Table.HeaderCell>
              <Table.HeaderCell>District</Table.HeaderCell>
              <Table.HeaderCell>Street</Table.HeaderCell>
              <Table.HeaderCell>Country</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              {!disabled && <Table.HeaderCell>Actions</Table.HeaderCell>}
            </Table.Header>
            <Table.Body>
              {addresses.map((address, index) => (
                <Table.Row key={address.id || index}>
                  <Table.Cell>
                    <Text variant="body" weight="medium">
                      {address.city}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{address.district}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{address.street}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">
                      {address.finalCountryRegion} ({address.countryRegionISO})
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{address.state || "-"}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">
                      {address.addressDescription || "-"}
                    </Text>
                  </Table.Cell>
                  {!disabled && (
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAddress(address, index)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAddress(index)}
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
          <Text variant="body" color="muted">
            No addresses added yet
          </Text>
          {!disabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddAddress}
              className="mt-3"
            >
              <Plus size={16} className="mr-2" />
              Add First Address
            </Button>
          )}
        </div>
      )}

      {/* Address Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAddress !== null ? "Edit Address" : "Add Address"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                City <span className="text-red-500">*</span>
              </Text>
              <Input
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city"
              />
            </div>

            <div>
              <Text variant="body" weight="medium" className="mb-2">
                District <span className="text-red-500">*</span>
              </Text>
              <Input
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                placeholder="Enter district"
              />
            </div>
          </div>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Street <span className="text-red-500">*</span>
            </Text>
            <Input
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              placeholder="Enter street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Country/Region
              </Text>
              <Select
                options={[
                  { value: "VNM", label: "Vietnam" },
                  { value: "IDN", label: "Indonesia" },
                ]}
                value={formData.finalCountryRegion}
                onChange={(val) => {
                  handleInputChange("finalCountryRegion", val);
                  // Auto-set ISO code
                  handleInputChange(
                    "countryRegionISO",
                    val === "VNM" ? "VN" : "ID"
                  );
                }}
              />
            </div>

            <div>
              <Text variant="body" weight="medium" className="mb-2">
                State/Province
              </Text>
              <Input
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="Enter state/province"
              />
            </div>
          </div>

          <div>
            <Text variant="body" weight="medium" className="mb-2">
              Address Description
            </Text>
            <Input
              value={formData.addressDescription}
              onChange={(e) =>
                handleInputChange("addressDescription", e.target.value)
              }
              placeholder="Enter address description"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveAddress}>
              {editingAddress !== null ? "Update" : "Add"} Address
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressTable;
