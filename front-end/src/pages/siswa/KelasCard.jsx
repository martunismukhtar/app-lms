import { User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const KelasCard = ({ kelas }) => {
  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border-gray-200`}
    >
      <div className="flex items-start">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-blue-100`}
        >
          <User className={`w-5 h-5 text-blue-600`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{kelas.name}</h3>
          <p className="text-sm text-gray-600 truncate">
            Wali Kelas : {kelas.nama_wali_kelas}
          </p>
          <p className="text-sm text-gray-600 truncate">
            Jumlah Siswa : {kelas.jumlah_siswa}
          </p>

          {kelas.jumlah_siswa > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to={`/siswa/${kelas.id}/kelas`}
                className="cursor-pointer text-sm text-blue-600 hover:underline"
              >
                Lihat Siswa
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 bg-gray-300`}></div>
          <div
            className={`w-5 h-5 rounded border flex items-center justify-center border-gray-300`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default KelasCard;
