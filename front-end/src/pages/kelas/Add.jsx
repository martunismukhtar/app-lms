import { useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import PrivateLayout from "../../layouts/private/Index";
import FormKelas from "./FormKelas";

const TambahKelas = () => {
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Kelas";
    setActiveMenu("kelas");
  }, [setActiveMenu]);
  
  return (
    <PrivateLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tambah Kelas</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto overflow-y-auto m-4">
            <FormKelas />
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};
export default TambahKelas;
