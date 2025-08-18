import { useCallback, useContext, useEffect } from "react";
import PrivateLayout from "../../layouts/private/Index";
import { useDataGuru } from "./useData";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";
import ViewGuru from "./View";
import useDeleteGuru from "./useDelete";
import Konfirmasi from "../../components/Konfirmasi/Index";
import { UserContext } from "../../context/LayoutContext";
import { Link } from "react-router-dom";

const Guru = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useDataGuru();

  const {
    actions,
    isModalOpen,    
    handleDelete,
    setIsModalOpen,
  } = useDeleteGuru();
  const { setActiveMenu } = useContext(UserContext);

  
  useEffect(() => {
    document.title = "Guru";
    setActiveMenu("guru");
  }, [setActiveMenu]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const new_data = data?.map((item) => {
    return {
      ...item,
      jenis_kelamin: item.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
    };
  })

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Guru</h2>
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
        <ViewGuru
          data={new_data}
          actions={actions}
          loadMore={handleLoadMore}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
        />
        <Konfirmasi
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDelete}
          message={`Yakin ingin menghapus guru ?`}
        />
      </div>
    </PrivateLayout>
  );
};
export default Guru;
