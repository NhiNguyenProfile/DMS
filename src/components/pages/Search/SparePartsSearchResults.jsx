import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";

// Sample spare parts records data
const SPARE_PARTS_RECORDS = [
  {
    itemNumber: "SP-001",
    productName: "Động cơ trộn ngang",
    productType: "Equipment",
    purchaseUnit: "PIECE",
    vendorCheck: "Yes",
    salesTaxGroup: "VAT",
    inventoryUnit: "PIECE",
    bagItem: "No",
    cwProduct: "No",
    businessSector: "Engineering",
  },
  {
    itemNumber: "SP-002",
    productName: "Ống nhựa dẫn khí",
    productType: "Spare Part",
    purchaseUnit: "METER",
    vendorCheck: "No Check",
    salesTaxGroup: "VAT",
    inventoryUnit: "METER",
    bagItem: "No",
    cwProduct: "No",
    businessSector: "Maintenance",
  },
  {
    itemNumber: "SP-003",
    productName: "Bạc đạn máy ép",
    productType: "Spare Part",
    purchaseUnit: "PIECE",
    vendorCheck: "No Check",
    salesTaxGroup: "VAT",
    inventoryUnit: "PIECE",
    bagItem: "No",
    cwProduct: "No",
    businessSector: "Feed",
  },
  {
    itemNumber: "SP-004",
    productName: "Cảm biến nhiệt độ",
    productType: "Spare Part",
    purchaseUnit: "PIECE",
    vendorCheck: "Yes",
    salesTaxGroup: "VAT",
    inventoryUnit: "PIECE",
    bagItem: "No",
    cwProduct: "No",
    businessSector: "Premix",
  },
  {
    itemNumber: "SP-005",
    productName: "Van khí nén",
    productType: "Spare Part",
    purchaseUnit: "PIECE",
    vendorCheck: "No Check",
    salesTaxGroup: "VAT",
    inventoryUnit: "PIECE",
    bagItem: "No",
    cwProduct: "No",
    businessSector: "Aqua",
  },
];

const SparePartsSearchResults = ({ onBack, country }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchWithDynamic365, setSearchWithDynamic365] = useState(false);

  // Filter records based on search term
  const filteredRecords = SPARE_PARTS_RECORDS.filter(
    (record) =>
      record.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.businessSector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.purchaseUnit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDynamic365 = () => {
    setSearchWithDynamic365(!searchWithDynamic365);
    console.log("Search with Dynamic 365:", !searchWithDynamic365);
    // Handle Dynamic 365 search integration
  };

  const getProductTypeBadge = (type) => {
    const colors = {
      Equipment: "bg-purple-100 text-purple-800",
      "Spare Part": "bg-blue-100 text-blue-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[type] || "bg-gray-100 text-gray-800"
    }`;
  };

  const getVendorCheckBadge = (check) => {
    const colors = {
      Yes: "bg-green-100 text-green-800",
      "No Check": "bg-red-100 text-red-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[check] || "bg-gray-100 text-gray-800"
    }`;
  };

  const getBusinessSectorBadge = (sector) => {
    const colors = {
      Engineering: "bg-indigo-100 text-indigo-800",
      Maintenance: "bg-orange-100 text-orange-800",
      Feed: "bg-green-100 text-green-800",
      Premix: "bg-yellow-100 text-yellow-800",
      Aqua: "bg-cyan-100 text-cyan-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[sector] || "bg-gray-100 text-gray-800"
    }`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <Text variant="heading" size="xl" weight="bold" className="mb-2">
            Spare Part Records - {country?.name}
          </Text>
          <Text variant="body" color="muted">
            Search and view spare parts inventory
          </Text>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md">
          <SearchIcon
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
          variant={searchWithDynamic365 ? "primary" : "outline"}
          onClick={handleToggleDynamic365}
          size="small"
        >
          {searchWithDynamic365 ? "✓ Dynamic 365" : "Search with Dynamic 365"}
        </Button>
      </div>

      {/* Results Table */}
      <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[1100px]">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Item Number</Table.HeaderCell>
                  <Table.HeaderCell>Product Name</Table.HeaderCell>
                  <Table.HeaderCell>Product Type</Table.HeaderCell>
                  <Table.HeaderCell>Purchase Unit</Table.HeaderCell>
                  <Table.HeaderCell>Vendor Check</Table.HeaderCell>
                  <Table.HeaderCell>Sales Tax Group</Table.HeaderCell>
                  <Table.HeaderCell>Inventory Unit</Table.HeaderCell>
                  <Table.HeaderCell>Bag Item</Table.HeaderCell>
                  <Table.HeaderCell>CW Product</Table.HeaderCell>
                  <Table.HeaderCell>Business Sector</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredRecords.map((record, index) => (
                  <Table.Row key={index} className="hover:bg-gray-50">
                    <Table.Cell>
                      <Text
                        variant="body"
                        weight="medium"
                        className="font-mono text-sm"
                      >
                        {record.itemNumber}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" weight="medium">
                        {record.productName}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={getProductTypeBadge(record.productType)}>
                        {record.productType}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Text
                        variant="body"
                        weight="medium"
                        className="font-mono"
                      >
                        {record.purchaseUnit}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={getVendorCheckBadge(record.vendorCheck)}>
                        {record.vendorCheck}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" weight="medium">
                        {record.salesTaxGroup}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text
                        variant="body"
                        weight="medium"
                        className="font-mono"
                      >
                        {record.inventoryUnit}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" className="text-sm">
                        {record.bagItem}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" className="text-sm">
                        {record.cwProduct}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={getBusinessSectorBadge(
                          record.businessSector
                        )}
                      >
                        {record.businessSector}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

      {/* No results */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <Text variant="body" color="muted">
            No spare parts records found matching "{searchTerm}"
          </Text>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredRecords.length} of {SPARE_PARTS_RECORDS.length} spare
          parts records
        </Text>
      </div>
    </div>
  );
};

export default SparePartsSearchResults;
