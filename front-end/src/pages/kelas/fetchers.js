import { API_ENDPOINTS } from "../../utils/CONSTANTA";
import { fetchWithAuth } from "../../services/api";

export const fetchKelasById = async (id) => {
  const response = await fetchWithAuth(API_ENDPOINTS.KELAS + `${id}`);
  return response;
};
