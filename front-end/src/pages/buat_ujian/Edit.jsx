import { useParams } from "react-router-dom";
import PrivateLayout from "../../layouts/private/Index";
import FormBuatUjian from "./Form";
import { useUjianData } from "./useData";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";

const EditUjian = () => {
  const { id } = useParams();
  const { data: formData, error, isLoading, refetch } = useUjianData(id);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Ujian</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto overflow-y-auto m-4">
            <FormBuatUjian id={id} data={formData} />
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};
export default EditUjian;
