import Tabs from "../../atoms/Tabs";
import { Settings, Shield, Users, Crown, UserCheck } from "lucide-react";
import AdminPermissions from "./components/AdminPermissions";
import PrivilegeConfig from "./components/PrivilegeConfig";
import DutiesConfig from "./components/DutiesConfig";
import RolesConfig from "./components/RolesConfig";
import GroupAccess from "./components/GroupAccess";
import AccountAccess from "./components/AccountAccess";

const PermissionsContent = () => {
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Tabs defaultTab="admin-permissions" variant="default">
          <Tabs.Panel
            tabId="admin-permissions"
            label="Administrator"
            icon={<Settings size={16} />}
          >
            <AdminPermissions />
          </Tabs.Panel>
          <Tabs.Panel
            tabId="privilege-config"
            label="Privilege Config"
            icon={<Users size={16} />}
          >
            <PrivilegeConfig />
          </Tabs.Panel>
          <Tabs.Panel
            tabId="duties-config"
            label="Duties Config"
            icon={<Shield size={16} />}
          >
            <DutiesConfig />
          </Tabs.Panel>
          <Tabs.Panel
            tabId="roles-config"
            label="Roles Config"
            icon={<Crown size={16} />}
          >
            <RolesConfig />
          </Tabs.Panel>
          <Tabs.Panel
            tabId="group-access"
            label="Business User Access"
            icon={<UserCheck size={16} />}
          >
            <AccountAccess />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default PermissionsContent;
