import { useContext } from "react";
import {
  Home,
  Users,
  Settings,
  FileText,
  PieChart,
  Mail,
  Calendar,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { UserContext } from "../../context/LayoutContext";
import { Link } from "react-router-dom";
import { can, isAdmin, isManager, isTeacher } from "../../utils/permission";

const NavItem = ({
  icon,
  text,
  active,
  url = "/",
  expanded,
  color = "blue",
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-600",
      hover: "hover:bg-blue-500",
      active: "bg-blue-700",
    },
  };

  return (
    <Link
      to={url}
      className={`flex items-center w-full p-4 cursor-pointer ${
        active ? colorClasses[color].active : colorClasses[color].hover
      } transition-colors duration-200`}
    >
      <div className="flex-shrink-0 text-white">{icon}</div>
      {expanded && <span className="ml-3">{text}</span>}
    </Link>
  );
};

const SidebarComponent = () => {
  const { sidebarOpen, setSidebarOpen, activeMenu } = useContext(UserContext);
 
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      active: activeMenu === "dashboard",
      access:true,
      icon: "📊",
    },
    
    // {
    //   id: "dashboard-siswa",
    //   label: "Dashboard",
    //   path: "/dashboard-siswa",
    //   active: activeMenu === "dashboard-siswa",
    //   access:true,
    //   icon: "📊",
    // },

    {
      id: "users",
      label: "Users",
      active: activeMenu === "users",
      path: "/users",
      icon: "👥",
      access:can("view_user"),
    },
    {
      id: "siswa",
      label: "Siswa",
      active: activeMenu === "siswa",
      path: "/siswa",
      icon: "👥",
      access:can("view_siswa"),
    },
    {
      id: "organisasi",
      active: activeMenu === "organisasi",
      label: "Organisasi",
      path: "/organisasi",
      icon: "👥",
      access: can("view_organization"),
    },
    {
      id: "hak_akses",
      active: activeMenu === "hak-akses",
      label: "Atur Hak Akses",
      path: "/hak-akses",
      icon: "👥",
      access: can("view_hak_akses") || isAdmin(),
    },
    {
      id: "semester",
      active: activeMenu === "semester",
      label: "Semester",
      path: "/semester",
      icon: "👥",
      access:can("view_semester"),
    },
    {
      id: "kelas",
      active: activeMenu === "kelas",
      label: "Kelas",
      path: "/kelas",
      icon: "👥",
      access:isManager(),
    },
    {
      id: "mapel",
      active: activeMenu === "mapel",
      label: "Mata Pelajaran",
      path: "/mapel",
      icon: "📦",
      access: can("view_materi"),
    },
    {
      id: "materi",
      active: activeMenu === "materi",
      label: "Buat Materi",
      path: "/materi",
      icon: "📦",
      access: can("view_materi"),
    },
    // {
    //   id: "materi_siswa",
    //   active: activeMenu === "materi-siswa",
    //   label: "Materi",
    //   path: "/materi-siswa",
    //   icon: "📦",
    //   access: can("view_materi_siswa"),
    // },
    {
      id: "guru",
      active: activeMenu === "guru",
      label: "Guru",
      path: "/guru",
      icon: "⚙️",
      access: can("view_guru"),
    },
    // {
    //   id: "soal",
    //   active: activeMenu === "soal",
    //   label: "Soal",
    //   path: "/soal",
    //   icon: "⚙️",
    //   access: can("view_buat_soal"),
    // },
    {
      id: "buat_ujian",
      active: activeMenu === "buat-ujian",
      label: "Buat Ujian",
      path: "/buat-ujian",
      icon: "⚙️",
      access: isTeacher(),
    },
    // {
    //   id: "ujian",
    //   active: activeMenu === "ujian",
    //   label: "Ujian",
    //   path: "/ujian",
    //   icon: "⚙️",
    //   access: can("view_ikut_ujian"),
    // },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-slate-800 text-white transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {sidebarOpen ? (
          <h1 className="text-xl font-bold">Admin Panel</h1>
        ) : (
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="font-bold">A</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="mt-6">                
        {menuItems
          .filter((item) => item.access)
          .map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              text={item.label}
              active={item.active}
              url={item.path}
              expanded={sidebarOpen}
              color="blue"
            />
          ))}    
      </nav>
    </div>
  );
};
export default SidebarComponent;
