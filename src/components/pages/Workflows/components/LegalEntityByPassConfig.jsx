import { useState } from "react";
import Button from "../../../atoms/Button";
import Text from "../../../atoms/Text";
import Modal from "../../../atoms/Modal";
import Select from "../../../atoms/Select";
import MultiSelect from "../../../atoms/MultiSelect";
import { Plus, Trash2 } from "lucide-react";

const LegalEntityByPassConfig = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [formData, setFormData] = useState({
    legalEntity: "",
    requestTypes: ["Create", "Edit", "Extend", "Copy"],
  });

  // Mock data for legal entities
  const legalEntities = [
    { value: "entity1", label: "Legal Entity 1" },
    { value: "entity2", label: "Legal Entity 2" },
    { value: "entity3", label: "Legal Entity 3" },
  ];

  // Request type options
  const requestTypeOptions = [
    { value: "Create", label: "Create" },
    { value: "Edit", label: "Edit" },
    { value: "Extend", label: "Extend" },
    { value: "Copy", label: "Copy" },
    { value: "Delete", label: "Delete" },
    { value: "Approve", label: "Approve" },
  ];

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (formData.legalEntity && formData.requestTypes.length > 0) {
      const newConfig = {
        id: Date.now(),
        legalEntity: formData.legalEntity,
        legalEntityLabel:
          legalEntities.find((e) => e.value === formData.legalEntity)?.label ||
          formData.legalEntity,
        requestTypes: formData.requestTypes,
      };
      setConfigs([...configs, newConfig]);
      setFormData({
        legalEntity: "",
        requestTypes: ["Create", "Edit", "Extend", "Copy"],
      });
      setIsModalOpen(false);
    }
  };

  const handleDelete = (id) => {
    setConfigs(configs.filter((config) => config.id !== id));
  };

  const handleCancel = () => {
    setFormData({
      legalEntity: "",
      requestTypes: ["Create", "Edit", "Extend", "Copy"],
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex justify-between items-center">
        <Text variant="heading" size="lg" weight="semibold">
          Legal Entity By Pass Configuration
        </Text>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={16} />
          Add Configuration
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Legal Entity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Types
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {configs.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center">
                  <Text variant="body" color="muted">
                    No data available
                  </Text>
                </td>
              </tr>
            ) : (
              configs.map((config) => (
                <tr key={config.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Text variant="body">{config.legalEntityLabel}</Text>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {config.requestTypes.map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(config.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Configuration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Add Legal Entity By Pass Configuration"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Legal Entity
            </label>
            <Select
              value={formData.legalEntity}
              onChange={(value) =>
                setFormData({ ...formData, legalEntity: value })
              }
              options={legalEntities}
              placeholder="Select Legal Entity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request Types
            </label>
            <MultiSelect
              value={formData.requestTypes}
              onChange={(values) =>
                setFormData({ ...formData, requestTypes: values })
              }
              options={requestTypeOptions}
              placeholder="Select Request Types"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.legalEntity || formData.requestTypes.length === 0
              }
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LegalEntityByPassConfig;
