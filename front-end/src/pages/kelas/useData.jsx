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

const hapusKelas = async (id) => {
  const response = await fetchWithAuth(`${API_ENDPOINTS.KELAS}${id}/`, {
    method: "DELETE",
  });
  return response;
};

const fetchKelas = async () => {
  try {
    const url = API_ENDPOINTS.KELAS;
    const response = await fetchWithAuth(url, { method: "GET" });
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user data");
  }
};

const useKelas = () => {
  return useQuery({
    queryKey: ["kelas"],
    queryFn: fetchKelas,    
    ...QUERY_CONFIG,
  });
};

export { hapusKelas, useKelas };

