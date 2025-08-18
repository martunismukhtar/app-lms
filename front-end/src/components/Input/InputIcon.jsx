const InputIcon = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  error,
}) => {
  return (
    <input
      id={name}
      name={name}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all ${
        error
          ? "border-red-500 focus:ring-red-300"
          : "border-gray-300 focus:ring-indigo-500"
      }`}
    />
  );
};

export default InputIcon;
