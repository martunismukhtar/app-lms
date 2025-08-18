import PrivateLayout from "../../layouts/private/Index";
import InputFile from "../../components/InputFile/Index";
import { fetchWithAuth } from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import useInputSiswaForm from "./useInputSiswaForm";
import LoadingButton from "../../components/LoadingButton";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import Select from "../../components/SelectBox/Select";
import { API_ENDPOINTS } from "../../utils/CONSTANTA";

const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  REFETCH_INTERVAL: 5 * 60 * 1000, // 5 minutes
};

// API Functions
const fetchMapelList = async () => {
  const url = `mata-pelajaran/list/`;
  const response = await fetchWithAuth(url, { method: "GET" });
  return response;
};

// Custom Hook for Mata Pelajaran Data
const useMapelData = () => {
  return useQuery({
    queryKey: ["mapel-list"],
    queryFn: fetchMapelList,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: QUERY_CONFIG.STALE_TIME,
    cacheTime: QUERY_CONFIG.CACHE_TIME,
    refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

const fetchKelas = async () => {
  const res = await fetchWithAuth(API_ENDPOINTS.KELAS, {
    method: "GET",
  });
  return res;
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

export default function UserFormInput() {
  const {
    formData,
    error,
    isLoading,
    handleInputChange,
    handleSubmit,
    // handleSubjectChange,
    selectedSubjects,
  } = useInputSiswaForm();

  const { setActiveMenu } = useContext(UserContext);

  const {
    data: mapelData,
    isLoading: isMapelLoading,
    error: mapelError,
  } = useMapelData();

  const {
    data: kelasList = [],
    isLoading: isLoadingKelas,
    isError: isErrorKelas,
  } = useKelasData();

  useEffect(() => {
    setActiveMenu("users");
  }, [setActiveMenu]);

  // Handle loading state
  if (isMapelLoading || isLoadingKelas) {
    return (
      <PrivateLayout>
        <div className="p-6 flex justify-center items-center">
          <div className="text-gray-500">Memuat data...</div>
        </div>
      </PrivateLayout>
    );
  }

  // Handle error state
  if (mapelError || isErrorKelas) {
    return (
      <PrivateLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">
              Gagal memuat data. Silakan refresh halaman.
            </p>
          </div>
        </div>
      </PrivateLayout>
    );
  }

  const mapelOptions =
    mapelData?.map((item) => ({
      value: item.id,
      label: item.nama,
    })) || [];

  return (
    <PrivateLayout>
      <div className="p-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Tambah data siswa
            </h2>
          </div>
          <div className="p-4 border-b border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <span>Kelas</span>
                  <Select
                    label="Kelas"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleInputChange}
                    required
                    options={kelasList.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                  />
                </div>
                <div className="w-1/2">
                  <span>Mata Pelajaran</span>
                  <select
                    multiple
                    required
                    name="mapel"
                    value={selectedSubjects}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white h-48"
                  >
                    {mapelOptions.map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <InputFile
                label="File Data"
                name="file"
                accept="text/csv"
                maxSize={5 * 1024 * 1024}
                onChange={handleInputChange}
                required
                reset={formData.file ? false : true}
                error={error.file}
              />

              <div className="flex justify-end">
                <LoadingButton isLoading={isLoading} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}
