import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import AccountDetail from "./AccountDetail";
import GroupDetail from "./GroupDetail";
import { Search as SearchIcon, Plus, Edit, Trash2, User } from "lucide-react";

// Sample accounts data
const SAMPLE_ACCOUNTS = [
  {
    id: 1,
    username: "john.doe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    department: "Sales",
    status: "Active",
    roleAssignments: [
      {
        id: 1,
        roleId: 1,
        roleName: "Sales Manager",
        roleDescription: "Manages sales operations",
        allLegal: false,
        legalEntities: [1, 2], // DHV, DHBH
      },
      {
        id: 2,
        roleId: 2,
        roleName: "Account Manager",
        roleDescription: "Manages customer accounts",
        allLegal: false,
        legalEntities: [3], // DHHP
      },
    ],
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    username: "sarah.johnson",
    fullName: "Sarah Johnson",
    email: "sarah.j@example.com",
    department: "Operations",
    status: "Active",
    roleAssignments: [
      {
        id: 3,
        roleId: 3,
        roleName: "Operations Manager",
        roleDescription: "Manages warehouse operations",
        allLegal: true,
        legalEntities: [],
      },
    ],
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    username: "mike.chen",
    fullName: "Mike Chen",
    email: "mike.c@example.com",
    department: "Finance",
    status: "Inactive",
    roleAssignments: [
      {
        id: 4,
        roleId: 4,
        roleName: "Finance Officer",
        roleDescription: "Manages financial operations",
        allLegal: false,
        legalEntities: [6], // DHGD
      },
    ],
    createdAt: "2024-02-01",
  },
];

const AccountAccess = () => {
  const [accounts, setAccounts] = useState(SAMPLE_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("list"); // "list", "detail", or "group"
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(
    (account) =>
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAccount = () => {
    setCurrentView("group");
  };

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (accountId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this account's access configuration?"
      )
    ) {
      setAccounts(accounts.filter((a) => a.id !== accountId));
    }
  };

  const handleRowClick = (account) => {
    setSelectedAccount(account);
    setCurrentView("detail");
  };

  // Show group detail view
  if (currentView === "group") {
    return (
      <GroupDetail
        onBack={() => setCurrentView("list")}
        onSave={(groupData) => {
          console.log("AccountAccess onSave called with:", groupData);
          // Xử lý lưu group ở đây nếu cần
          setCurrentView("list");
          console.log("setCurrentView('list') called");
        }}
      />
    );
  }

  // Show detail view
  if (currentView === "detail") {
    return (
      <AccountDetail
        account={selectedAccount}
        onBack={handleBackToList}
        onSave={(accountData) => {
          if (selectedAccount) {
            // Update existing account
            setAccounts((prev) =>
              prev.map((a) =>
                a.id === selectedAccount.id
                  ? { ...accountData, id: selectedAccount.id }
                  : a
              )
            );
          } else {
            // Add new account
            setAccounts((prev) => [...prev, accountData]);
          }
          setCurrentView("list");
          setSelectedAccount(null);
        }}
      />
    );
  }

  // Show list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Text variant="h3" weight="semibold">
            Account Access Management
          </Text>
          <Text variant="body" color="muted">
            Manage user accounts with roles and legal entity access
          </Text>
        </div>
        <Button onClick={handleAddAccount}>
          <Plus size={16} className="mr-2" />
          Mass Configure Accounts
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white ">
        <div className="relative max-w-md">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search accounts by username, name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Access Overview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm ? (
                      <div>
                        <Text variant="body">
                          No accounts found matching "{searchTerm}"
                        </Text>
                        <Text variant="caption" color="muted" className="mt-1">
                          Try adjusting your search terms
                        </Text>
                      </div>
                    ) : (
                      <div>
                        <User
                          size={48}
                          className="mx-auto text-gray-300 mb-4"
                        />
                        <Text variant="body">No accounts configured yet</Text>
                        <Text variant="caption" color="muted" className="mt-1">
                          Configure your first account to manage access
                        </Text>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => (
                  <tr
                    key={account.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(account)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Text variant="body" weight="medium">
                          {account.fullName}
                        </Text>
                        <Text variant="caption" color="muted" className="mt-1">
                          {account.username} - {account.email}
                        </Text>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text variant="body">{account.department}</Text>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-start flex gap-2 items-center">
                        <Text variant="body" weight="medium">
                          {account.roleAssignments?.length || 0}
                        </Text>
                        <Text variant="body" color="muted">
                          {account.roleAssignments?.length === 1
                            ? "role"
                            : "roles"}{" "}
                          assigned
                        </Text>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            account.status === "Active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        <Text
                          variant="body"
                          className={
                            account.status === "Active"
                              ? "text-green-600"
                              : "text-gray-500"
                          }
                        >
                          {account.status}
                        </Text>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAccount(account);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAccount(account.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {filteredAccounts.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <Text variant="caption" color="muted">
            Showing {filteredAccounts.length} of {accounts.length} accounts
            {searchTerm && ` matching "${searchTerm}"`}
          </Text>
        </div>
      )}
    </div>
  );
};

export default AccountAccess;
