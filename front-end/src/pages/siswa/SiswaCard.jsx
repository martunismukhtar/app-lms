import { User, Loader2 } from "lucide-react";

const SiswaCard = ({ data, onDelete }) => {
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

        <div className="flex flex-col flex-1 min-w-0 justify-between h-full">
          <h3 className="font-medium text-gray-900 truncate">{data.nama}</h3>
          <div className="text-sm text-gray-700 mt-1">
            Mata Pelajaran Yang Diikuti:
            <ul className="list-disc list-inside text-gray-600 mt-1">
              {(() => {
                try {
                  // parse string ke array
                  const mapelArray = Array.isArray(data.mapel)
                    ? data.mapel
                    : JSON.parse(data.mapel.replace(/'/g, '"'));

                  return mapelArray.map((m, idx) => (
                    <li key={idx} className="truncate">
                      {m} X
                    </li>
                  ));
                } catch (e) {
                  return <li>{e}</li>;
                }
              })()}
            </ul>
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
