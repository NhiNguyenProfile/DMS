import Table from "../atoms/Table";
import Button from "../atoms/Button";
import IconButton from "../atoms/IconButton";
import Text from "../atoms/Text";
import { Edit, Trash2, Eye } from "lucide-react";

const TableExample = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "User",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "Moderator",
      status: "Active",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <Text variant="heading" size="2xl" weight="bold" className="mb-4">
          Table Component Examples
        </Text>

        {/* Basic Table */}
        <div className="mb-8">
          <Text variant="heading" size="lg" weight="semibold" className="mb-4">
            Basic Table
          </Text>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Table with Hover and Border */}
        <div className="mb-8">
          <Text variant="heading" size="lg" weight="semibold" className="mb-4">
            Table with Hover & Border
          </Text>
          <Table hover bordered>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell sortable>Name</Table.HeaderCell>
                <Table.HeaderCell sortable>Email</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id} hover>
                  <Table.Cell>
                    <Text variant="body" weight="medium">
                      {user.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body" color="muted">
                      {user.email}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {user.role}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center space-x-3">
                      <IconButton variant="icon" color="gray" tooltip="View">
                        <Eye size={16} />
                      </IconButton>
                      <IconButton variant="icon" color="blue" tooltip="Edit">
                        <Edit size={16} />
                      </IconButton>
                      <IconButton variant="icon" color="red" tooltip="Delete">
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Compact Table */}
        <div className="mb-8">
          <Text variant="heading" size="lg" weight="semibold" className="mb-4">
            Compact Table
          </Text>
          <Table size="small" bordered>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell padding="small">ID</Table.HeaderCell>
                <Table.HeaderCell padding="small">Name</Table.HeaderCell>
                <Table.HeaderCell padding="small">Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell padding="small">{user.id}</Table.Cell>
                  <Table.Cell padding="small">{user.name}</Table.Cell>
                  <Table.Cell padding="small">{user.status}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Table with Selected Rows */}
        <div className="mb-8">
          <Text variant="heading" size="lg" weight="semibold" className="mb-4">
            Table with Selected Rows
          </Text>
          <Table hover bordered>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Select</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user, index) => (
                <Table.Row key={user.id} selected={index === 1} hover>
                  <Table.Cell>
                    <input type="checkbox" defaultChecked={index === 1} />
                  </Table.Cell>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TableExample;
