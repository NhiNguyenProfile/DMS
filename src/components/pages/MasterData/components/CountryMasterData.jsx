import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
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

// Extended country data with more details
const SAMPLE_COUNTRIES = [
  {
    id: 1,
    code: "VN",
    name: "Vietnam",
    fullName: "Socialist Republic of Vietnam",
    currency: "VND",
    timezone: "UTC+7",
    status: "Active",
    lastSyncDate: "2025-07-29T08:30:00Z",
    syncStatus: "Success",
    legalEntityCount: 6,
  },
  {
    id: 2,
    code: "NL",
    name: "Netherlands",
    fullName: "Kingdom of the Netherlands",
    currency: "EUR",
    timezone: "UTC+1",
    status: "Active",
    lastSyncDate: "2025-07-27T10:15:00Z",
    syncStatus: "Success",
    legalEntityCount: 3,
  },
];

const CountryMasterData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState(SAMPLE_COUNTRIES);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncResults, setSyncResults] = useState(null);

  // Filter countries based on search
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSyncFromDynamic365 = () => {
    setShowSyncModal(true);
    setIsSyncing(true);
    setSyncResults(null);

    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      setSyncResults({
        totalRecords: 15,
        newRecords: 2,
        updatedRecords: 3,
        failedRecords: 0,
        syncTime: new Date().toISOString(),
      });

      // Update countries with new sync date
      setCountries((prev) =>
        prev.map((country) => ({
          ...country,
          lastSyncDate: new Date().toISOString(),
          syncStatus: "Success",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Text variant="heading" size="lg" weight="semibold">
            Countries
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Manage country master data synchronized from Dynamic 365
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

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-md">
          <SearchIcon
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Countries Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Country</Table.HeaderCell>
              <Table.HeaderCell>Code</Table.HeaderCell>
              <Table.HeaderCell>Currency</Table.HeaderCell>
              <Table.HeaderCell>Timezone</Table.HeaderCell>
              <Table.HeaderCell>Legal Entities</Table.HeaderCell>
              <Table.HeaderCell>Last Sync</Table.HeaderCell>
              <Table.HeaderCell>Sync Status</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredCountries.map((country) => {
              const syncBadge = getSyncStatusBadge(country.syncStatus);
              return (
                <Table.Row key={country.id} className="hover:bg-gray-50">
                  <Table.Cell>
                    <div>
                      <Text variant="body" weight="medium">
                        {country.name}
                      </Text>
                      <Text variant="caption" color="muted">
                        {country.fullName}
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" weight="medium" className="font-mono">
                      {country.code}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{country.currency}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="text-sm">
                      {country.timezone}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" weight="medium">
                      {country.legalEntityCount}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="text-sm">
                      {formatLastSync(country.lastSyncDate)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={syncBadge.className}>
                      {syncBadge.icon}
                      {country.syncStatus}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={getStatusBadge(country.status)}>
                      {country.status}
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
          Showing {filteredCountries.length} of {countries.length} countries
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
                Synchronizing country data from Dynamic 365...
              </Text>
            </div>
          ) : syncResults ? (
            <div className="space-y-4">
              <div className="flex items-center text-green-600 mb-4">
                <CheckCircle size={20} className="mr-2" />
                <Text variant="body" weight="medium">
                  Synchronization completed successfully!
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

export default CountryMasterData;
