import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import Select from "../../../atoms/Select";
import Table from "../../../atoms/Table";
import Modal from "../../../atoms/Modal";
import {
  Search as SearchIcon,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { COUNTRIES } from "../../../../constants";

// Sample legal entities data
const SAMPLE_LEGAL_ENTITIES = [
  {
    id: 1,
    code: "DHV",
    name: "De Heus Vietnam",
    fullName: "De Heus Vietnam Co., Ltd",
    country: "VN",
    address: "123 Nguyen Van Linh, District 7, Ho Chi Minh City",
    taxCode: "0123456789",
    status: "Active",
    lastSyncDate: "2025-07-29T08:30:00Z",
    syncStatus: "Success",
    departmentCount: 8,
  },
  {
    id: 2,
    code: "DHBH",
    name: "De Heus Entity 2",
    fullName: "De Heus Entity 2 Joint Stock Company",
    country: "VN",
    address: "Industrial Zone, Vietnam",
    taxCode: "0987654321",
    status: "Active",
    lastSyncDate: "2025-07-29T08:30:00Z",
    syncStatus: "Success",
    departmentCount: 6,
  },
  {
    id: 3,
    code: "DHHP",
    name: "De Heus Entity 3",
    fullName: "De Heus Entity 3 Limited Company",
    country: "VN",
    address: "Port Area, Vietnam",
    taxCode: "0456789123",
    status: "Active",
    lastSyncDate: "2025-07-28T14:20:00Z",
    syncStatus: "Success",
    departmentCount: 5,
  },
  {
    id: 4,
    code: "DHHY",
    name: "De Heus Entity 4",
    fullName: "De Heus Entity 4 Co., Ltd",
    country: "VN",
    address: "Rural Area, Vietnam",
    taxCode: "0789123456",
    status: "Active",
    lastSyncDate: "2025-07-27T10:15:00Z",
    syncStatus: "Failed",
    departmentCount: 4,
  },
  {
    id: 5,
    code: "DHGC",
    name: "De Heus Entity 5",
    fullName: "De Heus Entity 5 Joint Venture",
    country: "VN",
    address: "Mekong Delta, Vietnam",
    taxCode: "0321654987",
    status: "Active",
    lastSyncDate: "2025-07-29T08:30:00Z",
    syncStatus: "Success",
    departmentCount: 7,
  },
  {
    id: 6,
    code: "DHGD",
    name: "De Heus Entity 6",
    fullName: "De Heus Entity 6 Manufacturing Ltd",
    country: "VN",
    address: "Ho Chi Minh City, Vietnam",
    taxCode: "0654321789",
    status: "Inactive",
    lastSyncDate: "2025-07-26T16:45:00Z",
    syncStatus: "Success",
    departmentCount: 3,
  },
];

const LegalEntityMasterData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [legalEntities, setLegalEntities] = useState(SAMPLE_LEGAL_ENTITIES);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncResults, setSyncResults] = useState(null);

  // Filter legal entities based on search and country
  const filteredEntities = legalEntities.filter((entity) => {
    const matchesSearch =
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry =
      !selectedCountry || entity.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  const handleSyncFromDynamic365 = () => {
    setShowSyncModal(true);
    setIsSyncing(true);
    setSyncResults(null);

    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      setSyncResults({
        totalRecords: 25,
        newRecords: 1,
        updatedRecords: 4,
        failedRecords: 1,
        syncTime: new Date().toISOString(),
      });

      // Update entities with new sync date
      setLegalEntities((prev) =>
        prev.map((entity) => ({
          ...entity,
          lastSyncDate: new Date().toISOString(),
          syncStatus: Math.random() > 0.1 ? "Success" : "Failed",
        }))
      );
    }, 3000);
  };

  const getStatusBadge = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      Inactive: "bg-red-100 text-red-800",
    };
    return `px-2 py-1 text-xs font-medium rounded ${
      colors[status] || "bg-gray-100 text-gray-800"
    }`;
  };

  const getSyncStatusBadge = (status) => {
    const colors = {
      Success: "bg-green-100 text-green-800",
      Failed: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };
    const icons = {
      Success: <CheckCircle size={12} className="mr-1" />,
      Failed: <AlertCircle size={12} className="mr-1" />,
      Pending: <Loader2 size={12} className="mr-1 animate-spin" />,
    };
    return {
      className: `px-2 py-1 text-xs font-medium rounded flex items-center ${
        colors[status] || "bg-gray-100 text-gray-800"
      }`,
      icon: icons[status],
    };
  };

  const formatLastSync = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getCountryName = (countryCode) => {
    const country = COUNTRIES.find((c) => c.value === countryCode);
    return country ? country.label : countryCode;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Legal Entities
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Manage legal entity master data synchronized from Dynamic 365
          </Text>
        </div>
        <Button onClick={handleSyncFromDynamic365} disabled={isSyncing}>
          <RefreshCw
            size={16}
            className={`mr-2 ${isSyncing ? "animate-spin" : ""}`}
          />
          {isSyncing ? "Syncing..." : "Sync from Dynamic 365"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md">
          <SearchIcon
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search legal entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          placeholder="Filter by Country"
          value={selectedCountry}
          onChange={setSelectedCountry}
          options={[{ value: "", label: "All Countries" }, ...COUNTRIES]}
        />
      </div>

      {/* Legal Entities Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Legal Entity</Table.HeaderCell>
              <Table.HeaderCell>Code</Table.HeaderCell>
              <Table.HeaderCell>Country</Table.HeaderCell>
              <Table.HeaderCell>Tax Code</Table.HeaderCell>
              <Table.HeaderCell>Departments</Table.HeaderCell>
              <Table.HeaderCell>Last Sync</Table.HeaderCell>
              <Table.HeaderCell>Sync Status</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredEntities.map((entity) => {
              const syncBadge = getSyncStatusBadge(entity.syncStatus);
              return (
                <Table.Row key={entity.id} className="hover:bg-gray-50">
                  <Table.Cell>
                    <div>
                      <Text variant="body" weight="medium">
                        {entity.name}
                      </Text>
                      <Text variant="caption" color="muted">
                        {entity.fullName}
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" weight="medium" className="font-mono">
                      {entity.code}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{getCountryName(entity.country)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="font-mono text-sm">
                      {entity.taxCode}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" weight="medium">
                      {entity.departmentCount}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="text-sm">
                      {formatLastSync(entity.lastSyncDate)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={syncBadge.className}>
                      {syncBadge.icon}
                      {entity.syncStatus}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={getStatusBadge(entity.status)}>
                      {entity.status}
                    </span>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredEntities.length} of {legalEntities.length} legal
          entities
        </Text>
      </div>

      {/* Sync Modal */}
      <Modal
        isOpen={showSyncModal}
        onClose={() => !isSyncing && setShowSyncModal(false)}
        title="Sync from Dynamic 365"
      >
        <div className="space-y-4">
          {isSyncing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-blue-600 mr-2" />
              <Text variant="body" color="muted">
                Synchronizing legal entity data from Dynamic 365...
              </Text>
            </div>
          ) : syncResults ? (
            <div className="space-y-4">
              <div className="flex items-center text-green-600 mb-4">
                <CheckCircle size={20} className="mr-2" />
                <Text variant="body" weight="medium">
                  Synchronization completed!
                </Text>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <Text variant="body" weight="medium">
                    Total Records
                  </Text>
                  <Text variant="heading" size="lg">
                    {syncResults.totalRecords}
                  </Text>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <Text variant="body" weight="medium">
                    New Records
                  </Text>
                  <Text variant="heading" size="lg" className="text-green-600">
                    {syncResults.newRecords}
                  </Text>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <Text variant="body" weight="medium">
                    Updated Records
                  </Text>
                  <Text variant="heading" size="lg" className="text-blue-600">
                    {syncResults.updatedRecords}
                  </Text>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <Text variant="body" weight="medium">
                    Failed Records
                  </Text>
                  <Text variant="heading" size="lg" className="text-red-600">
                    {syncResults.failedRecords}
                  </Text>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setShowSyncModal(false)}>Close</Button>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default LegalEntityMasterData;
