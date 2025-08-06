import { useState } from "react";
import Text from "../../atoms/Text";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import Table from "../../atoms/Table";
import ColumnVisibilityFilter from "../../atoms/ColumnVisibilityFilter";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";

// Sample main customer records data
const MAIN_CUSTOMER_RECORDS = [
  {
    mainCustomer: "FE005678M",
    mainCustomerName: "PT Charoen Pokphand Indonesia",
    company: "DHV",
    address: "Jl. Ancol Barat No. 1-3, Jakarta Utara",
    nikNpwp: "01.234.567.8-901.000",
    customerClassificationGroup: "Key Account",
    customerGroup: "CORP",
    customerType: "Organization",
    organizationName: "PT Charoen Pokphand Indonesia Tbk",
    searchName: "CP Indonesia",
  },
  {
    mainCustomer: "FE005679M",
    mainCustomerName: "PT Japfa Comfeed Indonesia",
    company: "DHBH",
    address: "Jl. Letjen S. Parman Kav. 35, Jakarta Barat",
    nikNpwp: "02.345.678.9-012.000",
    customerClassificationGroup: "Strategic Partner",
    customerGroup: "FEED",
    customerType: "Organization",
    organizationName: "PT Japfa Comfeed Indonesia Tbk",
    searchName: "Japfa Comfeed",
  },
  {
    mainCustomer: "FE005680M",
    mainCustomerName: "PT Sierad Produce",
    company: "DHHP",
    address: "Jl. Raya Serang Km. 18, Tangerang",
    nikNpwp: "03.456.789.0-123.000",
    customerClassificationGroup: "Premium",
    customerGroup: "POULTRY",
    customerType: "Organization",
    organizationName: "PT Sierad Produce Tbk",
    searchName: "Sierad",
  },
  {
    mainCustomer: "FE005681M",
    mainCustomerName: "PT Malindo Feedmill",
    company: "DHV",
    address: "Jl. Industri Raya No. 45, Bekasi",
    nikNpwp: "04.567.890.1-234.000",
    customerClassificationGroup: "Standard",
    customerGroup: "FEED",
    customerType: "Organization",
    organizationName: "PT Malindo Feedmill Tbk",
    searchName: "Malindo",
  },
  {
    mainCustomer: "FE005682M",
    mainCustomerName: "PT Wonokoyo Jaya Corporindo",
    company: "DHBH",
    address: "Jl. Raya Surabaya-Malang Km. 45, Pasuruan",
    nikNpwp: "05.678.901.2-345.000",
    customerClassificationGroup: "Premium",
    customerGroup: "POULTRY",
    customerType: "Organization",
    organizationName: "PT Wonokoyo Jaya Corporindo Tbk",
    searchName: "Wonokoyo",
  },
  {
    mainCustomer: "FE005683M",
    mainCustomerName: "PT Central Proteina Prima",
    company: "DHHP",
    address: "Jl. Raya Serang Km. 25, Tangerang",
    nikNpwp: "06.789.012.3-456.000",
    customerClassificationGroup: "Key Account",
    customerGroup: "AQUA",
    customerType: "Organization",
    organizationName: "PT Central Proteina Prima Tbk",
    searchName: "CPP",
  },
  {
    mainCustomer: "FE005684M",
    mainCustomerName: "PT Sentra Food Indonesia",
    company: "DHV",
    address: "Jl. Industri Selatan No. 12, Tangerang",
    nikNpwp: "07.890.123.4-567.000",
    customerClassificationGroup: "Standard",
    customerGroup: "SWINE",
    customerType: "Organization",
    organizationName: "PT Sentra Food Indonesia",
    searchName: "Sentra Food",
  },
  {
    mainCustomer: "FE005685M",
    mainCustomerName: "PT Budi Starch & Sweetener",
    company: "DHBH",
    address: "Jl. Raya Lampung Km. 8, Lampung",
    nikNpwp: "08.901.234.5-678.000",
    customerClassificationGroup: "Premium",
    customerGroup: "DAIRY",
    customerType: "Organization",
    organizationName: "PT Budi Starch & Sweetener Tbk",
    searchName: "Budi Starch",
  },
];

// Helper function to get classification badge styling
const getClassificationBadge = (classification) => {
  switch (classification) {
    case "Key Account":
      return "px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800";
    case "Strategic Partner":
      return "px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800";
    case "Premium":
      return "px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800";
    case "Standard":
      return "px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800";
    default:
      return "px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800";
  }
};

// Helper function to get customer group badge styling
const getCustomerGroupBadge = (group) => {
  switch (group) {
    case "CORP":
      return "px-2 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-800";
    case "FEED":
      return "px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-800";
    case "POULTRY":
      return "px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800";
    case "AQUA":
      return "px-2 py-1 text-xs font-medium rounded bg-cyan-100 text-cyan-800";
    case "SWINE":
      return "px-2 py-1 text-xs font-medium rounded bg-pink-100 text-pink-800";
    case "DAIRY":
      return "px-2 py-1 text-xs font-medium rounded bg-emerald-100 text-emerald-800";
    default:
      return "px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800";
  }
};

// Define all available columns
const ALL_COLUMNS = [
  {
    key: "mainCustomer",
    label: "Main Customer",
    description: "Main customer code (FE format)",
  },
  {
    key: "mainCustomerName",
    label: "Main Customer Name",
    description: "Full company name",
  },
  { key: "company", label: "Company", description: "Legal entity code" },
  {
    key: "customerClassificationGroup",
    label: "Classification Group",
    description: "Customer classification level",
  },
  {
    key: "customerGroup",
    label: "Customer Group",
    description: "Business segment group",
  },
  {
    key: "customerType",
    label: "Customer Type",
    description: "Organization or Person",
  },
  {
    key: "organizationName",
    label: "Organization Name",
    description: "Full organization name",
  },
  { key: "searchName", label: "Search Name", description: "Short search name" },
  {
    key: "nikNpwp",
    label: "NIK/NPWP",
    description: "Tax identification number",
  },
  { key: "address", label: "Address", description: "Full address" },
];

const MainCustomerSearchResults = ({ onBack, country }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Default visible columns (first 6 columns)
  const [visibleColumns, setVisibleColumns] = useState([
    "mainCustomer",
    "mainCustomerName",
    "company",
    "customerClassificationGroup",
    "customerGroup",
    "customerType",
  ]);

  // Filter records based on search term
  const filteredRecords = MAIN_CUSTOMER_RECORDS.filter((record) =>
    Object.values(record).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Get visible column definitions
  const visibleColumnDefs = ALL_COLUMNS.filter((col) =>
    visibleColumns.includes(col.key)
  );

  // Function to render cell content based on column type
  const renderCellContent = (record, columnKey) => {
    const value = record[columnKey];

    switch (columnKey) {
      case "mainCustomer":
        return (
          <Text variant="body" weight="medium" className="font-mono text-sm">
            {value}
          </Text>
        );
      case "mainCustomerName":
        return (
          <Text variant="body" weight="medium">
            {value}
          </Text>
        );
      case "company":
        return (
          <Text variant="body" weight="medium" className="font-mono">
            {value}
          </Text>
        );
      case "customerClassificationGroup":
        return <span className={getClassificationBadge(value)}>{value}</span>;
      case "customerGroup":
        return <span className={getCustomerGroupBadge(value)}>{value}</span>;
      case "nikNpwp":
        return (
          <Text variant="body" className="font-mono text-sm">
            {value}
          </Text>
        );
      case "address":
        return (
          <Text variant="body" className="text-sm max-w-xs truncate">
            {value}
          </Text>
        );
      case "searchName":
        return (
          <Text variant="body" weight="medium">
            {value}
          </Text>
        );
      default:
        return (
          <Text variant="body" className="text-sm">
            {value}
          </Text>
        );
    }
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
            Master Data Records - Main Customer - {country?.name}
          </Text>
          <Text variant="body" color="muted">
            Search and view main customer master data
          </Text>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md">
          <SearchIcon
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search main customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <ColumnVisibilityFilter
          columns={ALL_COLUMNS}
          visibleColumns={visibleColumns}
          onVisibilityChange={setVisibleColumns}
          buttonText="Columns"
        />
      </div>

      {/* Results Table */}
      <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div
            className={`min-w-[${Math.max(
              800,
              visibleColumnDefs.length * 150
            )}px]`}
          >
            <Table>
              <Table.Header>
                <Table.Row>
                  {visibleColumnDefs.map((column) => (
                    <Table.HeaderCell key={column.key}>
                      {column.label}
                    </Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filteredRecords.map((record, index) => (
                  <Table.Row key={index} className="hover:bg-gray-50">
                    {visibleColumnDefs.map((column) => (
                      <Table.Cell key={column.key}>
                        {renderCellContent(record, column.key)}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredRecords.length} of {MAIN_CUSTOMER_RECORDS.length}{" "}
          main customer records
          {searchTerm && ` matching "${searchTerm}"`}
        </Text>
      </div>
    </div>
  );
};

export default MainCustomerSearchResults;
