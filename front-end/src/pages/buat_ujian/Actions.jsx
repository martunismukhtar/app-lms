import BuatSoal from "../../icons/BuatSoal";
import DetailIcon from "../../icons/Detail";
import LihatSoal from "../../icons/LihatSoal";

export const createActions = (
  handleDetail,
  lihatSoal,
  buatSoal,
  onEdit,
  onDelete
) => [
  {
    label: "Detail",
    onClick: handleDetail,
    className: "text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1 rounded text-sm",
    icon:<DetailIcon />
  },
  {
    label: "Lihat Soal",
    onClick: lihatSoal,
    className: "text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1 rounded text-sm",
    icon:<LihatSoal />
  },
  {
    label: "Buat Soal",
    onClick: buatSoal,
    className: "text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1 rounded text-sm",
    icon:<BuatSoal />
  },
  {
    label: "Edit",
    onClick: onEdit,
    className: "px-3 py-1 rounded text-sm",
  },
  {
    label: "Hapus",
    onClick: onDelete,
    className: "px-3 py-1 rounded text-sm",
  },
];
