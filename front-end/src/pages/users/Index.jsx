import UserView from "./View";
import PrivateLayout from "../../layouts/private/Index";
import { useUser } from "./useUser";
import { transformMateriData } from "./dataTransformers";
import { useCallback, useContext, useEffect, useState } from "react";
import { createActions } from "./Actions";
import { UserContext } from "../../context/LayoutContext";
import { fetchWithAuth } from "../../services/api";
import { API_ENDPOINTS } from "../../utils/CONSTANTA";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import ErrorComponent from "../../components/error/Index";
import Konfirmasi from "../../components/Konfirmasi/Index";
import useToast from "../../components/Toast/useToast";
import Tabel from "../../components/DataTable/Index";
import { Link } from "react-router-dom";

const hapusUser = async (id) => {
  const response = await fetchWithAuth(
    `${API_ENDPOINTS.GET_USERS}${id}/delete`,
    {
      method: "DELETE",
    }
  );
  return response;
};

const Users = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useUser();

  const [itemToDelete, setItemToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setActiveMenu } = useContext(UserContext);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = "Users";
    setActiveMenu("users");
  }, [setActiveMenu]);


  const handleOpenDelete = (user) => {
    setItemToDelete(user);
    setIsModalOpen(true);
  };

  const handleDelete = useCallback(async () => {
    try {
      const response = await hapusUser(itemToDelete.ID);

      queryClient.invalidateQueries({
        queryKey: ["siswa"],
      });

      setItemToDelete(null);
      showToast(response.detail || "Data berhasil dihapus","success");
      setIsModalOpen(false);
      // Tambahkan aksi lain seperti notifikasi atau refresh data
    } catch (error) {
      showToast(error.message || "Gagal menghapus data","error");
    }
  }, [itemToDelete, queryClient, showToast]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const transformedData = transformMateriData(data?.pages);
  const actions = createActions(handleOpenDelete);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // if (isLoading) {
  //   return (
  //     <PrivateLayout>
  //       <div className="flex justify-center items-center min-h-[400px]">
  //         <LoadingSpinner size="large" />
  //       </div>
  //     </PrivateLayout>
  //   );
  // }

  if (isError) {
    return <ErrorComponent error={error} handleRetry={handleRetry} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Siswa</h2>
          <Link
            to="/users/create"
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
        <hr />
        <div className="p-4 space-y-6">
          {/* <FilterUjian onFilterChange={handleFilter} refetch={refetch} /> */}
          <div className="bg-white rounded-xl border border-gray-200 shadow overflow-hidden">
            <Tabel 
              data={transformedData} 
              actions={actions} 
              onLoadMore={handleLoadMore}
              hasMore={hasNextPage}
              />
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
      {/* <UserView
        data={transformedData}
        actions={actions}
        loadMore={handleLoadMore}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
      />
      <Konfirmasi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDelete}
        message={`Yakin ingin menghapus pengguna ?`}
      /> */}
    </PrivateLayout>
  );
};

export default Users;
