import { useQuery } from "@tanstack/react-query";
import PrivateLayout from "../../layouts/private/Index";
import { fetchWithAuth } from "../../services/api";
import DaftarSoal from "./View";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const fetchSoalList = async () => {
  const url = `${import.meta.env.VITE_API}/buat-soal/`;
  const res = await fetchWithAuth(url);  
  return res;
};
const BuatSoalManual = () => {
  const navigate = useNavigate();
  const { data: soal, error } = useQuery({
    queryKey: ["soal-list"],
    queryFn: fetchSoalList,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (error) {
      alert(error);
      navigate("/dashboard");
    }
  }, [error, navigate]);

  return (
    <PrivateLayout>
      <DaftarSoal data={soal} />
    </PrivateLayout>
  );
};

export default BuatSoalManual;
