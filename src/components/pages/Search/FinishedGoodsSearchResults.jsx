import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import Modal from "../../atoms/Modal";
import { Search as SearchIcon, ArrowLeft, Loader2 } from "lucide-react";

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
  const [showDynamic365Modal, setShowDynamic365Modal] = useState(false);
  const [showDynamic365SearchModal, setShowDynamic365SearchModal] =
    useState(false);
  const [dynamic365SearchTerm, setDynamic365SearchTerm] = useState("");
  const [isSearchingDynamic365, setIsSearchingDynamic365] = useState(false);
  const [dynamic365SearchCompleted, setDynamic365SearchCompleted] =
    useState(false);

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

  // Check if search has no results and should show Dynamic 365 modal
  const shouldShowDynamic365Suggestion =
    searchTerm.length > 0 && filteredRecords.length === 0;

  const handleToggleDynamic365 = () => {
    setSearchWithDynamic365(!searchWithDynamic365);
    console.log("Search with Dynamic 365:", !searchWithDynamic365);
    // Handle Dynamic 365 search integration
  };

  const handleSearchDynamic365 = () => {
    setShowDynamic365Modal(false);
    setDynamic365SearchTerm(searchTerm);
    setShowDynamic365SearchModal(true);
    setIsSearchingDynamic365(true);
    setDynamic365SearchCompleted(false);

    // Simulate search with 2 second delay
    setTimeout(() => {
      setIsSearchingDynamic365(false);
      setDynamic365SearchCompleted(true);
    }, 2000);
  };

  const handleCloseDynamic365SearchModal = () => {
    setShowDynamic365SearchModal(false);
    setDynamic365SearchCompleted(false);
    setIsSearchingDynamic365(false);
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
      {filteredRecords.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Text variant="body" color="muted" className="mb-4">
            No finished goods records found matching "{searchTerm}"
          </Text>
          <Button
            variant="outline"
            onClick={() => setShowDynamic365Modal(true)}
            className="mt-2"
          >
            Search on Dynamic 365
          </Button>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredRecords.length} of {FINISHED_GOODS_RECORDS.length}{" "}
          finished goods records
        </Text>
      </div>

      {/* Dynamic 365 Confirmation Modal */}
      <Modal
        isOpen={showDynamic365Modal}
        onClose={() => setShowDynamic365Modal(false)}
        title="Search on Dynamic 365"
      >
        <div className="space-y-4">
          <Text variant="body">
            No results found in local database. Do you want to search for "
            {searchTerm}" on Dynamic 365?
          </Text>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDynamic365Modal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSearchDynamic365}>
              Yes, Search Dynamic 365
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dynamic 365 Search Modal */}
      <Modal
        isOpen={showDynamic365SearchModal}
        onClose={handleCloseDynamic365SearchModal}
        title="Dynamic 365 Search"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SearchIcon size={20} className="text-gray-400" />
            <Input
              value={dynamic365SearchTerm}
              onChange={(e) => setDynamic365SearchTerm(e.target.value)}
              placeholder="Search on Dynamic 365..."
              disabled={isSearchingDynamic365}
              className="flex-1"
            />
          </div>

          {isSearchingDynamic365 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-blue-600 mr-2" />
              <Text variant="body" color="muted">
                Searching Dynamic 365...
              </Text>
            </div>
          )}

          {dynamic365SearchCompleted && !isSearchingDynamic365 && (
            <div className="text-center py-8">
              <Text variant="body" color="muted" className="mb-4">
                No data found on Dynamic 365 for "{dynamic365SearchTerm}"
              </Text>
              <Button
                variant="outline"
                onClick={handleCloseDynamic365SearchModal}
              >
                Close
              </Button>
            </div>
          )}

          {!isSearchingDynamic365 && !dynamic365SearchCompleted && (
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCloseDynamic365SearchModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsSearchingDynamic365(true);
                  setDynamic365SearchCompleted(false);
                  setTimeout(() => {
                    setIsSearchingDynamic365(false);
                    setDynamic365SearchCompleted(true);
                  }, 2000);
                }}
              >
                Search
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FinishedGoodsSearchResults;
