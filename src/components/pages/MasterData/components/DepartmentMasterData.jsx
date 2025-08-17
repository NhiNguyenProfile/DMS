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

// Sample legal entities for filter
const LEGAL_ENTITIES = [
  { value: "DHV", label: "DHV" },
  { value: "DHBH", label: "DHBH" },
  { value: "DHHP", label: "DHHP" },
  { value: "DHHY", label: "DHHY" },
  { value: "DHGC", label: "DHGC" },
  { value: "DHGD", label: "DHGD" },
];

// Sample departments data
const SAMPLE_DEPARTMENTS = [
  {
    id: 1,
    code: "SALES",
    name: "Sales Department",
    fullName: "Sales and Marketing Department",
    legalEntity: "DHV",
    parentDepartment: null,
    headOfDepartment: "John Doe",
    employeeCount: 15,
    status: "Active",
    lastSyncDate: "2025-07-29T08:30:00Z",
    syncStatus: "Success",
  },
  {
    id: 2,
    code: "FINANCE",
    name: "Finance Department",
    fullName: "Finance and Accounting Department",
    legalEntity: "DHV",
    parentDepartment: null,
    headOfDepartment: "Jane Smith",
    employeeCount: 8,
    status: "Active",
    lastSyncDate: "2025-07-29T08:30:00Z",
    syncStatus: "Success",
  },
  {
    id: 3,
    code: "PROD",
    name: "Production Department",
    fullName: "Production and Manufacturing Department",
    legalEntity: "DHBH",
    parentDepartment: null,
    headOfDepartment: "Mike Johnson",
    employeeCount: 25,
    status: "Active",
    lastSyncDate: "2025-07-28T14:20:00Z",
    syncStatus: "Success",
  },
  {
    id: 4,
    code: "QA",
    name: "Quality Assurance",
    fullName: "Quality Assurance Department",
    legalEntity: "DHBH",
    parentDepartment: "PROD",
    headOfDepartment: "Sarah Wilson",
    employeeCount: 6,
    status: "Active",
    lastSyncDate: "2025-07-28T14:20:00Z",
    syncStatus: "Success",
  },
  {
    id: 5,
    code: "HR",
    name: "Human Resources",
    fullName: "Human Resources Department",
    legalEntity: "DHHP",
    parentDepartment: null,
    headOfDepartment: "David Brown",
    employeeCount: 4,
    status: "Active",
    lastSyncDate: "2025-07-27T10:15:00Z",
    syncStatus: "Failed",
  },
  {
    id: 6,
    code: "IT",
    name: "Information Technology",
    fullName: "Information Technology Department",
    legalEntity: "DHV",
    parentDepartment: null,
    headOfDepartment: "Lisa Davis",
    employeeCount: 7,
    status: "Active",
    lastSyncDate: "2025-07-29T08:30:00Z",
    syncStatus: "Success",
  },
  {
    id: 7,
    code: "LEGAL",
    name: "Legal Department",
    fullName: "Legal and Compliance Department",
    legalEntity: "DHGC",
    parentDepartment: null,
    headOfDepartment: "Robert Miller",
    employeeCount: 3,
    status: "Active",
    lastSyncDate: "2025-07-26T16:45:00Z",
    syncStatus: "Success",
  },
  {
    id: 8,
    code: "MAINT",
    name: "Maintenance",
    fullName: "Maintenance and Engineering Department",
    legalEntity: "DHHY",
    parentDepartment: null,
    headOfDepartment: "Tom Anderson",
    employeeCount: 12,
    status: "Inactive",
    lastSyncDate: "2025-07-25T12:30:00Z",
    syncStatus: "Success",
  },
];

const DepartmentMasterData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLegalEntity, setSelectedLegalEntity] = useState("");
  const [departments, setDepartments] = useState(SAMPLE_DEPARTMENTS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncResults, setSyncResults] = useState(null);

  // Filter departments based on search and legal entity
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLegalEntity =
      !selectedLegalEntity || dept.legalEntity === selectedLegalEntity;

    return matchesSearch && matchesLegalEntity;
  });

  const handleSyncFromDynamic365 = () => {
    setShowSyncModal(true);
    setIsSyncing(true);
    setSyncResults(null);

    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      setSyncResults({
        totalRecords: 45,
        newRecords: 3,
        updatedRecords: 7,
        failedRecords: 2,
        syncTime: new Date().toISOString(),
      });

      // Update departments with new sync date
      setDepartments((prev) =>
        prev.map((dept) => ({
          ...dept,
          lastSyncDate: new Date().toISOString(),
          syncStatus: Math.random() > 0.15 ? "Success" : "Failed",
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
            Departments
          </Text>
          <Text variant="body" color="muted" className="mt-1">
            Manage department master data synchronized from Dynamic 365
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
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          placeholder="Filter by Legal Entity"
          value={selectedLegalEntity}
          onChange={setSelectedLegalEntity}
          options={[
            { value: "", label: "All Legal Entities" },
            ...LEGAL_ENTITIES,
          ]}
        />
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Department</Table.HeaderCell>
              <Table.HeaderCell>Code</Table.HeaderCell>
              <Table.HeaderCell>Legal Entity</Table.HeaderCell>
              <Table.HeaderCell>Head of Dept</Table.HeaderCell>
              <Table.HeaderCell>Employees</Table.HeaderCell>
              <Table.HeaderCell>Last Sync</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredDepartments.map((dept) => {
              const syncBadge = getSyncStatusBadge(dept.syncStatus);
              return (
                <Table.Row key={dept.id} className="hover:bg-gray-50">
                  <Table.Cell>
                    <Text variant="body" weight="medium">
                      {dept.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" weight="medium" className="font-mono">
                      {dept.code}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{dept.legalEntity}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="text-sm">
                      {dept.headOfDepartment}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" weight="medium">
                      {dept.employeeCount}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" className="text-sm">
                      {formatLastSync(dept.lastSyncDate)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={getStatusBadge(dept.status)}>
                      {dept.status}
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
          Showing {filteredDepartments.length} of {departments.length}{" "}
          departments
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
                Synchronizing department data from Dynamic 365...
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

export default DepartmentMasterData;
