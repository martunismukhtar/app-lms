import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../services/api";
import { API_ENDPOINTS } from "../../utils/CONSTANTA";
import { UserContext } from "../../context/LayoutContext";
import { useContext, useEffect } from "react";
import { capitalizeFirstLetter } from "../../utils/libs";
import Select from "../../components/SelectBox/Select";

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
// Fetch data semester
const fetchSemester = async () => {
  const res = await fetchWithAuth(API_ENDPOINTS.GET_SEMESTER, {
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
}
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
}
const FilterElement = () => {
  const {
    data: mapelList = [],
    isLoading: isLoadingMapel,
    isError: isErrorMapel,
  } = useMapelData();

  const {
    data: semesterList = [],
    isLoading: isLoadingSemester,
    isError: isErrorSemester,
  } = useSemesterData();

  const {
    data: kelasList = [],
    isLoading: isLoadingKelas,
    isError: isErrorKelas,
  } = useKelasData();

  const { filterData, setFilterData } = useContext(UserContext);

  useEffect(() => {
    if (semesterList.length > 0) {
      const defaultSemester =
        semesterList.find((s) => s.is_active) || semesterList[0];
      setFilterData((prev) => ({
        ...prev,
        semester: defaultSemester.id.toString(),
      }));
    }
  }, [semesterList, setFilterData]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFilterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoadingMapel || isLoadingSemester || isLoadingKelas) {
    return <p className="p-4">Memuat data...</p>;
  }

  if (isErrorMapel || isErrorSemester || isErrorKelas) {
    return <p className="p-4 text-red-500">Gagal memuat data filter.</p>;
  }

  return (
    <>
      <div className="w-full">
        <Select
          label="Kelas"
          name="kelas"
          value={filterData.kelas}
          onChange={onChange}
          required
          options={kelasList.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
        />
      </div>
      <div className="w-full">
        <Select
          label="Mata Pelajaran"
          name="mapel"
          value={filterData.mapel}
          onChange={onChange}
          required
          options={mapelList.map((item) => ({
            value: item.id,
            label: item.nama,
          }))}
        />
      </div>
      <div className="w-full">
        <Select
          label="Semester"
          name="semester"
          onChange={onChange}
          value={filterData.semester}
          required
          options={semesterList.map((item) => ({
            value: item.id,
            label:
              "Semester " +
              capitalizeFirstLetter(item.semester) +
              " Tahun Ajaran " +
              item.tahun,
          }))}
        />
      </div>
    </>
  );
};
export default FilterElement;
