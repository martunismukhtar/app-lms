import { useNavigate } from "react-router-dom";
import EnrollButton from "../../components/Button/EnrollButton";
import EditButton from "../../components/DataTable/EditButton";
import HapusButton from "../../components/DataTable/HapusButton";
import Konfirmasi from "../../components/Konfirmasi/Index";
import useDeleteMapel from "./useDelete";

const ViewMapel = ({ data = [] }) => {
  const navigate = useNavigate();
  const { isModalOpen, handleDelete, handleOpenDelete, setIsModalOpen } =
    useDeleteMapel();

  const handleEdit = (row) => {
    navigate(`${row.id}/edit`);
  };

  const handleEnroll = (row) => {
    navigate(`${row.id}/enroll`);
  };

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
                  <EditButton
                    onClick={() => handleEdit(item)}
                    className={"bg-transparent px-1"}
                  />
                  <HapusButton
                    onClick={() => handleOpenDelete(item)}
                    className={"bg-transparent px-1"}
                  />
                </div>
              </li>
            </ul>
            <div className="flex gap-2 justify-end items-center">
              <EnrollButton handleClick={() => handleEnroll(item)} />
            </div>
          </div>
        ))}
      </div>

      <Konfirmasi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDelete}
        message={`Yakin ingin menghapus mapel ?`}
      />
    </div>
  );
};
export default ViewMapel;
