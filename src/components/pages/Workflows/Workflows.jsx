import { useState, useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Select from "../../atoms/Select";
import Input from "../../atoms/Input";
import Table from "../../atoms/Table";
import IconButton from "../../atoms/IconButton";
import DashboardLayout from "../../templates/DashboardLayout";
import WorkflowPanel from "./components/WorkflowPanel";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { ENTITIES, REQUEST_TYPES, WORKFLOW_STATUS } from "../../../constants";
import { ENTITY_CONFIGS, SAMPLE_WORKFLOWS } from "../../../data/mockData";

const Workflows = () => {
  // Header Controls State
  const [selectedEntity, setSelectedEntity] = useState("");
  const [selectedRequestType, setSelectedRequestType] = useState("");
  const [availableRequestTypes, setAvailableRequestTypes] = useState([]);

  // Workflow List State
  const [workflows, setWorkflows] = useState([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Panel State
  const [showWorkflowPanel, setShowWorkflowPanel] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  // Update available request types when entity changes
  useEffect(() => {
    if (selectedEntity && ENTITY_CONFIGS[selectedEntity]) {
      setAvailableRequestTypes(
        ENTITY_CONFIGS[selectedEntity].available_request_types
      );
      setSelectedRequestType(""); // Reset request type when entity changes
    } else {
      setAvailableRequestTypes([]);
    }
  }, [selectedEntity]);

  // Load workflows when entity/request type changes
  useEffect(() => {
    if (selectedEntity && selectedRequestType) {
      const filtered = SAMPLE_WORKFLOWS.filter(
        (w) =>
          w.entity === selectedEntity && w.request_type === selectedRequestType
      );
      setWorkflows(filtered);
    } else {
      setWorkflows([]);
    }
  }, [selectedEntity, selectedRequestType]);

  // Filter workflows by search and status
  useEffect(() => {
    let filtered = workflows;

    if (searchTerm) {
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((w) => w.status === statusFilter);
    }

    setFilteredWorkflows(filtered);
  }, [workflows, searchTerm, statusFilter]);

  const calculateTotalSLA = (steps) => {
    return steps.reduce((total, step) => total + step.sla_hours, 0);
  };

  const handleNewWorkflow = () => {
    setSelectedWorkflow(null);
    setShowWorkflowPanel(true);
  };

  const handleEditWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setShowWorkflowPanel(true);
  };

  const handleDeleteWorkflow = (workflowId) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      setWorkflows(workflows.filter((w) => w.id !== workflowId));
    }
  };

  const handleClosePanel = () => {
    setShowWorkflowPanel(false);
    setSelectedWorkflow(null);
  };

  const handleSaveWorkflow = (workflowData) => {
    if (selectedWorkflow) {
      // Update existing workflow
      setWorkflows(
        workflows.map((w) =>
          w.id === selectedWorkflow.id ? { ...w, ...workflowData } : w
        )
      );
    } else {
      // Add new workflow
      const newWorkflow = {
        id: Date.now(),
        entity: selectedEntity,
        request_type: selectedRequestType,
        ...workflowData,
      };
      setWorkflows([...workflows, newWorkflow]);
    }
    handleClosePanel();
  };

  return (
    <DashboardLayout title="Workflows">
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Text variant="heading" size="lg" weight="semibold">
              Workflow Management
            </Text>
            <Button
              variant="primary"
              onClick={handleNewWorkflow}
              disabled={!selectedEntity || !selectedRequestType}
            >
              <Plus size={16} className="mr-2" />
              New Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Entity Selector */}
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Entity *
              </Text>
              <Select
                options={ENTITIES}
                value={selectedEntity}
                onChange={setSelectedEntity}
                placeholder="Select Entity"
              />
            </div>

            {/* Request Type */}
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Request Type *
              </Text>
              <Select
                options={availableRequestTypes}
                value={selectedRequestType}
                onChange={setSelectedRequestType}
                placeholder="Select Request Type"
                disabled={!selectedEntity}
              />
            </div>
          </div>
        </div>

        {/* Workflow List */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Text variant="heading" size="md" weight="semibold">
                Workflows
              </Text>

              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search workflows..."
                    className="pl-10 w-64"
                  />
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter size={16} className="text-gray-400" />
                  <Select
                    options={[
                      { value: "", label: "All Status" },
                      ...WORKFLOW_STATUS,
                    ]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="Filter by Status"
                    className="w-40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Workflows Table */}
          <div className="p-6">
            {selectedEntity && selectedRequestType ? (
              <Table hover bordered>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>#Steps</Table.HeaderCell>
                    <Table.HeaderCell>Total SLA (h)</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredWorkflows.map((workflow) => (
                    <Table.Row key={workflow.id} hover>
                      <Table.Cell>
                        <div>
                          <button
                            onClick={() => handleEditWorkflow(workflow)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-left"
                          >
                            {workflow.name}
                          </button>
                          {workflow.description && (
                            <Text
                              variant="caption"
                              color="muted"
                              className="block mt-1"
                            >
                              {workflow.description}
                            </Text>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Text variant="body" weight="medium">
                          {workflow.steps.length}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text variant="body" weight="medium">
                          {calculateTotalSLA(workflow.steps)}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            workflow.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {workflow.status}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          <IconButton
                            variant="icon"
                            color="blue"
                            tooltip="Edit workflow"
                            onClick={() => handleEditWorkflow(workflow)}
                          >
                            <Edit size={16} />
                          </IconButton>
                          <IconButton
                            variant="icon"
                            color="red"
                            tooltip="Delete workflow"
                            onClick={() => handleDeleteWorkflow(workflow.id)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Text variant="body" color="muted">
                  Please select Entity and Request Type to view workflows
                </Text>
              </div>
            )}

            {selectedEntity &&
              selectedRequestType &&
              filteredWorkflows.length === 0 && (
                <div className="text-center py-8">
                  <Text variant="body" color="muted">
                    No workflows found for the selected criteria
                  </Text>
                </div>
              )}
          </div>
        </div>

        {/* Workflow Panel */}
        {showWorkflowPanel && (
          <WorkflowPanel
            workflow={selectedWorkflow}
            selectedEntity={selectedEntity}
            selectedRequestType={selectedRequestType}
            onClose={handleClosePanel}
            onSave={handleSaveWorkflow}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Workflows;
