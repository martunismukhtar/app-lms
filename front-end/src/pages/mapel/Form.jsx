import BtnKembali from "../../components/Button/BtnKembali";
import SubmitButton from "../../components/Button/SubmitButton";
import Input from "../../components/Input/Index";
import useForm from "./useForm";

const FormMapel = ({ id, data }) => {
  const { 
    formData, 
    isLoading, 
    handleInputChange, 
    handleSubmit 
  } = useForm(
    id,
    data
  );

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">        
        <div className="w-full">
          <Input
            label="Nama"
            type="text"
            name="nama"
            placeholder="Nama"
            required
            value={formData.nama || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full">
          <Input
            label="Kode"
            type="text"
            name="kode"
            placeholder="kode"
            required
            value={formData.kode || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full">
          <Input
            label="Kelompok"
            type="text"
            name="kelompok"
            placeholder="Kelompok"
            required
            value={formData.kelompok || ""}
            onChange={handleInputChange}
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
export default FormMapel;
