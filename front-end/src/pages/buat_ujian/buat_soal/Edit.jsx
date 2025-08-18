import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../context/LayoutContext";
import PrivateLayout from "../../../layouts/private/Index";
import RichEditor from "../../../components/Editor/Index";
import LoadingButton from "../../../components/LoadingButton";
import { useSoalById } from "../useData";
import ErrorComponent from "../../../components/error/Index";
import useFormSoal from "./useFormSoal";

const EditSoal = () => {
  const { id } = useParams();

  const { data, error, isLoading, refetch } = useSoalById(id);
  const {
    formData,
    error: formError,
    isLoading: formLoading,
    handleSubmit,
    handleRadioChange,
    handlePilihanChange,
    handlePertanyaanChange,
  } = useFormSoal(id, data);

  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Edit Soal";
    setActiveMenu("soal");
  }, [setActiveMenu]);

  if (isLoading) {
    return <PrivateLayout>Loading...</PrivateLayout>;
  }

  if (error) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="p-4 bg-white shadow rounded">
        <h1 className="text-xl font-bold mb-6">Edit Soal</h1>
        <form onSubmit={handleSubmit}>
          {formError.message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{formError.message}</span>
            </div>
          )}
          <div className="mb-6 p-4  rounded shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Pertanyaan
            </h2>
            
            <RichEditor
              value={data.pertanyaan}
              onChange={handlePertanyaanChange}
              className="min-h-[120px]"
            />
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Pilihan Jawaban
            </h2>
            {data.pilihan &&
              Object.entries(data.pilihan).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-3 mb-4">
                  <input
                    type="radio"
                    name={`radio-${data.id}`}
                    onChange={handleRadioChange}
                    value={key}
                    checked={formData.jawaban_benar === key}
                    className="cursor-pointer mt-2 w-6 h-6 text-indigo-600 accent-indigo-600 focus:ring-2 focus:ring-indigo-400"
                  />
                  <div className="flex-1">
                    <RichEditor
                      value={value}
                      onChange={(e) => handlePilihanChange(key, e)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* Tombol Submit */}
          <div className="flex justify-end">
            <LoadingButton isLoading={formLoading}>Simpan</LoadingButton>
          </div>
        </form>
      </div>
    </PrivateLayout>
  );
};

export default EditSoal;
