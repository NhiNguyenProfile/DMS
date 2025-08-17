// Entity types
export const ENTITIES = ["Customer", "Spare Part", "Finished Good"];

// Request types
export const REQUEST_TYPES = [
  { value: "Create", label: "Create" },
  { value: "Copy", label: "Copy" },
  { value: "Extend", label: "Extend" },
  { value: "Edit", label: "Edit" },
  { value: "Disable", label: "Disable" },
  { value: "Unlock", label: "Unlock" },
];

// Field types
export const FIELD_TYPES = [
  { value: "Text", label: "Text" },
  { value: "Dropdown", label: "Dropdown" },
  { value: "Checkbox", label: "Checkbox" },
  { value: "Date", label: "Date" },
  { value: "Toggle", label: "Toggle" },
];

// Rule operators
export const RULE_OPERATORS = [
  { value: "EQUALS", label: "Equals" },
  { value: "IN", label: "In" },
  { value: "REGEX", label: "Regex" },
  { value: "GREATER_THAN", label: "Greater Than" },
  { value: "LESS_THAN", label: "Less Than" },
  { value: "NOT_EQUALS", label: "Not Equals" },
  { value: "CONTAINS", label: "Contains" },
];

// Rule status
export const RULE_STATUS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

// Countries
export const COUNTRIES = [
  { value: "VN", label: "Vietnam" },
  { value: "NL", label: "Netherlands" },
];

// Default country
export const DEFAULT_COUNTRY = "Vietnam";

// JSON Templates
export const JSON_TEMPLATES = {
  criteria: [{ field_name: "level", operator: "IN", values: ["L1", "L2"] }],
  configuration: [
    {
      field_name: "email",
      label: "Email Address",
      required: true,
      display: true,
      operator: "REGEX",
      value: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
      message: "Invalid email format",
    },
    {
      field_name: "customer_name",
      label: "Customer Name",
      required: true,
      display: true,
      operator: "REQUIRED",
      value: "",
      message: "Customer name is required",
    },
    {
      field_name: "phone_number",
      label: "Phone Number",
      required: false,
      display: true,
      operator: "REGEX",
      value: "^[0-9]{10,11}$",
      message: "Invalid phone number format",
    },
  ],
};

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Invalid email format",
  INVALID_JSON: "Invalid JSON format",
  DUPLICATE_FIELD_CODE: "Field code already exists",
  DUPLICATE_RULE_NAME: "Rule name already exists",
};

// Workflow constants
export const WORKFLOW_STATUS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export const STEP_TYPES = [
  { value: "Entry Data", label: "Entry Data" },
  { value: "Approval", label: "Approval" },
  { value: "Entry Data + Approval", label: "Entry Data + Approval" },
];

export const TIMEOUT_ACTIONS = [
  { value: "None", label: "None" },
  { value: "Remind", label: "Remind" },
  { value: "Escalate", label: "Escalate" },
  { value: "Auto-Reject", label: "Auto-Reject" },
];

export const ROLES = [
  { value: "Sale Admin", label: "Sale Admin" },
  { value: "Credit Officer", label: "Credit Officer" },
  { value: "Legal", label: "Legal" },
  { value: "Finance", label: "Finance" },
  { value: "Manager", label: "Manager" },
];

export const USERS = [
  { value: "john.doe", label: "John Doe" },
  { value: "jane.smith", label: "Jane Smith" },
  { value: "bob.johnson", label: "Bob Johnson" },
  { value: "alice.brown", label: "Alice Brown" },
];

// Assigned Types
export const ASSIGNED_TYPES = [
  { value: "User", label: "User" },
  { value: "Group", label: "Group" },
  { value: "Request Owner", label: "Request Owner" },
  { value: "Approver", label: "Approver" },
];

// Mail Recipients - Accounts with name and email
export const MAIL_RECIPIENTS = [
  { value: "john.doe@company.com", label: "John Doe (john.doe@company.com)" },
  {
    value: "jane.smith@company.com",
    label: "Jane Smith (jane.smith@company.com)",
  },
  {
    value: "mike.johnson@company.com",
    label: "Mike Johnson (mike.johnson@company.com)",
  },
  {
    value: "sarah.wilson@company.com",
    label: "Sarah Wilson (sarah.wilson@company.com)",
  },
  {
    value: "david.brown@company.com",
    label: "David Brown (david.brown@company.com)",
  },
  {
    value: "lisa.davis@company.com",
    label: "Lisa Davis (lisa.davis@company.com)",
  },
  {
    value: "robert.miller@company.com",
    label: "Robert Miller (robert.miller@company.com)",
  },
  {
    value: "emily.garcia@company.com",
    label: "Emily Garcia (emily.garcia@company.com)",
  },
  {
    value: "james.martinez@company.com",
    label: "James Martinez (james.martinez@company.com)",
  },
  {
    value: "anna.rodriguez@company.com",
    label: "Anna Rodriguez (anna.rodriguez@company.com)",
  },
  {
    value: "thomas.lee@company.com",
    label: "Thomas Lee (thomas.lee@company.com)",
  },
  {
    value: "maria.gonzalez@company.com",
    label: "Maria Gonzalez (maria.gonzalez@company.com)",
  },
  {
    value: "william.anderson@company.com",
    label: "William Anderson (william.anderson@company.com)",
  },
  {
    value: "jennifer.taylor@company.com",
    label: "Jennifer Taylor (jennifer.taylor@company.com)",
  },
  {
    value: "michael.thomas@company.com",
    label: "Michael Thomas (michael.thomas@company.com)",
  },
  {
    value: "jessica.jackson@company.com",
    label: "Jessica Jackson (jessica.jackson@company.com)",
  },
  {
    value: "christopher.white@company.com",
    label: "Christopher White (christopher.white@company.com)",
  },
  {
    value: "ashley.harris@company.com",
    label: "Ashley Harris (ashley.harris@company.com)",
  },
  {
    value: "matthew.martin@company.com",
    label: "Matthew Martin (matthew.martin@company.com)",
  },
  {
    value: "amanda.thompson@company.com",
    label: "Amanda Thompson (amanda.thompson@company.com)",
  },
];

// Groups (will be configured in another tab later)
export const GROUPS = [
  { value: "Sales Team", label: "Sales Team" },
  { value: "Finance Team", label: "Finance Team" },
  { value: "Operations Team", label: "Operations Team" },
  { value: "Technical Team", label: "Technical Team" },
  { value: "Management Team", label: "Management Team" },
];
