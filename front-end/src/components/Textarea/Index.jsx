import { useEffect, useState } from "react";

const TextArea = ({
  value = "",         // Controlled component
  onChange,
  label,
  name,
  placeholder,
  required = false,
  error,
}) => {
  const maxChars = 250;

  const [charCount, setCharCount] = useState(value.length);

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleInputChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxChars) {
      onChange(e); // Biarkan parent yang mengatur value
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value} // Controlled
          onChange={handleInputChange}
          maxLength={maxChars}
          required={required}
          placeholder={placeholder}
          className={`w-full h-40 px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none transition-all duration-200 placeholder-gray-400 ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-indigo-500'}`}
          aria-label={label}
          aria-describedby={`${name}-char-count`}

        />

        <p
          id={`${name}-char-count`}
          className="absolute bottom-3 right-4 text-sm text-gray-400"
          aria-live="polite"
        >
          {charCount}/{maxChars}
        </p>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TextArea;
