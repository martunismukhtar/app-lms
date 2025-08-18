import LoadingButton from "../../components/LoadingButton";
import useOrganizationForm from "./useOrganizationForm";
import { FORM_FIELDS } from "./CONSTANTA_ORG";

// Components
const FormField = ({ field, formData, error, onChange }) => {
  const Component = field.component;
  const { width, ...otherProps } = field.props;

  return (
    <div className={width}>
      <Component
        {...otherProps}
        value={formData[field.props.name]}
        onChange={onChange}
        error={error[field.props.name]}
      />
    </div>
  );
};

const FormRow = ({ rowData, formData, error, onChange }) => (
  <div className="mb-4 flex gap-4">
    {rowData.fields.map((field, index) => (
      <FormField
        key={`${rowData.row}-${index}`}
        field={field}
        formData={formData}
        error={error}
        onChange={onChange}
      />
    ))}
  </div>
);

// Main component
const FormOrganisasi = () => {
  const { formData, error, isLoading, handleInputChange, handleSubmit } =
    useOrganizationForm();

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-4">
      {FORM_FIELDS.map((rowData) => (
        <FormRow
          key={rowData.row}
          rowData={rowData}
          formData={formData}
          error={error}
          onChange={handleInputChange}
        />
      ))}
      <hr className="border-gray-300" />

      <div className="flex justify-end">
        <LoadingButton isLoading={isLoading} />
      </div>
    </form>
  );
};

export default FormOrganisasi;
