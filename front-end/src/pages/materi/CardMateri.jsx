import { Link } from "react-router-dom";

const CardMateri = ({ data = [] }) => {
  return (
    <div className="p-2">
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto m-2">
        {data.map((item) => (
          <div
            key={item.id}
            className="pb-2 bg-white shadow-md overflow-hidden border-b border-gray-200"
          >
            <ul role="list" className="divide-y divide-gray-100">
              <li className="flex justify-between gap-x-6 py-5">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="font-semibold text-gray-900">{item.nama}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      Kelompok : {item.kelompok}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`${item.id}/create`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-0 rounded-md transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Tambah Materi
                  </Link>
                </div>
              </li>
            </ul>
            <div>
              <span>Jumlah Materi : {item.jumlah_materi}</span>
            </div>
            {item.jumlah_materi > 0 && (
              <div className="flex justify-end">
                <Link
                  to={`${item.id}/semua-materi-berdasarkan-mapel`}
                  className="text-black text:underline px-2 py-0 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  Lihat Materi
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default CardMateri;
