import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";
import { API_ENDPOINTS } from "../../utils/CONSTANTA";

const QUERY_CONFIG = {
  staleTime: 0,
  // cacheTime: 10 * 60 * 1000, // 10 minutes
  // refetchInterval: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: true,
  // refetchIntervalInBackground: true,
  // refetchOnMount: true,
  // refetchOnReconnect: true,
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


const fetchMateriById = async ({queryKey}) => {
  const [_key, pelajaran_id, kelas_id] = queryKey;
  const response = await fetchWithAuth(`${API_ENDPOINTS.MATERI_SISWA}${pelajaran_id}/${kelas_id}/detail`, {
    method: "GET",
  });
  return response;
}

const useMateriDetail = (pelajaran_id, kelas_id) => {
  return useQuery({
    queryKey: ["materi", pelajaran_id, kelas_id],
    queryFn: () => fetchMateriById,
    ...QUERY_CONFIG,
  });
}


const useMateri = (pelajaran_id, kelas_id) => {
  return useQuery({
    queryKey: ["materi-u", pelajaran_id, kelas_id],
    queryFn: fetchMateriById,
    ...QUERY_CONFIG,
  });
}

export { 
  useMateriSiswa, 
  useMateriDetail,
  useMateri,
};

