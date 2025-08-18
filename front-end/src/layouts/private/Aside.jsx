import { useContext, useState } from "react";
import { UserContext } from "../../context/LayoutContext";
import { Link } from "react-router-dom";
import { can } from "../../utils/permission"; 

const Aside = () => {
  // const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { activeMenu, setActiveMenu } = useContext(UserContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: "📊" },
    { id: "users", label: "Users", path: "/users", icon: "👥" },
    { id: "organisasi", label: "Organisasi", path: "/organisasi", icon: "👥" },
    { id: "products", label: "Products", path: "/products", icon: "📦" },
    { id: "orders", label: "Orders", path: "/orders", icon: "🛍️" },
    { id: "analytics", label: "Analytics", path: "/analytics", icon: "📈" },
    { id: "settings", label: "Settings", path: "/settings", icon: "⚙️" },
    { id: "materi", label: "Materi", path: "/materi", icon: "📦", access:can('view_materi') },
    { id: "tanya-ai", label: "Tanya AI", path: "/tanya-ai", icon: "⚙️", access:can('view_chatmessage') },
    { id: "soal", label: "Soal", path: "/soal", icon: "⚙️" },
    { id: "buat-soal-manual", label: "Buat Soal Manual", path: "/buat-soal-manual", icon: "⚙️" },
    { id: "ujian", label: "Ujian", path: "/ujian", icon: "⚙️" },
  ];
  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-white shadow-md transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between">
        {isSidebarOpen && (
          <h1 className="text-xl font-bold text-indigo-600">Admin Panel</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-indigo-600"
        >
          {isSidebarOpen ? "«" : "»"}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {menuItems.filter((item) => !item.access || can(item.access)).map((item) => (          
          <Link
            key={item.id}
            to={item.path}
            onClick={() => setActiveMenu(item.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeMenu === item.id
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            {item.access && !can(item.access) && <span className="text-red-500">*</span>}
            {isSidebarOpen && <span>{item.label}</span>}
          </Link>
          
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">

          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
            A
          </div>
          {isSidebarOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
export default Aside;
