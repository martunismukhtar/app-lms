import Select from "./Select";

const SelectBox = ({ 
  label, 
  options, 
  value, 
  name, 
  onChange, 
  required=false, 
  ref=null }) => {
  return (
    <div className="space-y-1">
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Select
        label={label}
        options={options}
        value={value}
        name={name}
        onChange={onChange}
        required={required}
        ref={ref}
      />
    </div>
  );
};

export default SelectBox;
