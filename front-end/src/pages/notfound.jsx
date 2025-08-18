import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center px-4 text-center">
      {/* Illustration */}
      <div className="w-64 h-64 md:w-80 md:h-80 mb-8 relative animate-bounce">
        <svg
          className="w-full h-full text-indigo-500"
          viewBox="0 0 200 200"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M44.1 -57.2C54.7 -47.4 63.7 -34.9 69.2 -21.4C74.7 -7.9 76.7 6.5 72.8 19.5C68.9 32.5 59.2 44.2 47.5 54.6C35.8 65 22.2 74.2 7.3 76.4C-7.6 78.6 -23.8 73.8 -37.4 64.4C-51 55 -62.1 41 -70.5 25.4C-78.9 9.8 -84.7 -7.4 -79.7 -22.7C-74.7 -38 -58.9 -51.5 -43.8 -61.5C-28.7 -71.5 -14.3 -78 -1.4 -75.8C11.5 -73.6 23 -62.8 34.3 -51.6C45.6 -40.4 56.7 -28.9 44.1 -57.2Z" />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black font-bold text-4xl">
          404
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Maaf, halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition transform hover:-translate-y-1"
      >
        Kembali ke Beranda
      </Link>

      <footer className="mt-12 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} EduRAG. Semua hak dilindungi.
      </footer>
    </div>
  );
}