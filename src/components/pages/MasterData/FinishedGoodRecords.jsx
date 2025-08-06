import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import { Search, Eye } from "lucide-react";

// Mock finished good records data
const FINISHED_GOOD_RECORDS = [
  {
    id: "FG-001",
    productCode: "FG-FEED-001",
    productName: "Premium Chicken Feed",
    category: "Animal Feed",
    subcategory: "Poultry Feed",
    brand: "NutriMax",
    unitOfMeasure: "KG",
    standardCost: 1.25,
    listPrice: 1.85,
    weight: 25,
    packageSize: "25kg bag",
    status: "Active",
    stockLevel: 500,
    reorderPoint: 100,
    createdDate: "2024-01-05",
    lastModified: "2024-11-30",
  },
  {
    id: "FG-002",
    productCode: "FG-SUPP-002",
    productName: "Vitamin Supplement Mix",
    category: "Supplements",
    subcategory: "Vitamins",
    brand: "VitaPlus",
    unitOfMeasure: "KG",
    standardCost: 8.5,
    listPrice: 12.0,
    weight: 1,
    packageSize: "1kg container",
    status: "Active",
    stockLevel: 200,
    reorderPoint: 50,
    createdDate: "2024-02-10",
    lastModified: "2024-12-02",
  },
];

const FinishedGoodRecords = () => {
  const [records, setRecords] = useState(FINISHED_GOOD_RECORDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredRecords = records.filter(
    (record) =>
      record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (showDetail && selectedRecord) {
    return (
      <div>
        <Text variant="body">Finished Good Detail - Coming Soon</Text>
        <Button onClick={handleCloseDetail}>Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Finished Good Records
        </Text>
        <Text variant="body" color="muted">
          View and manage finished good master data records
        </Text>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search finished goods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
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
                    {record.productCode}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <Text variant="body" weight="medium">
                      {record.productName}
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
                  <Text variant="body">{record.brand}</Text>
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
          Showing {filteredRecords.length} of {records.length} finished good
          records
        </Text>
      </div>
    </div>
  );
};

export default FinishedGoodRecords;
