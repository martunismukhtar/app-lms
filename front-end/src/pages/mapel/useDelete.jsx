import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { hapusMapel } from "./useData";
import useToast from "../../components/Toast/useToast";
import { createActions } from "./Actions";

const QUERY_KEY = ["mapel"];

const useDeleteMapel = () => {
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
      await hapusMapel(itemToDelete.id);

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

  const handleEdit = useCallback((data) => {
    navigate(`${data.id}/edit`);
  }, [navigate]);

  const handleEnroll= useCallback((data) => {
    navigate(`${data.id}/enroll`);
  }, [navigate]);

  const actions = createActions(handleEnroll, handleEdit, handleOpenDelete);

  return {
    actions,
    isModalOpen,    
    handleDelete,
    setIsModalOpen,
  };
};

export default useDeleteMapel;
