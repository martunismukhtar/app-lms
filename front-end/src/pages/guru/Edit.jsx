import { useParams } from "react-router-dom";
import PrivateLayout from "../../layouts/private/Index";
import { useContext, useEffect } from "react";
import { useGuruId } from "./useData";
import ErrorComponent from "../../components/error/Index";
import FormGuru from "./Form";
import { UserContext } from "../../context/LayoutContext";
import LoadingTable from "../../components/loading/LoadingTable";

const EditGuru = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useGuruId(id);
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Guru";
    setActiveMenu("guru");
  }, [setActiveMenu]);

  if (error) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="mb-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Edit Guru</h2>
        </div>
        {isLoading && <LoadingTable />}

        {!isLoading && !data && (
          <p className="text-center text-gray-600">Guru tidak ditemukan</p>
        )}
        {!isLoading && data && <FormGuru id={id} data={data} />}
        
      </div>
    </PrivateLayout>
  );
};
export default EditGuru;
