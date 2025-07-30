import { useState } from "react";
import Text from "../../atoms/Text";
import Input from "../../atoms/Input";
import EntityCard from "../../atoms/EntityCard";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import Button from "../../atoms/Button";
import CustomerSearchResults from "./CustomerSearchResults";
import FinishedGoodsSearchResults from "./FinishedGoodsSearchResults";
import SparePartsSearchResults from "./SparePartsSearchResults";

// Sample countries data
const COUNTRIES = [
  {
    id: 1,
    name: "Vietnam",
    code: "VN",
    description: "Search records in Vietnam operations",
    image:
      "https://www.deheus.com.vn/contentassets/20da7b24992f46eeb74f1914a3ce1735/premix-plant.png?mode=crop&width=622",
  },
];

// Sample search entities for Vietnam
const SEARCH_ENTITIES = [
  {
    id: 1,
    title: "Customers",
    description:
      "Search and view customer records, transaction history, and account details. Access comprehensive customer database.",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 2,
    title: "Spare Parts",
    description:
      "Search spare parts inventory, check availability, and view part specifications. Find parts by code, name, or category.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Finished Goods",
    description:
      "Search finished goods inventory, track product status, and view production history. Find products by SKU or description.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop&crop=center",
  },
];

const Search = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter entities based on search term
  const filteredEntities = SEARCH_ENTITIES.filter(
    (entity) =>
      entity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  const handleBackToCountries = () => {
    setSelectedCountry(null);
    setSelectedEntity(null);
    setSearchTerm("");
  };

  const handleBackToEntities = () => {
    setSelectedEntity(null);
    setSearchTerm("");
  };

  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
  };

  // Show search results if entity is selected
  if (selectedEntity) {
    switch (selectedEntity.title) {
      case "Customers":
        return (
          <CustomerSearchResults
            onBack={handleBackToEntities}
            country={selectedCountry}
          />
        );
      case "Spare Parts":
        return (
          <SparePartsSearchResults
            onBack={handleBackToEntities}
            country={selectedCountry}
          />
        );
      case "Finished Goods":
        return (
          <FinishedGoodsSearchResults
            onBack={handleBackToEntities}
            country={selectedCountry}
          />
        );
      default:
        return null;
    }
  }

  // Show country selection if no country is selected
  if (!selectedCountry) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Text variant="heading" size="xl" weight="bold" className="mb-2">
            Master Data Records
          </Text>
          <Text variant="body" color="muted">
            Select a country to search records
          </Text>
        </div>

        {/* Country Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {COUNTRIES.map((country) => (
            <EntityCard
              key={country.id}
              title={country.name}
              description={country.description}
              image={country.image}
              onClick={() => handleCountryClick(country)}
              className="hover:border-blue-300"
            />
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <Text variant="body" color="muted" className="text-sm">
            {COUNTRIES.length} country available for search
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBackToCountries}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div>
            <Text variant="heading" size="xl" weight="bold" className="mb-2">
              Master Data Records - {selectedCountry.name}
            </Text>
            <Text variant="body" color="muted">
              Search and view records by entity type
            </Text>
          </div>
        </div>
      </div>

      {/* Entity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEntities.map((entity) => (
          <EntityCard
            key={entity.id}
            title={entity.title}
            description={entity.description}
            image={entity.image}
            onClick={() => handleEntityClick(entity)}
            className="hover:border-green-300"
          />
        ))}
      </div>

      {/* No results */}
      {filteredEntities.length === 0 && (
        <div className="text-center py-12">
          <Text variant="body" color="muted">
            No entities found matching "{searchTerm}"
          </Text>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <Text variant="body" color="muted" className="text-sm">
          Showing {filteredEntities.length} of {SEARCH_ENTITIES.length} entities
        </Text>
      </div>
    </div>
  );
};

export default Search;
