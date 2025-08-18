import { useCallback, useContext, useEffect } from "react";
import PrivateLayout from "../../layouts/private/Index";
import { useDataMapel } from "./useData";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";
import ViewMapel from "./View";
import useDeleteMapel from "./useDelete";
import Konfirmasi from "../../components/Konfirmasi/Index";
import { UserContext } from "../../context/LayoutContext";

const Mapel = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useDataMapel();

  const {
    actions,
    isModalOpen,    
    handleDelete,
    setIsModalOpen,
  } = useDeleteMapel();
  const { setActiveMenu } = useContext(UserContext);

  
  useEffect(() => {
    document.title = "Mapel";
    setActiveMenu("mapel");
  }, [setActiveMenu]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
          <h2 className="text-lg font-semibold text-gray-800">Daftar Mapel</h2>
          <a
            href="mapel/create"
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
          </a>
        </div>
        <hr />        
        <ViewMapel
          data={data}
          actions={actions}
          loadMore={handleLoadMore}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
        />
        <Konfirmasi
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDelete}
          message={`Yakin ingin menghapus mapel ?`}
        />
      </div>
    </PrivateLayout>
  );
};
export default Mapel;
