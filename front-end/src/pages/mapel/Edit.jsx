import { useParams } from "react-router-dom";
import PrivateLayout from "../../layouts/private/Index";
import { useContext, useEffect } from "react";
import { useMapelId } from "./useData";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";
import FormMapel from "./Form";
import { UserContext } from "../../context/LayoutContext";
import { Loader2 } from "lucide-react";

const EditMapel = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useMapelId(id);
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Mapel";
    setActiveMenu("mapel");
  }, [setActiveMenu]);

  if (error) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="mb-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Edit Data Mata Pelajaran
          </h2>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {!isLoading && <FormMapel id={id} data={data} />}
      </div>
    </PrivateLayout>
  );
};
export default EditMapel;
