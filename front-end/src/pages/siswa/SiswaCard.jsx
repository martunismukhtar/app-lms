import { User } from "lucide-react";
import { useMemo } from "react";

const SiswaCard = ({ data, onDelete }) => {
  // Parsing mapel sekali saja
  const mapelList = useMemo(() => {
    if (!data.mapel) return [];

    try {
      return Array.isArray(data.mapel)
        ? data.mapel
        : JSON.parse(data.mapel.replace(/'/g, '"'));
    } catch (e) {
      console.error("Parsing mapel gagal:", e);
      return [];
    }
  }, [data.mapel]);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border-gray-200">
      <div className="flex items-start">
        {/* Avatar Icon */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-blue-100">
          <User className="w-5 h-5 text-blue-600" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0 justify-between h-full">
          <h3 className="font-medium text-gray-900 truncate">{data.nama}</h3>

          <div className="text-sm text-gray-700 mt-1">
            {mapelList.length === 0 ? (
              <div className="flex gap-1 text-gray-500">
                Belum ada mata pelajaran
              </div>
            ) : (
              <>
                <span>Mata Pelajaran Yang Diikuti:</span>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  {mapelList.map((m, idx) => (
                    <li key={idx} className="truncate">
                      {m}
                      {/* Tombol hapus mapel kalau mau dipakai */}
                      {/* <button className="cursor-pointer ml-2 text-xs text-red-600 hover:underline">
                        X
                      </button> */}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <button
              onClick={() => onDelete(data)}
              className="cursor-pointer text-sm text-red-600 hover:underline"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiswaCard;
