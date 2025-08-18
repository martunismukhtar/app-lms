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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tambah Guru</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto overflow-y-auto m-4">
            <FormGuru />
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default TambahGuru;
