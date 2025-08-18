import { useParams } from "react-router-dom";
import PrivateLayout from "../../layouts/private/Index";
import { useContext, useEffect } from "react";
import { useMapelId } from "./useData";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";
import FormMapel from "./Form";
import { UserContext } from "../../context/LayoutContext";

const EditMapel = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useMapelId(id);
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
      document.title = "Mapel";
      setActiveMenu("mapel");
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
        <h1 className="text-2xl font-bold mb-4">Edit Mapel</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto overflow-y-auto m-4">
            <FormMapel id={id} data={data} />
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};
export default EditMapel;
