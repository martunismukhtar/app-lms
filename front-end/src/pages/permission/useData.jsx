import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";
import { API_ENDPOINTS } from "../../utils/CONSTANTA";

const fetchGHakAkses = async () => {
  const res = await fetchWithAuth(`hak-akses/`, {
    method: "GET",
  });
  return res;
};
const fetchGroup = async () => {  
  const res = await fetchWithAuth(`hak-akses/group/`, {
    method: "GET",
  });
  return res;
};

const fetchPermissionByGroup = async ({ queryKey }) => {  
  const [_key, id] = queryKey;
  const res = await fetchWithAuth(`hak-akses/group/`+id, {
    method: "GET",
  });
  return res;
};

const fetchGroupNameById = async ({ queryKey }) => {  
  const [_key, id] = queryKey;
  const res = await fetchWithAuth(`hak-akses/group/name/`+id, {
    method: "GET",
  });
  return res;
};

const useDataHakAkses = () => {
  return useQuery({
    queryKey: ["hak-akses"],
    queryFn: fetchGHakAkses,
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

const useDataGroup = () => {
  return useQuery({
    queryKey: ["group"],
    queryFn: fetchGroup,
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

const usePermissionByGroup = (id) => {
  return useQuery({    
    queryKey: ["permisi-berdasarkan-id", id],
    queryFn: fetchPermissionByGroup,
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

const useGroupName = (id) => {
  return useQuery({    
    queryKey: ["nama-group-berdasarkan-id", id],
    queryFn: fetchGroupNameById,
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

export { 
  useDataHakAkses, 
  useDataGroup, 
  usePermissionByGroup, 
  useGroupName 
};
