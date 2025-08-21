import Input from "../../components/Input/Index";
import PrivateLayout from "../../layouts/private/Index";
import SelectBox from "../../components/SelectBox/Index";
import InputFile from "../../components/InputFile/Index";
import useMateriForm from "./useMateriForm";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import { useKelasData } from "./useMateri";
import TextArea from "../../components/Textarea/Index";
import { useParams } from "react-router-dom";
import { useMapelBerdasarkanId } from "../../data/Index";
import { Loader2 } from "lucide-react";
import BtnKembali from "../../components/Button/BtnKembali";
import SubmitButton from "../../components/Button/SubmitButton";

// Form Header Component
const FormHeader = () => (
  <div className="p-4 border-b border-gray-100">
    <h2 className="text-lg font-semibold text-gray-800">Form Materi</h2>
  </div>
);

// Main Component
const MateriForm = () => {
  const { id, mapel_id } = useParams();

  const {
    data: mapelData,
    isLoading: isMapelLoading,
    error: mapelError,
  } = useMapelBerdasarkanId(mapel_id);

  const {
    data: kelasData,
    isLoading: isKelasLoading,
    error: KelasError,
  } = useKelasData();

  const {
    formData,
    error,
    isLoading,
    // Actions
    handleInputChange,
    handleSubmit,
    setFormData,
  } = useMateriForm(id);

  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    setActiveMenu("materi");
    setFormData((prevFormData) => ({
      ...prevFormData,
      mapel: mapel_id,
    }));
  }, [setActiveMenu, mapel_id, setFormData]);

  // Transform mapel data to options format
  const mapelOptions =
    mapelData?.map((item) => ({
      value: item.id,
      label: item.nama,
    })) || [];

  const kelasOptions =
    kelasData?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  // Handle error state
  if (mapelError || KelasError) {
    return (
      <PrivateLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">
              Gagal memuat data. Silakan refresh halaman.
            </p>
          </div>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <>
      <FormHeader />
      <div className="p-4 w-full">
        <form
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="w-full">
              {isKelasLoading && <Loader2 className="animate-spin" />}
              {!isKelasLoading && (
                <SelectBox
                  label="Kelas"
                  name="kelas"
                  required={true}
                  error={error.kelas}
                  value={formData.kelas}
                  onChange={handleInputChange}
                  options={kelasOptions}
                />
              )}
            </div>
            <div className="w-full">
              {isMapelLoading && <Loader2 className="animate-spin" />}
              {!isMapelLoading && (
                <SelectBox
                  label="Mata Pelajaran"
                  name="mapel"
                  required={true}
                  error={error.mapel}
                  value={formData.mapel || mapel_id}
                  onChange={handleInputChange}
                  options={mapelOptions}
                  readOnly={true}
                />
              )}
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
            <InputFile
              label="File Materi (hanya file PDF)"
              name="file"
              required={id?.false}
              accept="application/pdf"
              onChange={handleInputChange}
              error={error.file}
              reset={formData.file === null}
            />
          </div>
          <div className="flex justify-end border-t border-gray-200 pt-4">
            <BtnKembali />
            <SubmitButton isLoading={isLoading} />
          </div>
        </form>
      </div>
    </>
  );
};

export default MateriForm;
