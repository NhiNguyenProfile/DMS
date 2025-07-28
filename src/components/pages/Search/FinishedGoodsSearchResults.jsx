import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";

// Sample finished goods records data
const FINISHED_GOODS_RECORDS = [
  {
    itemNumber: "FG-001",
    productName: "Bột Premix Gà 5%",
    sku: "FG5GA123",
    productForm: "Powder",
    packagingType: "25kg Bag",
    salesUnit: "BAG",
    salesTaxGroup: "VAT",
    dhcSync: "No",
    warehouse: "Factory WH Rajpura",
  },
  {
    itemNumber: "FG-002",
    productName: "Premix Heo nái",
    sku: "FGHEONAI02",
    productForm: "Granule",
    packagingType: "20kg Sack",
    salesUnit: "BAG",
    salesTaxGroup: "VAT",
    dhcSync: "No",
    warehouse: "HCM Finished Goods WH",
  },
  {
    itemNumber: "FG-003",
    productName: "Bổ sung Vitamin B12",
    sku: "FGVITB1203",
    productForm: "Liquid",
    packagingType: "5L Can",
    salesUnit: "LITER",
    salesTaxGroup: "VAT",
    dhcSync: "Yes",
    warehouse: "Hải Dương Central WH",
  },
  {
    itemNumber: "FG-004",
    productName: "Cám tăng trọng Gà",
    sku: "FGTTGA-04",
    productForm: "Pellet",
    packagingType: "40kg Bag",
    salesUnit: "BAG",
    salesTaxGroup: "VAT",
    dhcSync: "No",
    warehouse: "Bình Dương Distribution",
  },
  {
    itemNumber: "FG-005",
    productName: "Dinh dưỡng tôm siêu tốc",
    sku: "FGTOM2025",
    productForm: "Powder",
    packagingType: "10kg Bag",
    salesUnit: "BAG",
    salesTaxGroup: "VAT",
    dhcSync: "Yes",
    warehouse: "Cần Thơ Finished WH",
  },
];

const FinishedGoodsSearchResults = ({ onBack, country }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchWithDynamic365, setSearchWithDynamic365] = useState(false);

  // Filter records based on search term
  const filteredRecords = FINISHED_GOODS_RECORDS.filter(
    (record) =>
      record.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.productForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.packagingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDynamic365 = () => {
    setSearchWithDynamic365(!searchWithDynamic365);
    console.log("Search with Dynamic 365:", !searchWithDynamic365);
    // Handle Dynamic 365 search integration
  };

  const getProductFormBadge = (form) => {
    const colors = {
      Powder: "bg-yellow-100 text-yellow-800",
      Granule: "bg-green-100 text-green-800",
      Liquid: "bg-blue-100 text-blue-800",
      Pellet: "bg-orange-100 text-orange-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[form] || "bg-gray-100 text-gray-800"
    }`;
  };

  const getSyncBadge = (sync) => {
    const colors = {
      Yes: "bg-green-100 text-green-800",
      No: "bg-red-100 text-red-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[sync] || "bg-gray-100 text-gray-800"
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
            Finished Good Records - {country?.name}
          </Text>
          <Text variant="body" color="muted">
            Search and view finished goods inventory
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
            placeholder="Search finished goods..."
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
          <div className="min-w-[1000px]">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Item Number</Table.HeaderCell>
                  <Table.HeaderCell>Product Name</Table.HeaderCell>
                  <Table.HeaderCell>SKU</Table.HeaderCell>
                  <Table.HeaderCell>Product Form</Table.HeaderCell>
                  <Table.HeaderCell>Packaging Type</Table.HeaderCell>
                  <Table.HeaderCell>Sales Unit</Table.HeaderCell>
                  <Table.HeaderCell>Sales Tax Group</Table.HeaderCell>
                  <Table.HeaderCell>DHC Sync</Table.HeaderCell>
                  <Table.HeaderCell>Warehouse</Table.HeaderCell>
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
                      <Text variant="body" className="font-mono text-sm">
                        {record.sku}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={getProductFormBadge(record.productForm)}>
                        {record.productForm}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" className="text-sm">
                        {record.packagingType}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text
                        variant="body"
                        weight="medium"
                        className="font-mono"
                      >
                        {record.salesUnit}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" weight="medium">
                        {record.salesTaxGroup}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={getSyncBadge(record.dhcSync)}>
                        {record.dhcSync}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" className="text-sm">
                        {record.warehouse}
                      </Text>
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
            No finished goods records found matching "{searchTerm}"
          </Text>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredRecords.length} of {FINISHED_GOODS_RECORDS.length}{" "}
          finished goods records
        </Text>
      </div>
    </div>
  );
};

export default FinishedGoodsSearchResults;
