import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";

const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchInterval: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
};

const fetchUsers = async ({ pageParam = null, queryKey }) => {
  const [_key, filter] = queryKey;

  let url;

  if (pageParam) {
    // URL next dari backend, sudah lengkap
    url = pageParam;
  } else {
    // Fetch pertama: bangun dari baseUrl dan filter
    const baseUrl = "siswa";
    const query = new URLSearchParams(filter).toString();
    url = `${baseUrl}?${query}`;
  }

  try {
    const response = await fetchWithAuth(url, { method: "GET" });
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user data");
  }
};

const fetchSiswaPerkelas = async ({ queryKey }) => {
  const [_key, id, filter] = queryKey;
  try {
    const baseUrl = `siswa/per-kelas/${id}`;
    const query = new URLSearchParams(filter).toString();
    const url = `${baseUrl}?${query}`;

    const response = await fetchWithAuth(url, {
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user data");
  }
};

const useSiswa = (filter = {}) => {
  return useInfiniteQuery({
    queryKey: ["siswa", filter],
    queryFn: fetchUsers,
    getNextPageParam: (lastPage) => lastPage?.next || undefined,
    ...QUERY_CONFIG,
  });
};

const useSiswaPerKelas = (id, filter) => {
  return useQuery({
    queryKey: ["siswa-per-kelas", id, filter],
    queryFn: fetchSiswaPerkelas,
    ...QUERY_CONFIG,
  });
};

export { useSiswa, useSiswaPerKelas };
