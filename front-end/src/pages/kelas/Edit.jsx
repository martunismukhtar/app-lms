import PrivateLayout from "../../layouts/private/Index";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import { useParams } from "react-router-dom";
import FormKelas from "./FormKelas";

// API Functions
// Main Component
const EditKelasForm = () => {
  const { id } = useParams();
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    setActiveMenu("kelas");
  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="mb-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Edit Data Kelas
          </h2>
        </div>
        <FormKelas id={id} />
      </div>
    </PrivateLayout>
  );
};

export default EditKelasForm;
