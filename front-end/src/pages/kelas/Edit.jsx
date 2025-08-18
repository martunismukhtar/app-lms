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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Kelas</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto overflow-y-auto m-4">
            <FormKelas id={id} />
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default EditKelasForm;
