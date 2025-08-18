import { useParams } from "react-router-dom";
import PrivateLayout from "../../layouts/private/Index";
import { useContext, useEffect } from "react";
import { useGuruId } from "./useData";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";
import FormGuru from "./Form";
import { UserContext } from "../../context/LayoutContext";

const EditGuru = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useGuruId(id);
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
      document.title = "Guru";
      setActiveMenu("guru");
    }, [setActiveMenu]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Guru</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto overflow-y-auto m-4">
            <FormGuru id={id} data={data} />
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};
export default EditGuru;
