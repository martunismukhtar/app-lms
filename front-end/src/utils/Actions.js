export const createActions = (onEdit, onDelete) => [
  {
    label: "Edit",
    onClick: onEdit,
    className: "cursor-pointer bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm",
  },
  {
    label: "Hapus",
    onClick: onDelete,
    className: "cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm",
  },
];