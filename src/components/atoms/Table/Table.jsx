import clsx from "clsx";

const Table = ({
  children,
  className = "",
  striped = false,
  bordered = false,
  hover = false,
  size = "medium",
  ...props
}) => {
  const sizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const tableClass = clsx("w-full table-auto", sizeClasses[size], className);

  const wrapperClass = clsx(
    "overflow-hidden", // Thay đổi từ overflow-x-auto
    {
      "rounded-lg border border-gray-200": bordered,
      "shadow-sm": bordered,
    }
  );

  return (
    <div className={wrapperClass}>
      <table className={tableClass} {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className = "", ...props }) => {
  const headerClass = clsx("bg-gray-50", className);

  return (
    <thead className={headerClass} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({
  children,
  className = "",
  striped = false,
  hover = false,
  ...props
}) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

const TableRow = ({
  children,
  className = "",
  striped = false,
  hover = false,
  selected = false,
  ...props
}) => {
  const rowClass = clsx(
    "border-b border-gray-200 last:border-b-0",
    {
      "bg-gray-50": striped,
      "hover:bg-gray-50 transition-colors": hover,
      "bg-blue-50 border-blue-200": selected,
    },
    className
  );

  return (
    <tr className={rowClass} {...props}>
      {children}
    </tr>
  );
};

const TableCell = ({
  children,
  className = "",
  align = "left",
  padding = "medium",
  as: Component = "td",
  ...props
}) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const paddingClasses = {
    small: "px-3 py-2",
    medium: "px-4 py-3",
    large: "px-6 py-4",
  };

  const cellClass = clsx(
    alignClasses[align],
    paddingClasses[padding],
    "whitespace-nowrap",
    className
  );

  return (
    <Component className={cellClass} {...props}>
      {children}
    </Component>
  );
};

const TableHeaderCell = ({
  children,
  className = "",
  sortable = false,
  ...props
}) => {
  const headerCellClass = clsx(
    "font-semibold text-gray-700 uppercase text-xs tracking-wider",
    {
      "cursor-pointer hover:text-gray-900 select-none": sortable,
    },
    className
  );

  return (
    <TableCell as="th" className={headerCellClass} {...props}>
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortable && (
          <svg
            className="w-4 h-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </TableCell>
  );
};

// Export all components
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.HeaderCell = TableHeaderCell;

export default Table;
export { TableHeader, TableBody, TableRow, TableCell, TableHeaderCell };
