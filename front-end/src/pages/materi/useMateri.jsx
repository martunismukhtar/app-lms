import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";

const API_ENDPOINTS = {
  MATERI: "materi/",
};

const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchInterval: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
};

const fetchMateri = async ({ pageParam = null }) => {
  try {
    const url = pageParam ?? API_ENDPOINTS.MATERI;
    const response = await fetchWithAuth(url, { method: "GET" });
    return response;
  } catch (error) {
    console.error("Error fetching materi:", error);
    throw new Error("Failed to fetch materi data");
  }
};

const useMateri = () => {
  return useInfiniteQuery({
    queryKey: ["materi"],
    queryFn: fetchMateri,
    getNextPageParam: (lastPage) => lastPage?.next || undefined,
    ...QUERY_CONFIG,
  });
};

const fetchMapelList = async () => {
  const url = `mata-pelajaran/list/`;
  const response = await fetchWithAuth(url, { method: "GET" });
  return response;
};
const fetchKelasList = async () => {
  const url = `kelas/`;
  const response = await fetchWithAuth(url, { method: "GET" });
  return response;
};
// Custom Hook for Mata Pelajaran Data
const useMapelData = () => {
  return useQuery({
    queryKey: ["mapel-list"],
    queryFn: fetchMapelList,
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

const useKelasData = () => {
  return useQuery({
    queryKey: ["kelas-list"],
    queryFn: fetchKelasList,
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
const fetchMateriById = async (id) => {
  const response = await fetchWithAuth(`materi/${id}`, {
    method: "GET",
  });
  return response;
};
export { useMateri, useMapelData, useKelasData, fetchMateriById };
