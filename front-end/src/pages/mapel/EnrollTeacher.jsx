import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { BookOpen, Loader2 } from "lucide-react";

import PrivateLayout from "../../layouts/private/Index";
import { useParams } from "react-router-dom";
import { useMapelId, useMengajarMapelId } from "./useData";
import { useDataGuru, useKelasData } from "../../data/Index";
import SelectBox from "../../components/SelectBox/Index";
import useEnrollTeacher from "./useEnrollTeacher";
import ErrorComponent from "../../components/error/Index";
import { UserContext } from "../../context/LayoutContext";
import GuruCard from "./GuruCard";
import GuruTerpilihCard from "./GuruTerpilihCard";

const EnrollTeacher = () => {
  const { setActiveMenu } = useContext(UserContext);

  const refKelas = useRef(null);

  const { id } = useParams();

  useEffect(() => {
    document.title = "Mapel";
    setActiveMenu("mapel");
  }, [setActiveMenu]);

  const {
    data: selectedMapel,
    isLoading: selectedMapelLoading,
    isError: selectedMapelError,
  } = useMapelId(id);

  const {
    data: teachersData,
    isLoading: teachersLoading,
    isError: teachersError,
  } = useDataGuru();

  const {
    data: guruMengajar,
    // isLoading: guruMengajarLoading,
    isError: guruMengajarError,
  } = useMengajarMapelId(id);

  const { hapusEnroll, handleEnroll, isLoading } = useEnrollTeacher(id);

  const { data: kelasData, isLoading: iskelasLoading } = useKelasData();

  const kelasOptions =
    kelasData?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const guru_tidak_terpilih = useMemo(() => {
    const idTerpilihSet = new Set(guruMengajar?.map((g) => g.id));
    return teachersData?.filter((g) => !idTerpilihSet.has(g.id));
  }, [teachersData, guruMengajar]);

  const handleClick = useCallback(
    (row) => {
      handleEnroll({
        teacher_id: row.id,
        kelas_id: refKelas.current.value,
        mapel_id: id,
      });
    },
    [handleEnroll, id]
  );

  if (selectedMapelError || teachersError || guruMengajarError) {
    return <ErrorComponent error={"Terjadi kesalahan saat memuat data"} />;
  }

  return (
    <PrivateLayout>
      {/* Header */}
      <div className="bg-white">
        <div className="bg-white border-b border-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>

                <h1 className="text-xl font-bold text-gray-900">
                  Enrollment Teacher
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Content based on active tab */}

          <div>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {selectedMapelLoading ? (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <div>
                      Mata pelajaran :{" "}
                      <span className="font-semibold">
                        {selectedMapel[0]?.nama}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-3">
                {iskelasLoading ? (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  <SelectBox
                    label="Kelas"
                    options={kelasOptions}
                    required={true}
                    ref={refKelas}
                    className="w-48"
                  />
                )}
              </div>
            </div>
            <div className="my-2">
              <h2>Daftar Guru Terdaftar Pada Mata Pelajaran Ini</h2>
            </div>
            {teachersLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            )}
            {guruMengajar?.length == 0 && (
              <div className="flex items-center justify-center py-2">
                Belum ada data
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guruMengajar?.map((teacher) => (
                <GuruTerpilihCard
                  key={teacher.id}
                  user={teacher}
                  isLoading={isLoading}
                  handleClick={hapusEnroll}
                />
              ))}
            </div>
            
            <div className="my-6 py-2 border-t border-gray-200">
              <h2>Daftar Guru</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachersLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              )}
              {guru_tidak_terpilih?.map((teacher) => (
                <GuruCard
                  key={teacher.id}
                  user={teacher}
                  isLoading={isLoading}
                  handleClick={handleClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Enroll Modal */}
    </PrivateLayout>
  );
};

export default EnrollTeacher;
