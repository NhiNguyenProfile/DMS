import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import DashboardLayout from "../../templates/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Text variant="heading" size="2xl" weight="bold" className="mb-2">
            Welcome to DMS
          </Text>
          <Text variant="body" color="muted" className="mb-4">
            Document Management System - Manage your documents efficiently
          </Text>
          <Button variant="primary">
            Get Started
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Text variant="body" color="muted" size="small" className="mb-1">
              Total Documents
            </Text>
            <Text variant="heading" size="2xl" weight="bold" color="primary">
              1,234
            </Text>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Text variant="body" color="muted" size="small" className="mb-1">
              Active Users
            </Text>
            <Text variant="heading" size="2xl" weight="bold" color="success">
              56
            </Text>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Text variant="body" color="muted" size="small" className="mb-1">
              Storage Used
            </Text>
            <Text variant="heading" size="2xl" weight="bold" color="warning">
              2.4 GB
            </Text>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Text variant="body" color="muted" size="small" className="mb-1">
              Pending Reviews
            </Text>
            <Text variant="heading" size="2xl" weight="bold" color="danger">
              12
            </Text>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <Text variant="heading" size="xl" weight="semibold" className="mb-4">
            Recent Activity
          </Text>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Text variant="body" size="small" color="primary" weight="medium">
                    D
                  </Text>
                </div>
                <div className="flex-1">
                  <Text variant="body" weight="medium">
                    Document {item} was uploaded
                  </Text>
                  <Text variant="caption" color="muted">
                    2 hours ago
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
