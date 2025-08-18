import { useCallback, useState } from "react";
import useToast from "../../components/Toast/useToast";
import { fetchWithAuth } from "../../services/api";

const hapusSiswa = async (id) => {
  const response = await fetchWithAuth(`siswa/${id}/delete`, {
    method: "DELETE",
  });
  return response;
};

const useDeleteStudent = () => {
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { showToast } = useToast();
  // const { hapusSiswa } = createActions();

  const handleOpenDelete = useCallback((user) => {
    setItemToDelete(user);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      await hapusSiswa(itemToDelete.siswa_id);
      showToast(`Data  berhasil dihapus`, "success");
    } catch (error) {
      showToast(error?.message || "Gagal menghapus data", "error");
    } finally {
      setItemToDelete(null);
      setIsModalOpen(false);
    }
  }, [itemToDelete, showToast]);

  return {
    handleOpenDelete,
    isModalOpen,
    setIsModalOpen,
    // itemToDelete,
    // setItemToDelete,
    handleDelete,
  };
};

export default useDeleteStudent;
