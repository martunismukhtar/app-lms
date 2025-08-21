import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../services/api";
import { API_ENDPOINTS } from "../utils/CONSTANTA";

const fetchMapelList = async () => {
  const url = `${import.meta.env.VITE_API}mata-pelajaran/list/`;
  const res = await fetchWithAuth(url);
  return res;
};
const fetchKelas = async () => {
  const res = await fetchWithAuth(API_ENDPOINTS.KELAS, {
    method: "GET",
  });
  return res;
};

const fetchSemester = async () => {
  const res = await fetchWithAuth(API_ENDPOINTS.GET_SEMESTER, {
    method: "GET",
  });
  return res;
};

const fetchGuru = async () => {
  const res = await fetchWithAuth(`guru/`, {
    method: "GET",
  });
  return res;
};

const fetchUjian = async ({ queryKey }) => {
  const [_key, params] = queryKey;
  const query = new URLSearchParams(params).toString();
  const url = `${API_ENDPOINTS.GET_UJIAN}?${query}`;
  const res = await fetchWithAuth(url, { method: "GET" });
  return res;
};

const fetchSoalBerdasarkanIdUjian = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const res = await fetchWithAuth(API_ENDPOINTS.GET_SOAL_UJIAN + id, {
    method: "GET",
  });
  return res;
};

const fetchUjianAktif = async () => {
  const res = await fetchWithAuth(API_ENDPOINTS.GET_ACTIVE_EXAM, {
    method: "GET",
  });
  return res;
};

const fetchMateriById = async ({ queryKey }) => {
  const [_key, id] = queryKey;
  const res = await fetchWithAuth("materi/" + id, {
    method: "GET",
  });
  return res;
};

const fetchMapelById = async ({ queryKey }) => {
  
  const [_key, mapel_id] = queryKey;
  const res = await fetchWithAuth("mapel/by-id/" + mapel_id, {
    method: "GET",
  });
  return res;
};

const fetchMateriByMapel = async ({ queryKey }) => {
  const [_key, mapel] = queryKey;
  const res = await fetchWithAuth("materi/berdasarkan-mapel/" + mapel, {
    method: "GET",
  });
  return res;
  //berdasarkan-mapel/<uuid:mapel>
};

const fetchProfile = async () => {
  const res = await fetchWithAuth("profile/", {
    method: "GET",
  });
  return res;
};

const useSemesterData = () => {
  return useQuery({
    queryKey: ["semester-list"],
    queryFn: fetchSemester,
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
    queryFn: fetchKelas,
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
const useUjianData = (params = {}) => {
  return useQuery({
    queryKey: ["daftar-ujian", params],
    queryFn: fetchUjian,
    enabled: !!params, // hanya fetch jika id tidak kosong
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

const useUjianAktifData = () => {
  return useQuery({
    queryKey: ["daftar-ujian-aktif"],
    queryFn: fetchUjianAktif,
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
//
const useSoalBerdasarkanIdUjian = (id) => {
  return useQuery({
    queryKey: ["daftar-soal-berdasarkan-ujian", id],
    queryFn: fetchSoalBerdasarkanIdUjian,
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

const useMateriBerdasarkanId = (id) => {
  return useQuery({
    queryKey: ["ambil-materi-berdasarkan-id", id],
    queryFn: fetchMateriById,
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

const useMapelBerdasarkanId = (mapel_id) => {
  return useQuery({
    queryKey: ["ambil-mapel-berdasarkan-id", mapel_id],
    queryFn: fetchMapelById,
    enabled: !!mapel_id, // hanya fetch jika id tidak kosong
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

const useMateriBerdasarkanMapel = (mapel) => {
  return useQuery({
    queryKey: ["materi-berdasarkan-mapel", mapel],
    queryFn: fetchMateriByMapel,
    enabled: !!mapel, // hanya fetch jika id tidak kosong
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

const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
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

export {
  useSemesterData,
  useKelasData,
  useMapelData,
  useUjianData,
  useUjianAktifData,
  useSoalBerdasarkanIdUjian,
  useMateriBerdasarkanId,
  useProfile,
  useDataGuru,
  useMapelBerdasarkanId,
  useMateriBerdasarkanMapel
};
