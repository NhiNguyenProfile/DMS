import Tabs from "../../atoms/Tabs";
import { Settings, Shield, Users } from "lucide-react";
import AdminPermissions from "./components/AdminPermissions";
import BusinessUserPermissions from "./components/BusinessUserPermissions";
import PermissionGroupConfig from "./components/PermissionGroupConfig";

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
            tabId="business-user-permissions"
            label="Business User"
            icon={<Users size={16} />}
          >
            <BusinessUserPermissions />
          </Tabs.Panel>
          {/* TO-DO */}
          {/* <Tabs.Panel
            tabId="role-permissions"
            label="Department Permissions"
            icon={<Shield size={16} />}
          >
            <RolePermissions />
          </Tabs.Panel> */}
          <Tabs.Panel
            tabId="group-permissions"
            label="Group Configuration"
            icon={<Shield size={16} />}
          >
            <PermissionGroupConfig />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default PermissionsContent;
