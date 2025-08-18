import ErrorMessage from "../../components/ErrorMessage";
import { useUjianAktifData } from "../../data/Index";
import { Link } from "react-router-dom";

const ExamTab = () => {
  const { data: exams, isLoading, error, refetch } = useUjianAktifData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage message={error?.message} onRetry={refetch} />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-3">Judul Ujian</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Hasil</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{exam.judul}</td>
                <td className="px-4 py-3">
                  {new Date(exam.tanggal).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">{exam.score ? exam.score: "Belum ada hasil"}</td>
                <td className="px-4 py-3">
                  <Link
                    to={`/ujian/${exam.id}`}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    {/* {exam.status === "Belum Dikerjakan" ? "Mulai" : "Lihat"} */}
                    Mulai
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default ExamTab;
