import PrivateLayout from "../../layouts/private/Index";
import KelasView from "./View";
import ErrorComponent from "../../components/error/Index";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import Konfirmasi from "../../components/Konfirmasi/Index";

import useDeleteKelas from "./useDelete";
import { Link } from "react-router-dom";
import { useKelasData } from "../../data/Index";
import LoadingTable from "../../components/loading/LoadingTable";

const Kelas = () => {
  const { data, isLoading, isError, error, refetch } = useKelasData();
  const { setActiveMenu } = useContext(UserContext);

  const { actions, isModalOpen, handleDelete, setIsModalOpen } =
    useDeleteKelas();

  useEffect(() => {
    document.title = "Kelas";
    setActiveMenu("kelas");
  }, [setActiveMenu]);

  if (isError) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  const new_data = data?.map((item) => ({
    'id': item.id,
    'Kelas': item.name,
    'wali kelas': item.nama_wali_kelas,
    'jumlah siswa':item.jumlah_siswa
  }));

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Kelas</h2>
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
        {isLoading && <LoadingTable />}
        {!isLoading && new_data.length === 0 && (
          <div className="p-4 border-b border-gray-100 flex justify-center items-center">
            <h2 className="text-lg text-gray-800">
              Tidak ada data
            </h2>
          </div>
        )}
        {!isLoading && new_data.length > 0 && <KelasView data={new_data} actions={actions} />}
        <Konfirmasi
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDelete}
          message={`Yakin ingin menghapus kelas ?`}
        />
      </div>
    </PrivateLayout>
  );
};

export default Kelas;
