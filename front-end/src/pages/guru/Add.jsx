import { useContext, useEffect } from "react";
import PrivateLayout from "../../layouts/private/Index";
import FormGuru from "./Form";
import { UserContext } from "../../context/LayoutContext";

const TambahGuru = () => {
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Guru";
    setActiveMenu("guru");
  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="mb-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Tambah Guru</h2>
        </div>
        <FormGuru />
      </div>
    </PrivateLayout>
  );
};

export default TambahGuru;
