import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";
import DaftarSoalUjian from "./View";
import PrivateLayout from "../../layouts/private/Index";
import { UserContext } from "../../context/LayoutContext";
import { useContext, useEffect } from "react";

const fetchSoalList = async () => {
  const url = `buat-soal/`;
  const res = await fetchWithAuth(url);
  return res;
};

const Ujian = () => {
  const { setActiveMenu } = useContext(UserContext);

  useEffect(() => {
    document.title = "Daftar Soal";
    setActiveMenu("ujian");
  }, [setActiveMenu]);

  const { data: soal } = useQuery({
    queryKey: ["soal-ujian-list"],
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
  return (
    <PrivateLayout>
      <DaftarSoalUjian data={soal} />
    </PrivateLayout>
  );
};
export default Ujian;
