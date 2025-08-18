import { Link, useParams } from "react-router-dom";
import PrivateLayout from "../../layouts/private/Index";
import LoadingComponent from "../../components/loading/Index";
import ErrorComponent from "../../components/error/Index";
import Input from "../../components/Input/Input";
import { useUjianData } from "./useData";

const DetailUjian = () => {
  const { id } = useParams();
  const { data: formData, error, isLoading, refetch } = useUjianData(id);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} handleRetry={refetch} />;
  }

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <h1>Detail Ujian </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="w-full">
            <label className="block font-medium mb-1">Judul Ujian</label>
            <Input
              label="Judul Ujian"
              type="text"
              readOnly
              value={formData.judul || ""}
            />
          </div>

          <div className="w-full">
            <label className="block font-medium mb-1">Jenis Ujian</label>
            <Input
              label="Jenis Ujian"
              type="text"
              readOnly
              value={formData.jenis_ujian || ""}
            />
          </div>

          <div className="w-full">
            <label className="block font-medium mb-1">Tanggal Mulai</label>
            <Input
              label="Tanggal Mulai"
              type="text"
              readOnly
              value={new Date(formData.tanggal).toLocaleDateString() || ""}
            />
          </div>

          <div className="w-full">
            <label className="block font-medium mb-1">Tanggal Akhir</label>
            <Input
              label="Tanggal Akhir"
              type="text"
              readOnly
              value={
                new Date(formData.tanggal_akhir).toLocaleDateString() || ""
              }
            />
          </div>
          <div className="w-full">
            <label className="block font-medium mb-1">Waktu Mulai</label>
            <Input
              label="Waktu Mulai"
              type="text"
              readOnly
              value={formData.waktu_mulai || ""}
            />
          </div>
          <div className="w-full">
            <label className="block font-medium mb-1">
              Durasi (dalam menit)
            </label>
            <Input
              label="Durasi (dalam menit)"
              type="text"
              readOnly
              value={formData.durasi || ""}
            />
          </div>
          <div className="w-full">
            <label className="block font-medium mb-1">Bobot Nilai</label>
            <Input
              label="Bobot Nilai"
              type="text"
              readOnly
              value={formData.bobot_nilai || ""}
            />
          </div>
          <div className="w-full">
            <label className="block font-medium mb-1">Passing Grade</label>
            <Input
              label="Passing Grade"
              type="text"
              readOnly
              value={formData.bobot_nilai || ""}
            />
          </div>
          <div className="w-full">
            <label className="block font-medium mb-1">Kelas</label>
            <Input
              label="Kelas"
              type="text"
              readOnly
              value={formData.nama_kelas || ""}
            />
          </div>
          <div className="w-full">
            <label className="block font-medium mb-1">Mata Pelajaran</label>
            <Input
              label="Kelas"
              type="text"
              readOnly
              value={formData.nama_mapel || ""}
            />
          </div>
        </div>
        <div className="w-full flex justify-end mt-4 border-t border-gray-200 py-4">
          <Link
            to={`/buat-ujian`}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Kembali
          </Link>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default DetailUjian;
