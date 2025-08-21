import { useKelasData } from "../../data/Index";
import useInputSiswaForm from "./useInputSiswaForm";
import Select from "../../components/SelectBox/Select";
import InputFile from "../../components/InputFile/Index";
import BtnKembali from "../../components/Button/BtnKembali";
import SubmitButton from "../../components/Button/SubmitButton";
import { Loader2 } from "lucide-react";

const FormSiswa = () => {
  const {
    formData,
    error,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useInputSiswaForm();

  const {
    data: kelasList = [],
    isLoading: isLoadingKelas,
    isError: isErrorKelas,
  } = useKelasData();

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex gap-4">
        <div className="w-1/2">
          <span>Kelas</span>
          {isLoadingKelas && <Loader2 className="animate-spin text-blue-500" />}
          {isErrorKelas && <span>Terjadi kesalahan</span>}
          {!isLoadingKelas && (
            <Select
              label="Kelas"
              name="kelas"
              value={formData.kelas}
              onChange={handleInputChange}
              required
              options={kelasList.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          )}
        </div>
      </div>

      <InputFile
        label="File Data"
        name="file"
        accept="text/csv"
        maxSize={5 * 1024 * 1024}
        onChange={handleInputChange}
        required
        reset={formData.file ? false : true}
        error={error.file}
      />

      <div className="flex justify-end border-t border-gray-200 pt-4">
        <BtnKembali />
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
};
export default FormSiswa;
