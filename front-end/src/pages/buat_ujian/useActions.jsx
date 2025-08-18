import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { hapusUjian } from "./useData";
import useToast from "../../components/Toast/useToast";
import { createActions } from "./Actions";

const QUERY_KEY = ["daftar-guru"];

const useActionsUjian = () => {
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

  const handleEdit = useCallback(
    (user) => {
      navigate(`${user.id}/edit`);
    },
    [navigate]
  );

  const handleDetail = useCallback((row) => {
    navigate(`${row.id}/detail`);
  }, [navigate]);

  const lihatSoal = useCallback((row) => {
    navigate(`${row.id}/soal-ujian`);
  }, [navigate]);
  const buatSoal = useCallback((row) => {
    navigate(`${row.id}/buat-soal`);
  }, [navigate]);

  const actions = createActions(
    handleDetail,
    lihatSoal,
    buatSoal,
    handleEdit,
    handleOpenDelete
  );

  return {
    actions,
    isModalOpen,
    handleDelete,
    setIsModalOpen,
  };
};

export default useActionsUjian;
