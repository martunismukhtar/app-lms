import Input from "./Input";

function InputComponent({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  readOnly=false
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        error={error}
        readOnly={readOnly}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default InputComponent;
