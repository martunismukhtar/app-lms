import { useNavigate, useParams } from "react-router-dom";
import PrivateLayout from "../../layouts/private/Index";
import {
  useMapelBerdasarkanId,
  useMateriBerdasarkanMapel,
} from "../../data/Index";
import { useContext, useEffect, useState } from "react";
import { usePdfModal } from "../../hooks/usePdfModal";
import ModalPDF from "../../components/ModalPDF/Index";
import { UserContext } from "../../context/LayoutContext";
import EditButton from "../../components/DataTable/EditButton";
import HapusButton from "../../components/DataTable/HapusButton";
import useDeleteMateri from "./useDelete";
import Konfirmasi from "../../components/Konfirmasi/Index";

const ListMateri = () => {
  const { setActiveMenu } = useContext(UserContext);
  const { mapel_id } = useParams();
   const navigate = useNavigate();
  const { openPdf } = usePdfModal();
  const {
    data: mapelData,
    // isLoading: isMapelLoading,
    // error: mapelError,
  } = useMapelBerdasarkanId(mapel_id);

  const { data: MateriData } = useMateriBerdasarkanMapel(mapel_id);
  const { isModalOpen, handleDelete, handleOpenDelete, setIsModalOpen } =
    useDeleteMateri();
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    document.title = "Materi";
    setActiveMenu("materi");
  }, [setActiveMenu]);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleEdit = (row) => {
    navigate(`/materi/${row.mapel}/${row.id}/edit`);
  };

  return (
    <PrivateLayout>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Daftar Materi Pelajaran{" "}
            {mapelData?.length > 0 ? mapelData[0].nama : ""}
          </h2>
        </div>
        <div className="space-y-4">
          {MateriData?.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <button
                className="cursor-pointer w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset rounded-xl"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openAccordion === index}
              >
                <span className="text-lg font-semibold text-gray-900">
                  {item.title}
                </span>
                <svg
                  className={`h-6 w-6 text-indigo-600 transition-transform duration-300 ${
                    openAccordion === index ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openAccordion === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 border-t border-gray-100">
                  {item.content}
                </div>

                <div className="flex justify-end px-6 pb-6 text-gray-600 border-t border-gray-100">
                  <button
                    className="cursor-pointer"
                    onClick={() => openPdf(item.file)}
                  >
                    Lihat dokumen
                  </button>
                </div>
                <div className="flex justify-end px-6 pb-6 text-gray-600 border-t border-gray-100 gap-2">
                  <EditButton
                    onClick={() => handleEdit(item)}
                    className={"bg-transparent px-1"}
                  />
                  <HapusButton
                    onClick={() => handleOpenDelete(item)}
                    className={"bg-transparent px-1"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Konfirmasi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDelete}
        message={`Yakin ingin menghapus mapel ?`}
      />
      <ModalPDF />
    </PrivateLayout>
  );
};

export default ListMateri;
