import PrivateLayout from "../../layouts/private/Index";
import InputFile from "../../components/InputFile/Index";
import useInputSiswaForm from "./useInputSiswaForm";
import LoadingButton from "../../components/LoadingButton";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/LayoutContext";
import Select from "../../components/SelectBox/Select";
import { useKelasData } from "../../data/Index";

export default function SiswaFormInput() {
  const {
    formData,
    error,
    isLoading,
    handleInputChange,
    handleSubmit,
    // selectedSubjects,
  } = useInputSiswaForm();

  const { setActiveMenu } = useContext(UserContext);

  // const {
  //   data: mapelData,
  //   isLoading: isMapelLoading,
  //   error: mapelError,
  // } = useMapelData();

  const {
    data: kelasList = [],
    isLoading: isLoadingKelas,
    isError: isErrorKelas,
  } = useKelasData();

  useEffect(() => {
    setActiveMenu("siswa");
  }, [setActiveMenu]);

  // Handle loading state
  if (isLoadingKelas) {
    return (
      <PrivateLayout>
        <div className="p-6 flex justify-center items-center">
          <div className="text-gray-500">Memuat data...</div>
        </div>
      </PrivateLayout>
    );
  }

  // Handle error state
  if (isErrorKelas) {
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

  // const mapelOptions =
  //   mapelData?.map((item) => ({
  //     value: item.id,
  //     label: item.nama,
  //   })) || [];

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
                {/* <div className="w-1/2">
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
                </div> */}
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
