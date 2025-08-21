import { useContext, useEffect } from "react";
import PrivateLayout from "../../layouts/private/Index";
import MateriForm from "./Form";
import { UserContext } from "../../context/LayoutContext";

// Main Component
const AddMateri = () => {
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Materi";
    setActiveMenu("materi");
  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <MateriForm />
        </div>
      </div>
    </PrivateLayout>
  );
};

export default AddMateri;
