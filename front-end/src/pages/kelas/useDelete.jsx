import { useState, useCallback } from "react";
import { createActions } from "./Actions";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { hapusKelas } from "./useData";
import useToast from "../../components/Toast/useToast";

const QUERY_KEY = ["kelas"];

const useDeleteKelas = () => {
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
      await hapusKelas(itemToDelete.id);

      queryClient.invalidateQueries({ queryKey: QUERY_KEY });

      showToast(
        `Data dengan ID ${itemToDelete.id} berhasil dihapus`,
        "success"
      );
    } catch (error) {
  
      showToast(error?.message || "Gagal menghapus data", "error");
    } finally {
      setItemToDelete(null);
      setIsModalOpen(false);
    }
  }, [itemToDelete, queryClient, showToast]);

  const handleEdit = useCallback((row) => {
    navigate(`/kelas/edit/${row.id}`);
  }, [navigate]);

  const actions = createActions(handleEdit, handleOpenDelete);

  return {
    actions,
    isModalOpen,    
    handleDelete,
    setIsModalOpen,
  };
};

export default useDeleteKelas;
