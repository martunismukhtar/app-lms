import { Link } from "react-router-dom";

const SelesaiUjian = ({data}) => {
  // const score = 85; // Contoh nilai ujian
  // const totalQuestions = 40;
  // const correctAnswers = 34;
  // const wrongAnswers = totalQuestions - correctAnswers;

  return (
    <div className="flex items-center justify-center  px-4 py-4">
      <div className="relative z-10 text-center w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all hover:shadow-3xl duration-300">
        
        {/* Icon Checkmark */}
        <div className={`mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full ${data.score >= 75 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Judul */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Ujian telah selesai
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Terima kasih atas partisipasi Anda.
        </p>

        {/* Score Box */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8 transform transition-all duration-300 hover:scale-105">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Nilai Ujian</h2>
          <div className="text-5xl md:text-6xl font-extrabold mb-2">{data.score}</div>
          <p className="text-lg opacity-90">Dari {data.total_soal} soal</p>
        </div>

        {/* Statistik Jawaban */}
        <div className="grid grid-cols-2 gap-4 mb-8 text-center">
          <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow-md">
            <div className="text-3xl font-bold">{data.total_benar}</div>
            <div className="text-sm font-medium">Jawaban Benar</div>
          </div>
          <div className="bg-red-100 text-red-800 p-4 rounded-xl shadow-md">
            <div className="text-3xl font-bold">{data.total_salah}</div>
            <div className="text-sm font-medium">Jawaban Salah</div>
          </div>
        </div>

        {/* Tombol Kembali */}
        <Link
          to="/dashboard-siswa"
          className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105"
        >
          <span>Kembali ke Beranda</span>
          <svg
            className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default SelesaiUjian;