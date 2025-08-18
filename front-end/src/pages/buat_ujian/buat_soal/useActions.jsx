import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { hapusUjian } from "./useData";
import useToast from "../../../components/Toast/useToast";

const QUERY_KEY = ["daftar-guru"];

const useActionsSoal = () => {
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const handleOpenDelete = useCallback((user) => {
    setItemToDelete(user);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await hapusUjian(itemToDelete.id);

      queryClient.invalidateQueries({ queryKey: QUERY_KEY });

      showToast(
        `Data dengan ID ${itemToDelete.ID} berhasil dihapus`,
        "success"
      );
    } catch (error) {
      //   console.error("Gagal menghapus data:", error);
      showToast(error?.message || "Gagal menghapus data", "error");
    } finally {
      setItemToDelete(null);
      setIsModalOpen(false);
    }
  }, [itemToDelete, queryClient, showToast]);

  return {
    handleOpenDelete,
    isModalOpen,
    handleDelete,
    setIsModalOpen,
  };
};

export default useActionsSoal;
