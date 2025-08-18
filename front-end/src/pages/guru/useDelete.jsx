import { useState, useCallback } from "react";
import { createActions } from "./Actions";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { hapusGuru } from "./useData";
import useToast from "../../components/Toast/useToast";

const QUERY_KEY = ["daftar-guru"];

const useDeleteGuru = () => {
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleOpenDelete = useCallback((user) => {
    setItemToDelete(user);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await hapusGuru(itemToDelete.id);

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

  const handleEdit = useCallback((user) => {
    navigate(`${user.id}/edit`);
  }, [navigate]);

  const actions = createActions(handleEdit, handleOpenDelete);

  return {
    actions,
    isModalOpen,    
    handleDelete,
    setIsModalOpen,
  };
};

export default useDeleteGuru;
