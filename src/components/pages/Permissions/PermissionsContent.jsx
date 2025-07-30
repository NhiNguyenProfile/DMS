import { useState } from "react";
import Text from "../../atoms/Text";
import Tabs from "../../atoms/Tabs";
import { Shield, Settings } from "lucide-react";
import RolePermissions from "./components/RolePermissions";
import AdminPermissions from "./components/AdminPermissions";

const PermissionsContent = () => {
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Tabs defaultTab="role-permissions" variant="default">
          <Tabs.Panel
            tabId="role-permissions"
            label="Role Permissions"
            icon={<Shield size={16} />}
          >
            <RolePermissions />
          </Tabs.Panel>

          <Tabs.Panel
            tabId="admin-permissions"
            label="Admin Permissions"
            icon={<Settings size={16} />}
          >
            <AdminPermissions />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default PermissionsContent;
