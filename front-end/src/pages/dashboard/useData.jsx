import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";

const fetchStatTeacher = async () => {
  const res = await fetchWithAuth(`dashboard/stat-guru`, {
    method: "GET",
  });
  return res;
};

const useStatTeacher = () => {
  return useQuery({
    queryKey: ["stat-teacher"],
    queryFn: fetchStatTeacher,    
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


export { useStatTeacher };
