import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";

// Sample customer records data
const CUSTOMER_RECORDS = [
  {
    customerAccount: "FE016977",
    customerName: "Trần Mạnh Hiệp",
    classification: "Dealer",
    group: "LOC_EXT",
    type: "Person",
    mainCustomer: "FE016977M",
    city: "T. Thái Nguyên",
    currency: "VND",
    segment: "Feed - Miền Bắc",
    emailAddress: "hieptm@gmail.com",
  },
  {
    customerAccount: "FE017112",
    customerName: "Lê Thị Hồng",
    classification: "Reseller",
    group: "LOC_INT",
    type: "Company",
    mainCustomer: "FE017112",
    city: "TP. HCM",
    currency: "USD",
    segment: "Feed - Miền Trung",
    emailAddress: "hong.le@reseller.com",
  },
  {
    customerAccount: "FE016580",
    customerName: "Nguyễn Văn Dũng",
    classification: "Dealer",
    group: "LOC_EXT",
    type: "Person",
    mainCustomer: "FE016580M",
    city: "Hà Nội",
    currency: "VND",
    segment: "Feed - Miền Nam",
    emailAddress: "dungnv@dealer.vn",
  },
  {
    customerAccount: "FE017215",
    customerName: "Đặng Văn Nam",
    classification: "Dealer",
    group: "LOC_EXT",
    type: "Person",
    mainCustomer: "FE017215M",
    city: "Hải Dương",
    currency: "VND",
    segment: "Feed - Miền Bắc",
    emailAddress: "namdv@dealer.vn",
  },
  {
    customerAccount: "FE017350",
    customerName: "Công ty Minh Long",
    classification: "Retailer",
    group: "LOC_INT",
    type: "Company",
    mainCustomer: "FE017350",
    city: "Đà Nẵng",
    currency: "USD",
    segment: "Feed - Miền Trung",
    emailAddress: "info@minhlong.com",
  },
];

const CustomerSearchResults = ({ onBack, country }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchWithDynamic365, setSearchWithDynamic365] = useState(false);

  // Filter records based on search term
  const filteredRecords = CUSTOMER_RECORDS.filter(
    (record) =>
      record.customerAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.classification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.segment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleDynamic365 = () => {
    setSearchWithDynamic365(!searchWithDynamic365);
    console.log("Search with Dynamic 365:", !searchWithDynamic365);
    // Handle Dynamic 365 search integration
  };

  const getClassificationBadge = (classification) => {
    const colors = {
      Dealer: "bg-blue-100 text-blue-800",
      Reseller: "bg-green-100 text-green-800",
      Retailer: "bg-purple-100 text-purple-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[classification] || "bg-gray-100 text-gray-800"
    }`;
  };

  const getTypeBadge = (type) => {
    const colors = {
      Person: "bg-orange-100 text-orange-800",
      Company: "bg-indigo-100 text-indigo-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[type] || "bg-gray-100 text-gray-800"
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
            Customer Records - {country?.name}
          </Text>
          <Text variant="body" color="muted">
            Search and view customer information
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
            placeholder="Search customers..."
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
          <div className="min-w-[1200px]">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Customer Account</Table.HeaderCell>
                  <Table.HeaderCell>Customer Name</Table.HeaderCell>
                  <Table.HeaderCell>Classification</Table.HeaderCell>
                  <Table.HeaderCell>Group</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Main Customer</Table.HeaderCell>
                  <Table.HeaderCell>City</Table.HeaderCell>
                  <Table.HeaderCell>Currency</Table.HeaderCell>
                  <Table.HeaderCell>Segment</Table.HeaderCell>
                  <Table.HeaderCell>Email Address</Table.HeaderCell>
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
                        {record.customerAccount}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" weight="medium">
                        {record.customerName}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={getClassificationBadge(
                          record.classification
                        )}
                      >
                        {record.classification}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" className="font-mono text-sm">
                        {record.group}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={getTypeBadge(record.type)}>
                        {record.type}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" className="font-mono text-sm">
                        {record.mainCustomer}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body">{record.city}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" weight="medium">
                        {record.currency}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" className="text-sm">
                        {record.segment}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body" className="text-sm text-blue-600">
                        {record.emailAddress}
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
            No customer records found matching "{searchTerm}"
          </Text>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredRecords.length} of {CUSTOMER_RECORDS.length} customer
          records
        </Text>
      </div>
    </div>
  );
};

export default CustomerSearchResults;
