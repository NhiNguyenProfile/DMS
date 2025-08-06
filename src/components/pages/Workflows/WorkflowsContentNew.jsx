import { useState, useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import Select from "../../atoms/Select";
import Table from "../../atoms/Table";
import IconButton from "../../atoms/IconButton";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { COUNTRIES, ENTITIES, WORKFLOW_STATUS } from "../../../constants";
import { SAMPLE_WORKFLOWS } from "../../../data/mockData";
import { useRouter } from "../../../hooks/useRouter.jsx";

const WorkflowsContent = ({
  selectedCountry: propSelectedCountry,
  selectedEntity: propSelectedEntity,
  hideFilters = false,
}) => {
  const { navigate } = useRouter();

  // Header Controls State
  const [selectedCountry, setSelectedCountry] = useState(
    propSelectedCountry || "Vietnam"
  );
  const [selectedEntity, setSelectedEntity] = useState(
    propSelectedEntity || ""
  );

  // Use props if provided
  const finalSelectedCountry = propSelectedCountry || selectedCountry;
  const finalSelectedEntity = propSelectedEntity || selectedEntity;

  // Workflow List State
  const [workflows, setWorkflows] = useState([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Load workflows when country changes
  useEffect(() => {
    if (finalSelectedCountry) {
      // Load all workflows for the country, filter by entity will be done in the filter effect
      setWorkflows(SAMPLE_WORKFLOWS);
    } else {
      setWorkflows([]);
    }
  }, [finalSelectedCountry]);

  // Filter workflows by entity, search and status
  useEffect(() => {
    let filtered = [...workflows];

    // Filter by entity
    if (finalSelectedEntity) {
      filtered = filtered.filter(
        (workflow) => workflow.entity === finalSelectedEntity
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((workflow) =>
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(
        (workflow) => workflow.status === statusFilter
      );
    }

    setFilteredWorkflows(filtered);
  }, [workflows, finalSelectedEntity, searchTerm, statusFilter]);

  // Calculate total SLA hours for a workflow
  const calculateTotalSLA = (steps) => {
    if (!steps || steps.length === 0) return 0;
    return steps.reduce((total, step) => total + step.sla_hours, 0);
  };

  const handleNewWorkflow = () => {
    // Navigate to edit page for new workflow
    console.log(
      "Creating new workflow for country:",
      finalSelectedCountry,
      "entity:",
      finalSelectedEntity
    );
    window.location.hash = `workflow-edit?country=${finalSelectedCountry}&entity=${finalSelectedEntity}`;
    navigate("workflow-edit");
  };

  const handleEditWorkflow = (workflow) => {
    // Navigate to edit page with workflow ID
    window.location.hash = `workflow-edit?id=${workflow.id}`;
    navigate("workflow-edit");
  };

  const handleDeleteWorkflow = (workflowId) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      setWorkflows(workflows.filter((w) => w.id !== workflowId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls - Only show if not hidden */}
      {!hideFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Text variant="heading" size="lg" weight="semibold">
              Workflow Management
            </Text>
            <Button
              variant="primary"
              onClick={handleNewWorkflow}
              disabled={!finalSelectedCountry || !finalSelectedEntity}
            >
              <Plus size={16} className="mr-2" />
              New Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country Selector */}
            <div>
              <Text variant="body" weight="medium" className="mb-2">
                Country *
              </Text>
              <Select
                options={COUNTRIES}
                value={selectedCountry}
                onChange={setSelectedCountry}
                placeholder="Select Country"
              />
            </div>

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
                disabled={!selectedCountry}
              />
              {!selectedCountry && (
                <Text variant="caption" color="muted" className="mt-1">
                  Please select country first
                </Text>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Workflow List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <Text variant="heading" size="md" weight="semibold">
                Workflows
              </Text>

              {/* New Workflow button for wizard mode */}
              {hideFilters && (
                <Button
                  variant="primary"
                  onClick={handleNewWorkflow}
                  disabled={!finalSelectedCountry}
                >
                  <Plus size={16} className="mr-2" />
                  New Workflow
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Entity Filter */}
              <Select
                options={[
                  { value: "", label: "All Entities" },
                  ...ENTITIES.map((entity) => ({
                    value: entity,
                    label: entity,
                  })),
                ]}
                value={finalSelectedEntity}
                onChange={setSelectedEntity}
                placeholder="All Entities"
                className="w-40"
              />

              {/* Status Filter */}
              <Select
                options={WORKFLOW_STATUS}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All Status"
                className="w-32"
              />
            </div>
          </div>
        </div>

        {/* Workflows Table */}
        <div className="p-6">
          {finalSelectedCountry && finalSelectedEntity ? (
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
                        <Text variant="body" weight="medium">
                          {workflow.name}
                        </Text>
                        <Text variant="caption" color="muted">
                          {workflow.description}
                        </Text>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body">{workflow.steps?.length || 0}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text variant="body">
                        {calculateTotalSLA(workflow.steps)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          workflow.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : workflow.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800"
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
                Please select Country and Entity to view workflows
              </Text>
            </div>
          )}

          {finalSelectedCountry &&
            finalSelectedEntity &&
            filteredWorkflows.length === 0 && (
              <div className="text-center py-8">
                <Text variant="body" color="muted">
                  No workflows found for the selected criteria
                </Text>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowsContent;
