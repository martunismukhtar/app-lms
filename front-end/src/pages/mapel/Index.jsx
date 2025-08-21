import { useContext, useEffect } from "react";
import PrivateLayout from "../../layouts/private/Index";
import { useDataMapel } from "./useData";
import ErrorComponent from "../../components/error/Index";
import ViewMapel from "./View";
import { UserContext } from "../../context/LayoutContext";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Mapel = () => {
  const { data, isLoading, isError, error, refetch } = useDataMapel();
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Mapel";
    setActiveMenu("mapel");
  }, [setActiveMenu]);

  if (isError) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Mata Pelajaran</h2>
          <Link
            to="create"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah
          </Link>
        </div>
        {isLoading && <div className="flex justify-center"><Loader2 className="animate-spin" /></div>}
        {!isLoading && !isError && data && data.length === 0 && (
          <div>Tidak ada data</div>
        )}
        {!isLoading && !isError && data && data.length > 0 && (
          <ViewMapel data={data} />
        )}

      </div>
    </PrivateLayout>
  );
};
export default Mapel;
