import EnrollMapel from "../../icons/EnrollMapel";

export const createActions = (enrOll, onEdit, onDelete) => [
  {
    label: "Enroll",
    onClick: enrOll,
    className:
      "text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1 rounded text-sm",
    icon: <EnrollMapel />,
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
