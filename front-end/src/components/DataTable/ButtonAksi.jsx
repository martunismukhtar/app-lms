import EditButton from "./EditButton";
import HapusButton from "./HapusButton";

const ButtonAksi = ({ label, className, onClick, row, icon=null }) => {
  if (label === "Hapus" || label === "hapus") {
    return <HapusButton className={className} onClick={onClick} row={row} />;
  } else if (label === "Edit" || label === "edit") {
    return <EditButton className={className} onClick={onClick} row={row} />;
  } else {
    return (
      <button
        type="button"
        onClick={() => onClick(row)}
        className={`cursor-pointer px-2 py-1 flex items-center gap-1 text-sm rounded ${
          className || "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {icon} {label}
      </button>
    );
  }
};
export default ButtonAksi;
