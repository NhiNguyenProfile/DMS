import { useState } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Select from "../../atoms/Select";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { COUNTRIES, ENTITIES } from "../../../constants";
import WorkflowsContent from "./WorkflowsContentNew";

const WorkflowWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("");

  const steps = [
    { id: 1, title: "Select Country", description: "Choose your country" },
    { id: 2, title: "Select Entity", description: "Choose entity type" },
    { id: 3, title: "Workflow Management", description: "Manage workflows" },
  ];

  const handleCountryNext = () => {
    if (selectedCountry) {
      setCurrentStep(2);
    }
  };

  const handleEntityNext = () => {
    if (selectedEntity) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedCountry("");
    setSelectedEntity("");
  };

  // Step 1: Country Selection
  const renderCountryStep = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Select Country
        </Text>
        <Text variant="body" color="muted">
          Choose your country to start workflow management
        </Text>
      </div>

      <div className="space-y-6">
        <div>
          <Text variant="body" weight="medium" className="mb-3">
            Country *
          </Text>
          <Select
            options={COUNTRIES}
            value={selectedCountry}
            onChange={setSelectedCountry}
            placeholder="Select Country"
            size="large"
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleCountryNext}
            disabled={!selectedCountry}
            size="large"
          >
            Next
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Step 2: Entity Selection
  const renderEntityStep = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Select Entity
        </Text>
        <Text variant="body" color="muted">
          Choose the entity type for workflow management
        </Text>
      </div>

      <div className="space-y-6">
        {/* Selected Country Display */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Check size={16} className="text-green-600 mr-2" />
            <Text variant="body" weight="medium">
              Country: {selectedCountry}
            </Text>
          </div>
        </div>

        <div>
          <Text variant="body" weight="medium" className="mb-3">
            Entity Type *
          </Text>
          <Select
            options={ENTITIES}
            value={selectedEntity}
            onChange={setSelectedEntity}
            placeholder="Select Entity"
            size="large"
          />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} size="large">
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleEntityNext}
            disabled={!selectedEntity}
            size="large"
          >
            Continue
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Step 3: Workflow Management
  const renderWorkflowStep = () => (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Check size={16} className="text-green-600 mr-2" />
              <Text variant="body" weight="medium">
                {selectedCountry} → {selectedEntity}
              </Text>
            </div>
          </div>
          <Button variant="outline" onClick={handleReset} size="small">
            Change Selection
          </Button>
        </div>
      </div>

      {/* Workflow Management Content */}
      <WorkflowsContent
        selectedCountry={selectedCountry}
        selectedEntity={selectedEntity}
        hideFilters={true}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {currentStep > step.id ? (
                  <Check size={16} />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="ml-3">
                <Text
                  variant="body"
                  weight="medium"
                  className={
                    currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                  }
                >
                  {step.title}
                </Text>
                <Text variant="caption" color="muted">
                  {step.description}
                </Text>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {currentStep === 1 && renderCountryStep()}
        {currentStep === 2 && renderEntityStep()}
        {currentStep === 3 && renderWorkflowStep()}
      </div>
    </div>
  );
};

export default WorkflowWizard;
