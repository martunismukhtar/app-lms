import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";
import { API_ENDPOINTS } from "../../utils/CONSTANTA";

const fetchUjian = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const res = await fetchWithAuth(`${API_ENDPOINTS.GET_UJIAN}${id}`, {
    method: "GET",
  });
  return res;
};

const fetchSoal = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const res = await fetchWithAuth(`${API_ENDPOINTS.GET_SOAL_UJIAN}${id}`, {
    method: "GET",
  });
  return res;
};

const fetchSoalById = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const res = await fetchWithAuth(`soal/edit/${id}`, {
    method: "GET",
  });
  return res;
};

const useUjianData = (id) => {
  return useQuery({
    queryKey: ["daftar-ujian", id],
    queryFn: fetchUjian,
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

const useSoalUjian = (id) => {
  return useQuery({
    queryKey: ["daftar-soal-ujian", id],
    queryFn: fetchSoal,
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

const useSoalById = (id) => {
  return useQuery({
    queryKey: ["daftar-soal", id],
    queryFn: fetchSoalById,
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

const hapusUjian = async (id) => {
  const response = await fetchWithAuth(
    `buat-ujian/${id}/delete`,
    {
      method: "DELETE",
    }
  );
  return response;
};

export { useUjianData, useSoalUjian, useSoalById, hapusUjian };
