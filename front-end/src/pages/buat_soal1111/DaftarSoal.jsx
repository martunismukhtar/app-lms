import { useCallback, useContext, useEffect, useState } from "react";
import PrivateLayout from "../../layouts/private/Index";
import { fetchWithAuth } from "../../services/api";
import FilterElement from "./FilterElement";
import QuestionList from "./QuestionList";
import { UserContext } from "../../context/LayoutContext";
import { Link } from "react-router-dom";

const DaftarSoal = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { filterData, setActiveMenu } = useContext(UserContext);

  const fetchQuestions = useCallback(async () => {
    const { mapel, kelas, semester } = filterData;

    if (!mapel || !kelas || !semester) {
      setError(
        "Silakan pilih semua filter: Mata Pelajaran, Kelas, dan Semester."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(
        `soal/soal-berdasarkan-mapel-kelas-semester/${mapel}/${kelas}/${semester}`,
        { method: "GET" }
      );

      if (!response) {
        throw new Error("Tidak ada soal ditemukan");
      }

      setQuestions(response);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat soal. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, [filterData]);

  // Fetch soal saat halaman pertama kali dimuat
  useEffect(() => {
    document.title = "Daftar Soal";
    setActiveMenu("soal");
  }, [setActiveMenu]);

  return (
    <PrivateLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white shadow-md rounded-t-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Soal</h1>
          <div className="flex justify-between">
            <p className="text-gray-600 mt-1">
              Pilih filter di bawah untuk melihat soal.
            </p>
            <Link
            to="tambah"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded transition whitespace-nowrap"
          >
            Tambah Soal
          </Link>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row sm:items-end gap-4 justify-between w-full">
            <div className="max-w-3xl grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <FilterElement />
              <button
                onClick={fetchQuestions}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
              >
                Tampilkan
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-3 text-gray-600">Sedang memuat soal...</p>
          </div>
        )}

        {/* Question List */}
        {!loading && questions.length > 0 && (
          <QuestionList questions={questions} />
        )}

        {/* Empty State */}
        {!loading && questions.length === 0 && !error && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg">
              Belum ada soal yang tersedia.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Gunakan filter untuk mencari soal atau tambahkan soal baru.
            </p>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
};

export default DaftarSoal;
