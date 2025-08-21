import LoadingButton from "../../components/LoadingButton";
import Input from "../../components/Input/Index";
import useKelasForm from "./useForm";
import { useDataGuru } from "../../data/Index";
import { Loader, Loader2 } from "lucide-react";
import SelectBox from "../../components/SelectBox/Index";
import { TahunAjaran } from "../../utils/libs";
import BtnKembali from "../../components/Button/BtnKembali";
import SubmitButton from "../../components/Button/SubmitButton";

const FormKelas = ({ id }) => {
  const { formData, error, isLoading, handleInputChange, handleSubmit } =
    useKelasForm(id);

  const { data, isLoading: isLoadingGuru } = useDataGuru();
  const new_data = data?.map((item) => ({
    value: item.id,
    label: item.nama,
  }));

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-4">
      <h1>Form Kelas</h1>      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="w-full">
          <Input
            label="Nama Kelas"
            type="text"
            name="name"
            placeholder="Nama Kelas"
            required
            onChange={handleInputChange}
            error={error.name}
            value={formData.name || ""}
          />
        </div>
        <div className="w-full">
          {isLoadingGuru && <Loader2 className="animate-spin text-blue-500" />}
          {!isLoadingGuru && (
            <SelectBox
              label="Wali Kelas"
              name="wali_kelas"
              required={true}
              error={error.wali_kelas}
              defaultValue={formData.wali_kelas}
              value={formData.wali_kelas}
              onChange={handleInputChange}
              options={new_data}
            />
          )}
        </div>
        <div className="w-full">
          <Input
            label="Tahun Ajaran"
            type="text"
            name="tahun_ajaran"
            placeholder="Tahun Ajaran"
            readOnly={true}
            value={formData.tahun_ajaran || TahunAjaran()}
          />
        </div>
      </div>
      <div className="flex justify-end border-t border-gray-200 pt-4">
        <BtnKembali />
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
};
export default FormKelas;
