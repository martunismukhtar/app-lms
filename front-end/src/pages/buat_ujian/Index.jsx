import { useContext, useEffect, useState } from "react";
import PrivateLayout from "../../layouts/private/Index";
import { useUjianData } from "../../data/Index";
import ErrorComponent from "../../components/error/Index";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/LayoutContext";
import useActionsUjian from "./useActions";
import Konfirmasi from "../../components/Konfirmasi/Index";
import LoadingSpinner from "../../components/LoadingSpinner";
import FilterUjian from "./FilterUjian";
import Tabel from "../../components/DataTable/Index";

const BuatUjian = () => {
  const [filter, setFilter] = useState({ mapel: "", kelas: "", search: "" });
  const { data, isLoading, isError, error, refetch } = useUjianData(filter);
  const { actions, isModalOpen, handleDelete, setIsModalOpen } =
    useActionsUjian();

  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Buat Ujian";
    setActiveMenu("buat-ujian");
  }, [setActiveMenu]);

  const handleFilter = (e) => {
    setFilter(e);    
  };

  const newData = data?.map(
    ({
      id,
      judul,
      jenis_ujian,
      tanggal,
      tanggal_akhir,
      nama_mapel,
      nama_kelas,
    }) => ({
      id,
      Judul: judul || "",
      "Jenis Ujian": jenis_ujian || "-",
      "Mata Pelajaran": nama_mapel || "-",
      kelas: nama_kelas || "-",
      "Tanggal Mulai":
        new Date(tanggal).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }) || "-",
      "Tanggal Selesai":
        new Date(tanggal_akhir).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }) || "-",
    })
  );

  if (isError) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Ujian</h2>
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
            Buat Ujian
          </Link>
        </div>
        
        <div className="p-4 space-y-6">
          <FilterUjian onFilterChange={handleFilter} refetch={refetch} />
          <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
            <Tabel data={newData} actions={actions} />
            {isLoading && (
              <div className="text-center py-4">
                <LoadingSpinner size="small" />
              </div>
            )}
          </div>
        </div>
        <Konfirmasi
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDelete}
          message={`Yakin ingin menghapus data ujian ?`}
        />
      </div>
    </PrivateLayout>
  );
};
export default BuatUjian;
