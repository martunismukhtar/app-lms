import { useContext, useEffect, useCallback } from "react";
import { UserContext } from "../../context/LayoutContext";
import PrivateLayout from "../../layouts/private/Index";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { useMateri } from "./useMateri";
import MateriView from "./MateriView";
import { transformMateriData } from "./dataTransformers";
import ModalPDF from "../../components/ModalPDF/Index";
import useDeleteMateri from "./useDelete";
import Konfirmasi from "../../components/Konfirmasi/Index";
import { Link } from "react-router-dom";
import { useDataMapel } from "../mapel/useData";
import { Loader2 } from "lucide-react";
import ViewMapelMateri from "./ViewMapelMateri";

const Materi = () => {
  const { setActiveMenu } = useContext(UserContext);

  const { actions, isModalOpen, handleDelete, setIsModalOpen } =
    useDeleteMateri();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useMateri();

  const { 
    data:dataMapel, 
    isLoading: isLoadingMapel, 
    isError: isErrorMapel, 
    error: errorMapel, 
    refetch: refetchMapel
  } = useDataMapel();

  useEffect(() => {
    document.title = "Materi";
    setActiveMenu("materi");
  }, [setActiveMenu]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <PrivateLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="large" />
        </div>
      </PrivateLayout>
    );
  }

  if (isError) {
    return (
      <PrivateLayout>
        <div className="p-6">
          <ErrorMessage
            message={error?.message || "Gagal memuat data materi"}
            onRetry={handleRetry}
          />
        </div>
      </PrivateLayout>
    );
  }

  const transformedData = transformMateriData(data?.pages);

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Materi</h2>
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

        <ViewMapelMateri data={dataMapel} />  

        {/* <MateriView
          data={transformedData}
          actions={actions}
          loadMore={handleLoadMore}
          hasMore={hasNextPage}
          isLoadingMore={isFetchingNextPage}
        /> */}
        <Konfirmasi
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDelete}
          message={`Yakin ingin menghapus mapel ?`}
        />
        <ModalPDF />
      </div>
    </PrivateLayout>
  );
};

export default Materi;
