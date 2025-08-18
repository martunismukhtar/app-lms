export const createActions = (onEdit, onDelete) => [{
    label: "Edit",
    onClick: onEdit,
    className: "px-3 py-1 rounded text-sm",
  }, {
    label: "Hapus",
    onClick: onDelete,
    className: "px-3 py-1 rounded text-sm",
  },
];