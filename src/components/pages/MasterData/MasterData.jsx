import { useState } from "react";
import Text from "../../atoms/Text";
import VerticalTabs from "../../atoms/VerticalTabs";
import { Globe, Building, Users, Database } from "lucide-react";
import CountryMasterData from "./components/CountryMasterData";
import LegalEntityMasterData from "./components/LegalEntityMasterData";
import DepartmentMasterData from "./components/DepartmentMasterData";
import MasterDataRecords from "./MasterDataRecords";

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
        <VerticalTabs defaultTab="countries" variant="default">
          <VerticalTabs.Panel
            tabId="countries"
            label="Countries"
            icon={<Globe size={16} />}
          >
            <CountryMasterData />
          </VerticalTabs.Panel>

          <VerticalTabs.Panel
            tabId="legal-entities"
            label="Legal Entities"
            icon={<Building size={16} />}
          >
            <LegalEntityMasterData />
          </VerticalTabs.Panel>

          <VerticalTabs.Panel
            tabId="departments"
            label="Departments"
            icon={<Users size={16} />}
          >
            <DepartmentMasterData />
          </VerticalTabs.Panel>

          <VerticalTabs.Panel
            tabId="records"
            label="Records"
            icon={<Database size={16} />}
          >
            <MasterDataRecords />
          </VerticalTabs.Panel>
        </VerticalTabs>
      </div>
    </div>
  );
};

export default MasterData;
