import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  BookOpen,
  Users,
  Search,  
  X,
  User,
  UserCheck,
  Loader2,
} from "lucide-react";

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
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
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

  const teachers = [
    {
      id: 1,
      name: "Budi Santoso, S.Pd",
      email: "budi@school.edu",
      subject: "Matematika",
      status: "active",
    },
    {
      id: 2,
      name: "Siti Nurhaliza, S.Si",
      email: "siti@school.edu",
      subject: "Fisika",
      status: "active",
    },
    {
      id: 3,
      name: "Ahmad Rifai, M.Sc",
      email: "ahmad@school.edu",
      subject: "Kimia",
      status: "inactive",
    },
    {
      id: 4,
      name: "Dewi Kartika, S.Pd",
      email: "dewi@school.edu",
      subject: "Biologi",
      status: "active",
    },
    {
      id: 5,
      name: "Joko Widodo, S.Pd",
      email: "joko@school.edu",
      subject: "Bahasa Inggris",
      status: "active",
    },
  ];

  const kelasOptions =
    kelasData?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

    const guru_tidak_terpilih = useMemo(() => {
      const idTerpilihSet = new Set(guruMengajar?.map(g => g.id));
      return teachersData?.filter(g => !idTerpilihSet.has(g.id));      
    }, [teachersData, guruMengajar]);

  // Filter functions
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    // const matchesSubject =
    //   selectedSubject === "all" ||
    //   teacher.subject.toLowerCase().includes(selectedSubject);
    return matchesSearch; // && matchesSubject;
  });


  const EnrollModal = () => (
    <div className="fixed inset-0 bg-black-900  bg-opacity-50 backdrop-blur-sm animate-fadeIn flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Enroll ke Mata Pelajaran
            </h3>
            <button
              onClick={() => setShowEnrollModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Mata Pelajaran
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Matematika</option>
              <option>Fisika</option>
              <option>Kimia</option>
              <option>Biologi</option>
              <option>Bahasa Inggris</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kelas (untuk siswa)
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>10A</option>
              <option>10B</option>
              <option>11A</option>
              <option>11B</option>
              <option>12A</option>
              <option>12B</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowEnrollModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleEnroll}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Enroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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



  const EnrollmentCard = ({ enrollment }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{enrollment.subject}</h3>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <UserCheck className="w-4 h-4 mr-1 text-blue-500" />
            <span>{enrollment.teachers} Guru</span>
            <span className="mx-2">•</span>
            <Users className="w-4 h-4 mr-1 text-green-500" />
            <span>{enrollment.students} Siswa</span>
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Kelola
        </button>
      </div>
    </div>
  );

  if (selectedMapelError || teachersError || guruMengajarError) {
    return <ErrorComponent error={"Terjadi kesalahan saat memuat data"} />;
  }


  return (
    <PrivateLayout>
      {/* Header */}
      <div className="bg-white">
        <div className="bg-white shadow-sm border-b">
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

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari guru atau siswa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
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
              <h2>Daftar Guru Terdaftar Pada mata pelajaran ini</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              {guruMengajar?.map((teacher) => (
                <GuruTerpilihCard key={teacher.id} user={teacher} isLoading={isLoading} handleClick={hapusEnroll} />
              ))}
            </div>
            <div className="my-2"></div>
            <hr />
            <div className="my-2">
              <h2>Daftar Guru</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachersLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              )}
              {guru_tidak_terpilih?.map((teacher) => (
                <GuruCard key={teacher.id} user={teacher} isLoading={isLoading} handleClick={handleClick} />
              ))}
            </div>

            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada guru ditemukan
                </h3>
                <p className="text-gray-500">
                  Coba ubah kata kunci pencarian atau filter mata pelajaran
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Enroll Modal */}
      {showEnrollModal && <EnrollModal />}
    </PrivateLayout>
  );
};

export default EnrollTeacher;
