import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Badge from "../../atoms/Badge";
import Table from "../../atoms/Table";
import {
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// Mock data for sync history
const SYNC_SESSIONS = [
  {
    id: "sync-001",
    requestType: "Create",
    entity: "Customer",
    startTime: "2025-01-06T08:30:00Z",
    endTime: "2025-01-06T08:45:00Z",
    status: "Completed",
    totalTasks: 5,
    completedTasks: 5,
    failedTasks: 0,
    tasks: [
      {
        id: "task-001",
        name: "Sync Customer Master Data",
        table: "customers",
        startTime: "2025-01-06T08:30:00Z",
        endTime: "2025-01-06T08:35:00Z",
        status: "Completed",
        recordsProcessed: 150,
        recordsSuccess: 150,
        recordsFailed: 0,
        isParallel: false,
      },
      {
        id: "task-002",
        name: "Sync Customer Addresses",
        table: "customer_addresses",
        startTime: "2025-01-06T08:35:00Z",
        endTime: "2025-01-06T08:40:00Z",
        status: "Completed",
        recordsProcessed: 300,
        recordsSuccess: 300,
        recordsFailed: 0,
        isParallel: true,
      },
      {
        id: "task-003",
        name: "Sync Customer Contacts",
        table: "customer_contacts",
        startTime: "2025-01-06T08:35:00Z",
        endTime: "2025-01-06T08:42:00Z",
        status: "Completed",
        recordsProcessed: 200,
        recordsSuccess: 200,
        recordsFailed: 0,
        isParallel: true,
      },
    ],
  },
  {
    id: "sync-002",
    requestType: "Edit",
    entity: "Spare Part",
    startTime: "2025-01-06T09:15:00Z",
    endTime: "2025-01-06T09:28:00Z",
    status: "Failed",
    totalTasks: 4,
    completedTasks: 2,
    failedTasks: 2,
    tasks: [
      {
        id: "task-006",
        name: "Sync Spare Part Master Data",
        table: "spare_parts",
        startTime: "2025-01-06T09:15:00Z",
        endTime: "2025-01-06T09:20:00Z",
        status: "Completed",
        recordsProcessed: 500,
        recordsSuccess: 500,
        recordsFailed: 0,
        isParallel: false,
      },
      {
        id: "task-008",
        name: "Sync Part Specifications",
        table: "part_specifications",
        startTime: "2025-01-06T09:25:00Z",
        endTime: "2025-01-06T09:28:00Z",
        status: "Failed",
        recordsProcessed: 200,
        recordsSuccess: 150,
        recordsFailed: 50,
        isParallel: true,
        errorMessage: "Database connection timeout",
      },
    ],
  },
  {
    id: "sync-003",
    requestType: "Create",
    entity: "Finished Good",
    startTime: "2025-01-06T10:00:00Z",
    endTime: null,
    status: "Running",
    totalTasks: 6,
    completedTasks: 3,
    failedTasks: 0,
    tasks: [
      {
        id: "task-010",
        name: "Sync Product Master Data",
        table: "products",
        startTime: "2025-01-06T10:00:00Z",
        endTime: "2025-01-06T10:05:00Z",
        status: "Completed",
        recordsProcessed: 300,
        recordsSuccess: 300,
        recordsFailed: 0,
        isParallel: false,
      },
      {
        id: "task-013",
        name: "Sync Product Pricing",
        table: "product_pricing",
        startTime: "2025-01-06T10:12:00Z",
        endTime: null,
        status: "Running",
        recordsProcessed: 180,
        recordsSuccess: 180,
        recordsFailed: 0,
        isParallel: true,
      },
      {
        id: "task-015",
        name: "Update Product Relationships",
        table: "product_relationships",
        startTime: null,
        endTime: null,
        status: "Pending",
        recordsProcessed: 0,
        recordsSuccess: 0,
        recordsFailed: 0,
        isParallel: false,
      },
    ],
  },
];

const SyncHistoryTable = () => {
  const [expandedSessions, setExpandedSessions] = useState(new Set());

  const toggleSession = (sessionId) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "Failed":
        return <XCircle size={16} className="text-red-500" />;
      case "Running":
        return <RefreshCw size={16} className="text-blue-500 animate-spin" />;
      case "Pending":
        return <Clock size={16} className="text-gray-400" />;
      default:
        return <AlertCircle size={16} className="text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Completed: "success",
      Failed: "error",
      Running: "info",
      Pending: "warning",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime) return "N/A";
    if (!endTime) return "Running...";

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffMins > 0) {
      return `${diffMins}m ${diffSecs % 60}s`;
    }
    return `${diffSecs}s`;
  };

  const handleResync = (sessionId) => {
    console.log(`Re-syncing session: ${sessionId}`);
    // Add your re-sync logic here
    // For example:
    // - Show confirmation modal
    // - Call API to restart sync
    // - Update session status to "Running"
    // - Refresh the table data

    // Temporary alert for demonstration
    alert(`Re-sync initiated for session: ${sessionId}`);
  };

  const handleResyncTask = (taskId) => {
    console.log(`Re-syncing task: ${taskId}`);
    // Add your task re-sync logic here
    // For example:
    // - Show confirmation modal
    // - Call API to restart specific task
    // - Update task status to "Running"
    // - Refresh the table data

    // Temporary alert for demonstration
    alert(`Re-sync initiated for task: ${taskId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Synchronize History
        </Text>
        <Text variant="body" color="muted">
          View detailed history of all synchronization sessions and their tasks
        </Text>
      </div>

      {/* Sync Sessions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Session ID</Table.HeaderCell>
              <Table.HeaderCell>Request Type</Table.HeaderCell>
              <Table.HeaderCell>Entity</Table.HeaderCell>
              <Table.HeaderCell>Start Time</Table.HeaderCell>
              <Table.HeaderCell>End Time</Table.HeaderCell>
              <Table.HeaderCell>Duration</Table.HeaderCell>
              <Table.HeaderCell>Progress</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {SYNC_SESSIONS.map((session) => (
              <>
                {/* Main Session Row */}
                <Table.Row
                  key={session.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleSession(session.id)}
                >
                  <Table.Cell>
                    <Button variant="ghost" size="small" className="p-1 h-auto">
                      {expandedSessions.has(session.id) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(session.status)}
                      <Text variant="body" weight="medium">
                        {session.id}
                      </Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{session.requestType}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="body">{session.entity}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption">
                      {formatDateTime(session.startTime)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption">
                      {formatDateTime(session.endTime)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption">
                      {calculateDuration(session.startTime, session.endTime)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption">
                      {session.completedTasks}/{session.totalTasks} tasks
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{getStatusBadge(session.status)}</Table.Cell>
                  <Table.Cell>
                    {session.status === "Failed" && (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row expansion
                          handleResync(session.id);
                        }}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw size={14} />
                        Re-sync
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>

                {/* Expanded Tasks Rows */}
                {expandedSessions.has(session.id) &&
                  session.tasks.map((task) => (
                    <Table.Row
                      key={task.id}
                      className="bg-gray-50/50 border-l-4 border-l-blue-200"
                    >
                      <Table.Cell></Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2 pl-6">
                          {getStatusIcon(task.status)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <Text variant="caption" weight="medium">
                                {task.name}
                              </Text>
                              {task.isParallel && (
                                <Badge variant="info" size="small">
                                  Parallel
                                </Badge>
                              )}
                            </div>
                            <Text variant="caption" color="muted">
                              Table: {task.table}
                            </Text>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Text variant="caption" color="muted">
                          Task
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text variant="caption" color="muted">
                          -
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text variant="caption">
                          {formatDateTime(task.startTime)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text variant="caption">
                          {formatDateTime(task.endTime)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text variant="caption" color="muted">
                          -
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text variant="caption" color="muted">
                          -
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="space-y-1">
                          {getStatusBadge(task.status)}
                          {task.errorMessage && (
                            <div className="p-1 bg-red-50 border border-red-200 rounded max-w-xs">
                              <Text variant="caption" className="text-red-700">
                                {task.errorMessage}
                              </Text>
                            </div>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        {task.status === "Failed" && (
                          <Button
                            variant="outline"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResyncTask(task.id);
                            }}
                            className="flex items-center gap-1"
                          >
                            <RefreshCw size={12} />
                            Re-sync
                          </Button>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default SyncHistoryTable;
