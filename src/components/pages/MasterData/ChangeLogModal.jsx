import { useEffect } from "react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Table from "../../atoms/Table";
import { X } from "lucide-react";

// Mock change log data for edit requests - flat structure for table display
const CHANGE_LOG_DATA = {
  "REQ-20241210-004": {
    "Information Update": [
      {
        fieldName: "Customer Name",
        previousValue: "ABC Company Ltd.",
        newValue: "ABC Corporation Ltd.",
      },
      {
        fieldName: "Address",
        previousValue: "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
        newValue: "456 Le Loi Boulevard, District 1, Ho Chi Minh City",
      },
      {
        fieldName: "Phone Number",
        previousValue: "+84-28-1234-5678",
        newValue: "+84-28-9876-5432",
      },
      {
        fieldName: "Email Address",
        previousValue: "contact@abccompany.com",
        newValue: "info@abccorporation.com",
      },
    ],
    "Credit Review": [
      {
        fieldName: "Credit Limit",
        previousValue: "$500,000",
        newValue: "$1,000,000",
      },
      {
        fieldName: "Payment Terms",
        previousValue: "Net 30",
        newValue: "Net 45",
      },
      {
        fieldName: "Credit Rating",
        previousValue: "B+",
        newValue: "A-",
      },
    ],
    "Final Approval": [
      {
        fieldName: "Customer Status",
        previousValue: "Active",
        newValue: "Premium",
      },
      {
        fieldName: "Account Manager",
        previousValue: "John Doe",
        newValue: "Jane Smith",
      },
      {
        fieldName: "Customer Classification",
        previousValue: "Standard",
        newValue: "VIP",
      },
    ],
  },
  // Add data for REQ-20241120-004 - only Information Update step
  "REQ-20241120-004": {
    "Information Update": [
      {
        fieldName: "Customer Name",
        previousValue: "ABC Company Ltd.",
        newValue: "ABC Corporation Ltd.",
      },
      {
        fieldName: "Contact Person",
        previousValue: "John Smith",
        newValue: "Jane Smith",
      },
      {
        fieldName: "Phone Number",
        previousValue: "+84-28-1234-5678",
        newValue: "+84-28-9876-5432",
      },
      {
        fieldName: "Email Address",
        previousValue: "contact@abccompany.com",
        newValue: "info@abccorporation.com",
      },
      {
        fieldName: "Address",
        previousValue: "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
        newValue: "456 Le Loi Boulevard, District 1, Ho Chi Minh City",
      },
    ],
  },
};

const ChangeLogModal = ({ isOpen, onClose, requestId, stepName }) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten all changes from all steps into a single array for table display
  const getAllChanges = () => {
    const requestData = CHANGE_LOG_DATA[requestId];
    if (!requestData) return [];

    const allChanges = [];
    Object.keys(requestData).forEach((step) => {
      requestData[step].forEach((change) => {
        allChanges.push(change);
      });
    });

    return allChanges;
  };

  const changeLogData = getAllChanges();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 !mt-0 flex items-center justify-center z-[110] p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <Text variant="heading" size="lg" weight="semibold">
                Change Log
              </Text>
              <Text variant="caption" color="muted">
                {requestId} - All Changes
              </Text>
            </div>
            <Button variant="ghost" size="small" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {changeLogData.length === 0 ? (
              <div className="text-center py-8">
                <Text variant="body" color="muted">
                  No changes found for this step
                </Text>
              </div>
            ) : (
              <div className="space-y-6">
                <Text variant="body" color="muted" className="text-sm">
                  The following fields were modified during this step:
                </Text>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell className="w-1/3">
                          Field Name
                        </Table.HeaderCell>
                        <Table.HeaderCell className="w-1/3">
                          Previous Value
                        </Table.HeaderCell>
                        <Table.HeaderCell className="w-1/3">
                          New Value
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {changeLogData.map((change, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>
                            <Text variant="body" weight="medium">
                              {change.fieldName}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="bg-red-50 border border-red-200 rounded px-3 py-2">
                              <Text
                                variant="body"
                                className="text-red-800 text-sm"
                              >
                                {change.previousValue || "—"}
                              </Text>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="bg-green-50 border border-green-200 rounded px-3 py-2">
                              <Text
                                variant="body"
                                className="text-green-800 text-sm"
                              >
                                {change.newValue || "—"}
                              </Text>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <Text variant="body" className="text-blue-800 text-sm">
                    <strong>Note:</strong> This change log shows the field
                    modifications that were made during the "{stepName}" step.
                    Red values indicate the previous state, and green values
                    show the updated information.
                  </Text>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeLogModal;
