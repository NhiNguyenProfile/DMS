import Text from "../../atoms/Text";
import PermissionsContent from "./PermissionsContent";

const Permissions = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Text variant="heading" size="xl" weight="bold" className="mb-2">
          Permissions Management
        </Text>
        <Text variant="body" color="muted">
          Configure user permissions and access control
        </Text>
      </div>

      {/* Permissions Content */}
      <PermissionsContent />
    </div>
  );
};

export default Permissions;
