import PrivateLayout from "../../layouts/private/Index";
import { useCallback, useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorComponent from "../../components/error/Index";

import { Link } from "react-router-dom";
import FilterSiswa from "./FilterSiswa";
import KelasCard from "./KelasCard";
import { useKelasData } from "../../data/Index";

const Siswa = () => {

  const {
    data: kelasList = [],
    isLoading,
    isError,
    error,
    refetch
  } = useKelasData();

  const { setActiveMenu } = useContext(UserContext);
  
  useEffect(() => {
    document.title = "Siswa";
    setActiveMenu("siswa");
  }, [setActiveMenu]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isError) {
    return <ErrorComponent error={error} handleRetry={handleRetry} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Siswa</h2>
          <Link
            to="/siswa/create"
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
            Tambah Siswa
          </Link>
        </div>
        
        <div className="p-4 space-y-6">          
          <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kelasList.map((kelas) => (
                <KelasCard key={kelas.id} kelas={kelas} />
              ))}
            </div>

            {isLoading && (
              <div className="text-center py-4">
                <LoadingSpinner size="small" />
              </div>
            )}
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default Siswa;
