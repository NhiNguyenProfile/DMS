import Text from "../Text";

const EntityCard = ({
  title,
  description,
  image,
  onClick,
  className = "",
  imageAlt = "Entity image",
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow duration-200 overflow-hidden ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-md cursor-pointer"
      } ${className}`}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Text variant="heading" size="md" weight="semibold" className="mb-2">
          {title}
        </Text>
        <Text variant="body" color="muted" className="text-sm line-clamp-2">
          {description}
        </Text>
      </div>
    </div>
  );
};

export default EntityCard;
