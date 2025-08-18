import Input from "../../components/Input/Index";
import PrivateLayout from "../../layouts/private/Index";
import SelectBox from "../../components/SelectBox/Index";
import InputFile from "../../components/InputFile/Index";
import LoadingButton from "../../components/LoadingButton";
import useMateriForm from "./useMateriForm";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import { useParams } from "react-router-dom";
import { useKelasData, useMapelData } from "./useMateri";
import TextArea from "../../components/Textarea/Index";


// Form Header Component
const FormHeader = () => (
  <div className="p-4 border-b border-gray-100">
    <h2 className="text-lg font-semibold text-gray-800">Form Materi</h2>
  </div>
);

// Form Fields Component
const FormFields = ({ mapelOptions, kelasOptions, formData, error, handleInputChange }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="w-full">
        <SelectBox
          label="Kelas"
          name="kelas"
          required={true}
          error={error.kelas}
          value={formData.kelas}
          onChange={handleInputChange}
          options={kelasOptions}
        />
      </div>
      <div className="w-full">
        <SelectBox
          label="Mata Pelajaran"
          name="mapel"
          required={true}
          error={error.mapel}
          value={formData.mapel}
          onChange={handleInputChange}
          options={mapelOptions}
        />
      </div>
      <div className="w-full md:col-span-2">
        <Input
          label="Judul Materi"
          type="text"
          name="title"
          required={true}
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Masukkan judul materi"
          error={error.title}
        />
      </div>
      <div className="w-full md:col-span-2">
      <TextArea
        label="Ringkasan Materi"
        name="content"
        required={true}
        value={formData.content}
        onChange={handleInputChange}
        placeholder="Masukkan Ringkasan Materi"
        error={error.content}
      />
    </div>
    </div>

    <div className="mb-4">
      <div className="w-1/2">
        <InputFile
          label="File Materi (hanya file PDF)"
          name="file"
          accept="application/pdf"
          onChange={handleInputChange}
          error={error.file}
        />
      </div>
    </div>
  </>
);

// Form Actions Component
const FormActions = ({ isLoading }) => (
  <>
    <hr className="border-gray-300 mb-4" />
    <div className="flex justify-end">
      <LoadingButton
        isLoading={isLoading}
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
      >
        {isLoading ? "Menyimpan..." : "Simpan Materi"}
      </LoadingButton>
    </div>
  </>
);

// Main Component
const EditMateriForm = () => {
  const { id } = useParams();

  const {
    data: mapelData,
    isLoading: isMapelLoading,
    error: mapelError,
  } = useMapelData();
  const {data: kelasData, isLoading: isKelasLoading, error: KelasError} = useKelasData();
  const { formData, error, isLoading, handleInputChange, handleSubmit } =
    useMateriForm(id);

  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Edit Materi";
    setActiveMenu("materi");
  }, [setActiveMenu]);

  // Transform mapel data to options format
  const mapelOptions =
    mapelData?.map((item) => ({
      value: item.id,
      label: item.nama,
    })) || [];

    const kelasOptions = kelasData?.map((item) => ({
    value: item.id,
    label: item.name,
  })) || [];

  // Handle loading state
  if (isMapelLoading || isKelasLoading) {
    return (
      <PrivateLayout>
        <div className="p-6 flex justify-center items-center">
          <div className="text-gray-500">Memuat data...</div>
        </div>
      </PrivateLayout>
    );
  }

  // Handle error state
  if (mapelError) {
    return (
      <PrivateLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">
              Gagal memuat data mata pelajaran. Silakan refresh halaman.
            </p>
          </div>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <div className="p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <FormHeader />
          <div className="p-4 w-full">
            <form
              method="post"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <FormFields
                mapelOptions={mapelOptions}
                kelasOptions={kelasOptions}
                formData={formData}
                error={error}
                handleInputChange={handleInputChange}
              />

              <FormActions isLoading={isLoading} />
            </form>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default EditMateriForm;
