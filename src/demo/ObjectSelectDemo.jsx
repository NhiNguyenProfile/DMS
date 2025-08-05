import React from "react";
import CustomerDetailForm from "../components/pages/MyRequest/CustomerDetailForm";

const ObjectSelectDemo = () => {
  const mockRequestData = {
    id: "REQ-001",
    requestTitle: "New Customer Registration - Test Conditional Disable",
    currentSteps: "Waiting for Entry",
    stepOwner: "John Doe",
  };

  const handleBack = () => {
    console.log("Back clicked");
  };

  const handleSave = (data) => {
    console.log("=== SAVE DATA ===");
    console.log("Full data:", data);
    console.log("\n=== CONDITIONAL DISABLE TEST ===");
    console.log("Customer Group:", data.customerGroup);
    console.log("Customer Account:", data.customerAccount);
    console.log(
      "Customer Account should be empty if Customer Group is LOC_EXT"
    );

    console.log("\n=== MAIN CUSTOMER AUTO-FILL TEST ===");
    console.log("Main Customer (Final tab):", data.mainCustomer);
    console.log("Main Customer Code (Main tab):", data.mainCustomerCode);
    console.log("Main Customer Name:", data.mainCustomerName);
    console.log("Company (DHV/PBH/PHP/PHY/DGC/DGD):", data.company);
    console.log("Address:", data.address);
    console.log("NIK/NPWP:", data.nikNpwp);

    console.log("\n=== COPY vs EDIT PRE-FILL TEST ===");
    console.log(
      "Copy should only fill: Main Customer + Final Customer General"
    );
    console.log("Edit should fill: ALL sections");
    console.log("City (Address section):", data.city);
    console.log("Primary Email (Contact section):", data.primaryEmail);
    console.log("Currency (Sales section):", data.currency);
    console.log("Credit Limit (Credit section):", data.creditLimit);
    console.log("Price Group (Payment section):", data.priceGroup);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-blue-50 border-b border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800">
          Test Instructions:
        </h2>
        <ul className="mt-2 text-sm text-blue-700 space-y-1">
          <li>
            <strong>Test 1 - Conditional Disable:</strong>
          </li>
          <li>1. Go to "Final Customer" tab</li>
          <li>
            2. Try entering text in "Customer Account" field - should work
            normally
          </li>
          <li>3. Click on "Customer Group" field and select "LOC_EXT"</li>
          <li>
            4. Notice "Customer Account" field becomes disabled and value is
            cleared
          </li>
          <li>
            5. Change "Customer Group" to "AQTP" or "LSTP" - "Customer Account"
            becomes enabled again
          </li>

          <li className="mt-3">
            <strong>
              Test 2 - Main Customer Auto-fill & Horizontal Scroll:
            </strong>
          </li>
          <li>
            6. Click on "Main Customer" field and select "NUSANTARA FARM" or
            "PT. INDONUSA YP S1"
          </li>
          <li>
            7. Notice the modal table has horizontal scroll if content is wide
          </li>
          <li>8. Try scrolling horizontally in the table to see all columns</li>
          <li>9. Notice the field gets filled with selected value</li>
          <li>
            10. Go to "Main Customer" tab and see all fields are auto-filled
          </li>
          <li>11. Try selecting "NEW CUSTOMER" - fields should be empty</li>

          <li className="mt-3">
            <strong>
              Test 3 - Copy vs Edit Functionality & Enhanced Search Table:
            </strong>
          </li>
          <li>12. Go back to request list and click "Add New"</li>
          <li>13. Select "Copy Existing Record"</li>
          <li>
            14. Search for customers (try "ABC", "XYZ", "PARTY-001", etc.)
          </li>
          <li>
            15. Notice the enhanced table with Party ID, Company, and all Final
            Customer General fields
          </li>
          <li>16. Try horizontal scrolling in the table to see all columns</li>
          <li>17. Select a customer from the table</li>
          <li>
            18. Click "Send Request" - should open form with pre-filled data
          </li>
          <li>
            19. Notice ONLY Main Customer + Final Customer General are populated
            (Copy behavior)
          </li>

          <li className="mt-2">
            <strong>Test Edit:</strong>
          </li>
          <li>20. Go back and select "Edit Existing Record"</li>
          <li>21. Search and select a customer</li>
          <li>
            22. Click "Send Request" - should open form with ALL sections
            pre-filled (Edit behavior)
          </li>

          <li className="mt-3">
            <strong>Test 4 - Bulk Create Functionality:</strong>
          </li>
          <li>23. Go back to request list and click "Add New"</li>
          <li>24. Select "Bulk Create Records"</li>
          <li>25. Try "Download Template" to get CSV template</li>
          <li>
            26. Try "Import Excel" to upload file (mock data will be added)
          </li>
          <li>27. Try "Add Manually" to create individual records</li>
          <li>
            28. Notice the form has "Save" button instead of "Submit Request"
          </li>
          <li>
            29. Notice "Cancel" button works directly without confirmation
          </li>
          <li>30. Save customer and see it appear in the table</li>
          <li>
            31. Notice rows with empty Company field are highlighted in light
            red
          </li>
          <li>32. Edit/Delete records in the table</li>
          <li>33. Click "Send Bulk Request" when done</li>
          <li>34. Try "Final Customer" tab to see Address Table</li>
          <li>35. Add/Edit/Delete addresses in the table format</li>
        </ul>
      </div>
      <CustomerDetailForm
        requestData={mockRequestData}
        onBack={handleBack}
        onSave={handleSave}
      />
    </div>
  );
};

export default ObjectSelectDemo;
