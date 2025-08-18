import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";
import { API_ENDPOINTS } from "../../utils/CONSTANTA";

const fetchGuru = async () => {
  const res = await fetchWithAuth(`guru/`, {
    method: "GET",
  });
  return res;
};
const fetchGuruId = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const res = await fetchWithAuth(`guru/` + id, {
    method: "GET",
  });
  return res;
};
const useDataGuru = () => {
  return useQuery({
    queryKey: ["daftar-guru"],
    queryFn: fetchGuru,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

const useGuruId = (id) => {
  return useQuery({
    queryKey: ["guru-berdasarkan-id", id],
    queryFn: fetchGuruId,
    enabled: !!id, // hanya fetch jika id tidak kosong
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

const hapusMateri = async (id) => {
   const response = await fetchWithAuth(
    `${API_ENDPOINTS.GET_MATERI}${id}/delete`,
    {
      method: "DELETE",
    }
  );
  return response;
};



export { hapusMateri };
