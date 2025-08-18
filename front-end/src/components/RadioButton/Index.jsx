const RadioButton = ({
  options,
  name,
  selectedValue,
  onChange,
  label,
  disabled = false,
  required = false,
  orientation = "vertical",
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        className={`flex ${
          orientation === "vertical"
            ? "flex-col space-y-2"
            : "flex-row space-x-4"
        } `}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center cursor-pointer transition-all duration-200
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-[1.02]"
              }
              ${orientation === "vertical" ? "p-3 rounded-lg border" : ""}
              ${
                selectedValue === option.value
                  ? "text-blue-600 border-blue-500 bg-blue-50"
                  : "text-gray-700 border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={onChange}
              disabled={disabled}
              required={required}
              className={`
                h-4 w-4 cursor-pointer transition-all duration-200
                ${
                  selectedValue === option.value
                    ? "text-blue-600 border-blue-500"
                    : "text-gray-400 border-gray-300"
                }
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              `}
            />
            <span className="ml-3 text-sm font-medium">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
export default RadioButton;
