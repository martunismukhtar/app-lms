import { useStatTeacher } from "../useData";
import ErrorMessage from "../../../components/ErrorMessage";
import ClassCard from "./ClassCard";
import { Loader, Loader2 } from "lucide-react";

const DashboardGuru = () => {
  const {
    data: statTeacher,
    isLoading,
    isError,
    error,
    refetch,
  } = useStatTeacher();

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (isError) {
    return <ErrorMessage message={error?.message} onRetry={refetch} />;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Selamat datang, {statTeacher?.user?.nama}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Kelas Saya
              </h2>
            </div>
            {isLoading && <Loader2 className="animate-spin" />}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statTeacher?.user?.mapel.map((classData) => (
                <ClassCard key={classData.id_pelajaran} classData={classData} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGuru;
