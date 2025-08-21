import BtnKembali from "../../components/Button/BtnKembali";
import SubmitButton from "../../components/Button/SubmitButton";
import LoadingButton from "../../components/LoadingButton";
import SelectBox from "../../components/SelectBox/Index";
import useSemesterForm from "./useSemesterForm";

let tgl = new Date();
let tahun = tgl.getFullYear();
let tahun_ajaran = tahun + "/" + (tahun + 1);
const FORM_FIELDS = [
  {
    row: 1,
    fields: [
      {
        component: SelectBox,
        props: {
          label: "Tahun Ajaran",
          name: "tahun",
          required: true,
          options: [
            {
              value: tahun_ajaran,
              label: tahun_ajaran,
            },
          ],
          width: "w-1/2",
        },
      },
      {
        component: SelectBox,
        props: {
          label: "Semester",
          name: "semester",
          required: true,
          options: [
            {
              value: "ganjil",
              label: "Ganjil",
            },
            {
              value: "genap",
              label: "Genap",
            },
          ],
          width: "w-1/2",
        },
      },
    ],
  },
];

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
const FormSemester = () => {
  const {
    formData,
    error,
    isLoading,
    handleInputChange,
    handleSubmit,
    isLoadingSemester,
    errorSemester,
  } = useSemesterForm();
  if (isLoadingSemester) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-500">Memuat data semester...</div>
      </div>
    );
  }

  // Handle error state
  if (errorSemester) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">
            Gagal memuat data semester. Silakan refresh halaman.
          </p>
        </div>
      </div>
    );
  }

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
      <div className="flex justify-end border-t border-gray-200 pt-4">
        <BtnKembali />
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
};

export default FormSemester;
