import { useParams } from "react-router-dom";
import PrivateLayout from "../../layouts/private/Index";
import { useDataHakAkses } from "./useData";
import GroupedPermissions from "./GroupedPermissions";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";

const HakAkses = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error, refetch } = useDataHakAkses();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">        
        <GroupedPermissions permissions={data} id={id} />
      </div>
    </PrivateLayout>
  );
};
export default HakAkses;
