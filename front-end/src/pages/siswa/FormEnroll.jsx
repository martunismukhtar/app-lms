import { useMapelData } from "../../data/Index";
import { Loader } from "lucide-react";
import useHandleEnrollForm from "./useHandleEnrollForm";
import SubmitButton from "../../components/Button/SubmitButton";

const FormEnroll = ({ kelas_id, onSuccess }) => {
  const { data: mapelData, isLoading, isError } = useMapelData();
  const { selectedSubjects, handleInputChange, handleSubmit, loadingForm } =
    useHandleEnrollForm(kelas_id);

  const submitData = async (e) => {
    e.preventDefault();
    const success = await handleSubmit(e);
    if (!success) return;
    onSuccess();
  };

  const mapelOptions =
    mapelData?.map((item) => ({
      value: item.id,
      label: item.nama,
    })) || [];

  return (
    <form onSubmit={submitData}>
      <div className="space-y-4">
        <div className="w-full">
          <span>Mata Pelajaran {kelas_id}</span>
          {isLoading && <Loader className="animate-spin text-blue-500" />}
          {isError && <span>Terjadi kesalahan</span>}
          <select
            multiple
            required
            name="mapel"
            value={selectedSubjects}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white h-48"
          >
            {mapelOptions.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <SubmitButton isLoading={loadingForm} />
      </div>
    </form>
  );
};
export default FormEnroll;
