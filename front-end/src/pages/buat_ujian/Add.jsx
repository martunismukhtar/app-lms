import PrivateLayout from "../../layouts/private/Index";
import FormBuatUjian from "./Form";

const TambahDataUjian = () => {
  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Form Buat Ujian Baru</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto overflow-y-auto m-4">
            <FormBuatUjian />
          </div>
        </div>
      </div>
      </div>
    </PrivateLayout>
  );
};

export default TambahDataUjian;
