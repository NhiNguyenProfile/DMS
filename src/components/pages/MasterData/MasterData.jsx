import { useState } from "react";
import Text from "../../atoms/Text";
import Tabs from "../../atoms/Tabs";
import { Globe, Building, Users } from "lucide-react";
import CountryMasterData from "./components/CountryMasterData";
import LegalEntityMasterData from "./components/LegalEntityMasterData";
import DepartmentMasterData from "./components/DepartmentMasterData";

const MasterData = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Data Management
        </Text>
        <Text variant="body" color="muted">
          Manage countries, legal entities, and departments with Dynamic 365
          synchronization
        </Text>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Tabs defaultTab="countries" variant="default">
          <Tabs.Panel
            tabId="countries"
            label="Countries"
            icon={<Globe size={16} />}
          >
            <CountryMasterData />
          </Tabs.Panel>

          <Tabs.Panel
            tabId="legal-entities"
            label="Legal Entities"
            icon={<Building size={16} />}
          >
            <LegalEntityMasterData />
          </Tabs.Panel>

          <Tabs.Panel
            tabId="departments"
            label="Departments"
            icon={<Users size={16} />}
          >
            <DepartmentMasterData />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default MasterData;
