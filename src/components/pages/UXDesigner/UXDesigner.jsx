import Text from "../../atoms/Text";
import Table from "../../atoms/Table";
import IconButton from "../../atoms/IconButton";
import DashboardLayout from "../../templates/DashboardLayout";
import { Eye, Edit, MoreHorizontal, Trash2 } from "lucide-react";

const UXDesigner = () => {
  const candidates = [
    {
      name: "Paula Pieters",
      status: "delivered",
      time: "Yesterday",
      flag: "🇳🇱",
    },
    { name: "Kasimir Krause", status: "contacted", time: "Today", flag: "🇩🇪" },
    { name: "Leslie Laurens", status: "interviews", time: "3d", flag: "🇧🇪" },
    { name: "Bruno Braun", status: "interviews", time: "1wk", flag: "🇩🇪" },
    {
      name: "Samuel Sandermann",
      status: "interviews",
      time: "21wk",
      flag: "🇩🇪",
    },
    { name: "Art Feynman", status: "interviews", time: "21wk", flag: "🇩🇪" },
  ];

  const statusColors = {
    delivered: "bg-gray-100 text-gray-800",
    contacted: "bg-blue-100 text-blue-800",
    interviews: "bg-yellow-100 text-yellow-800",
    negotiations: "bg-purple-100 text-purple-800",
    hired: "bg-green-100 text-green-800",
    started: "bg-green-100 text-green-800",
  };

  return (
    <DashboardLayout title="UX Designer">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <Text variant="heading" size="2xl" weight="bold">
                UX Designer
              </Text>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">
                OPEN
              </span>
            </div>
            <Text variant="body" color="muted" className="mt-1">
              Berlin, Germany
            </Text>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-black text-white rounded-lg p-4">
            <Text variant="heading" size="2xl" weight="bold" color="white">
              120
            </Text>
            <Text
              variant="body"
              size="small"
              color="white"
              className="opacity-80"
            >
              Views
            </Text>
          </div>

          <div className="bg-green-400 text-white rounded-lg p-4">
            <Text variant="heading" size="2xl" weight="bold" color="white">
              67
            </Text>
            <Text
              variant="body"
              size="small"
              color="white"
              className="opacity-80"
            >
              Active
            </Text>
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <Text variant="heading" size="2xl" weight="bold">
              10
            </Text>
            <Text variant="body" size="small" color="muted">
              Candidates
            </Text>
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <Text variant="heading" size="2xl" weight="bold">
              10
            </Text>
            <Text variant="body" size="small" color="muted">
              Interviewed
            </Text>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button className="border-b-2 border-yellow-400 pb-2 text-sm font-medium text-gray-900">
              Talents
            </button>
            <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Process
            </button>
            <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Job Description
            </button>
            <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700">
              Log
            </button>
          </nav>
        </div>

        {/* Process Pipeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-8 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold">4</div>
                <div className="text-gray-500">DELIVERED</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">1</div>
                <div className="text-gray-500">CONTACTED</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">1</div>
                <div className="text-gray-500">INTERVIEWS</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">0</div>
                <div className="text-gray-500">NEGOTIATIONS</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">0</div>
                <div className="text-gray-500">HIRED</div>
              </div>
              <div className="text-center bg-green-100 px-3 py-1 rounded">
                <div className="text-lg font-semibold text-green-800">
                  STARTED
                </div>
              </div>
            </div>
          </div>

          {/* Candidates Table */}
          <Table hover bordered>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell sortable>Name</Table.HeaderCell>
                <Table.HeaderCell>Country</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {candidates.map((candidate, index) => (
                <Table.Row key={index} hover>
                  <Table.Cell>
                    <Text variant="body" weight="medium">
                      {candidate.name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-lg">{candidate.flag}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption" color="muted">
                      {candidate.time}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        statusColors[candidate.status]
                      }`}
                    >
                      {candidate.status.toUpperCase()}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center space-x-3">
                      <IconButton
                        variant="icon"
                        color="gray"
                        tooltip="View details"
                        onClick={() => console.log("View", candidate.name)}
                      >
                        <Eye size={16} />
                      </IconButton>
                      <IconButton
                        variant="icon"
                        color="blue"
                        tooltip="Edit candidate"
                        onClick={() => console.log("Edit", candidate.name)}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        variant="icon"
                        color="red"
                        tooltip="Delete candidate"
                        onClick={() => console.log("Delete", candidate.name)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                      <IconButton
                        variant="icon"
                        color="gray"
                        tooltip="More actions"
                        onClick={() => console.log("More", candidate.name)}
                      >
                        <MoreHorizontal size={16} />
                      </IconButton>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UXDesigner;
