import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";

const fetchMapel = async () => {
  const res = await fetchWithAuth(`mapel/`, {
    method: "GET",
  });
  return res;
};

const fetchMapelMateri = async () => {
  const res = await fetchWithAuth(`mapel/materi/`, {
    method: "GET",
  });
  return res;
};

const fetchMapelId = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const res = await fetchWithAuth(`mapel/` + id, {
    method: "GET",
  });
  return res;
};

const fetchGuruMengajarId = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const res = await fetchWithAuth(`mapel/daftar-guru-mengajar/` + id, {
    method: "GET",
  });
  return res;
};

const useDataMapel = () => {
  return useQuery({
    queryKey: ["mapel"],
    queryFn: fetchMapel,
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

const useDataMapelMateri = () => {
  return useQuery({
    queryKey: ["mapel-materi"],
    queryFn: fetchMapelMateri,
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

const useMapelId = (id) => {
  return useQuery({
    queryKey: ["mapel-berdasarkan-id", id],
    queryFn: fetchMapelId,
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

const hapusMapel = async (id) => {
  const response = await fetchWithAuth(
    `mapel/${id}/delete`,
    {
      method: "DELETE",
    }
  );
  return response;
};

const useMengajarMapelId = (id) => {
  return useQuery({
    queryKey: ["guru-berdasarkan-mapel", id],
    queryFn: fetchGuruMengajarId,
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

const enrollGuru = async (data) => {
  const response = await fetchWithAuth(
    `mapel/guru/enroll`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  return response;
};

const unEnrollGuru = async (data) => {
  const response = await fetchWithAuth(
    `mapel/guru/unenroll`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  return response;
};

export { 
  useDataMapel, 
  useMapelId, 
  hapusMapel, 
  useMengajarMapelId, 
  enrollGuru, 
  unEnrollGuru,
  useDataMapelMateri
};
