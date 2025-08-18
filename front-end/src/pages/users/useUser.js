import { useInfiniteQuery } from "@tanstack/react-query";
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

const fetchUsers = async ({ pageParam = null }) => {
  try {
    const url = pageParam ?? API_ENDPOINTS.GET_USERS;
    const response = await fetchWithAuth(url, { method: "GET" });
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user data");
  }

};

export const useUser = () => {
  return useInfiniteQuery({
    queryKey: ["user"],
    queryFn: fetchUsers,
    getNextPageParam: (lastPage) => lastPage?.next || undefined,
    ...QUERY_CONFIG,
  });
};