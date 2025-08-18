import { useContext, useEffect } from "react";
import PrivateLayout from "../../layouts/private/Index";
import FormMapel from "./Form";
import { UserContext } from "../../context/LayoutContext";

const TambahMapel = () => {
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
      document.title = "Mapel";
      setActiveMenu("mapel");
    }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tambah Mapel</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto overflow-y-auto m-4">
            <FormMapel />
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default TambahMapel;
