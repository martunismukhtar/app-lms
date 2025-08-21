import BtnKembali from "../../components/Button/BtnKembali";
import SubmitButton from "../../components/Button/SubmitButton";
import Input from "../../components/Input/Index";
import RadioButton from "../../components/RadioButton/Index";
import TextArea from "../../components/Textarea/Index";
import useForm from "./useForm";

const FormGuru = ({ id, data }) => {
  const { formData, isLoading, handleInputChange, handleSubmit } = useForm(
    id,
    data
  );

  return (
    <form method="post" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <Input
            label="Username"
            type="text"
            name="username"
            placeholder="Username"
            required
            readOnly={formData.id ? true : false}
            value={formData.username || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email || ""}
            onChange={handleInputChange}
          />
        </div>
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
            label="Password"
            type="password"
            name="password"
            placeholder="Password"
            required={id ? false : true}
            value={formData.password || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full">
          <Input
            label="Tanggal Lahir"
            type="date"
            name="tanggal_lahir"
            placeholder="Tanggal Lahir"
            required={id ? false : true}
            value={formData.tanggal_lahir || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full">
          <RadioButton
            label="Jenis Kelamin"
            name="jenis_kelamin"
            orientation="horizontal"
            required={true}
            options={[
              { value: "L", label: "Laki-laki" },
              { value: "P", label: "Perempuan" },
            ]}
            selectedValue={formData.jenis_kelamin || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-full">
          <TextArea
            label="Alamat"
            name="alamat"
            placeholder="Alamat"
            value={formData.alamat || ""}
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
export default FormGuru;
