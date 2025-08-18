import { useContext, useEffect } from "react";
import PrivateLayout from "../../layouts/private/Index";
import FormSemester from "./Form";
import { UserContext } from "../../context/LayoutContext";

const Semester = () => {  
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Semester";
    setActiveMenu("semester");

  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Atur Semester</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">          
          <div className="overflow-x-auto overflow-y-auto m-4">
            <FormSemester />
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};
export default Semester;
