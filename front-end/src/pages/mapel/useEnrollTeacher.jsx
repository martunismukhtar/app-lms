import { useCallback, useState } from "react";
import useToast from "../../components/Toast/useToast";
import { useQueryClient } from "@tanstack/react-query";
import { enrollGuru, unEnrollGuru } from "./useData";

const useEnrollTeacher = (id) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDel, setIsLoadingDel] = useState(false);

  const handleEnroll = useCallback(
    async (data) => {
      if (!data) return;
      setIsLoading(true);
      try {

        if(!data.kelas_id || !data.mapel_id || !data.teacher_id) {
          setIsLoading(false);
          showToast(`Data tidak lengkap`, "error");
          return;
        }

        await enrollGuru(data);
        setIsLoading(false);        
        queryClient.invalidateQueries({ 
          queryKey: ["guru-berdasarkan-mapel", data.mapel_id] 
        });

        showToast(`Data berhasil disimpan`, "success");
      } catch (error) {
        setIsLoading(false);
        showToast(error?.message || "Gagal menghapus data", "error");
      }
    },
    [queryClient, showToast]
  );

  const hapusEnroll = useCallback(
    async (data) => {
      if (!data) return;
      setIsLoadingDel(true);      
      try {        
        await unEnrollGuru({
          mengajar_id: data.mengajar_id
        });
        setIsLoadingDel(false);
        queryClient.invalidateQueries({ 
          queryKey: ["guru-berdasarkan-mapel", id],
          refetchType: "active"
        });
        queryClient.invalidateQueries({ queryKey: ["daftar-guru"] });

        showToast(`Data berhasil disimpan`, "success");
      } catch (error) {
        setIsLoadingDel(false);
        showToast(error?.message || "Gagal menghapus data", "error");
      }
    },
    [queryClient, showToast, id]
  )

  return {
    // data,
    hapusEnroll,
    handleEnroll,
    isLoading,
    isLoadingDel
  };
};

export default useEnrollTeacher;
