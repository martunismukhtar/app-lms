import PrivateLayout from "../../layouts/private/Index";
import KelasView from "./View";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import Konfirmasi from "../../components/Konfirmasi/Index";
import { useKelas } from "./useData";
import useDeleteKelas from "./useDelete";
import { Link } from "react-router-dom";

const Kelas = () => {
  const { data, isLoading, isError, error, refetch } = useKelas();
  const { setActiveMenu } = useContext(UserContext);

  const { actions, isModalOpen, handleDelete, setIsModalOpen } =
    useDeleteKelas();

  useEffect(() => {
    document.title = "Kelas";
    setActiveMenu("kelas");
  }, [setActiveMenu]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  const new_data = data?.map((item) => ({
    ...item,
    wali_kelas: item.nama_wali_kelas,
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
        <hr />
        <KelasView data={new_data} actions={actions} />
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
