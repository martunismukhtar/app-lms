import { useContext } from "react";
import { UserContext } from "../../context/LayoutContext";

export default function Konfirmasi() {
//   const [confirmed, setConfirmed] = useState(false);

  const {    
    konfirmasi,
    setKonfirmasi
  } = useContext(UserContext);

  const handleConfirm = () => {

    setKonfirmasi(true);    
  };

  if (!konfirmasi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-900  bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full transform transition-all hover:scale-[1.01]">
        {konfirmasi ? (
          <>
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Konfirmasi Aksi</h2>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin melanjutkan dengan tindakan ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setKonfirmasi(false)}
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Ya
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Berhasil!</h2>
            <p className="text-gray-600 mb-6">Aksi Anda telah dikonfirmasi dan berhasil diproses.</p>
            
          </div>
        )}
      </div>
    </div>
  );
}