import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import { Search, Eye, Plus } from "lucide-react";
import SparePartsRequestList from "../MyRequest/SparePartsRequestList";
// import SparePartRecordDetail from "./SparePartRecordDetail";

// Mock spare part records data
const SPARE_PART_RECORDS = [
  {
    id: "PART-001",
    partNumber: "SP-ENG-001",
    partName: "Engine Oil Filter",
    category: "Engine Parts",
    subcategory: "Filters",
    manufacturer: "FilterTech Inc.",
    supplierCode: "SUPP-001",
    unitOfMeasure: "PCS",
    standardCost: 25.5,
    listPrice: 35.0,
    weight: 0.5,
    dimensions: "10x8x6 cm",
    status: "Active",
    stockLevel: 150,
    reorderPoint: 50,
    createdDate: "2024-01-10",
    lastModified: "2024-11-20",
  },
  {
    id: "PART-002",
    partNumber: "SP-BRK-002",
    partName: "Brake Pad Set",
    category: "Brake System",
    subcategory: "Brake Pads",
    manufacturer: "BrakeMaster Ltd.",
    supplierCode: "SUPP-002",
    unitOfMeasure: "SET",
    standardCost: 45.0,
    listPrice: 65.0,
    weight: 2.1,
    dimensions: "15x10x3 cm",
    status: "Active",
    stockLevel: 75,
    reorderPoint: 25,
    createdDate: "2024-02-15",
    lastModified: "2024-12-01",
  },
  {
    id: "PART-003",
    partNumber: "SP-ELC-003",
    partName: "Headlight Assembly",
    category: "Electrical",
    subcategory: "Lighting",
    manufacturer: "LightCorp",
    supplierCode: "SUPP-003",
    unitOfMeasure: "PCS",
    standardCost: 120.0,
    listPrice: 180.0,
    weight: 1.8,
    dimensions: "25x20x15 cm",
    status: "Active",
    stockLevel: 30,
    reorderPoint: 10,
    createdDate: "2024-03-20",
    lastModified: "2024-11-25",
  },
];

const REQUEST_TYPES = [
  { value: "Create", label: "Create New Record" },
  { value: "MassCreate", label: "Mass Create Records" },
  { value: "MassEdit", label: "Mass Edit Records" },
  { value: "Copy", label: "Copy Existing Record" },
  { value: "Extend", label: "Extend Existing Record" },
  { value: "Edit", label: "Edit Existing Record" },
];

const SparePartRecords = () => {
  const [records, setRecords] = useState(SPARE_PART_RECORDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestList, setShowRequestList] = useState(false);

  const filteredRecords = records.filter(
    (record) =>
      record.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedRecord(null);
  };

  const handleAddRequest = (requestType) => {
    setShowAddModal(false);

    // Generate a new request ID
    const newRequestId = `REQ-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${String(Math.floor(Math.random() * 1000)).padStart(
      3,
      "0"
    )}`;

    // Create request object
    const newRequest = {
      id: newRequestId,
      requestType: requestType,
      requestTitle: `${requestType} Spare Parts Request`,
      stepOwner: "You - Technical Manager",
      currentSteps: "Draft",
      status: "Draft",
      createdDate: new Date().toISOString(),
      submittedBy: "Current User",
    };

    // In a real app, you would save this to backend
    console.log("Created new request:", newRequest);

    // Show success message
    alert(
      `Successfully created ${requestType} request with ID: ${newRequestId}\n\nThe request has been saved as draft and can be found in My Request tab.`
    );
  };

  if (showDetail && selectedRecord) {
    return (
      <div>
        <Text variant="body">Spare Part Detail - Coming Soon</Text>
        <Button onClick={handleCloseDetail}>Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Spare Part Records
        </Text>
        <Text variant="body" color="muted">
          View and manage spare part master data records
        </Text>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search spare parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} />
          Add New Request
        </Button>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Part Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Part Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manufacturer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => handleViewDetail(record)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" weight="medium">
                    {record.partNumber}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <Text variant="body" weight="medium">
                      {record.partName}
                    </Text>
                    <Text variant="caption" color="muted">
                      {record.subcategory}
                    </Text>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body">{record.category}</Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body">{record.manufacturer}</Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <Text variant="body" weight="medium">
                      {record.stockLevel} {record.unitOfMeasure}
                    </Text>
                    <Text variant="caption" color="muted">
                      Reorder: {record.reorderPoint}
                    </Text>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      record.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredRecords.length} of {records.length} spare part
          records
        </Text>
      </div>

      {/* Add New Request Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Request"
      >
        <div className="space-y-4">
          <Text variant="body" color="muted">
            Select the type of request you want to create:
          </Text>
          <div className="grid grid-cols-1 gap-3">
            {REQUEST_TYPES.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                onClick={() => handleAddRequest(type.value)}
                className="justify-start"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SparePartRecords;
