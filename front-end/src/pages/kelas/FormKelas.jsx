import LoadingButton from "../../components/LoadingButton";
import Input from "../../components/Input/Index";
import useKelasForm from "./useForm";
import { useDataGuru } from "../../data/Index";
import { Loader } from "lucide-react";
import SelectBox from "../../components/SelectBox/Index";
import { TahunAjaran } from "../../utils/libs";

const FormKelas = ({ id }) => {
  const { formData, error, isLoading, handleInputChange, handleSubmit } =
    useKelasForm(id);

  const { data, isLoading:isLoadingGuru } = useDataGuru();
  const new_data = data?.map((item) => ({
    value: item.id,
    label: item.nama,
  }))

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-4">
      <h1>Form Kelas</h1> { isLoadingGuru && <Loader className="animate-spin text-blue-500" /> }
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
      <hr className="border-gray-300 mb-4" />
      <div className="flex justify-end">
        <LoadingButton isLoading={isLoading} />
      </div>
    </form>
  );
};
export default FormKelas;
