import { usePelajaranSaya } from "./data";
import ErrorMessage from "../../../components/ErrorMessage";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const MapelTab = () => {

  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = usePelajaranSaya();

  // const [mapel, setMapel] = useState([]);


  if (isError) {
    return <ErrorMessage message={error?.message} onRetry={refetch} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {isLoading && <Loader2 className="animate-spin" />}

      {data?.pelajaran?.map((subject) => (
        <div
          key={subject.id_pelajaran}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            {subject.nama_pelajaran}
          </h3>          
          <Link className="mt-12 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded" to={`/materi-siswa/detail/${subject.id_pelajaran}/${subject.id_kelas}`}>Lihat Materi</Link>
        </div>
      ))}
    </div>
  );
};
export default MapelTab;
