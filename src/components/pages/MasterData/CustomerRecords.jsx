import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import { Search, Eye } from "lucide-react";
import CustomerRecordDetail from "./CustomerRecordDetail";

// Mock customer records data
const CUSTOMER_RECORDS = [
  {
    id: "CUST-001",
    customerCode: "ABC-CORP",
    customerName: "ABC Corporation",
    customerType: "Corporate",
    industry: "Manufacturing",
    country: "Vietnam",
    city: "Ho Chi Minh City",
    address: "123 Nguyen Hue Street, District 1",
    phone: "+84-28-1234-5678",
    email: "contact@abccorp.com",
    taxCode: "0123456789",
    creditLimit: 1000000,
    paymentTerms: "Net 30",
    status: "Active",
    createdDate: "2024-01-15",
    lastModified: "2024-12-01",
  },
  {
    id: "CUST-002",
    customerCode: "XYZ-LTD",
    customerName: "XYZ Limited",
    customerType: "SME",
    industry: "Retail",
    country: "Vietnam",
    city: "Hanoi",
    address: "456 Ba Trieu Street, Hai Ba Trung District",
    phone: "+84-24-9876-5432",
    email: "info@xyzltd.com",
    taxCode: "0987654321",
    creditLimit: 500000,
    paymentTerms: "Net 15",
    status: "Active",
    createdDate: "2024-02-20",
    lastModified: "2024-11-15",
  },
  {
    id: "CUST-003",
    customerCode: "DEF-TRADE",
    customerName: "DEF Trading Co.",
    customerType: "Corporate",
    industry: "Trading",
    country: "Netherlands",
    city: "Amsterdam",
    address: "789 Damrak Street, Amsterdam",
    phone: "+31-20-123-4567",
    email: "sales@deftrading.nl",
    taxCode: "NL123456789B01",
    creditLimit: 2000000,
    paymentTerms: "Net 45",
    status: "Active",
    createdDate: "2024-03-10",
    lastModified: "2024-12-05",
  },
];

const CustomerRecords = () => {
  const [records, setRecords] = useState(CUSTOMER_RECORDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredRecords = records.filter(
    (record) =>
      record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.customerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetail = (record) => {
    console.log("Viewing record:", record);
    setSelectedRecord(record);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedRecord(null);
  };

  console.log("showDetail:", showDetail, "selectedRecord:", selectedRecord);

  if (showDetail && selectedRecord) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleCloseDetail}>
            ← Back to Records
          </Button>
          <Text variant="heading" size="xl" weight="bold">
            Customer Detail: {selectedRecord.customerName}
          </Text>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <Text variant="body">
            Customer Code: {selectedRecord.customerCode}
          </Text>
          <Text variant="body">Email: {selectedRecord.email}</Text>
          <Text variant="body">Status: {selectedRecord.status}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Customer Records
        </Text>
        <Text variant="body" color="muted">
          View and manage customer master data records
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
            placeholder="Search customers..."
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
                Customer Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Industry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
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
                onClick={() => {
                  console.log("Row clicked:", record);
                  handleViewDetail(record);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body" weight="medium">
                    {record.customerCode}
                  </Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <Text variant="body" weight="medium">
                      {record.customerName}
                    </Text>
                    <Text variant="caption" color="muted">
                      {record.email}
                    </Text>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body">{record.customerType}</Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body">{record.industry}</Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Text variant="body">{record.country}</Text>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        record.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.status}
                    </span>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Button clicked:", record);
                        handleViewDetail(record);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredRecords.length} of {records.length} customer records
        </Text>
      </div>
    </div>
  );
};

export default CustomerRecords;
