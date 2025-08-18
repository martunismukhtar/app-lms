import Divider from "../../components/Divider";
import ErrorMessage from "../../components/ErrorMessage";
import Input from "../../components/Input/Input";
import LoadingButton from "../../components/LoadingButton";
import Select from "../../components/SelectBox/Select";
import { useKelasData, useMapelData } from "../../data/Index";
import useForm from "./useForm";

const FormBuatUjian = ({ id, data }) => {
  const {
    formData,
    error,
    isLoading,
    handleInputChange,
    handleSubmit,
    refetch,
  } = useForm(id, data);

  const JENIS_UJIAN_OPTIONS = [
    { value: "UTS", label: "UTS" },
    { value: "UAS", label: "UAS" },
  ];

  const {
    data: kelasList = [],
    isLoading: isLoadingKelas,
    isError: isErrorKelas,
  } = useKelasData();

  const {
    data: mapelList = [],
    isLoading: isLoadingMapel,
    isError: isErrorMapel,
  } = useMapelData();

  if (isErrorKelas || isErrorMapel) {
    return <ErrorMessage message={error?.message} onRetry={refetch} />;
  }

  if (isLoadingKelas || isLoadingMapel) {
    return <h1>Loading...</h1>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="block font-medium mb-1">Judul Ujian</label>
          <Input
            label="Judul Ujian"
            type="text"
            name="judul"
            placeholder="Judul Ujian"
            required
            onChange={handleInputChange}
            error={error.judul}
            value={formData.judul || ""}
          />
        </div>

        <div className="w-full">
          <label className="block font-medium mb-1">Jenis Ujian</label>
          <Select
            name="jenis_ujian"
            onChange={handleInputChange}
            value={formData.jenis_ujian || ""}
            options={JENIS_UJIAN_OPTIONS}
            required
          />
        </div>

        <div className="w-full">
          <label className="block font-medium mb-1">Tanggal Mulai</label>
          <Input
            label="Tanggal Mulai"
            type="date"
            name="tanggal"
            required
            onChange={handleInputChange}
            error={error.tanggal}
            value={formData.tanggal || ""}
          />
        </div>
        <div className="w-full">
          <label className="block font-medium mb-1">Tanggal Akhir</label>
          <Input
            label="Tanggal Akhir"
            type="date"
            name="tanggal_akhir"
            required
            onChange={handleInputChange}
            error={error.tanggal_akhir}
            value={formData.tanggal_akhir || ""}
          />
        </div>
        <div className="w-full">
          <label className="block font-medium mb-1">Waktu Mulai</label>
          <Input
            label="Waktu Mulai"
            type="time"
            name="waktu_mulai"
            required
            onChange={handleInputChange}
            error={error.waktu_mulai}
            value={formData.waktu_mulai || ""}
          />
        </div>

        <div className="w-full">
          <label className="block font-medium mb-1">Durasi (dalam menit)</label>
          <Input
            label="Durasi (dalam menit)"
            type="number"
            name="durasi"
            required
            onChange={handleInputChange}
            error={error.durasi}
            value={formData.durasi || ""}
          />
        </div>

        <div className="w-full">
          <label className="block font-medium mb-1">Bobot Nilai</label>
          <Input
            label="Bobot Nilai"
            type="number"
            name="bobot_nilai"
            step="0.01"
            required
            onChange={handleInputChange}
            error={error.bobot_nilai}
            value={formData.bobot_nilai || ""}
          />
        </div>

        <div className="w-full">
          <label className="block font-medium mb-1">Passing Grade</label>
          <Input
            label="Passing Grade"
            type="number"
            name="passing_grade"
            step="0.01"
            required
            onChange={handleInputChange}
            error={error.passing_grade}
            value={formData.passing_grade || ""}
          />
        </div>

        <div className="w-full">
          <label className="block font-medium mb-1">Kelas</label>
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

        <div className="w-full">
          <label className="block font-medium mb-1">Mata Pelajaran</label>
          <Select
            label="Mata Pelajaran"
            name="mapel"
            value={formData.mapel}
            onChange={handleInputChange}
            required
            options={mapelList.map((item) => ({
              value: item.id,
              label: item.nama,
            }))}
          />
        </div>
      </div>
      <div className="flex flex-col items-end mt-6 space-y-4">
        <Divider />
        <LoadingButton isLoading={isLoading} />
      </div>
    </form>
  );
};
export default FormBuatUjian;
