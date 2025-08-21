import PrivateLayout from "../../layouts/private/Index";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import FormSiswa from "./FormSiswa";

export default function FormInputSiswa() {
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    setActiveMenu("siswa");
  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="mb-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Tambah Siswa</h2>
        </div>
        <FormSiswa />
      </div>
    </PrivateLayout>
  );
}
