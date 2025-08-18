import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";
import { API_ENDPOINTS } from "../../utils/CONSTANTA";

const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchInterval: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
};

//
const fetchMateriSiswa = async () => {
  try {
    const url = API_ENDPOINTS.MATERI_SISWA;
    const response = await fetchWithAuth(url, { method: "GET" });
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user data");
  }
};

const useMateriSiswa = () => {
  return useQuery({
    queryKey: ["materi-siswa"],
    queryFn: fetchMateriSiswa,    
    ...QUERY_CONFIG,
  });
};


const fetchMateriSiswaById = async (id) => {
  const response = await fetchWithAuth(`${API_ENDPOINTS.MATERI_SISWA}${id}/edit`, {
    method: "GET",
  });
  return response;
}

const useMateriDetail = (id) => {
  return useQuery({
    queryKey: ["materi-siswa-detail", id],
    queryFn: () => fetchMateriSiswaById(id),
    ...QUERY_CONFIG,
  });
}
export { useMateriSiswa, useMateriDetail };

