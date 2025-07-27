import { useState } from "react";
import Text from "../../../atoms/Text";
import Button from "../../../atoms/Button";
import { Code2, Check, AlertCircle } from "lucide-react";

const JSONEditor = ({
  value,
  onChange,
  error,
  placeholder = "Enter JSON...",
}) => {
  const [isValid, setIsValid] = useState(true);

  const handleChange = (newValue) => {
    onChange(newValue);

    // Validate JSON
    try {
      JSON.parse(newValue);
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(formatted);
      setIsValid(true);
    } catch (e) {
      // If invalid JSON, don't format
      setIsValid(false);
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(value);
      setIsValid(true);
      alert("JSON is valid!");
    } catch (e) {
      setIsValid(false);
      alert(`Invalid JSON: ${e.message}`);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isValid ? (
            <div className="flex items-center text-green-600">
              <Check size={16} className="mr-1" />
              <Text variant="caption">Valid JSON</Text>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <AlertCircle size={16} className="mr-1" />
              <Text variant="caption">Invalid JSON</Text>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="small" onClick={formatJSON}>
            <Code2 size={16} className="mr-1" />
            Format
          </Button>
          <Button variant="outline" size="small" onClick={validateJSON}>
            <Check size={16} className="mr-1" />
            Validate
          </Button>
        </div>
      </div>

      {/* Editor with Line Numbers */}
      <div className="relative border rounded-lg overflow-hidden">
        <div className="flex">
          {/* Line Numbers */}
          <div className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-gray-400 text-sm font-mono select-none min-w-[50px]">
            {value.split("\n").map((_, index) => (
              <div key={index} className="leading-5 text-right">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            <textarea
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              rows={12}
              className={`w-full px-3 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none ${
                error || !isValid ? "bg-red-50" : "bg-white"
              }`}
              style={{
                tabSize: 2,
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                lineHeight: "1.25rem", // Match line numbers
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <Text variant="caption" color="error">
          {error}
        </Text>
      )}

      {/* Syntax highlighting hint */}
      <Text variant="caption" color="muted">
        💡 Tip: Use proper JSON syntax with double quotes for strings. Press
        Format to auto-format your JSON.
      </Text>
    </div>
  );
};

export default JSONEditor;
