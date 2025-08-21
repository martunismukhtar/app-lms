const Select = ({
  label,
  options,
  value,
  name,
  onChange,
  required = false,
  ref=null,
}) => {
  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      ref={ref}
      className="w-full px-5 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">Pilih {label}</option>
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
export default Select;
