import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { usePdfModal } from "../../hooks/usePdfModal";
import ButtonAksi from "./ButtonAksi";

const Tabel = ({ data = [], actions = [], onLoadMore, hasMore }) => {
  const containerRef = useRef(null);
  const { openPdf } = usePdfModal();

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      const nearBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
      if (nearBottom && hasMore && onLoadMore) {
        onLoadMore();
      }
    }
  }, [hasMore, onLoadMore]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const headers = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter((key) => key !== "id");
  }, [data]);

  const renderFileCell = (fileUrl) => (
    <button
      className="cursor-pointer"
      onClick={() => openPdf(fileUrl)}
      title="Lihat PDF"
    >
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 20h9"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M16.5 3A2.5 2.5 0 0119 5.5V8l-3 3V5.5A2.5 2.5 0 0116.5 3z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );

  // if (!data || data.length === 0) return <p className="p-4">Tidak ada data</p>;

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto rounded-lg shadow border border-gray-300"
    >
      {/* Desktop View */}
      <table className="hidden md:table w-full table-auto text-sm md:text-base">
        <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-4 py-2 text-left font-medium">No</th>
            {headers.map((key) => (
              <th key={key} className="text-left px-6 py-4 font-semibold">
                {key.toUpperCase()}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-2 text-center">AKSI</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="hover:bg-blue-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-200">
                {rowIndex + 1}
              </td>
              {headers.map((key) => (
                <td
                  key={key}
                  className="px-6 py-4 text-gray-900 border-b border-gray-200"
                >
                  {key.toLowerCase() === "file" && row[key]
                    ? renderFileCell(row[key])
                    : row[key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-6 py-4 flex flex-wrap justify-center gap-2 border-b border-gray-200">
                  {actions.map((action, actionIndex) => (
                    <ButtonAksi
                      key={actionIndex}
                      label={action.label}
                      className={`cursor-pointer px-3 py-1 text-sm rounded ${
                        action.className ||
                        "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                      onClick={() => action.onClick(row)}
                      icon={action.icon}
                    >
                      {action.label}
                    </ButtonAksi>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View (Card) */}
      <div className="md:hidden space-y-4 p-2">
        {data.map((row, rowIndex) => (
          <div
            key={row.id || rowIndex}
            className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-2"
          >
            <div className="font-semibold text-gray-700">#{rowIndex + 1}</div>
            {headers.map((key) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="font-medium text-gray-500">
                  {key.toUpperCase()}
                </span>
                <span className="text-gray-900">
                  {key.toLowerCase() === "file" && row[key]
                    ? renderFileCell(row[key])
                    : row[key]}
                </span>
              </div>
            ))}
            {actions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                {actions.map((action, actionIndex) => (
                  <ButtonAksi
                    key={actionIndex}
                    label={action.label}
                    className={`cursor-pointer px-3 py-1 text-xs rounded ${
                      action.className ||
                      "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={() => action.onClick(row)}
                    icon={action.icon}
                  >
                    {action.label}
                  </ButtonAksi>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Memuat data...
        </div>
      )}
    </div>
  );
};

export default Tabel;
