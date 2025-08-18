import PrivateLayout from "../../layouts/private/Index";
import { useSiswaPerKelas } from "./useUser";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/LayoutContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorComponent from "../../components/error/Index";
import Konfirmasi from "../../components/Konfirmasi/Index";
import { useParams } from "react-router-dom";
import FilterSiswa from "./FilterSiswa";
import SiswaCard from "./SiswaCard";
import useDeleteStudent from "./useDelete";
import Modal from "../../components/Modal/Index";
import FormEnroll from "./FormEnroll";

const SiswaPerkelas = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState({ search: "" });
  const { data, isLoading, refetch, isError, error } = useSiswaPerKelas(
    id,
    filter
  );
  const { handleOpenDelete, isModalOpen, setIsModalOpen, handleDelete } =
    useDeleteStudent();

  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Siswa";
    setActiveMenu("siswa");
  }, [setActiveMenu]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleFilter = (e) => {
    setFilter(e);
  };

  if (isError) {
    return <ErrorComponent error={error} handleRetry={handleRetry} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Siswa</h2>
        </div>
        <hr />
        <div className="p-4 space-y-6">
          <FilterSiswa onFilterChange={handleFilter} refetch={refetch} />
          <div className="flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Daftarkan Mata Pelajaran
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-600">Tidak ada data</p>
                </div>
              )}

              {data?.map((dls) => (
                <SiswaCard
                  key={dls.username}
                  data={dls}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>

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
          message={`Yakin ingin menghapus data siswa ?`}
        />
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Daftarkan Mata Pelajaran"
        size="md"
      >
        <p className="text-gray-600 mb-4">
          Pilih mata pelajaran yang akan di daftarkan.
        </p>
        <FormEnroll kelas_id={id} onSuccess={() => setShowModal(false)} />
      </Modal>
    </PrivateLayout>
  );
};

export default SiswaPerkelas;
